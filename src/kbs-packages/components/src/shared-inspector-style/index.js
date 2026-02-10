/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { doAction } from '@wordpress/hooks';

/**
 * Internal dependencies
 */

/**
 * Shared Inspector Style Component
 * Contains shared controls for the bottom of inspector-advanced panels
 *
 * @param {Object} props
 * @returns {JSX.Element}
 */
export default function SharedInspectorStyle(props) {
	return (
		<>
			{doAction('kbs.sharedInspectorStyleStart', props)}
			{doAction('kbs.sharedInspectorStyleEnd', props)}
		</>
	);
}
