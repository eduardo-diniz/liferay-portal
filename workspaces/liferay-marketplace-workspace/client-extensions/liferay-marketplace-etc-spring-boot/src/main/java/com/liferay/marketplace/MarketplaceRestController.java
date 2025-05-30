/**
 * SPDX-FileCopyrightText: (c) 2024 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.marketplace;

import com.liferay.client.extension.util.spring.boot3.BaseRestController;
import com.liferay.headless.admin.user.client.dto.v1_0.Account;
import com.liferay.headless.admin.user.client.resource.v1_0.AccountResource;
import com.liferay.headless.commerce.admin.catalog.client.dto.v1_0.Currency;
import com.liferay.headless.commerce.admin.catalog.client.dto.v1_0.Product;
import com.liferay.headless.commerce.admin.catalog.client.dto.v1_0.Sku;
import com.liferay.headless.commerce.admin.catalog.client.resource.v1_0.SkuResource;
import com.liferay.headless.commerce.admin.order.client.dto.v1_0.Order;
import com.liferay.headless.commerce.admin.order.client.dto.v1_0.OrderItem;
import com.liferay.headless.commerce.admin.order.client.pagination.Page;
import com.liferay.headless.commerce.admin.order.client.pagination.Pagination;
import com.liferay.headless.commerce.admin.pricing.client.dto.v2_0.PriceList;
import com.liferay.headless.commerce.admin.pricing.client.dto.v2_0.TierPrice;
import com.liferay.marketplace.constants.MarketplaceConstants;
import com.liferay.marketplace.service.KoroneikiService;
import com.liferay.marketplace.service.MarketplaceService;
import com.liferay.marketplace.util.MarketplaceUtil;
import com.liferay.petra.string.StringBundler;
import com.liferay.portal.kernel.util.HashMapBuilder;
import com.liferay.portal.kernel.util.LocaleUtil;

import java.math.BigDecimal;

import java.net.URL;

import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import org.json.JSONObject;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author Keven Leone
 */
@RequestMapping("/marketplace")
@RestController
public class MarketplaceRestController extends BaseRestController {

	@GetMapping("/product/{productId}/prices")
	public Map<String, Object> getTierPricesByProductId(
			@PathVariable Long productId,
			@RequestParam(defaultValue = "USD") String currencyCode)
		throws Exception {

		Product product = _marketplaceService.getProduct(productId);

		PriceList priceList = _marketplaceService.getPriceListIdsByCatalogName(
			_marketplaceService.getCatalog(
				product.getCatalogId()
			).getName(),
			currencyCode);

		SkuResource skuResource = _marketplaceService.getSkuResource();

		Collection<Sku> skus = skuResource.getProductIdSkusPage(
			productId,
			com.liferay.headless.commerce.admin.catalog.client.pagination.
				Pagination.of(1, 50)
		).getItems();

		Map<String, Object> map = new HashMap<>();

		Currency currency = _marketplaceService.getCurrency(currencyCode);

		for (String skuOptionValue : new String[] {"developer", "standard"}) {
			Long skuId = _marketplaceService.getSkuIdBySkuOptionValue(
				skus, skuOptionValue);

			Collection<TierPrice> tierPrice =
				_marketplaceService.getTierPricesByPriceEntryId(
					_marketplaceService.getPriceEntriesBySkuId(
						priceList.getId(), skuId));

			map.put(
				skuOptionValue,
				_getTierPriceValues(
					currency, currencyCode, priceList, tierPrice));
		}

		return map;
	}

	@PostMapping("product/purchase")
	public void postProductPurchase(
			@AuthenticationPrincipal Jwt jwt, @RequestBody String json)
		throws Exception {

		if (_log.isInfoEnabled()) {
			_log.info("POST product purchase " + json);
		}

		JSONObject jsonObject = new JSONObject(json);

		JSONObject commerceOrderJSONObject = jsonObject.getJSONObject(
			"commerceOrder");

		int paymentStatus = commerceOrderJSONObject.getInt("paymentStatus");

		if ((paymentStatus !=
				MarketplaceConstants.ORDER_PAYMENT_STATUS_COMPLETED) &&
			(paymentStatus !=
				MarketplaceConstants.ORDER_PAYMENT_STATUS_NOT_REQUIRED)) {

			if (_log.isInfoEnabled()) {
				_log.info(
					"Skipping POST product purchase for order " +
						commerceOrderJSONObject.getLong("id") +
							" because payment status is not completed");
			}

			return;
		}

		Order order = _marketplaceService.getOrder(
			commerceOrderJSONObject.getLong("id"));

		_marketplaceService.updateOrder(
			null, order.getId(), MarketplaceConstants.ORDER_STATUS_PROCESSING);

		Page<OrderItem> orderItemPage =
			_marketplaceService.getOrderItemResource(
			).getOrderIdOrderItemsPage(
				order.getId(), Pagination.of(1, 10)
			);

		if (Objects.equals(
				order.getOrderTypeExternalReferenceCode(),
				"CLIENT_EXTENSION") ||
			Objects.equals(
				order.getOrderTypeExternalReferenceCode(), "CLOUDAPP")) {

			_setUpCloudProductPurchase(order, orderItemPage);
		}

		if (Objects.equals(
				order.getOrderTypeExternalReferenceCode(), "COMPOSITE_APP") ||
			Objects.equals(
				order.getOrderTypeExternalReferenceCode(),
				"LOW_CODE_CONFIGURATION") ||
			Objects.equals(
				order.getOrderTypeExternalReferenceCode(), "OTHER")) {

			_marketplaceService.updateOrder(
				null, order.getId(),
				MarketplaceConstants.ORDER_STATUS_COMPLETED);
		}

		if (Objects.equals(
				order.getOrderTypeExternalReferenceCode(), "DXPAPP")) {

			_setUpDxpProductPurchase(jwt, order, orderItemPage);
		}
	}

	@PostMapping("product/submit")
	public void postProductSubmit(
			@AuthenticationPrincipal Jwt jwt, @RequestBody String json)
		throws Exception {

		if (_log.isInfoEnabled()) {
			_log.info("POST product submit " + json);
		}

		JSONObject jsonObject = new JSONObject(json);

		JSONObject modelCPDefinitionJSONObject = jsonObject.getJSONObject(
			"modelCPDefinition");

		Product product = _marketplaceService.getProduct(
			modelCPDefinitionJSONObject.getLong("CProductId"));

		_marketplaceService.postNotificationQueueEntry(
			"marketplace-admin@liferay.com",
			"MARKETPLACE-PRODUCT-SUBMIT-TEMPLATE",
			new HashMapBuilder<String, Object>().put(
				"[%CPDEFINITION_NAME%]",
				product.getName(
				).get(
					modelCPDefinitionJSONObject.getString("defaultLanguageId")
				)
			).put(
				"[%CPDEFINITION_THUMBNAIL%]",
				new URL(
					"http://" + lxcDXPMainDomain + product.getThumbnail()
				).toString()
			).put(
				"[%CPDEFINITION_DEVELOPER_NAME%]",
				_marketplaceService.getCatalog(
					product.getCatalogId()
				).getName()
			).put(
				"[%CPDEFINITION_URL%]",
				new URL(
					StringBundler.concat(
						lxcDXPServerProtocol, "://", lxcDXPMainDomain,
						"/web/marketplace/administrator-dashboard#/apps/",
						modelCPDefinitionJSONObject.getLong("CPDefinitionId"))
				).toString()
			).put(
				"[%CPDEFINITION_CREATEDATE%]",
				ZonedDateTime.ofInstant(
					product.getCreateDate(
					).toInstant(),
					ZoneOffset.UTC
				).format(
					DateTimeFormatter.ofPattern(
						"MMMM d, yyyy", LocaleUtil.ENGLISH)
				)
			).build());
	}

	private Map<String, Double> _getTierPriceValues(
		Currency currency, String currencyCode, PriceList priceList,
		Collection<TierPrice> tierPrices) {

		Map<String, Double> map = new HashMap<>();

		for (TierPrice tierPrice : tierPrices) {
			BigDecimal originalPrice = BigDecimal.valueOf(tierPrice.getPrice());

			BigDecimal price = originalPrice.multiply(currency.getRate());

			if (Objects.equals(priceList.getCurrencyCode(), currencyCode)) {
				price = originalPrice;
			}

			map.put(
				String.valueOf(tierPrice.getMinimumQuantity()),
				price.doubleValue());
		}

		return map;
	}

	private void _setUpCloudProductPurchase(
			Order order, Page<OrderItem> orderItemPage)
		throws Exception {

		Map<String, String> customFields =
			(Map<String, String>)order.getCustomFields();

		customFields.put(
			"cloud-provisioning",
			MarketplaceUtil.createCloudProvisioningJSONArray(
				orderItemPage
			).toString());

		_marketplaceService.updateOrder(
			customFields, order.getId(),
			MarketplaceConstants.ORDER_STATUS_COMPLETED);
	}

	private void _setUpDxpProductPurchase(
			Jwt jwt, Order order, Page<OrderItem> orderItemPage)
		throws Exception {

		SkuResource skuResource = _marketplaceService.getSkuResource();

		Map<String, String> productSpecificationsMap =
			_marketplaceService.getProductSpecificationsMap(
				skuResource.getSku(
					orderItemPage.fetchFirstItem(
					).getSkuId()
				).getProductId());

		if (Objects.equals(
				productSpecificationsMap.get("price-model"), "Free")) {

			_marketplaceService.updateOrder(
				null, order.getId(),
				MarketplaceConstants.ORDER_STATUS_COMPLETED);

			return;
		}

		AccountResource accountResource =
			_marketplaceService.getAccountResource();

		Account account = accountResource.getAccount(order.getAccountId());

		if (!account.getExternalReferenceCode(
			).startsWith(
				"KOR-"
			)) {

			account.setExternalReferenceCode(
				() -> _koroneikiService.postKoroneikiAccount(
					account, jwt
				).getKey());

			accountResource.patchAccount(account.getId(), account);
		}

		try {
			for (OrderItem orderItem : orderItemPage.getItems()) {
				_koroneikiService.postAccountAccountKeyProductPurchase(
					account, jwt,
					_marketplaceService.getSkuOptionValue(
						"dxp-license-usage-type", orderItem.getOptions()),
					orderItem, productSpecificationsMap);
			}

			_marketplaceService.updateOrder(
				null, order.getId(),
				MarketplaceConstants.ORDER_STATUS_COMPLETED);
		}
		catch (Exception exception) {
			_log.error("Unable to create account product purchase", exception);
		}
	}

	private static final Log _log = LogFactory.getLog(
		MarketplaceRestController.class);

	@Autowired
	private KoroneikiService _koroneikiService;

	@Autowired
	private MarketplaceService _marketplaceService;

}