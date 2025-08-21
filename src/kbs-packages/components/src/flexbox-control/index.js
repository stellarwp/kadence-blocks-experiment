import SelectControl from '../select-control';
import { __ } from '@wordpress/i18n';
import ToolsPanelBody from '../tools-panel-body';
import RadioButtonControl from '../radio-button-control';
import { getPreviewValue, getInheritedDeviceValue } from '@kadence/kbsHelpers';
import { useState } from '@wordpress/element';
export default function FlexBoxControl({
	attributes,
	setAttributes,
	metaData,
	previewDevice,
	attributeName,
	globalStylesIds,
	customOnChange,
	forStyleBook,
}) {
	const [currentView, setCurrentView] = useState('normal');
	const onSelectView = (view) => {
		setCurrentView(view);
	};
	const previewDirection = getInheritedDeviceValue(
		attributeName,
		attributes,
		previewDevice,
		metaData,
		'flexDirection'
	);
	const previewWrap = getInheritedDeviceValue(attributeName, attributes, previewDevice, metaData, 'flexWrap');
	const previewAlignContent = getInheritedDeviceValue(
		attributeName,
		attributes,
		previewDevice,
		metaData,
		'alignContent'
	);
	const selector = metaData?.attributes?.[attributeName]?.varPrefix || 'flex';
	return (
		<ToolsPanelBody
			title={__('Flex Settings', 'kadence-blocks')}
			panelName={selector + 'flex-settings'}
			componentName={'flexbox-control'}
			setAttributes={setAttributes}
			attributeName={attributeName}
			onSelectView={onSelectView}
			currentView={currentView}
			hasViewControls={true}
		>
			<RadioButtonControl
				label={__('Direction', 'kadence-blocks')}
				attributes={attributes}
				setAttributes={setAttributes}
				attributeName={attributeName}
				type={'flexDirection'}
				previewDevice={previewDevice}
				meta={metaData}
				previewDirection={previewDirection?.inheritedValue}
				view={currentView}
			/>
			<RadioButtonControl
				label={__('Justify Content', 'kadence-blocks')}
				attributes={attributes}
				setAttributes={setAttributes}
				attributeName={attributeName}
				type={'justifyContent'}
				previewDevice={previewDevice}
				meta={metaData}
				previewDirection={previewDirection?.inheritedValue}
				view={currentView}
			/>
			<RadioButtonControl
				label={__('Align Items', 'kadence-blocks')}
				attributes={attributes}
				setAttributes={setAttributes}
				attributeName={attributeName}
				type={'alignItems'}
				meta={metaData}
				previewDevice={previewDevice}
				previewDirection={previewDirection?.inheritedValue}
				view={currentView}
			/>
			{(currentView === 'advanced' ||
				previewWrap?.inheritedValue === 'wrap' ||
				previewDirection?.inheritedValue === 'row' ||
				previewDirection?.inheritedValue === 'row-reverse') && (
				<RadioButtonControl
					label={__('Wrap', 'kadence-blocks')}
					attributes={attributes}
					setAttributes={setAttributes}
					attributeName={attributeName}
					type={'flexWrap'}
					meta={metaData}
					previewDevice={previewDevice}
					previewDirection={previewDirection?.inheritedValue}
					view={currentView}
				/>
			)}
			{(currentView === 'advanced' || previewAlignContent?.inheritedValue) && (
				<RadioButtonControl
					label={__('Align Content', 'kadence-blocks')}
					attributes={attributes}
					setAttributes={setAttributes}
					attributeName={attributeName}
					type={'alignContent'}
					meta={metaData}
					previewDevice={previewDevice}
					previewDirection={previewDirection?.inheritedValue}
					view={currentView}
				/>
			)}
			<RadioButtonControl
				label={__('Vertical Gap', 'kadence-blocks')}
				attributes={attributes}
				setAttributes={setAttributes}
				attributeName={attributeName}
				type={'rowGap'}
				meta={metaData}
				previewDevice={previewDevice}
				previewDirection={previewDirection?.inheritedValue}
				view={currentView}
				hasCustomControls={true}
			/>
			{(currentView === 'advanced' ||
				previewDirection?.inheritedValue === 'row' ||
				previewDirection?.inheritedValue === 'row-reverse') && (
				<RadioButtonControl
					label={__('Horizontal Gap', 'kadence-blocks')}
					attributes={attributes}
					setAttributes={setAttributes}
					attributeName={attributeName}
					type={'columnGap'}
					meta={metaData}
					previewDevice={previewDevice}
					previewDirection={previewDirection?.inheritedValue}
					view={currentView}
					hasCustomControls={true}
				/>
			)}
		</ToolsPanelBody>
	);
}
