/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import useSWR from 'swr';

import {Liferay} from '../liferay/liferay';
import marketplaceOAuth2 from '../services/oauth/Marketplace';

const usePrices = (product: DeliveryProduct) => {
	const {data: price} = useSWR<RegionalPrices>(
		`/product-price/${product.id}/${Liferay.CommerceContext.currency.currencyCode}`,
		() => marketplaceOAuth2.getPrices(product.productId)
	);

	if (!price) {
		return undefined;
	}

	return {
		developer: price.developer,
		standard: price.standard,
	};
};

export default usePrices;
