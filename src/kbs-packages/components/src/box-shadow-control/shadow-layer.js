/**
 * External dependencies
 */
import clsx from 'clsx';
/**
 * WordPress dependencies
 */
import { Icon, Dropdown, Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useRef, useMemo, useState } from '@wordpress/element';
import { shadow as shadowIcon } from '@wordpress/icons';
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
import { getColorLabel } from '../color-control/utils';
import ShadowDropdownContent from './shadow-dropdown-content';

function ShadowIndicator({ value, type, colorValue, maskType }) {
	const style = {
		background: type !== 'color' ? colorValue : value,
	};
	return (
		<div
			className={clsx('kbs-shadow-indicator component-color-indicator', value ? 'has-value' : '')}
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
			className: clsx('kbs-shadow-select-button', 'kbs-shadow-select-control__toggle-button', {
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
						<Icon className="kbs-shadow-select-control__toggle-icon" icon={typeIcon} size={24} />
					)}
					<span className="kbs-shadow-select-control__toggle-label">
						{displayValue ? displayValue : __('Unset', 'kadence-blocks')}
					</span>
					<ShadowIndicator
						className="kbs-shadow-select-control__toggle-preview"
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
			<ShadowDropdownContent
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
	const classes = clsx('kbs-shadow-layer-control__dropdown-content', globalClasses);

	return (
		<div ref={containerRef} className={`kbs-shadow-layer-control`}>
			<Dropdown
				popoverProps={popoverProps}
				className="kbs-shadow-layer-control__dropdown"
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
