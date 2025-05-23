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
import { undo, plus } from '@wordpress/icons';
import { Button } from '@wordpress/components';
/**
 * Build the Radio Button control.
 */
export default function LayerTitleBar({ label, reset, onReset, onTogglePlus }) {
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
			{onTogglePlus && (
				<Button
					icon={plus}
					className="kbs-advanced-controls-button"
					onClick={onTogglePlus}
					iconSize={18}
					label={__('Add Background Layer', 'kadence-blocks')}
				/>
			)}
		</div>
	);
}
