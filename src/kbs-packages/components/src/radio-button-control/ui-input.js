import clsx from 'clsx';
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

function InputUIControl({
	value,
	onChange,
	controls = [],
	units = [
		{
			value: 'px',
			label: 'px',
			a11yLabel: __('Pixels (px)', 'kadence-blocks'),
			step: 0.1,
		},
		{
			value: '%',
			label: '%',
			a11yLabel: __('Percent (%)', 'kadence-blocks'),
			step: 0.1,
		},
		{
			value: 'em',
			label: 'em',
			a11yLabel: _x('ems', 'Relative to parent font size (em)', 'kadence-blocks'),
			step: 0.01,
		},
		{
			value: 'rem',
			label: 'rem',
			a11yLabel: _x('rems', 'Relative to root font size (rem)', 'kadence-blocks'),
			step: 0.01,
		},
		{
			value: 'vw',
			label: 'vw',
			a11yLabel: __('Viewport width (vw)', 'kadence-blocks'),
			step: 0.1,
		},
		{
			value: 'vh',
			label: 'vh',
			a11yLabel: __('Viewport height (vh)', 'kadence-blocks'),
			step: 0.1,
		},
		{
			value: 'custom',
			label: 'custom',
			a11yLabel: __('Custom', 'kadence-blocks'),
			step: 0.1,
		},
	],
	placeholder,
	help,
	className,
	inherited,
	...rest
}) {
	const [isCustomUnit, setIsCustomUnit] = useState(false);
	const isValueControlled = useMemo(
		() => controls.length > 0 && parseValueTypeFromRawValue(value, controls),
		[value]
	);
	const classes = clsx('kbs-input-control', className);
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
	const placeholderValue = useMemo(() => {
		if (inherited?.inheritedValue) {
			return parseInt(inherited?.inheritedValue);
		}
		return placeholder ? parseInt(placeholder) : '';
	}, [inherited, placeholder]);
	return (
		<>
			{!isCustomUnit && (
				<UnitControl
					className={clsx('kbs-unit-control', classes)}
					__next40pxDefaultSize={true}
					placeholder={placeholderValue}
					value={isValueControlled ? '' : value}
					onChange={unitControlOnChange}
					onUnitChange={onUnitChange}
					units={units}
					help={help}
					{...rest}
				/>
			)}
			{isCustomUnit && (
				<InputUnitControl
					className={classes}
					value={isValueControlled ? '' : value}
					placeholder={placeholderValue}
					onChange={onChange}
					onUnitChange={onCustomUnitChange}
					units={units}
					help={help}
					{...rest}
				/>
			)}
		</>
	);
}

export default InputUIControl;
