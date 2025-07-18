/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.marketplace.util.strategy;

import com.liferay.headless.commerce.admin.order.client.dto.v1_0.Order;
import com.liferay.marketplace.util.MarketplaceConsoleProjectContext;

import java.net.URL;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * @author Eduardo Diniz
 */
@Component
public class SolutionsTrialStrategy implements TrialStrategy {

	@Override
	public void configureContext(
		MarketplaceConsoleProjectContext.MarketplaceConsoleProjectContextBuilder
			marketplaceConsoleProjectContextBuilder,
		Order order) {

		marketplaceConsoleProjectContextBuilder.setDomain(
			order.getId() + "." + _trialDXPDomain
		).setExternalHomePageURL(
			_externalTrialHomePageURL
		).setOauthERC(
			"external-trial"
		).setConsoleProjectUid(
			_consoleTrialProjectUid
		).setConsoleProjectPrefix(
			_consoleTrialProjectPrefix
		).setConsoleCluster(
			_consoleTrialCluster
		).setDeployable(
			true
		);
	}

	@Override
	public boolean supports(Order order) {
		return order.getOrderTypeExternalReferenceCode(
		).startsWith(
			"SOLUTIONS"
		);
	}

	@Value("${liferay.marketplace.console.cluster}")
	private String _consoleTrialCluster;

	@Value("${liferay.marketplace.console.project.prefix}")
	private String _consoleTrialProjectPrefix;

	@Value("${liferay.marketplace.console.project.uid}")
	private String _consoleTrialProjectUid;

	@Value("${external.trial.oauth2.headless.server.home.page.url}")
	private URL _externalTrialHomePageURL;

	@Value("${liferay.marketplace.trial.dxp.domain}")
	private String _trialDXPDomain;

}