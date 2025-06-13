import { __ } from '@wordpress/i18n';

import { default as Typography } from '../typography';
import { default as BackgroundControl } from '../background-control';

/**
 * constants
 */
export const BLOCK_COMPONENTS = {
	typography: {
		label: __('Typography', 'kadence-blocks'),
		component: Typography,
	},
	background: {
		label: __('Background', 'kadence-blocks'),
		component: BackgroundControl,
	},
};
