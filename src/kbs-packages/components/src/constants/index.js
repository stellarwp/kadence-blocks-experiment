import { __ } from '@wordpress/i18n';

import { default as Typography } from '../typography';

/**
 * constants
 */
export const BLOCK_COMPONENTS = {
	typography: {
		label: __('Typography', 'kadence-blocks'),
		component: Typography,
	},
};
