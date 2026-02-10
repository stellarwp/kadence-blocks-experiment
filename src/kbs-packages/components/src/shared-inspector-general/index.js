/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { doAction } from '@wordpress/hooks';

/**
 * Internal dependencies
 */

/**
 * Shared Inspector General Component
 * Contains shared controls for the bottom of inspector-general panels
 *
 * @param {Object} props
 * @returns {JSX.Element}
 */
export default function SharedInspectorGeneral(props) {
	return (
		<>
			{doAction('kbs.sharedInspectorGeneralStart', props)}
			{doAction('kbs.sharedInspectorGeneralEnd', props)}
		</>
	);
}
