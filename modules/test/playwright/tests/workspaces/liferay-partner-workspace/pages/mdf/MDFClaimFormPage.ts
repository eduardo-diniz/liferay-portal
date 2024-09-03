/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {Locator, Page, expect} from '@playwright/test';

import {TMDFClaim, TMDFRequest} from '../../types/mdf';
import {PARTNER_SITE_FRIENLY_URL_PATH} from '../../utils/constants';
import {MDFClaimFormReimbursementPage} from './MDFClaimFormReimbursementPage';


export class MDFClaimFormPage {
	readonly backButton: Locator;
	readonly cancelButton: Locator;
	readonly continueButton: Locator;
	readonly form: {
		reimbursement: MDFClaimFormReimbursementPage;
	};
	readonly heading: Locator;
	readonly newRequestButton: Locator;
	readonly page: Page;
	readonly previousButton: Locator;
	readonly saveAsDraftButton: Locator;
	readonly seeMDFHomeButton: Locator;
	readonly statusDropdown: Locator;
	readonly submitButton: Locator;
	readonly successMessage: Locator;

	constructor(page: Page) {
		this.page = page;

		this.cancelButton = this.page.getByRole('button', {name: 'Cancel'});
		this.continueButton = this.page.getByRole('button', {name: 'Continue'});
		this.form = {
			reimbursement: new MDFClaimFormReimbursementPage(this.page),
		};
		this.heading = this.page.getByRole('heading', {
			name: 'MDF Request',
		});
		this.saveAsDraftButton = this.page.getByRole('button', {
			name: 'Save as Draft',
		});
		this.seeMDFHomeButton = this.page.getByRole('button', {
			name: 'See MDF Home',
		});
		this.submitButton = this.page.getByRole('button', {
			name: 'Submit',
		});
		this.successMessage = this.page.getByText('Success!');
	}

	async createNewClaim(form: TMDFClaim) {
		await this.form.reimbursement.fillForm(form.reimbursement)
		}

	async goto(mdfRequestId) {
		await this.page.goto(
			`${PARTNER_SITE_FRIENLY_URL_PATH}/marketing/mdf-claims/new/#/mdf-request/${mdfRequestId}}`,
			{
				waitUntil: 'commit',
			}
		);
	}

	async statusDropDownOption(option: string) {
		await this.page
			.getByRole('menuitem', {
				name: option,
			})
			.click();
	}
}
