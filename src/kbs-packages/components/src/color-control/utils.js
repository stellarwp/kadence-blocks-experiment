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

export const getColorLabel = (value, colors) => {
	if (value) {
		if (colors) {
			if (value.startsWith('palette')) {
				const color = colors.find(({ slug }) => slug === value);
				if (color?.name) {
					return color.name;
				}
			} else if (value.startsWith('var(')) {
				const color = colors.find(({ slug }) => slug === value);
				if (color?.name) {
					return color.name;
				}
			}
			const color = colors.find(({ color }) => color === value);
			if (color?.name) {
				return color.name;
			}
		}
	}
	return value;
};

export const getColorHex = (value, ref) => {
	if (value.startsWith('palette')) {
		const color = getColorOutput(value);
		return window
			.getComputedStyle(ref.current)
			.getPropertyValue(color.replace('var(', '').split(',')[0].replace(')', ''));
	} else if (value.startsWith('var(')) {
		return window
			.getComputedStyle(ref.current)
			.getPropertyValue(value.replace('var(', '').split(',')[0].replace(')', ''));
	}
	return value;
};
