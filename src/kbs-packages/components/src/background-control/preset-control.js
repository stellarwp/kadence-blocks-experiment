/**
 * WordPress libraries
 */
import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import { Button, Popover } from '@wordpress/components';

/**
 * Internal libraries
 */
import {
	getPreviewValue,
	getPresetOptions,
	getInheritedDeviceValue,
	handleAttributeChange,
	isAdvancedOption,
	handleMultipleAttributeChange,
} from '@kadence/kbsHelpers';
/**
 * Internal Dependencies
 */
import ToolsPanelBody from '../tools-panel-body';
import RadioButtonControl from '../radio-button-control';
import TitleBar from '../title-bar';
import BackgroundPresetRender from '../background-styles/preset-render';

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
	const presets = getPresetOptions(presetType);
	// console.log(presets);
	// Get the first three presets in a custom array
	const presetOptions = presets.slice(0, 3);
	const currentValue = attributes?.[attributeName]?.preset;

	const [isAdvanced, setIsAdvanced] = useState(view === 'advanced');
	const [showConfirmPopover, setShowConfirmPopover] = useState(false);
	const [pendingPreset, setPendingPreset] = useState(null);
	const [popoverAnchor, setPopoverAnchor] = useState(null);

	const onChange = (value) => {
		if (attributes?.[attributeName]?.preset === value) {
			return;
		}
		if (attributes?.[attributeName]?.layers?.length > 0) {
			setPendingPreset(value);
			setShowConfirmPopover(true);
			return;
		}
		handleAttributeChange(value, 'none', attributeName, attributes, setAttributes, customOnChange, 'preset', meta);
	};

	const handleConfirm = () => {
		if (pendingPreset) {
			handleMultipleAttributeChange(
				[undefined, pendingPreset],
				'none',
				attributeName,
				attributes,
				setAttributes,
				customOnChange,
				['layers', 'preset'],
				meta
			);
			setShowConfirmPopover(false);
			setPendingPreset(null);
		}
	};

	const handleCancel = () => {
		setShowConfirmPopover(false);
		setPendingPreset(null);
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
			<div className="kbs-control-inner kbs-radio-preset-control-inner">
				{presets.map((option) => (
					<Button
						key={option.value}
						label={option.label}
						isPressed={option.value === currentValue}
						className={`kbs-radio-preset-control-button`}
						onClick={(event) => {
							setPopoverAnchor(event.currentTarget);
							onChange(option.value);
						}}
					>
						<BackgroundPresetRender
							preset={option}
							attributeName={attributeName}
							meta={meta}
							previewDevice={previewDevice}
							globalStylesIds={globalStylesIds}
							uniqueID={attributes?.uniqueID}
							className={`kbs-radio-preset-control-style`}
						/>
					</Button>
				))}
			</div>
			{showConfirmPopover && popoverAnchor && (
				<Popover
					anchor={popoverAnchor}
					noArrow={false}
					placement="top"
					onClose={handleCancel}
					className="kbs-confirm-popover"
				>
					<div className="kbs-confirm-popover-inner">
						<p>
							{__('This will override your existing background styles. Are you sure?', 'kadence-blocks')}
						</p>
						<div className="kbs-confirm-buttons">
							<Button variant="primary" onClick={handleConfirm}>
								{__('Confirm', 'kadence-blocks')}
							</Button>
							<Button variant="secondary" onClick={handleCancel}>
								{__('Cancel', 'kadence-blocks')}
							</Button>
						</div>
					</div>
				</Popover>
			)}
		</div>
	);
}
