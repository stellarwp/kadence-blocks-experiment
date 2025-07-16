/**
 * Select Styled
 */
import clsx from 'clsx';
/**
 * WordPress dependencies
 */
import { TextControl as CoreTextControl, TextareaControl as CoreTextAreaControl } from '@wordpress/components';

import { getDeviceValue, getInheritedDeviceValue, handleAttributeChange } from '@kadence/kbsHelpers';
import TitleBar from '../title-bar';
import './editor.scss';

/**
 * Build the Font Select control
 *
 * @param {Object} props Component props.
 * @return {JSX.Element} Font select control.
 */
export default function TextControl(props) {
	const {
		label,
		onChange,
		defaultValue,
		attributeName,
		attributes,
		setAttributes,
		type = '',
		reset = true,
		previewDevice = 'desktop',
		meta,
		globalStylesIds,
		className,
		titleBar = true,
		textArea = false,
		hasDeviceControls = false,
		...rest
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

	const TextControlToUse = textArea ? CoreTextAreaControl : CoreTextControl;

	return (
		<div className={`components-base-control kbs-control kbs-text-control`}>
			{label && titleBar && (
				<TitleBar
					label={label}
					reset={reset}
					onReset={onReset}
					hasDeviceControls={hasDeviceControls}
					previewDevice={previewDevice}
				/>
			)}
			<TextControlToUse
				{...rest}
				__next40pxDefaultSize
				className={clsx('kbs-input-control', className)}
				value={currentValue}
				onChange={(itemValue) => onChangeToUse(itemValue, previewDevice, type)}
				inherited={inherited}
				label={!titleBar ? label : undefined}
			/>
		</div>
	);
}
