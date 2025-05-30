/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {Liferay} from '../../liferay/liferay';
import {MarketplaceSpringBootOAuth2} from './OAuth2Client';
import {RegionalPrices} from './types';

class MarketplaceOAuth2 extends MarketplaceSpringBootOAuth2 {
	async getPrices(productId: number) {
		return this.get<RegionalPrices>(
			`/product/${productId}/prices?currencyCode=${Liferay.CommerceContext.currency.currencyCode}`,
			{earlyReturn: true}
		);
	}
}

const marketplaceOAuth2 = new MarketplaceOAuth2('/marketplace');

export default marketplaceOAuth2;
