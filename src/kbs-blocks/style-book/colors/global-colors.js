import { __ } from '@wordpress/i18n';
import { useSelect, useDispatch } from '@wordpress/data';
import { useEffect, useState, useRef, useMemo } from '@wordpress/element';
import { Button, Dropdown, ColorIndicator, SVG, Path, Popover } from '@wordpress/components';
import { plus } from '@wordpress/icons';

import { BLOCK_COMPONENTS, BackgroundPresetRender, TextControl, ColorSelect } from '@kadence/kbsComponents';
import { getColorOptions, getColorOutput, getGradientOptions } from '@kadence/kbsHelpers';

import GlobalPaletteCreator from './global-palette-creator';

import './editor.scss';

export const colorIcon = (
	<SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
		<Path d="M7.5 15.6c-.494 0-.9.406-.9.9s.406.9.9.9.9-.406.9-.9-.406-.9-.9-.9M18.354 12l1.107-1.107a2.71 2.71 0 0 0 0-3.816l-2.547-2.538a2.71 2.71 0 0 0-3.816 0L12 5.646A2.71 2.71 0 0 0 9.3 3H5.7A2.713 2.713 0 0 0 3 5.7v12.599c0 1.481 1.219 2.7 2.7 2.7h12.599c1.481 0 2.7-1.219 2.7-2.7v-3.6a2.71 2.71 0 0 0-2.646-2.7zM10.2 18.3c0 .494-.406.9-.9.9H5.7a.904.904 0 0 1-.9-.9V5.701c0-.494.406-.9.9-.9h3.6c.494 0 .9.406.9.9zM12 8.184l2.376-2.376a.905.905 0 0 1 1.269 0L18.192 8.4a.905.905 0 0 1 0 1.269L15.6 12.261 12 15.816zM19.2 18.3c0 .494-.406.9-.9.9h-6.462a2.8 2.8 0 0 0 .153-.828l4.572-4.572H18.3c.494 0 .9.406.9.9z" />
	</SVG>
);
/**
 * Build the component preset
 */
export default function GlobalColors(props) {
	const {
		setNeedsSave,
		setSelectedComponent,
		globalStyleId,
		currentColor,
		previewDevice,
		startNewPreset,
		newPresetName,
		setNewPresetName,
		colorsSubTab,
		setColorsSubTab,
		isPaletteCreatorOpen,
		setIsPaletteCreatorOpen,
		customPalette,
		setCustomPalette,
	} = props;

	const { styleBookLocalGlobalStyles } = useSelect((select) => {
		return {
			styleBookLocalGlobalStyles: select('kadenceblocks/global-styles').getStyleBookLocalGlobalStyles(),
		};
	});

	const { setStyleBookComponentMappingByStyleId } = useDispatch('kadenceblocks/global-styles');

	const tempColors = styleBookLocalGlobalStyles[globalStyleId]?.mappings?.colors || [];
	const tempGradients = styleBookLocalGlobalStyles[globalStyleId]?.mappings?.gradients || [];
	const globalColors = getColorOptions();
	const gradients = getGradientOptions();
	const themeLabel = __('Theme', 'kadence-blocks');
	const colorsByCategory = globalColors.reduce((acc, color) => {
		acc[color?.category || themeLabel] = [...(acc[color?.category || themeLabel] || []), color];
		return acc;
	}, {});
	const setStyleBookColor = (colorKey, colorValue) => {
		setStyleBookComponentMappingByStyleId(globalStyleId, 'colors', colorKey, colorValue);
		setNeedsSave(true);
	};
	const setStyleBookGradient = (gradientKey, gradientValue) => {
		setStyleBookComponentMappingByStyleId(globalStyleId, 'gradients', gradientKey, gradientValue);
		setNeedsSave(true);
	};
	const setStyleBookColorPalette = (colorPalette) => {
		setStyleBookComponentMappingByStyleId(globalStyleId, 'colors', 'palette1', colorPalette.colors?.[0]);
		setStyleBookComponentMappingByStyleId(globalStyleId, 'colors', 'palette2', colorPalette.colors?.[1]);
		setStyleBookComponentMappingByStyleId(globalStyleId, 'colors', 'palette-complement', colorPalette.colors?.[2]);
		setStyleBookComponentMappingByStyleId(globalStyleId, 'colors', 'palette3', colorPalette.colors?.[3]);
		setStyleBookComponentMappingByStyleId(globalStyleId, 'colors', 'palette4', colorPalette.colors?.[4]);
		setStyleBookComponentMappingByStyleId(globalStyleId, 'colors', 'palette5', colorPalette.colors?.[5]);
		setStyleBookComponentMappingByStyleId(globalStyleId, 'colors', 'palette6', colorPalette.colors?.[6]);
		setStyleBookComponentMappingByStyleId(globalStyleId, 'colors', 'palette7', colorPalette.colors?.[7]);
		setStyleBookComponentMappingByStyleId(globalStyleId, 'colors', 'palette8', colorPalette.colors?.[8]);
		setStyleBookComponentMappingByStyleId(globalStyleId, 'colors', 'palette9', colorPalette.colors?.[9]);
		setNeedsSave(true);
	};
	const [popoverAnchor, setPopoverAnchor] = useState(null);

	return (
		<div className="kbs-color-mapping-wrap">
			<div className="kbs-color-mapping kbs-preset-control kbs-control">
				<div className="kbs-storybook-section-header kbs-color-mapping-header">
					<div className="kbs-storybook-header-title kbs-color-mapping-header-title">
						<div className="kbs-storybook-header-title-subtab-wrap">
							<div className="kbs-storybook-header-title-title">{__('Colors', 'kadence-blocks')}</div>
							<Button
								className="kbs-storybook-subtab-btn"
								isPressed={colorsSubTab === 'colors'}
								onClick={() => setColorsSubTab('colors')}
							>
								{__('Palette', 'kadence-blocks')}
							</Button>
							<Button
								className="kbs-storybook-subtab-btn"
								isPressed={colorsSubTab === 'gradients'}
								onClick={() => setColorsSubTab('gradients')}
							>
								{__('Gradients', 'kadence-blocks')}
							</Button>
						</div>
					</div>
					<div className="kbs-popover-add-global-style">
						<Button
							icon={colorIcon}
							ref={setPopoverAnchor}
							className="kbs-advanced-controls-button kbs-custom-popover-toggle"
							onClick={() => {
								setIsPaletteCreatorOpen(true);
							}}
							isPressed={isPaletteCreatorOpen}
							variant="secondary"
							aria-expanded={isPaletteCreatorOpen}
							iconSize={18}
							text={__('Edit Color Palette', 'kadence-blocks')}
						/>
					</div>
					{isPaletteCreatorOpen && popoverAnchor && (
						<Popover
							anchor={popoverAnchor}
							noArrow={true}
							placement="left-start"
							shift={true}
							offset={10}
							onClose={() => {
								setIsPaletteCreatorOpen(false);
							}}
							className="kbs-popover-edit-colors-global-style"
						>
							<div className="kbs-popover-add-global-style-content">
								<h2 className="kbs-popover-add-global-style-content-title">
									{__('Color Palette Editor', 'kadence-blocks')}
								</h2>
								<GlobalPaletteCreator
									onToggle={() => {
										setIsPaletteCreatorOpen(false);
									}}
									customPalette={customPalette}
									setCustomPalette={setCustomPalette}
									setStyleBookColorPalette={setStyleBookColorPalette}
								/>
							</div>
						</Popover>
					)}
				</div>
				{colorsSubTab === 'colors' && (
					<div className="kbs-control-inner kbs-color-mapping-grid">
						{Object.entries(colorsByCategory).map(([category, colors]) => {
							if (category === themeLabel) {
								return null;
							}
							let categoryLabel = category;
							if (category === 'background') {
								categoryLabel = __('Background', 'kadence-blocks');
							}
							if (category === 'notices') {
								categoryLabel = __('Notices & Feedback', 'kadence-blocks');
							}
							if (category === 'accent') {
								categoryLabel = __('Accent', 'kadence-blocks');
							}
							if (category === 'contrast') {
								categoryLabel = __('Contrast', 'kadence-blocks');
							}
							let categoryClass = '';
							if (category === 'background') {
								categoryClass = 'kbs-color-category-background';
							}
							if (category === 'notices') {
								categoryClass = 'kbs-color-category-notices';
							}
							if (category === 'accent') {
								categoryClass = 'kbs-color-category-accent';
							}
							if (category === 'contrast') {
								categoryClass = 'kbs-color-category-contrast';
							}
							return (
								<div key={category} className="kbs-color-select-control__dropdown-category-inner">
									<h2 className="kbs-color-select-control__dropdown-category-title">
										{categoryLabel}
									</h2>
									<div
										className={`kbs-color-select-control__dropdown-category-palette-inner kbs-color-select-global-palette-inner ${categoryClass}`}
									>
										{colors.map(({ color, slug, name }) => {
											return (
												<ColorSelect
													key={slug}
													label={name}
													value={tempColors?.[slug]?.value || ''}
													onChange={(value) => {
														setStyleBookColor(slug, value);
													}}
													inherited={{ inheritedValue: '' }}
													hasMix={true}
													hasToggleLabel={false}
													hasGradient={false}
													reset={false}
													useGlobalPalette={true}
													hasPalette={globalStyleId === 'kbs-base' ? false : true}
												/>
											);
										})}
									</div>
								</div>
							);
						})}
					</div>
				)}
				{colorsSubTab === 'gradients' && (
					<div className="kbs-control-inner kbs-color-mapping-grid kbs-gradient-mapping-grid">
						{['accent', 'contrast', 'background'].map((category, index) => {
							let categoryLabel = '';
							if (category === 'background') {
								categoryLabel = __('Background', 'kadence-blocks');
							}
							if (category === 'accent') {
								categoryLabel = __('Accent', 'kadence-blocks');
							}
							if (category === 'contrast') {
								categoryLabel = __('Contrast', 'kadence-blocks');
							}
							let categoryClass = '';
							if (category === 'background') {
								categoryClass = 'kbs-color-category-background';
							}
							if (category === 'accent') {
								categoryClass = 'kbs-color-category-accent';
							}
							if (category === 'contrast') {
								categoryClass = 'kbs-color-category-contrast';
							}
							return (
								<div key={category} className="kbs-color-select-control__dropdown-category-inner">
									<h2 className="kbs-color-select-control__dropdown-category-title">
										{categoryLabel}
									</h2>
									<div
										className={`kbs-color-select-control__dropdown-category-palette-inner kbs-color-select-global-palette-inner ${categoryClass}`}
									>
										{gradients
											.filter((gradient) => gradient.category === category)
											.map((gradient, index) => {
												return (
													<ColorSelect
														key={gradient.slug}
														label={gradient.name}
														value={tempGradients?.[gradient.slug]?.value || ''}
														onChange={(value) => {
															setStyleBookGradient(gradient.slug, value);
														}}
														inherited={{ inheritedValue: '' }}
														hasMix={false}
														hasToggleLabel={false}
														hasGradient={true}
														hasGradientPalette={false}
														hasCustomColors={false}
														reset={false}
														useGlobalPalette={true}
														hasPalette={false}
													/>
												);
											})}
									</div>
								</div>
							);
						})}
					</div>
				)}
			</div>
		</div>
	);
}
