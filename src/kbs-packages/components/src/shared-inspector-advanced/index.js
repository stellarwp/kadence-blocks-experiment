/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import TransformControl from '../transform-control';
import TransitionControl from '../transition-control';

/**
 * Shared Inspector Advanced Component
 * Contains shared controls for the bottom of inspector-advanced panels
 * 
 * @param {Object} props
 * @param {Object} props.attributes - Block attributes
 * @param {Function} props.setAttributes - Function to update attributes
 * @param {string} props.previewDevice - Current preview device
 * @param {Array} props.globalStylesIds - Global styles IDs
 * @param {Object} props.metadata - Block metadata
 * @returns {JSX.Element}
 */
export default function SharedInspectorAdvanced({
	attributes,
	setAttributes,
	previewDevice,
	globalStylesIds,
	metadata,
}) {

	const supportTransformControl = metadata?.attributes?.transform !== undefined;
	const supportsTransitionControl = metadata?.attributes?.transition !== undefined;

	return (
		<>
			{supportTransformControl && (
				<TransformControl
					attributes={attributes}
					setAttributes={setAttributes}
					meta={metadata}
					previewDevice={previewDevice}
					attributeName={'transform'}
					globalStylesIds={globalStylesIds}
					hasHoverControls={true}
				/>
			)}
			{supportsTransitionControl && (
				<TransitionControl
					attributes={attributes}
					setAttributes={setAttributes}
					meta={metadata}
					previewDevice={previewDevice}
					attributeName={'transition'}
					globalStylesIds={globalStylesIds}
					hasHoverControls={true}
				/>
			)}
		</>
	);
}