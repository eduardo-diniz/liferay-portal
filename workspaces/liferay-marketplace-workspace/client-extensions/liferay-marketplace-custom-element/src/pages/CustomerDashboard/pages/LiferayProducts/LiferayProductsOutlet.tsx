/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayButton from '@clayui/button';

import {NavbarProps} from '../../../../components/Navbar';
import {OrderTypes} from '../../../../enums/Order';
import useGetProductByOrderId from '../../../../hooks/useGetProductByOrderId';
import i18n from '../../../../i18n';
import {Liferay} from '../../../../liferay/liferay';
import {getSiteURL} from '../../../../utils/site';
import {BaseOutlet} from '../Apps/App/AppOutlet';

type ProductAndOrderPayload = NonNullable<
	ReturnType<typeof useGetProductByOrderId>['data']
>;

const getTabs = (data: ProductAndOrderPayload): NavbarProps['routes'] => {
	const {orderTypeExternalReferenceCode} = data?.placedOrder ?? {};

	const isCMP = orderTypeExternalReferenceCode === OrderTypes.CMP;
	const isDXP = orderTypeExternalReferenceCode === OrderTypes.DXP;
	const isAIHUB = orderTypeExternalReferenceCode === OrderTypes.AIHUB_BETA;

	return [
		{
			name: i18n.translate('details'),
			path: '',
			visible: !(isCMP || isDXP || isAIHUB),
		},
		{
			name: i18n.translate('activation-keys'),
			path: 'activation-keys',
			visible: isCMP || isDXP,
		},
		{
			name: i18n.translate('bundles'),
			path: 'bundles',
			visible: isDXP,
		},
	];
};

const LiferayProductsOutlet = () => (
	<BaseOutlet
		actionButtons={(props) =>
			[OrderTypes.CMP, OrderTypes.DXP].includes(
				props?.placedOrder?.orderTypeExternalReferenceCode as OrderTypes
			) && (
				<div>
					{props?.placedOrder?.orderTypeExternalReferenceCode ===
						OrderTypes.CMP && (
						<ClayButton
							className="btn-outline-secondary mr-2 mt-6"
							onClick={() => {
								Liferay.Util.navigate(
									`${getSiteURL()}/product-feedback?orderId=${String(props?.placedOrder?.id)}`
								);
							}}
							outline
						>
							{i18n.translate('share-beta-feedback')}
						</ClayButton>
					)}

					<ClayButton
						className="mt-6 new-license-button"
						onClick={() => {
							Liferay.Util.navigate(
								`${getSiteURL()}/product-purchase?productId=${props?.product?.productId}#/activation-key-form`
							);
						}}
						outline
					>
						{i18n.translate('new-activation-key')}
					</ClayButton>
				</div>
			)
		}
		backTitle={i18n.translate('back-to-my-products')}
		backURL="../../products"
		routes={getTabs}
		showActions={false}
	/>
);

export default LiferayProductsOutlet;
