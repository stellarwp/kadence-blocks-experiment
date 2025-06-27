/**
 * Range Control
 *
 */

/**
 * Import Css
 */
import './editor.scss';
/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n';
import { useEffect } from '@wordpress/element';
import {
	getDeviceValue,
	getInheritedDeviceValue,
	handleAttributeChange,
	mouseOverVisualizer,
	getInheritedValue,
} from '@kadence/kbsHelpers';
import TitleBar from '../title-bar';
import RadioButtonSelect from '../radio-button-control/radio-button-select';
import { PaddingVisualizer } from './spacing-visualizer';
import PresetControl from '../preset-control';
import { sectionLargeIcon, sectionMediumIcon, cardLargeIcon, cardMediumIcon } from '../constants/icons';
/**
 * Build the Measure controls
 * @returns {object} Measure settings.
 */
export default function SpaceControl({
	attributes,
	setAttributes,
	attributeName,
	metaData,
	type,
	globalStylesIds,
	placeholder = '',
	className = '',
	defaultValue = '',
	previewDevice = 'desktop',
	max = 200,
	min = 0,
	units = [],
	label = '',
	step = undefined,
	reset = true,
	hasDeviceControls = false,
	customOnChange = undefined,
	showVisualizer = false,
	clientId = '',
	blockElementRef = null,
	hasPresetControl = true,
}) {
	const parentType = type;
	const typeMouseOver = mouseOverVisualizer();
	const topValue = getDeviceValue(attributeName, attributes, previewDevice, type + 'Top');
	const rightValue = getDeviceValue(attributeName, attributes, previewDevice, type + 'Right');
	const bottomValue = getDeviceValue(attributeName, attributes, previewDevice, type + 'Bottom');
	const leftValue = getDeviceValue(attributeName, attributes, previewDevice, type + 'Left');
	const inheritedTop = getInheritedDeviceValue(
		attributeName,
		attributes,
		previewDevice,
		metaData,
		type + 'Top',
		globalStylesIds
	);
	const inheritedRight = getInheritedDeviceValue(
		attributeName,
		attributes,
		previewDevice,
		metaData,
		type + 'Right',
		globalStylesIds
	);
	const inheritedBottom = getInheritedDeviceValue(
		attributeName,
		attributes,
		previewDevice,
		metaData,
		type + 'Bottom',
		globalStylesIds
	);
	const inheritedLeft = getInheritedDeviceValue(
		attributeName,
		attributes,
		previewDevice,
		metaData,
		type + 'Left',
		globalStylesIds
	);
	const onReset = () => {
		let resetValue = undefined;
		if (defaultValue) {
			resetValue = defaultValue;
		}
		onChange(resetValue, previewDevice === 'Desktop' ? 'all' : previewDevice, type);
	};
	useEffect(() => {
		//console.log('iglobalStylesIds', globalStylesIds);
	}, [inheritedTop]);
	const inherited =
		type === 'padding'
			? getInheritedValue('padding', attributes, 'none', metaData, 'desktop', globalStylesIds)
			: {};
	const inheritedTablet =
		type === 'padding' ? getInheritedValue('padding', attributes, 'none', metaData, 'tablet', globalStylesIds) : {};
	const inheritedMobile =
		type === 'padding' ? getInheritedValue('padding', attributes, 'none', metaData, 'mobile', globalStylesIds) : {};

	const onSetAttributes = (newAttributes) => {
		console.log('onSetAttributes', newAttributes);
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
	const onChange = (value, device, type) => {
		console.log('onChange', value, device, type);

		handleAttributeChange(
			value,
			device,
			attributeName,
			attributes,
			parentType === 'padding' ? onSetAttributes : setAttributes,
			customOnChange,
			type,
			metaData
		);
	};
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
	// Return the JSX directly, not inside an array
	return (
		<>
			<div
				onMouseOver={typeMouseOver.onMouseOver}
				onMouseOut={typeMouseOver.onMouseOut}
				className={`components-base-control kbs-control kbs-space-control${className ? ' ' + className : ''}`}
			>
				{hasPresetControl && type === 'padding' && (
					<PresetControl
						label={__('Padding Presets', 'kadence-blocks')}
						type={'spacing'}
						attributes={attributes}
						setAttributes={setAttributes}
						attributeName={'padding'}
						metaData={metaData}
						previewDevice={previewDevice}
						globalStylesIds={globalStylesIds}
						definedPresets={paddingPresets}
					/>
				)}
				{label && (
					<TitleBar
						label={label}
						reset={reset}
						onReset={onReset}
						hasDeviceControls={hasDeviceControls}
						hasAdvancedControls={false}
					/>
				)}
				<div className={'kadence-controls-content kadence-space-control-inner'}>
					<div className={'kadence-space-control-visualizer'}></div>
					<RadioButtonSelect
						label={__('Top', 'kadence-blocks')}
						type={type + 'Top'}
						hasCustomControls={true}
						value={topValue}
						inherited={inheritedTop}
						onChange={onChange}
					/>
					<RadioButtonSelect
						label={__('Left', 'kadence-blocks')}
						type={type + 'Left'}
						hasCustomControls={true}
						value={leftValue}
						inherited={inheritedLeft}
						onChange={onChange}
					/>
					<RadioButtonSelect
						label={__('Right', 'kadence-blocks')}
						type={type + 'Right'}
						hasCustomControls={true}
						value={rightValue}
						inherited={inheritedRight}
						onChange={onChange}
					/>
					<RadioButtonSelect
						label={__('Bottom', 'kadence-blocks')}
						type={type + 'Bottom'}
						hasCustomControls={true}
						value={bottomValue}
						inherited={inheritedBottom}
						onChange={onChange}
					/>
				</div>
			</div>
			{type === 'padding' && (
				<>
					<PaddingVisualizer
						forceShow={typeMouseOver.isMouseOver}
						clientId={clientId}
						blockElementRef={blockElementRef}
						value={[inheritedTop, inheritedRight, inheritedBottom, inheritedLeft]}
					/>
				</>
			)}
		</>
	);
}
