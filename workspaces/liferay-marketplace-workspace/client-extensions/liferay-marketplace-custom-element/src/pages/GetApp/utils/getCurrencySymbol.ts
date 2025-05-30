/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {currenciesCode} from '../../../utils/currencies';

function getCurrencySymbol(currency: string): string {
	return currenciesCode.find(({code}) => code === currency)?.symbol || '$';
}

export {getCurrencySymbol};
