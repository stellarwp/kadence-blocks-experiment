/**
 * Inspector Controls
 */

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl } from '@wordpress/components';
import { LinkControl } from '@kadence/kbsComponents';

/**
 * Inspector controls
 */
export default function Inspector(props) {
	const { attributes, setAttributes } = props;
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
			</PanelBody>
		</InspectorControls>
	);
}
