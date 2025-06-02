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
import SelectBasicControlSelect from './select';
import './editor.scss';

/**
 * Build the Font Select control
 *
 * @param {Object} props Component props.
 * @return {JSX.Element} Font select control.
 */
export default function SelectBasicControl(props) {
	const {
		label,
		customOnChange,
		defaultValue,
		attributeName,
		options,
		attributes,
		setAttributes,
		type = '',
		reset = true,
		previewDevice = 'desktop',
		meta,
	} = props;
	const onReset = () => {
		let resetValue = undefined;
		if (defaultValue) {
			resetValue = defaultValue;
		}
		onChange(resetValue, previewDevice === 'desktop' ? 'all' : previewDevice, type);
	};
	const currentValue = getDeviceValue(attributeName, attributes, previewDevice, type);
	const inherited = getInheritedDeviceValue(attributeName, attributes, previewDevice, meta, type, globalStylesIds);
	const onChange = (value, device, type) => {
		handleAttributeChange(value, device, attributeName, attributes, setAttributes, customOnChange, type, meta);
	};
	return (
		<div className={`components-base-control kbs-control kbs-select-basic-control`}>
			{label && (
				<TitleBar
					label={label}
					reset={true}
					onReset={onReset}
					hasDeviceControls={false}
					isHover={isHover}
					previewDevice={previewDevice}
				/>
			)}
			<div className="kbs-control-inner">
				<SelectBasicControlSelect
					className="kbs-core-select-control"
					__next40pxDefaultSize={true}
					value={currentValue}
					onChange={(itemValue) => onChange(itemValue, previewDevice, type)}
					options={options}
					inherited={inherited}
				/>
			</div>
		</div>
	);
}
