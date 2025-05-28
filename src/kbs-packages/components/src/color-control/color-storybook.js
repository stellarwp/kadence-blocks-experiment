import { Button } from '@wordpress/components';
import clsx from 'clsx';
import { __ } from '@wordpress/i18n';
/**
 * Internal dependencies
 */
import { getColorOutput } from '@kadence/kbsHelpers';

import ColorIndicator from './color-indicator';
import { getColorLabel } from './utils';
const ColorStorybook = ({ onChange, colors, currentValue }) => {
	const themeLabel = __('Theme', 'kadence-blocks');
	const colorsByCategory = colors.reduce((acc, color) => {
		acc[color?.category || themeLabel] = [...(acc[color?.category || themeLabel] || []), color];
		return acc;
	}, {});
	const paletteDropdown = Object.entries(colorsByCategory).map(([category, colors]) => {
		return (
			<div key={category} className="kbs-color-select-control__dropdown-category-inner">
				<h2 className="kbs-color-select-control__dropdown-category-title">{category}</h2>
				<div className="kbs-color-select-control__dropdown-category-palette-inner">
					{colors.map(({ color, slug, name }) => {
						const palette = slug.replace('theme-', '');
						const isActive =
							(currentValue && palette && palette === currentValue) ||
							(!slug.startsWith('theme-palette') && currentValue && currentValue === color);
						const isGlobal = slug.startsWith('palette');
						return (
							<Button
								key={slug}
								__next40pxDefaultSize
								className={clsx('kbs-color-select-button', 'kbs-color-select-control__select-button', {
									'is-selected': isActive,
								})}
								label={name ? name : getColorLabel(color, colors)}
								onClick={() => {
									if (slug.startsWith('theme-palette') || slug.startsWith('palette')) {
										onChange(palette);
									} else {
										onChange(color);
									}
								}}
							>
								<ColorIndicator
									colorValue={getColorOutput(isGlobal ? palette : color)}
									isChecked={isActive}
								/>
							</Button>
						);
					})}
				</div>
			</div>
		);
	});
	return paletteDropdown;
};
export default ColorStorybook;
