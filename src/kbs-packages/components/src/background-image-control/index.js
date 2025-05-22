/**
 * External dependencies
 */
import clsx from 'clsx';
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useRef, useMemo, useEffect } from '@wordpress/element';
import { plusCircleFilled, closeSmall, image } from '@wordpress/icons';
import { MediaUpload } from '@wordpress/block-editor';
/**
 * Internal dependencies
 */
import {
	getDeviceValue,
	getInheritedDeviceValue,
	handleMultipleAttributeChange,
	handleAttributeChange,
} from '@kadence/kbsHelpers';
import TitleBar from '../title-bar';
import ImageControl from '../image-control';
import FocalPointPicker from '../focal-point-picker';
import ImageSizeControl from '../image-size-control';
import RadioButtonControl from '../radio-button-control';
import './editor.scss';

export default function BackgroundImageControl(props) {
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
		isAdvanced = false,
		advancedControls = [],
		isCustom = false,
		hasCustomControls = false,
		previewDevice = 'desktop',
		forStyleBook = false,
		defaultValue,
		customOnChange,
	} = props;
	/*
	Background Attributes
	image
	imageId
	imagePosition
	imageSize
	imageRepeat
	imageAttachment
	 */
	const idAttribute = type + 'Id';
	const backgroundValue = getDeviceValue(attributeName, attributes, previewDevice);
	const inherited = getInheritedDeviceValue(attributeName, attributes, previewDevice, meta, '', globalStylesIds);
	const onReset = () => {
		handleMultipleAttributeChange(
			[undefined, undefined, undefined, undefined, undefined, undefined],
			previewDevice === 'Desktop' ? 'all' : previewDevice,
			attributeName,
			attributes,
			setAttributes,
			customOnChange,
			['image', 'imageId', 'imagePosition', 'imageSize', 'imageRepeat', 'imageAttachment'],
			meta
		);
	};
	const onRemoveImage = (device) => {
		onChange([undefined, undefined], device, [type, idAttribute]);
	};
	const onImageSelect = (value, device) => {
		if (value?.url) {
			if (value?.id) {
				onChange([value?.url, value?.id], device, [type, idAttribute]);
			} else {
				onChange([value?.url, undefined], device, [type, idAttribute]);
			}
		} else {
			onChange([undefined, undefined], device, [type, idAttribute]);
		}
	};
	const onChange = (value, device, type) => {
		handleAttributeChange(value, device, attributeName, attributes, setAttributes, customOnChange, type, meta);
	};
	useEffect(() => {
		//console.log('backgroundValue', backgroundValue);
		// console.log('inherited', inherited);
	}, [backgroundValue, inherited]);
	const classes = clsx('kbs-image-control', {
		[`kbs-image-select-type-${type}`]: type,
	});
	const hasImage = inherited?.inheritedValue?.image;
	return (
		<div className={`components-base-control kbs-control kbs-image-control`}>
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
				<ImageControl
					label={''}
					attributes={attributes}
					type={'image'}
					setAttributes={setAttributes}
					attributeName={attributeName}
					meta={meta}
					previewDevice={previewDevice}
					globalStylesIds={globalStylesIds}
					dynamicAttribute={attributeName + ':image'}
				/>
				{hasImage && (
					<FocalPointPicker
						__nextHasNoMarginBottom
						className="kbs-image-control__focal-point-picker"
						url={inherited?.inheritedValue?.image}
						value={inherited?.inheritedValue?.imagePosition}
						onChange={(position) => onChange(position, previewDevice, 'imagePosition')}
					/>
				)}
				{inherited?.inheritedValue?.imageId && (
					<ImageSizeControl
						label={__('Image File Size', 'kadence-blocks')}
						id={inherited?.inheritedValue?.imageId}
						url={inherited?.inheritedValue?.image}
						onChange={(newImage) => {
							onChange(newImage.value, previewDevice, 'image');
						}}
					/>
				)}
				{hasImage && (
					<RadioButtonControl
						label={__('Background Size', 'kadence-blocks')}
						attributes={attributes}
						setAttributes={setAttributes}
						attributeName={attributeName}
						type={'size'}
						meta={meta}
						previewDevice={previewDevice}
						view={'normal'}
						hasCustomControls={true}
					/>
				)}
			</div>
		</div>
	);
}
