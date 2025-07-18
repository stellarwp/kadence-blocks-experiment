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
} from '@kadence/kbsHelpers';
/**
 * Internal Dependencies
 */
import ToolsPanelBody from '../tools-panel-body';
import RadioButtonControl from '../radio-button-control';
import TitleBar from '../title-bar';
import ShadowPresetRender from './preset-render';
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
						<p>{__('This will override your existing shadow styles. Are you sure?', 'kadence-blocks')}</p>
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
export default function ShadowPresetControl({
	label,
	reset = true,
	attributes,
	setAttributes,
	attributeName,
	meta,
	previewDevice,
	globalStylesIds,
	customOnChange,
	globalStylesCss,
	type = 'boxShadow',
	view = 'default',
}) {
	const attributeMeta = meta?.attributes?.[attributeName];
	const presetType = attributeMeta?.component ? attributeMeta?.component : '';
	if (!presetType) {
		return null;
	}
	// Fetch available presets
	const presets = getPresetOptions(presetType);

	// Get the first three presets in a custom array
	const presetOptions = presets.slice(0, 3);
	const currentValue = attributes?.[attributeName]?.preset;

	const [isPopover, setIsPopover] = useState(false);
	const [showConfirmPopover, setShowConfirmPopover] = useState(false);
	const [pendingPreset, setPendingPreset] = useState(null);
	const [confirmAnchor, setConfirmAnchor] = useState(null);
	const [popoverAnchor, setPopoverAnchor] = useState(null);
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

	return (
		<div
			className={`components-base-control kbs-control kbs-radio-preset-control kbs-radio-preset-control-${presetType}`}
		>
			<TitleBar
				label={label}
				reset={reset}
				onReset={onReset}
				rel={setPopoverAnchor}
				hasDeviceControls={false}
				isPopover={isPopover}
				onTogglePopover={() => setIsPopover(!isPopover)}
				hasPopoverControls={presets.length > 3}
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
					className="kbs-popover-background-select-control__dropdown-content kbs-radio-preset-control"
				>
					<TitleBar label={__('Shadow Presets', 'kadence-blocks')} reset={false} />
					<div ref={divRef} className="kbs-control-inner kbs-radio-preset-control-inner">
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
								<ShadowPresetRender
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
					<div className="kbs-popover-background-select-control__dropdown-content-close">
						<Button __next40pxDefaultSize onClick={() => setIsPopover(false)}>
							<Icon icon={closeIcon} size={24} />
						</Button>
					</div>
				</Popover>
			)}
			<div className="kbs-control-inner kbs-radio-preset-control-inner">
				{console.log('presetOptions', presetOptions)}
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
						<ShadowPresetRender
							preset={option}
							attributeName={attributeName}
							meta={meta}
							previewDevice={previewDevice}
							globalStylesIds={globalStylesIds}
							uniqueID={attributes?.uniqueID}
							className={`kbs-radio-preset-control-style`}
							type={type}
						/>
					</Button>
				))}
			</div>
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
