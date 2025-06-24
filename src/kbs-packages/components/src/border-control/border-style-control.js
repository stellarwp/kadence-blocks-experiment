/**
 * Border Style Control Component
 * This component is used to control the border style, width and color properties.
 */
import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import {
	getDeviceValue,
	getInheritedDeviceValue,
	handleAttributeChange,
	handleMultipleAttributeChange,
} from '@kadence/kbsHelpers';
import TitleBar from '../title-bar';
import SingleBorderStyleControl from './single-border-style-control';
import './editor.scss';

export default function BorderStyleControl({
	label,
	attributes,
	setAttributes,
	attributeName,
	meta,
	previewDevice = 'desktop',
	hasCustomControls = true,
	hasAdvancedControls = true,
	styles,
	max,
	min,
	step,
	view = 'default',
	reset = true,
	hasDeviceControls = false,
	globalStylesIds,
}) {
	const [isAdvanced, setIsAdvanced] = useState(view === 'advanced');

	//Border Style is advanced if any of style, width or color is not the same for all corners.
	const isAdvancedOption = (color, style, width) => {
		if (Array.isArray(color) && color.length > 0) {
			const firstItem = color[0];
			if (!color.every((item) => item === firstItem)) {
				return true;
			}
		}
		if (Array.isArray(style) && style.length > 0) {
			const firstItem = style[0];
			if (!style.every((item) => item === firstItem)) {
				return true;
			}
		}
		if (Array.isArray(width) && width.length > 0) {
			const firstItem = width[0];
			if (!width.every((item) => item === firstItem)) {
				return true;
			}
		}
		return false;
	};

	// Extract individual border properties
	const currentWidth = getDeviceValue(attributeName, attributes, previewDevice, 'width') || ['', '', '', ''];
	const currentStyle = getDeviceValue(attributeName, attributes, previewDevice, 'style') || ['', '', '', ''];
	const currentColor = getDeviceValue(attributeName, attributes, previewDevice, 'color') || ['', '', '', ''];
	const inheritedWidth = getInheritedDeviceValue(
		attributeName,
		attributes,
		previewDevice,
		meta,
		'width',
		globalStylesIds
	);
	const inheritedStyle = getInheritedDeviceValue(
		attributeName,
		attributes,
		previewDevice,
		meta,
		'style',
		globalStylesIds
	);
	const inheritedColor = getInheritedDeviceValue(
		attributeName,
		attributes,
		previewDevice,
		meta,
		'color',
		globalStylesIds
	);

	useEffect(() => {
		if (view !== 'advanced' && currentWidth) {
			setIsAdvanced(isAdvancedOption(currentColor, currentStyle, currentWidth));
		} else if (view === 'advanced' && !isAdvanced) {
			setIsAdvanced(true);
		} else if (view !== 'advanced' && isAdvanced) {
			setIsAdvanced(false);
		}
	}, [view]);

	const onChange = (value, device, type, sideIndex = 0) => {
		let updatedValue = [value, value, value, value];

		if (isAdvanced && sideIndex) {
			let currentValue = currentColor;
			if (type === 'style') {
				currentValue = currentStyle;
			} else if (type === 'width') {
				currentValue = currentWidth;
			}
			switch (sideIndex) {
				case 0:
					updatedValue = [value, currentValue[1], currentValue[2], currentValue[3]];
					break;
				case 1:
					updatedValue = [currentValue[0], value, currentValue[2], currentValue[3]];
					break;
				case 2:
					updatedValue = [currentValue[0], currentValue[1], value, currentValue[3]];
					break;
				case 3:
					updatedValue = [currentValue[0], currentValue[1], currentValue[2], value];
					break;
			}
			handleAttributeChange(
				updatedValue,
				device,
				attributeName,
				attributes,
				setAttributes,
				undefined,
				type,
				meta
			);
		} else {
			//If not advanced, set all the values (except the updated value) to the current value for the first side
			//this ensures any advanced values are reset after a non-advanced change.
			let newColorValue = [currentColor[0], currentColor[0], currentColor[0], currentColor[0]];
			let newStyleValue = [currentStyle[0], currentStyle[0], currentStyle[0], currentStyle[0]];
			let newWidthValue = [currentWidth[0], currentWidth[0], currentWidth[0], currentWidth[0]];

			switch (type) {
				case 'color':
					newColorValue = updatedValue;
					break;
				case 'style':
					newStyleValue = updatedValue;
					break;
				case 'width':
					newWidthValue = updatedValue;
					break;
			}
			handleMultipleAttributeChange(
				[newColorValue, newStyleValue, newWidthValue],
				device,
				attributeName,
				attributes,
				setAttributes,
				undefined,
				['color', 'style', 'width'],
				meta
			);
		}
	};

	const onChangeColor = (color, sideIndex = 0) => {
		onChange(color, previewDevice, 'color', sideIndex);
	};

	const onChangeStyle = (style, sideIndex = 0) => {
		onChange(style, previewDevice, 'style', sideIndex);
	};

	const onChangeWidth = (width, sideIndex = 0) => {
		onChange(width, previewDevice, 'width', sideIndex);
	};

	const onReset = () => {
		let resetValue = undefined;
		if (defaultValue) {
			resetValue = defaultValue;
		}
		onChange(resetValue, previewDevice === 'desktop' ? 'all' : previewDevice, 'border');
	};

	const sides = [
		{
			index: 0,
			label: __('Top', 'kadence-blocks'),
			valueColor: currentColor[0],
			valueStyle: currentStyle[0],
			valueWidth: currentWidth[0],
			inheritedColor: inheritedColor[0],
			inheritedStyle: inheritedStyle[0],
			inheritedWidth: inheritedWidth[0],
		},
		{
			index: 1,
			label: __('Left', 'kadence-blocks'),
			valueColor: currentColor[1],
			valueStyle: currentStyle[1],
			valueWidth: currentWidth[1],
			inheritedColor: inheritedColor[1],
			inheritedStyle: inheritedStyle[1],
			inheritedWidth: inheritedWidth[1],
		},
		{
			index: 2,
			label: __('Right', 'kadence-blocks'),
			valueColor: currentColor[2],
			valueStyle: currentStyle[2],
			valueWidth: currentWidth[2],
			inheritedColor: inheritedColor[2],
			inheritedStyle: inheritedStyle[2],
			inheritedWidth: inheritedWidth[2],
		},
		{
			index: 3,
			label: __('Bottom', 'kadence-blocks'),
			valueColor: currentColor[3],
			valueStyle: currentStyle[3],
			valueWidth: currentWidth[3],
			inheritedColor: inheritedColor[3],
			inheritedStyle: inheritedStyle[3],
			inheritedWidth: inheritedWidth[3],
		},
	];

	return (
		<div className="components-base-control kbs-border-style-control">
			<TitleBar
				label={label}
				reset={reset}
				onReset={onReset}
				hasDeviceControls={hasDeviceControls}
				isAdvanced={isAdvanced}
				onToggleView={() => setIsAdvanced(!isAdvanced)}
				hasAdvancedControls={hasAdvancedControls}
				hasCustomControls={hasCustomControls}
			/>
			{isAdvanced && (
				<>
					{sides.map((side) => (
						<SingleBorderStyleControl
							key={side.label + '-' + side.index}
							attributes={attributes}
							setAttributes={setAttributes}
							attributeName={attributeName}
							meta={meta}
							previewDevice={previewDevice}
							currentColor={side.valueColor}
							currentStyle={side.valueStyle}
							currentWidth={side.valueWidth}
							inheritedColor={side.inheritedColor}
							inheritedStyle={side.inheritedStyle}
							inheritedWidth={side.inheritedWidth}
							onChangeColor={(color) => onChangeColor(color, side.index)}
							onChangeStyle={(style) => onChangeStyle(style, side.index)}
							onChangeWidth={(width) => onChangeWidth(width, side.index)}
							styles={styles}
							min={min}
							max={max}
							step={step}
						/>
					))}
				</>
			)}
			{!isAdvanced && (
				<SingleBorderStyleControl
					attributes={attributes}
					setAttributes={setAttributes}
					attributeName={attributeName}
					meta={meta}
					previewDevice={previewDevice}
					currentColor={currentColor[0]}
					currentStyle={currentStyle[0]}
					currentWidth={currentWidth[0]}
					inheritedColor={inheritedColor[0]}
					inheritedStyle={inheritedStyle[0]}
					inheritedWidth={inheritedWidth[0]}
					onChangeColor={onChangeColor}
					onChangeStyle={onChangeStyle}
					onChangeWidth={onChangeWidth}
					styles={styles}
					min={min}
					max={max}
					step={step}
				/>
			)}
		</div>
	);
}
