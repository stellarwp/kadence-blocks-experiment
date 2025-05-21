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
			<ColorControl
				label={__('Background Color', 'kadence-blocks')}
				attributes={attributes}
				type={'color'}
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
			/>
		</ToolsPanelBody>
	);
}
