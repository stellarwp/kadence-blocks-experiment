import clsx from 'clsx';
/**
 * WordPress dependencies
 */
import { __, _x } from '@wordpress/i18n';
import { __experimentalInputControl as InputControl, Tooltip } from '@wordpress/components';
import { useMemo } from '@wordpress/element';
/**
 * Internal dependencies.
 */

function UnitSelectControl({ unit, onChange, units, className }) {
	const classes = clsx('components-unit-control__select', 'kbs-input-unit-control__select', className, {
		[`kbs-input-unit-control__select--${unit}`]: unit,
	});
	return (
		<Tooltip direction="bottom" text={unit === 'custom' ? __('Custom', 'kadence-blocks') : undefined}>
			<select onChange={onChange} value={unit} className={classes}>
				{units.map((option) => (
					<option key={option.value} value={option.value}>
						{option.label}
					</option>
				))}
			</select>
		</Tooltip>
	);
}

function InputUnitControl({ value, onChange, onUnitChange, units, className, placeholder, help, unit = 'custom' }) {
	const classes = clsx('components-unit-control', 'kbs-input-unit-control__input', className);
	const handleUnitChange = (event) => {
		const { value: unitValue } = event.target;
		const data = units.find((option) => option.value === unitValue);

		onUnitChange?.(unitValue, { event, data });
	};
	const inputSuffix = (
		<UnitSelectControl
			aria-label={__('Select unit', 'kadence-blocks')}
			onChange={handleUnitChange}
			unit={unit}
			units={units}
		/>
	);
	return (
		<InputControl
			__next40pxDefaultSize={true}
			value={value}
			placeholder={placeholder}
			onChange={onChange}
			className={classes}
			suffix={inputSuffix}
			help={help}
		/>
	);
}

export default InputUnitControl;
