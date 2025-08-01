/**
 * BLOCK: Kadence Column
 *
 * Registering a basic block with Gutenberg.
 */

/**
 * Kadence Components.
 */
import { SpacingControl, SharedInspectorAdvanced, ToggleControl, TextControl } from '@kadence/kbsComponents';
import { InspectorAdvancedControls } from '@wordpress/block-editor';

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
				showVisualizer={false}
				blockElementRef={blockElementRef}
			/>
			<InspectorAdvancedControls>
				<TextControl
					label={__('Aria Label', 'kadence-blocks')}
					titleBar={false}
					attributeName={'ariaLabel'}
					attributes={attributes}
					setAttributes={setAttributes}
					meta={metadata}
					type={'ariaLabel'}
				/>
				<ToggleControl
					label={__('Button Role', 'kadence-blocks')}
					titleBar={false}
					attributeName={'buttonRole'}
					attributes={attributes}
					setAttributes={setAttributes}
					meta={metadata}
					type={'buttonRole'}
					help={__(
						'If the button is used to trigger something in javascript enable this to apply the button role.',
						'kadence-blocks'
					)}
				/>
			</InspectorAdvancedControls>
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
