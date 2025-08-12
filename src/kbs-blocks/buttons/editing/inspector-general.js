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
			{/* <ToolsPanelBody
				title={__('Global Styles', 'kadence-blocks')}
				panelName={'global-styles'}
				componentName={'global-styles-control'}
				hasMoreControls={false}
				hasViewControls={false}
				hasDeviceControls={false}
			>
				<SelectGlobalStyles attributes={attributes} setAttributes={setAttributes} />
			</ToolsPanelBody> */}
			<FlexBoxControl
				attributeName={'flexBox'}
				attributes={attributes}
				setAttributes={setAttributes}
				metaData={metadata}
				previewDevice={previewDevice}
				globalStylesIds={globalStylesIds}
			/>
		</>
	);
}
