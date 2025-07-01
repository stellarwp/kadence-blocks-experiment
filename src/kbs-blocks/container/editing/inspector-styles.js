/**
 * BLOCK: Kadence Column
 *
 * Registering a basic block with Gutenberg.
 */

/**
 * Kadence Components.
 */
import {
	ToolsPanelBody,
	RadioButtonControl,
	PresetSelectControl,
	Typography,
	SelectGlobalStyles,
	BlockComponentControls,
	FlexBoxControl,
	FlexChildControl,
	BackgroundControl,
	BoxShadowControl,
	BorderControl,
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
export default function InspectorStyles(props) {
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
			<BackgroundControl
				attributeName={'background'}
				attributes={attributes}
				setAttributes={setAttributes}
				metaData={metadata}
				previewDevice={previewDevice}
				globalStylesIds={globalStylesIds}
				globalStylesCss={globalStylesCss}
			/>
			<ToolsPanelBody
				title={__('Border Controls', 'kadence-blocks')}
				panelName={'border-controls'}
				initialOpen={false}
			>
				<BoxShadowControl
					attributeName={'boxShadow'}
					attributes={attributes}
					setAttributes={setAttributes}
					metaData={metadata}
					previewDevice={previewDevice}
					globalStylesIds={globalStylesIds}
					globalStylesCss={globalStylesCss}
				/>
				<BorderControl
					attributes={attributes}
					attributeName={'border'}
					setAttributes={setAttributes}
					previewDevice={previewDevice}
					meta={metadata}
					globalStylesIds={globalStylesIds}
					labelBorderRadius={__('Border Radius', 'kadence-blocks')}
					label={__('Border', 'kadence-blocks')}
					hasPresetControl={true}
				/>
			</ToolsPanelBody>
		</>
	);
}
