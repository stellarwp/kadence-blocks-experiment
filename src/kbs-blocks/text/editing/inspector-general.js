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
} from '@kadence/kbsComponents';
import { SelectControl } from '@wordpress/components';
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

	const { htmlTag, link } = attributes;

	const htmlOptions = [
		{ value: 'div', label: __('Div', 'kadence-blocks') },
		{ value: 'p', label: __('Paragraph', 'kadence-blocks') },
		{ value: 'span', label: __('Span', 'kadence-blocks') },
	];
	return (
		<>
			<ToolsPanelBody
				title={__('Text Settings', 'kadence-blocks')}
				panelName={'text-settings'}
				initialOpen={true}
			>
				<SelectControl
					label={__('HTML Tag', 'kadence-blocks')}
					value={htmlTag || 'div'}
					options={htmlOptions}
					onChange={(value) => setAttributes({ htmlTag: value })}
				/>

				<RadioButtonControl
					label={__('Text Align', 'kadence-blocks')}
					attributes={attributes}
					setAttributes={setAttributes}
					attributeName={'align'}
					type={'alignText'}
					previewDevice={previewDevice}
					meta={metadata}
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
				initialOpen={true}
			>
				<IconControl
					label={__('Icon', 'kadence-blocks')}
					attributes={attributes}
					setAttributes={setAttributes}
					meta={metadata}
					previewDevice={previewDevice}
					attributeName={'icon'}
				/>
			</ToolsPanelBody>
		</>
	);
}
