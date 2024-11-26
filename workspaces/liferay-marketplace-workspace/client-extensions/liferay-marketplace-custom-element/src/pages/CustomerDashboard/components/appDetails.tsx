/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import './appDetails.css';
import ClayCard from '@clayui/card';
import ClayModal, { useModal } from '@clayui/modal';
import ClayIcon from '@clayui/icon';
import { useState } from 'react';
import ClayButton from '@clayui/button';
import { Liferay } from '../../../liferay/liferay';

const data = {
	appTitle: "My App",
	appIcon: 'https://placehold.co/120x120/orange/white',
	categories: [
		"Orders & fulfillment",
		"Inventory Management",
		"Customer Relations"
	],
	appType: "dxp",
	description: "This is a description for the app. It explains the features and capabilities of the app in detail. This is a description for the app. It explains the features and capabilities of the app in detail.",
	developerName: "John Doe",
	publishedDate: "January 1, 2024",
	supportedOfferings: "Web, iOS, Android",
	supportedVersions: "v1.0, v1.1, v1.2",
	edition: "Enterprise",
	exampleImages: [
		"https://placehold.co/1200x900/orange/white",
		"https://placehold.co/600x400?text=2",
		"https://placehold.co/600x400?text=3",
		"https://placehold.co/600x400?text=2",
		"https://placehold.co/600x400?text=3",
		"https://placehold.co/600x400?text=2",
		"https://placehold.co/600x400?text=3",
		"https://placehold.co/600x400?text=2",
		"https://placehold.co/600x400?text=3",
		"https://placehold.co/600x400?text=2",
		"https://placehold.co/600x400?text=3",
		"https://placehold.co/600x400?text=2",
		"https://placehold.co/600x400?text=3",
	],
	price: "$99.99/month",
	helpAndSupport: {
		publisherSupportLink: "https://support.example.com",
		visitLink: "https://www.example.com"
	},
	publisherSupport: {
		catalogName: "Liferay Labs",
		solutionHeaderImages: "https://via.placeholder.com/40x40",
		sanitizedUrl: "http://www.liferay.com/",
		publisherUrl: "http://www.liferay.com/",
		supportEmail: "support@liferay.com",
		supportPhone: "+1-800-123-4567"
	},
	shareLink: "https://www.example.com/sharelink",
};

const handleCopyLink = (href: string) => {
	if (href) {
		navigator.clipboard
			.writeText(href)
			.then(() => {
				Liferay.Util.openToast({
					message: "Link copied to clipboard!",
					type: "success",
				});
			})
			.catch(() => {
				Liferay.Util.openToast({
					message: "Failed to copy link!",
					type: "danger",
				});
			});
	}
};

const PublisherSupportModal = ({ onClose }: { onClose: () => void }) => {
	const { observer, onClose: closePublisherSupportModal } = useModal({
		onClose,
	});

	return (
		<ClayModal observer={observer} size="lg" center>
			<ClayModal.Header>Publisher Support Contact Info</ClayModal.Header>
			<ClayModal.Body>
				<div className="p-3">
					{data.publisherSupport.catalogName && (
						<div className="d-flex flex-row align-items-center mb-4">
							<span className="modal-icon mr-3 rounded-circle d-flex align-items-center justify-content-center ">
								{data.publisherSupport.solutionHeaderImages && data.publisherSupport.solutionHeaderImages.length > 0 ? (
									<img
										alt="Catalog Thumbnail"
										className="catalog-icon rounded-circle"
										src={data.publisherSupport.solutionHeaderImages}
									/>
								) : (
									<ClayIcon symbol="picture" />
								)}
							</span>
							<div className="d-flex flex-column">
								<h3>{data.publisherSupport.catalogName}</h3>
							</div>
						</div>
					)}

					{data.publisherSupport.sanitizedUrl && data.publisherSupport.publisherUrl && (
						<div className="d-flex flex-row align-items-center mb-4">
							<span className="modal-icon mr-3 rounded-circle d-flex align-items-center justify-content-center ">
								<ClayIcon symbol="globe" />
							</span>
							<div className="d-flex flex-column">
								<span className="text-black-50">Publisher website URL</span>
								<a href={data.publisherSupport.sanitizedUrl} target="_blank" className="modal-link">
									{data.publisherSupport.publisherUrl}
								</a>
							</div>
						</div>
					)}

					{data.publisherSupport.supportEmail && (
						<div className="d-flex flex-row align-items-center mb-4">
							<span className="modal-icon mr-3 rounded-circle d-flex align-items-center justify-content-center ">
								<ClayIcon symbol="envelope-closed" />
							</span>
							<div className="d-flex flex-column">
								<span className="text-black-50">Support Email</span>
								<a className="modal-link" href={`mailto:${data.publisherSupport.supportEmail}`} target="_blank">
									{data.publisherSupport.supportEmail}
								</a>
							</div>
						</div>
					)}

					{data.publisherSupport.supportPhone && (
						<div className="d-flex flex-row align-items-center mb-4">
							<span className="modal-icon mr-3 rounded-circle d-flex align-items-center justify-content-center ">
								<ClayIcon symbol="phone" />
							</span>
							<div className="d-flex flex-column">
								<span className="text-black-50">Phone</span>
								<a className="modal-link" href={`tel:${data.publisherSupport.supportPhone}`} target="_blank">
									{data.publisherSupport.supportPhone}
								</a>
							</div>
						</div>
					)}
				</div>

			</ClayModal.Body>

		</ClayModal>
	);
};

const Card = ({ title, description, isCommentCard, buttons }: any) => (
	<div>
		<ClayCard className="px-3 mb-2">
			<ClayCard.Body>
				<ClayCard.Description
					className={isCommentCard ? "card-title-description pb-1" : ""}
					displayType="title"
				>
					{title}
				</ClayCard.Description>
				<ClayCard.Description className="mt-3" displayType="text" truncate={false}>
					{description}
				</ClayCard.Description>
				{buttons && (
					<div className="mt-2 d-flex flex-wrap">
						{buttons.map((button: any, index: number) => (
							<div className="d-flex w-100 card-buttons align-items-center" key={index}>
								{button.leftIcon && (
									<ClayIcon className="mr-2" symbol={button.leftIcon} />
								)}
								<a
									className="d-flex justify-content-between align-items-center text-decoration-none w-100 text-reset"
									href={button.href}
									target="_blank"
									onClick={button.onClick}
								>
									<span className="text-truncate">{button.text}</span>
									{button.rightIcon && (
										<ClayIcon className="ml-2" symbol={button.rightIcon} />
									)}
								</a>
							</div>
						))}
					</div>
				)}
			</ClayCard.Body>
		</ClayCard>
	</div>
);

const Carousel = ({ images }: { images: string[] }) => {
	const [currentIndex, setCurrentIndex] = useState(0);

	const handleNext = () => setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
	const handlePrev = () => setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
	const handleSelectImage = (index: number) => setCurrentIndex(index);

	return (
		<div>
			<div className="carousel m-0 d-flex justify-content-center align-items-center rounded">
				<div className="carousel-border left" onClick={handlePrev}></div>
				<div className="carousel-images d-flex justify-content-between">
					<img className="carousel-image rounded" src={images[currentIndex]} alt={`Slide ${currentIndex}`} />
				</div>
				<div className="carousel-border right" onClick={handleNext}></div>
			</div>
			<div className="d-flex justify-content-start overflow-auto ">
				{images.map((image, index) => (
					<img
						key={index}
						className={`gallery-image mt-5 mb-2 mx-1 rounded ${index === currentIndex ? "selected" : ""}`}
						src={image}
						alt={`Thumbnail ${index}`}
						onClick={() => handleSelectImage(index)}
					/>
				))}
			</div>
		</div>
	);
};

const BodyModal = ({onClose}:any) => {
	const [publisherSupportModalVisible, setPublisherSupportModalVisible] = useState(false);

	return (
	<>
	<div>
				<ClayButton className="back-button mb-3" displayType="unstyled" onClick={onClose}>
					<ClayIcon symbol="angle-left" />
					Back to list
				</ClayButton>
				<div className="d-flex justify-content-between align-items-center">
					<div className="d-flex">
						<div className="app-icon">
							<img className="rounded" src={data.appIcon} alt="App Icon" />
						</div>
						<div className="d-flex flex-column justify-content-center ml-3">
							<h1 className="mb-1">{data.appTitle}</h1>
							<div className="d-flex align-items-center">
								{data.categories.map((category, index) => (
									<span key={index} className="category-tag p-1 mr-3">
										{category}
									</span>
								))}
								<div className="d-flex align-items-center app-type rounded p-1">
									<ClayIcon className="mr-2" symbol={data.appType === "dxp" ? "site-template" : "cloud"} />
									{data.appType === "dxp" ? "DXP App" : "Cloud App"}
								</div>
							</div>
						</div>
					</div>
					<div>
						<ClayButton className="rounded mt-3 ml-auto" >Install</ClayButton>
					</div>
				</div>
			</div>

			<div className="h-100 w-100 d-flex justify-content-between card-description-text mt-4">
				<div className="carousel-section">
					<Carousel images={data.exampleImages} />
					<div className="mt-4">
						<Card
							title="Description"
							description={data.description}
							isCommentCard
						/>
					</div>
				</div>

				{publisherSupportModalVisible &&
					<PublisherSupportModal onClose={() =>
						setPublisherSupportModalVisible(false)} />
				}

				<div className="ml-4 additional-cards">
					<Card title="DEVELOPER NAME" description={data.developerName} />
					<Card title="PUBLISHED DATE" description={data.publishedDate} />
					<Card title="SUPPORTED OFFERINGS" description={data.supportedOfferings} />
					<Card title="SUPPORTED VERSIONS" description={data.supportedVersions} />
					<Card title="EDITION" description={data.edition} />
					<Card title="PRICE" description={data.price} />
					<Card
						title="HELP & SUPPORT"
						buttons={[
							{
								text: "Publisher Support",
								leftIcon: "envelope-closed",
								onClick: () => setPublisherSupportModalVisible(true),
								rightIcon: "angle-right",
							},
							{
								text: "Visit Link",
								leftIcon: "document",
								href: data.helpAndSupport.visitLink,
								rightIcon: "angle-right",
							},
						]}
					/>
					<Card
						title="SHARE LINK"
						buttons={[
							{
								text: "Copy & Share",
								leftIcon: "link",
								onClick: () => handleCopyLink(data.shareLink),
							},
						]}
					/>
				</div>
			</div>
	</>
	)
};

export const ViewProduct = ({ onClose }: any) => {

	const { observer } = useModal();
	

	return (
		<ClayModal className="clay-modal-refector" observer={observer} size="full-screen">
			<ClayModal.Header>Marketplace</ClayModal.Header>
			<ClayModal.Body>
				<BodyModal onClose={onClose}/>
			</ClayModal.Body>
		</ClayModal>

	);
};