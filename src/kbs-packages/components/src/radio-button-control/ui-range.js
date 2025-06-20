import clsx from 'clsx';
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
import {
	parseUnitTypeFromRawValue,
	parseValueTypeFromRawValue,
	getUnitFromRawValue,
	getNumberFromRawValue,
} from './utils';

function RangeUIControl({
	value,
	onChange,
	controls = [],
	min = null,
	max = null,
	units,
	placeholder,
	labelPosition = 'top',
	label = '',
	step = null,
	inherited,
	defaultUnit = 'px',
	type,
}) {
	const [isCustomUnit, setIsCustomUnit] = useState(false);

	const getMinMaxForTypeAndUnit = (type, unit) => {
		if (type === 'borderRadius' && unit === 'px') {
			return [0, 100];
		}
		return false;
	};

	const [minValue, maxValue] = useMemo(() => {
		const existingUnit = getUnitFromRawValue(value, units) ?? defaultUnit;

		const specialMinMax = getMinMaxForTypeAndUnit(type, existingUnit);
		if (specialMinMax) {
			return specialMinMax;
		} else {
			switch (existingUnit) {
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
		}
	}, [value]);

	const isValueControlled = useMemo(
		() => controls.length > 0 && parseValueTypeFromRawValue(value, controls),
		[value]
	);
	useEffect(() => {
		if (!isValueControlled && value) {
			const unit = parseUnitTypeFromRawValue(value, units);
			if (unit === 'unmatched') {
				setIsCustomUnit(true);
			}
		}
	}, [isValueControlled]);
	const onCustomUnitChange = (value) => {
		if (value === 'custom') {
			setIsCustomUnit(true);
		} else {
			const newValue = value.replace('custom', '');
			setIsCustomUnit(false);
			onChange(newValue);
		}
	};
	const onUnitChange = (value) => {
		if (value === 'custom') {
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
		} else if (value) {
			const numbers = value.replace(/\D/g, '');
			// Check if the value contains a number or is just a unit.
			if (numbers.length > 0) {
				onChange(value);
			}
		} else {
			onChange(value);
		}
	};

	const rangeControlOnChange = (newValue) => {
		let existingUnit = getUnitFromRawValue(value, units) ?? defaultUnit;
		if (units.length === 1) {
			existingUnit = units[0].value;
		}

		onChange(newValue + existingUnit);
	};
	const placeholderValue = useMemo(() => {
		if (inherited?.inheritedValue) {
			return getNumberFromRawValue(inherited?.inheritedValue);
		}
		return placeholder;
	}, [inherited, placeholder]);
	return (
		<>
			{!isCustomUnit && (
				<Flex>
					<FlexItem className="kbs-range-control-wrapper">
						<RangeControl
							className={clsx(
								'kbs-range-control kbs-input-control',
								(!value || value === 0) && placeholderValue && 'kbs-inherited'
							)}
							__next40pxDefaultSize={true}
							__nextHasNoMarginBottom={true}
							value={getNumberFromRawValue(value)}
							initialPosition={placeholderValue}
							onChange={rangeControlOnChange}
							min={null !== min ? min : minValue}
							max={null !== max ? max : maxValue}
							step={
								step ||
								(units.length > 0
									? units.find((unit) => unit.value === getUnitFromRawValue(value, units))?.step
									: 1)
							}
							showTooltip={false}
							withInputField={false}
						/>
					</FlexItem>
					<FlexItem className="kbs-unit-control-wrapper">
						<UnitControl
							className="kbs-unit-control kbs-input-control"
							__next40pxDefaultSize={true}
							placeholder={placeholderValue}
							label={label && 'top' !== labelPosition ? label : undefined}
							labelPosition={'top' !== labelPosition ? labelPosition : undefined}
							value={isValueControlled ? '' : value}
							onChange={unitControlOnChange}
							onUnitChange={onUnitChange}
							units={units}
							min={null !== min ? min : minValue}
							max={null !== max ? max : maxValue}
						/>
					</FlexItem>
				</Flex>
			)}
			{isCustomUnit && (
				<InputUnitControl
					className="kbs-input-control"
					value={value}
					label={label && 'top' !== labelPosition ? label : undefined}
					labelPosition={'top' !== labelPosition ? labelPosition : undefined}
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
