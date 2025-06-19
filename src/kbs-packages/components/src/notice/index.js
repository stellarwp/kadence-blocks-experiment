/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import './editor.scss';

/**
 * Notice component for displaying informational text in the Gutenberg sidebar.
 *
 * @param {Object} props Component props.
 * @param {string} props.children The text content to display.
 * @param {string} props.className Additional CSS classes.
 * @param {Object} props.style Additional inline styles.
 */
export default function Notice({ children, className = '', style = {} }) {
	if (!children) {
		return null;
	}

	return (
		<div className={`kbs-notice ${className}`} style={style}>
			<p>{children}</p>
		</div>
	);
}
