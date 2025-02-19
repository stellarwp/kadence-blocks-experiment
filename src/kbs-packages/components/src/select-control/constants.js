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