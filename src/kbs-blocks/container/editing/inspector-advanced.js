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
			<ColorControl
				label={__('Background Color', 'kadence-blocks')}
				attributes={attributes}
				type={'color'}
				setAttributes={setAttributes}
				attributeName={'color'}
				meta={metadata}
				previewDevice={previewDevice}
				globalStylesCss={globalStylesCss}
				hasGradient={true}
				hasMix={true}
			/>
			<SizingControl
				attributes={attributes}
				setAttributes={setAttributes}
				previewDevice={previewDevice}
				attributeName={'minHeight'}
				metaData={metadata}
				globalStylesIds={globalStylesIds}
				title={__('Min Height Settings', 'kadence-blocks')}
				label={__('Min Height', 'kadence-blocks')}
				type={'minHeight'}
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
