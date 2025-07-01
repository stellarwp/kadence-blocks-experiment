import { __ } from '@wordpress/i18n';
import ToolsPanelBody from '../tools-panel-body';
import RadioButtonControl from '../radio-button-control';
import BorderStyleControl from './border-style-control';
import PresetControl from '../preset-control';
import { sectionLargeIcon, sectionMediumIcon, cardLargeIcon, cardMediumIcon } from '../constants/icons';

export default function BorderControl({
	attributeName,
	attributes,
	setAttributes,
	previewDevice,
	label = __('Border', 'kadence-blocks'),
	labelBorderRadius = __('Border Radius', 'kadence-blocks'),
	meta,
	hasCustomControls = true,
	hasAdvancedControls = true,
	hasBorderRadius = true,
	hasBorder = true,
	hasHoverControls = false,
	hasPresetControl,
	isHover,
	setIsHover,
	globalStylesIds,
}) {
	const borderPresets = [
		{
			icon: sectionLargeIcon,
			title: __('Simple', 'kadence-blocks'),
			key: 'simple',
		},
		{
			icon: sectionMediumIcon,
			title: __('Simple Rounded', 'kadence-blocks'),
			key: 'simple-rounded',
		},
		{
			icon: cardLargeIcon,
			title: __('Rounded', 'kadence-blocks'),
			key: 'none-rounded-sm',
		},
		{
			icon: cardMediumIcon,
			title: __('Rounded Full', 'kadence-blocks'),
			key: 'none-rounded-full',
		},
	];

	return (
		<>
			{hasPresetControl && (
				<PresetControl
					label={__('Border Presets', 'kadence-blocks')}
					type={'border'}
					attributes={attributes}
					setAttributes={setAttributes}
					attributeName={attributeName}
					metaData={meta}
					previewDevice={previewDevice}
					globalStylesIds={globalStylesIds}
					definedPresets={borderPresets}
				/>
			)}
			{hasBorderRadius && (
				<RadioButtonControl
					label={labelBorderRadius}
					attributes={attributes}
					setAttributes={setAttributes}
					attributeName={attributeName}
					radioType={'borderRadius'}
					meta={meta?.attributes?.[attributeName]}
					previewDevice={previewDevice}
					hasCustomControls={hasCustomControls}
					hasAdvancedControls={hasAdvancedControls}
					type={'borderRadius'}
				/>
			)}
			{hasBorder && (
				<BorderStyleControl
					label={label}
					attributes={attributes}
					setAttributes={setAttributes}
					attributeName={attributeName}
					meta={meta?.attributes?.[attributeName]}
					previewDevice={previewDevice}
					hasCustomControls={hasCustomControls}
					hasAdvancedControls={hasAdvancedControls}
					hasHoverControls={hasHoverControls}
					isHover={isHover}
					setIsHover={setIsHover}
				/>
			)}
		</>
	);
}
