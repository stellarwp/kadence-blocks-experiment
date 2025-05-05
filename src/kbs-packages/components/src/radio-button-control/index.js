/**
 * Responsive Radio Button Control
 *
 */

/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import { getDeviceValue, getInheritedDeviceValue, GlobalStylesContext } from '@kadence/kbsHelpers';
import { handleAttributeChange, isAdvancedOption } from '@kadence/kbsHelpers';
import { useEffect, useState } from '@wordpress/element';
import { getRadioConfig } from './controls-config';
import TitleBar from '../title-bar';

import './editor.scss';

/**
 * Build the Radio Button control.
 */
export default function RadioButtonControl({
	label,
	customOnChange,
	defaultValue,
	attributeName,
	options,
	attributes,
	setAttributes,
	isCollapsed = false,
	type = '',
	radioType = 'textAlign',
	reset = true,
	previewDevice,
	meta,
	previewDirection = 'column',
	hasDeviceControls = false,
	view = 'default',
}) {
	// Get the globalStylesIds from context
	const globalStylesIds = useContext(GlobalStylesContext);
	const radioConfig = type ? type : radioType;
	const currentValue = getDeviceValue(attributeName, attributes, previewDevice, type);
	const inherited = getInheritedDeviceValue(attributeName, attributes, previewDevice, meta, type, globalStylesIds);
	const { UIComponent, controls, advancedControls } = getRadioConfig(radioConfig, previewDirection);
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
	const [isAdvanced, setIsAdvanced] = useState(view === 'advanced');
	useEffect(() => {
		if (view !== 'advanced' && currentValue && advancedControls) {
			setIsAdvanced(isAdvancedOption(controls, advancedControls, currentValue));
		}
	}, []);

	return (
		<div className={`components-base-control kbs-control kbs-radio-control kbs-radio-control-${radioType}`}>
			<TitleBar
				label={label}
				reset={reset}
				onReset={onReset}
				hasDeviceControls={hasDeviceControls}
				isAdvanced={isAdvanced}
				onToggleView={() => setIsAdvanced(!isAdvanced)}
				hasAdvancedControls={advancedControls && advancedControls.length > 0}
			/>
			<div className="kbs-control-inner">
				<UIComponent
					value={currentValue}
					label={label}
					inherited={inherited}
					isCollapsed={isCollapsed}
					onChange={(itemValue) => onChange(itemValue, previewDevice, type)}
					controls={isAdvanced && advancedControls ? advancedControls : controls}
				/>
			</div>
		</div>
	);
}
