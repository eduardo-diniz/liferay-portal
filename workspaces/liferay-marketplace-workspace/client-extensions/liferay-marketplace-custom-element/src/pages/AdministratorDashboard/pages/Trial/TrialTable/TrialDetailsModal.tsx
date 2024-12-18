/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayBadge from '@clayui/badge';
import ClayIcon from '@clayui/icon';
import {formatDistance} from 'date-fns';

import i18n from '../../../../../i18n';

const getTrialStatus = (trial: Order) => {
	if (trial?.orderStatusInfo?.label === 'Processing') {
		return 'Active';
	}

	return 'Inactive';
};

type TrialDetailsModalProps = {
	selectedTrial: Order;
}

const TrialDetailsModal = ({selectedTrial}: TrialDetailsModalProps) => {
	const customFields = selectedTrial?.customFields || {};

	return (
		<div className="d-flex flex-column">
			<div className="row">
				<div className="col-12 col-md-6">
					<div className="align-items-center d-flex mb-2">
						<ClayIcon className="mr-2" symbol="cloud" />
						<span className="font-weight-bold mr-1">
							Cloud Provisioning
						</span>
						{customFields['cloud-provisioning'] || 'N/A'}
					</div>
					<div className="align-items-center d-flex mb-2">
						<ClayIcon className="mr-2" symbol="calendar" />
						<span className="font-weight-bold mr-1">
							{i18n.translate('start-date')}:
						</span>
						{customFields['trial-start-date'] || 'N/A'}
					</div>
					<div className="align-items-center d-flex mb-2">
						<ClayIcon className="mr-2" symbol="date" />
						<span className="font-weight-bold mr-1">
							Trial End Date:
						</span>
						{customFields['trial-end-date'] &&
							formatDistance(
								new Date(customFields['trial-end-date']),
								Date.now(),
								{addSuffix: true}
							)}
					</div>
					{customFields['trial-error'] && (
						<div className="d-flex mb-2">
							<div className="">
								<ClayIcon
									className="mr-2"
									symbol="exclamation-full"
								/>
								<span className="font-weight-bold mr-1">
									Trial Error:
								</span>
							</div>
							<details>
								<summary>Show Error</summary>
								<code>{customFields['trial-error']}</code>
							</details>
						</div>
					)}
				</div>
				<div className="col-12 col-md-6">
					<div className="align-items-center d-flex mb-2">
						<ClayIcon className="mr-2" symbol="envelope-closed" />
						<span className="font-weight-bold mr-1">
							Send notification email:
						</span>
						{JSON.parse(customFields['trial-settings'] || '{}')
							.sendNotificationEmail
							? 'Yes'
							: 'No'}
					</div>
					<div className="align-items-center d-flex mb-2">
						<ClayIcon className="mr-2" symbol="globe" />
						<span className="font-weight-bold mr-1">
							Trial-virtualhost:
						</span>
						<a href={customFields['trial-virtualhost']}>
							{customFields['trial-virtualhost']}
						</a>
					</div>
					<div className="align-items-center d-flex mb-2">
						<ClayIcon className="mr-2" symbol="globe" />
						<span className="font-weight-bold mr-1">
							Active Trial:
						</span>
						{getTrialStatus(selectedTrial)}
					</div>
				</div>
			</div>
			<div className="row">
				<div className="col-12 col-md-6"></div>
				<div className="col-12">
					<div className="align-items-center d-flex mb-2">
						<ClayIcon className="mr-2" symbol="envelope-open" />
						<span className="font-weight-bold mr-1">
							Invite email addresses:
						</span>
					</div>
					<div className="d-flex flex-wrap">
						{JSON.parse(
							customFields['trial-settings'] || '{}'
						).inviteEmailAddresses?.map(
							(email: string, index: number) => (
								<ClayBadge
									displayType="info"
									key={index}
									label={email}
								/>
							)
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default TrialDetailsModal;
