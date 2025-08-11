/**
 * Angle Picker Control
 */
import clsx from 'clsx';
/**
 * WordPress dependencies
 */
import { AnglePickerControl as CoreAnglePickerControl } from '@wordpress/components';

import { getDeviceValue, getInheritedDeviceValue, handleAttributeChange } from '@kadence/kbsHelpers';
import TitleBar from '../title-bar';
import './editor.scss';

/**
 * Build the Angle Picker Control
 *
 * @param {Object} props Component props.
 * @return {JSX.Element} Angle picker control.
 */
export default function AnglePickerControl(props) {
	const {
		label,
		onChange,
		defaultValue,
		attributeName,
		attributes,
		setAttributes,
		type = '',
		reset = true,
		previewDevice = 'Desktop',
		meta,
		globalStylesIds,
		className,
		titleBar = true,
		hasDeviceControls = false,
	} = props;

	const currentValue = getDeviceValue(attributeName, attributes, previewDevice, type);
	const inherited = getInheritedDeviceValue(attributeName, attributes, previewDevice, meta, type, globalStylesIds);

	const defaultOnChange = (value, device, type) => {
		handleAttributeChange(value, device, attributeName, attributes, setAttributes, onChange, type, meta);
	};

	const onChangeToUse = onChange ?? defaultOnChange;

	const onReset = () => {
		let resetValue = undefined;
		if (defaultValue) {
			resetValue = defaultValue;
		}
		onChangeToUse(resetValue, previewDevice === 'desktop' ? 'all' : previewDevice, type);
	};

	// Parse the angle value - handle both numeric and string values
	const parseAngleValue = (value) => {
		if (!value) return 0;
		if (typeof value === 'string' && value.endsWith('deg')) {
			return parseFloat(value) || 0;
		}
		return parseFloat(value) || 0;
	};

	const handleAngleChange = (angle) => {
		onChangeToUse(angle, previewDevice, type);
	};

	return (
		<div className={`components-base-control kbs-control kbs-angle-picker-control`}>
			{label && titleBar && (
				<TitleBar
					label={label}
					reset={reset}
					onReset={onReset}
					hasDeviceControls={hasDeviceControls}
					previewDevice={previewDevice}
				/>
			)}
			<CoreAnglePickerControl
				__next40pxDefaultSize
				className={clsx('kbs-input-control', className)}
				value={parseAngleValue(currentValue)}
				onChange={handleAngleChange}
				inherited={inherited}
				label={!titleBar ? label : false}
			/>
		</div>
	);
}
