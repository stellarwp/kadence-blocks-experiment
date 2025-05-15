/**
 * WordPress libraries
 */
import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import { Button } from '@wordpress/components';

/**
 * Internal libraries
 */
import { getPreviewValue, getGlobalStylesPresetOptions, getInheritedDeviceValue, handleAttributeChange, isAdvancedOption } from '@kadence/kbsHelpers';
/**
 * Internal Dependencies
 */
import ResponsiveRadioRangeControls from '../range/responsive-radio-range-control';
import ResponsiveUnitControl from '../responsive-unit-control';
import ToolsPanelBody from '../tools-panel-body';
import RadioButtonControl from '../radio-button-control';
import TitleBar from '../title-bar';

const getPresets = (presetType) => {
	switch (presetType) {
		case 'background':
			return [
				{
					value: 'kbs-bg-base',
					label: 'Base',
				},
				{
					value: 'kbs-bg-variant-1',
					label: 'Variant 1',
				},
				{
					value: 'kbs-bg-variant-2',
					label: 'Variant 2',
				},
			];
		default:
			return [];
	}
};
export default function PresetControl({
	label,
	reset = true,
	attributes,
	setAttributes,
	attributeName,
	meta,
	previewDevice,
	globalStylesIds,
	customOnChange,
	view = 'default',
}) {
	const attributeMeta = meta?.attributes?.[attributeName];
	const presetType = attributeMeta?.component ? attributeMeta?.component : '';
	if (!presetType) {
		return null;
	}
	// Fetch available presets
	const presets = getPresets(presetType);
	// const presets = getGlobalStylesPresetOptions(presetType);
	// console.log(presets);
	// Get the first three presets in a custom array
	const presetOptions = presets.slice(0, 3);
	const inherited = getInheritedDeviceValue(
		attributeName,
		attributes,
		previewDevice,
		meta,
		'preset',
		globalStylesIds
	);
	const currentValue = attributes?.[attributeName]?.preset;

	const [isAdvanced, setIsAdvanced] = useState(view === 'advanced');
	const onChange = (value) => {
		handleAttributeChange(value, 'none', attributeName, attributes, setAttributes, customOnChange, 'preset', meta);
	};
	const onReset = () => {
		onChange(undefined);
	};
	useEffect(() => {
		if (view !== 'advanced' && currentValue && presets.length > 3) {
			setIsAdvanced(isAdvancedOption(presetOptions, presets, currentValue));
		} else if (view === 'advanced' && !isAdvanced) {
			setIsAdvanced(true);
		} else if (view !== 'advanced' && isAdvanced) {
			setIsAdvanced(false);
		}
	}, [view]);

	return (
		<div
			className={`components-base-control kbs-control kbs-radio-preset-control kbs-radio-preset-control-${presetType}`}
		>
			<TitleBar
				label={label}
				reset={reset}
				onReset={onReset}
				hasDeviceControls={false}
				isAdvanced={isAdvanced}
				onToggleView={() => setIsAdvanced(!isAdvanced)}
				hasAdvancedControls={presets.length > 3}
			/>
			<div className="kbs-control-inner">
				{presets.map((option) => (
					<Button
						key={option.value}
						label={option.label}
						isPressed={option.value === currentValue}
						className={`kbs-radio-preset-control-button`}
						onClick={() => onChange(option.value)}
					>
						<span className={`kbs-radio-preset-control-style ${option.value}`}></span>
					</Button>
				))}
			</div>
		</div>
	);
}
