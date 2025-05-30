/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

export default function normalizeTierPrices(
	standardPrices: Array<{
		price: number;
		priceFormatted: string;
		quantity: number;
	}>,
	developerPrices?: Array<{
		price: number;
		priceFormatted: string;
		quantity: number;
	}>
): RegionalPrices {
	const result: RegionalPrices = {
		basePrice: undefined,
		basePriceFormated: undefined,
		developer: {},
		standard: {},
	};

	standardPrices.forEach((item) => {
		const {price, priceFormatted, quantity} = item;

		result.standard![quantity] = price;

		if (quantity === 1) {
			result.basePrice = price;
			result.basePriceFormated = priceFormatted;
		}
	});

	if (developerPrices) {
		developerPrices.forEach((item) => {
			const {price, quantity} = item;
			result.developer![quantity] = price;
		});
	}
	else {
		result.developer = undefined;
	}

	return result;
}
