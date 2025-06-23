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
import { useEffect } from '@wordpress/element';
import {
	getDeviceValue,
	getInheritedDeviceValue,
	handleAttributeChange,
	mouseOverVisualizer,
} from '@kadence/kbsHelpers';
import TitleBar from '../title-bar';
import RadioButtonSelect from '../radio-button-control/radio-button-select';
import { PaddingVisualizer } from './spacing-visualizer';
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
	showVisualizer = false,
	clientId = '',
	blockElementRef = null,
}) {
	const typeMouseOver = mouseOverVisualizer();
	const topValue = getDeviceValue(attributeName, attributes, previewDevice, type + 'Top');
	const rightValue = getDeviceValue(attributeName, attributes, previewDevice, type + 'Right');
	const bottomValue = getDeviceValue(attributeName, attributes, previewDevice, type + 'Bottom');
	const leftValue = getDeviceValue(attributeName, attributes, previewDevice, type + 'Left');
	const inheritedTop = getInheritedDeviceValue(
		attributeName,
		attributes,
		previewDevice,
		meta,
		type + 'Top',
		globalStylesIds
	);
	const inheritedRight = getInheritedDeviceValue(
		attributeName,
		attributes,
		previewDevice,
		meta,
		type + 'Right',
		globalStylesIds
	);
	const inheritedBottom = getInheritedDeviceValue(
		attributeName,
		attributes,
		previewDevice,
		meta,
		type + 'Bottom',
		globalStylesIds
	);
	const inheritedLeft = getInheritedDeviceValue(
		attributeName,
		attributes,
		previewDevice,
		meta,
		type + 'Left',
		globalStylesIds
	);
	const onReset = () => {
		let resetValue = undefined;
		if (defaultValue) {
			resetValue = defaultValue;
		}
		onChange(resetValue, previewDevice === 'Desktop' ? 'all' : previewDevice, type);
	};
	useEffect(() => {
		//console.log('iglobalStylesIds', globalStylesIds);
	}, [inheritedTop]);
	const onChange = (value, device, type) => {
		console.log('onChange', value, device, type);
		handleAttributeChange(value, device, attributeName, attributes, setAttributes, customOnChange, type, meta);
	};
	// Return the JSX directly, not inside an array
	return (
		<>
			<div
				onMouseOver={typeMouseOver.onMouseOver}
				onMouseOut={typeMouseOver.onMouseOut}
				className={`components-base-control kbs-control kbs-space-control${className ? ' ' + className : ''}`}
			>
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
						type={type + 'Top'}
						hasCustomControls={true}
						value={topValue}
						inherited={inheritedTop}
						onChange={onChange}
					/>
					<RadioButtonSelect
						label={__('Left', 'kadence-blocks')}
						type={type + 'Left'}
						hasCustomControls={true}
						value={leftValue}
						inherited={inheritedLeft}
						onChange={onChange}
					/>
					<RadioButtonSelect
						label={__('Right', 'kadence-blocks')}
						type={type + 'Right'}
						hasCustomControls={true}
						value={rightValue}
						inherited={inheritedRight}
						onChange={onChange}
					/>
					<RadioButtonSelect
						label={__('Bottom', 'kadence-blocks')}
						type={type + 'Bottom'}
						hasCustomControls={true}
						value={bottomValue}
						inherited={inheritedBottom}
						onChange={onChange}
					/>
				</div>
			</div>
			{type === 'padding' && (
				<PaddingVisualizer
					forceShow={typeMouseOver.isMouseOver}
					clientId={clientId}
					blockElementRef={blockElementRef}
					value={[inheritedTop, inheritedRight, inheritedBottom, inheritedLeft]}
				/>
			)}
		</>
	);
}
