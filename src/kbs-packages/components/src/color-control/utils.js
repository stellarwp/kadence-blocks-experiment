/**
 * External dependencies
 */
import clsx from 'clsx';
/**
 * WordPress dependencies
 */
import { Icon, Dropdown, ColorIndicator, Button, HStack, FlexItem, TabPanel } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useRef, useMemo, useEffect } from '@wordpress/element';
import { color as colorIcon, check as checkIcon, close as closeIcon } from '@wordpress/icons';
import { useSelect } from '@wordpress/data';
/**
 * Internal dependencies
 */

export const getColorLabel = (value, colors) => {
	if (value) {
		switch (value) {
			case 'palette1':
				return __('Accent', 'kadence-blocks');
			case 'palette2':
				return __('Accent Alt', 'kadence-blocks');
			case 'palette3':
				return __('Strongest Contrast', 'kadence-blocks');
			case 'palette4':
				return __('Strong Contrast', 'kadence-blocks');
			case 'palette5':
				return __('Medium Contrast', 'kadence-blocks');
			case 'palette6':
				return __('Subtle Contrast', 'kadence-blocks');
			case 'palette7':
				return __('Variant Background', 'kadence-blocks');
			case 'palette8':
				return __('Subtle Background', 'kadence-blocks');
			case 'palette9':
				return __('Background Base', 'kadence-blocks');
			case 'palette10':
				return __('Background Base', 'kadence-blocks');
		}
		if (colors) {
			const color = colors.find(({ color }) => color === value);
			if (color?.name) {
				return color.name;
			} else if (value.startsWith('var(')) {
				const color = colors.find(({ slug }) => slug === value);
				if (color?.name) {
					return color.name;
				}
			}
		}
	}
	return value;
};
export const getColorHex = (value, ref) => {
	if (value.startsWith('var(')) {
		return window
			.getComputedStyle(ref.current)
			.getPropertyValue(value.replace('var(', '').split(',')[0].replace(')', ''));
	}
	return value;
};
export const getColorPreview = (value) => {
	let previewColorString = value;
	if (value) {
		switch (value) {
			case 'palette1':
				previewColorString = 'var(--global-palette1,#2B6CB0)';
				break;
			case 'palette2':
				previewColorString = 'var(--global-palette2,#215387)';
				break;
			case 'palette3':
				previewColorString = 'var(--global-palette3,#1A202C)';
				break;
			case 'palette4':
				previewColorString = 'var(--global-palette4,#2D3748)';
				break;
			case 'palette5':
				previewColorString = 'var(--global-palette5,#4A5568)';
				break;
			case 'palette6':
				previewColorString = 'var(--global-palette6,#718096)';
				break;
			case 'palette7':
				previewColorString = 'var(--global-palette7,#EDF2F7)';
				break;
			case 'palette8':
				previewColorString = 'var(--global-palette8,#F7FAFC)';
				break;
			case 'palette9':
				previewColorString = 'var(--global-palette9,#ffffff)';
				break;
		}
	}
	return previewColorString;
};

export const getGlobalColors = () => {
	const { globalStyles } = useSelect(
		(select) => ({
			globalStyles: select('kadenceblocks/global-styles').getGlobalStyles(),
		}),
		[]
	);
	useEffect(() => {
		console.log(globalStyles);
	}, [globalStyles]);
	return globalStyles?.mappings?.colors || [];
};
