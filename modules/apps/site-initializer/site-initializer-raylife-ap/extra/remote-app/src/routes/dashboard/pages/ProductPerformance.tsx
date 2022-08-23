/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * This library is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Lesser General Public License as published by the Free
 * Software Foundation; either version 2.1 of the License, or (at your option)
 * any later version.
 *
 * This library is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more
 * details.
 */

import ClayButton from '@clayui/button';
import ClayChart from '@clayui/charts';
import {ClaySelect} from '@clayui/form';
import ClayIcon from '@clayui/icon';
import classNames from 'classnames';
import {useEffect, useRef, useState} from 'react';

import Header from '../../../common/components/header';
import ProductList, {
	ProductCell,
} from '../../../common/components/product-list';
import {getPoliciesForSalesGoal, getSalesGoal} from '../../../common/services';
import {
	currentDateString,
	december,
	january,
} from '../../../common/utils/dateFormatter';

const PERIOD = {
	SIX_MONTH: '2',
	THREE_MONTH: '1',
	YTD: '3',
};

const TIME_PERIODS = [
	{
		label: '3 MO',
		padding: 30,
		value: PERIOD.THREE_MONTH,
		width: 20,
	},
	{
		label: '6 MO',
		padding: 100,
		value: PERIOD.SIX_MONTH,
		width: 50,
	},
	{
		label: 'YTD',
		padding: 130,
		value: PERIOD.YTD,
		width: 120,
	},
];

type BarChartPerformanceTypes = {
	colors: string[];
	dataColumns: string[];
	groups: string[];
	height: number;
	labelColumns: string[];
	showLegend: boolean;
	showTooltip: boolean;
	titleTotal: boolean;
	totalSum: number;
	width: number;
};

const colors: {[keys: string]: {}} = {
	achieved: '#55C2FF',
	exceeded: '#FFD76E',
	goals: '#DCF1FD',
};
const date = new Date();
const actualMonth = date.getMonth();

const yearly = Object.values(dataColumn.yearly).filter(
	(month: any) => month.index <= actualMonth
);

const three = Object.values(dataColumn.yearly).filter(
	(month: any) =>
		month.index < actualMonth + 1 && month.index > actualMonth - 3
);

const six = Object.values(dataColumn.yearly).filter(
	(month: any) =>
		month.index < actualMonth + 1 && month.index > actualMonth - 6
);

const labelFilterYearly = Object.values(dataColumn.yearly)
	.filter((label: any) => label.index <= actualMonth)
	.map((label: any) => label.label);

const labelFilterThree = Object.values(dataColumn.yearly)
	.filter(
		(label: any) =>
			label.index < actualMonth + 1 && label.index > actualMonth - 3
	)
	.map((label: any) => label.label);

const labelFilterSix = Object.values(dataColumn.yearly)
	.filter(
		(label: any) =>
			label.index < actualMonth + 1 && label.index > actualMonth - 6
	)
	.map((label: any) => label.label);

// eslint-disable-next-line no-console

const BarChartPerformancee: BarChartPerformanceTypes = {
	colors: [],
	dataColumns: [],
	groups: [''],
	height: 338,
	labelColumns: [],
	showLegend: false,
	showTooltip: true,
	titleTotal: true,
	totalSum: 0,
	width: 700,
};

type Policy = {
	boundDate: string;
	productExternalReferenceCode: string;
	productName: string;
	termPremium: number;
};

type ProductListType = {
	[keys: string]: ProductType;
};

type ProductType = {
	goalValue: number;
	productName: string;
	totalSales: number;
};

type SalesGoal = {
	finalReferenceDate?: string;
	goalValue: number;
	initialReferenceDate?: string;
	productExternalReferenceCode: string;
};

const ProductPerformance = () => {
	const [products, setProducts] = useState<ProductCell[]>([]);
	const [timePeriod, setTimePeriod] = useState(PERIOD.THREE_MONTH);
	const [filt, setFilt] = useState<any>(yearly);
	const [labe] = useState<any>();
	const [width, setWidht] = useState<any>();

	const labelRef = useRef<any>();

	const achieved = filt.map((item: any) =>
		item.achieved > item.goals ? item.goals : item.achieved
	);

	const exceeded = filt.map((item: any) =>
		item.achieved > item.goals ? item.achieved - item.goals : NaN
	);

	const goals = filt.map((item: any) =>
		item.goals < 0 || item.goals < item.achieved ? NaN : item.goals
	);

	const dataChart: any = {
		data: {
			columns: [
				['achieved', ...achieved],
				['exceeded', ...exceeded],
				['goals', ...goals],
			],
			groups: [
				['achieved', 'exceeded'],
				['achieved', 'goals'],
			],
		},
	};

	const productsBaseSetup = async () => {
		const yearlyPolicies = await getPoliciesForSalesGoal(
			currentDateString[0],
			currentDateString[1],
			currentDateString[0],
			january
		);

		const yearlySalesGoal = await getSalesGoal(
			currentDateString[0],
			december,
			currentDateString[0],
			january
		);

		const newProductList: ProductCell[] = [];
		const yearlyProductsTotal: ProductListType = {};

		yearlyPolicies?.data?.items?.forEach(
			({
				productExternalReferenceCode,
				productName,
				termPremium,
			}: Policy) => {
				if (!yearlyProductsTotal[productExternalReferenceCode]) {
					yearlyProductsTotal[productExternalReferenceCode] = {
						goalValue: 0,
						productName,
						totalSales: termPremium,
					};

					return;
				}

				yearlyProductsTotal[productExternalReferenceCode][
					'totalSales'
				] += termPremium;
			}
		);

		yearlySalesGoal?.data?.items?.forEach(
			({goalValue, productExternalReferenceCode}: SalesGoal) => {
				yearlyProductsTotal[productExternalReferenceCode][
					'goalValue'
				] += goalValue;
			}
		);

		Object.keys(yearlyProductsTotal).forEach(
			(productExternalReferenceCode: string) => {
				newProductList.push({
					active: false,
					goalValue:
						yearlyProductsTotal[productExternalReferenceCode][
							'goalValue'
						],
					productExternalReferenceCode,
					productName:
						yearlyProductsTotal[productExternalReferenceCode][
							'productName'
						],
					totalSales:
						yearlyProductsTotal[productExternalReferenceCode][
							'totalSales'
						],
				});
			}
		);

		setProducts(newProductList);
	};

	useEffect(() => {
		// eslint-disable-next-line no-console
		console.log(labelRef.current);
		productsBaseSetup();

		if (timePeriod === PERIOD.SIX_MONTH) {
			setFilt(six);
			setWidht(10);
			labelRef.current.categories(labelFilterSix);
		}

		if (timePeriod === PERIOD.THREE_MONTH) {
			setFilt(three);
			setWidht(60);
			labelRef.current.categories(labelFilterThree);
		}

		if (timePeriod === PERIOD.YTD) {
			setWidht(20);
			setFilt(yearly);
			labelRef.current.categories(labelFilterYearly);
		}
	}, [timePeriod]);

	const handleProductFilterToggle = (
		productExternalReferenceCode: string
	) => {
		const newProducts = products.map((product) => {
			product.productExternalReferenceCode ===
			productExternalReferenceCode
				? (product.active = true)
				: (product.active = false);

			return product;
		});

		setProducts(newProducts);
	};

	const isFilterAllActive = (product: ProductCell) => !product.active;

	const findActiveProduct = products.find((product) => product.active)
		?.productName;

	return (
		<div className="d-flex flex-wrap ray-dashboard-product-performance">
			<div className="col-md-5 left-container px-0">
				<Header
					className="header-row px-4 py-3"
					title="Product Performance"
				/>

				<ProductList
					onSelect={handleProductFilterToggle}
					productList={products}
				/>
			</div>

			<div className="col-md-7 px-0 right-container">
				<div className="align-items-center d-flex header-row justify-content-between px-4 py-3">
					<p className="m-0 text-paragraph">
						<ClayButton
							className={classNames('general-filter mr-1', {
								'disabled font-weight-bolder': products.every(
									isFilterAllActive
								),
							})}
							displayType="unstyled"
							onClick={() => {
								if (!products.every(isFilterAllActive)) {
									handleProductFilterToggle('All');
								}
							}}
						>
							All
						</ClayButton>

						{!products.every(isFilterAllActive) && (
							<>
								<ClayIcon
									className="mr-1"
									symbol="angle-right-small"
								/>
								<span className="font-weight-bolder">{`${findActiveProduct}`}</span>
							</>
						)}
					</p>

					<ClaySelect
						className="product-performance-select"
						onChange={({target}) => {
							setTimePeriod(target.value);
						}}
						sizing="sm"
						value={timePeriod}
					>
						{TIME_PERIODS.map((timePeriod, index) => (
							<ClaySelect.Option
								key={index}
								label={timePeriod.label}
								value={timePeriod.value}
							/>
						))}
					</ClaySelect>
				</div>

				<div className="overflow-auto px-2 py-5" style={{width: '500'}}>
					<ClayChart
						axis={{
							x: {
								categories: labe,
								height: 85,
								label: {
									position: 'outer-center',
									text: 'Period (Month)',
								},
								padding: {
									left: 0,
									right: 0.5,
								},
								position: {x: 30},
								show: true,
								type: 'category',
								width: 100,
							},
							y: {
								fixed: true,
								height: 80,
								label: {
									position: 'outer-middle',
									text: 'Dollar ($)',
								},
								padding: {
									left: 20,
									right: 20,
								},
								show: true,
								tick: {
									format(x: any) {
										return '$' + x;
									},
									stepSize: 50,
								},
								width: 100,
							},
						}}
						bar={{
							margin: 2,
							padding: 1,
							width,
						}}
						data={{
							colors,
							columns: dataChart.data.columns,
							groups: dataChart.data.groups,
							order: {
								function() {
									Object.values(
										dataColumn.yearly
									).map((item: any) =>
										item.achieved > item.goals
											? 'asc'
											: 'desc '
									);
								},
							},
							type: 'bar',
						}}
						grid={{
							x: {
								show: true,
							},
							y: {
								show: true,
							},
						}}
						legend={{
							inset: {
								anchor: 'botton-right', // top-left, top-right, bottom-left, bottom-right
								step: 1,
								x: 35,
								y: 0,
							},
							item: {
								onclick: () => {
									return false;
								},
								onout: () => {
									return false;
								},
								onover: () => {
									return false;
								},
							},

							position: 'inset', // bottom, right, inset
							show: false,
						}}
						padding={{
							right: 30,
						}}
						ref={labelRef}
						size={{
							height: BarChartPerformancee.height,
							width: BarChartPerformancee.width,
						}}
						tooltip={{
							show: true,
						}}
					/>

					<div className="legend">
						<div className="legend-goals">
							<div className="square-goals"></div>

							<h6>Goals</h6>
						</div>

						<div className="legend-achieved">
							<div className="square-ach"></div>

							<h6>Achieved</h6>
						</div>

						<div className="legend-exceeded">
							<div className="square-exc"></div>

							<h6>Exceeded</h6>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProductPerformance;
