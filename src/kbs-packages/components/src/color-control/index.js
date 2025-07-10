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
import { useRef, useMemo, useState } from '@wordpress/element';
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
	hasMix = true,
	globalStylesCss,
	hasToggleLabel = true,
	hasTitleBar = true,
	hasHoverControls = false,
	currentValue,
	inherited,
}) {
	const [isHover, setIsHover] = useState(false);
	const popoverProps = {
		placement: 'left-start',
		//offset: 36,
		shift: true,
	};
	const [customColors] = useSettings('color.custom');
	const globalColors = getColorOptions();
	const globalGradients = hasGradient ? getGradientOptions() : [];
	const isDisableCustomColors = !customColors ? true : false;
	const typeToUse = isHover ? `${type}Hover` : type;

	const currentValueToUse = currentValue ?? getDeviceValue(attributeName, attributes, previewDevice, typeToUse);
	const inheritedToUse =
		inherited ??
		getInheritedDeviceValue(attributeName, attributes, previewDevice, meta, typeToUse, globalStylesIds);

	const onReset = () => {
		let resetValue = undefined;
		if (defaultValue) {
			resetValue = defaultValue;
		}
		onChange(resetValue, 'all', typeToUse);
	};
	const onChange = (value, device, customType) => {
		const typeToUseHere = customType ?? typeToUse;
		handleAttributeChange(
			value,
			device,
			attributeName,
			attributes,
			setAttributes,
			customOnChange,
			typeToUseHere,
			meta
		);
	};
	return (
		<div className={`components-base-control kbs-control kbs-color-control`}>
			{hasTitleBar && (
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
					hasHoverControls={hasHoverControls}
					onToggleHover={() => setIsHover(!isHover)}
					isHover={isHover}
				/>
			)}
			<div className="kbs-control-inner">
				<Dropdown
					popoverProps={popoverProps}
					className="kbs-color-select-control__dropdown"
					contentClassName={'kbs-color-select-control__dropdown-content'}
					renderToggle={ColorToggle({
						currentValue: currentValueToUse,
						inherited: inheritedToUse?.inheritedValue ? inheritedToUse.inheritedValue : '',
						colors: globalColors,
						gradients: globalGradients,
						hasToggleLabel: hasToggleLabel,
					})}
					renderContent={ColorDropdown({
						colors: globalColors,
						currentValue: currentValueToUse,
						inherited: inheritedToUse?.inheritedValue ? inheritedToUse.inheritedValue : '',
						onChange: onChange,
						previewDevice: previewDevice,
						type: typeToUse,
						hasGradient: hasGradient,
						hasMix: hasMix,
						globalStylesCss: globalStylesCss,
					})}
				/>
			</div>
		</div>
	);
}
