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
	Typography,
	ColorControl,
	Notice,
	BorderControl,
	LayeredShadowControl,
	SpaceControl,
	RadioButtonControl,
	SharedInspectorStyle,
} from '@kadence/kbsComponents';

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
		globalStylesIds,
		globalStylesCss,
		hasGradient,
		hasGradientHighlight,
		blockElementRef,
		clientId,
	} = props;

	const { link } = attributes;
	return (
		<>
			<ToolsPanelBody
				title={__('Typography Settings', 'kadence-blocks')}
				panelName={'text-typography'}
				componentName={'typography-control'}
			>
				<Typography
					label={__('Typography', 'kadence-blocks')}
					attributes={attributes}
					setAttributes={setAttributes}
					meta={metadata}
					previewDevice={previewDevice}
					attributeName={'typography'}
					hasColor={true}
					hasBackgroundColor={true}
					supportsGradient={true}
					globalStylesIds={globalStylesIds}
					globalStylesCss={globalStylesCss}
				/>
			</ToolsPanelBody>
			<ToolsPanelBody
				title={__('Border Settings', 'kadence-blocks')}
				panelName={'text-border'}
				componentName={'border-control'}
				initialOpen={false}
			>
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
					globalStylesCss={globalStylesCss}
				/>
			</ToolsPanelBody>
			<ToolsPanelBody
				title={__('Shadow Settings', 'kadence-blocks')}
				panelName={'text-shadow'}
				componentName={'shadow-control'}
				initialOpen={false}
			>
				<LayeredShadowControl
					attributeName={'textShadow'}
					attributes={attributes}
					setAttributes={setAttributes}
					metaData={metadata}
					previewDevice={previewDevice}
					globalStylesIds={globalStylesIds}
					globalStylesCss={globalStylesCss}
					type={'textShadow'}
				/>
			</ToolsPanelBody>
			<ToolsPanelBody
				title={__('Text Orientation', 'kadence-blocks')}
				panelName={'text-orientation'}
				componentName={'text-orientation-control'}
				initialOpen={false}
			>
				<RadioButtonControl
					label={__('Text Orientation', 'kadence-blocks')}
					attributes={attributes}
					setAttributes={setAttributes}
					attributeName={'textOrientation'}
					type={'textOrientation'}
					meta={metadata}
					previewDevice={previewDevice}
				/>
				<RadioButtonControl
					label={__('Max Height', 'kadence-blocks')}
					attributes={attributes}
					setAttributes={setAttributes}
					attributeName={'maxHeight'}
					radioType={'maxHeight'}
					type={'maxHeight'}
					meta={metadata}
					previewDevice={previewDevice}
				/>
			</ToolsPanelBody>
			<ToolsPanelBody
				title={__('Advanced Highlight Settings', 'kadence-blocks')}
				panelName={'text-advanced-highlight'}
				componentName={'advanced-highlight-control'}
				hasDeviceControls={false}
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
					hasGradient={true}
					hasMix={true}
				/>
				{!hasGradientHighlight && (
					<ColorControl
						label={__('Highlight Background Color', 'kadence-blocks')}
						attributes={attributes}
						setAttributes={setAttributes}
						meta={metadata}
						previewDevice={previewDevice}
						attributeName={'backgroundColorHighlight'}
						globalStylesIds={globalStylesIds}
						hasGradient={true}
						hasMix={true}
					/>
				)}
				{hasGradientHighlight && (
					<Notice>
						{__('Background color will be ignored while a gradient color is applied.', 'kadence-blocks')}
					</Notice>
				)}
				<BorderControl
					attributes={attributes}
					attributeName={'borderHighlight'}
					setAttributes={setAttributes}
					previewDevice={previewDevice}
					meta={metadata}
					globalStylesIds={globalStylesIds}
					labelBorderRadius={__('Highlight Border Radius', 'kadence-blocks')}
					label={__('Highlight Border', 'kadence-blocks')}
					hasPresetControl={true}
				/>

				<SpaceControl
					label={__('Highlight Padding', 'kadence-blocks')}
					attributes={attributes}
					setAttributes={setAttributes}
					attributeName={'paddingHighlight'}
					type={'padding'}
					previewDevice={previewDevice}
					hasPresetControl={false}
					metaData={metadata}
					globalStylesIds={globalStylesIds}
				/>
			</ToolsPanelBody>
			<SharedInspectorStyle metadata={metadata} {...props} />
		</>
	);
}
