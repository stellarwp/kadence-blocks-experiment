import KadenceIconPicker from './icon-select';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import TextControl from '../text-control';
import RadioButtonControl from '../radio-button-control';
import ColorControl from '../color-control';
import TabsControl from '../tabs-control';

export default function IconControl( props ) {
    const { attributes, attributeName, setAttributes, meta, previewDevice, previewDirection } = props;
	const [ activeTab, setActiveTab ] = useState( 'default' );

	const iconName = attributes[attributeName]?.desktop?.icon;

	const isLineIcon = iconName.includes('fe_');

    return (
        <>
            <KadenceIconPicker
                allowClear={true}
                attributes={attributes}
				setAttributes={setAttributes}
				attributeName={attributeName}
				meta={meta}
            />

            <TabsControl
				tabs={[
					{ name: 'default', title: __('Normal', 'kadence-blocks') },
					{ name: 'hover', title: __('Hover', 'kadence-blocks') },
				]}
				selected={activeTab}
				onSelect={(name) => setActiveTab(name)}
			>
				{ activeTab === 'default' && (
					<>
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

						<RadioButtonControl
							label={__('Icon Size', 'kadence-blocks')}
							attributes={attributes}
							setAttributes={setAttributes}
							attributeName={attributeName}
							type={'iconSize'}
							meta={meta}
							previewDevice={previewDevice}
							previewDirection={previewDirection?.inheritedValue}
							hasCustomControls={true}
						/>

						{ isLineIcon && (
							<RadioButtonControl
								label={__('Line width', 'kadence-blocks')}
								attributes={attributes}
								setAttributes={setAttributes}
								attributeName={attributeName}
								type={'iconLineWidth'}
								meta={meta}
								previewDevice={previewDevice}
								previewDirection={previewDirection?.inheritedValue}
								hasCustomControls={true}
								min={0}
								max={10}
								step={0.1}
							/>
						)}
					</>
				)}
				{ activeTab === 'hover' && (
					<>
                        <ColorControl
							label={__('Color', 'kadence-blocks')}
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
							label={__('Icon Size', 'kadence-blocks')}
							attributes={attributes}
							setAttributes={setAttributes}
							attributeName={attributeName}
							type={'iconHoverSize'}
							meta={meta}
							previewDevice={previewDevice}
							previewDirection={previewDirection?.inheritedValue}
							hasCustomControls={true}
						/>

						{ isLineIcon && (
							<RadioButtonControl
								label={__('Line width', 'kadence-blocks')}
								attributes={attributes}
								setAttributes={setAttributes}
								attributeName={attributeName}
								type={'iconHoverLineWidth'}
								meta={meta}
								previewDevice={previewDevice}
								previewDirection={previewDirection?.inheritedValue}
								hasCustomControls={true}
								min={0}
								max={10}
								step={0.1}
							/>
						)}
					</>
				)}
			</TabsControl>

            <TextControl 
                label={__('Title for screen readers', 'kadence-blocks')}
                value={attributes[attributeName]?.title}
                onChange={(value) => setAttributes({ [attributeName]: { ...attributes[attributeName], desktop: { ...attributes[attributeName]?.desktop, title: value } } })}
            />

        </>
    );
}