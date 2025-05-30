/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayIcon from '@clayui/icon';

import './index.scss';

import ClayButton from '@clayui/button';
import useSWR from 'swr';

import infoCircleFullIcon from '../../../../../assets/icons/icon_info_circle_full.svg';
import useCart from '../../../../../hooks/useCart';
import usePrices from '../../../../../hooks/usePrices';
import i18n from '../../../../../i18n';
import {Liferay} from '../../../../../liferay/liferay';
import {formatCurrency} from '../../../../../utils/currencies';
import {useGetAppContext} from '../../../GetAppContextProvider';
import {getProductBasePriceAndTrial} from '../../../GetAppOutlet';

const MAX_ITEM = 99;
const MIN_ITEM = 0;

type LicenseSectorCardProps = {
	cartUtil: ReturnType<typeof useCart>;
	licenseDescription: string;
	licensetiers: {
		skuId: number;
		tierPrice: TierPrice[];
	}[];
	lisenceType: string;
	productId?: number;
	sku: DeliverySKU;
};
const LicenseSectorCard: React.FC<LicenseSectorCardProps> = ({
	cartUtil,
	licenseDescription,
	lisenceType = '',
	productId,
	sku,
}) => {
	const count =
		cartUtil.cartItems.find((item) => item.skuId === sku.id)?.quantity ||
		MIN_ITEM;

	const [{product}] = useGetAppContext();

	const prices = usePrices(product);

	const {data: productPrice} = useSWR(`/product-price/${product?.id}`, () =>
		getProductBasePriceAndTrial(product, false, prices)
	);

	const tierPricesMap = productPrice?.prices as RegionalPrices | undefined;

	const tierPriceText = (
		minimumQuantity: number,
		price: number,
		index: number,
		keys: number[]
	) => {
		const minPriceLicenseOption = index === keys.length - 1;
		const nextMinQty = keys[index + 1] || 0;

		const quantityText =
			minPriceLicenseOption || minimumQuantity === nextMinQty - 1
				? `${minimumQuantity}+ ${i18n.translate('licenses')}:`
				: `${minimumQuantity}-${nextMinQty - 1} ${i18n.translate('licenses')}:`;

		const tierPriceValue = `${formatCurrency(price, Liferay.CommerceContext.currency.currencyCode)} ${i18n.translate('each')}`;

		return `${quantityText} ${tierPriceValue}`;
	};

	const licenseKey = lisenceType.toLowerCase() as keyof RegionalPrices;

	const licensePrices = (tierPricesMap?.[licenseKey] ?? {}) as {
		[minimumQuantity: number]: number;
	};

	const tierKeys = Object.keys(licensePrices)
		.map(Number)
		.sort((a, b) => a - b);

	return (
		<div>
			{!!tierKeys.length && (
				<div className="license__card p-3">
					<div className="align-items-center d-flex justify-content-between w-100">
						<span>
							<div className="mb-1">
								<span className="font-weight-bold text-capitalize">
									{`${lisenceType} ${i18n.translate('license')}`}
								</span>
								<span className="license__card__icon ml-3">
									{lisenceType.toLowerCase() ===
									'standard' ? (
										<img
											alt="Info"
											src={infoCircleFullIcon}
										/>
									) : (
										<ClayIcon symbol="code" />
									)}
								</span>
							</div>
							<div>
								<p className="license__card__text mb-0">
									{licenseDescription}
								</p>
							</div>
						</span>
						<div className="align-items-center d-flex justify-content-between license__card__buttons__container p-1">
							<ClayButton
								aria-label="Remove from Cart"
								className="align-items-center d-flex justify-content-center license__card__buttons p-2"
								disabled={count === MIN_ITEM}
								displayType="primary"
								onClick={() => cartUtil.removeFromCart(sku.id)}
							>
								<ClayIcon
									aria-label="Divider"
									className="license__card__buttons__icon"
									symbol="hr"
								/>
							</ClayButton>

							<span className="d-flex justify-content-center license__card__buttons__container__count">
								{count}
							</span>

							<ClayButton
								aria-label="Add To Cart"
								className="align-items-center d-flex justify-content-center license__card__buttons p-2"
								disabled={count === MAX_ITEM}
								displayType="primary"
								onClick={() =>
									cartUtil.addCart(Number(productId), sku.id)
								}
							>
								<ClayIcon
									aria-label="Plus Button"
									className="license__card__buttons__icon"
									symbol="plus"
								/>
							</ClayButton>
						</div>
					</div>

					<div className="d-flex flex-column license__card__tier mt-4 p-4">
						<div className="font-weight-bold license__card__tier__title mb-1">
							{i18n.translate('license-prices')}
						</div>

						{!!tierKeys.length &&
							tierKeys.map((minQty, index) => (
								<span
									className="license__card__tier__price__text"
									key={minQty}
								>
									{tierPriceText(
										minQty,
										licensePrices[minQty],
										index,
										tierKeys
									)}
								</span>
							))}
					</div>
				</div>
			)}
		</div>
	);
};

export default LicenseSectorCard;
