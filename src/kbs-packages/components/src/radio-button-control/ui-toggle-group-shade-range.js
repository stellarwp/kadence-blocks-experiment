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
import { lightIcon, darkIcon, fullColorIcon, transparentIcon } from '../constants/icons';


function RadioToggleGroupShadeRangeUI({
	value,
	onChange,
	inherited,
	color,
	shadeType = 'shade',
	controls = [],
	label = '',
	isCustom = false,
	units = [],
	labelPosition = 'top',
	placeholder = '',
	min = 0,
	max = 200,
	step = 1,
	hue = 0,
	lightness = 100,
	chroma = 100,
	baseColor = '',
}) {
	const defaultUnits = [
		{
			value: '%',
			label: '%',
			a11yLabel: __('Percent (%)', 'kadence-blocks'),
			step: 1,
		},
	];
	const placeholderValue = useMemo(() => {
		if (inherited?.inheritedValue) {
			return parseInt(inherited?.inheritedValue);
		}
		return placeholder;
	}, [inherited, placeholder]);
	const mixColor = useMemo(() => {
		if (shadeType === 'transparent' || shadeType === 'alpha') {
			return 'transparent';
		}
		if (shadeType === 'lightness') {
			// For lightness, we'll use black/white based on the value
			return 'white'; // This will be overridden in the style calculation
		}
		if (shadeType === 'chroma' || shadeType === 'hue') {
			// For chroma and hue, we don't mix with another color
			return null;
		}
		return shadeType;
	}, [shadeType]);
	const beforeIcon = useMemo(() => {
		if (shadeType === 'transparent' || shadeType === 'alpha') {
			return fullColorIcon;
		}
		if (shadeType === 'shade' || shadeType === 'lightness') {
			return darkIcon;
		}
		if (shadeType === 'chroma' || shadeType === 'hue') {
			return <ColorIndicator colorValue={color} />;
		}
		return <ColorIndicator colorValue={color} />;
	}, [shadeType, color]);
	const afterIcon = useMemo(() => {
		if (shadeType === 'transparent' || shadeType === 'alpha') {
			return transparentIcon;
		}
		if (shadeType === 'shade' || shadeType === 'lightness') {
			return lightIcon;
		}
		if (shadeType === 'chroma' || shadeType === 'hue') {
			return <ColorIndicator colorValue={color} />;
		}
		return <ColorIndicator colorValue={shadeType} />;
	}, [shadeType, color]);
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
					{map(controls, ({ key, title, name }) => (
						<ToggleGroupControlOption
							className={`kbs-radio-button-control__toggle_item ${parseInt(value) === parseInt(key) ? ' kb-is-pressed' : ''}${(value === undefined || value === '') && parseInt(key) === parseInt(inherited?.inheritedValue) ? ' kb-is-inherited' : ''}`}
							key={key}
							label={''}
							aria-label={title}
							showTooltip={true}
							value={key}
							style={{
								'--bg-mix': (() => {
									if (shadeType === 'lightness') {
										// For OKLch lightness using hybrid approach
										let lightnessCalc;
										if (key <= 100) {
											// Darken: multiply
											lightnessCalc = `l * ${(key / 100).toFixed(2)}`;
										} else {
											// Lighten: add
											const addValue = ((key - 100) / 100).toFixed(2);
											lightnessCalc = `l + ${addValue} * (1 - l)`;
										}
										return `oklch(from ${baseColor} calc(${lightnessCalc}) calc(c * ${(chroma / 100).toFixed(2)}) calc(h + ${hue}) / 100%)`;
									} else if (shadeType === 'chroma') {
										// For OKLch chroma using multiplication
										let lightnessCalc;
										if (lightness <= 100) {
											lightnessCalc = `l * ${(lightness / 100).toFixed(2)}`;
										} else {
											const addValue = ((lightness - 100) / 100).toFixed(2);
											lightnessCalc = `l + ${addValue} * (1 - l)`;
										}
										return `oklch(from ${baseColor} calc(${lightnessCalc}) calc(c * ${(key / 100).toFixed(2)}) calc(h + ${hue}) / 100%)`;
									} else if (shadeType === 'hue') {
										// For OKLch hue (degrees, no conversion needed)
										let lightnessCalc;
										if (lightness <= 100) {
											lightnessCalc = `l * ${(lightness / 100).toFixed(2)}`;
										} else {
											const addValue = ((lightness - 100) / 100).toFixed(2);
											lightnessCalc = `l + ${addValue} * (1 - l)`;
										}
										return `oklch(from ${baseColor} calc(${lightnessCalc}) calc(c * ${(chroma / 100).toFixed(2)}) calc(h + ${key}) / 100%)`;
									} else if (shadeType === 'alpha') {
										// For OKLch alpha (percentage)
										return `oklch(from ${color} l c h / ${key}%)`;
									} else {
										// Default color-mix behavior
										return `color-mix(in oklch, ${color}, ${shadeType === 'shade' ? (parseInt(key) < 0 ? 'black' : 'white') : mixColor} ${Math.abs(key)}%)`;
									}
								})(),
							}}
						/>
					))}
				</ToggleGroupControl>
			)}
			{(isCustom || controls.length === 0) && (
				<Flex>
					<FlexItem className="kbs-range-control-wrapper">
						<RangeControl
							className={clsx(
								'kbs-range-control kbs-input-control',
								(value === undefined || value === '') && placeholderValue && 'kbs-inherited'
							)}
							__next40pxDefaultSize={true}
							__nextHasNoMarginBottom={true}
							value={parseInt(value)}
							initialPosition={placeholderValue}
							onChange={onChange}
							min={min}
							max={max}
							step={step}
							afterIcon={afterIcon}
							beforeIcon={beforeIcon}
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
							value={value !== undefined && value !== '' ? value + '%' : ''}
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

export default RadioToggleGroupShadeRangeUI;
