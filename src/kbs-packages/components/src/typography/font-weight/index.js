import SelectControl from '../../select-control';
import SelectBasicControlSelect from '../../select-basic-control/select';
import { __ } from '@wordpress/i18n';
import {
	getResolvedValue,
	getFontStylesAndWeights,
	getInheritedDeviceValue,
	handleMultipleAttributeChange,
} from '@kadence/kbsHelpers';
import RadioButtonSelect from '../../radio-button-control/radio-button-select';

export default function FontWeight({
	attributes,
	setAttributes,
	meta,
	previewDevice,
	attributeName,
	customOnChange,
	forStyleBook,
	label,
	globalStylesIds,
}) {
	// Get direct font family value if set
	const fontFamilyValue = getResolvedValue(
		attributeName,
		attributes,
		previewDevice,
		meta,
		'fontFamily',
		globalStylesIds
	);
	const fontWeightValue = getResolvedValue(
		attributeName,
		attributes,
		previewDevice,
		meta,
		'fontWeight',
		globalStylesIds
	);
	const fontStyleValue = getResolvedValue(
		attributeName,
		attributes,
		previewDevice,
		meta,
		'fontStyle',
		globalStylesIds
	);
	const onReset = (device) => {
		handleMultipleAttributeChange(
			[undefined, undefined],
			device,
			attributeName,
			attributes,
			setAttributes,
			customOnChange,
			['fontWeight', 'fontStyle'],
			meta
		);
	};
	const onChangeWeight = (value, device, type) => {
		console.log('onChangeWeight', value, device, type);
		handleMultipleAttributeChange(
			[value],
			device,
			attributeName,
			attributes,
			setAttributes,
			customOnChange,
			['fontWeight'],
			meta
		);
	};
	const onChangeStyle = (value, device, type) => {
		console.log('onChangeStyle', value, previewDevice);
		handleMultipleAttributeChange(
			[value],
			device,
			attributeName,
			attributes,
			setAttributes,
			customOnChange,
			['fontStyle'],
			meta
		);
	};
	const onChangeCombined = (value, device, type) => {
		console.log('onChangeCombined', value, device, type);
		if (!value) {
			onReset(device);
			return;
		}
		let newFontWeight = value.replace('italic', '');
		let newFontStyle = value.includes('italic') ? 'italic' : '';
		handleMultipleAttributeChange(
			[newFontWeight, newFontStyle],
			device,
			attributeName,
			attributes,
			setAttributes,
			customOnChange,
			['fontWeight', 'fontStyle'],
			meta
		);
	};
	const fontFamily = fontFamilyValue?.appliedValue;
	const fontWeightOptions = getFontStylesAndWeights(fontFamily);
	const minWeight = fontWeightOptions?.minWeight || 400;
	const maxWeight = fontWeightOptions?.maxWeight || 700;
	const saneInitialPosition = minWeight > 400 || maxWeight < 400 ? (minWeight + maxWeight) / 2 : 400;
	console.log('fontWeightOptions', fontWeightOptions);
	console.log('fontWeightValue', fontWeightValue);
	console.log('device', previewDevice);
	return (
		<>
			{/* Loading Font / Font Weights */}
			{!fontWeightOptions.fontsLoaded && (
				<div className="components-base-control kadence-blocks-typography-loading">
					{__('Loading Fonts...', 'kadence-blocks')}
				</div>
			)}

			{/* Static Fonts */}
			{fontWeightOptions.fontsLoaded && fontWeightOptions.type === 'static' && (
				<SelectBasicControlSelect
					label={label}
					value={fontWeightValue?.directValue + fontStyleValue?.directValue}
					options={fontWeightOptions.combined}
					inherited={{ inheritedValue: fontWeightValue?.inheritedValue + fontStyleValue?.inheritedValue }}
					onChange={onChangeCombined}
					previewDevice={previewDevice}
					type="fontAppearance"
				/>
			)}

			{/* Variable Fonts */}
			{fontWeightOptions.fontsLoaded && fontWeightOptions.type === 'variable' && (
				<>
					<RadioButtonSelect
						label={__('Font Weight', 'kadence-blocks')}
						type={'variableFontWeight'}
						previewDevice={previewDevice}
						min={minWeight}
						max={maxWeight}
						step={10}
						placeholder={fontWeightValue?.appliedValue || __('Default', 'kadence-blocks')}
						initialPosition={fontWeightValue?.appliedValue || saneInitialPosition}
						value={fontWeightValue?.directValue}
						onChange={onChangeWeight}
					/>
					{fontWeightOptions.styles.length > 1 && (
						<SelectBasicControlSelect
							label={__('Font Style', 'kadence-blocks')}
							value={fontStyleValue?.directValue}
							inherited={fontStyleValue}
							previewDevice={previewDevice}
							type="fontStyle"
							options={fontWeightOptions.styles}
							onChange={onChangeStyle}
						/>
					)}
				</>
			)}
		</>
	);
}
