/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {Locator, Page, expect} from '@playwright/test';

import {TMDFClaimReimbursement} from '../../types/mdf';
import path from 'path';

export class MDFClaimFormReimbursementPage {
    readonly allContentsInput:Locator;
    readonly expandCampaign: Locator;
    readonly targetCampaignDescription:Locator;
    readonly imagesInput: Locator;
    readonly listQualifiedLeadsInput: Locator;
    readonly page: Page;
    readonly reimbursementInvoicesInput:Locator;
	readonly targetActivity: {
        invoiceAmount: Locator;
        targetActivityDescription: Locator;
        thirdPartyFile: Locator;
	};
    readonly telemarketingMetricsInput: Locator;
    readonly telemarketingScriptInput: Locator;
    readonly totalClaimAmountInput:Locator;

	constructor(page: Page) {
		this.page = page;
        this.expandCampaign = page.locator('svg.lexicon-icon.lexicon-icon-angle-down');
        this.targetCampaignDescription =  this.page.locator('input[name="activities[0].selected"]');
        this.targetActivity = {
        invoiceAmount:  page.locator('input[name="activities\\[0\\]\\.budgets\\[0\\]\\.invoiceAmount"]'),
        targetActivityDescription: page.getByRole('tab', { name: 'Broadcast Advertising' }).getByLabel(''),
        thirdPartyFile: page.locator('input[name="activities[0].budgets[0].invoiceFile"]'),
        
        }
        this.telemarketingMetricsInput = page.locator('textarea[name="activities\\[0\\]\\.telemarketingMetrics"]');
        this.totalClaimAmountInput = page.locator('input[name="totalClaimAmount"]');

	}

	async fillForm({
		activityName,
		totalClaimAmount,
	}: TMDFClaimReimbursement) {
		await this.targetCampaignDescription.check();
        
        await this.expandCampaign.click();
        
        await this.page.getByRole('tab', { name: 'Room Rental' }).getByLabel('').check();
        
        await this.page.getByRole('tab', { name: 'Room Rental' }).locator('svg').click();
        
        await this.targetActivity.invoiceAmount.fill('100');
        
        const listOfQualifiedLeadsFile = this.page.locator('input[name="activities[0].listOfQualifiedLeadsFile"]');

        const proofOfPerformanceFile = this.page.locator('input[name="activities[0].proofOfPerformance.allContents"]');

        const reimbursementInvoicesFile = this.page.locator('input[name="reimbursementInvoices"]');

        const imagePath = path.join(__dirname, 'files', 'test_image.png');

        const imagePath2 = path.join(__dirname, 'files', 'qualified_leads_template.xlsx');

        await this.targetActivity.thirdPartyFile.setInputFiles(imagePath);

        await listOfQualifiedLeadsFile.setInputFiles(imagePath2);

        await proofOfPerformanceFile.setInputFiles(imagePath);

        await reimbursementInvoicesFile.setInputFiles(imagePath);

        await this.targetActivity.targetActivityDescription.check();

        await this.telemarketingMetricsInput.fill('Test');

        await this.totalClaimAmountInput.clear();

        await this.totalClaimAmountInput.fill('250.00');
        

	}
}
