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
import { handleAttributeChange, isAdvancedOption, isCustomOption } from '@kadence/kbsHelpers';
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
	previewDevice = 'desktop',
	meta,
	previewDirection = 'column',
	hasDeviceControls = false,
	hasCustomControls = false,
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
		onChange(resetValue, previewDevice === 'desktop' ? 'all' : previewDevice, type);
	};
	const onChange = (value, device, type) => {
		handleAttributeChange(value, device, attributeName, attributes, setAttributes, customOnChange, type, meta);
	};
	const [isAdvanced, setIsAdvanced] = useState(view === 'advanced');
	const [isCustom, setIsCustom] = useState(false);
	useEffect(() => {
		if (view !== 'advanced' && currentValue && advancedControls) {
			setIsAdvanced(isAdvancedOption(controls, advancedControls, currentValue));
		} else if (view === 'advanced' && !isAdvanced) {
			setIsAdvanced(true);
		} else if (view !== 'advanced' && isAdvanced) {
			setIsAdvanced(false);
		}
	}, [view]);
	useEffect(() => {
		if (!isCustom && currentValue && hasCustomControls) {
			setIsCustom(isCustomOption(controls, currentValue));
		}
	}, [currentValue]);

	return (
		<div className={`components-base-control kbs-control kbs-radio-control kbs-radio-control-${radioConfig}`}>
			<TitleBar
				label={label}
				reset={reset}
				onReset={onReset}
				hasDeviceControls={hasDeviceControls}
				isAdvanced={isAdvanced}
				onToggleView={() => setIsAdvanced(!isAdvanced)}
				hasAdvancedControls={advancedControls && advancedControls.length > 0}
				isCustom={isCustom}
				onToggleCustom={() => setIsCustom(!isCustom)}
				hasCustomControls={hasCustomControls}
			/>
			<div className="kbs-control-inner">
				<UIComponent
					value={currentValue}
					label={label}
					inherited={inherited}
					isCollapsed={isCollapsed}
					onChange={(itemValue) => onChange(itemValue, previewDevice, type)}
					controls={isAdvanced && advancedControls?.length > 0 ? advancedControls : controls}
					isCustom={isCustom}
					type={type}
				/>
			</div>
		</div>
	);
}
