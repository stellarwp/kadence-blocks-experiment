/**
 * WordPress libraries
 */
import { __ } from '@wordpress/i18n';
import { useState, useEffect, useRef } from '@wordpress/element';
import { Button, Popover, Icon } from '@wordpress/components';
import { close as closeIcon } from '@wordpress/icons';
import { globalIcon, sectionLargeIcon, sectionMediumIcon, cardLargeIcon, cardMediumIcon } from '../constants/icons';
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
import RadioToggleGroupButtonUI from '../radio-button-control/ui-toggle-group';
import TitleBar from '../title-bar';
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
						<p>{__('This will override your existing padding styles. Are you sure?', 'kadence-blocks')}</p>
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
export default function InlinePaddingResizerPresetPopover({
	label,
	attributes,
	setAttributes,
	attributeName,
	metaData,
	customOnChange,
}) {
	const attributeMeta = metaData?.attributes?.[attributeName];
	const presetType = attributeMeta?.component ? attributeMeta?.component : '';
	if (!presetType) {
		return null;
	}
	// Get the first three presets in a custom array
	const presetOptions = [
		{
			icon: sectionLargeIcon,
			title: __('Section XXL', 'kadence-blocks'),
			key: 'section-xxl',
		},
		{
			icon: sectionMediumIcon,
			title: __('Section XL', 'kadence-blocks'),
			key: 'section-xl',
		},
		{
			icon: cardLargeIcon,
			title: __('Card Large', 'kadence-blocks'),
			key: 'card-lg',
		},
		{
			icon: cardMediumIcon,
			title: __('Card Medium', 'kadence-blocks'),
			key: 'card-md',
		},
	];
	const currentValue = attributes?.[attributeName]?.preset;

	const [isPopover, setIsPopover] = useState(false);
	const [showConfirmPopover, setShowConfirmPopover] = useState(false);
	const [pendingPreset, setPendingPreset] = useState(null);
	const [confirmAnchor, setConfirmAnchor] = useState(null);
	const [popoverAnchor, setPopoverAnchor] = useState(null);
	const [radioToggleAnchor, setRadioToggleAnchor] = useState(null);
	const [popoverPlacement, setPopoverPlacement] = useState('top-start');

	const onChange = (value) => {
		if (attributes?.[attributeName]?.preset === value) {
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

	return (
		<div
			className={`components-base-control kbs-control kbs-radio-preset-control kbs-radio-preset-control-${presetType}`}
		>
			<Button onClick={() => setIsPopover(!isPopover)}>
				<Icon icon={globalIcon} size={16} />
			</Button>
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
					<TitleBar label={label} reset={false} />
					<div className="kbs-control-inner kbs-radio-preset-control-inner">
						<div className="kbs-radio-control">
							<div
								ref={setRadioToggleAnchor}
								className="kbs-control-inner kbs-radio-toggle-control-inner"
							>
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
					</div>
					<div className="kbs-popover-background-select-control__dropdown-content-close">
						<Button __next40pxDefaultSize onClick={() => setIsPopover(false)}>
							<Icon icon={closeIcon} size={24} />
						</Button>
					</div>
				</Popover>
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
