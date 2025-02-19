/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Dot styling helper for select control
 */
export const DOT_STYLES = {
	alignItems: 'center',
	display: 'flex',
	':before': {
		backgroundColor: 'var(--kb-border-color, rgba(8, 115, 230, 0.55))',
		borderRadius: '8px',
		content: '" "',
		display: 'block',
		marginRight: '6px',
		height: '10px',
		width: '10px',
	},
};

/**
 * Font Weight Options for select control
 */
export const FONT_WEIGHT_OPTIONS = [
	{ label: __('Default', 'kadence-blocks'), value: '' },
	{ label: __('Light (300)', 'kadence-blocks'), value: '300' },
	{ label: __('Regular (400)', 'kadence-blocks'), value: '400' },
	{ label: __('Medium (500)', 'kadence-blocks'), value: '500' },
	{ label: __('Semi Bold (600)', 'kadence-blocks'), value: '600' },
	{ label: __('Bold (700)', 'kadence-blocks'), value: '700' },
	{ label: __('Extra Bold (800)', 'kadence-blocks'), value: '800' },
]; 