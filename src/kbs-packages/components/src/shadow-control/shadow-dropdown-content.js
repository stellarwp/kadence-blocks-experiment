/**
 * WordPress dependencies
 */
import { Icon, Button } from '@wordpress/components';
import { close as closeIcon } from '@wordpress/icons';
import { useRef, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import {
	getLayerDeviceValue,
	SHADOW_STYLES_DEFAULTS,
	TEXT_SHADOW_STYLES_DEFAULTS,
	parseShadowStyle,
	createShadowStyleString,
} from '@kadence/kbsHelpers';
import ColorControl from '../color-control';
import UnitControl from '../unit-control';
import RadioButtonControl from '../radio-button-control';
import ShadowPreview from '../shadow-preview';

function ShadowDropdownContent({
	layer,
	onChange,
	previewDevice,
	globalStylesCss,
	onToggle,
	type = 'boxShadow',
	isSingular = false,
}) {
	// Initialize variables
	let color, x, y, blur, spread, inset;
	let handleCustomOnChange;
	const shadowDefaults = type == 'boxShadow' ? SHADOW_STYLES_DEFAULTS : TEXT_SHADOW_STYLES_DEFAULTS;

	// If isSingular is true, we need to handle shadow string generation and parsing
	if (isSingular) {
		// Get the current shadow string value from the layer
		const currentShadowString = layer || '';

		// Parse the shadow string into component parts
		const shadowParts = parseShadowStyle(currentShadowString, type);

		// Extract individual values for the controls
		color = shadowParts.color;
		x = shadowParts.x;
		y = shadowParts.y;
		blur = shadowParts.blur;
		spread = shadowParts.spread;
		inset = shadowParts.inset;

		handleCustomOnChange = (value, device, param) => {
			// Update the specific part in the shadow parts
			const updatedParts = { ...shadowParts };
			updatedParts[param] = value;

			// Generate the new shadow string
			const newShadowString = createShadowStyleString(updatedParts, type);

			// Pass the shadow string to the onChange handler
			onChange(newShadowString, device, type);
		};
	} else {
		// Original behavior for non-singular shadows
		color = getLayerDeviceValue('color', layer, previewDevice);
		x = getLayerDeviceValue('x', layer, previewDevice);
		y = getLayerDeviceValue('y', layer, previewDevice);
		blur = getLayerDeviceValue('blur', layer, previewDevice);
		spread = getLayerDeviceValue('spread', layer, previewDevice);
		inset = getLayerDeviceValue('inset', layer, previewDevice);

		handleCustomOnChange = (value, device, param) => {
			onChange(value, device, param);
		};
	}

	// Use default values if not set
	color = color ? color : shadowDefaults.color.value;
	x = x ? x : shadowDefaults.x.value;
	y = y ? y : shadowDefaults.y.value;
	blur = blur ? blur : shadowDefaults.blur.value;
	spread = spread ? spread : shadowDefaults.spread.value;

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
		<div ref={divRef} className={'kbs-shadow-layer-control__dropdown-content-inner kbs-color-control'}>
			<ShadowPreview
				color={color}
				x={x}
				y={y}
				blur={blur}
				spread={spread}
				inset={inset}
				type={type}
				shadowString={isSingular ? layer : undefined}
				isSingular={isSingular}
			/>
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
			{type == 'boxShadow' && (
				<RadioButtonControl
					// attributes={attributes}
					// setAttributes={setAttributes}
					// attributeName={attributeName}
					// meta={meta}
					type="inset"
					previewDevice={previewDevice}
					onChange={(value) => handleCustomOnChange(value, previewDevice, 'inset')}
					value={inset}
					reset={false}
					// inherited={isInherited ? { inheritedValue: inset } : ''}
				/>
			)}
			<div className="kbs-shadow-layer-control__dropdown-content-units-container">
				<UnitControl
					label={__('X Position', 'kadence-blocks')}
					value={x}
					// inheritedValue={inheritedWidth}
					// meta={meta}
					onChange={(size) => handleCustomOnChange(size, previewDevice, 'x')}
					placeholder={'0'}
					previewDevice={previewDevice}
					min={-100}
					max={100}
				/>
				<UnitControl
					label={__('Y Position', 'kadence-blocks')}
					value={y}
					onChange={(size) => handleCustomOnChange(size, previewDevice, 'y')}
					placeholder={'0'}
					previewDevice={previewDevice}
					min={-100}
					max={100}
				/>
				<UnitControl
					label={__('Blur', 'kadence-blocks')}
					value={blur}
					onChange={(size) => handleCustomOnChange(size, previewDevice, 'blur')}
					placeholder={'0'}
					previewDevice={previewDevice}
				/>
				{type == 'boxShadow' && (
					<UnitControl
						label={__('Spread', 'kadence-blocks')}
						value={spread}
						onChange={(size) => handleCustomOnChange(size, previewDevice, 'spread')}
						placeholder={'0'}
						previewDevice={previewDevice}
					/>
				)}
			</div>
			<div className="kbs-shadow-layer-control__dropdown-content-close">
				<Button __next40pxDefaultSize onClick={onToggle}>
					<Icon icon={closeIcon} size={24} />
				</Button>
			</div>
		</div>
	);
}

export default ShadowDropdownContent;
