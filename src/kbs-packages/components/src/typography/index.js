import SelectControl from '../select-control';
import { __ } from '@wordpress/i18n';
import RadioButtonControl from '../radio-button-control';
import FamilyAppearance from './family-appearance';
import FontColor from './font-color';
import PresetControl from '../preset-control';
import TypographyPresetControl from './preset-control';
import './editor.scss';
export default function Typography({
	attributes,
	setAttributes,
	meta,
	previewDevice,
	attributeName,
	globalStylesIds,
	customOnChange,
	forStyleBook,
	forPresetControl,
	onlyPresetControl = false,
	hasPresetControl = true,
	hasColor = false,
	hasBackgroundColor = false,
	supportsGradient = false,
	globalStylesCss,
}) {
	return (
		<div className="components-base-control">
			{(hasPresetControl || onlyPresetControl) && (
				<TypographyPresetControl
					label={__('Typography Preset', 'kadence-blocks')}
					type={'typography'}
					attributes={attributes}
					setAttributes={setAttributes}
					attributeName={attributeName}
					metaData={meta}
					previewDevice={previewDevice}
					globalStylesIds={globalStylesIds}
					globalStylesCss={globalStylesCss}
				/>
				// <PresetControl
				// 	label={__('Preset', 'kadence-blocks')}
				// 	attributes={attributes}
				// 	setAttributes={setAttributes}
				// 	attributeName={attributeName}
				// 	meta={meta}
				// 	previewDevice={'none'}
				// 	type={'preset'}
				// 	globalStylesIds={globalStylesIds}
				// 	customOnChange={customOnChange}
				// 	forStyleBook={forStyleBook}
				// 	hasDeviceControls={false}
				// />
			)}
			{hasColor && (
				<FontColor
					attributes={attributes}
					setAttributes={setAttributes}
					meta={meta}
					previewDevice={previewDevice}
					globalStylesIds={globalStylesIds}
					supportsGradient={supportsGradient}
					hasColor={hasColor}
					attributeName={attributeName}
					hasBackgroundColor={hasBackgroundColor}
					globalStylesCss={globalStylesCss}
				/>
			)}
			<RadioButtonControl
				label={__('Font Size', 'kadence-blocks')}
				attributes={attributes}
				setAttributes={setAttributes}
				attributeName={attributeName}
				type="fontSize"
				meta={meta}
				previewDevice={previewDevice}
				customOnChange={customOnChange}
				forStyleBook={forStyleBook}
				hasCustomControls={true}
			/>
			<RadioButtonControl
				label={__('Line Height', 'kadence-blocks')}
				attributes={attributes}
				setAttributes={setAttributes}
				attributeName={attributeName}
				type="lineHeight"
				meta={meta}
				previewDevice={previewDevice}
				customOnChange={customOnChange}
				forStyleBook={forStyleBook}
				hasCustomControls={true}
			/>
			<RadioButtonControl
				label={__('Letter Case', 'kadence-blocks')}
				attributes={attributes}
				setAttributes={setAttributes}
				attributeName={attributeName}
				type="textTransform"
				meta={meta}
				previewDevice={previewDevice}
				customOnChange={customOnChange}
				forStyleBook={forStyleBook}
			/>
			<RadioButtonControl
				label={__('Letter Spacing', 'kadence-blocks')}
				attributes={attributes}
				setAttributes={setAttributes}
				attributeName={attributeName}
				type="letterSpacing"
				meta={meta}
				previewDevice={previewDevice}
				globalStylesIds={globalStylesIds}
				customOnChange={customOnChange}
				forStyleBook={forStyleBook}
				hasCustomControls={true}
			/>

			<FamilyAppearance
				attributes={attributes}
				setAttributes={setAttributes}
				meta={meta}
				previewDevice={previewDevice}
				attributeName={attributeName}
				globalStylesIds={globalStylesIds}
				customOnChange={customOnChange}
				forStyleBook={forStyleBook}
			/>
		</div>
	);
}
