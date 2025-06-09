/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import fetcher from '../fetcher';

type Metrics = {
	[key: string]: {
		items: Order[];
		totalCount: number;
	};
};

export default class HeadlessCommerceAdminOrder {
	static deleteOrder(orderId: number | string) {
		return fetcher.delete(
			`o/headless-commerce-admin-order/v1.0/orders/${orderId}`
		);
	}

	static getOrders(searchParams = new URLSearchParams()) {
		return fetcher<APIResponse>(
			`o/headless-commerce-admin-order/v1.0/orders?${searchParams.toString()}`
		);
	}

	static async getOrdersDashboardMetrics(filters: Record<string, string>) {
		const orderQueries = Object.entries(filters)
			.map(([alias, filter]) => {
				return `${alias}: orders(filter: "${filter}", pageSize: 1) {
					items {
						orderStatus
						totalAmount
				 	}
					totalCount
				}`;
			})
			.join('\n');

		const query = `
		{
			metrics: headlessCommerceAdminOrder_v1_0 {
				${orderQueries}
			}
		}
		`;

		try {
			const response = await fetcher.post<{
				data: {
					metrics: Metrics;
				};
			}>(`/o/graphql`, {query});

			return response;
		}
		catch {
			const metrics: Metrics = {};
			for (const key in filters) {
				metrics[key] = {items: [], totalCount: 0};
			}

			return {
				data: {
					metrics,
				},
			};
		}
	}
}
