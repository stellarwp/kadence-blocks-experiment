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
import { getSpacingControls, getBorderRadiusControls } from '../radio-button-control/controls-config';
import { PaddingVisualizer, MarginVisualizer } from './spacing-visualizer';
import PresetControl from '../preset-control';
import RadioToggleGroupPopoverInputUI from '../radio-button-control/ui-toggle-group-popover-input';
import { sectionLargeIcon, sectionMediumIcon, cardLargeIcon, cardMediumIcon } from '../constants/icons';
import clsx from 'clsx';
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
	defaultValue = null,
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
	sideOptions,
	cornerControlType = false,
}) {
	const defaultSideOptions = {
		padding: {
			top: { type: 'paddingTop', label: __('Top', 'kadence-blocks') },
			left: { type: 'paddingLeft', label: __('Left', 'kadence-blocks') },
			right: { type: 'paddingRight', label: __('Right', 'kadence-blocks') },
			bottom: { type: 'paddingBottom', label: __('Bottom', 'kadence-blocks') },
		},
		margin: {
			top: { type: 'marginTop', label: __('Top', 'kadence-blocks') },
			left: { type: 'marginLeft', label: __('Left', 'kadence-blocks') },
			right: { type: 'marginRight', label: __('Right', 'kadence-blocks') },
			bottom: { type: 'marginBottom', label: __('Bottom', 'kadence-blocks') },
		},
		borderRadius: {
			top: { type: 'borderTopLeftRadius', label: __('Top Left', 'kadence-blocks') },
			left: { type: 'borderTopRightRadius', label: __('Top Right', 'kadence-blocks') },
			right: { type: 'borderBottomRightRadius', label: __('Bottom Right', 'kadence-blocks') },
			bottom: { type: 'borderBottomLeftRadius', label: __('Bottom Left', 'kadence-blocks') },
		},
	};
	const sideOptionsToUse = sideOptions || defaultSideOptions[type];
	const parentType = type;
	const typeMouseOver = mouseOverVisualizer();
	const [isCustom, setIsCustom] = useState(false);
	const [isLinking, setIsLinking] = useState(false);
	const topValue = getDeviceValue(attributeName, attributes, previewDevice, sideOptionsToUse.top.type);
	const rightValue = getDeviceValue(attributeName, attributes, previewDevice, sideOptionsToUse.right.type);
	const bottomValue = getDeviceValue(attributeName, attributes, previewDevice, sideOptionsToUse.bottom.type);
	const leftValue = getDeviceValue(attributeName, attributes, previewDevice, sideOptionsToUse.left.type);
	const controls = type === 'borderRadius' ? getBorderRadiusControls() : getSpacingControls();
	const inheritedTop = getInheritedDeviceValue(
		attributeName,
		attributes,
		previewDevice,
		metaData,
		sideOptionsToUse.top.type,
		globalStylesIds
	);
	const inheritedRight = getInheritedDeviceValue(
		attributeName,
		attributes,
		previewDevice,
		metaData,
		sideOptionsToUse.right.type,
		globalStylesIds
	);
	const inheritedBottom = getInheritedDeviceValue(
		attributeName,
		attributes,
		previewDevice,
		metaData,
		sideOptionsToUse.bottom.type,
		globalStylesIds
	);
	const inheritedLeft = getInheritedDeviceValue(
		attributeName,
		attributes,
		previewDevice,
		metaData,
		sideOptionsToUse.left.type,
		globalStylesIds
	);
	const onReset = () => {
		let resetValue;
		if (defaultValue) {
			resetValue = defaultValue;
		}
		onChange(resetValue, previewDevice === 'Desktop' ? 'all' : previewDevice, type, true);
	};
	// Memoize event handlers
	const onSetAttributes = useCallback(
		(newAttributes) => {
			if (
				newAttributes.padding?.preset &&
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

				newAttributes.padding.desktop = inherited?.inheritedValue
					? { ...inherited?.inheritedValue, ...newAttributes.padding.desktop }
					: newAttributes.padding.desktop;
				newAttributes.padding.tablet = inheritedTablet?.inheritedValue
					? { ...inheritedTablet?.inheritedValue, ...newAttributes.padding.tablet }
					: newAttributes.padding.tablet;
				newAttributes.padding.mobile = inheritedMobile?.inheritedValue;
				delete newAttributes.padding?.preset;
			}
			setAttributes(newAttributes);
		},
		[getInheritedValue, setAttributes, attributes, metaData, globalStylesIds, inheritedTop, inheritedBottom]
	);
	const onChange = (value, device, tempType, reset = false) => {
		if (isLinking || reset) {
			if (device === 'all') {
				setAttributes({ [attributeName]: undefined });
			} else {
				handleMultipleAttributeChange(
					[value, value, value, value],
					device,
					attributeName,
					attributes,
					parentType === 'padding' ? onSetAttributes : setAttributes,
					customOnChange,
					[
						sideOptionsToUse.top.type,
						sideOptionsToUse.left.type,
						sideOptionsToUse.right.type,
						sideOptionsToUse.bottom.type,
					],
					metaData
				);
			}
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
	const containerClasses = clsx(
		'components-base-control kbs-control kbs-space-control',
		className,
		cornerControlType ? 'kbs-space-control-corner' : ''
	);

	// Return the JSX directly, not inside an array
	return (
		<>
			<div
				onMouseOver={typeMouseOver.onMouseOver}
				onMouseOut={typeMouseOver.onMouseOut}
				onFocus={typeMouseOver.onMouseOver}
				onBlur={typeMouseOver.onMouseOut}
				className={containerClasses}
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
									label={sideOptionsToUse.top.label}
									parentLabel={label}
									type={sideOptionsToUse.top.type}
									hasCustomControls={true}
									controls={controls}
									isCustom={isCustom}
									value={topValue}
									inherited={inheritedTop}
									onChange={(itemValue) =>
										onChange(itemValue, previewDevice, sideOptionsToUse.top.type)
									}
								/>
							)}
							{hasLeft && (
								<RadioToggleGroupPopoverInputUI
									label={sideOptionsToUse.left.label}
									type={sideOptionsToUse.left.type}
									parentLabel={label}
									hasCustomControls={true}
									value={leftValue}
									controls={controls}
									isCustom={isCustom}
									inherited={inheritedLeft}
									onChange={(itemValue) =>
										onChange(itemValue, previewDevice, sideOptionsToUse.left.type)
									}
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
									label={sideOptionsToUse.right.label}
									type={sideOptionsToUse.right.type}
									parentLabel={label}
									hasCustomControls={true}
									value={rightValue}
									controls={controls}
									isCustom={isCustom}
									inherited={inheritedRight}
									onChange={(itemValue) =>
										onChange(itemValue, previewDevice, sideOptionsToUse.right.type)
									}
								/>
							)}
							{hasBottom && (
								<RadioToggleGroupPopoverInputUI
									label={sideOptionsToUse.bottom.label}
									type={sideOptionsToUse.bottom.type}
									hasCustomControls={true}
									parentLabel={label}
									isCustom={isCustom}
									controls={controls}
									value={bottomValue}
									inherited={inheritedBottom}
									onChange={(itemValue) =>
										onChange(itemValue, previewDevice, sideOptionsToUse.bottom.type)
									}
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
