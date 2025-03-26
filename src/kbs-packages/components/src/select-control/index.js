/**
 * ResponsiveSelect Control
 */

/**
 * WordPress dependencies
 */
import { __, isRTL } from '@wordpress/i18n';

/**
 * External dependencies
 */
import Select from 'react-select';

// RTL configuration is determined once at module load
const IS_RTL = isRTL();

/**
 * Internal dependencies
 */
import {
	getDeviceValue,
	getInheritedDeviceValue,
	handleAttributeChange,
	getFontWeightOptions,
} from '@kadence/kbsHelpers';
import TitleBar from '../title-bar';
import { DOT_STYLES } from './constants';
import { getPlaceholderLabel, useSelectOptions } from './helpers';
import './editor.scss';

/**
 * Custom styles for the Select component
 */
const getCustomStyles = (isInherited) => ({
	placeholder: (styles) => ({
		...styles,
		...(isInherited && DOT_STYLES),
		color: `var(--kb-text-color-opacity, rgba(0, 0, 0, ${isInherited ? 0.6 : 1.0}))`,
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
	globalStylesJson = {},
	forStyleBook,
}) {
	const initialValue = meta?.initial ? meta?.initial : initial ? initial : '';
	const currentValue = getDeviceValue(attributeName, attributes, previewDevice, meta, type);
	const inheritedValue = getInheritedDeviceValue(
		attributeName,
		attributes,
		previewDevice,
		initialValue,
		meta,
		type,
		globalStylesJson
	);
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

		switch (type) {
			case 'fontFamily': {
				if (value === undefined) {
					updatedAttributes = {
						[type]: '',
						['fontSource']: '',
						['fontWeight']: '',
					};
					break;
				}

				const selectedOption = options
					.flatMap((group) => group.options)
					.find((option) => option.value === value);
				const currentFontWeight = getDeviceValue('fontWeight', attributes, device, meta, 'fontWeight');

				// Get available weights for the new font
				const availableWeights = getFontWeightOptions(value).map((opt) => opt.value);

				// Check if current weight is valid for new font
				const isWeightValid = availableWeights.includes(currentFontWeight);

				updatedAttributes = {
					[type]: value,
					['fontSource']: selectedOption.source,
					// If current weight is not valid, use the first available weight
					...(currentFontWeight &&
						!isWeightValid && {
							['fontWeight']: availableWeights[0] || '400',
						}),
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
		<div className={`components-base-control kbs-${type}-select-control`}>
			{label && <TitleBar label={label} hasDeviceControls={true} reset={reset} onReset={onReset} />}
			<div className="kbs-select-control-inner">
				<Select
					key={previewDevice + currentValue}
					isClearable={currentValue !== ''}
					value={
						currentValue
							? options.flatMap((opt) => opt.options || []).find((opt) => opt.value === currentValue)
							: null
					}
					options={options}
					onChange={(selectedOption) => onChange(selectedOption?.value, previewDevice, type)}
					className="kb-select-control"
					styles={customStyles}
					placeholder={inheritedPlaceholderLabel}
					isSearchable={true}
					isLoading={isLoadingOptions}
					loadingMessage={() => loadingMessage}
					noOptionsMessage={() => __('No results', 'kadence-blocks')}
					isRtl={IS_RTL}
				/>
			</div>
		</div>
	);
}
