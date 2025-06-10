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
	min = -100,
	max = 100,
	step = 1,
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
		if (shadeType === 'transparent') {
			return 'transparent';
		}
		return shadeType;
	}, [shadeType]);
	const beforeIcon = useMemo(() => {
		if (shadeType === 'transparent') {
			return fullColorIcon;
		}
		if (shadeType === 'shade') {
			return darkIcon;
		}
		return <ColorIndicator colorValue={color} />;
	}, [shadeType]);
	const afterIcon = useMemo(() => {
		if (shadeType === 'transparent') {
			return transparentIcon;
		}
		if (shadeType === 'shade') {
			return lightIcon;
		}
		return <ColorIndicator colorValue={shadeType} />;
	}, [shadeType]);
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
							className={`kbs-radio-button-control__toggle_item ${parseFloat(value) === parseInt(key) ? ' kb-is-pressed' : ''}${!value && parseInt(key) === parseInt(inherited?.inheritedValue) ? ' kb-is-inherited' : ''}`}
							key={key}
							label={''}
							aria-label={title}
							showTooltip={true}
							value={key}
							style={{
								'--bg-mix': `color-mix(in srgb, ${color}, ${shadeType === 'shade' ? (parseInt(key) < 0 ? 'black' : 'white') : mixColor} ${Math.abs(key)}%)`,
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
							value={undefined !== value ? value + '%' : ''}
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
