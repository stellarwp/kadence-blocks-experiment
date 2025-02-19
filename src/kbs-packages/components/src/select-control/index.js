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
import { getDeviceValue, getDeviceAttributeSlug, getFontOptions } from '@kadence/kbsHelpers';
import TitleBar from '../title-bar';
import './editor.scss';

// Dot styling helper
const dot = (color = 'var(--kb-border-color, rgba(8, 115, 230, 0.55))') => ({
	alignItems: 'center',
	display: 'flex',
	':before': {
		backgroundColor: color,
		borderRadius: '8px',
		content: '" "',
		display: 'block',
		marginRight: '6px',
		height: '10px',
		width: '10px',
	},
});

// Custom styles for the Select component
const getCustomStyles = (isInherited) => ({
	placeholder: (styles) => ({ 
		...styles, 
		...(isInherited ? {
			...dot(),
			color: 'var(--kb-text-color-opacity, rgba(0, 0, 0, 0.6))'
		} : {
			color: 'var(--kb-text-color-opacity, rgba(0, 0, 0, 1.0))'
		}),	}),
});

// Font Weight Options
const FONT_WEIGHT_OPTIONS = [
	{ label: __('Default', 'kadence-blocks'), value: '' },
	{ label: __('Light (300)', 'kadence-blocks'), value: '300' },
	{ label: __('Regular (400)', 'kadence-blocks'), value: '400' },
	{ label: __('Medium (500)', 'kadence-blocks'), value: '500' },
	{ label: __('Semi Bold (600)', 'kadence-blocks'), value: '600' },
	{ label: __('Bold (700)', 'kadence-blocks'), value: '700' },
	{ label: __('Extra Bold (800)', 'kadence-blocks'), value: '800' },
];

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
	const desktopValue = getDeviceValue(attributeName, attributes, 'Desktop');
	const tabletValue = getDeviceValue(attributeName, attributes, 'Tablet');
	const mobileValue = getDeviceValue(attributeName, attributes, 'Mobile');

	const initialValue = meta?.initial ?? initial;
	const initialDesktop = initialValue?.desktop ?? '';
	const initialTablet = initialValue?.tablet ?? initialDesktop;
	const initialMobile = initialValue?.mobile ?? initialTablet;

	const isInherited = (device) => {
		const deviceValues = {
			Desktop: desktopValue,
			Tablet: tabletValue,
			Mobile: mobileValue,
		};
		return deviceValues[device] === '';
	};

	const getValueForDevice = (device) => {
		switch (device) {
			case 'Desktop':
				return desktopValue ?? initialDesktop;
			case 'Tablet':
				return tabletValue ?? (desktopValue || initialTablet);
			case 'Mobile':
				return mobileValue ?? (tabletValue || desktopValue || initialMobile);
			default:
				return '';
		}
	};

	const currentValue = getValueForDevice(previewDevice);
	const isCurrentValueInherited = isInherited(previewDevice);
	const options = type === 'fontFamily' ? getFontOptions() : FONT_WEIGHT_OPTIONS;

	const findOptionByValue = (value) => {
		if (!value) return null;

		if (type === 'fontFamily') {
			return options.reduce((found, group) => 
				found || group.options.find(option => option.value === value), null);
		}
		
		return options.find(option => option.value === value);
	};

	const getInheritedPlaceholderLabel = () => {
		if (!isCurrentValueInherited) {
			const matchingOption = findOptionByValue(currentValue);
			return matchingOption ? matchingOption.label : currentValue;
		}

		const inheritedValues = {
			Mobile: tabletValue || desktopValue || initialMobile,
			Tablet: desktopValue || initialTablet,
			Desktop: initialDesktop,
		};

		const inheritedValue = inheritedValues[previewDevice] ?? '';
		const inheritedOption = findOptionByValue(inheritedValue);

		return inheritedOption 
			? `${inheritedOption.label}`
			: __('Default', 'kadence-blocks');
	};

	const inheritedPlaceholderLabel = getInheritedPlaceholderLabel();

	const onReset = () => {
		onChange(defaultValue ?? undefined, 'all');
	};
	
	const onChange = ( value, device ) => {
		if ( customOnChange ) {
			customOnChange( value, device );
		} else {
			// Deep clone the attributes object to trigger an update.
			const newAttributes = JSON.parse( JSON.stringify( attributes ) );
			if ( 'all' === device ) {
				newAttributes[ attributeName ] = value;
			} else {
				const deviceSlug = getDeviceAttributeSlug( device );
				if ( ! newAttributes[ attributeName ] ) {
					newAttributes[ attributeName ] = {};
				}
				newAttributes[ attributeName ][ deviceSlug ] = value;
			}
			setAttributes( newAttributes );
		}
	};

	const customStyles = getCustomStyles(isCurrentValueInherited);

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
					onChange={(selectedOption) => onChange(selectedOption.value, previewDevice)}
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
