/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {expect, mergeTests} from '@playwright/test';

import {partnerPagesTest} from '../../../fixtures/partnerPagesTest';
import {accountPlatinumMock} from '../../../mocks/accountMock';
import {userAdminMock} from '../../../mocks/userMock';
import {TAccount} from '../../../types/account';
import {EAccountRoles, EMDFRequestStatuses} from '../../../utils/constants';
import {generateMDFRequestFormData, getGeneratedDataFromActivity, getGeneratedDataFromBudget, getGeneratedDataFromClaim, getGeneratedDataFromRequest} from '../../../utils/mdf';
import { TMDFRequestActivity, TMDFRequestBudget, TMDFRequestDataFromRequest } from '../../../types/mdf';

export const test = mergeTests(partnerPagesTest);

test.describe('MDF Claim Form', () => {
	const {emailAddress} = userAdminMock;
	let accountPlatinum: TAccount;
	let mdfRequest: TMDFRequestDataFromRequest;
	let mdfActivity : TMDFRequestActivity;
	let mdfBudget : TMDFRequestBudget;

	test.beforeEach(async ({apiHelpers, mdfRequestListPage, mdfRequestFormPage, partnerHelper}) => {
		accountPlatinum =
			await apiHelpers.headlessAdminUser.postAccount(accountPlatinumMock);

		await apiHelpers.headlessAdminUser.assignUserToAccountByEmailAddress(
			accountPlatinum.id,
			[emailAddress]
		);

		await partnerHelper.assignUserToAccountRole(
			accountPlatinum.id,
			EAccountRoles.PARTNER_MANAGER,
			emailAddress
		);
		
		
		//	requestByMock

		accountPlatinum =
			await apiHelpers.headlessAdminUser.postAccount(accountPlatinumMock);

		await apiHelpers.headlessAdminUser.assignUserToAccountByEmailAddress(
			accountPlatinum.id,
			[emailAddress]
		);

		await partnerHelper.assignUserToAccountRole(
			Number(accountPlatinum.id),
			EAccountRoles.PARTNER_MANAGER,
			emailAddress
		);

		const mdfRequestData = getGeneratedDataFromRequest(accountPlatinum);
		
		mdfRequest = await partnerHelper.createMDFRequest(mdfRequestData);

		const mdfActivityData = getGeneratedDataFromActivity(accountPlatinum, mdfRequest.id);
		
		mdfActivity = await partnerHelper.createMDFActivity(mdfActivityData);
		
		const mdfBudgetData = getGeneratedDataFromBudget(accountPlatinum, mdfActivity.id);

		mdfBudget = await partnerHelper.createMDFBudget(mdfBudgetData);

		console.log('mdfRequestData', mdfRequestData);
		console.log('mdfActivity', mdfActivity);
		console.log('mdfBudgetData', mdfBudgetData);


			await mdfRequestListPage.goto();

			const renderedRow = await mdfRequestListPage.getRenderedRow(
				mdfRequest.overallCampaignName
			);


	
			const requestId = await mdfRequestListPage.getRenderedRequestId(
				renderedRow.requestId
			);
	
			await requestId.click();

	});

	test.afterEach(async ({apiHelpers}) => {
		if (accountPlatinum) {
			await apiHelpers.headlessAdminUser.deleteAccount(
				Number(accountPlatinum.id)
			);
		}
	});

	test('ensure MDF is correct status for making claims', async ({
		mdfRequestFormPage,
		mdfClaimFormPage,
		

	}) => {

		await mdfRequestFormPage.statusDropdown.click();

		await mdfRequestFormPage.statusDropDownOption(
			EMDFRequestStatuses.APPROVED
		);

		await mdfClaimFormPage.page.reload();
		
		await mdfClaimFormPage.page.getByRole('link', { name: 'New Claim' }).click();

		await expect(mdfClaimFormPage.page.getByRole('heading', { name: 'Campaign Description ' })).toBeVisible();

	
	});


	test('Not Change MDF Claim Status', async ({
		mdfRequestFormPage,
		mdfClaimFormPage,
		

	}) => {

		await expect(mdfClaimFormPage.page.getByRole('link', { name: 'New Claim' })).not.toBeVisible();
	
	});

    
    // test('Open MDF Claim Form With aprroved request', async ({mdfClaimFormPage}) => {
	// 	await expect(mdfClaimFormPage.heading).toBeTruthy();
	// });

	// test('Open MDF Claim Form', async ({mdfClaimFormPage}) => {
	// 	await expect(mdfClaimFormPage.heading).toBeTruthy();
	// });

	test('Create a New MDF Cliam', async ({mdfClaimFormPage, mdfRequestFormPage}) => {

		await mdfRequestFormPage.statusDropdown.click();

		await mdfRequestFormPage.statusDropDownOption(
			EMDFRequestStatuses.APPROVED
		);

		await mdfClaimFormPage.page.reload();
		
		await mdfClaimFormPage.page.getByRole('link', { name: 'New Claim' }).click();

		const mdfClaimFormData = getGeneratedDataFromClaim(accountPlatinum);

		await mdfClaimFormPage.createNewClaim(mdfClaimFormData);

		await mdfClaimFormPage.submitButton.click();

		await expect(mdfClaimFormPage.successMessage).toBeVisible();
	});
});
