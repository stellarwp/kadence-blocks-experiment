/**
 * Inspector Controls
 */

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl } from '@wordpress/components';
import { LinkControl, LinkStyle, ToolsPanelBody, Typography } from '@kadence/kbsComponents';
import metadata from '../block.json';

/**
 * Inspector controls
 */
export default function Inspector(props) {
	const { attributes, setAttributes, previewDevice, globalStylesIds } = props;
	const { htmlTag, link } = attributes;

	const htmlOptions = [
		{ value: 'div', label: __('Div', 'kadence-blocks') },
		{ value: 'p', label: __('Paragraph', 'kadence-blocks') },
		{ value: 'span', label: __('Span', 'kadence-blocks') },
	];

	return (
		<InspectorControls>
			<PanelBody title={__('Text Settings', 'kadence-blocks')} initialOpen={true}>
				<SelectControl
					label={__('HTML Tag', 'kadence-blocks')}
					value={htmlTag || 'div'}
					options={htmlOptions}
					onChange={(value) => setAttributes({ htmlTag: value })}
				/>
			</PanelBody>
			<ToolsPanelBody
				title={__('Link Settings', 'kadence-blocks')}
				panelName={'container-link'}
				componentName={'link-control'}
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
			</ToolsPanelBody>

			<ToolsPanelBody
				title={__('Typography Settings', 'kadence-blocks')}
				panelName={'container-typography'}
				componentName={'typography-control'}
			>
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
		</InspectorControls>
	);
}
