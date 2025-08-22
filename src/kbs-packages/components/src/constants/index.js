import { __ } from '@wordpress/i18n';

import { default as Typography } from '../typography';
import { default as BackgroundControl } from '../background-control';
import { default as ButtonSettings } from '../button-settings';
import { default as SpacingControl } from '../spacing-control';
import { default as TransformControl } from '../transform-control';
import { default as TransitionControl } from '../transition-control';
import { default as IconControl } from '../icon-control';

/**
 * constants
 */
export const BLOCK_COMPONENTS = {
	typography: {
		label: __('Typography Settings', 'kadence-blocks'),
		component: Typography,
	},
	background: {
		label: __('Background', 'kadence-blocks'),
		component: BackgroundControl,
	},
	button: {
		label: __('Button Settings', 'kadence-blocks'),
		component: ButtonSettings,
	},
	spacing: {
		label: __('Spacing Settings', 'kadence-blocks'),
		component: SpacingControl,
	},
	icon: {
		label: __('Icon Settings', 'kadence-blocks'),
		component: IconControl,
	},
	transform: {
		label: __('Transform', 'kadence-blocks'),
		component: TransformControl,
	},
	transition: {
		label: __('Transition', 'kadence-blocks'),
		component: TransitionControl,
	},
};
