/* eslint-disable no-console */
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
	threeMonthsAgoDate,
} from '../../../common/utils/dateFormatter';
import {
	BarChartPerformanceTypes,
	Policy,
	ProductListType,
	SalesGoal,
} from './ProductPerfomanceTypes';

const PERIOD = {
	SIX_MONTH: '1',
	THREE_MONTH: '2',
	YTD: '0',
};

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

const TIME_PERIODS = [
	{
		label: '3 MO',
		padding: 30,
		value: '2',
		width: 20,
	},
	{
		label: '6 MO',
		padding: 100,
		value: '1',
		width: 50,
	},
	{
		label: 'YTD',
		padding: 130,
		value: '0',
		width: 120,
	},
];

const colors: {[keys: string]: {}} = {
	achieved: '#55C2FF',
	exceeded: '#FFD76E',
	goals: '#DCF1FD',
};

const paddingValue = 100;

const ProductPerformance = () => {
	const [products, setProducts] = useState<ProductCell[]>([]);
	const [timePeriod, setTimePeriod] = useState(PERIOD.YTD);
	const [labelAxisX] = useState<[]>();
	const ref = useRef<any>();
	const date = new Date();
	const actualMonth = date.getMonth();

	const [threeSales, setThreeSales] = useState<any>([]);
	const [threeGoals, setThreeGoals] = useState<any>([]);
	const [sixSales, setSixSales] = useState<any>([]);
	const [sixGoals, setSixGoals] = useState<any>([]);
	const [yearSales, setYearSales] = useState<any>([]);
	const [yearGoals, setYearGoals] = useState<any>([]);

	// const [three, setThree] = useState<[]>();
	// const [six, setSix] = useState<[]>();
	// const [yearly, setYearly] = useState<[]>();

	// const exceeded = filt.map((item: MonthProperties) =>
	// 	item.achieved > item.goals ? item.achieved - item.goals : NaN
	// );
	// const goals = loadData]((item: MonthProperties) =>
	// 	item.goals < 0 || item.goals < item.achieved ? NaN : item.goals

	function subtraiaArrays(a1: any, a2: any) {
		return a1.map((value: number, index: number) => value - a2[index]);
	}

	const threeMonthsSales = [10, 20, 30];

	const threeMonthsGoals = [30, 20, 40];

	const sixMonthsSales = [10, 20, 30];

	const sixMonthsGoals = [30, 20, 40];

	const salesFilterForThreeMonths = subtraiaArrays(
		threeMonthsGoals,
		threeMonthsSales
	);

	const salesFilterForSixMonths = subtraiaArrays(
		sixMonthsGoals,
		sixMonthsSales
	);

	console.log('salesFilterForThreeMonths', salesFilterForThreeMonths);

	console.log('salesFilterForSixMonths', salesFilterForSixMonths);

	const policySales = [
		400,
		50,
		100,
		200,
		435,
		450,
		540,
		560,
		180,
		240,
		230,
		211,
	];

	const goal = [300, 250, 180, 300, 335, 250, 440, 660, 440, 140, 230, 210];

	// const achievedd = () => {
	// 	achi.map((item: any) =>
	// 		achi[item] > goal[item]
	// 			? achieved.push(goal[item])
	// 			: achieved.push(achi[item])
	// 	);
	// };

	// const exceededFilt = () => {
	// 	for (let i = 0; i < goal.length; i++) {
	// 		achi[i] > goal[i]
	// 			? exceeded.push(achi[i] - goal[i])
	// 			: exceeded.push(NaN);
	// 	}
	// };

	// exceededFilt();

	// const goalsFilt = () => {
	// 	for (let i = 0; i < achieved.length; i++) {
	// 		goal[i] < achi[i] ? goals.push(NaN) : goals.push(goal[i] - achi[i]);
	// 	}
	// };

	// goalsFilt();

	const getThreeMonthsSales = () => {
		for (let i = 0; i < goal.length; i++) {
			if (i < actualMonth + 1 && i > actualMonth - 3) {
				threeSales.push(policySales[i]);
			}
		}

		return setThreeSales(threeSales);
	};

	const getThreeMonthsGoals = () => {
		for (let i = 0; i < policySales.length; i++) {
			if (i < actualMonth + 1 && i > actualMonth - 3) {
				threeGoals.push(goal[i]);
			}
		}

		return setThreeGoals(threeGoals);
	};

	const getSixMonthsSales = () => {
		for (let i = 0; i < goal.length; i++) {
			if (i < actualMonth + 1 && i > actualMonth - 6) {
				sixSales.push(goal[i]);
			}
		}

		return setSixSales(sixSales);
	};

	const getSixMonthsGoals = () => {
		for (let i = 0; i < goal.length; i++) {
			if (i < actualMonth + 1 && i > actualMonth - 6) {
				sixGoals.push(policySales[i]);
			}
		}

		return setSixGoals(sixGoals);
	};

	const getYearlyMonthsSales = () => {
		for (let i = 0; i < goal.length; i++) {
			if (i <= actualMonth) {
				yearSales.push(goal[i]);
			}
		}

		return setYearSales(yearSales);
	};

	const getYearlyMonthsGoals = () => {
		for (let i = 0; i < goal.length; i++) {
			if (i <= actualMonth) {
				yearGoals.push(policySales[i]);
			}
		}

		return setYearGoals(yearGoals);
	};

	const loadData = [
		{
			achieved: ['achieved', ...threeSales],
			dataGroups: ['goals', 'achieved', 'exceeded', 'goals'],
			exceeded: ['exceeded', 0, 0, 0],
			goals: ['goals', ...threeGoals],
			label: ['Ago 2022', 'Jul 2022', 'Jun 2022'],
			period: 2,
			periodDate: 'Period',
		},
		{
			achieved: ['achieved', ...sixSales],
			dataGroups: ['goals', 'achieved'],
			exceeded: [0, 0, 0, 0, 0, 0],
			goals: ['goals', ...sixGoals],
			label: [
				'Set 2022',
				'Agst 2022',
				'Jul 2022',
				'Jun 2022',
				'Mai 222',
				'Abr 2022',
			],
			period: 1,
			periodDate: 'Period',
		},
		{
			achieved: ['achieved', ...yearSales],
			dataGroups: ['goals', 'achieved'],
			exceeded: [0, 0, 0, 0, 0, 0, 0, 0, 0],
			goals: ['goals', ...yearGoals],
			label: [
				'Set 2022',
				'Agost 2022',
				'Jul 2022',
				'Jun 2022',
				'maio 222',
				'abril 2022',
				'Mar 2022',
				'feb 222',
				'jan 2022',
			],
			period: 0,
			periodDate: 'Period',
		},
	];

	const getData = () => {
		return loadData.filter((data) => data.period === Number(timePeriod));
	};

	console.log(getData()[0]?.achieved);

	const dataChart = {
		colors,
		columns: [getData()[0]?.achieved, getData()[0]?.goals],
		groups: [
			['goals', 'exceeded'],
			['achieved', 'goals'],
		],
		order: {
			function() {
				loadData.map((month: any) =>
					month.achieved > month.goals ? 'asc' : 'desc '
				);
			},
		},
		type: 'bar',
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
		productsBaseSetup();

		getThreeMonthsSales();
		getThreeMonthsGoals();
		getSixMonthsSales();
		getSixMonthsGoals();
		getYearlyMonthsSales();
		getYearlyMonthsGoals();

		// getSixMonthsSales();
		// getSixMonthsGoals();
		// getYearlyMonthsSales();
		// getYearlyMonthsGoals();

		getSalesGoal(
			currentDateString[0],
			currentDateString[1],
			threeMonthsAgoDate[0],
			threeMonthsAgoDate[1]
		).then((results: any) => {
			// const lastThreeMonthsGoalsResult = results?.data?.items;

			console.log('salesGoalMeta', results.data.items);
		});

		getPoliciesForSalesGoal(
			currentDateString[0],
			currentDateString[1],
			threeMonthsAgoDate[0],
			threeMonthsAgoDate[1]
		).then((results: any) => {
			console.log('vendas', results.data.items);
		});

		ref.current.categories(getData()[0]?.label);
	}, []);

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
							console.log(timePeriod);
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

				<div className="p-5">
					<ClayChart
						axis={{
							x: {
								categories: labelAxisX,
								height: 85,
								label: {
									position: 'outer-center',
									text: 'Period (Month)',
								},
								position: {x: 30},
								show: true,
								type: 'category',
								width: 100,
							},
							y: {
								height: 80,
								label: {
									position: 'outer-middle',
									text: 'Dollar ($)',
								},
								padding: {
									left: 200,
									right: 200,
								},
								show: true,
								tick: {
									format(x: string) {
										return '$' + x;
									},
									stepSize: 100,
								},
								width: 100,
							},
						}}
						bar={{
							width: 20,
						}}
						data={dataChart}
						grid={{
							x: {
								show: true,
							},
							y: {
								show: true,
							},
						}}
						legend={{
							show: false,
						}}
						padding={{
							right: paddingValue,
						}}
						ref={ref}
						size={{
							height: BarChartPerformancee.height,
							width: BarChartPerformancee.width,
						}}
						tooltip={{
							show: true,
						}}
					/>
				</div>
			</div>
		</div>
	);
};

export default ProductPerformance;
