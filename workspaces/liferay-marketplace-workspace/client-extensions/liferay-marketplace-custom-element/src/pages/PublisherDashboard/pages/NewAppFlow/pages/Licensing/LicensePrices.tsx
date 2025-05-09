/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {useModal} from '@clayui/core';

import {useNewAppContext} from '../../../../../../context/NewAppContext';
import {ProductType} from '../../../../../../enums/Product';
import LicensePricePanel from '../../components/LicensePricePanel/LicensePricePanel';
import CurrencyModal from './components/CurrencyModal';

import './LicensePrices.scss';
import {currenciesCode} from '../../../../../../utils/currencies';
import IconButton from '../../components/IconButton';

const LicensePrices = () => {
	const [
		{
			build: {appType},
			licensing: {prices},
		},
	] = useNewAppContext();

	const modal = useModal();

	return (
		<div className="informing-licensing-terms-page-container">
			<div className="p-4">
				{Object.entries(prices).map(([currencyCode, tierPrices]) => (
					<div key={currencyCode}>
						<LicensePricePanel
							cloudCompatible={appType === ProductType.CLOUD}
							currencyCode={currencyCode}
							tierPrices={tierPrices}
						/>
					</div>
				))}

				{Object.keys(prices).length < currenciesCode.length && (
					<IconButton
						className="add-currency-button btn-primary w-100"
						displayType={null}
						onClick={() => modal.onOpenChange(true)}
					>
						Add Currency
					</IconButton>
				)}
			</div>

			{modal.open && <CurrencyModal {...modal} />}
		</div>
	);
};

export default LicensePrices;
