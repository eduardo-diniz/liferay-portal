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

import {
	getPoliciesForSalesGoal,
	getSalesGoal,
} from '../../../../common/services';
import {SalesGoal, SalesPolices} from '../ProductPerfomanceTypes';

function getValuesFromArrayOfObjects(arrayOfObjects: any) {
	const valuesArray = arrayOfObjects?.map((values: any) => {
		return Object.values(values)[0];
	});

	return valuesArray;
}

function populateGoalsProducts(
	goalsResult: SalesGoal[],
	goalsArray: string[],
	productExternalReferenceCode: string
) {
	goalsResult.forEach((policy: SalesGoal) => {
		const month = new Date(policy.finalReferenceDate)
			.toUTCString()
			.split(' ')[2];
		goalsArray?.forEach((goalElement: any) => {
			if (month in goalElement) {
				if (
					policy?.productExternalReferenceCode ===
					productExternalReferenceCode
				) {
					goalElement[month] = policy?.goalValue;
				} else {
					goalElement[month] += policy?.goalValue;
				}
			}
		});
	});

	return goalsArray;
}

function populateSalesProducts(
	policiesResult: SalesPolices[],
	policiesArray: string[],
	productExternalReferenceCode: string
) {
	policiesResult.forEach((policy: SalesPolices) => {
		const month = new Date(policy?.boundDate).toUTCString().split(' ')[2];
		policiesArray?.forEach((policyElement: any) => {
			if (month in policyElement) {
				if (
					policy?.productExternalReferenceCode ===
					productExternalReferenceCode
				) {
					policyElement[month] += policy?.termPremium;
				} else {
					policyElement[month] += policy?.termPremium;
				}
			}
		});
	});

	return policiesArray;
}

const getArrayOfSalesProducts = (
	response: SalesPolices[],
	arrayOfMonthsArray: string[],
	productExternalReferenceCode: string
) => {
	const monthsResult = response;
	const arrayOfMonths = populateSalesProducts(
		monthsResult,
		arrayOfMonthsArray,
		productExternalReferenceCode
	);

	return getValuesFromArrayOfObjects(arrayOfMonths);
};

const getArrayOfGoalsProducts = (
	response: SalesGoal[],
	monthsAgoGoalsArray: string[],
	productExternalReferenceCode: string
) => {
	const monthsGoalsResult = response;
	const monthsAgoGoals = populateGoalsProducts(
		monthsGoalsResult,
		monthsAgoGoalsArray,
		productExternalReferenceCode
	);

	return getValuesFromArrayOfObjects(monthsAgoGoals);
};

export async function annualRule(
	currentDateString: string[],
	january: string,
	yearToDateGoalsArray: string[],
	yearToDateSalesArray: string[],
	productExternalReferenceCode: string
) {
	const salesGoal = await getSalesGoal(
		currentDateString[0],
		currentDateString[1],
		currentDateString[0],
		january
	);

	const policiesSalesGoals = await getPoliciesForSalesGoal(
		currentDateString[0],
		currentDateString[1],
		currentDateString[0],
		january
	);

	const productsType = salesGoal.data.items.filter((item: SalesGoal) => {
		if (
			item.productExternalReferenceCode === productExternalReferenceCode
		) {
			return item;
		} else if (productExternalReferenceCode === 'All') {
			return item;
		}
	});
	const productsSalesType = policiesSalesGoals.data.items.filter(
		(item: SalesGoal) => {
			if (
				item.productExternalReferenceCode ===
				productExternalReferenceCode
			) {
				return item;
			} else if (productExternalReferenceCode === 'All') {
				return item;
			}
		}
	);
	const yearToDateGoalsResultProducts = getArrayOfGoalsProducts(
		productsType,
		yearToDateGoalsArray,
		productExternalReferenceCode
	);

	const yearToDateSalesResultProducts = getArrayOfSalesProducts(
		productsSalesType,
		yearToDateSalesArray,
		productExternalReferenceCode
	);

	return [yearToDateGoalsResultProducts, yearToDateSalesResultProducts];
}

export async function sixMonthRule(
	currentDateString: string[],
	productExternalReferenceCode: string,
	sixMonthsAgoDate: string[],
	sixMonthsGoalsArray: string[],
	sixMonthsSalesArray: string[]
) {
	const salesGoal = await getSalesGoal(
		currentDateString[0],
		currentDateString[1],
		sixMonthsAgoDate[0],
		sixMonthsAgoDate[1]
	);

	const policiesForSalesGoal = await getPoliciesForSalesGoal(
		currentDateString[0],
		currentDateString[1],
		sixMonthsAgoDate[0],
		sixMonthsAgoDate[1]
	);

	const productsType = salesGoal.data.items.filter((item: SalesGoal) => {
		if (
			item.productExternalReferenceCode === productExternalReferenceCode
		) {
			return item;
		} else if (productExternalReferenceCode === 'All') {
			return item;
		}
	});
	const productsSalesType = policiesForSalesGoal.data.items.filter(
		(item: SalesGoal) => {
			if (
				item.productExternalReferenceCode ===
				productExternalReferenceCode
			) {
				return item;
			} else if (productExternalReferenceCode === 'All') {
				return item;
			}
		}
	);
	const sixMonthsGoalsResultProducts = getArrayOfGoalsProducts(
		productsType,
		sixMonthsGoalsArray,
		productExternalReferenceCode
	);

	const sixMonthsSalesResultProducts = getArrayOfSalesProducts(
		productsSalesType,
		sixMonthsSalesArray,
		productExternalReferenceCode
	);

	return [sixMonthsGoalsResultProducts, sixMonthsSalesResultProducts];
}

export async function threeMonthRule(
	currentDateString: string[],
	threeMonthsAgoDate: string[],
	threeMonthsGoalsArray: string[],
	threeMonthsSalesArray: string[],
	productExternalReferenceCode: string
) {
	const salesGoal = await getSalesGoal(
		currentDateString[0],
		currentDateString[1],
		threeMonthsAgoDate[0],
		threeMonthsAgoDate[1]
	);

	const policiesForSalesGoal = await getPoliciesForSalesGoal(
		currentDateString[0],
		currentDateString[1],
		threeMonthsAgoDate[0],
		threeMonthsAgoDate[1]
	);

	const productsType = salesGoal.data.items.filter((item: SalesGoal) => {
		if (
			item.productExternalReferenceCode === productExternalReferenceCode
		) {
			return item;
		} else if (productExternalReferenceCode === 'All') {
			return item;
		}
	});
	const productsSalesType = policiesForSalesGoal.data.items.filter(
		(item: SalesGoal) => {
			if (
				item.productExternalReferenceCode ===
				productExternalReferenceCode
			) {
				return item;
			} else if (productExternalReferenceCode === 'All') {
				return item;
			}
		}
	);
	const threeMonthsGoalsResultProducts = getArrayOfGoalsProducts(
		productsType,
		threeMonthsGoalsArray,
		productExternalReferenceCode
	);

	const threeMonthsSalesResultProducts = getArrayOfSalesProducts(
		productsSalesType,
		threeMonthsSalesArray,
		productExternalReferenceCode
	);

	return [threeMonthsGoalsResultProducts, threeMonthsSalesResultProducts];
}
