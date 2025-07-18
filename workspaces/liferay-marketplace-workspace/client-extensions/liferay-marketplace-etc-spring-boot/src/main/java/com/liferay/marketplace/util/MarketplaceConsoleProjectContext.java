/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.marketplace.util;

import com.liferay.headless.commerce.admin.order.client.dto.v1_0.Order;
import com.liferay.marketplace.service.MarketplaceService;
import com.liferay.marketplace.util.strategy.TrialStrategy;
import com.liferay.petra.string.StringBundler;

import java.net.URL;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;

/**
 * @author Eduardo Diniz
 */
public class MarketplaceConsoleProjectContext {

	public String getConsoleCluster() {
		return _consoleCluster;
	}

	public String getConsoleProjectPrefix() {
		return _consoleProjectPrefix;
	}

	public String getConsoleProjectUid() {
		return _consoleProjectUid;
	}

	public String getDomain() {
		return _domain;
	}

	public URL getExternalHomePageURL() {
		return _externalHomePageURL;
	}

	public String getOauthERC() {
		return _oauthERC;
	}

	public Boolean isDeployable() {
		return _deployable;
	}

	@Component
	public static class Factory {

		public MarketplaceConsoleProjectContext create(long orderId)
			throws Exception {

			Order order = _marketplaceService.getOrder(orderId);

			for (TrialStrategy trialStrategy : _trialStrategy) {
				if (trialStrategy.supports(order)) {
					MarketplaceConsoleProjectContextBuilder
						marketplaceConsoleProjectContextBuilder =
							new MarketplaceConsoleProjectContextBuilder();

					trialStrategy.configureContext(
						marketplaceConsoleProjectContextBuilder, order);

					return marketplaceConsoleProjectContextBuilder.build();
				}
			}

			throw new IllegalArgumentException(
				StringBundler.concat(
					"Unsupported orderType: ",
					order.getOrderTypeExternalReferenceCode(), " | Order ID: ",
					orderId));
		}

		@Autowired
		@Lazy
		private MarketplaceService _marketplaceService;

		@Autowired
		private List<TrialStrategy> _trialStrategy;

	}

	public static class MarketplaceConsoleProjectContextBuilder {

		public MarketplaceConsoleProjectContext build() {
			return new MarketplaceConsoleProjectContext(
				_consoleCluster, _consoleProjectPrefix, _consoleProjectUid,
				_deployable, _domain, _externalHomePageURL, _oauthERC);
		}

		public MarketplaceConsoleProjectContextBuilder setConsoleCluster(
			String value) {

			_consoleCluster = value;

			return this;
		}

		public MarketplaceConsoleProjectContextBuilder setConsoleProjectPrefix(
			String value) {

			_consoleProjectPrefix = value;

			return this;
		}

		public MarketplaceConsoleProjectContextBuilder setConsoleProjectUid(
			String value) {

			_consoleProjectUid = value;

			return this;
		}

		public MarketplaceConsoleProjectContextBuilder setDeployable(
			boolean value) {

			_deployable = value;

			return this;
		}

		public MarketplaceConsoleProjectContextBuilder setDomain(String value) {
			_domain = value;

			return this;
		}

		public MarketplaceConsoleProjectContextBuilder setExternalHomePageURL(
			URL value) {

			_externalHomePageURL = value;

			return this;
		}

		public MarketplaceConsoleProjectContextBuilder setOauthERC(
			String value) {

			_oauthERC = value;

			return this;
		}

		private String _consoleCluster;
		private String _consoleProjectPrefix;
		private String _consoleProjectUid;
		private boolean _deployable;
		private String _domain;
		private URL _externalHomePageURL;
		private String _oauthERC;

	}

	private MarketplaceConsoleProjectContext(
		String consoleCluster, String consoleProjectPrefix,
		String consoleProjectUid, boolean deployable, String domain,
		URL externalHomePageURL, String oauthERC) {

		_consoleCluster = consoleCluster;
		_consoleProjectPrefix = consoleProjectPrefix;
		_consoleProjectUid = consoleProjectUid;
		_deployable = deployable;
		_domain = domain;
		_externalHomePageURL = externalHomePageURL;
		_oauthERC = oauthERC;
	}

	private final String _consoleCluster;
	private final String _consoleProjectPrefix;
	private final String _consoleProjectUid;
	private final boolean _deployable;
	private final String _domain;
	private final URL _externalHomePageURL;
	private final String _oauthERC;

}