import SelectControl from '../select-control';
import { __ } from '@wordpress/i18n';
import FontWeight from './font-weight';
import ResponsiveRadioRangeControls from '../range/responsive-radio-range-control';
import ResponsiveUnitControl from '../responsive-unit-control';

export default function Typography({
	attributes,
	setAttributes,
	meta,
	previewDevice,
	attributeName,
	mergedGlobalStyle,
	customOnChange,
	forStyleBook,
}) {
	return (
		<div>
			<SelectControl
				label={__('Font Family', 'kadence-blocks')}
				attributes={attributes}
				setAttributes={setAttributes}
				attributeName={attributeName}
				meta={meta}
				previewDevice={previewDevice}
				type={'fontFamily'}
				mergedGlobalStyle={mergedGlobalStyle}
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
				mergedGlobalStyle={mergedGlobalStyle}
				customOnChange={customOnChange}
				forStyleBook={forStyleBook}
			/>

			<ResponsiveRadioRangeControls
				label={__('Font Size', 'kadence-blocks')}
				attributes={attributes}
				setAttributes={setAttributes}
				attributeName={attributeName}
				type="fontSize"
				meta={meta}
				previewDevice={previewDevice}
				min={0}
				max={200}
				step={1}
				unit="px"
				showUnit={true}
				units={['px', 'em', 'rem']}
				mergedGlobalStyle={mergedGlobalStyle}
				customOnChange={customOnChange}
				forStyleBook={forStyleBook}
			/>

			<ResponsiveRadioRangeControls
				label={__('Letter Case', 'kadence-blocks')}
				attributes={attributes}
				setAttributes={setAttributes}
				attributeName={attributeName}
				type="textTransform"
				meta={meta}
				previewDevice={previewDevice}
				disableCustomSizes={true}
				showUnit={false}
				mergedGlobalStyle={mergedGlobalStyle}
				customOnChange={customOnChange}
				forStyleBook={forStyleBook}
			/>

			<ResponsiveUnitControl
				label={__('Line Height', 'kadence-blocks')}
				attributes={attributes}
				setAttributes={setAttributes}
				attributeName={attributeName}
				type="lineHeight"
				meta={meta}
				previewDevice={previewDevice}
				disableCustomSizes={true}
				showUnit={false}
				mergedGlobalStyle={mergedGlobalStyle}
				customOnChange={customOnChange}
				forStyleBook={forStyleBook}
			/>

			<ResponsiveUnitControl
				label={__('Letter Spacing', 'kadence-blocks')}
				attributes={attributes}
				setAttributes={setAttributes}
				attributeName={attributeName}
				type="letterSpacing"
				meta={meta}
				previewDevice={previewDevice}
				disableCustomSizes={true}
				showUnit={false}
				mergedGlobalStyle={mergedGlobalStyle}
				customOnChange={customOnChange}
				forStyleBook={forStyleBook}
			/>
		</div>
	);
}
