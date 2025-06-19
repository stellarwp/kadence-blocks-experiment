/**
 * BLOCK: Kadence Column
 *
 * Registering a basic block with Gutenberg.
 */

/**
 * Kadence Components.
 */
import { ToolsPanelBody, Typography, ColorControl } from '@kadence/kbsComponents';

import metadata from '../block.json';
/**
 * Import WordPress
 */
import { __ } from '@wordpress/i18n';

/**
 * Build the section edit.
 */
export default function InspectorStyles(props) {
	const { attributes, setAttributes, previewDevice, globalStylesIds } = props;

	const { link } = attributes;
	return (
		<>
			<ToolsPanelBody
				title={__('Typography Settings', 'kadence-blocks')}
				panelName={'text-typography'}
				componentName={'typography-control'}
			>
				<ColorControl
					label={__('Color', 'kadence-blocks')}
					attributes={attributes}
					setAttributes={setAttributes}
					meta={metadata}
					previewDevice={previewDevice}
					attributeName={'color'}
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
			</ToolsPanelBody>
			<ToolsPanelBody
				title={__('Advanced Highlight Settings', 'kadence-blocks')}
				panelName={'text-advanced-highlight'}
				componentName={'advanced-highlight-control'}
				initialOpen={false}
			>
				<Typography
					label={__('HighlightTypography', 'kadence-blocks')}
					attributes={attributes}
					setAttributes={setAttributes}
					meta={metadata}
					previewDevice={previewDevice}
					attributeName={'typographyHighlight'}
					globalStylesIds={globalStylesIds}
				/>
				<ColorControl
					label={__('Highlight Color', 'kadence-blocks')}
					attributes={attributes}
					setAttributes={setAttributes}
					meta={metadata}
					previewDevice={previewDevice}
					attributeName={'colorHighlight'}
					globalStylesIds={globalStylesIds}
				/>
				<ColorControl
					label={__('Highlight Background Color', 'kadence-blocks')}
					attributes={attributes}
					setAttributes={setAttributes}
					meta={metadata}
					previewDevice={previewDevice}
					attributeName={'backgroundColorHighlight'}
					globalStylesIds={globalStylesIds}
				/>
				{/* // attributes,
	// setAttributes,
	// attributeName,
	// meta,
	// type,
	// globalStylesIds,
	// reset = true,
	// label,
	// hasDeviceControls = false,
	// isAdvanced = false,
	// advancedControls = [],
	// isCustom = false,
	// hasCustomControls = false,
	// previewDevice = 'desktop',
	// forStyleBook = false,
	// defaultValue = undefined,
	// customOnChange = undefined,
	// hasGradient = false,
	// hasMix = false,
	// globalStylesCss, */}
			</ToolsPanelBody>
		</>
	);
}
