import { __ } from '@wordpress/i18n';
import { useSelect, useDispatch } from '@wordpress/data';
import { useEffect } from '@wordpress/element';
import { Button, Dropdown, ColorIndicator, SVG, Path } from '@wordpress/components';
import { plus } from '@wordpress/icons';

import { BLOCK_COMPONENTS, BackgroundPresetRender, TextControl, ColorSelect } from '@kadence/kbsComponents';
import { getColorOptions, getColorOutput } from '@kadence/kbsHelpers';

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
	const colors = getColorOptions();
	const colorsByCategory = colors.reduce((acc, color) => {
		acc[color?.category || themeLabel] = [...(acc[color?.category || themeLabel] || []), color];
		return acc;
	}, {});
	const setStyleBookColor = (colorKey, colorValue) => {
		setStyleBookComponentMappingByStyleId(globalStyleId, 'colors', colorKey, colorValue);
		setNeedsSave(true);
	};
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
		<div className="kbs-color-mapping kbs-preset-control kbs-control">
			<div className="kbs-storybook-section-header kbs-color-mapping-header">
				<h3 className="kbs-storybook-header-title kbs-color-mapping-header-title">
					{__('Global Colors', 'kadence-blocks')}
				</h3>
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
							icon={colorIcon}
							className="kbs-advanced-controls-button"
							onClick={onToggle}
							isPressed={isOpen}
							variant="secondary"
							aria-expanded={isOpen}
							iconSize={18}
							text={__('Edit Color Palette', 'kadence-blocks')}
						/>
					)}
					renderContent={({ isOpen, onToggle }) => (
						<div className="kbs-popover-add-global-style-content">
							<h2 className="kbs-popover-add-global-style-content-title">
								{__('Edit Color Palette', 'kadence-blocks')}
							</h2>
							<GlobalPaletteCreator />
							<Button __next40pxDefaultSize onClick={onToggle}>
								{__('Cancel', 'kadence-blocks')}
							</Button>
						</div>
					)}
				/>
			</div>
			<div className="kbs-control-inner kbs-color-mapping-grid">
				{Object.entries(colorsByCategory).map(([category, colors]) => {
					return (
						<div key={category} className="kbs-color-select-control__dropdown-category-inner">
							<h2 className="kbs-color-select-control__dropdown-category-title">{category}</h2>
							<div className="kbs-color-select-control__dropdown-category-palette-inner">
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
											hasPalette={globalStyleId === 'kbs-base' ? false : true}
										/>
									);
								})}
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
