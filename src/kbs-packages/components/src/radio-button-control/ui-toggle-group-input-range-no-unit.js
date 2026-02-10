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
import RangeUIControlNoUnit from './ui-range-no-unit';

function RadioToggleGroupInputRangeUINoUnit({
	value,
	onChange,
	inherited,
	controls = [],
	label = '',
	isCustom = false,
	labelPosition = 'top',
	initialPosition = null,
	placeholder = '',
	min = null,
	max = null,
	step = null,
}) {
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
				<RangeUIControlNoUnit
					value={value}
					inherited={inherited}
					onChange={onChange}
					controls={controls}
					label={label}
					initialPosition={initialPosition}
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

export default RadioToggleGroupInputRangeUINoUnit;
