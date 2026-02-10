/**
 * Select Styled
 */
import clsx from 'clsx';
/**
 * WordPress dependencies
 */
import { __, isRTL } from '@wordpress/i18n';
import { useMemo } from '@wordpress/element';
import { SelectControl } from '@wordpress/components';

/**
 * External dependencies
 */

import TitleBar from '../title-bar';
import './editor.scss';

/**
 * Build the Font Select control
 *
 * @param {Object} props Component props.
 * @return {JSX.Element} Font select control.
 */
export default function SelectBasicControlSelect(props) {
	const {
		label,
		onChange,
		value,
		options,
		isHover,
		previewDevice,
		defaultValue = undefined,
		type,
		inherited,
	} = props;
	const onReset = () => {
		let resetValue;
		if (defaultValue) {
			resetValue = defaultValue;
		}
		onChange(resetValue, previewDevice === 'desktop' ? 'all' : previewDevice, type);
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
				<SelectControl
					className={clsx('kbs-core-select-control', !value && inherited?.inheritedValue && 'kbs-inherited')}
					__next40pxDefaultSize={true}
					value={value || inherited?.inheritedValue}
					onChange={(item) => onChange(item, previewDevice, type)}
					options={options}
				/>
			</div>
		</div>
	);
}
