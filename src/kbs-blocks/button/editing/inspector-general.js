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
	PresetControl,
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
	const { attributes, setAttributes, previewDevice, isSelected, clientId, context, className, globalStylesIds } =
		props;

	const { link } = attributes;

	return (
		<>
			<PresetControl
				label={__('Variants', 'kadence-blocks')}
				type={'buttonVariant'}
				attributes={attributes}
				setAttributes={setAttributes}
				attributeName={'variant'}
				metaData={metadata}
				previewDevice={previewDevice}
				globalStylesIds={globalStylesIds}
				isBundlePreset={true}
			/>
			<ToolsPanelBody
				title={__('Text Settings', 'kadence-blocks')}
				panelName={'text-settings'}
				initialOpen={true}
			>
				<RadioButtonControl
					label={__('HTML Tag', 'kadence-blocks')}
					attributes={attributes}
					setAttributes={setAttributes}
					attributeName={'headingTag'}
					type={'headingTag'}
					previewDevice={previewDevice}
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
					label={__('Link', 'kadence-blocks')}
					value={link}
					onChange={(value) => setAttributes({ link: value })}
					additionalControls={true}
					dynamicAttribute={'link'}
					allowClear={true}
					changeTargetType={false}
					{...props}
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
				/>
			</ToolsPanelBody>
		</>
	);
}
