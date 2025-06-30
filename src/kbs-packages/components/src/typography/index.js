import SelectControl from '../select-control';
import { __ } from '@wordpress/i18n';
import FontWeight from './font-weight';
import ResponsiveRadioRangeControls from '../range/responsive-radio-range-control';
import RadioButtonControl from '../radio-button-control';
import ResponsiveUnitControl from '../responsive-unit-control';

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
}) {
	return (
		<div>
			{!forPresetControl && (
				<SelectControl
					label={__('Preset', 'kadence-blocks')}
					attributes={attributes}
					setAttributes={setAttributes}
					attributeName={attributeName}
					meta={meta}
					previewDevice={'none'}
					type={'preset'}
					globalStylesIds={globalStylesIds}
					customOnChange={customOnChange}
					forStyleBook={forStyleBook}
					hasDeviceControls={false}
				/>
			)}

			<SelectControl
				label={__('Font Family', 'kadence-blocks')}
				attributes={attributes}
				setAttributes={setAttributes}
				attributeName={attributeName}
				meta={meta}
				previewDevice={previewDevice}
				type={'fontFamily'}
				globalStylesIds={globalStylesIds}
				customOnChange={customOnChange}
				forStyleBook={forStyleBook}
			/>

			<FontWeight
				label={__('Font Weight', 'kadence-blocks')}
				attributes={attributes}
				setAttributes={setAttributes}
				meta={meta}
				previewDevice={previewDevice}
				attributeName={attributeName}
				globalStylesIds={globalStylesIds}
				customOnChange={customOnChange}
				forStyleBook={forStyleBook}
			/>

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
		</div>
	);
}
