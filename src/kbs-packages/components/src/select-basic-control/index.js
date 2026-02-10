/**
 * Select Styled
 */
import clsx from 'clsx';
/**
 * WordPress dependencies
 */
import { __, isRTL } from '@wordpress/i18n';
import { useMemo } from '@wordpress/element';

/**
 * External dependencies
 */

import TitleBar from '../title-bar';
import './editor.scss';
import { SelectControl } from '@wordpress/components';
import { getDeviceValue, getInheritedDeviceValue, handleAttributeChange } from '@kadence/kbsHelpers';

/**
 * Build the Font Select control
 *
 * @param {Object} props Component props.
 * @return {JSX.Element} Font select control.
 */
export default function SelectBasicControl(props) {
	const {
		label,
		onChange,
		defaultValue,
		attributeName,
		options,
		attributes,
		setAttributes,
		type = '',
		reset = true,
		previewDevice = 'Desktop',
		meta,
		globalStylesIds,
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
		let resetValue;
		if (defaultValue) {
			resetValue = defaultValue;
		}
		onChangeToUse(resetValue, previewDevice === 'desktop' ? 'all' : previewDevice, type);
	};

	return (
		<div className={`components-base-control kbs-control kbs-select-basic-control`}>
			{label && titleBar && (
				<TitleBar
					label={label}
					reset={reset}
					onReset={onReset}
					hasDeviceControls={hasDeviceControls}
					previewDevice={previewDevice}
				/>
			)}
			<div className="kbs-control-inner">
				<SelectControl
					className={clsx(
						'kbs-core-select-control',
						!currentValue && inherited?.inheritedValue && 'kbs-inherited'
					)}
					__next40pxDefaultSize={true}
					value={currentValue || inherited?.inheritedValue}
					onChange={(itemValue) => onChangeToUse(itemValue, previewDevice, type)}
					options={options}
					label={!titleBar ? label : undefined}
				/>
			</div>
		</div>
	);
}
