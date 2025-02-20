/**
 * ResponsiveSelect Control
 */

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * External dependencies
 */
import Select from 'react-select';

/**
 * Internal dependencies
 */
import { getDeviceValue, getInheritedDeviceValue, getDeviceAttributeSlug, handleAttributeChange, getFontOptions, getFontWeightOptions } from '@kadence/kbsHelpers';
import TitleBar from '../title-bar';
import { DOT_STYLES } from './constants';
import './editor.scss';

// Custom styles for the Select component
const getCustomStyles = (isInherited) => ({
	placeholder: (styles) => ({ 
		...styles, 
		...(isInherited ? {
			...DOT_STYLES,
			color: 'var(--kb-text-color-opacity, rgba(0, 0, 0, 0.6))'
		} : {
			color: 'var(--kb-text-color-opacity, rgba(0, 0, 0, 1.0))'
		}),	}),
});


/**
 * Build the Font Select control
 *
 * @param {Object} props Component props.
 * @return {JSX.Element} Font select control.
 */
export default function SelectControl({
	label,
	customOnChange,
	defaultValue,
	attributeName,
	type = 'fontFamily',
	attributes,
	setAttributes,
	reset = true,
	previewDevice,
	initial,
	meta,
}) {

	const initialValue = meta?.initial ? meta?.initial : initial;
	const currentValue = getDeviceValue(attributeName, attributes, previewDevice, meta, type);	
	const inheritedValue = getInheritedDeviceValue(attributeName, attributes, previewDevice, initialValue, meta?.property);
	const isCurrentValueInherited = currentValue === '';
	const customStyles = getCustomStyles(isCurrentValueInherited);

	const options = (() => {
		switch (type) {
			case 'fontFamily':
				return getFontOptions();
			case 'fontWeight':
				const previewDeviceSlug = getDeviceAttributeSlug(previewDevice);
				const fontFamily = attributes?.[attributeName]?.[previewDeviceSlug]?.fontFamily;
				const availableWeights = getFontWeightOptions(fontFamily);
				
				// If the current weight is not in the available weights, set it to '400' or first available
				// const weightExists = availableWeights.some(option => option.value === currentValue);
				// if( !weightExists ){
				// 	const newWeight = availableWeights.find(option => option.value === '400')?.value || availableWeights[0]?.value;
				// 	handleAttributeChange(
				// 		newWeight,
				// 		previewDevice,
				// 		attributeName,
				// 		attributes,
				// 		setAttributes,
				// 		customOnChange,
				// 		'fontWeight'
				// 	);
				// }

				return availableWeights;
			default:
				return [];
		}
	})();

	const findOptionByValue = (value) => {
		if (!value) return null;

		if (type === 'fontFamily') {
			return options.reduce((found, group) => 
				found || group.options.find(option => option.value === value), null);
		}
		
		return options.find(option => option.value === value);
	};

	const inheritedPlaceholderLabel = !isCurrentValueInherited 
		? (findOptionByValue(currentValue)?.label || currentValue)
		: (findOptionByValue(inheritedValue.fontFamily)?.label || __('Default', 'kadence-blocks'));


	const onReset = () => {
		onChange(defaultValue ?? undefined, 'all', type);
	};
	
	const onChange = (value, device, type) => {
		handleAttributeChange(
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


	return (
		<div className={`components-base-control kb-${type}-select-control`}>
			{label && (
				<TitleBar
					label={label}
					hasDeviceControls={true}
					reset={reset}
					onReset={onReset}
				/>
			)}
			<div className="kb-font-select-control__wrapper">
				<Select
					key={previewDevice}
					value={currentValue}
					options={options}
					onChange={(selectedOption) => onChange(selectedOption.value, previewDevice, type)}
					className="kb-font-select"
					styles={customStyles}
					placeholder={inheritedPlaceholderLabel}
					isSearchable={true}
					onReset={onReset}
					noOptionsMessage={() => __('No results match your search', 'kadence-blocks')}
				/>
				{isCurrentValueInherited && (
					<div 
						className="kb-font-select-inherited-label"
						style={{
							fontSize: '11px',
							color: 'var(--kb-text-color-opacity, rgba(0, 0, 0, 0.6))',
							marginTop: '4px',
							fontStyle: 'italic',
						}}
					>
						{__('Inherited value', 'kadence-blocks')}
					</div>
				)}
			</div>
		</div>
	);
}
