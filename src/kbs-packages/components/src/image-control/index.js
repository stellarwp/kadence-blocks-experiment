/**
 * External dependencies
 */
import clsx from 'clsx';
/**
 * WordPress dependencies
 */
import { Icon, Dropdown, ColorIndicator, Button, HStack, FlexItem, TabPanel } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useRef, useMemo, useEffect } from '@wordpress/element';
import { plusCircleFilled, closeSmall, image } from '@wordpress/icons';
import { MediaUpload } from '@wordpress/block-editor';
/**
 * Internal dependencies
 */
import { getDeviceValue, getInheritedDeviceValue, handleMultipleAttributeChange } from '@kadence/kbsHelpers';
import TitleBar from '../title-bar';
import MediaPlaceholder from '../media-placeholder';
import DynamicImageControl from '../dynamic-image';
import ImageSizeControl from '../image-size-control';
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
		isAdvanced = false,
		setIsAdvanced = () => {},
		advancedControls = [],
		isCustom = false,
		setIsCustom = () => {},
		hasCustomControls = false,
		previewDevice = 'Desktop',
		forStyleBook = false,
		defaultValue,
		customOnChange,
		hasSizeControls = false,
		hasClearControls = true,
		dynamicAttribute = '',
	} = props;
	const idAttribute = type + 'Id';
	const inherited = getInheritedDeviceValue(attributeName, attributes, previewDevice, meta, '', globalStylesIds);
	const imageID = inherited?.inheritedValue?.[idAttribute];
	const onReset = () => {
		let resetValue;
		if (defaultValue) {
			resetValue = defaultValue;
		}
		onChange([resetValue, undefined], previewDevice === 'Desktop' ? 'all' : previewDevice, [type, idAttribute]);
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
	const classes = clsx('kbs-image-control', {
		[`kbs-image-select-type-${type}`]: type,
	});
	const hasImage = type ? inherited?.inheritedValue?.image : inherited?.inheritedValue;
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
				{!hasImage && (
					<MediaPlaceholder
						labels={''}
						selectIcon={plusCircleFilled}
						selectLabel={__('Select Image', 'kadence-blocks')}
						onSelect={(img) => {
							onImageSelect(img, previewDevice);
						}}
						onSelectURL={(newURL) => onImageSelect({ url: newURL }, previewDevice)}
						accept="image/*"
						className={'kbs-image-upload-placeholder'}
						allowedTypes={'image'}
						disableMediaButtons={false}
						dynamicControl={
							dynamicAttribute && kbs_params.dynamic_enabled ? (
								<DynamicImageControl {...props} />
							) : undefined
						}
					/>
				)}
				{hasImage && (
					<>
						{dynamicAttribute &&
						kbs_params.dynamic_enabled &&
						attributes?.kadenceDynamic?.[dynamicAttribute]?.enable ? (
							<div className="kb-dynamic-image-sidebar-top">
								<DynamicImageControl
									startOpen={attributes?.kadenceDynamic?.[dynamicAttribute]?.field ? false : true}
									{...props}
								/>
							</div>
						) : (
							<div className="kbs-image-edit-wrap">
								<MediaUpload
									onSelect={(img) => onImageSelect(img, previewDevice)}
									type="image"
									value={imageID ? imageID : ''}
									render={({ open }) => (
										<Button
											className={'kbs-upload-edit-btn'}
											variant="secondary"
											onClick={open}
											icon={image}
										>
											{__('Edit Image', 'kadence-blocks')}
										</Button>
									)}
								/>
								{hasClearControls && (
									<Button
										icon={closeSmall}
										label={__('Remove Image', 'kadence-blocks')}
										className={'kbs-upload-remove-btn'}
										variant="secondary"
										onClick={() => onRemoveImage(previewDevice)}
									/>
								)}
								{hasSizeControls && imageID && (
									<ImageSizeControl
										buttonMode={true}
										id={inherited?.inheritedValue?.imageId}
										url={inherited?.inheritedValue?.image}
										onChange={(newImage) => {
											onImageSelect({ url: newImage.value, id: imageID }, previewDevice);
										}}
									/>
								)}
								{dynamicAttribute && kbs_params.dynamic_enabled && <DynamicImageControl {...props} />}
							</div>
						)}
					</>
				)}
			</div>
		</div>
	);
}
