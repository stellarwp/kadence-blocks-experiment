import { registerPlugin } from '@wordpress/plugins';
import { applyFilters } from '@wordpress/hooks';
import './editor.scss';
/**
 * Import Icons
 */
import { kadenceNewIcon } from '@kadence/icons';
/*
 * Components
 */
import KadenceStyleBookConfig from './kadence-style-book-plugin';

// registerPlugin('kadence-style-book', {
// 	icon: applyFilters('kadence.block_sidebar_control_icon', kadenceNewIcon),
// 	render: KadenceStyleBookConfig,
// });
