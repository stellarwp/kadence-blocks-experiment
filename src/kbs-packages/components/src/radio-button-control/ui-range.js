/**
 * WordPress dependencies
 */
import { __, _x } from '@wordpress/i18n';
import { __experimentalUnitControl as UnitControl, RangeControl, Flex, FlexItem } from '@wordpress/components';
import { useEffect, useState, useMemo } from '@wordpress/element';
/**
 * Internal dependencies.
 */
import InputUnitControl from './ui-input-unit';
import { parseUnitTypeFromRawValue, parseValueTypeFromRawValue, getUnitFromRawValue, getNumberFromRawValue } from './utils';

function RangeUIControl({ value, onChange, controls = [], units, placeholder }) {
	const [isCustomUnit, setIsCustomUnit] = useState(false);
	const [minValue, maxValue] = useMemo(() => {
		const existingUnit = getUnitFromRawValue(value, units) ?? 'px';

		switch( existingUnit ) {
			case 'px':
				return [0, 1200];
			case '%':
			case 'vh':
			case 'vw':
				return [0, 100];
			case 'em':
			case 'rem':
				return [0, 10];
			default:
				return [0, 100];
		}
	}, [value]);

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

	const rangeControlOnChange = (newValue) => {		
		const existingUnit = getUnitFromRawValue(value, units) ?? 'px';

		onChange(newValue + existingUnit);
	}
	return (
		<>
			{!isCustomUnit && (
				<Flex>
					<FlexItem style={{ width: '100%' }}>
						<RangeControl
							className="kbs-range-control kbs-input-control"
							value={getNumberFromRawValue(value)}
							onChange={rangeControlOnChange}
							min={minValue}
							max={maxValue}
							step={ units.length > 0 ? units.find(unit => unit.value === getUnitFromRawValue(value, units))?.step : 1 }
							withInputField={false}
						/>
					</FlexItem>
					<FlexItem>
						<UnitControl
							className="kbs-unit-control kbs-input-control"
							__next40pxDefaultSize={true}
							placeholder={placeholder}
							value={isValueControlled ? '' : value}
							onChange={unitControlOnChange}
							onUnitChange={onUnitChange}
							units={units}
						/>
					</FlexItem>
				</Flex>
			)}
			{isCustomUnit && (
				<InputUnitControl
					className="kbs-input-control"
					value={value}
					placeholder={placeholder}
					onChange={onChange}
					onUnitChange={onCustomUnitChange}
					units={units}
				/>
			)}
		</>
	);
}

export default RangeUIControl;
