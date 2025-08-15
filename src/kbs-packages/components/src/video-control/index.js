/**
 * External dependencies
 */
import clsx from 'clsx';
/**
 * WordPress dependencies
 */
import { Icon, Dropdown, ColorIndicator, Button, HStack, FlexItem, TabPanel } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useRef, useMemo, useEffect, useState } from '@wordpress/element';
import { plusCircleFilled, closeSmall, image } from '@wordpress/icons';
import { MediaUpload } from '@wordpress/block-editor';
/**
 * Internal dependencies
 */
import { getDeviceValue, getInheritedDeviceValue, handleMultipleAttributeChange } from '@kadence/kbsHelpers';
import TitleBar from '../title-bar';
import MediaPlaceholder from '../media-placeholder';
import DynamicImageControl from '../dynamic-image';
import VideoSelector from './video-selector';
import './editor.scss';

export default function ImageControl(props) {
	const {
		attributes,
		setAttributes,
		attributeName,
		meta,
		type,
		globalStylesIds,
		reset = true,
		label,
		hasDeviceControls = false,
		isAdvanced: initialIsAdvanced = false,
		advancedControls = [],
		isCustom: initialIsCustom = false,
		hasCustomControls = false,
		previewDevice = 'desktop',
		forStyleBook = false,
		defaultValue,
		customOnChange,
		hasSizeControls = false,
		hasClearControls = true,
		dynamicAttribute = '',
	} = props;

	// Local state for advanced and custom toggles
	const [isAdvanced, setIsAdvanced] = useState(initialIsAdvanced);
	const [isCustom, setIsCustom] = useState(initialIsCustom);
	const idAttribute = type + 'Id';
	const inherited = getInheritedDeviceValue(attributeName, attributes, previewDevice, meta, '', globalStylesIds);
	const videoID = inherited?.inheritedValue?.[idAttribute];
	const onReset = () => {
		let resetValue;
		if (defaultValue) {
			resetValue = defaultValue;
		}
		onChange([resetValue, undefined], previewDevice === 'Desktop' ? 'all' : previewDevice, [type, idAttribute]);
	};
	const onChange = (value, device, type) => {
		handleMultipleAttributeChange(
			value,
			device,
			attributeName,
			attributes,
			setAttributes,
			customOnChange,
			type,
			meta
		);
	};
	const videoURL = type ? inherited?.inheritedValue?.video : inherited?.inheritedValue;
	return (
		<div className={`components-base-control kbs-control kbs-video-control`}>
			{label && (
				<TitleBar
					label={label}
					reset={reset}
					onReset={onReset}
					hasDeviceControls={hasDeviceControls}
					isAdvanced={isAdvanced}
					onToggleView={() => setIsAdvanced(!isAdvanced)}
					hasAdvancedControls={advancedControls && advancedControls.length > 0}
					isCustom={isCustom}
					onToggleCustom={() => setIsCustom(!isCustom)}
					hasCustomControls={hasCustomControls}
				/>
			)}
			<div className="kbs-control-inner">
				<VideoSelector
					onChange={onChange}
					type={type}
					previewDevice={previewDevice}
					hasClearControls={hasClearControls}
					dynamicAttribute={dynamicAttribute}
					videoURL={videoURL}
					videoID={videoID}
					dynamicVideo={dynamicAttribute}
					{...props}
				/>
			</div>
		</div>
	);
}
