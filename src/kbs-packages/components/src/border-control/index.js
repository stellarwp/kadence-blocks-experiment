import { __ } from '@wordpress/i18n';
import BorderStyleControl from './border-style-control';
import PresetControl from '../preset-control';
import SpaceControl from '../space-control';
import {
	homeButton as homeButtonIcon,
	caption as captionIcon,
	image as imageIcon,
	media as mediaIcon,
} from '@wordpress/icons';

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
			icon: homeButtonIcon,
			title: __('Card', 'kadence-blocks'),
			key: 'card',
		},
		{
			icon: captionIcon,
			title: __('Card Alt', 'kadence-blocks'),
			key: 'card-alt',
		},
		{
			icon: imageIcon,
			title: __('Image', 'kadence-blocks'),
			key: 'image',
		},
		{
			icon: mediaIcon,
			title: __('Image Alt', 'kadence-blocks'),
			key: 'image-alt',
		},
	];

	const hoverSuffix = isHover ? 'Hover' : '';

	return (
		<>
			{hasPresetControl && (
				<PresetControl
					label={__('Border Presets', 'kadence-blocks')}
					attributes={attributes}
					setAttributes={setAttributes}
					attributeName={attributeName}
					type={'border' + hoverSuffix}
					metaData={meta}
					previewDevice={previewDevice}
					globalStylesIds={globalStylesIds}
					definedPresets={borderPresets}
					key={'border' + hoverSuffix}
				/>
			)}
			{hasBorderRadius && (
				<SpaceControl
					label={__('Border Radius', 'kadence-blocks')}
					attributes={attributes}
					setAttributes={setAttributes}
					attributeName={attributeName}
					type={'borderRadius'}
					previewDevice={previewDevice}
					hasPresetControl={false}
					metaData={meta}
					globalStylesIds={globalStylesIds}
					cornerControlType={true}
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
