/**
 * External dependencies
 */
import { find, map } from 'lodash';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useRef, useState, useCallback } from '@wordpress/element';
import {
	ToolbarButton,
	Button,
	NavigableMenu,
	MenuItem,
	ToggleControl,
	TextControl,
	SVG,
	Path,
} from '@wordpress/components';
import { URLPopover } from '@wordpress/block-editor';
import { link as linkIcon, close } from '@wordpress/icons';
import { Fragment } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { getResolvedValue, handleAttributeChange, handleMultipleAttributeChange } from '@kadence/kbsHelpers';

const LINK_DESTINATION_NONE = 'none';
const LINK_DESTINATION_CUSTOM = 'custom';
const LINK_DESTINATION_MEDIA = 'media';
const LINK_DESTINATION_ATTACHMENT = 'attachment';

const icon = (
	<SVG viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
		<Path d="M0,0h24v24H0V0z" fill="none" />
		<Path d="m19 5v14h-14v-14h14m0-2h-14c-1.1 0-2 0.9-2 2v14c0 1.1 0.9 2 2 2h14c1.1 0 2-0.9 2-2v-14c0-1.1-0.9-2-2-2z" />
		<Path d="m14.14 11.86l-3 3.87-2.14-2.59-3 3.86h12l-3.86-5.14z" />
	</SVG>
);

const LinkControlToolbar = ({
	linkDestination = 'none',
	mediaType = 'image',
	mediaUrl,
	mediaLink,
	additionalControls = true,
	changeTargetType = false,
	changeFollow = true,
	changeSponsored = true,
	changeDownload = true,
	changeTitle = true,
	changeLinkClass = true,
	attributeName,
	attributes,
	setAttributes,
	onChange,
	previewDevice = 'none',
	meta,
	globalStylesIds,
}) => {
	// Get individual resolved values for each link property
	const urlResolvedValue = getResolvedValue(attributeName, attributes, previewDevice, meta, 'url', globalStylesIds);
	const targetResolvedValue = getResolvedValue(
		attributeName,
		attributes,
		previewDevice,
		meta,
		'target',
		globalStylesIds
	);
	const noFollowResolvedValue = getResolvedValue(
		attributeName,
		attributes,
		previewDevice,
		meta,
		'noFollow',
		globalStylesIds
	);
	const sponsoredResolvedValue = getResolvedValue(
		attributeName,
		attributes,
		previewDevice,
		meta,
		'sponsored',
		globalStylesIds
	);
	const downloadResolvedValue = getResolvedValue(
		attributeName,
		attributes,
		previewDevice,
		meta,
		'download',
		globalStylesIds
	);
	const titleResolvedValue = getResolvedValue(
		attributeName,
		attributes,
		previewDevice,
		meta,
		'title',
		globalStylesIds
	);
	const classNameResolvedValue = getResolvedValue(
		attributeName,
		attributes,
		previewDevice,
		meta,
		'className',
		globalStylesIds
	);

	// Extract applied values
	const urlValue = urlResolvedValue?.appliedValue || '';
	const targetValue = targetResolvedValue?.appliedValue || '_self';
	const noFollowValue = noFollowResolvedValue?.appliedValue || false;
	const sponsoredValue = sponsoredResolvedValue?.appliedValue || false;
	const downloadValue = downloadResolvedValue?.appliedValue || false;
	const titleValue = titleResolvedValue?.appliedValue || '';
	const classNameValue = classNameResolvedValue?.appliedValue || '';

	// Default onChange function
	const defaultOnChange = (value, device, type) => {
		handleAttributeChange(value, device, attributeName, attributes, setAttributes, onChange, type, meta);
	};

	const onChangeToUse = onChange ?? defaultOnChange;

	const [isOpen, setIsOpen] = useState(false);
	const openLinkUI = useCallback(() => {
		setIsOpen(true);
	});

	const [isEditingLink, setIsEditingLink] = useState(false);
	const [urlInput, setUrlInput] = useState(null);

	const autocompleteRef = useRef(null);

	const startEditLink = useCallback(() => {
		if (linkDestination === LINK_DESTINATION_MEDIA || linkDestination === LINK_DESTINATION_ATTACHMENT) {
			setUrlInput('');
		}
		setIsEditingLink(true);
	});

	const stopEditLink = useCallback(() => {
		setIsEditingLink(false);
	});

	const closeLinkUI = useCallback(() => {
		setUrlInput(null);
		stopEditLink();
		setIsOpen(false);
	});

	const onFocusOutside = useCallback(() => {
		return (event) => {
			// The autocomplete suggestions list renders in a separate popover (in a portal),
			// so onFocusOutside fails to detect that a click on a suggestion occurred in the
			// LinkContainer. Detect clicks on autocomplete suggestions using a ref here, and
			// return to avoid the popover being closed.
			const autocompleteElement = autocompleteRef.current;
			if (autocompleteElement && autocompleteElement.contains(event.target)) {
				return;
			}
			setIsOpen(false);
			setUrlInput(null);
			stopEditLink();
		};
	});

	const onSubmitLinkChange = useCallback(() => {
		return (event) => {
			if (urlInput) {
				// It is possible the entered URL actually matches a named link destination.
				// This check will ensure our link destination is correct.
				const selectedDestination =
					getLinkDestinations().find((destination) => destination.url === urlInput)?.linkDestination ||
					LINK_DESTINATION_CUSTOM;
				handleMultipleAttributeChange(
					[urlInput, selectedDestination],
					previewDevice,
					attributeName,
					attributes,
					setAttributes,
					onChange,
					['url', 'linkDestination'],
					meta
				);
			}
			stopEditLink();
			setUrlInput(null);
			event.preventDefault();
		};
	});

	const onLinkRemove = useCallback(() => {
		handleMultipleAttributeChange(
			['', LINK_DESTINATION_NONE],
			previewDevice,
			attributeName,
			attributes,
			setAttributes,
			onChange,
			['url', 'linkDestination'],
			meta
		);
	});

	const getLinkDestinations = () => {
		const linkDestinations = [
			{
				linkDestination: LINK_DESTINATION_MEDIA,
				title: __('Media File'),
				url: mediaType === 'image' ? mediaUrl : undefined,
				icon,
			},
		];
		if (mediaType === 'image' && mediaLink) {
			linkDestinations.push({
				linkDestination: LINK_DESTINATION_ATTACHMENT,
				title: __('Attachment Page'),
				url: mediaType === 'image' ? mediaLink : undefined,
				icon: (
					<SVG viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
						<Path d="M0 0h24v24H0V0z" fill="none" />
						<Path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zM6 20V4h7v5h5v11H6z" />
					</SVG>
				),
			});
		}
		return linkDestinations;
	};

	const onSetHref = (value) => {
		const linkDestinations = getLinkDestinations();
		let linkDestinationInput;
		if (!value) {
			linkDestinationInput = LINK_DESTINATION_NONE;
		} else {
			linkDestinationInput = (
				find(linkDestinations, (destination) => {
					return destination.url === value;
				}) || { linkDestination: LINK_DESTINATION_CUSTOM }
			).linkDestination;
		}
		handleMultipleAttributeChange(
			[value, linkDestinationInput],
			previewDevice,
			attributeName,
			attributes,
			setAttributes,
			onChange,
			['url', 'linkDestination'],
			meta
		);
	};

	const advancedOptions = (
		<Fragment>
			{changeTargetType && (
				<Fragment>
					<SelectControl
						label={__('Link Target', 'kadence-blocks')}
						value={targetValue}
						options={[
							{ value: '_self', label: __('Same Tab/Window', 'kadence-blocks') },
							{ value: '_blank', label: __('Open in New Tab', 'kadence-blocks') },
							{ value: 'video', label: __('Video Popup', 'kadence-blocks') },
						]}
						onChange={(value) => onChangeToUse(value, previewDevice, 'target')}
					/>
					{targetValue === 'video' && (
						<p>{__('NOTE: Video popup only works with youtube and vimeo links.', 'kadence-blocks')}</p>
					)}
				</Fragment>
			)}
			{!changeTargetType && (
				<ToggleControl
					label={__('Open in New Tab', 'kadence-blocks')}
					onChange={(value) => onChangeToUse(value ? '_blank' : '', previewDevice, 'target')}
					checked={targetValue === '_blank'}
				/>
			)}
			{changeFollow && (
				<ToggleControl
					label={__('No Follow', 'kadence-blocks')}
					onChange={(value) => onChangeToUse(value, previewDevice, 'noFollow')}
					checked={noFollowValue}
				/>
			)}
			{changeSponsored && (
				<ToggleControl
					label={__('Sponsored', 'kadence-blocks')}
					onChange={(value) => onChangeToUse(value, previewDevice, 'sponsored')}
					checked={sponsoredValue}
				/>
			)}
			{changeDownload && (
				<ToggleControl
					label={__('Download', 'kadence-blocks')}
					onChange={(value) => onChangeToUse(value, previewDevice, 'download')}
					checked={downloadValue}
				/>
			)}
			{changeTitle && (
				<TextControl
					label={__('Title', 'kadence-blocks')}
					onChange={(value) => onChangeToUse(value, previewDevice, 'title')}
					value={titleValue}
				/>
			)}
			{changeLinkClass && (
				<TextControl
					label={__('Link CSS Class', 'kadence-blocks')}
					onChange={(value) => onChangeToUse(value, previewDevice, 'className')}
					value={classNameValue}
				/>
			)}
		</Fragment>
	);

	const linkEditorValue = urlInput !== null ? urlInput : urlValue;

	const urlLabel = (find(getLinkDestinations(), ['linkDestination', linkDestination]) || {}).title;

	return (
		<>
			<ToolbarButton
				icon={linkIcon}
				className="components-toolbar__control"
				label={urlValue ? __('Edit link') : __('Insert link')}
				aria-expanded={isOpen}
				onClick={openLinkUI}
			/>
			{isOpen && (
				<URLPopover
					onFocusOutside={onFocusOutside()}
					onClose={closeLinkUI}
					renderSettings={() => (additionalControls ? advancedOptions : '')}
					additionalControls={
						!linkEditorValue && (
							<NavigableMenu>
								{map(getLinkDestinations(), (link) => (
									<MenuItem
										key={link.linkDestination}
										icon={link.icon}
										onClick={() => {
											setUrlInput(null);
											onSetHref(link.url);
											stopEditLink();
										}}
									>
										{link.title}
									</MenuItem>
								))}
							</NavigableMenu>
						)
					}
				>
					{(!urlValue || isEditingLink) && (
						<URLPopover.LinkEditor
							className="block-editor-format-toolbar__link-container-content"
							value={linkEditorValue}
							onChangeInputValue={setUrlInput}
							onSubmit={onSubmitLinkChange()}
							autocompleteRef={autocompleteRef}
						/>
					)}
					{urlValue && !isEditingLink && (
						<>
							<URLPopover.LinkViewer
								className="block-editor-format-toolbar__link-container-content"
								url={urlValue}
								onEditLinkClick={startEditLink}
								urlLabel={urlLabel}
							/>
							<Button icon={close} label={__('Remove link')} onClick={onLinkRemove} />
						</>
					)}
				</URLPopover>
			)}
		</>
	);
};

export default LinkControlToolbar;
