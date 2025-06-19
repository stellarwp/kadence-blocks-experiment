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
import RadioButtonSelect from '../radio-button-control/radio-button-select';
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
	customOnChange = undefined,
}) {
	const topValue = getDeviceValue(attributeName, attributes, previewDevice, type + '-top');
	const rightValue = getDeviceValue(attributeName, attributes, previewDevice, type + '-right');
	const bottomValue = getDeviceValue(attributeName, attributes, previewDevice, type + '-bottom');
	const leftValue = getDeviceValue(attributeName, attributes, previewDevice, type + '-left');
	const inheritedTop = getInheritedDeviceValue(
		attributeName,
		attributes,
		previewDevice,
		meta,
		type + '-top',
		globalStylesIds
	);
	const inheritedRight = getInheritedDeviceValue(
		attributeName,
		attributes,
		previewDevice,
		meta,
		type + '-right',
		globalStylesIds
	);
	const inheritedBottom = getInheritedDeviceValue(
		attributeName,
		attributes,
		previewDevice,
		meta,
		type + '-bottom',
		globalStylesIds
	);
	const inheritedLeft = getInheritedDeviceValue(
		attributeName,
		attributes,
		previewDevice,
		meta,
		type + '-left',
		globalStylesIds
	);
	const onReset = () => {
		let resetValue = undefined;
		if (defaultValue) {
			resetValue = defaultValue;
		}
		onChange(resetValue, 'all', type);
	};
	const onChange = (value, device, type) => {
		console.log('onChange', value, device, type);
		handleAttributeChange(value, device, attributeName, attributes, setAttributes, customOnChange, type, meta);
	};
	// Return the JSX directly, not inside an array
	return (
		<div className={`components-base-control kbs-control kbs-space-control${className ? ' ' + className : ''}`}>
			{label && (
				<TitleBar
					label={label}
					reset={reset}
					onReset={onReset}
					hasDeviceControls={hasDeviceControls}
					hasAdvancedControls={false}
				/>
			)}
			<div className={'kadence-controls-content kadence-space-control-inner'}>
				<div className={'kadence-space-control-visualizer'}></div>
				<RadioButtonSelect
					label={__('Top', 'kadence-blocks')}
					type={type + '-top'}
					hasCustomControls={true}
					value={topValue}
					placeholder={inheritedTop?.inheritedValue || placeholder}
					onChange={onChange}
				/>
				<RadioButtonSelect
					label={__('Left', 'kadence-blocks')}
					type={type + '-left'}
					hasCustomControls={true}
					value={leftValue}
					placeholder={inheritedLeft?.inheritedValue || placeholder}
					onChange={onChange}
				/>
				<RadioButtonSelect
					label={__('Right', 'kadence-blocks')}
					type={type + '-right'}
					hasCustomControls={true}
					value={rightValue}
					placeholder={inheritedRight?.inheritedValue || placeholder}
					onChange={onChange}
				/>
				<RadioButtonSelect
					label={__('Bottom', 'kadence-blocks')}
					type={type + '-bottom'}
					hasCustomControls={true}
					value={bottomValue}
					placeholder={inheritedBottom?.inheritedValue || placeholder}
					onChange={onChange}
				/>
			</div>
		</div>
	);
}
