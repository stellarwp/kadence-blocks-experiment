/**
 * WordPress libraries
 */
import { __ } from '@wordpress/i18n';
import { useState, useEffect, useRef } from '@wordpress/element';
import { Button, Popover, Icon } from '@wordpress/components';
import { close as closeIcon } from '@wordpress/icons';

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
	getInheritedValue,
} from '@kadence/kbsHelpers';
/**
 * Internal Dependencies
 */
import ToolsPanelBody from '../tools-panel-body';
import RadioButtonControl from '../radio-button-control';
import RadioToggleGroupButtonUI from '../radio-button-control/ui-toggle-group';
import TitleBar from '../title-bar';
import './editor.scss';
function PresetControlConfirm({
	showConfirmPopover,
	confirmAnchor,
	handleCancel,
	handleConfirm,
	placement = 'top-start',
}) {
	return (
		<>
			{showConfirmPopover && confirmAnchor && (
				<Popover
					anchor={confirmAnchor}
					noArrow={false}
					placement={placement}
					onClose={handleCancel}
					className="kbs-confirm-popover"
				>
					<div className="kbs-confirm-popover-inner">
						<p>{__('This will override your existing styles. Are you sure?', 'kadence-blocks')}</p>
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
		</>
	);
}
export default function PresetControl({
	label,
	reset = true,
	attributes,
	setAttributes,
	attributeName,
	metaData,
	previewDevice,
	customOnChange,
	globalStylesCss,
	previewAmount = 3,
	definedPresets = [],
	view = 'default',
	isBundlePreset = false,
	globalStylesIds,
}) {
	const attributeMeta = metaData?.attributes?.[attributeName];
	const presetType = attributeMeta?.component ? attributeMeta?.component : '';
	if (!presetType) {
		return null;
	}
	// Fetch available presets
	const presets = getPresetOptions(presetType);
	// Get the first three presets in a custom array
	const presetOptions = definedPresets.length > 0 ? definedPresets : presets.slice(0, previewAmount);
	const hasRadioToggle = definedPresets.length > 0 ? true : false;

	const { inheritedValue, inheritedSource, inheritedType } = getInheritedValue(
		attributeName,
		attributes,
		'none',
		metaData,
		'',
		globalStylesIds
	);
	const currentValue = isBundlePreset ? inheritedValue : inheritedValue?.preset;

	const [isPopover, setIsPopover] = useState(false);
	const [showConfirmPopover, setShowConfirmPopover] = useState(false);
	const [pendingPreset, setPendingPreset] = useState(null);
	const [confirmAnchor, setConfirmAnchor] = useState(null);
	const [popoverAnchor, setPopoverAnchor] = useState(null);
	const [radioToggleAnchor, setRadioToggleAnchor] = useState(null);
	const [popoverPlacement, setPopoverPlacement] = useState('top-start');
	const divRef = useRef(null);
	useEffect(() => {
		if (divRef.current) {
			if (globalStylesCss) {
				divRef.current.setAttribute('style', globalStylesCss);
			} else {
				divRef.current.removeAttribute('style');
			}
		}
	}, [globalStylesCss, isPopover, divRef?.current]);
	const onChange = (value) => {
		if (attributes?.[attributeName]?.preset === value && value !== undefined) {
			return;
		}
		if (
			attributes?.[attributeName]?.desktop ||
			attributes?.[attributeName]?.tablet ||
			attributes?.[attributeName]?.mobile
		) {
			setPendingPreset(value);
			setShowConfirmPopover(true);
			return;
		}
		if (isBundlePreset) {
			setAttributes({ [attributeName]: value });
			return;
		}
		handleAttributeChange(
			value,
			'none',
			attributeName,
			attributes,
			setAttributes,
			customOnChange,
			'preset',
			metaData
		);
	};

	const handleConfirm = () => {
		if (pendingPreset) {
			handleMultipleAttributeChange(
				[undefined, undefined, undefined, pendingPreset],
				'none',
				attributeName,
				attributes,
				setAttributes,
				customOnChange,
				['desktop', 'tablet', 'mobile', 'preset'],
				metaData
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

	return (
		<div
			className={`components-base-control kbs-control kbs-radio-preset-control kbs-radio-preset-control-${presetType} ${isBundlePreset ? 'kbs-radio-preset-control-bundle' : ''}`}
		>
			<TitleBar
				label={label}
				reset={reset}
				onReset={onReset}
				rel={setPopoverAnchor}
				hasDeviceControls={false}
				isPopover={isPopover}
				onTogglePopover={() => setIsPopover(!isPopover)}
				hasPopoverControls={presets.length > previewAmount}
			/>
			{isPopover && popoverAnchor && (
				<Popover
					anchor={popoverAnchor}
					noArrow={true}
					placement="left-start"
					shift={true}
					offset={10}
					onClose={() => {
						if (showConfirmPopover) {
							return;
						}
						setIsPopover(false);
					}}
					className="kbs-preset-popover__dropdown-content kbs-radio-preset-control"
				>
					<TitleBar label={label} reset={false} />
					<div ref={divRef} className={`kbs-control-inner kbs-radio-preset-control-inner`}>
						{presets.map((option) => (
							<Button
								key={option.value}
								label={option.label}
								isPressed={option.value === currentValue}
								className={`kbs-radio-preset-control-button`}
								onClick={(event) => {
									setConfirmAnchor(event.currentTarget);
									setPopoverPlacement('top');
									onChange(option.value);
								}}
							>
								{option.label}
							</Button>
						))}
					</div>
					<div className="kbs-preset-popover__dropdown-content-close">
						<Button __next40pxDefaultSize onClick={() => setIsPopover(false)}>
							<Icon icon={closeIcon} size={24} />
						</Button>
					</div>
				</Popover>
			)}
			{hasRadioToggle && (
				<div className="kbs-radio-control">
					<div ref={setRadioToggleAnchor} className="kbs-control-inner kbs-radio-toggle-control-inner">
						<RadioToggleGroupButtonUI
							label={label}
							value={currentValue}
							onChange={(value) => {
								const target = radioToggleAnchor.querySelector(`[data-value="${value}"]`);
								setConfirmAnchor(target ? target : radioToggleAnchor);
								setPopoverPlacement('top-start');
								onChange(value);
							}}
							controls={presetOptions}
						/>
					</div>
				</div>
			)}
			{!hasRadioToggle && (
				<div className="kbs-control-inner kbs-radio-preset-control-inner">
					{presetOptions.map((option) => (
						<Button
							key={option.value}
							label={option.label}
							isPressed={option.value === currentValue}
							className={`kbs-radio-preset-control-button`}
							onClick={(event) => {
								setConfirmAnchor(event.currentTarget);
								setPopoverPlacement('top-start');
								onChange(option.value);
							}}
						>
							{option.label}
						</Button>
					))}
				</div>
			)}
			<PresetControlConfirm
				showConfirmPopover={showConfirmPopover}
				confirmAnchor={confirmAnchor}
				handleCancel={handleCancel}
				handleConfirm={handleConfirm}
				placement={popoverPlacement}
			/>
		</div>
	);
}
