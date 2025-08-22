/**
 * Import WordPress
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

/**
 * Internal libraries
 */
import ColorControl from '../color-control';
import BorderControl from '../border-control';
import LayeredShadowControl from '../layered-shadow-control';
import TabsControl from '../tabs-control';
import ToolsPanelBody from '../tools-panel-body';

import './editor.scss';
export default function ButtonSettings({
	attributes,
	setAttributes,
	meta,
	previewDevice,
	globalStylesIds,
	globalStylesCss,
}) {
	const [isHover, setIsHover] = useState(false);
	return (
		<ToolsPanelBody
			title={__('Button Settings', 'kadence-blocks')}
			panelName={'button-settings'}
			initialOpen={true}
		>
			<TabsControl
				tabs={[
					{ name: 'default', title: __('Normal', 'kadence-blocks') },
					{ name: 'hover', title: __('Hover', 'kadence-blocks') },
				]}
				selected={isHover ? 'hover' : 'default'}
				onSelect={(name) => setIsHover(name === 'hover')}
			>
				{!isHover && (
					<>
						<ColorControl
							label={__('Color', 'kadence-blocks')}
							attributes={attributes}
							setAttributes={setAttributes}
							meta={meta}
							previewDevice={previewDevice}
							attributeName={'color'}
							globalStylesIds={globalStylesIds}
							hasGradient={false}
							hasMix={true}
						/>
						<ColorControl
							label={__('Background Color', 'kadence-blocks')}
							attributes={attributes}
							setAttributes={setAttributes}
							meta={meta}
							previewDevice={previewDevice}
							attributeName={'backgroundColor'}
							type={'color'}
							globalStylesIds={globalStylesIds}
							hasGradient={true}
							hasMix={true}
						/>
						<BorderControl
							attributes={attributes}
							attributeName={'border'}
							setAttributes={setAttributes}
							previewDevice={previewDevice}
							meta={meta}
							globalStylesIds={globalStylesIds}
							labelBorderRadius={__('Border Radius', 'kadence-blocks')}
							label={__('Border', 'kadence-blocks')}
							hasPresetControl={false}
							isHover={isHover}
							setIsHover={setIsHover}
						/>
						<LayeredShadowControl
							attributeName={'boxShadow'}
							attributes={attributes}
							setAttributes={setAttributes}
							metaData={meta}
							previewDevice={previewDevice}
							globalStylesIds={globalStylesIds}
							globalStylesCss={globalStylesCss}
							type={'boxShadow'}
							hasPresetControl={false}
						/>
					</>
				)}
				{isHover && (
					<>
						<ColorControl
							label={__('Color', 'kadence-blocks')}
							attributes={attributes}
							setAttributes={setAttributes}
							meta={meta}
							previewDevice={previewDevice}
							attributeName={'color'}
							type={'colorHover'}
							globalStylesIds={globalStylesIds}
							hasGradient={false}
							hasMix={true}
						/>
						<ColorControl
							label={__('Background Color', 'kadence-blocks')}
							attributes={attributes}
							setAttributes={setAttributes}
							meta={meta}
							previewDevice={previewDevice}
							attributeName={'backgroundColor'}
							type={'colorHover'}
							globalStylesIds={globalStylesIds}
							hasGradient={true}
							hasMix={true}
						/>
						<BorderControl
							attributes={attributes}
							attributeName={'border'}
							type={'borderHover'}
							setAttributes={setAttributes}
							previewDevice={previewDevice}
							meta={meta}
							globalStylesIds={globalStylesIds}
							labelBorderRadius={__('Border Radius', 'kadence-blocks')}
							label={__('Border', 'kadence-blocks')}
							hasPresetControl={false}
							isHover={isHover}
							setIsHover={setIsHover}
						/>
						<LayeredShadowControl
							attributeName={'boxShadowHover'}
							attributes={attributes}
							setAttributes={setAttributes}
							metaData={meta}
							previewDevice={previewDevice}
							globalStylesIds={globalStylesIds}
							globalStylesCss={globalStylesCss}
							hasPresetControl={false}
						/>
					</>
				)}
			</TabsControl>
		</ToolsPanelBody>
	);
}
