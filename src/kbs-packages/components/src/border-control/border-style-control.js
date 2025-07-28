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
	parseBorderStyle,
	getColorOutput,
	BORDER_STYLES_DEFAULTS,
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
	previewDevice = 'Desktop',
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
	defaultValue = '',
	hasHoverControls = false,
	isHover,
	setIsHover,
}) {
	const [isAdvanced, setIsAdvanced] = useState(view === 'advanced');
	const [isHoverState, setIsHoverState] = useState(false);
	const [isHoverToUse, setIsHoverToUse] =
		isHover !== undefined ? [isHover, setIsHover] : [isHoverState, setIsHoverState];

	//Border Style is advanced if any of style, width or color is not the same for all corners.
	const isAdvancedOption = () => {
		const firstColor = getCurrentValueForSideAndType(0, 'color');
		const firstStyle = getCurrentValueForSideAndType(0, 'style');
		const firstWidth = getCurrentValueForSideAndType(0, 'width');

		for (let i = 1; i < sides.length; i++) {
			const currentColor = getCurrentValueForSideAndType(i, 'color');
			const currentStyle = getCurrentValueForSideAndType(i, 'style');
			const currentWidth = getCurrentValueForSideAndType(i, 'width');

			if (currentColor !== firstColor || currentStyle !== firstStyle || currentWidth !== firstWidth) {
				return true;
			}
		}
		return false;
	};

	useEffect(() => {
		if (view !== 'advanced' && getCurrentValueForSideAndType(0, 'width')) {
			setIsAdvanced(isAdvancedOption());
		} else if (view === 'advanced' && !isAdvanced) {
			setIsAdvanced(true);
		} else if (view !== 'advanced' && isAdvanced) {
			setIsAdvanced(false);
		}
	}, [view]);

	const createNewBorderStyleValueForSideAndType = (value, type, sideIndex) => {
		const currentSideValue = getCurrentValueForSide(sideIndex, type);
		const { color, style, width } = parseBorderStyle(currentSideValue);
		if (type === 'color') {
			return createBorderStyleValue(value, style, width);
		} else if (type === 'style') {
			return createBorderStyleValue(color, value, width);
		} else {
			return createBorderStyleValue(color, style, value);
		}
	};

	const createBorderStyleValue = (color, style, width) => {
		if (color || style || width) {
			let colorToUse = getColorOutput(color);
			if (color === '') {
				colorToUse = BORDER_STYLES_DEFAULTS.color.var;
			}
			if (style === '') {
				style = BORDER_STYLES_DEFAULTS.style.var;
			}
			if (width === '') {
				width = BORDER_STYLES_DEFAULTS.width.var;
			}
			return width + ' ' + style + ' ' + colorToUse;
		}
		return '';
	};

	const onChange = (value, device, type, sideIndex = 0) => {
		if (isAdvanced) {
			const borderKey = getKeyForSide(sideIndex);
			const styleValue = createNewBorderStyleValueForSideAndType(value, type, sideIndex);
			handleAttributeChange(
				styleValue,
				device,
				attributeName,
				attributes,
				setAttributes,
				undefined,
				borderKey,
				meta
			);
		} else {
			const styleValue = createNewBorderStyleValueForSideAndType(value, type, 0);

			handleMultipleAttributeChange(
				[styleValue, styleValue, styleValue, styleValue],
				device,
				attributeName,
				attributes,
				setAttributes,
				undefined,
				getKeysForAllSides(),
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
		handleMultipleAttributeChange(
			[defaultValue, defaultValue, defaultValue, defaultValue],
			previewDevice,
			attributeName,
			attributes,
			setAttributes,
			undefined,
			getKeysForAllSides(),
			meta
		);
	};

	const sides = [
		{
			index: 0,
			label: __('Top', 'kadence-blocks'),
			key: 'Top',
		},
		{
			index: 1,
			label: __('Left', 'kadence-blocks'),
			key: 'Left',
		},
		{
			index: 2,
			label: __('Right', 'kadence-blocks'),
			key: 'Right',
		},
		{
			index: 3,
			label: __('Bottom', 'kadence-blocks'),
			key: 'Bottom',
		},
	];

	const getKeyForSide = (sideIndex) => {
		const stateSuffix = isHoverToUse ? 'Hover' : '';
		return 'border' + sides[sideIndex].key + stateSuffix;
	};

	const getCurrentValueForSide = (sideIndex) => {
		const borderKey = getKeyForSide(sideIndex);
		return getDeviceValue(attributeName, attributes, previewDevice, borderKey) || '';
	};

	const getInheritedValueForSide = (sideIndex) => {
		const borderKey = getKeyForSide(sideIndex);
		return getInheritedDeviceValue(attributeName, attributes, previewDevice, borderKey) || '';
	};

	const getCurrentValueForSideAndType = (sideIndex, type) => {
		const currentSideValue = getCurrentValueForSide(sideIndex);
		const { color, style, width } = parseBorderStyle(currentSideValue);
		if (type === 'color') {
			return color;
		} else if (type === 'style') {
			return style;
		} else {
			return width;
		}
	};

	const getInheritedValueForSideAndType = (sideIndex, type) => {
		const currentSideValue = getInheritedValueForSide(sideIndex);
		const { color, style, width } = parseBorderStyle(currentSideValue);
		if (type === 'color') {
			return color;
		} else if (type === 'style') {
			return style;
		} else {
			return width;
		}
	};

	const getKeysForAllSides = () => {
		return sides.map((side) => getKeyForSide(side.index));
	};

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
				hasHoverControls={hasHoverControls}
				onToggleHover={() => setIsHoverToUse(!isHoverToUse)}
				isHover={isHoverToUse}
			/>
			<div className={'kbs-border-style-control-container ' + (isAdvanced ? 'is-advanced' : '')}>
				{isAdvanced && (
					<>
						{sides.map((side) => (
							<SingleBorderStyleControl
								key={side.key + '-' + side.index}
								attributes={attributes}
								setAttributes={setAttributes}
								attributeName={attributeName}
								meta={meta}
								previewDevice={previewDevice}
								currentColor={getCurrentValueForSideAndType(side.index, 'color')}
								currentStyle={getCurrentValueForSideAndType(side.index, 'style')}
								currentWidth={getCurrentValueForSideAndType(side.index, 'width')}
								inheritedColor={getInheritedValueForSideAndType(side.index, 'color')}
								inheritedStyle={getInheritedValueForSideAndType(side.index, 'style')}
								inheritedWidth={getInheritedValueForSideAndType(side.index, 'width')}
								onChangeColor={(color) => onChangeColor(color, side.index)}
								onChangeStyle={(style) => onChangeStyle(style, side.index)}
								onChangeWidth={(width) => onChangeWidth(width, side.index)}
								styles={styles}
								min={min}
								max={max}
								step={step}
							/>
						))}
						<div
							className="kbs-border-style-control-preview"
							style={{
								borderTop: getCurrentValueForSide(0),
								borderLeft: getCurrentValueForSide(1),
								borderRight: getCurrentValueForSide(2),
								borderBottom: getCurrentValueForSide(3),
							}}
						></div>
					</>
				)}
				{!isAdvanced && (
					<SingleBorderStyleControl
						attributes={attributes}
						setAttributes={setAttributes}
						attributeName={attributeName}
						meta={meta}
						previewDevice={previewDevice}
						currentColor={getCurrentValueForSideAndType(0, 'color')}
						currentStyle={getCurrentValueForSideAndType(0, 'style')}
						currentWidth={getCurrentValueForSideAndType(0, 'width')}
						inheritedColor={getInheritedValueForSideAndType(0, 'color')}
						inheritedStyle={getInheritedValueForSideAndType(0, 'style')}
						inheritedWidth={getInheritedValueForSideAndType(0, 'width')}
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
		</div>
	);
}
