/**
 * WordPress dependencies
 */
import { __, _x } from '@wordpress/i18n';
import { __experimentalUnitControl as UnitControl } from '@wordpress/components';
import { useEffect, useState, useMemo } from '@wordpress/element';
/**
 * Internal dependencies.
 */
import RadioToggleGroupButtonUI from './ui-toggle-group';
import RangeUIControl from './ui-range';

function RadioToggleGroupInputRangeUI({
	value,
	onChange,
	inherited,
	controls = [],
	label = '',
	isCustom = false,
	units = [],
	labelPosition = 'top',
	placeholder = '',
	min = null,
	max = null,
	step = null,
	defaultUnit = 'px',
	type,
}) {
	const defaultUnits = [
		{
			value: 'px',
			label: 'px',
			a11yLabel: __('Pixels (px)', 'kadence-blocks'),
			step: 1,
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
	];

	return (
		<div className="kbs-radio-button-control__toggle-group-input">
			{controls.length > 0 && !isCustom && (
				<RadioToggleGroupButtonUI
					value={value}
					onChange={onChange}
					inherited={inherited}
					controls={controls}
					label={label}
					labelPosition={labelPosition}
				/>
			)}
			{(isCustom || controls.length === 0) && (
				<RangeUIControl
					value={value}
					inherited={inherited}
					onChange={onChange}
					controls={controls}
					defaultUnit={defaultUnit}
					units={units.length > 0 ? units : defaultUnits}
					label={label}
					labelPosition={labelPosition}
					placeholder={placeholder}
					min={min}
					max={max}
					step={step}
					type={type}
				/>
			)}
		</div>
	);
}

export default RadioToggleGroupInputRangeUI;
