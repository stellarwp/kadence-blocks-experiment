/**
 * Range Control
 *
 */

/**
 * Import Css
 */
import './editor.scss';
/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n';
import { __experimentalUnitControl as CoreUnitControl } from '@wordpress/components';

import TitleBar from '../title-bar';
import { getNumberFromRawValue } from '../radio-button-control/utils';
import { useMemo } from '@wordpress/element';
/**
 * Build the Measure controls
 * @returns {object} Measure settings.
 */
export default function UnitControl({
	onChange,
	type,
	value = '',
	inherited,
	placeholder = '',
	className = '',
	defaultValue = '',
	previewDevice = 'desktop',
	max = 200,
	min = 0,
	units = [],
	label = '',
	labelPosition = 'top',
	step = undefined,
	reset = true,
	isHover = false,
}) {
	const onReset = () => {
		let resetValue = undefined;
		if (defaultValue) {
			resetValue = defaultValue;
		}
		onChange(resetValue, 'Desktop' === previewDevice ? 'all' : previewDevice, type);
	};
	const placeholderValue = useMemo(() => {
		if (inherited?.inheritedValue) {
			return getNumberFromRawValue(inherited?.inheritedValue);
		}
		return placeholder;
	}, [inherited, placeholder]);
	// Return the JSX directly, not inside an array
	return (
		<div className={`components-base-control kbs-control kbs-unit-control${className ? ' ' + className : ''}`}>
			{label && 'top' === labelPosition && (
				<TitleBar
					label={label}
					reset={reset}
					onReset={onReset}
					isHover={isHover}
					hasDeviceControls={false}
					hasAdvancedControls={false}
				/>
			)}
			<div className={'kbs-unit-control-inner'}>
				<CoreUnitControl
					label={label && 'top' !== labelPosition ? label : ''}
					labelPosition={label && 'top' !== labelPosition ? labelPosition : undefined}
					className={'kbs-input-control'}
					__next40pxDefaultSize={true}
					min={min}
					max={max}
					step={step}
					units={units}
					value={value}
					placeholder={placeholderValue}
					disableUnits={false}
					onChange={onChange}
				/>
			</div>
		</div>
	);
}
