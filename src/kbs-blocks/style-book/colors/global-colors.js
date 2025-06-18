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
	} = props;

	const { styleBookLocalGlobalStyles } = useSelect((select) => {
		return {
			styleBookLocalGlobalStyles: select('kadenceblocks/global-styles').getStyleBookLocalGlobalStyles(),
		};
	});

	const { setStyleBookComponentMappingByStyleId } = useDispatch('kadenceblocks/global-styles');

	const tempColors = styleBookLocalGlobalStyles[globalStyleId]?.mappings?.colors || [];
	const tempGradients = styleBookLocalGlobalStyles[globalStyleId]?.mappings?.gradients || [];
	const colors = getColorOptions();
	const gradients = getGradientOptions();
	const colorsByCategory = colors.reduce((acc, color) => {
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
		setStyleBookComponentMappingByStyleId(globalStyleId, 'colors', 'palette3', colorPalette.colors?.[2]);
		setStyleBookComponentMappingByStyleId(globalStyleId, 'colors', 'palette4', colorPalette.colors?.[3]);
		setStyleBookComponentMappingByStyleId(globalStyleId, 'colors', 'palette5', colorPalette.colors?.[4]);
		setStyleBookComponentMappingByStyleId(globalStyleId, 'colors', 'palette6', colorPalette.colors?.[5]);
		setStyleBookComponentMappingByStyleId(globalStyleId, 'colors', 'palette7', colorPalette.colors?.[6]);
		setStyleBookComponentMappingByStyleId(globalStyleId, 'colors', 'palette8', colorPalette.colors?.[7]);
		setStyleBookComponentMappingByStyleId(globalStyleId, 'colors', 'palette9', colorPalette.colors?.[8]);
		setNeedsSave(true);
	};

	const [customPalette, setCustomPalette] = useState({
		mainColor: '',
		isLight: true,
		contrast: 'middle',
		saturation: 1,
		sat: 1,
		bright: 2,
		brightness: 2,
		btnColor: '#ffffff',
		colors: [],
	});
	const [subTab, setSubTab] = useState('colors');
	const [isOpen, setIsOpen] = useState(false);
	const [popoverAnchor, setPopoverAnchor] = useState(null);
	const cssVariables = useMemo(() => {
		let outputCssString = '';
		if (!customPalette?.colors || customPalette?.colors?.length === 0) {
			return '';
		}

		// Loop through global style ids
		customPalette?.colors?.forEach((color, index) => {
			if (color) {
				outputCssString += `  --kbs-colors-palette${index + 1}: ${color};\n`;
			}
		});
		Object.entries(tempGradients).forEach(([key, value]) => {
			if (value?.value) {
				outputCssString += `--kbs-gradients-${key}: ${value.value};\n`;
			}
		});
		return outputCssString;
	}, [customPalette?.colors]);

	const baseVariables = useMemo(() => {
		let outputCssString = '';
		if (!tempColors) {
			return '';
		}

		// Loop through global style ids
		Object.entries(tempColors).forEach(([key, value]) => {
			if (value?.value) {
				outputCssString += `--kbs-colors-${key}: ${value.value};\n`;
			}
		});
		Object.entries(tempGradients).forEach(([key, value]) => {
			if (value?.value) {
				outputCssString += `--kbs-gradients-${key}: ${value.value};\n`;
			}
		});
		return outputCssString;
	}, [tempColors]);
	const divRef = useRef(null);
	useEffect(() => {
		if (divRef.current) {
			if (cssVariables && isOpen) {
				divRef.current.setAttribute('style', cssVariables);
			} else {
				divRef.current.setAttribute('style', baseVariables);
			}
		}
	}, [cssVariables, divRef?.current, isOpen, baseVariables]);
	return (
		<div className="kbs-color-mapping-wrap">
			<div className="kbs-color-mapping kbs-preset-control kbs-control">
				<div className="kbs-storybook-section-header kbs-color-mapping-header">
					<div className="kbs-storybook-header-title kbs-color-mapping-header-title">
						<div className="kbs-storybook-header-title-subtab-wrap">
							<div className="kbs-storybook-header-title-title">{__('Colors', 'kadence-blocks')}</div>
							<Button
								className="kbs-storybook-subtab-btn"
								isPressed={subTab === 'colors'}
								onClick={() => setSubTab('colors')}
							>
								{__('Palette', 'kadence-blocks')}
							</Button>
							<Button
								className="kbs-storybook-subtab-btn"
								isPressed={subTab === 'gradients'}
								onClick={() => setSubTab('gradients')}
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
								setIsOpen(true);
							}}
							isPressed={isOpen}
							variant="secondary"
							aria-expanded={isOpen}
							iconSize={18}
							text={__('Edit Color Palette', 'kadence-blocks')}
						/>
					</div>
					{isOpen && popoverAnchor && (
						<Popover
							anchor={popoverAnchor}
							noArrow={true}
							placement="left-start"
							shift={true}
							offset={10}
							onClose={() => {
								setIsOpen(false);
							}}
							className="kbs-popover-edit-colors-global-style"
						>
							<div className="kbs-popover-add-global-style-content">
								<h2 className="kbs-popover-add-global-style-content-title">
									{__('Color Palette Editor', 'kadence-blocks')}
								</h2>
								<GlobalPaletteCreator
									onToggle={() => {
										setIsOpen(false);
									}}
									customPalette={customPalette}
									setCustomPalette={setCustomPalette}
									setStyleBookColorPalette={setStyleBookColorPalette}
								/>
							</div>
						</Popover>
					)}
				</div>
				{subTab === 'colors' && (
					<div className="kbs-control-inner kbs-color-mapping-grid">
						{Object.entries(colorsByCategory).map(([category, colors]) => {
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
				{subTab === 'gradients' && (
					<div className="kbs-control-inner kbs-color-mapping-grid kbs-gradient-mapping-grid">
						<div className="kbs-color-select-global-palette-inner">
							{gradients.map((gradient, index) => {
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
				)}
			</div>
		</div>
	);
}
