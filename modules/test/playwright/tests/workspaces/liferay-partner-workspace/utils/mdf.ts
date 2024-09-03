/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import moment from 'moment';

import {
	mdfActivityMock,
	mdfBudgetMock,
	mdfClaimDataMock,
	mdfRequestDataMock,
	mdfRequestMock,
} from '../mocks/mdfMock';
import {TAccount} from '../types/account';
import {TMDFClaim, TMDFRequest, TMDFRequestActivity, TMDFRequestBudget, TMDFRequestDataFromRequest} from '../types/mdf';

export function generateMDFRequestFormData(
	parnterAccount: TAccount
): TMDFRequest {
	const mdfRequest = mdfRequestMock;

	mdfRequest.activities[0].endDate = moment()
		.add(2, 'days')
		.format('YYYY-MM-DD');
	mdfRequest.activities[0].startDate = moment()
		.add(1, 'days')
		.format('YYYY-MM-DD');
	mdfRequest.goals.companyName = parnterAccount.name;
	mdfRequest.submitDate = moment().format('YYYY-MM-DD');

	return mdfRequest;
}

export function getGeneratedDataFromActivity(
	parnterAccount: TAccount , mdfRequestId : number
): TMDFRequestActivity {
	const mdfActivityData = mdfActivityMock;

		mdfActivityData.endDate = moment()
		.add(2, 'days')
		.format('YYYY-MM-DD');
	mdfActivityData.startDate = moment()
		.add(1, 'days')
		.format('YYYY-MM-DD');
	mdfActivityData.r_mdfReqToActs_c_mdfRequestId = mdfRequestId;

	return mdfActivityData;
}

export function getGeneratedDataFromBudget(
	parnterAccount: TAccount , mdfActivityId : number, 
): TMDFRequestBudget {
	const mdfBudgetData = mdfBudgetMock;

	mdfBudgetData.r_actToBgts_c_activityId= mdfActivityId;
	// mdfBudgetData.r_accToBgts_accountEntryERC = parnterAccount.externalReferenceCode;

	return mdfBudgetData;
}

export function getGeneratedDataFromClaim(parnterAccount: TAccount): TMDFClaim {
	const mdfClaimData = mdfClaimDataMock;

	mdfClaimData.companyName = parnterAccount.name;
	mdfClaimData.submitDate = new Date().toISOString();

	return mdfClaimData;
}

export function getGeneratedDataFromRequest(
	parnterAccount: TAccount
): TMDFRequestDataFromRequest {
	const mdfRequestData = mdfRequestDataMock;

	mdfRequestData.companyName = parnterAccount.name;
	mdfRequestData.maxDateActivity = moment()
		.add(2, 'days')
		.format('YYYY-MM-DD');
	mdfRequestData.minDateActivity = moment()
		.add(1, 'days')
		.format('YYYY-MM-DD');
	mdfRequestData.submitDate = new Date().toISOString();

	return mdfRequestData;
}
