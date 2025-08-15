/**
 * External dependencies
 */
import classnames from 'classnames';
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Component } from '@wordpress/element';
import { ToggleControl, TextControl, SelectControl } from '@wordpress/components';
import { LEFT, RIGHT, UP, DOWN, BACKSPACE, ENTER } from '@wordpress/keycodes';
import { useState } from '@wordpress/element';
/**
 * Import Css
 */
import './editor.scss';
/**
 * Internal dependencies
 */
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
		value,
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
	} = props;

	const linkObj = value;

	const [isEditingLink, setIsEditingLink] = useState(false);
	const [isSettingsExpanded, setIsSettingsExpanded] = useState(false);
	const [urlInput, setUrlInput] = useState(null);

	const toggleSettingsVisibility = () => {
		setIsSettingsExpanded(!isSettingsExpanded);
	};

	const onReset = () => {
		onChange(undefined);
	};

	const advancedOptions = (
		<>
			{changeTargetType && (
				<>
					<SelectControl
						label={__('Link Target', 'kadence-blocks')}
						value={linkObj?.target || '_self'}
						options={[
							{ value: '_self', label: __('Same Tab/Window', 'kadence-blocks') },
							{ value: '_blank', label: __('Open in New Tab', 'kadence-blocks') },
							{ value: 'video', label: __('Video Popup', 'kadence-blocks') },
						]}
						onChange={(value) => onChange({ ...linkObj, target: value })}
					/>
					{linkObj?.target === 'video' && (
						<p>{__('NOTE: Video popup only works with youtube and vimeo links.', 'kadence-blocks')}</p>
					)}
				</>
			)}
			{!changeTargetType && (
				<ToggleControl
					label={__('Open in New Tab', 'kadence-blocks')}
					onChange={(value) => onChange({ ...linkObj, target: value ? '_blank' : '' })}
					checked={linkObj?.target === '_blank'}
				/>
			)}
			{changeFollow && (
				<ToggleControl
					label={__('No Follow', 'kadence-blocks')}
					onChange={(value) => onChange({ ...linkObj, noFollow: value })}
					checked={linkObj?.noFollow}
				/>
			)}
			{changeSponsored && (
				<ToggleControl
					label={__('Sponsored', 'kadence-blocks')}
					onChange={(value) => onChange({ ...linkObj, sponsored: value })}
					checked={linkObj?.sponsored}
				/>
			)}
			{changeDownload && (
				<ToggleControl
					label={__('Download', 'kadence-blocks')}
					onChange={(value) => onChange({ ...linkObj, download: value })}
					checked={linkObj?.download}
				/>
			)}
			{changeTitle && (
				<TextControl
					label={__('Title', 'kadence-blocks')}
					onChange={(value) => onChange({ ...linkObj, title: value })}
					value={linkObj?.title || ''}
					__next40pxDefaultSize
					className={'kbs-text-control'}
				/>
			)}
			{changeLinkClass && (
				<TextControl
					label={__('Link CSS Class', 'kadence-blocks')}
					onChange={(value) => onChange({ ...linkObj, className: value })}
					value={linkObj?.className || ''}
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
					reset={true}
					onReset={onReset}
					isAdvanced={isSettingsExpanded}
					onToggleView={toggleSettingsVisibility}
					hasAdvancedControls={true}
				/>
			)}
			<InputSearch
				{...props}
				url={linkObj?.url || ''}
				onChange={(url) => onChange({ ...linkObj, url })}
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
