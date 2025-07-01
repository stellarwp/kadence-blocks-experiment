/**
 * External dependencies
 */
import clsx from 'clsx';
/**
 * WordPress dependencies
 */
import { Icon, Dropdown, Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useRef, useMemo, useEffect, useState } from '@wordpress/element';
import { close as closeIcon, shadow as shadowIcon } from '@wordpress/icons';
import { useSettings } from '@wordpress/block-editor';
/**
 * Internal dependencies
 */
import {
	getColorOutput,
	getColorOptions,
	handleLayerAttributeChange,
	getLayerDeviceValue,
	getGradientOptions,
	SHADOW_STYLES_DEFAULTS,
} from '@kadence/kbsHelpers';
import ColorSelector from '../color-control/color-selector';
import ColorControl from '../color-control';
import { getColorLabel } from '../color-control/utils';
import UnitControl from '../unit-control';
import RadioButtonControl from '../radio-button-control';

function ShadowIndicator({ value, type, colorValue, maskType }) {
	const style = {
		background: type !== 'color' ? colorValue : value,
	};
	return (
		<div
			className={clsx('kbs-background-indicator component-color-indicator', value ? 'has-value' : '')}
			style={style}
		></div>
	);
}
function renderShadowToggle(layer, isInherited, previewDevice) {
	return ({ onToggle, isOpen }) => {
		const { color, type } = useMemo(() => {
			let color = getLayerDeviceValue('color', layer, previewDevice);
			color = color ? color : SHADOW_STYLES_DEFAULTS.color.value;
			return {
				color: color,
				type: getLayerDeviceValue('type', layer, previewDevice) || 'color',
			};
		}, [layer, previewDevice]);
		const displayValue = useMemo(() => {
			// switch (type) {
			// 	case 'color':
			// 		return getColorLabel(color, colors);
			// 	default:
			// 		return '';
			// }
			return 'Box Shadow';
		}, [type, color]);
		const previewString = useMemo(() => {
			switch (type) {
				case 'color':
					return getColorOutput(color);
				default:
					return '';
			}
		}, [type, color]);
		const typeIcon = useMemo(() => {
			switch (type) {
				default:
					return shadowIcon;
			}
		}, [type]);
		const toggleProps = {
			onClick: onToggle,
			className: clsx('kbs-background-select-button', 'kbs-background-select-control__toggle-button', {
				'is-open': isOpen,
				'is-inherited': isInherited,
				'is-selected': !isInherited && displayValue,
			}),
			'aria-expanded': isOpen,
		};
		return (
			<>
				<Button __next40pxDefaultSize {...toggleProps}>
					{displayValue && (
						<Icon className="kbs-background-select-control__toggle-icon" icon={typeIcon} size={24} />
					)}
					<span className="kbs-background-select-control__toggle-label">
						{displayValue ? displayValue : __('Unset', 'kadence-blocks')}
					</span>
					<ShadowIndicator
						className="kbs-background-select-control__toggle-preview"
						value={previewString}
						type={type}
						colorValue={getColorOutput(color)}
					/>
				</Button>
			</>
		);
	};
}
/**
 * Get the inherited value for a device, following the inheritance chain
 *
 * @param {string} layerAttribute - The attribute name (e.g., 'typography')
 * @param {object} layer - The layer object
 * @param {string} device - The current device (e.g., 'desktop', 'tablet', 'mobile')
 * @returns {object} - An object containing the value and its source
 */

function BoxShadowDropdownContent({
	colors,
	layer,
	isInherited,
	onChange,
	previewDevice,
	globalClasses,
	globalStylesCss,
	layerKey,
	containerRef,
	isHover,
	setIsHover,
	onToggle,
	isOpen,
}) {
	const handleCustomOnChange = (value, device, type) => {
		onChange(value, device, type);
	};
	let color = getLayerDeviceValue('color', layer, previewDevice);
	let x = getLayerDeviceValue('x', layer, previewDevice);
	let y = getLayerDeviceValue('y', layer, previewDevice);
	let blur = getLayerDeviceValue('blur', layer, previewDevice);
	let spread = getLayerDeviceValue('spread', layer, previewDevice);
	let inset = getLayerDeviceValue('inset', layer, previewDevice);

	color = color ? color : SHADOW_STYLES_DEFAULTS.color.value;
	x = x ? x : SHADOW_STYLES_DEFAULTS.x.value;
	y = y ? y : SHADOW_STYLES_DEFAULTS.y.value;
	blur = blur ? blur : SHADOW_STYLES_DEFAULTS.blur.value;
	spread = spread ? spread : SHADOW_STYLES_DEFAULTS.spread.value;

	// const hoverColor = getLayerDeviceValue('hoverColor', layer, previewDevice);
	const divRef = useRef(null);
	useEffect(() => {
		if (divRef.current) {
			if (globalStylesCss) {
				divRef.current.setAttribute('style', globalStylesCss);
			} else {
				divRef.current.removeAttribute('style');
			}
		}
	}, [globalStylesCss, divRef?.current]);
	return (
		<div ref={divRef} className={'kbs-background-layer-control__dropdown-content-inner kbs-color-control'}>
			{/* <ColorSelector
				handleColorChange={(value) => {
					if (isHover) {
						handleCustomOnChange(value, previewDevice, 'hoverColor');
					} else {
						handleCustomOnChange(value, previewDevice, 'color');
					}
				}}
				colors={colors}
				currentValue={isHover ? hoverColor : color}
				inherited={isHover ? { inheritedValue: color } : ''}
				hasMix={true}
				globalClasses={globalClasses}
				isHover={isHover}
				onToggleHover={() => setIsHover(!isHover)}
				hasHoverControls={true}
				globalStylesCss={globalStylesCss}
			/> */}
			{/* <ColorControl
				label={__('Color', 'kadence-blocks')}
				attributeName="color"
				layer={layer}
				previewDevice={previewDevice}
				onChange={handleCustomOnChange}
				hasMix={true}
			/> */}
			<ColorControl
				// attributes={attributes}
				// setAttributes={setAttributes}
				// attributeName={attributeName}
				// meta={meta}
				previewDevice={previewDevice}
				label=""
				reset={false}
				customOnChange={(value) => handleCustomOnChange(value, previewDevice, 'color')}
				hasTitleBar={false}
				currentValue={color}
			/>
			<RadioButtonControl
				// attributes={attributes}
				// setAttributes={setAttributes}
				// attributeName={attributeName}
				// meta={meta}
				type="inset"
				previewDevice={previewDevice}
				onChange={(value) => handleCustomOnChange(value, previewDevice, 'inset')}
				value={inset}
				// inherited={isInherited ? { inheritedValue: inset } : ''}
			/>
			<UnitControl
				value={x}
				// inheritedValue={inheritedWidth}
				// meta={meta}
				onChange={(size) => handleCustomOnChange(size, previewDevice, 'x')}
				placeholder={'0'}
				previewDevice={previewDevice}
			/>
			<UnitControl
				value={y}
				onChange={(size) => handleCustomOnChange(size, previewDevice, 'y')}
				placeholder={'0'}
				previewDevice={previewDevice}
			/>
			<UnitControl
				value={blur}
				onChange={(size) => handleCustomOnChange(size, previewDevice, 'blur')}
				placeholder={'0'}
				previewDevice={previewDevice}
			/>
			<UnitControl
				value={spread}
				onChange={(size) => handleCustomOnChange(size, previewDevice, 'spread')}
				placeholder={'0'}
				previewDevice={previewDevice}
			/>
			<div className="kbs-background-layer-control__dropdown-content-close">
				<Button __next40pxDefaultSize onClick={onToggle}>
					<Icon icon={closeIcon} size={24} />
				</Button>
			</div>
		</div>
	);
}

function renderShadowDropdown(
	colors,
	layer,
	isInherited,
	onChange,
	previewDevice,
	globalClasses,
	layerKey,
	containerRef,
	globalStylesCss
) {
	const [isHover, setIsHover] = useState(false);
	return ({ onToggle, isOpen }) => {
		return (
			<BoxShadowDropdownContent
				colors={colors}
				layer={layer}
				isInherited={isInherited}
				onChange={onChange}
				previewDevice={previewDevice}
				globalClasses={globalClasses}
				globalStylesCss={globalStylesCss}
				layerKey={layerKey}
				containerRef={containerRef}
				isHover={isHover}
				setIsHover={setIsHover}
				onToggle={onToggle}
				isOpen={isOpen}
			/>
		);
	};
}

export default function ShadowLayer({
	layerKey,
	attributes,
	setAttributes,
	attributeName,
	meta,
	type,
	globalStylesIds,
	reset = true,
	label,
	hasDeviceControls = false,
	isAdvanced = false,
	advancedControls = [],
	isCustom = false,
	hasCustomControls = false,
	previewDevice = 'desktop',
	defaultValue = undefined,
	globalStylesCss,
	customOnChange = undefined,
	layer,
	isInherited = false,
	inherited = {},
}) {
	const popoverProps = {
		//placement: 'left-start',
		placement: 'left',
		//offset: 36,
		shift: true,
		// style: {
		// 	marginTop: '-72px',
		// },
	};
	const containerRef = useRef(undefined);
	const [customColors] = useSettings('color.custom');
	const globalColors = getColorOptions();
	const gradients = getGradientOptions();
	const isDisableCustomColors = !customColors ? true : false;
	const onChange = (value, device, type) => {
		let useAttributes = attributes;
		if (isInherited) {
			if (inherited?.inheritedValue) {
				if (!useAttributes?.[attributeName]) {
					useAttributes[attributeName] = {};
				}
				if (!useAttributes?.[attributeName]?.layers) {
					useAttributes[attributeName].layers = [];
				}
				useAttributes[attributeName].layers = JSON.parse(JSON.stringify(inherited.inheritedValue));
			}
		}
		handleLayerAttributeChange(
			value,
			device,
			attributeName,
			useAttributes,
			setAttributes,
			customOnChange,
			type,
			meta,
			layerKey
		);
	};
	const globalClasses = useMemo(() => {
		return Object.keys(
			(globalStylesIds || []).reduce((acc, styleId) => {
				acc[`kbs-global-style-${styleId}`] = true;
				return acc;
			}, {})
		);
	}, [globalStylesIds]);
	const classes = clsx('kbs-background-layer-control__dropdown-content', globalClasses);

	return (
		<div ref={containerRef} className={`kbs-background-layer-control`}>
			<Dropdown
				popoverProps={popoverProps}
				className="kbs-background-layer-control__dropdown"
				contentClassName={classes}
				renderToggle={renderShadowToggle(layer, isInherited, previewDevice)}
				renderContent={renderShadowDropdown(
					globalColors,
					layer,
					isInherited,
					onChange,
					previewDevice,
					globalClasses,
					layerKey,
					containerRef,
					globalStylesCss
				)}
			/>
		</div>
	);
}
