/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {Liferay} from '../../../liferay/liferay';
import {formatCurrency} from '../../../utils/currencies';
import {useGetAppContext} from '../GetAppContextProvider';
import {GetAppStepTypes} from '../enums/GetAppStepTypes';
import {getCurrencySymbol} from '../utils/getCurrencySymbol';

const ProductHeaderPrice: React.FC<ProductBasePriceAndTrial> = ({
	basePrice,
	trialSku,
}) => {
	const [
		{
			currentStep,
			license: {cart, type},
			steps,
		},
	] = useGetAppContext();
	const _currentStep = steps[currentStep];

	if (
		_currentStep.id === GetAppStepTypes.LICENSES ||
		_currentStep.id === GetAppStepTypes.PAYMENT
	) {
		return (
			<span className="price-text-value">
				{cart?.id && type !== 'TRIAL'
					? `${cart.summary.totalFormatted}`
					: `${getCurrencySymbol(Liferay.CommerceContext.currency.currencyCode)} 0`}
			</span>
		);
	}
	if (basePrice) {
		if (trialSku) {
			return (
				<span>
					30-day trial or{' '}
					{formatCurrency(
						basePrice,
						Liferay.CommerceContext.currency.currencyCode
					) ?? basePrice?.toString()}
				</span>
			);
		}

		return (
			<span>
				{formatCurrency(
					basePrice,
					Liferay.CommerceContext.currency.currencyCode
				)}
			</span>
		);
	}

	return <span className="price-text-value">Free</span>;
};

export default ProductHeaderPrice;
