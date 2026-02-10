import { __ } from '@wordpress/i18n';
import { useSelect, useDispatch } from '@wordpress/data';
import { useEffect } from '@wordpress/element';
import { Button, Dropdown } from '@wordpress/components';
import { plus } from '@wordpress/icons';

import { BLOCK_COMPONENTS, BackgroundPresetRender, TextControl } from '@kadence/kbsComponents';
import { getPresetOptions } from '@kadence/kbsHelpers';

import './editor.scss';
/**
 * Build the component preset
 */
export default function BackgroundPresets(props) {
	const {
		setStyleBookAttributes,
		setSelectedComponent,
		globalStyleId,
		currentPreset,
		previewDevice,
		startNewPreset,
		newPresetName,
		setNewPresetName,
	} = props;

	const presets = getPresetOptions('background');
	const meta = {
		attributes: {
			background: {
				renderCSS: true,
				component: 'background',
				nonInheritable: true,
				type: 'object',
				selector: '--kbs-cont-',
				classPrefix: 'kbs-cont-bg-',
				hasLayers: true,
			},
		},
	};
	return (
		<div className="kbs-background-presets kbs-preset-control kbs-control">
			<div className="kbs-storybook-section-header kbs-background-presets-header">
				<h3 className="kbs-storybook-header-title kbs-background-presets-header-title">
					{__('Background Presets', 'kadence-blocks')}
				</h3>
				{globalStyleId === 'kbs-base' && (
					<Dropdown
						popoverProps={{
							placement: 'left-start',
							//offset: 36,
							shift: true,
						}}
						className={'kbs-popover-add-global-style'}
						contentClassName={'kbs-popover-add-global-style-content'}
						renderToggle={({ isOpen, onToggle }) => (
							<Button
								icon={plus}
								className="kbs-advanced-controls-button"
								onClick={onToggle}
								isPressed={isOpen}
								variant="secondary"
								aria-expanded={isOpen}
								iconSize={18}
								text={__('Add Background Preset', 'kadence-blocks')}
							/>
						)}
						renderContent={({ isOpen, onToggle }) => (
							<div className="kbs-popover-add-global-style-content">
								<h2 className="kbs-popover-add-global-style-content-title">
									{__('Add Background Preset', 'kadence-blocks')}
								</h2>
								<div className="kbs-popover-add-global-style-content-items kbs-control">
									<TextControl
										label={__('Preset Name', 'kadence-blocks')}
										value={newPresetName}
										onChange={(value) => setNewPresetName(value)}
									/>
									<div className="kbs-popover-add-global-style-content-items-buttons">
										<Button
											variant="primary"
											disabled={!newPresetName}
											onClick={() => {
												startNewPreset();
												onToggle();
											}}
										>
											{__('Add Preset', 'kadence-blocks')}
										</Button>
										<Button __next40pxDefaultSize onClick={onToggle}>
											{__('Cancel', 'kadence-blocks')}
										</Button>
									</div>
								</div>
							</div>
						)}
					/>
				)}
			</div>
			<div className="kbs-control-inner kbs-background-presets-grid">
				{presets.map((option) => (
					<Button
						key={option.value}
						label={option.label}
						isPressed={option.value === currentPreset}
						className={`kbs-radio-preset-control-button`}
						onClick={() => {
							setSelectedComponent('background');
							setStyleBookAttributes({
								components: { background: { selectedPreset: option.value } },
							});
						}}
					>
						<BackgroundPresetRender
							isCurrentPreset={option.value === currentPreset}
							preset={option}
							attributeName={'background'}
							meta={meta}
							previewDevice={previewDevice}
							globalStylesIds={[globalStyleId]}
							globalStyleId={globalStyleId}
							uniqueID={globalStyleId + 'bg-preset-' + option.value}
							className={`kbs-radio-preset-control-style`}
						/>
					</Button>
				))}
			</div>
		</div>
	);
}
