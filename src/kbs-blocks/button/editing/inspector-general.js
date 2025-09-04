/**
 * BLOCK: Kadence Column
 *
 * Registering a basic block with Gutenberg.
 */

/**
 * Kadence Components.
 */
import { ToolsPanelBody, LinkControl, RadioButtonControl, PresetControl } from '@kadence/kbsComponents';

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
	const buttonSizePresets = [
		{
			name: 'SM',
			title: __('Small', 'kadence-blocks'),
			key: 'sm',
		},
		{
			name: 'Normal',
			title: __('Default', 'kadence-blocks'),
			key: 'md',
		},
		{
			name: 'LG',
			title: __('Large', 'kadence-blocks'),
			key: 'lg',
		},
	];
	return (
		<>
			<ToolsPanelBody panelName={'button-variants'} initialOpen={true}>
				<LinkControl
					label={__('Button Link', 'kadence-blocks')}
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
					useRadioToggle={true}
				/>
				{/* <PresetControl
					label={__('Size', 'kadence-blocks')}
					type={'buttonSize'}
					attributes={attributes}
					setAttributes={setAttributes}
					attributeName={'size'}
					metaData={metadata}
					previewDevice={previewDevice}
					globalStylesIds={globalStylesIds}
					isBundlePreset={true}
					useRadioToggle={true}
					definedPresets={buttonSizePresets}
				/> */}
				<RadioButtonControl
					label={__('Width', 'kadence-blocks')}
					attributes={attributes}
					setAttributes={setAttributes}
					attributeName={'width'}
					radioType={'buttonWidth'}
					type={'width'}
					hasCustomControls={true}
					meta={metadata}
					previewDevice={previewDevice}
				/>
			</ToolsPanelBody>
		</>
	);
}
