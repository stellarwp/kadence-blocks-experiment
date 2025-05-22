/**
 * External libraries
 */
/**
 * WordPress libraries
 */
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
/**
 * Internal libraries
 */
import { getPreviewValue, getInheritedDeviceValue } from '@kadence/kbsHelpers';
/**
 * Internal Dependencies
 */
import ResponsiveRadioRangeControls from '../range/responsive-radio-range-control';
import ResponsiveUnitControl from '../responsive-unit-control';
import ToolsPanelBody from '../tools-panel-body';
import RadioButtonControl from '../radio-button-control';
import PresetControl from './preset-control';
import ColorControl from '../color-control';
import BackgroundImageControl from '../background-image-control';
import BackgroundLayer from './background-layer';
import LayerTitleBar from './layer-title-bar';
import './editor.scss';

export default function BackgroundControl({
	title,
	attributes,
	setAttributes,
	metaData,
	previewDevice,
	attributeName,
	previewDirection = 'column',
	globalStylesIds,
	customOnChange,
	forStyleBook = false,
	forPresetControl,
}) {
	const [currentView, setCurrentView] = useState('normal');
	const onSelectView = (view) => {
		setCurrentView(view);
	};
	const selector = metaData?.attributes?.[attributeName]?.selector || 'background';
	const inherited = getInheritedDeviceValue(attributeName, attributes, previewDevice, metaData, '', globalStylesIds);
	const hasLayers = metaData?.attributes?.[attributeName]?.hasLayers;
	const onReset = () => {
		handleAttributeChange(
			undefined,
			'all',
			attributeName,
			attributes,
			setAttributes,
			customOnChange,
			'layers',
			meta
		);
	};
	const onTogglePlus = () => {
		console.log('onTogglePlus');
		// setAttributes({
		// 	[attributeName]: [...(attributes[attributeName] || []), {}],
		// });
	};
	console.log(inherited);
	return (
		<ToolsPanelBody
			title={title || __('Background', 'kadence-blocks')}
			panelName={selector + 'background-settings'}
			componentName={'background-control'}
			setAttributes={setAttributes}
			attributeName={attributeName}
			onSelectView={onSelectView}
			currentView={currentView}
			hasViewControls={true}
		>
			<PresetControl
				label={__('Background Presets', 'kadence-blocks')}
				type={'background'}
				attributes={attributes}
				setAttributes={setAttributes}
				attributeName={attributeName}
				meta={metaData}
				previewDevice={previewDevice}
				globalStylesIds={globalStylesIds}
				forStyleBook={forStyleBook}
			/>
			{hasLayers && inherited?.inheritedValue && Array.isArray(inherited?.inheritedValue) && (
				<>
					<LayerTitleBar
						label={__('Background', 'kadence-blocks')}
						reset={onReset}
						onReset={onReset}
						onTogglePlus={onTogglePlus}
					/>
					{
						// Loop through the layers and add a color control for each layer
						inherited?.inheritedValue?.map((layer, index) => {
							console.log(layer);
							console.log(attributes[attributeName]?.layers?.[index]);
							return (
								<div key={index}>
									<BackgroundLayer
										attributes={attributes}
										type={'backgroundcolor'}
										setAttributes={setAttributes}
										attributeName={attributeName}
										meta={metaData}
										previewDevice={previewDevice}
										globalStylesIds={globalStylesIds}
									/>
								</div>
							);
						})
					}
				</>
			)}
			{/* <ColorControl
					label={__('Background Color', 'kadence-blocks')}
					attributes={attributes}
					type={'backgroundcolor'}
					setAttributes={setAttributes}
					attributeName={attributeName}
					meta={metaData}
					previewDevice={previewDevice}
					globalStylesIds={globalStylesIds}
				/>
			<BackgroundImageControl
				label={__('Background Image', 'kadence-blocks')}
				attributes={attributes}
				type={'image'}
				setAttributes={setAttributes}
				attributeName={attributeName}
				meta={metaData}
				previewDevice={previewDevice}
				globalStylesIds={globalStylesIds}
				dynamicAttribute={attributeName + ':image'}
			/> */}
		</ToolsPanelBody>
	);
}
