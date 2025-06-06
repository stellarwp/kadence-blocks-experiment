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

const lightIcon = (
	<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 -960 960 960">
		<path d="M480-360q50 0 85-35t35-85-35-85-85-35-85 35-35 85 35 85 85 35m0 60q-74.92 0-127.46-52.54T300-480t52.54-127.46T480-660t127.46 52.54T660-480t-52.54 127.46T480-300M200-450H50v-60h150zm710 0H760v-60h150zM450-760v-150h60v150zm0 710v-150h60v150zM262.92-656.92l-93.69-90.46 42.39-44.39 90.23 92.69zm485.46 488.69-90.84-93.31 39.54-41.54 93.69 90.46zm-91.46-528.85 90.46-93.69 44.39 42.39-92.69 90.23zM168.23-211.62l93.31-90.84 40.77 39.54-90.08 94.07zM480-480"></path>
	</svg>
);

const darkIcon = (
	<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 -960 960 960">
		<path d="M481.15-140q-141.66 0-240.83-99.17-99.16-99.16-99.16-240.83 0-135.77 92.11-232.88 92.11-97.12 225.57-105.2 8.62 0 16.93.62 8.3.62 16.3 1.85-30.61 28.61-48.76 69.15-18.16 40.54-18.16 86.46 0 98.33 68.84 167.17Q562.82-424 661.15-424q46.54 0 86.77-18.15 40.23-18.16 68.46-48.77 1.23 8 1.85 16.31.61 8.3.61 16.92-7.69 133.46-104.8 225.57Q616.92-140 481.15-140m0-60q88 0 158-48.5t102-126.5q-20 5-40 8t-40 3q-123 0-209.5-86.5T365.15-660q0-20 3-40t8-40q-78 32-126.5 102t-48.5 158q0 116 82 198t198 82m-10-270"></path>
	</svg>
);
const fullColorIcon = (
	<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 -960 960 960">
		<path d="M480-120q-124.69 0-212.34-86.12Q180-292.24 180-415.8q0-58.97 23.35-112.81 23.34-53.85 64.5-95.54L480-832.31l212.15 208.16q41.16 41.69 64.5 95.55Q780-474.74 780-415.72q0 123.64-87.66 209.68Q604.69-120 480-120"></path>
	</svg>
);
const transparentIcon = (
	<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 -960 960 960">
		<path d="M480-140q-124.92 0-212.46-85.85Q180-311.69 180-436q0-60.38 23.66-113.42 23.65-53.04 64.19-94.73L480-852.31l212.15 208.16q40.54 41.69 64.19 94.73Q780-496.38 780-436q0 124.31-87.54 210.15Q604.92-140 480-140M242.38-400h474q12-72-13.69-123.38Q677-574.77 650-600.77l-170-168-170 168q-27 26-52.81 77.39Q231.38-472 242.38-400"></path>
	</svg>
);
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
