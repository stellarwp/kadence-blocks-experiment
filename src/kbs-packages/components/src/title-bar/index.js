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
import { undo, settings, cog } from '@wordpress/icons';
import { Button, SVG, Path } from '@wordpress/components';
import './editor.scss';

export const hoverIcon = (
	<SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
		<Path d="M12.756 21.459q-.189.04-.378.04H12q-1.971 0-3.705-.748t-3.016-2.03-2.031-3.016-.748-3.704.748-3.705 2.03-3.017 3.016-2.031 3.704-.748 3.705.748 3.017 2.031 2.031 3.016.748 3.705v.373q0 .186-.04.373l-1.46-.446V12q0-3.35-2.325-5.675T11.999 4 6.324 6.325 3.999 12t2.325 5.675T11.999 20h.3zm7.384.185L15.606 17.1l-1.086 3.285L12.001 12l8.385 2.519-3.285 1.086 4.544 4.534-1.504 1.504z"/>
	</SVG>
);
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
			{hasHoverControls && onToggleHover && (
				<Button
					icon={hoverIcon}
					className="kbs-custom-controls-button"
					isPressed={isHover}
					onClick={onToggleHover}
					iconSize={18}
					label={
						isHover ? __('Switch to Normal', 'kadence-blocks') : __('Hover State', 'kadence-blocks')
					}
				/>
			)}
			{hasDeviceControls && <DeviceSwitchControl />}
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
