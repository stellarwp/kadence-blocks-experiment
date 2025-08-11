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
import { useEffect, useState, useCallback } from '@wordpress/element';
import { Button } from '@wordpress/components';
import { link, linkOff } from '@wordpress/icons';
import {
	getDeviceValue,
	getInheritedDeviceValue,
	handleAttributeChange,
	mouseOverVisualizer,
	getInheritedValue,
	handleMultipleAttributeChange,
	getSpacingOutput,
	getPresetOptions,
} from '@kadence/kbsHelpers';
import TitleBar from '../title-bar';
import RadioButtonSelect from '../radio-button-control/radio-button-select';
import { getSpacingControls } from '../radio-button-control/controls-config';
import { PaddingVisualizer, MarginVisualizer } from './spacing-visualizer';
import PresetControl from '../preset-control';
import RadioToggleGroupPopoverInputUI from '../radio-button-control/ui-toggle-group-popover-input';
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
	previewDevice = 'Desktop',
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
	hasTop = true,
	hasLeft = true,
	hasRight = true,
	hasBottom = true,
}) {
	const parentType = type;
	const typeMouseOver = mouseOverVisualizer();
	const [isCustom, setIsCustom] = useState(false);
	const [isLinking, setIsLinking] = useState(false);
	const topValue = getDeviceValue(attributeName, attributes, previewDevice, type + 'Top');
	const rightValue = getDeviceValue(attributeName, attributes, previewDevice, type + 'Right');
	const bottomValue = getDeviceValue(attributeName, attributes, previewDevice, type + 'Bottom');
	const leftValue = getDeviceValue(attributeName, attributes, previewDevice, type + 'Left');
	const controls = getSpacingControls();
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
		onChange(resetValue, previewDevice === 'Desktop' ? 'all' : previewDevice, type, true);
	};
	// Memoize event handlers
	const onSetAttributes = useCallback(
		(newAttributes) => {
			console.log('onSetAttributes', newAttributes, inheritedTop, inheritedBottom);
			if (
				newAttributes['padding']?.preset &&
				(inheritedTop?.inheritedType === 'preset' || inheritedBottom?.inheritedType === 'preset')
			) {
				const inherited = getInheritedValue(
					'padding',
					attributes,
					'none',
					metaData,
					'desktop',
					globalStylesIds
				);
				const inheritedTablet = getInheritedValue(
					'padding',
					attributes,
					'none',
					metaData,
					'tablet',
					globalStylesIds
				);
				const inheritedMobile = getInheritedValue(
					'padding',
					attributes,
					'none',
					metaData,
					'mobile',
					globalStylesIds
				);

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
		},
		[getInheritedValue, setAttributes, attributes, metaData, globalStylesIds, inheritedTop, inheritedBottom]
	);
	const onChange = (value, device, tempType, reset = false) => {
		console.log('onChange', value, device, tempType);
		if (isLinking || reset) {
			handleMultipleAttributeChange(
				[value, value, value, value],
				device,
				attributeName,
				attributes,
				parentType === 'padding' ? onSetAttributes : setAttributes,
				customOnChange,
				[type + 'Top', type + 'Left', type + 'Right', type + 'Bottom'],
				metaData
			);
		} else {
			handleMultipleAttributeChange(
				value,
				device,
				attributeName,
				attributes,
				parentType === 'padding' ? onSetAttributes : setAttributes,
				customOnChange,
				tempType,
				metaData
			);
		}
	};
	const paddingPresets = [
		{
			icon: sectionLargeIcon,
			title: __('Section XXL', 'kadence-blocks'),
			key: 'kbs-pd-sec-xxl',
		},
		{
			icon: sectionMediumIcon,
			title: __('Section XL', 'kadence-blocks'),
			key: 'kbs-pd-sec-xl',
		},
		{
			icon: cardLargeIcon,
			title: __('Card Large', 'kadence-blocks'),
			key: 'kbs-pd-card-lg',
		},
		{
			icon: cardMediumIcon,
			title: __('Card Medium', 'kadence-blocks'),
			key: 'kbs-pd-card-md',
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
				<div className={'kbs-space-control-container'}>
					{label && (
						<TitleBar
							label={label}
							reset={reset}
							onReset={onReset}
							hasDeviceControls={hasDeviceControls}
							isCustom={isCustom}
							onToggleCustom={() => setIsCustom(!isCustom)}
							hasCustomControls={true}
						/>
					)}
					<div className={'kadence-controls-content kbs-space-control-inner'}>
						<div className={'kbs-space-control-visualizer'}>
							{/* <div className={'kbs-space-control-visualizer-wrapper'}>
							<div
								className={'kbs-space-control-visualizer-inner'}
								style={{
									borderTopWidth:
										'calc(' +
										getSpacingOutput(topValue || inheritedTop?.inheritedValue) +
										' * 0.25)',
									borderRightWidth:
										'calc(' +
										getSpacingOutput(rightValue || inheritedRight?.inheritedValue) +
										' * 0.25)',
									borderBottomWidth:
										'calc(' +
										getSpacingOutput(bottomValue || inheritedBottom?.inheritedValue) +
										' * 0.25)',
									borderLeftWidth:
										'calc(' +
										getSpacingOutput(leftValue || inheritedLeft?.inheritedValue) +
										' * 0.25)',
								}}
							></div>
						</div> */}
						</div>
						<div className="kbs-radio-button-popup-grid-container">
							{hasTop && (
								<RadioToggleGroupPopoverInputUI
									label={__('Top', 'kadence-blocks')}
									parentLabel={label}
									type={type + 'Top'}
									hasCustomControls={true}
									controls={controls}
									isCustom={isCustom}
									value={topValue}
									inherited={inheritedTop}
									onChange={(itemValue) => onChange(itemValue, previewDevice, type + 'Top')}
								/>
							)}
							{hasLeft && (
								<RadioToggleGroupPopoverInputUI
									label={__('Left', 'kadence-blocks')}
									type={type + 'Left'}
									parentLabel={label}
									hasCustomControls={true}
									value={leftValue}
									controls={controls}
									isCustom={isCustom}
									inherited={inheritedLeft}
									onChange={(itemValue) => onChange(itemValue, previewDevice, type + 'Left')}
								/>
							)}
							<div className={'kbs-space-control-linking'}>
								<Button
									iconSize={16}
									className={'kbs-space-control-linking-button'}
									onClick={() => setIsLinking(!isLinking)}
									isPressed={isLinking}
									icon={isLinking ? link : linkOff}
									label={isLinking ? __('Unlink', 'kadence-blocks') : __('Link', 'kadence-blocks')}
								/>
							</div>
							{hasRight && (
								<RadioToggleGroupPopoverInputUI
									label={__('Right', 'kadence-blocks')}
									type={type + 'Right'}
									parentLabel={label}
									hasCustomControls={true}
									value={rightValue}
									controls={controls}
									isCustom={isCustom}
									inherited={inheritedRight}
									onChange={(itemValue) => onChange(itemValue, previewDevice, type + 'Right')}
								/>
							)}
							{hasBottom && (
								<RadioToggleGroupPopoverInputUI
									label={__('Bottom', 'kadence-blocks')}
									type={type + 'Bottom'}
									hasCustomControls={true}
									parentLabel={label}
									isCustom={isCustom}
									controls={controls}
									value={bottomValue}
									inherited={inheritedBottom}
									onChange={(itemValue) => onChange(itemValue, previewDevice, type + 'Bottom')}
								/>
							)}
						</div>
					</div>
				</div>
			</div>
			{type === 'padding' && showVisualizer && (
				<PaddingVisualizer
					forceShow={typeMouseOver.isMouseOver}
					clientId={clientId}
					blockElementRef={blockElementRef}
					value={[inheritedTop, inheritedRight, inheritedBottom, inheritedLeft]}
				/>
			)}
			{type === 'margin' && showVisualizer && (
				<MarginVisualizer
					forceShow={typeMouseOver.isMouseOver}
					clientId={clientId}
					blockElementRef={blockElementRef}
					value={[inheritedTop, inheritedRight, inheritedBottom, inheritedLeft]}
				/>
			)}
		</>
	);
}
