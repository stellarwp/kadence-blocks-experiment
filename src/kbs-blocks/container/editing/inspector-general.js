/**
 * BLOCK: Kadence Column
 *
 * Registering a basic block with Gutenberg.
 */

/**
 * Kadence Components.
 */
import { ToolsPanelBody, SelectGlobalStyles, PresetControl } from '@kadence/kbsComponents';
/**
 * Kadence Helpers.
 */
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
			<ToolsPanelBody
				title={__('Global Styles', 'kadence-blocks')}
				panelName={'global-styles'}
				componentName={'global-styles-control'}
				hasMoreControls={false}
				hasViewControls={false}
				hasDeviceControls={false}
			>
				<SelectGlobalStyles attributes={attributes} setAttributes={setAttributes} />
			</ToolsPanelBody>
			<FlexBoxControl
				attributeName={'flexBox'}
				attributes={attributes}
				setAttributes={setAttributes}
				metaData={metadata}
				previewDevice={previewDevice}
				globalStylesIds={globalStylesIds}
			/>
			<ToolsPanelBody>
				<PresetControl
					label={__('Container Presets', 'kadence-blocks')}
					type={'containerVariant'}
					attributes={attributes}
					setAttributes={setAttributes}
					attributeName={'variant'}
					metaData={metadata}
					previewDevice={previewDevice}
					globalStylesIds={globalStylesIds}
					isBundlePreset={true}
				/>
			</ToolsPanelBody>

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
