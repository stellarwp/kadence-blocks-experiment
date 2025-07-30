/**
 * BLOCK: Kadence Column
 *
 * Registering a basic block with Gutenberg.
 */

/**
 * Kadence Components.
 */
import { SizingControl, SpacingControl, SharedInspectorAdvanced } from '@kadence/kbsComponents';

import metadata from '../block.json';
/**
 * Import WordPress
 */
import { __ } from '@wordpress/i18n';

/**
 * Build the section edit.
 */
export default function InspectorAdvanced(props) {
	const {
		attributes,
		setAttributes,
		previewDevice,
		isSelected,
		clientId,
		context,
		className,
		globalStylesIds,
		globalStylesCss,
		blockElementRef,
	} = props;
	return (
		<>
			<SpacingControl
				attributes={attributes}
				setAttributes={setAttributes}
				previewDevice={previewDevice}
				metaData={metadata}
				globalStylesIds={globalStylesIds}
				title={__('Spacing Settings', 'kadence-blocks')}
				types={['padding', 'margin']}
				clientId={clientId}
				showVisualizer={true}
				blockElementRef={blockElementRef}
			/>
			<SharedInspectorAdvanced
				attributes={attributes}
				setAttributes={setAttributes}
				previewDevice={previewDevice}
				globalStylesIds={globalStylesIds}
				metadata={metadata}
				hasTransformControl={false}
			/>
		</>
	);
}
