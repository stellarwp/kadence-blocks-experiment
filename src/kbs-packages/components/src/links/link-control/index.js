/**
 * External dependencies
 */
import classnames from 'classnames';
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Component, useState } from '@wordpress/element';
import { ToggleControl, TextControl, SelectControl } from '@wordpress/components';
import { LEFT, RIGHT, UP, DOWN, BACKSPACE, ENTER } from '@wordpress/keycodes';
/**
 * Import Css
 */
import './editor.scss';
/**
 * Internal dependencies
 */
import { getDeviceValue, getInheritedDeviceValue, handleAttributeChange, getResolvedValue } from '@kadence/kbsHelpers';
import InputSearch from '../input-search';
import TitleBar from '../../title-bar';
/**
 * Build the typography controls
 * @returns {object} typography settings.
 */
export default function LinkControl(props) {
	const {
		label,
		onChange,
		additionalControls = true,
		changeTargetType = true,
		changeFollow = true,
		changeSponsored = true,
		changeDownload = true,
		changeTitle = true,
		changeLinkClass = true,
		allowClear = true,
		dynamicAttribute = '',
		attributes,
		attributeName,
		setAttributes,
		defaultValue,
		reset = true,
		previewDevice = 'none',
		meta,
		globalStylesIds,
	} = props;

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

	const [isEditingLink, setIsEditingLink] = useState(false);
	const [isSettingsExpanded, setIsSettingsExpanded] = useState(false);
	const [urlInput, setUrlInput] = useState(null);

	const defaultOnChange = (value, device, type) => {
		handleAttributeChange(value, device, attributeName, attributes, setAttributes, onChange, type, meta);
	};

	const onChangeToUse = onChange ?? defaultOnChange;

	const toggleSettingsVisibility = () => {
		setIsSettingsExpanded(!isSettingsExpanded);
	};

	const onReset = () => {
		let resetValue;
		if (defaultValue) {
			resetValue = defaultValue;
		}
		setAttributes({ [attributeName]: resetValue });
	};

	const advancedOptions = (
		<>
			{changeTargetType && (
				<>
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
				</>
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
					__next40pxDefaultSize
					className={'kbs-text-control'}
				/>
			)}
			{changeLinkClass && (
				<TextControl
					label={__('Link CSS Class', 'kadence-blocks')}
					onChange={(value) => onChangeToUse(value, previewDevice, 'className')}
					value={classNameValue}
					__next40pxDefaultSize
					className={'kbs-text-control'}
				/>
			)}
		</>
	);

	return (
		<div
			className={`components-base-control kbs-side-link-control${dynamicAttribute && window?.kbs_params?.dynamic_enabled ? ' has-dynamic-support' : ''}`}
		>
			{label && (
				<TitleBar
					label={label}
					reset={reset}
					onReset={onReset}
					isAdvanced={isSettingsExpanded}
					onToggleView={toggleSettingsVisibility}
					hasAdvancedControls={true}
				/>
			)}
			<InputSearch
				{...props}
				url={urlValue}
				onChange={(value) => onChangeToUse(value, previewDevice, 'url')}
				attributes={attributes}
				dynamicAttribute={dynamicAttribute}
				additionalControls={additionalControls}
				advancedOptions={advancedOptions}
				isSettingsExpanded={isSettingsExpanded}
				onExpandSettings={toggleSettingsVisibility}
				allowClear={allowClear}
				showAdditionalToggle={false}
			/>
		</div>
	);
}
