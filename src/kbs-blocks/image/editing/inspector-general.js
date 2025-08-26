/**
 * BLOCK: Kadence Column
 *
 * Registering a basic block with Gutenberg.
 */

/**
 * Kadence Components.
 */
import {
	ToolsPanelBody,
	SelectGlobalStyles,
	FlexBoxControl,
	PresetControl,
	ImageControl,
	FocalPointPicker,
	RadioButtonControl,
	ToggleControl,
	SelectBasicControl,
	RangeControl,
	TextControl,
	LinkControl,
} from '@kadence/kbsComponents';

import { getResolvedValue } from '@kadence/kbsHelpers';

import metadata from '../block.json';
/**
 * Import WordPress
 */
import { __ } from '@wordpress/i18n';
import { ExternalLink } from '@wordpress/components';

/**
 * Build the section edit.
 */
export default function InspectorGeneral(props) {
	const {
		attributes,
		setAttributes,
		previewDevice,
		isSelected,
		clientId,
		context,
		className,
		globalStylesIds,
		hasImage,
	} = props;

	const { link } = attributes;

	const imageResolvedValue = getResolvedValue('image', attributes, 'none', metadata, 'image', globalStylesIds);
	const objectPositionResolvedValue = getResolvedValue(
		'objectPosition',
		attributes,
		'none',
		metadata,
		'objectPosition',
		globalStylesIds
	);
	const aspectRatioAnyResolvedValue = getResolvedValue(
		'aspectRatio',
		attributes,
		'any',
		metadata,
		'aspectRatio',
		globalStylesIds
	);
	const altDynamicAnyResolvedValue = getResolvedValue(
		'alt',
		attributes,
		'any',
		metadata,
		'dynamicAlt',
		globalStylesIds
	);
	const hasDynamicAlt = altDynamicAnyResolvedValue?.appliedValue;

	return (
		<>
			<ToolsPanelBody>
				<PresetControl
					label={__('Image Presets', 'kadence-blocks')}
					type={'imageVariant'}
					attributes={attributes}
					setAttributes={setAttributes}
					attributeName={'variant'}
					metaData={metadata}
					previewDevice={'none'}
					globalStylesIds={globalStylesIds}
					isBundlePreset={true}
				/>
			</ToolsPanelBody>
			<ToolsPanelBody>
				<ImageControl
					label={''}
					attributes={attributes}
					type={'image'}
					setAttributes={setAttributes}
					attributeName={'image'}
					meta={metadata}
					previewDevice={'none'}
					globalStylesIds={globalStylesIds}
					dynamicAttribute={'image' + ':image'}
					hasSizeControls={true}
					hasClearControls={false}
				/>
				<SelectBasicControl
					label={__('Aspect Ratio', 'kadence-blocks')}
					attributeName={'aspectRatio'}
					attributes={attributes}
					setAttributes={setAttributes}
					meta={metadata}
					type={'aspectRatio'}
					options={[
						{
							label: __('Default', 'kadence-blocks'),
							value: '',
						},
						{
							label: __('Landscape 4:3', 'kadence-blocks'),
							value: '4/3',
						},
						{
							label: __('Landscape 3:2', 'kadence-blocks'),
							value: '3/2',
						},
						{
							label: __('Landscape 16:9', 'kadence-blocks'),
							value: '16/9',
						},
						{
							label: __('Landscape 2:1', 'kadence-blocks'),
							value: '2/1',
						},
						{
							label: __('Landscape 3:1', 'kadence-blocks'),
							value: '3/1',
						},
						{
							label: __('Landscape 4:1', 'kadence-blocks'),
							value: '4/1',
						},
						{
							label: __('Portrait 3:4', 'kadence-blocks'),
							value: '3/4',
						},
						{
							label: __('Portrait 2:3', 'kadence-blocks'),
							value: '2/3',
						},
						{
							label: __('Square 1:1', 'kadence-blocks'),
							value: '1/1',
						},
					]}
				/>
				{aspectRatioAnyResolvedValue.appliedValue && (
					<>
						<FocalPointPicker
							className="kbs-focal-point-picker kbs-image-control__focal-point-picker"
							url={imageResolvedValue?.appliedValue}
							value={objectPositionResolvedValue?.appliedValue}
							attributeName={'objectPosition'}
							type={'objectPosition'}
							attributes={attributes}
							setAttributes={setAttributes}
							meta={metadata}
							previewDevice={'none'}
						/>
					</>
				)}

				{/* <RangeControl
					label={__('Max Image Width', 'kadence-blocks')}
					titleBar={false}
					attributeName={'maxWidth'}
					attributes={attributes}
					setAttributes={setAttributes}
					meta={metadata}
					type={'maxWidth'}
					previewDevice={previewDevice}
					hasDeviceControls={false}
				*/}
				<RadioButtonControl
					label={__('Max Image Width', 'kadence-blocks')}
					attributes={attributes}
					setAttributes={setAttributes}
					attributeName={'maxWidth'}
					radioType={'maxWidth'}
					type={'maxWidth'}
					hasCustomControls={true}
					meta={metadata}
					previewDevice={previewDevice}
				/>
				<TextControl
					label={__('Alt text (alternative text)', 'kadence-blocks')}
					attributeName={'alt'}
					attributes={attributes}
					setAttributes={setAttributes}
					meta={metadata}
					type={'alt'}
					textArea={true}
					help={
						<>
							<ExternalLink href="https://www.w3.org/WAI/tutorials/images/decision-tree">
								{__('Describe the purpose of the image', 'kadence-blocks')}
							</ExternalLink>
							{__('Leave empty if the image is purely decorative.', 'kadence-blocks')}
						</>
					}
					disabled={hasDynamicAlt}
				/>
				<ToggleControl
					label={__('Dynamic Alt Text', 'kadence-blocks')}
					titleBar={false}
					attributeName={'alt'}
					attributes={attributes}
					setAttributes={setAttributes}
					meta={metadata}
					type={'dynamicAlt'}
					help={__(
						'This makes it so alt text changed in the media library automatically updates on your website without needing to update this block..',
						'kadence-blocks'
					)}
				/>
				<TextControl
					label={__('Title Attribute', 'kadence-blocks')}
					attributeName={'title'}
					attributes={attributes}
					setAttributes={setAttributes}
					meta={metadata}
					type={'title'}
				/>
			</ToolsPanelBody>
			<ToolsPanelBody
				title={__('Link Settings', 'kadence-blocks')}
				panelName={'image-link'}
				componentName={'link-control'}
				initialOpen={false}
			>
				<LinkControl
					label={__('Image Link', 'kadence-blocks')}
					value={link}
					onChange={(value) => setAttributes({ link: value })}
					additionalControls={true}
					dynamicAttribute={'link'}
					allowClear={true}
					changeTargetType={false}
					{...props}
				/>
				<TextControl
					label={__('Link Label', 'kadence-blocks')}
					attributeName={'link'}
					attributes={attributes}
					setAttributes={setAttributes}
					meta={metadata}
					type={'label'}
					previewDevice={'none'}
				/>
			</ToolsPanelBody>
		</>
	);
}
