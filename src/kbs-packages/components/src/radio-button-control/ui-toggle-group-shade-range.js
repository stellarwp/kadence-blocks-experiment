/**
 * External dependencies
 */
import { map } from 'lodash';
/**
 * WordPress dependencies
 */
import { __, _x } from '@wordpress/i18n';
import {
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from '@wordpress/components';
/**
 * Internal dependencies.
 */
import RangeUIControl from './ui-range';

function RadioToggleGroupShadeRangeUI({
	value,
	onChange,
	inherited,
	color,
	controls = [],
	label = '',
	isCustom = false,
	units = [],
	labelPosition = 'top',
	placeholder = '',
	min = -100,
	max = 100,
	step = 0.1,
}) {
	const defaultUnits = [
		{
			value: '%',
			label: '%',
			a11yLabel: __('Percent (%)', 'kadence-blocks'),
			step: 0.1,
		},
	];

	return (
		<div className="kbs-radio-button-control__toggle-group-input kbs-radio-button-control__toggle-group-input-shade-range">
			{controls.length > 0 && !isCustom && (
				<ToggleGroupControl
					className="kbs-radio-button-control__toggle-group"
					hideLabelFromVision={true}
					label={label}
					onChange={(value) => onChange(value)}
					value={value}
					isDeselectable={false}
					isBlock={true}
					__nextHasNoMarginBottom
					__next40pxDefaultSize
				>
					{map(controls, ({ key, title, name }) =>
						<ToggleGroupControlOption
							className={`kbs-radio-button-control__toggle_item${value === key ? ' kb-is-pressed' : ''}${!value && key === inherited?.inheritedValue ? ' kb-is-inherited' : ''}`}
							key={key}
							label={''}
							aria-label={title}
							showTooltip={true}
							value={key}
							style={{
								background: `color-mix(in srgb, ${color}, ${parseInt(key) < 0 ? 'black' : 'white'} ${Math.abs(key)}%)`,
							}}
						/>
					)}
				</ToggleGroupControl>
			)}
			{(isCustom || controls.length === 0) && (
				<RangeUIControl
					value={value}
					inherited={inherited}
					onChange={onChange}
					controls={controls}
					units={units.length > 0 ? units : defaultUnits}
					label={label}
					labelPosition={labelPosition}
					placeholder={placeholder}
					min={min}
					max={max}
					step={step}
				/>
			)}
		</div>
	);
}

export default RadioToggleGroupShadeRangeUI;
