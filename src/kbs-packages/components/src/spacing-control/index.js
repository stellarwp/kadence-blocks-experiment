import { __ } from '@wordpress/i18n';

import { getInheritedValue } from '@kadence/kbsHelpers';

import ToolsPanelBody from '../tools-panel-body';
import SpaceControl from '../space-control';
import PresetControl from '../preset-control';
import { sectionLargeIcon, sectionMediumIcon, cardLargeIcon, cardMediumIcon } from '../constants/icons';

export default function SpacingControl({
	attributes,
	setAttributes,
	previewDevice,
	title = __('Spacing Settings', 'kadence-blocks'),
	types = ['padding', 'margin'],
	metaData,
	hasPresetControl = true,
	globalStylesIds,
	customOnChange,
	showVisualizer = false,
	clientId,
	blockElementRef = null,
}) {
	const onAllReset = () => {
		const resetObject = {};
		types.forEach((type) => {
			resetObject[type] = undefined;
		});
		setAttributes(resetObject);
	};
	const getLabel = (type) => {
		switch (type) {
			case 'padding':
				return __('Padding', 'kadence-blocks');
			case 'margin':
				return __('Margin', 'kadence-blocks');
		}
	};
	const inherited = getInheritedValue('padding', attributes, 'none', metaData, 'desktop', globalStylesIds);
	const inheritedTablet = getInheritedValue('padding', attributes, 'none', metaData, 'tablet', globalStylesIds);
	const inheritedMobile = getInheritedValue('padding', attributes, 'none', metaData, 'mobile', globalStylesIds);
	const paddingPresets = [
		{
			icon: sectionLargeIcon,
			title: __('Section XXL', 'kadence-blocks'),
			key: 'section-xxl',
		},
		{
			icon: sectionMediumIcon,
			title: __('Section XL', 'kadence-blocks'),
			key: 'section-xl',
		},
		{
			icon: cardLargeIcon,
			title: __('Card Large', 'kadence-blocks'),
			key: 'card-lg',
		},
		{
			icon: cardMediumIcon,
			title: __('Card Medium', 'kadence-blocks'),
			key: 'card-md',
		},
	];
	const onSetAttributes = (newAttributes) => {
		if (newAttributes['padding']?.preset && inherited?.inheritedValue && inherited.inheritedType === 'preset') {
			newAttributes['padding']['desktop'] = inherited?.inheritedValue
				? { ...inherited?.inheritedValue, ...newAttributes['padding']['desktop'] }
				: newAttributes['padding']['desktop'];
			newAttributes['padding']['tablet'] = inheritedTablet?.inheritedValue
				? { ...inheritedTablet?.inheritedValue, ...newAttributes['padding']['tablet'] }
				: newAttributes['padding']['tablet'];
			newAttributes['padding']['mobile'] = inheritedMobile?.inheritedValue;
			delete newAttributes['padding']?.preset;
		}
		setAttributes(newAttributes);
	};
	return (
		<ToolsPanelBody title={title} panelName={'container-spacing'} componentName={'spacing-control'}>
			{hasPresetControl && (
				<PresetControl
					label={__('Padding Presets', 'kadence-blocks')}
					type={'spacing'}
					attributes={attributes}
					setAttributes={setAttributes}
					attributeName={'padding'}
					meta={metaData}
					previewDevice={previewDevice}
					globalStylesIds={globalStylesIds}
					definedPresets={paddingPresets}
				/>
			)}
			{types.map((type) => (
				<SpaceControl
					key={type}
					label={getLabel(type)}
					attributes={attributes}
					setAttributes={'padding' === type ? onSetAttributes : setAttributes}
					attributeName={type}
					type={type}
					meta={metaData}
					previewDevice={previewDevice}
					customOnChange={customOnChange}
					clientId={clientId}
					showVisualizer={showVisualizer}
					blockElementRef={blockElementRef}
				/>
			))}
		</ToolsPanelBody>
	);
}
