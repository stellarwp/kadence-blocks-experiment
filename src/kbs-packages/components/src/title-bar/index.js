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
import { undo, settings } from '@wordpress/icons';
import { Button } from '@wordpress/components';
import './editor.scss';
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
}) {
	return (
		<div className="kbs-control-title-bar">
			<div className="kbs-control-title-bar-inner">
				{label && <span className="kbs-control-title">{label}</span>}
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
			{hasDeviceControls && <DeviceSwitchControl />}
			{hasAdvancedControls && onToggleView && (
				<Button
					icon={settings}
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
		</div>
	);
}
