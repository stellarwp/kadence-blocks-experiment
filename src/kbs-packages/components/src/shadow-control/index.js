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
	handleAttributeChange,
	getLayerDeviceValue,
	getGradientOptions,
	SHADOW_STYLES_DEFAULTS,
	TEXT_SHADOW_STYLES_DEFAULTS,
	parseShadowStyle,
	getResolvedValue,
} from '@kadence/kbsHelpers';
import { getColorLabel } from '../color-control/utils';
import ShadowDropdownContent from './shadow-dropdown-content';

function ShadowIndicator({ value, className, colorValue }) {
	const style = {
		background: colorValue,
	};
	return (
		<div
			className={clsx('kbs-shadow-indicator component-color-indicator', value ? 'has-value' : '', className)}
			style={style}
		></div>
	);
}

function renderShadowToggle(layer, isInherited, previewDevice, type) {
	const isEmptyLayer = Object.keys(layer).length === 0;
	const hasShadowString = layer?.shadowString && layer.shadowString.trim() !== '';

	return ({ onToggle, isOpen }) => {
		const { color } = useMemo(() => {
			// If we have a shadow string, extract color from it
			if (hasShadowString) {
				// Parse the shadow string to get the color
				const shadowParts = parseShadowStyle(layer.shadowString, type);
				return {
					color: shadowParts.color || '',
				};
			}

			// Otherwise, use the original logic
			let color = getLayerDeviceValue('color', layer, previewDevice);
			color = isEmptyLayer
				? ''
				: color
					? color
					: type == 'boxShadow'
						? SHADOW_STYLES_DEFAULTS.color.value
						: TEXT_SHADOW_STYLES_DEFAULTS.color.value;
			return {
				color,
			};
		}, [layer, previewDevice, hasShadowString]);

		const displayValue = isEmptyLayer && !hasShadowString ? '' : type == 'boxShadow' ? 'Box Shadow' : 'Text Shadow';
		const previewString = useMemo(() => {
			return getColorOutput(color);
		}, [color]);
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
						<Icon className="kbs-shadow-select-control__toggle-icon" icon={shadowIcon} size={24} />
					)}
					<span className="kbs-shadow-select-control__toggle-label">
						{displayValue ? displayValue : __('Unset', 'kadence-blocks')}
					</span>
					<ShadowIndicator
						className="kbs-shadow-select-control__toggle-preview"
						value={previewString}
						colorValue={getColorOutput(color)}
					/>
				</Button>
			</>
		);
	};
}

function renderShadowDropdown(
	colors,
	layer,
	isInherited,
	onChange,
	previewDevice,
	globalClasses,
	containerRef,
	globalStylesCss,
	type = 'boxShadow'
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
				containerRef={containerRef}
				isHover={isHover}
				setIsHover={setIsHover}
				onToggle={onToggle}
				isOpen={isOpen}
				type={type}
				isSingular={true}
			/>
		);
	};
}

export default function ShadowControl({
	attributes,
	setAttributes,
	attributeName,
	meta,
	globalStylesIds,
	reset = true,
	label,
	hasDeviceControls = false,
	isAdvanced = false,
	advancedControls = [],
	isCustom = false,
	hasCustomControls = false,
	previewDevice = 'Desktop',
	defaultValue = undefined,
	globalStylesCss,
	customOnChange = undefined,
	isInherited = false,
	inherited = {},
	type = 'boxShadow',
}) {
	const popoverProps = {
		placement: 'left',
		shift: true,
	};

	const containerRef = useRef(undefined);
	const [customColors] = useSettings('color.custom');
	const globalColors = getColorOptions();
	const gradients = getGradientOptions();
	const isDisableCustomColors = !customColors ? true : false;

	// Get the single layer from attributes
	const resolvedValue = getResolvedValue(attributeName, attributes, previewDevice, meta, type, globalStylesIds);
	const layer = resolvedValue?.appliedValue;

	const onChange = (value, device, type) => {
		handleAttributeChange(value, device, attributeName, attributes, setAttributes, customOnChange, type, meta);
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
		<div className="kbs-shadow-layers-wrapper single-shadow-control">
			<div className="kbs-shadow-layer-wrapper">
				<div ref={containerRef} className={`kbs-shadow-layer-control`}>
					<Dropdown
						popoverProps={popoverProps}
						className="kbs-shadow-layer-control__dropdown"
						contentClassName={classes}
						renderToggle={renderShadowToggle(layer, isInherited, previewDevice, type)}
						renderContent={renderShadowDropdown(
							globalColors,
							layer,
							isInherited,
							onChange,
							previewDevice,
							globalClasses,
							containerRef,
							globalStylesCss,
							type
						)}
					/>
				</div>
			</div>
		</div>
	);
}
