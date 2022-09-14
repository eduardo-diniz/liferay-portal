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
	sixMonthsAgoDate,
	threeMonthsAgoDate,
} from '../../../common/utils/dateFormatter';
import {
	BarChartPerformanceTypes,
	Policy,
	ProductListType,
	SalesGoal,
} from './ProductPerfomanceTypes';

const CONSTANTS = {
	MONTHS_ABREVIATIONS: [
		'Jan',
		'Feb',
		'Mar',
		'Apr',
		'May',
		'Jun',
		'Jul',
		'Aug',
		'Sep',
		'Oct',
		'Nov',
		'Dec',
	],
};

const d = new Date();

const threeMonthsLabel = [
	CONSTANTS.MONTHS_ABREVIATIONS[d.getMonth() - 2],
	CONSTANTS.MONTHS_ABREVIATIONS[d.getMonth() - 1],
	CONSTANTS.MONTHS_ABREVIATIONS[d.getMonth()],
];

const sixMonthsLabel = [
	CONSTANTS.MONTHS_ABREVIATIONS[d.getMonth() - 5],
	CONSTANTS.MONTHS_ABREVIATIONS[d.getMonth() - 4],
	CONSTANTS.MONTHS_ABREVIATIONS[d.getMonth() - 3],
	CONSTANTS.MONTHS_ABREVIATIONS[d.getMonth() - 2],
	CONSTANTS.MONTHS_ABREVIATIONS[d.getMonth() - 1],
	CONSTANTS.MONTHS_ABREVIATIONS[d.getMonth()],
];

let YearToDateLabelReverse: string[] = [];

const YearToDateLabel: string[] = [];

for (let i = 0; i <= d.getMonth(); i++) {
	YearToDateLabel.push(
		CONSTANTS.MONTHS_ABREVIATIONS[d.getMonth() - i] + ' ' + d.getFullYear()
	);
}

YearToDateLabelReverse = YearToDateLabel.reverse();

console.log('YearToDateLabelReverse', YearToDateLabelReverse);

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
	const [timePeriod, setTimePeriod] = useState('0');
	const [_labelAxisX] = useState<string[]>(['']);
	const ref = useRef<any>();
	const [isLoading, setIsLoading] = useState(false);
	const [threeMonthsSalesData, setThreeMonthsSalesData] = useState<any>([]);
	const [threeMonthsGoalsData, setThreeMonthsGoalsData] = useState<any>([]);
	const [sixMonthsSalesData, setSixMonthsSalesData] = useState<any>([]);
	const [sixMonthsGoalsData, setSixMonthsGoalsData] = useState<any>([]);
	const [yearToDateSales, setYearToDateSales] = useState<any>([]);
	const [yearToDateGoals, setYearToDateGoals] = useState<any>([]);

	function populateSales(policiesResult: any, policiesArray: any) {
		policiesResult.forEach((policy: any) => {
			const month = new Date(policy?.boundDate)
				.toUTCString()
				.split(' ')[2];

			policiesArray?.forEach((policyElement: any) => {
				if (month in policyElement) {
					policyElement[month] += policy?.termPremium;
				}
			});
		});

		return policiesArray;
	}

	function populateGoals(goalsResult: any, goalsArray: any) {
		goalsResult.forEach((policy: any) => {
			const month = new Date(policy?.finalReferenceDate)
				.toUTCString()
				.split(' ')[2];

			goalsArray?.forEach((goalElement: any) => {
				if (month in goalElement) {
					goalElement[month] += policy?.goalValue;
				}
			});
		});

		return goalsArray;
	}

	const getArrayOfSales = (response: any, arrayOfMonthsArray: any) => {
		const monthsResult = response?.data?.items;
		const arrayOfMonths = populateSales(monthsResult, arrayOfMonthsArray);

		return getValuesFromArrayOfObjects(arrayOfMonths);
	};

	const getArrayOfGoals = (response: any, monthsAgoGoalsArray: any) => {
		const monthsGoalsResult = response?.data?.items;
		const monthsAgoGoals = populateGoals(
			monthsGoalsResult,
			monthsAgoGoalsArray
		);

		return getValuesFromArrayOfObjects(monthsAgoGoals);
	};

	function getValuesFromArrayOfObjects(arrayOfObjects: any) {
		const valuesArray = arrayOfObjects?.map((values: any) => {
			return Object.values(values)[0];
		});

		return valuesArray;
	}

	function getExceededValues(goalValue: any, salesValue: any) {
		const exceededValue = goalValue?.map((goal: number, index: number) => {
			if (goal - salesValue[index] <= 0) {
				return (goal - salesValue[index]) * -1;
			} else {
				return 0;
			}
		});

		return exceededValue;
	}

	function getGoalsValues(goalValue: any, salesValue: any) {
		const goalsValues = goalValue?.map((goal: number, index: number) => {
			if (goal - salesValue[index] >= 0) {
				return goal - salesValue[index];
			} else {
				return 0;
			}
		});

		return goalsValues;
	}

	function getAchievedValues(goalValue: any, salesValue: any) {
		const achievedValues = goalValue?.map((goal: number, index: number) => {
			if (goal - salesValue[index] <= 0) {
				return goal;
			} else {
				return salesValue[index];
			}
		});

		return achievedValues;
	}
	const threeMonthsSalesArray: any = [];
	const threeMonthsGoalsArray: any = [];
	const sixMonthsSalesArray: any = [];
	const sixMonthsGoalsArray: any = [];
	const yearToDateSalesArray: any = [];
	const yearToDateGoalsArray: any = [];
	const numberOfMonths = 12;
	const maxIndexOfMonthsArray = 11;
	const threeMonthsDatePeriod = 2;
	const sixMonthsDatePeriod = 5;

	const indexOfCurrentMonth = new Date().getMonth();

	let indexBaseMonth = indexOfCurrentMonth - threeMonthsDatePeriod;

	indexBaseMonth =
		indexBaseMonth < 0 ? numberOfMonths + indexBaseMonth : indexBaseMonth;

	let month = 0;

	for (let count = 0; count <= threeMonthsDatePeriod; count++) {
		const threeMonthsSalesFilter: any = {};
		const threeMonthsGoalsFilter: any = {};

		if (!count) {
			month = indexBaseMonth;
		}
		if (month > maxIndexOfMonthsArray) {
			month = 0;
		}

		threeMonthsSalesFilter[CONSTANTS.MONTHS_ABREVIATIONS[month]] = 0;
		threeMonthsGoalsFilter[CONSTANTS.MONTHS_ABREVIATIONS[month]] = 0;
		threeMonthsSalesArray[count] = threeMonthsSalesFilter;
		threeMonthsGoalsArray[count] = threeMonthsGoalsFilter;
		month++;
	}

	let monthposition = 0;

	for (let count = 0; count <= indexOfCurrentMonth; count++) {
		const yearToDateSalesFilter: any = {};
		const yearToDateGoalsFilter: any = {};

		yearToDateSalesFilter[CONSTANTS.MONTHS_ABREVIATIONS[monthposition]] = 0;
		yearToDateGoalsFilter[CONSTANTS.MONTHS_ABREVIATIONS[monthposition]] = 0;

		yearToDateSalesArray[count] = yearToDateSalesFilter;
		yearToDateGoalsArray[count] = yearToDateGoalsFilter;
		monthposition++;
	}

	let indexBaseMonth2 = indexOfCurrentMonth - sixMonthsDatePeriod;

	indexBaseMonth2 =
		indexBaseMonth2 < 0
			? numberOfMonths + indexBaseMonth2
			: indexBaseMonth2;
	let month2 = 0;

	for (let count = 0; count <= sixMonthsDatePeriod; count++) {
		const sixMonthsSalesFilter: any = {};
		const sixMonthsGoalsFilter: any = {};

		if (!count) {
			month2 = indexBaseMonth2;
		}
		if (month2 > maxIndexOfMonthsArray) {
			month2 = 0;
		}

		sixMonthsSalesFilter[CONSTANTS.MONTHS_ABREVIATIONS[month2]] = 0;
		sixMonthsGoalsFilter[CONSTANTS.MONTHS_ABREVIATIONS[month2]] = 0;
		sixMonthsSalesArray[count] = sixMonthsSalesFilter;
		sixMonthsGoalsArray[count] = sixMonthsGoalsFilter;

		month2++;
	}

	const loadData = [
		{
			achieved: [
				'achieved',
				...getAchievedValues(
					threeMonthsGoalsData,
					threeMonthsSalesData
				),
			],
			dataGroups: ['achieved', 'exceeded', 'goals'],
			exceeded: [
				'exceeded',
				...getExceededValues(
					threeMonthsGoalsData,
					threeMonthsSalesData
				),
			],
			goals: [
				'goals',
				...getGoalsValues(threeMonthsGoalsData, threeMonthsSalesData),
			],
			label: threeMonthsLabel,
			period: 2,
			periodDate: 'Period',
		},
		{
			achieved: [
				'achieved',
				...getAchievedValues(sixMonthsGoalsData, sixMonthsSalesData),
			],
			dataGroups: ['achieved', 'exceeded', 'goals'],
			exceeded: [
				'exceeded',
				...getExceededValues(sixMonthsGoalsData, sixMonthsSalesData),
			],
			goals: [
				'goals',
				...getGoalsValues(sixMonthsGoalsData, sixMonthsSalesData),
			],
			label: sixMonthsLabel,
			period: 1,
			periodDate: 'Period',
		},
		{
			achieved: [
				'achieved',
				...getAchievedValues(yearToDateGoals, yearToDateSales),
			],
			dataGroups: ['achieved', 'exceeded', 'goals'],
			exceeded: [
				'exceeded',
				...getExceededValues(yearToDateGoals, yearToDateSales),
			],
			goals: [
				'goals',
				...getGoalsValues(yearToDateGoals, yearToDateSales),
			],
			label: YearToDateLabel,
			period: 0,
			periodDate: 'Period',
		},
	];

	const getData = () => {
		return loadData?.filter((data) => data.period === Number(timePeriod));
	};

	const dataChart = {
		colors,
		columns: [
			getData()[0]?.achieved,
			getData()[0]?.goals,
			getData()[0]?.exceeded,
		],
		groups: [['achieved', 'exceeded', 'goals']],
		order: {
			function() {
				loadData?.map((month: any) =>
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

	const lengthExceeded = getData()[0]?.exceeded.length - 1;
	console.log('lengthExceeded', lengthExceeded);

	useEffect(() => {
		productsBaseSetup();

		if (timePeriod === '0') {
			getSalesGoal(
				currentDateString[0],
				currentDateString[1],
				currentDateString[0],
				january
			).then((results) => {
				const YearToDateGoalsResult = getArrayOfGoals(
					results,
					yearToDateGoalsArray
				);

				setYearToDateGoals(YearToDateGoalsResult);
			});

			getPoliciesForSalesGoal(
				currentDateString[0],
				currentDateString[1],
				currentDateString[0],
				january
			).then((results) => {
				const YearToDateSalesResult = getArrayOfSales(
					results,
					yearToDateSalesArray
				);

				setYearToDateSales(YearToDateSalesResult);
			});

			if (lengthExceeded === indexOfCurrentMonth + 1) {
				setIsLoading(true);
				if (isLoading === true) {
					ref.current.categories(getData()[0]?.label);
				}
			}
		}

		if (timePeriod === '1') {
			getSalesGoal(
				currentDateString[0],
				currentDateString[1],
				sixMonthsAgoDate[0],
				sixMonthsAgoDate[1]
			).then((results: any) => {
				const lastSixMonthsGoalsResult = getArrayOfGoals(
					results,
					sixMonthsGoalsArray
				);

				setSixMonthsGoalsData(lastSixMonthsGoalsResult);
			});

			getPoliciesForSalesGoal(
				currentDateString[0],
				currentDateString[1],
				sixMonthsAgoDate[0],
				sixMonthsAgoDate[1]
			).then((results: any) => {
				const lastSixMonthsSalesResult = getArrayOfSales(
					results,
					sixMonthsSalesArray
				);

				setSixMonthsSalesData(lastSixMonthsSalesResult);
			});

			if (lengthExceeded === 6) {
				setIsLoading(true);
				console.log('entrou 6 meses');

				if (isLoading === true) {
					ref.current.categories(getData()[0]?.label);
				}
			}
		}

		if (timePeriod === '2') {
			getSalesGoal(
				currentDateString[0],
				currentDateString[1],
				threeMonthsAgoDate[0],
				threeMonthsAgoDate[1]
			).then((results: any) => {
				const lastThreeMonthsGoalsResult = getArrayOfGoals(
					results,
					threeMonthsGoalsArray
				);

				setThreeMonthsGoalsData(lastThreeMonthsGoalsResult);
			});

			getPoliciesForSalesGoal(
				currentDateString[0],
				currentDateString[1],
				threeMonthsAgoDate[0],
				threeMonthsAgoDate[1]
			).then((results: any) => {
				const lastThreeMonthsSalesResult = getArrayOfSales(
					results,
					threeMonthsSalesArray
				);

				setThreeMonthsSalesData(lastThreeMonthsSalesResult);
			});
			if (lengthExceeded === 3) {
				console.log('entrou 3neses');
				setIsLoading(true);
				if (isLoading === true) {
					ref.current.categories(getData()[0]?.label);
				}
			}
		}
	}, [lengthExceeded, isLoading, timePeriod]);

	console.log(isLoading);
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
							setIsLoading(false);
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
					{isLoading && (
						<ClayChart
							axis={{
								x: {
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
										stepSize: 10000,
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
								show: true,
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
					)}
				</div>
			</div>
		</div>
	);
};

export default ProductPerformance;
