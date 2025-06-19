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
import { getDeviceValue, getInheritedDeviceValue, handleAttributeChange } from '@kadence/kbsHelpers';
import TitleBar from '../title-bar';
/**
 * Build the Measure controls
 * @returns {object} Measure settings.
 */
export default function SpaceControl({
	attributes,
	setAttributes,
	attributeName,
	meta,
	type,
	globalStylesIds,
	placeholder = '',
	className = '',
	defaultValue = '',
	previewDevice = 'desktop',
	max = 200,
	min = 0,
	units = [],
	label = '',
	step = undefined,
	reset = true,
	hasDeviceControls = false,
}) {
	const currentValue = getDeviceValue(attributeName, attributes, previewDevice, type);
	const inherited = getInheritedDeviceValue(attributeName, attributes, previewDevice, meta, type, globalStylesIds);
	const onReset = () => {
		let resetValue = undefined;
		if (defaultValue) {
			resetValue = defaultValue;
		}
		onChange(resetValue, 'all', type);
	};
	const onChange = (value, device, type) => {
		handleAttributeChange(value, device, attributeName, attributes, setAttributes, customOnChange, type, meta);
	};
	// Return the JSX directly, not inside an array
	return (
		<div className={`components-base-control kbs-control kbs-unit-control${className ? ' ' + className : ''}`}>
			{label && (
				<TitleBar
					label={label}
					reset={reset}
					onReset={onReset}
					hasDeviceControls={hasDeviceControls}
					hasAdvancedControls={false}
				/>
			)}
			<div className={'kadence-controls-content kadence-single-unit-control'}>
				<CoreUnitControl
					className={'kbs-input-control'}
					__next40pxDefaultSize={true}
					min={min}
					max={max}
					step={step}
					units={units}
					value={currentValue}
					placeholder={inherited?.inheritedValue || placeholder}
					disableUnits={false}
					onChange={onChange}
				/>
			</div>
		</div>
	);
}
