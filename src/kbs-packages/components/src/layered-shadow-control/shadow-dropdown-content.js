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
import { getLayerDeviceValue, SHADOW_STYLES_DEFAULTS, TEXT_SHADOW_STYLES_DEFAULTS } from '@kadence/kbsHelpers';
import ColorControl from '../color-control';
import UnitControl from '../unit-control';
import RadioButtonControl from '../radio-button-control';
import ShadowPreview from '../shadow-preview';

function ShadowDropdownContent({ layer, onChange, previewDevice, globalStylesCss, onToggle, type = 'boxShadow' }) {
	const handleCustomOnChange = (value, device, type) => {
		onChange(value, device, type);
	};
	let color = getLayerDeviceValue('color', layer, previewDevice);
	let x = getLayerDeviceValue('x', layer, previewDevice);
	let y = getLayerDeviceValue('y', layer, previewDevice);
	let blur = getLayerDeviceValue('blur', layer, previewDevice);
	let spread = getLayerDeviceValue('spread', layer, previewDevice);
	let inset = getLayerDeviceValue('inset', layer, previewDevice);

	const shadowDefaults = type == 'boxShadow' ? SHADOW_STYLES_DEFAULTS : TEXT_SHADOW_STYLES_DEFAULTS;

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
			<ShadowPreview color={color} x={x} y={y} blur={blur} spread={spread} inset={inset} type={type} />
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
