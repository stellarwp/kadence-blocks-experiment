/**
 * WordPress dependencies
 */
import { Icon, Button } from '@wordpress/components';
import { close as closeIcon } from '@wordpress/icons';
import { useRef, useEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { getLayerDeviceValue, SHADOW_STYLES_DEFAULTS } from '@kadence/kbsHelpers';
import ColorControl from '../color-control';
import UnitControl from '../unit-control';
import RadioButtonControl from '../radio-button-control';

function ShadowDropdownContent({ layer, onChange, previewDevice, globalStylesCss, onToggle }) {
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

export default ShadowDropdownContent;
