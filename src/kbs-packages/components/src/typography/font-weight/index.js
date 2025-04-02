import SelectControl from '../../select-control';
import { __ } from '@wordpress/i18n';
import { getResolvedValue, useFontWeightOptions } from '@kadence/kbsHelpers';
import ResponsiveRangeControl from '../../responsive-range-control';

export default function FontWeight({
	attributes,
	setAttributes,
	meta,
	previewDevice,
	attributeName,
	customOnChange,
	forStyleBook,
	label,
	mergedGlobalStyle,
}) {	
	// Get direct font family value if set
	const fontFamilyValue = getResolvedValue(
		attributeName,
		attributes,
		previewDevice,
		meta,
		'fontFamily',
		mergedGlobalStyle
	);

	const fontFamily = fontFamilyValue?.appliedValue;
	const fontWeightOptions = useFontWeightOptions(fontFamily);
	const minWeight = fontWeightOptions?.minWeight || 400;
	const maxWeight = fontWeightOptions?.maxWeight || 700;
	const saneInitialPosition = ( minWeight > 400 || maxWeight < 400 ) ? (minWeight + maxWeight) / 2 : 400;

	return (
		<>
		
			{/* Loading Font / Font Weights */}
			{ !fontWeightOptions.fontsLoaded && (
				<div className="kadence-blocks-typography-loading">
					{__('Loading Fonts...', 'kadence-blocks')}
				</div>
			)}
			
			{/* Static Fonts */}
			{ fontWeightOptions.fontsLoaded && fontWeightOptions.type === 'static' && (
				<SelectControl
					label={ label }
					attributes={attributes}
					setAttributes={setAttributes}
					attributeName={ attributeName }
					meta={meta}
					previewDevice={previewDevice}
					type="fontWeight"
					customOnChange={customOnChange}
					forStyleBook={forStyleBook}
				/>
			)}

			{/* Variable Fonts */}
			{ fontWeightOptions.fontsLoaded && fontWeightOptions.type === 'variable' && (
				<>
					<ResponsiveRangeControl
						label={ label }
						setAttributes={setAttributes}
						attributes={attributes}
						attributeName={ attributeName }
						type={'fontWeight'}
						meta={meta}
						previewDevice={previewDevice}
						min={minWeight}
						max={maxWeight}
						step={10}
						initialPosition={saneInitialPosition}
						value={attributes.fontWeight}
					/>
					<p>Variable Fonts</p>
				</>
			)}
		</>
	);
}
