/**
 * WordPress dependencies
 */
import { __, _x } from '@wordpress/i18n';
import { __experimentalUnitControl as UnitControl } from '@wordpress/components';
import { useEffect, useState, useMemo } from '@wordpress/element';
/**
 * Internal dependencies.
 */
import InputUnitControl from './ui-input-unit';
import { parseUnitTypeFromRawValue, parseValueTypeFromRawValue } from './utils';

function InputUIControl({ value, onChange, controls = [], units, placeholder, help }) {
	const [isCustomUnit, setIsCustomUnit] = useState(false);
	const isValueControlled = useMemo(
		() => controls.length > 0 && parseValueTypeFromRawValue(value, controls),
		[value]
	);
	useEffect(() => {
		if (!isValueControlled) {
			const unit = parseUnitTypeFromRawValue(value, units);
			if (unit === 'unmatched') {
				setIsCustomUnit(true);
			}
		}
	}, []);
	const onCustomUnitChange = (value) => {
		if (value === 'custom' || value === 'auto') {
			setIsCustomUnit(true);
		} else {
			const newValue = value.replace('auto', '').replace('custom', '');
			setIsCustomUnit(false);
			onChange(newValue);
		}
	};
	const onUnitChange = (value) => {
		if (value === 'custom' || value === 'auto') {
			setIsCustomUnit(true);
		} else if (isCustomUnit) {
			setIsCustomUnit(false);
		}
	};
	const unitControlOnChange = (value) => {
		// Check if the value includes custom in the string.
		if (value.includes('custom')) {
			setIsCustomUnit(true);
			// Remove the custom from the value.
			const newValue = value.replace('custom', '');
			onChange(newValue);
		} else if (value.includes('auto')) {
			setIsCustomUnit(true);
			onChange(value);
		} else {
			onChange(value);
		}
	};
	return (
		<>
			{!isCustomUnit && (
				<UnitControl
					className="kbs-unit-control kbs-input-control"
					__next40pxDefaultSize={true}
					placeholder={placeholder}
					value={isValueControlled ? '' : value}
					onChange={unitControlOnChange}
					onUnitChange={onUnitChange}
					units={units}
					help={help}
				/>
			)}
			{isCustomUnit && (
				<InputUnitControl
					className="kbs-input-control"
					value={value}
					placeholder={placeholder}
					onChange={onChange}
					onUnitChange={onCustomUnitChange}
					units={units}
					help={help}
				/>
			)}
		</>
	);
}

export default InputUIControl;
