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
} from '@kadence/kbsComponents';
/**
 * Kadence Helpers.
 */
import { getPreviewValue } from '@kadence/kbsHelpers';
import { FlexBoxControl } from '@kadence/kbsComponents';
import { KadencePanelBody } from '@kadence/components';

import metadata from '../block.json';
/**
 * Import WordPress
 */
import { __ } from '@wordpress/i18n';

/**
 * Build the section edit.
 */
export default function InspectorGeneral(props) {
	const { attributes, setAttributes, previewDevice, isSelected, clientId, context, className, globalStylesIds } =
		props;
	return (
		<>
			<KadencePanelBody title={__('Global Style Settings', 'kadence-blocks')} panelName={'kb-container-settings'}>
				<SelectGlobalStyles attributes={attributes} setAttributes={setAttributes} />
			</KadencePanelBody>
			<FlexBoxControl
				attributeName={'flexBox'}
				attributes={attributes}
				setAttributes={setAttributes}
				metaData={metadata}
				previewDevice={previewDevice}
				globalStylesIds={globalStylesIds}
			/>

			{/* <ToolsPanelBody
				title={__('Typography Settings', 'kadence-blocks')}
				panelName={'container-typography'}
				componentName={'typography-control'}
			>
				<BlockComponentControls
					attributes={attributes}
					setAttributes={setAttributes}
					meta={metadata}
					previewDevice={previewDevice}
					globalStylesIds={globalStylesIds}
				/>
				<Typography
					label={__('Typography', 'kadence-blocks')}
					attributes={attributes}
					setAttributes={setAttributes}
					meta={metadata}
					previewDevice={previewDevice}
					attributeName={'typography'}
					globalStylesIds={globalStylesIds}
				/>
			</ToolsPanelBody> */}
		</>
	);
}
