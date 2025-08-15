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
import { getColorOutput } from '@kadence/kbsHelpers';

export const getColorLabel = (value, colors, gradients = []) => {
	if (value) {
		if (colors) {
			if (value.startsWith('palette')) {
				const paletteColor = colors.find(({ slug }) => slug === value);
				if (paletteColor?.name) {
					return paletteColor.name;
				}
			} else if (value.startsWith('var(')) {
				const varColor = colors.find(({ slug }) => slug === value);
				if (varColor?.name) {
					return varColor.name;
				}
				const foundColor = colors.find(({ slug }) => getColorOutput(slug) === value);
				if (foundColor?.name) {
					return foundColor.name;
				}
				if (gradients.length > 0) {
					const gradient = gradients.find(({ slug }) => 'var(--kbs-gradients-' + slug + ')' === value);
					if (gradient?.name) {
						return gradient.name;
					}
				}
			}
			const exactColor = colors.find(({ color }) => color === value);
			if (exactColor?.name) {
				return exactColor.name;
			}
		}
		if (value.startsWith('linear-gradient')) {
			return __('Linear Gradient', 'kadence-blocks');
		}
		if (value.startsWith('radial-gradient')) {
			return __('Radial Gradient', 'kadence-blocks');
		}
		if (value.startsWith('conic-gradient')) {
			return __('Conic Gradient', 'kadence-blocks');
		}
		if (value.startsWith('color-mix')) {
			return __('Color Mix', 'kadence-blocks');
		}
		if (value.startsWith('oklch')) {
			return __('Color Mix', 'kadence-blocks');
		}
	}
	return value;
};

export const getColorHex = (value, ref) => {
	if (!value) {
		return '';
	}
	if (value.startsWith('palette' && ref?.current)) {
		const color = getColorOutput(value);
		return window
			.getComputedStyle(ref.current)
			.getPropertyValue(color.replace('var(', '').split(',')[0].replace(')', ''));
	} else if (value.startsWith('var(') && ref?.current) {
		return window
			.getComputedStyle(ref.current)
			.getPropertyValue(value.replace('var(', '').split(',')[0].replace(')', ''));
	} else if (
		value.startsWith('color-mix') ||
		value.startsWith('linear-gradient') ||
		value.startsWith('radial-gradient') ||
		value.startsWith('conic-gradient') ||
		value.startsWith('oklch')
	) {
		return '';
	}
	return value;
};
