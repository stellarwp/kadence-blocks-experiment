import KadenceIconPicker from './icon-select';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import TextControl from '../text-control';
import RadioButtonControl from '../radio-button-control';
import ColorControl from '../color-control';

export default function IconControl( props ) {
    const { attributes, setAttributes, meta, previewDevice, previewDirection } = props;

    const attributeName = 'icon';

    return (
        <>
            <KadenceIconPicker
                allowClear={true}
                attributes={attributes}
				setAttributes={setAttributes}
				attributeName={attributeName}
				meta={meta}
            />

            <RadioButtonControl
				label={__('Line width', 'kadence-blocks')}
				attributes={attributes}
				setAttributes={setAttributes}
				attributeName={attributeName}
				type={'lineWidth'}
				meta={meta}
				previewDevice={previewDevice}
				previewDirection={previewDirection?.inheritedValue}
				hasCustomControls={true}
			/>

            <TextControl 
                label={__('Title for screen readers', 'kadence-blocks')}
                value={attributes[attributeName]?.title}
                onChange={(value) => setAttributes({ [attributeName]: { ...attributes[attributeName], title: value } })}
            />

            Tabs

            <RadioButtonControl
				label={__('Icon size', 'kadence-blocks')}
				attributes={attributes}
				setAttributes={setAttributes}
				attributeName={attributeName}
				type={'iconSize'}
				meta={meta}
				previewDevice={previewDevice}
				previewDirection={previewDirection?.inheritedValue}
				hasCustomControls={true}
			/>

            <ColorControl
                label={__('Color', 'kadence-blocks')}
                attributes={attributes}
                setAttributes={setAttributes}
                attributeName={attributeName}
                type={'color'}
                meta={meta}
                previewDevice={previewDevice}
                previewDirection={previewDirection?.inheritedValue}
                hasCustomControls={true}
            />

            <ColorControl
                label={__('Hover Color', 'kadence-blocks')}
                attributes={attributes}
                setAttributes={setAttributes}
                attributeName={attributeName}
                type={'hoverColor'}
                meta={meta}
                previewDevice={previewDevice}
                previewDirection={previewDirection?.inheritedValue}
                hasCustomControls={true}
            />

            <RadioButtonControl
				label={__('Icon hover size', 'kadence-blocks')}
				attributes={attributes}
				setAttributes={setAttributes}
				attributeName={attributeName}
				type={'iconHoverSize'}
				meta={meta}
				previewDevice={previewDevice}
				previewDirection={previewDirection?.inheritedValue}
				hasCustomControls={true}
			/>
        </>
    );
}