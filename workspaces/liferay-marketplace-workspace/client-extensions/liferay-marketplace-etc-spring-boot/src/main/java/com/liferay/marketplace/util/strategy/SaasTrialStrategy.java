/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.marketplace.util.strategy;

import com.liferay.headless.commerce.admin.order.client.dto.v1_0.Order;
import com.liferay.marketplace.util.MarketplaceConsoleProjectContext;

import java.net.URL;

import java.util.Map;
import java.util.Objects;

import org.json.JSONObject;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * @author Eduardo Diniz
 */
@Component
public class SaasTrialStrategy implements TrialStrategy {

	@Override
	public void configureContext(
		MarketplaceConsoleProjectContext.MarketplaceConsoleProjectContextBuilder
			marketplaceConsoleProjectContextBuilder,
		Order order) {

		Map<String, String> customFields =
			(Map<String, String>)order.getCustomFields();

		JSONObject trialSettingsJSONObject = new JSONObject(
			customFields.getOrDefault("trial-settings", "{}"));

		JSONObject ssaSettingsJSONObject =
			trialSettingsJSONObject.optJSONObject("ssaSettings");

		String projectId = (ssaSettingsJSONObject != null) ?
			ssaSettingsJSONObject.optString("projectId", "") : "";

		marketplaceConsoleProjectContextBuilder.setDomain(
			projectId + "." + _ssaTrialDXPDomain
		).setExternalHomePageURL(
			_externalSSAHomePageURL
		).setOauthERC(
			"external-ssa"
		).setConsoleProjectUid(
			_consoleSSAProjectUid
		).setConsoleProjectPrefix(
			_consoleSSAProjectPrefix
		).setConsoleCluster(
			_consoleSSACluster
		).setDeployable(
			false
		);
	}

	@Override
	public boolean supports(Order order) {
		return Objects.equals(
			order.getOrderTypeExternalReferenceCode(), "SSA_SAAS");
	}

	@Value("${liferay.marketplace.console.ssa.cluster}")
	private String _consoleSSACluster;

	@Value("${liferay.marketplace.console.ssa.project.prefix}")
	private String _consoleSSAProjectPrefix;

	@Value("${liferay.marketplace.console.ssa.project.uid}")
	private String _consoleSSAProjectUid;

	@Value("${external.ssa.oauth2.headless.server.home.page.url}")
	private URL _externalSSAHomePageURL;

	@Value("${liferay.marketplace.ssa.dxp.domain}")
	private String _ssaTrialDXPDomain;

}