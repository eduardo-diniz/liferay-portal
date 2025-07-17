/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.marketplace.util;

import com.liferay.headless.commerce.admin.order.client.dto.v1_0.Order;
import com.liferay.marketplace.service.MarketplaceService;

import java.net.URL;

import java.util.Map;
import java.util.Objects;

import org.json.JSONObject;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;

/**
 * @author Eduardo Diniz
 */
public class MarketplaceConsoleProjectContext {

	public MarketplaceConsoleProjectContext(
			MarketplaceService marketplaceService, long orderId,
			String trialDXPDomain, String ssaTrialDXPDomain,
			URL externalTrialHomePageURL, URL externalSSAHomePageURL,
			String consoleTrialProjectUid, String consoleSSAProjectUid,
			String consoleTrialProjectPrefix, String consoleSSAProjectPrefix,
			String consoleTrialCluster, String consoleSSACluster)
		throws Exception {

		Order order = marketplaceService.getOrder(orderId);

		if (Objects.equals(
				order.getOrderTypeExternalReferenceCode(), "SSA_SAAS")) {

			Map<String, String> customFields =
				(Map<String, String>)order.getCustomFields();

			String projectId = new JSONObject(
				customFields.getOrDefault("trial-settings", "{}")
			).optJSONObject(
				"ssaSettings"
			).optString(
				"projectId", ""
			);

			_consoleProjectUid = consoleSSAProjectUid;
			_consoleProjectPrefix = consoleSSAProjectPrefix;
			_consoleCluster = consoleSSACluster;
			_deployable = false;
			_domain = projectId + "." + ssaTrialDXPDomain;
			_externalHomePageURL = externalSSAHomePageURL;
			_oauthERC = "external-ssa";
		}
		else if ((order.getOrderTypeExternalReferenceCode() != null) &&
				 order.getOrderTypeExternalReferenceCode(
				 ).startsWith(
					 "SOLUTIONS"
				 )) {

			_externalHomePageURL = externalTrialHomePageURL;

			_consoleProjectUid = consoleTrialProjectUid;
			_consoleProjectPrefix = consoleTrialProjectPrefix;
			_consoleCluster = consoleTrialCluster;
			_deployable = true;
			_domain = orderId + "." + trialDXPDomain;
			_oauthERC = "external-trial";
		}
		else {
			throw new IllegalArgumentException(
				"Unsupported orderType: " +
					order.getOrderTypeExternalReferenceCode());
		}
	}

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

			return new MarketplaceConsoleProjectContext(
				_marketplaceService, orderId, _trialDXPDomain,
				_ssaTrialDXPDomain, _externalTrialHomePageURL,
				_externalSSAHomePageURL, _consoleTrialProjectUid,
				_consoleSSAProjectUid, _consoleTrialProjectPrefix,
				_consoleSSAProjectPrefix, _consoleTrialCluster,
				_consoleSSACluster);
		}

		@Value("${liferay.marketplace.console.ssa.cluster}")
		private String _consoleSSACluster;

		@Value("${liferay.marketplace.console.ssa.project.prefix}")
		private String _consoleSSAProjectPrefix;

		@Value("${liferay.marketplace.console.ssa.project.uid}")
		private String _consoleSSAProjectUid;

		@Value("${liferay.marketplace.console.cluster}")
		private String _consoleTrialCluster;

		@Value("${liferay.marketplace.console.project.prefix}")
		private String _consoleTrialProjectPrefix;

		@Value("${liferay.marketplace.console.project.uid}")
		private String _consoleTrialProjectUid;

		@Value("${external.ssa.oauth2.headless.server.home.page.url}")
		private URL _externalSSAHomePageURL;

		@Value("${external.trial.oauth2.headless.server.home.page.url}")
		private URL _externalTrialHomePageURL;

		@Autowired
		@Lazy
		private MarketplaceService _marketplaceService;

		@Value("${liferay.marketplace.ssa.dxp.domain}")
		private String _ssaTrialDXPDomain;

		@Value("${liferay.marketplace.trial.dxp.domain}")
		private String _trialDXPDomain;

	}

	private final String _consoleCluster;
	private final String _consoleProjectPrefix;
	private final String _consoleProjectUid;
	private final boolean _deployable;
	private final String _domain;
	private final URL _externalHomePageURL;
	private final String _oauthERC;

}