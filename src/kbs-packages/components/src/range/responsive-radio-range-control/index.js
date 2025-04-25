/**
 * Responsive Radio Range Component for Kadence Blocks
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import RadioRangeControl from '../radio-range-control';
import TitleBar from '../../title-bar';
import {
	getResolvedValue,
	handleAttributeChange,
} from '@kadence/kbsHelpers';
import './editor.scss';
import { fontSizeOptions, letterCaseOptions } from './constants';
import InheritanceIndicator from '../../inheritance-indicator';
/**
 * Build the Responsive Radio Range Controls
 *
 * @param {Object} props Component props.
 * @return {JSX.Element} Responsive Radio Range control.
 */
export default function ResponsiveRadioRangeControls({
	label,
	customOnChange,
	defaultValue,
	attributeName,
	type = 'fontSize',
	attributes,
	setAttributes,
	reset = true,
	previewDevice,
	options = [],
	meta,
	mergedGlobalStyle,
	step = 1,
	max = 200,
	min = 0,
	unit,
	showUnit = false,
	units = ['px', 'em', 'rem'],
	disableCustomSizes = false,
}) {
	const { directValue, inheritedValue, inheritedSource, isInherited, appliedValue, inheritedType } = getResolvedValue(
		attributeName,
		attributes,
		previewDevice,
		meta,
		type,
		mergedGlobalStyle
	);

	let controlOptions = [];
	switch (type) {
		case 'fontSize':
			controlOptions = fontSizeOptions;
			break;
		case 'textTransform':
			controlOptions = letterCaseOptions;
			break;
		default:
			controlOptions = options;
			break;
	}

	const onReset = () => {
		onChange(defaultValue ?? undefined, 'all');
	};

	const onChange = (value, device) => {
		handleAttributeChange(
			value,
			device,
			attributeName,
			attributes,
			setAttributes,
			customOnChange,
			type,
			meta?.['attributes']?.[attributeName]
		);
	};

	return (
		<div className="components-base-control kbs-responsive-radio-range-control" key={attributeName + previewDevice}>
			{label && <TitleBar label={label} hasDeviceControls={true} reset={reset} onReset={onReset} />}
			<div className="kbs-responsive-radio-range-inner">
                <RadioRangeControl
                    value={directValue}
                    inheritedValue={inheritedValue}
                    appliedValue={appliedValue}
                    onChange={(value) => onChange(value, previewDevice)}
                    options={controlOptions}
                    defaultValue={defaultValue}
                    min={min}
                    max={max}
                    step={step}
                    unit={unit}
                    showUnit={showUnit}
                    units={units}
                    disableCustomSizes={disableCustomSizes}
                />
				<InheritanceIndicator inheritedSource={inheritedSource} inheritedType={inheritedType} />
			</div>
		</div>
	);
} 