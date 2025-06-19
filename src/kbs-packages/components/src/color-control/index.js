/**
 * External dependencies
 */
import clsx from 'clsx';
/**
 * WordPress dependencies
 */
import {
	Icon,
	Dropdown,
	ColorIndicator as CoreColorIndicator,
	Button,
	HStack,
	FlexItem,
	TabPanel,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useRef, useMemo } from '@wordpress/element';
import { color as colorIcon, check as checkIcon, close as closeIcon } from '@wordpress/icons';
import { useSettings } from '@wordpress/block-editor';
/**
 * Internal dependencies
 */
import {
	getColorOutput,
	getColorOptions,
	getDeviceValue,
	getInheritedDeviceValue,
	handleAttributeChange,
	getGradientOptions,
} from '@kadence/kbsHelpers';
import TitleBar from '../title-bar';
import ColorToggle from './color-toggle';
import ColorDropdown from './color-dropdown';
import './editor.scss';

export default function ColorControl({
	attributes,
	setAttributes,
	attributeName,
	meta,
	type = 'color',
	globalStylesIds,
	reset = true,
	label,
	hasDeviceControls = false,
	isAdvanced = false,
	advancedControls = [],
	isCustom = false,
	hasCustomControls = false,
	previewDevice = 'desktop',
	forStyleBook = false,
	defaultValue = undefined,
	customOnChange = undefined,
	hasGradient = false,
	hasMix = false,
	globalStylesCss,
}) {
	const popoverProps = {
		placement: 'left-start',
		//offset: 36,
		shift: true,
	};
	const [customColors] = useSettings('color.custom');
	const globalColors = getColorOptions();
	const globalGradients = hasGradient ? getGradientOptions() : [];
	const isDisableCustomColors = !customColors ? true : false;
	const currentValue = getDeviceValue(attributeName, attributes, previewDevice, type);
	const inherited = getInheritedDeviceValue(attributeName, attributes, previewDevice, meta, type, globalStylesIds);
	const onReset = () => {
		let resetValue = undefined;
		if (defaultValue) {
			resetValue = defaultValue;
		}
		onChange(resetValue, 'all', type);
	};
	const onChange = (value, device, customType) => {
		const typeToUse = customType ?? type;
		handleAttributeChange(value, device, attributeName, attributes, setAttributes, customOnChange, typeToUse, meta);
	};
	return (
		<div className={`components-base-control kbs-control kbs-color-control`}>
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
				<Dropdown
					popoverProps={popoverProps}
					className="kbs-color-select-control__dropdown"
					contentClassName={'kbs-color-select-control__dropdown-content'}
					renderToggle={ColorToggle({
						currentValue: currentValue,
						inherited: inherited?.inheritedValue ? inherited.inheritedValue : '',
						colors: globalColors,
						gradients: globalGradients,
					})}
					renderContent={ColorDropdown({
						colors: globalColors,
						currentValue: currentValue,
						inherited: inherited?.inheritedValue ? inherited.inheritedValue : '',
						onChange: onChange,
						previewDevice: previewDevice,
						type: type,
						hasGradient: hasGradient,
						hasMix: hasMix,
						globalStylesCss: globalStylesCss,
					})}
				/>
			</div>
		</div>
	);
}
