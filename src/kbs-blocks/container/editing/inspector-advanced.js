/**
 * BLOCK: Kadence Column
 *
 * Registering a basic block with Gutenberg.
 */

/**
 * Kadence Components.
 */
import {
	PresetSelectControl,
	Typography,
	SelectGlobalStyles,
	BlockComponentControls,
	ToolsPanelBody,
	FlexBoxControl,
	FlexChildControl,
	SizingControl,
	SpacingControl,
	ColorControl,
} from '@kadence/kbsComponents';

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
			/>
			<SizingControl
				attributes={attributes}
				setAttributes={setAttributes}
				previewDevice={previewDevice}
				metaData={metadata}
				globalStylesIds={globalStylesIds}
				title={__('Sizing Settings', 'kadence-blocks')}
				types={['maxWidth', 'minHeight']}
			/>
			<FlexChildControl
				attributeName={'flexChild'}
				attributes={attributes}
				setAttributes={setAttributes}
				metaData={metadata}
				previewDevice={previewDevice}
				globalStylesIds={globalStylesIds}
			/>
		</>
	);
}
