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
	FlexBoxControl,
	FlexChildControl,
	MaxWidthControl,
} from '@kadence/kbsComponents';
/**
 * Kadence Helpers.
 */
import { getPreviewValue } from '@kadence/kbsHelpers';
import { KadencePanelBody } from '@kadence/components';

import metadata from '../block.json';
/**
 * Import WordPress
 */
import { __ } from '@wordpress/i18n';

/**
 * Build the section edit.
 */
export default function InspectorAdvanced(props) {
	const { attributes, setAttributes, previewDevice, isSelected, clientId, context, className, globalStylesIds } =
		props;
	return (
		<>

			<MaxWidthControl
				attributes={attributes}
				setAttributes={setAttributes}
				previewDevice={previewDevice}
				attributeName={'maxHeight'}
				metaData={metadata}
				globalStylesIds={globalStylesIds}
				title={__('Max Height Settings', 'kadence-blocks')}
				label={__('Max Height', 'kadence-blocks')}
				type={'maxHeight'}
			/>

			<FlexBoxControl
				attributeName={'flexBox'}
				attributes={attributes}
				setAttributes={setAttributes}
				metaData={metadata}
				previewDevice={previewDevice}
				globalStylesIds={globalStylesIds}
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
