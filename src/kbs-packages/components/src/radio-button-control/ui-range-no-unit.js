import clsx from 'clsx';
/**
 * WordPress dependencies
 */
import { __, _x } from '@wordpress/i18n';
import { __experimentalNumberControl as NumberControl, RangeControl, Flex, FlexItem } from '@wordpress/components';
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

function RangeUIControlNoUnit({
	value,
	onChange,
	min = null,
	max = null,
	placeholder,
	labelPosition = 'top',
	label = '',
	step = null,
	inherited,
}) {
	const unitControlOnChange = (value) => {
		onChange(value);
	};
	const rangeControlOnChange = (newValue) => {
		console.log('newValue', newValue);
		onChange(newValue);
	};
	const placeholderValue = useMemo(() => {
		if (inherited?.inheritedValue) {
			return getNumberFromRawValue(inherited?.inheritedValue);
		}
		return placeholder;
	}, [inherited, placeholder]);
	return (
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
					step={step || 1}
					showTooltip={false}
					withInputField={false}
				/>
			</FlexItem>
			<FlexItem className="kbs-unit-control-wrapper">
				<NumberControl
					className="kbs-unit-control kbs-input-control"
					__next40pxDefaultSize={true}
					placeholder={placeholderValue}
					label={label && 'top' !== labelPosition ? label : undefined}
					labelPosition={'top' !== labelPosition ? labelPosition : undefined}
					value={value}
					onChange={unitControlOnChange}
					min={null !== min ? min : minValue}
					max={null !== max ? max : maxValue}
				/>
			</FlexItem>
		</Flex>
	);
}

export default RangeUIControlNoUnit;
