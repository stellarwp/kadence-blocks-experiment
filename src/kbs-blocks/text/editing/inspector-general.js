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
	LinkControl,
	LinkStyle,
	IconControl,
	ColorControl,
	RadioButtonControl,
	RadioButtonSelect,
	ToggleControl,
	SharedInspectorGeneral,
} from '@kadence/kbsComponents';

import metadata from '../block.json';
/**
 * Import WordPress
 */
import { __ } from '@wordpress/i18n';

/**
 * Build the section edit.
 */
export default function InspectorGeneral(props) {
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

	const { link } = attributes;

	return (
		<>
			<ToolsPanelBody
				title={__('Text Settings', 'kadence-blocks')}
				panelName={'text-settings'}
				initialOpen={true}
			>
				<RadioButtonSelect
					label={__('HTML Tag', 'kadence-blocks')}
					value={attributes.htmlTag}
					onChange={(value) => {
						setAttributes({ htmlTag: value || 'p' });
					}}
					isDeselectable={false}
					attributeName={'htmlTag'}
					type={'headingTag'}
					meta={metadata}
				/>
				<RadioButtonControl
					label={__('Text Align', 'kadence-blocks')}
					attributes={attributes}
					setAttributes={setAttributes}
					attributeName={'textAlign'}
					type={'textAlign'}
					previewDevice={previewDevice}
					meta={metadata}
				/>
				<RadioButtonControl
					label={__('Max Width', 'kadence-blocks')}
					attributes={attributes}
					setAttributes={setAttributes}
					attributeName={'maxWidth'}
					radioType={'maxWidth'}
					type={'maxWidth'}
					hasCustomControls={true}
					meta={metadata}
					previewDevice={previewDevice}
				/>
			</ToolsPanelBody>
			<ToolsPanelBody
				title={__('Link Settings', 'kadence-blocks')}
				panelName={'container-link'}
				componentName={'link-control'}
				initialOpen={false}
			>
				<LinkControl
					label={__('Text Wrap Link', 'kadence-blocks')}
					additionalControls={true}
					dynamicAttribute={'link'}
					allowClear={true}
					changeTargetType={false}
					setAttributes={setAttributes}
					attributes={attributes}
					meta={metadata}
					previewDevice={'none'}
					globalStylesIds={globalStylesIds}
					attributeName={'link'}
				/>
				<LinkStyle
					label={__('Link Style', 'kadence-blocks')}
					attributes={attributes}
					setAttributes={setAttributes}
					meta={metadata}
					previewDevice={previewDevice}
					attributeName={'linkStyle'}
					globalStylesIds={globalStylesIds}
				/>
				<ColorControl
					label={__('Link Color', 'kadence-blocks')}
					attributes={attributes}
					setAttributes={setAttributes}
					meta={metadata}
					previewDevice={previewDevice}
					attributeName={'colorLink'}
					globalStylesIds={globalStylesIds}
					globalStylesCss={globalStylesCss}
					hasGradient={true}
					hasMix={true}
					hasHoverControls={true}
				/>
			</ToolsPanelBody>
			<ToolsPanelBody
				title={__('Icon Settings', 'kadence-blocks')}
				panelName={'icon-settings'}
				componentName={'icon-control'}
				initialOpen={false}
			>
				<IconControl
					label={__('Icon', 'kadence-blocks')}
					attributes={attributes}
					setAttributes={setAttributes}
					meta={metadata}
					previewDevice={previewDevice}
					attributeName={'icon'}
					hasTooltip={true}
					hasPlacement={true}
					hasAlignment={true}
					hasSpacing={true}
					hasRotation={true}
					globalStylesCss={globalStylesCss}
					globalStylesIds={globalStylesIds}
				/>
				<ToggleControl
					label={__('Reveal Icon on Hover', 'kadence-blocks')}
					titleBar={false}
					attributeName={'iconReveal'}
					attributes={attributes}
					setAttributes={setAttributes}
					meta={metadata}
					type={'iconReveal'}
				/>
			</ToolsPanelBody>
			<SharedInspectorGeneral metadata={metadata} {...props} />
		</>
	);
}
