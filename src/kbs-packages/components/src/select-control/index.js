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
import { getDeviceValue, getInheritedDeviceValue, handleAttributeChange } from '@kadence/kbsHelpers';
import TitleBar from '../title-bar';
import { DOT_STYLES } from './constants';
import { getPlaceholderLabel, useSelectOptions } from './helpers';
import './editor.scss';

// Custom styles for the Select component
const getCustomStyles = (isInherited) => ({
	placeholder: (styles) => ({
		...styles,
		...(isInherited && DOT_STYLES),
		color: `var(--kb-text-color-opacity, rgba(0, 0, 0, ${isInherited ? 0.6 : 1.0}))`
	}),
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
	
	const { options, isLoadingOptions, loadingMessage } = useSelectOptions({
		type,
		attributes,
		attributeName,
		previewDevice,
	});

	const inheritedPlaceholderLabel = getPlaceholderLabel(currentValue, inheritedValue, type, options);

	const onReset = () => {
		onChange(defaultValue ?? undefined, 'all', type);
	};
	
	const onChange = (value, device, type) => {
		let updatedAttributes = value;

		switch(type) {
			case 'fontFamily': {
				const selectedOption = options.flatMap(group => group.options).find(option => option.value === value);
				updatedAttributes = {
					[type]: value,
					['fontSource']: selectedOption.source
				};
				break;
			}
			default:
				break;
		}

		handleAttributeChange(
			updatedAttributes,
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
					isLoading={isLoadingOptions}
					loadingMessage={ () => loadingMessage}
					onReset={onReset}
					noOptionsMessage={() => __('No results match your search', 'kadence-blocks')}
				/>
			</div>
		</div>
	);
}
