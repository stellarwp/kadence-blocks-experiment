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
	IconControl,
	TabsControl,
	ToggleControl,
	ButtonSettings,
} from '@kadence/kbsComponents';
import { getResolvedValue } from '@kadence/kbsHelpers';

import metadata from '../block.json';
/**
 * Import WordPress
 */
import { __ } from '@wordpress/i18n';
import { useState, useMemo } from '@wordpress/element';
/**
 * Build the section edit.
 */
export default function InspectorStyles(props) {
	const { attributes, setAttributes, previewDevice, globalStylesIds, globalStylesCss, blockElementRef, clientId } =
		props;
	const [isHover, setIsHover] = useState(false);

	const iconAnyValue = useMemo(
		() => getResolvedValue('icon', attributes, 'any', metadata, 'icon', globalStylesIds),
		[attributes]
	);
	const iconValue = iconAnyValue?.appliedValue;

	return (
		<>
			<ButtonSettings
				title={__('Button Settings', 'kadence-blocks')}
				globalStylesCss={globalStylesCss}
				globalStylesIds={globalStylesIds}
				previewDevice={previewDevice}
				forStyleBook={false}
				attributes={attributes}
				setAttributes={setAttributes}
				meta={metadata}
			/>
			{/* <ToolsPanelBody
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
								meta={metadata}
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
								meta={metadata}
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
								meta={metadata}
								globalStylesIds={globalStylesIds}
								labelBorderRadius={__('Border Radius', 'kadence-blocks')}
								label={__('Border', 'kadence-blocks')}
								hasPresetControl={true}
								isHover={isHover}
								setIsHover={setIsHover}
							/>
							<LayeredShadowControl
								attributeName={'boxShadow'}
								attributes={attributes}
								setAttributes={setAttributes}
								metaData={metadata}
								previewDevice={previewDevice}
								globalStylesIds={globalStylesIds}
								globalStylesCss={globalStylesCss}
								type={'boxShadow'}
							/>
						</>
					)}
					{isHover && (
						<>
							<ColorControl
								label={__('Color', 'kadence-blocks')}
								attributes={attributes}
								setAttributes={setAttributes}
								meta={metadata}
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
								meta={metadata}
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
								meta={metadata}
								globalStylesIds={globalStylesIds}
								labelBorderRadius={__('Border Radius', 'kadence-blocks')}
								label={__('Border', 'kadence-blocks')}
								hasPresetControl={true}
								isHover={isHover}
								setIsHover={setIsHover}
							/>
							<LayeredShadowControl
								attributeName={'boxShadowHover'}
								attributes={attributes}
								setAttributes={setAttributes}
								metaData={metadata}
								previewDevice={previewDevice}
								globalStylesIds={globalStylesIds}
								globalStylesCss={globalStylesCss}
							/>
						</>
					)}
				</TabsControl>
			</ToolsPanelBody> */}
			<ToolsPanelBody
				title={__('Typography Settings', 'kadence-blocks')}
				panelName={'text-typography'}
				componentName={'typography-control'}
				initialOpen={false}
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
				/>
				{iconValue && (
					<ToggleControl
						label={__('Reveal Icon on Hover', 'kadence-blocks')}
						titleBar={false}
						attributeName={'iconReveal'}
						attributes={attributes}
						setAttributes={setAttributes}
						meta={metadata}
						type={'iconReveal'}
					/>
				)}
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
		</>
	);
}
