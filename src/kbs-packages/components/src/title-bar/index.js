/**
 * Responsive Range Component
 *
 */

/**
 * Internal block libraries
 */
import { useSelect, useDispatch } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import DeviceSwitchControl from '../device-switch-control';
import { undo, settings, cog, file } from '@wordpress/icons';
import { Button, Icon } from '@wordpress/components';

import './editor.scss';
import { hoverIcon } from '../constants/icons';
/**
 * Build the Radio Button control.
 */
export default function TitleBar({
	label,
	reset,
	onReset,
	hasDeviceControls = false,
	isAdvanced = false,
	onToggleView,
	hasAdvancedControls = false,
	isCustom = false,
	onToggleCustom,
	hasCustomControls = false,
	hasHoverControls = false,
	onToggleHover,
	isHover = false,
	hasPopoverControls = false,
	onTogglePopover,
	isPopover = false,
	rel = null,
}) {
	return (
		<div className="kbs-control-title-bar" ref={rel}>
			<div className="kbs-control-title-bar-inner">
				{label && <span className="kbs-control-title">{label}</span>}
				{isHover && !hasHoverControls && (
					<span className="kbs-control-hover-indicator">
						<Icon icon={hoverIcon} size={14} />
					</span>
				)}
				{reset && (
					<span className="kbs-reset-wrap">
						<Button
							className="kbs-reset-button"
							size="small"
							variant="secondary"
							onClick={() => {
								if (typeof reset === 'function') {
									reset();
								} else {
									onReset();
								}
							}}
							icon={undo}
							label={__('Clear', 'kadence-blocks')}
						/>
					</span>
				)}
			</div>
			{hasHoverControls && onToggleHover && (
				<Button
					icon={hoverIcon}
					className="kbs-custom-controls-button"
					isPressed={isHover}
					onClick={onToggleHover}
					iconSize={18}
					label={isHover ? __('Switch to Normal', 'kadence-blocks') : __('Hover State', 'kadence-blocks')}
				/>
			)}
			{hasDeviceControls && <DeviceSwitchControl />}
			{hasPopoverControls && onTogglePopover && (
				<Button
					icon={file}
					className="kbs-advanced-controls-button"
					isPressed={isPopover}
					onClick={onTogglePopover}
					iconSize={18}
					label={isPopover ? __('Close Popover', 'kadence-blocks') : __('View More', 'kadence-blocks')}
				/>
			)}
			{hasAdvancedControls && onToggleView && (
				<Button
					icon={cog}
					className="kbs-advanced-controls-button"
					isPressed={isAdvanced}
					onClick={onToggleView}
					iconSize={18}
					label={
						isAdvanced
							? __('Switch to Basic', 'kadence-blocks')
							: __('Switch to Advanced', 'kadence-blocks')
					}
				/>
			)}
			{hasCustomControls && onToggleCustom && (
				<Button
					icon={settings}
					className="kbs-custom-controls-button"
					isPressed={isCustom}
					onClick={onToggleCustom}
					iconSize={18}
					label={
						isCustom ? __('Switch to Basic', 'kadence-blocks') : __('Switch to Custom', 'kadence-blocks')
					}
				/>
			)}
		</div>
	);
}
