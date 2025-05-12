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
import FlexInputUnitControl from './ui-flex-input';
import { parseValueTypeFromRawValue } from './utils';
function RadioToggleGroupFlexSizeUI({
	value,
	onChange,
	inherited,
	controls = [],
	label = __('Flex Size', 'kadence-blocks'),
	isCustom = false,
}) {
	const isValueControlled = useMemo(() => parseValueTypeFromRawValue(value, controls), [value]);
	const units = [
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
			value: 'auto',
			label: 'auto',
			a11yLabel: __('Auto', 'kadence-blocks'),
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
		<div key={label} className="kbs-radio-button-control__toggle-group-input">
			{!isCustom && (
				<RadioToggleGroupButtonUI
					value={value}
					onChange={onChange}
					inherited={inherited}
					controls={controls}
					label={label}
				/>
			)}
			{isCustom && (
				<FlexInputUnitControl
					className="kbs-unit-control kbs-input-control"
					__next40pxDefaultSize={true}
					value={isValueControlled ? '' : value}
					onChange={onChange}
					units={units}
				/>
			)}
		</div>
	);
}

export default RadioToggleGroupFlexSizeUI;
