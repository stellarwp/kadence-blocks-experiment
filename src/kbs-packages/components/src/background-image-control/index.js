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
		setIsAdvanced = () => {},
		advancedControls = [],
		isCustom = false,
		setIsCustom = () => {},
		hasCustomControls = false,
		previewDevice = 'Desktop',
		forStyleBook = false,
		defaultValue,
		customOnChange,
	} = props;
	/*
	Background Attributes
	backgroundImage
	backgroundImageId
	backgroundPosition
	backgroundSize
	backgroundRepeat
	backgroundAttachment
	 */
	const inherited = getInheritedDeviceValue(attributeName, attributes, previewDevice, meta, '', globalStylesIds);
	const onReset = () => {
		handleMultipleAttributeChange(
			[undefined, undefined, undefined, undefined, undefined, undefined],
			previewDevice === 'Desktop' ? 'all' : previewDevice,
			attributeName,
			attributes,
			setAttributes,
			customOnChange,
			[
				'backgroundImage',
				'backgroundImageId',
				'backgroundPosition',
				'backgroundSize',
				'backgroundRepeat',
				'backgroundAttachment',
			],
			meta
		);
	};
	const onChange = (value, device, type) => {
		handleAttributeChange(value, device, attributeName, attributes, setAttributes, customOnChange, type, meta);
	};
	const hasImage = inherited?.inheritedValue?.backgroundImage;
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
					hasSizeControls={true}
					hasClearControls={false}
				/>
				{hasImage && (
					<>
						<FocalPointPicker
							className="kbs-focal-point-picker kbs-image-control__focal-point-picker"
							url={inherited?.inheritedValue?.backgroundImage}
							value={inherited?.inheritedValue?.backgroundPosition}
							onChange={(position) => onChange(position, previewDevice, 'position')}
						/>
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
						{inherited?.inheritedValue?.size && inherited?.inheritedValue?.size !== 'cover' && (
							<RadioButtonControl
								label={__('Background Repeat', 'kadence-blocks')}
								attributes={attributes}
								setAttributes={setAttributes}
								attributeName={attributeName}
								type={'repeat'}
								meta={meta}
								previewDevice={previewDevice}
								view={'normal'}
								hasCustomControls={false}
							/>
						)}
						<RadioButtonControl
							label={__('Background Attachment', 'kadence-blocks')}
							attributes={attributes}
							setAttributes={setAttributes}
							attributeName={attributeName}
							type={'attachment'}
							meta={meta}
							previewDevice={previewDevice}
							view={'normal'}
							hasCustomControls={false}
						/>
					</>
				)}
			</div>
		</div>
	);
}
