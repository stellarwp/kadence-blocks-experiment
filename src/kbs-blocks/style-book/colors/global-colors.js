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
							<Button
								className="kbs-storybook-subtab-btn"
								isPressed={subTab === 'colors'}
								onClick={() => setSubTab('colors')}
							>
								{__('Color Palette', 'kadence-blocks')}
							</Button>
							<Button
								className="kbs-storybook-subtab-btn"
								isPressed={subTab === 'gradients'}
								onClick={() => setSubTab('gradients')}
							>
								{__('Gradient Palette', 'kadence-blocks')}
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
							return (
								<div key={category} className="kbs-color-select-control__dropdown-category-inner">
									<h2 className="kbs-color-select-control__dropdown-category-title">{category}</h2>
									<div className="kbs-color-select-control__dropdown-category-palette-inner kbs-color-select-global-palette-inner">
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
			<div ref={divRef} className="kbs-color-example-wrap">
				<div
					className="kbs-color-example-inner"
					style={{
						background: subTab === 'gradients' ? 'var(--kbs-gradients-gradient5)' : undefined,
					}}
				>
					<div className="kbs-color-example-hero">
						<div className="kbs-color-example-hero-text">
							<h2 className="kbs-color-example-hero-title">
								{__('Visualize your website colors', 'kadence-blocks')}
							</h2>
							<p className="kbs-color-example-hero-description">
								{__(
									'See how your website will look with different color combinations.',
									'kadence-blocks'
								)}
							</p>
						</div>
						<div
							className="kbs-color-example-hero-image"
							style={{
								background: subTab === 'gradients' ? 'var(--kbs-gradients-gradient3)' : undefined,
							}}
						>
							<svg viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
								<rect
									x="0"
									y="0"
									width="800"
									height="800"
									fill={subTab === 'gradients' ? 'transparent' : 'var(--kbs-colors-palette7)'}
								/>
								<path
									d="M281.09,156.73c12.176,-0 22.031,-9.855 22.031,-22.031l-0,-22.444c-0,-12.176 -9.855,-22.013 -22.031,-22.013c-12.158,-0 -22.013,9.837 -22.013,22.013l-0,22.444c-0,12.176 9.855,22.031 22.013,22.031Z"
									fill="var(--kbs-colors-palette2)"
								/>
								<path
									d="M375.2,201.468c5.653,0 11.279,-2.163 15.569,-6.453l19.939,-19.92c8.606,-8.607 8.606,-22.532 -0,-31.13c-8.607,-8.598 -22.541,-8.607 -31.148,-0l-19.92,19.903c-8.607,8.589 -8.607,22.558 -0,31.147c4.29,4.29 9.942,6.453 15.56,6.453Z"
									fill="var(--kbs-colors-palette2)"
								/>
								<path
									d="M359.314,353.292c-8.43,8.774 -8.14,22.699 0.668,31.13l19.904,19.094c4.255,4.106 9.732,6.146 15.244,6.146c5.784,-0 11.551,-2.304 15.885,-6.778c8.431,-8.792 8.159,-22.735 -0.65,-31.148l-19.903,-19.112c-8.739,-8.404 -22.717,-8.123 -31.148,0.668Z"
									fill="var(--kbs-colors-palette2)"
								/>
								<path
									d="M397.969,273.609c0,12.167 9.873,22.022 22.031,22.022l22.391,-0c12.141,-0 22.013,-9.855 22.013,-22.022c0,-12.158 -9.872,-22.013 -22.013,-22.013l-22.391,-0c-12.158,-0 -22.031,9.855 -22.031,22.013Z"
									fill="var(--kbs-colors-palette2)"
								/>
								<path
									d="M170.664,194.277c4.307,4.308 9.925,6.435 15.543,6.435c5.652,0 11.296,-2.163 15.604,-6.453c8.571,-8.606 8.571,-22.54 -0.035,-31.147l-19.218,-19.165c-8.606,-8.589 -22.532,-8.589 -31.129,0.018c-8.589,8.606 -8.589,22.558 0.017,31.147l19.218,19.165Z"
									fill="var(--kbs-colors-palette2)"
								/>
								<path
									d="M170.664,352.914l-19.183,19.112c-8.633,8.589 -8.65,22.532 -0.052,31.148c4.29,4.325 9.942,6.488 15.586,6.488c5.636,-0 11.244,-2.163 15.543,-6.418l19.2,-19.112c8.607,-8.607 8.616,-22.532 0.053,-31.147c-8.598,-8.625 -22.541,-8.66 -31.147,-0.071Z"
									fill="var(--kbs-colors-palette2)"
								/>
								<path
									d="M119.771,295.631l22.374,-0c12.158,-0 22.013,-9.855 22.013,-22.022c0,-12.158 -9.855,-22.013 -22.013,-22.013l-22.374,-0c-12.158,-0 -22.013,9.855 -22.013,22.013c0,12.167 9.855,22.022 22.013,22.022Z"
									fill="var(--kbs-colors-palette2)"
								/>
								<path
									d="M259.077,412.492l-0,22.374c-0,12.158 9.855,22.013 22.013,22.013c12.176,0 22.031,-9.855 22.031,-22.013l-0,-22.374c-0,-12.158 -9.855,-22.013 -22.031,-22.013c-12.158,0 -22.013,9.855 -22.013,22.013Z"
									fill="var(--kbs-colors-palette2)"
								/>
								<path
									d="M748.958,536.375l-142.794,-142.795l-204.188,204.188l151.19,151.19l195.792,0l0,-212.583Z"
									fill={
										subTab === 'gradients'
											? 'var(--kbs-colors-palette7)'
											: 'var(--kbs-colors-palette5)'
									}
								/>
								<path
									d="M281.09,356.07c45.486,0 82.47,-37.002 82.47,-82.461c0,-45.486 -36.984,-82.506 -82.47,-82.506c-45.503,0 -82.523,37.02 -82.523,82.506c0,45.459 37.02,82.461 82.523,82.461Z"
									fill="var(--kbs-colors-palette1)"
								/>
								<path
									d="M51.042,722.75l-0,26.549l441.187,0l-212.704,-211.112l-228.483,184.563Z"
									fill={
										subTab === 'gradients'
											? 'var(--kbs-colors-palette8)'
											: 'var(--kbs-colors-palette6)'
									}
								/>
							</svg>
						</div>
					</div>
					<div className="kbs-color-example-content">
						<div className="kbs-color-example-content-inner">
							<div
								className="kbs-color-example-content-item kbs-color-example-content-item-1"
								style={{
									background: subTab === 'gradients' ? 'var(--kbs-gradients-gradient6)' : undefined,
								}}
							>
								<div className="kbs-color-example-content-item-color">
									<h3 className="kbs-color-example-content-item-color-title">
										{__('Visualize Colors', 'kadence-blocks')}
									</h3>
									<p className="kbs-color-example-content-item-color-description">
										{__(
											'See how your website will look with different color combinations.',
											'kadence-blocks'
										)}
									</p>
								</div>
							</div>
							<div
								className="kbs-color-example-content-item kbs-color-example-content-item-2"
								style={{
									background: subTab === 'gradients' ? 'var(--kbs-gradients-gradient6)' : undefined,
								}}
							>
								<div className="kbs-color-example-content-item-color">
									<h3 className="kbs-color-example-content-item-color-title">
										{__('Visualize Colors', 'kadence-blocks')}
									</h3>
									<p className="kbs-color-example-content-item-color-description">
										{__(
											'See how your website will look with different color combinations.',
											'kadence-blocks'
										)}
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
