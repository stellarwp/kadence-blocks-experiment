import { __ } from '@wordpress/i18n';
import { useSelect, useDispatch } from '@wordpress/data';
import { useEffect, useState, useRef, useMemo } from '@wordpress/element';
import { Button, Dropdown, ColorIndicator, SVG, Path, Popover } from '@wordpress/components';
import { plus } from '@wordpress/icons';

import { BLOCK_COMPONENTS, BackgroundPresetRender, TextControl, ColorSelect } from '@kadence/kbsComponents';
import {
	getColorOptions,
	getColorOutput,
	getGradientOptions,
	getFontSizeLabel,
	getPresetOptions,
} from '@kadence/kbsHelpers';

//import GlobalPaletteCreator from './global-palette-creator';

import './editor.scss';

export const typographyIcon = (
	<SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
		<Path d="M437.69-180v-515h-217.3v-85H740v85H522.69v515z" />
	</SVG>
);
/**
 * Build the component preset
 */
export default function GlobalTypography(props) {
	const {
		setStyleBookAttributes,
		setSelectedComponent,
		globalStyleId,
		currentPreset,
		currentColor,
		previewDevice,
		startNewPreset,
		newPresetName,
		setNewPresetName,
		colorsSubTab,
		setColorsSubTab,
		isFontPairingCreatorOpen,
		setIsFontPairingCreatorOpen,
		customPalette,
		setCustomPalette,
	} = props;

	const { styleBookLocalGlobalStyles } = useSelect((select) => {
		return {
			styleBookLocalGlobalStyles: select('kadenceblocks/global-styles').getStyleBookLocalGlobalStyles(),
		};
	});

	const { setStyleBookComponentMappingByStyleId } = useDispatch('kadenceblocks/global-styles');

	const tempTypography = styleBookLocalGlobalStyles[globalStyleId]?.components?.typography?.presets || [];
	console.log(tempTypography);
	const globalTypography = getPresetOptions('typography');
	// const setStyleBookColor = (colorKey, colorValue) => {
	// 	setStyleBookComponentMappingByStyleId(globalStyleId, 'colors', colorKey, colorValue);
	// 	setNeedsSave(true);
	// };
	// const setStyleBookGradient = (gradientKey, gradientValue) => {
	// 	setStyleBookComponentMappingByStyleId(globalStyleId, 'gradients', gradientKey, gradientValue);
	// 	setNeedsSave(true);
	// };
	// const setStyleBookColorPalette = (colorPalette) => {
	// 	setStyleBookComponentMappingByStyleId(globalStyleId, 'colors', 'palette1', colorPalette.colors?.[0]);
	// 	setStyleBookComponentMappingByStyleId(globalStyleId, 'colors', 'palette2', colorPalette.colors?.[1]);
	// 	setStyleBookComponentMappingByStyleId(globalStyleId, 'colors', 'palette-complement', colorPalette.colors?.[2]);
	// 	setStyleBookComponentMappingByStyleId(globalStyleId, 'colors', 'palette3', colorPalette.colors?.[3]);
	// 	setStyleBookComponentMappingByStyleId(globalStyleId, 'colors', 'palette4', colorPalette.colors?.[4]);
	// 	setStyleBookComponentMappingByStyleId(globalStyleId, 'colors', 'palette5', colorPalette.colors?.[5]);
	// 	setStyleBookComponentMappingByStyleId(globalStyleId, 'colors', 'palette6', colorPalette.colors?.[6]);
	// 	setStyleBookComponentMappingByStyleId(globalStyleId, 'colors', 'palette7', colorPalette.colors?.[7]);
	// 	setStyleBookComponentMappingByStyleId(globalStyleId, 'colors', 'palette8', colorPalette.colors?.[8]);
	// 	setStyleBookComponentMappingByStyleId(globalStyleId, 'colors', 'palette9', colorPalette.colors?.[9]);
	// 	setNeedsSave(true);
	// };
	const [popoverAnchor, setPopoverAnchor] = useState(null);

	return (
		<div className="kbs-typography-mapping-wrap">
			<div className="kbs-typography-mapping kbs-preset-control kbs-control">
				<div className="kbs-storybook-section-header kbs-typography-mapping-header">
					<div className="kbs-storybook-header-title kbs-typography-mapping-header-title">
						<div className="kbs-storybook-header-title-subtab-wrap">
							<div className="kbs-storybook-header-title-title">{__('Typography', 'kadence-blocks')}</div>
						</div>
					</div>
					<div className="kbs-popover-add-global-style">
						<Button
							icon={typographyIcon}
							ref={setPopoverAnchor}
							className="kbs-advanced-controls-button kbs-custom-popover-toggle"
							onClick={() => {
								setIsFontPairingCreatorOpen(true);
							}}
							isPressed={isFontPairingCreatorOpen}
							variant="secondary"
							aria-expanded={isFontPairingCreatorOpen}
							iconSize={18}
							text={__('Edit Typography Pairing', 'kadence-blocks')}
						/>
					</div>
					{isFontPairingCreatorOpen && popoverAnchor && (
						<Popover
							anchor={popoverAnchor}
							noArrow={true}
							placement="left-start"
							shift={true}
							offset={10}
							onClose={() => {
								setIsFontPairingCreatorOpen(false);
							}}
							className="kbs-popover-edit-typography-global-style"
						>
							<div className="kbs-popover-add-global-style-content">
								<h2 className="kbs-popover-add-global-style-content-title">
									{__('Font Pairing Editor', 'kadence-blocks')}
								</h2>
							</div>
						</Popover>
					)}
				</div>
				<div className="kbs-control-inner kbs-typography-mapping-grid">
					{globalTypography.map((item, index) => {
						console.log(item);
						let fontFamily =
							tempTypography[item.value]?.attributes?.desktop?.fontFamily ||
							__('Unset', 'kadence-blocks');
						if (fontFamily === 'var(--kbs-font-family-heading)') {
							fontFamily = __('Heading Font Family', 'kadence-blocks');
						} else if (fontFamily === 'var(--kbs-font-family-body)') {
							fontFamily = __('Body Font Family', 'kadence-blocks');
						}
						return (
							<Button
								key={index}
								onClick={() => {
									setSelectedComponent('typography');
									setStyleBookAttributes({
										components: { typography: { selectedPreset: item.value } },
									});
								}}
								isPressed={item.value === currentPreset}
								className="kbs-typography-control-btn"
							>
								<div className="kbs-typography-control-label-wrap">
									<div
										className="kbs-typography-control-label"
										style={{
											fontFamily: tempTypography[item.value]?.attributes?.desktop?.fontFamily,
											fontWeight: tempTypography[item.value]?.attributes?.desktop?.fontWeight,
											letterSpacing:
												tempTypography[item.value]?.attributes?.desktop?.letterSpacing,
										}}
									>
										{item.label}
									</div>
									<ColorIndicator
										colorValue={getColorOutput(
											tempTypography[item.value]?.attributes?.desktop?.color
										)}
										className="kbs-typography-control-color-indicator"
									/>
								</div>
								<div className="kbs-typography-control-meta">
									<div className="kbs-typography-control-family">{fontFamily}</div>
									<div className="kbs-typography-control-size">
										<span className="kbs-typography-control-size-value">
											{getFontSizeLabel(
												tempTypography[item.value]?.attributes?.desktop?.fontSize
											) || __('Unset', 'kadence-blocks')}
										</span>
										<span className="kbs-typography-control-size-divider">/</span>
										<span className="kbs-typography-control-weight-value">
											{tempTypography[item.value]?.attributes?.desktop?.fontWeight ||
												__('Unset', 'kadence-blocks')}
										</span>
									</div>
								</div>
							</Button>
						);
					})}
				</div>
			</div>
		</div>
	);
}
