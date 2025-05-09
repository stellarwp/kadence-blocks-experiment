import SelectControl from '../select-control';
import { __ } from '@wordpress/i18n';
import ResponsiveRadioRangeControls from '../range/responsive-radio-range-control';
import ResponsiveUnitControl from '../responsive-unit-control';
import ToolsPanelBody from '../tools-panel-body';
import RadioButtonControl from '../radio-button-control';
import PresetSelectControl from '../preset-select-control';
import { getPreviewValue, getInheritedDeviceValue } from '@kadence/kbsHelpers';
import { useState } from '@wordpress/element';
export default function FlexChildControl({
	attributes,
	setAttributes,
	metaData,
	previewDevice,
	attributeName,
	previewDirection = 'column',
	globalStylesIds,
	customOnChange,
	forStyleBook,
	forPresetControl,
}) {
	const [currentView, setCurrentView] = useState('normal');
	const onSelectView = (view) => {
		setCurrentView(view);
	};
	const selector = metaData?.attributes?.[attributeName]?.selector || 'flex';
	return (
		<ToolsPanelBody
			title={__('Flex Child Settings', 'kadence-blocks')}
			panelName={selector + 'flex-child-settings'}
			componentName={'flexchild-control'}
			setAttributes={setAttributes}
			attributeName={attributeName}
			onSelectView={onSelectView}
			currentView={currentView}
			hasViewControls={true}
		>
			<RadioButtonControl
				label={__('Flex', 'kadence-blocks')}
				attributes={attributes}
				setAttributes={setAttributes}
				attributeName={attributeName}
				type={'flex'}
				meta={metaData}
				previewDevice={previewDevice}
				previewDirection={previewDirection}
				view={currentView}
				hasCustomControls={true}
			/>
			<RadioButtonControl
				label={__('Justify Self', 'kadence-blocks')}
				attributes={attributes}
				setAttributes={setAttributes}
				attributeName={attributeName}
				type={'justifySelf'}
				meta={metaData}
				previewDevice={previewDevice}
				previewDirection={previewDirection}
				view={currentView}
			/>
			<RadioButtonControl
				label={__('Align Self', 'kadence-blocks')}
				attributes={attributes}
				setAttributes={setAttributes}
				attributeName={attributeName}
				type={'alignSelf'}
				previewDevice={previewDevice}
				previewDirection={previewDirection}
				meta={metaData}
				view={currentView}
			/>
		</ToolsPanelBody>
	);
}
