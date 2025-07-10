/**
 * External dependencies
 */
import { map } from 'lodash';
import clsx from 'clsx';
/**
 * WordPress dependencies
 */
import { __, _x } from '@wordpress/i18n';
import {
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
	RangeControl,
	__experimentalUnitControl as UnitControl,
	Flex,
	FlexItem,
	ColorIndicator,
} from '@wordpress/components';
/**
 * Internal dependencies.
 */
import { useMemo } from '@wordpress/element';


function RadioToggleGroupHueRangeUI({
	value,
	onChange,
	inherited,
	color,
	baseColor = '',
	controls = [],
	label = '',
	isCustom = false,
	units = [],
	labelPosition = 'top',
	placeholder = '',
	min = -180,
	max = 180,
	step = 1,
}) {
	const defaultUnits = [
		{
			value: '°',
			label: '°',
			a11yLabel: __('Degrees (°)', 'kadence-blocks'),
			step: 1,
		},
	];
	const placeholderValue = useMemo(() => {
		if (inherited?.inheritedValue) {
			return parseInt(inherited?.inheritedValue);
		}
		return placeholder;
	}, [inherited, placeholder]);
	
	// Calculate hue-shifted color for preview using base color
	const getHueShiftedColor = (hueShift) => {
		const colorToUse = baseColor || color;
		if (!colorToUse) return '';
		return `oklch(from ${colorToUse} l c calc(h + ${hueShift}) / 100%)`;
	};
	
	return (
		<div className="kbs-radio-button-control__toggle-group-input kbs-radio-button-control__toggle-group-input-hue-range">
			{controls.length > 0 && !isCustom && (
				<ToggleGroupControl
					className="kbs-radio-button-control__toggle-group kbs-radio-button-control__toggle-group-hue"
					hideLabelFromVision={true}
					label={label}
					onChange={(value) => onChange(value)}
					value={value}
					isDeselectable={false}
					isBlock={true}
					__nextHasNoMarginBottom
					__next40pxDefaultSize
				>
					{map(controls, ({ key, title, name }) => (
						<ToggleGroupControlOption
							className={`kbs-radio-button-control__toggle_item kbs-radio-button-control__toggle_item-hue ${parseFloat(value) === parseInt(key) ? ' kb-is-pressed' : ''}${!value && parseInt(key) === parseInt(inherited?.inheritedValue) ? ' kb-is-inherited' : ''}`}
							key={key}
							label={''}
							aria-label={title}
							showTooltip={true}
							value={key}
						>
							<ColorIndicator 
								colorValue={getHueShiftedColor(key)} 
								className="kbs-hue-color-indicator"
							/>
							<span className="kbs-hue-degree-label">{key > 0 ? '+' : ''}{key}°</span>
						</ToggleGroupControlOption>
					))}
				</ToggleGroupControl>
			)}
			{(isCustom || controls.length === 0) && (
				<Flex>
					<FlexItem className="kbs-range-control-wrapper">
						<RangeControl
							className={clsx(
								'kbs-range-control kbs-input-control kbs-hue-range-control',
								(!value || value === 0) && placeholderValue && 'kbs-inherited'
							)}
							__next40pxDefaultSize={true}
							__nextHasNoMarginBottom={true}
							value={parseInt(value)}
							initialPosition={placeholderValue}
							onChange={onChange}
							min={min}
							max={max}
							step={step}
							beforeIcon={<ColorIndicator colorValue={getHueShiftedColor(min)} />}
							afterIcon={<ColorIndicator colorValue={getHueShiftedColor(max)} />}
							showTooltip={true}
							withInputField={false}
							renderTooltipContent={(v) => `${v > 0 ? '+' : ''}${v}°`}
						/>
					</FlexItem>
					<FlexItem className="kbs-unit-control-wrapper">
						<UnitControl
							className="kbs-unit-control kbs-input-control"
							__next40pxDefaultSize={true}
							placeholder={placeholderValue}
							label={label && 'top' !== labelPosition ? label : undefined}
							labelPosition={'top' !== labelPosition ? labelPosition : undefined}
							value={undefined !== value ? value + '°' : ''}
							onChange={onChange}
							units={units.length > 0 ? units : defaultUnits}
							min={min}
							max={max}
						/>
					</FlexItem>
				</Flex>
			)}
		</div>
	);
}

export default RadioToggleGroupHueRangeUI;