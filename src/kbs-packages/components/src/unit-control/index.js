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

/**
 * Build the Measure controls
 * @returns {object} Measure settings.
 */
export default function UnitControl({
	onChange,
	value = '',
	appliedValue = '',
	inheritedValue = '',
	className = '',
	max = 200,
	min = 0,
	units = [],
}) {
	const step = appliedValue.includes('px') ? 1 : appliedValue.includes('rem') ? 0.01 : 0.01;

	// Return the JSX directly, not inside an array
	return (
		<div
			className={`components-base-control component-font-size-control kadence-font-size-control${className ? ' ' + className : ''}`}
		>
			<div className={'kadence-controls-content kadence-single-unit-control'}>
				<CoreUnitControl
					min={min}
					max={max}
					step={step}
					units={units}
					value={value || appliedValue}
					disableUnits={false}
					onChange={(newVal) => onChange(newVal)}
				/>
			</div>
		</div>
	);
}
