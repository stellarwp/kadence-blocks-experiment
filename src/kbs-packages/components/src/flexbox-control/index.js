import SelectControl from '../select-control';
import { __ } from '@wordpress/i18n';
import ResponsiveRadioRangeControls from '../range/responsive-radio-range-control';
import ResponsiveUnitControl from '../responsive-unit-control';
import ToolsPanelBody from '../tools-panel-body';
import RadioButtonControl from '../radio-button-control';
import PresetSelectControl from '../preset-select-control';
import { getPreviewValue, getInheritedDeviceValue } from '@kadence/kbsHelpers';

export default function FlexBoxControl({
	attributes,
	setAttributes,
	metaData,
	previewDevice,
	attributeName,
	globalStylesIds,
	customOnChange,
	forStyleBook,
	forPresetControl,
}) {
	const previewDirection = getInheritedDeviceValue(attributeName, attributes, previewDevice, metaData, 'flexDirection');
	return (
		<ToolsPanelBody
			title={__('Flex Settings', 'kadence-blocks')}
			panelName={'container-flex-settings'}
			componentName={'flexbox-control'}
			setAttributes={setAttributes}
			attributeName={attributeName}
		>
			{/* <PresetSelectControl
				attributes={ attributes }
				setAttributes={ setAttributes }
				attributeName={ 'direction' }
				meta={ meta }
			/> */}
			<RadioButtonControl
				label={__('Direction', 'kadence-blocks')}
				attributes={ attributes }
				setAttributes={ setAttributes }
				attributeName={ attributeName }
				type={ 'flexDirection' }
				previewDevice={ previewDevice }
				meta={ metaData }
				previewDirection={ previewDirection?.inheritedValue }
			/>
			<RadioButtonControl
				label={__('Justify Content', 'kadence-blocks')}
				attributes={ attributes }
				setAttributes={ setAttributes }
				attributeName={ attributeName }
				type={ 'justifyContent' }
				previewDevice={ previewDevice }
				meta={ metaData }
				previewDirection={ previewDirection?.inheritedValue }
			/>
			<RadioButtonControl
				label={__('Align Items', 'kadence-blocks')}
				attributes={ attributes }
				setAttributes={ setAttributes }
				attributeName={ attributeName }
				type={ 'alignItems' }
				meta={ metaData }
				previewDevice={ previewDevice }
				previewDirection={ previewDirection?.inheritedValue }
			/>
			<RadioButtonControl
				label={__('Wrap', 'kadence-blocks')}
				attributes={ attributes }
				setAttributes={ setAttributes }
				attributeName={ attributeName }
				type={ 'flexWrap' }
				meta={ metaData }
				previewDevice={ previewDevice }
				previewDirection={ previewDirection?.inheritedValue }
			/>
		</ToolsPanelBody>
	);
}
