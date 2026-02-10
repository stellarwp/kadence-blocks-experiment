/**
 * External dependencies
 */
import clsx from 'clsx';
/**
 * WordPress dependencies
 */
import { Icon, Dropdown, ColorIndicator, Button, HStack, FlexItem, TabPanel } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

export const getImageFileName = (value) => {
	if (value) {
		// Get the file name from the URL
		const url = new URL(value);
		if (url?.pathname) {
			return url?.pathname?.split('/').pop();
		}
	}
	return value;
};
