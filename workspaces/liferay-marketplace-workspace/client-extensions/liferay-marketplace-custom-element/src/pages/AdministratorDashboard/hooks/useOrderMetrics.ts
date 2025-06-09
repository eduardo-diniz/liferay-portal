/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {addDays, eachDayOfInterval, format} from 'date-fns';
import useSWR from 'swr';

import SearchBuilder from '../../../core/SearchBuilder';
import {OrderTypes} from '../../../enums/Order';
import HeadlessCommerceAdminOrder from '../../../services/rest/HeadlessCommerceAdminOrder';

export const METRIC_PARAMETER = {
	month: 30,
	q1: 1,
	q2: 2,
	q3: 3,
	q4: 4,
	week: 7,
};

type FilterType = 'month' | 'q1' | 'q2' | 'q3' | 'q4' | 'week';

export const orderSearchBuilder = new SearchBuilder()
	.in('orderTypeExternalReferenceCode', [
		OrderTypes.CLIENT_EXTENSION,
		OrderTypes.CLOUDAPP,
		OrderTypes.COMPOSITE_APP,
		OrderTypes.DXPAPP,
		OrderTypes.LOW_CODE_CONFIGURATION,
		OrderTypes.OTHER,
	])
	.and();

const useOrderMetrics = (param: FilterType) => {
	return useSWR('metrics/order', async () => {
		const currentTime = new Date();

		const beforeLastPeriodDate = addDays(
			currentTime,
			-METRIC_PARAMETER[param] * 2
		);
		const lastPeriodDate = addDays(currentTime, -METRIC_PARAMETER[param]);

		beforeLastPeriodDate.setHours(0, 0, 0);
		lastPeriodDate.setHours(23, 59, 59);

		const filters = {
			allOrders: orderSearchBuilder.clone().build(),

			allPaidOrders: orderSearchBuilder
				.clone()
				.gt('totalAmount', 0)
				.build(),

			beforeLastPeriodOrders: orderSearchBuilder
				.clone()
				.lt('createDate', lastPeriodDate.toISOString())
				.and()
				.gt('createDate', beforeLastPeriodDate.toISOString())
				.build(),

			beforeLastPeriodOrdersPaid: orderSearchBuilder
				.clone()
				.gt('totalAmount', 0)
				.and()
				.lt('createDate', lastPeriodDate.toISOString())
				.and()
				.gt('createDate', beforeLastPeriodDate.toISOString())
				.build(),

			lastPeriodOrders: orderSearchBuilder
				.clone()
				.gt('createDate', lastPeriodDate.toISOString())
				.build(),

			lastPeriodOrdersPaid: orderSearchBuilder
				.clone()
				.gt('totalAmount', 0)
				.and()
				.gt('createDate', lastPeriodDate.toISOString())
				.build(),
		};

		const {
			data: {metrics},
		} = await HeadlessCommerceAdminOrder.getOrdersDashboardMetrics(filters);

		const paidAmount = (metrics.allPaidOrders?.items)
			.filter((order) => order.orderStatus === 0)
			.reduce((sum, order) => sum + (order.totalAmount ?? 0), 0);

		const getCount = (key: keyof typeof metrics) =>
			metrics[key]?.totalCount ?? 0;

		const beforeCount = getCount('beforeLastPeriodOrders');
		const beforePaidCount = getCount('beforeLastPeriodOrdersPaid');
		const lastCount = getCount('lastPeriodOrders');
		const lastPaidCount = getCount('lastPeriodOrdersPaid');

		const growth =
			Number(
				(
					((lastCount - beforeCount) / (beforeCount || 1)) *
					100
				).toFixed(2)
			) || 0;
		const growthPaidOrders =
			Number(
				(
					((lastPaidCount - beforePaidCount) /
						(beforePaidCount || 1)) *
					100
				).toFixed(2)
			) || 0;

		return {
			beforeLastPeriod: beforeCount,
			growth,
			growthPaidOrders,
			lastPeriod: lastCount,
			lastPeriodCountPaid: lastPaidCount,
			paidAmount,
			param,
			totalCount: getCount('allOrders'),
		};
	});
};

const useOrderChartLineMetrics = () => {
	return useSWR('metrics/order/chartline', async () => {
		const currentTime = new Date();

		const beforeLastPeriod = addDays(
			currentTime,
			-METRIC_PARAMETER['week'] * 2
		);

		const lastPeriod = addDays(currentTime, -METRIC_PARAMETER['week']);

		beforeLastPeriod.setHours(0, 0, 0);
		lastPeriod.setHours(23, 59, 59);

		const requestsParams = [
			new URLSearchParams({
				fields: 'id,createDate',
				filter: orderSearchBuilder
					.clone()
					.gt('createDate', lastPeriod.toISOString())
					.build(),
				pageSize: '-1',
			}),
			new URLSearchParams({
				fields: 'id,createDate',
				filter: orderSearchBuilder
					.clone()
					.gt('createDate', beforeLastPeriod.toISOString())
					.and()
					.lt('createDate', lastPeriod.toISOString())
					.build(),
				pageSize: '-1',
			}),
		];

		const lastPeriodDays = eachDayOfInterval({
			end: new Date(),
			start: lastPeriod,
		});

		const beforeLastPeriodDays = eachDayOfInterval({
			end: lastPeriod,
			start: beforeLastPeriod,
		});

		const daysInterval = [lastPeriodDays, beforeLastPeriodDays];

		const response = await Promise.all(
			requestsParams.map((searchParam) =>
				HeadlessCommerceAdminOrder.getOrders(searchParam)
			)
		);

		const metrics = response.map(({items}, index) => {
			const dates = daysInterval[index] as unknown as Date[];

			return {
				dates: dates.map(
					(date) =>
						items.filter(
							(item) =>
								date.getDate() ===
								new Date(item.createDate).getDate()
						).length
				),
				weekDays: dates.map((date) => format(date, 'eeee')),
			};
		});

		return {metrics, response};
	});
};

export {useOrderChartLineMetrics};

export default useOrderMetrics;
