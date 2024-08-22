/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import OAuth2Client from '../../../../../../../common/services/liferay/oauth2/OAuth2Client';

export default class PartnerSpringBootOAuth2 extends OAuth2Client {
	constructor() {
		super('liferay-partner-etc-spring-boot-oauth-application-user-agent');
	}

	async handleFileUpload(
		liferayFile: any
	): Promise<{isValid: boolean; text: string}> {
		const formData = new FormData();

		formData.append('file', liferayFile);

		try {
			const response = await this.oAuth2Client.fetch(
				'/file-validation/validate',
				{
					body: formData,
					method: 'POST',
				}
			);

			const responseText = await response.text();

			if (response.ok) {
				return {isValid: true, text: responseText};
			}

			return {isValid: false, text: responseText};
		}
		catch (error) {
			console.error('Error validating the file:', error);

			return {
				isValid: false,
				text: 'Error validating the file. Please try again.',
			};
		}
	}
}
