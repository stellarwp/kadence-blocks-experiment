import clsx from 'clsx';
import { __ } from '@wordpress/i18n';
import { __experimentalUnitControl as UnitControl, RangeControl, Flex, FlexItem } from '@wordpress/components';
import { useMemo } from '@wordpress/element';
/**
 * Internal dependencies
 */
import { getColorOutput } from '@kadence/kbsHelpers';
import ColorSelect from './color-select';
import RadioButtonSelect from '../radio-button-control/radio-button-select';
import { getColorLabel } from './utils';

const getColorOKLchValues = (value) => {
	if (!value) {
		return ['', '', '', '', ''];
	}
	if (value.startsWith('oklch')) {
		// Parse oklch string like: oklch(from var(--kbs-colors-palette1) calc(l * 1.0) calc(c * 1.0) calc(h + 30) / 100%)
		// The lightness and chroma use multiplication, hue uses addition
		const regex = /oklch\(\s*from\s+(?<color>var\(--[a-zA-Z0-9-]+\)|#[0-9a-fA-F]{6})\s+calc\(l\s*\*\s*(?<l_op>\d*\.?\d+)\)\s+calc\(c\s*\*\s*(?<c_op>\d*\.?\d+)\)\s+calc\(h\s*\+\s*(?<h_op>[-+]?\s*\d+)\)\s*\/\s*(?<alpha>\d+)%\)/;
		
		const match = value.match(regex);
		
		if (match) {
			const { color, l_op, c_op, h_op, alpha } = match.groups;
			return [
				color,
				Math.round(parseFloat(l_op) * 100), // Convert multiplier back to percentage for UI
				Math.round(parseFloat(c_op) * 100), // Convert multiplier back to percentage for UI
				parseInt(h_op.replace(/\s/g, ''), 10),
				parseInt(alpha, 10) / 100,
			];
		}
		return ['', '', '', '', ''];
	}
	if (value.startsWith('linear-gradient')) {
		return ['', '', '', '', ''];
	}
	if (value.startsWith('radial-gradient')) {
		return ['', '', '', '', ''];
	}
	if (value.startsWith('conic-gradient')) {
		return ['', '', '', '', ''];
	}
	return [getColorOutput(value), 100, 100, 0, 1];
};

// Convert percentage to multiplier for OKLch (100 = no change, 0 = minimum, 200 = maximum)
const percentToLightness = (percent) => (percent / 100).toFixed(2);
const percentToChroma = (percent) => (percent / 100).toFixed(2);

const ColorOKLch = ({ onChange, value, globalClasses, isHover, inherited, globalStylesCss }) => {
	const [color, lightness, chroma, hue, alpha] = getColorOKLchValues(value);
	const [inheritedColor, inheritedLightness, inheritedChroma, inheritedHue, inheritedAlpha] = getColorOKLchValues(inherited?.inheritedValue);
	

	// Calculate the current color for live previews
	const currentColor = useMemo(() => {
		const baseColor = color || inheritedColor;
		if (!baseColor) return '';
		
		const l = lightness !== '' ? lightness : (inheritedLightness !== '' ? inheritedLightness : 100);
		const c = chroma !== '' ? chroma : (inheritedChroma !== '' ? inheritedChroma : 100);
		const h = hue !== '' ? hue : (inheritedHue !== '' ? inheritedHue : 0);
		const a = alpha ? alpha * 100 : (inheritedAlpha ? inheritedAlpha * 100 : 100);
		
		return `oklch(from ${baseColor} calc(l * ${percentToLightness(l)}) calc(c * ${percentToChroma(c)}) calc(h + ${h}) / ${a}%)`;
	}, [color, lightness, chroma, hue, alpha, inheritedColor, inheritedLightness, inheritedChroma, inheritedHue, inheritedAlpha]);
	
	return (
		<div className="kbs-color-oklch-control">
			<ColorSelect
				label={__('Color', 'kadence-blocks')}
				isHover={isHover}
				value={color}
				inherited={{ inheritedValue: inheritedColor }}
				onChange={(value) =>
					onChange(
						`oklch(from ${getColorOutput(value)} calc(l * ${lightness !== '' ? percentToLightness(lightness) : inheritedLightness !== '' ? percentToLightness(inheritedLightness) : '1.00'}) calc(c * ${chroma !== '' ? percentToChroma(chroma) : inheritedChroma !== '' ? percentToChroma(inheritedChroma) : '1.00'}) calc(h + ${hue !== '' ? hue : inheritedHue !== '' ? inheritedHue : '0'}) / ${alpha ? alpha * 100 : inheritedAlpha ? inheritedAlpha * 100 : '100'}%)`
					)
				}
				globalClasses={globalClasses}
				globalStylesCss={globalStylesCss}
				hasGradient={false}
				hasMix={false}
			/>
			{(color || inheritedColor) && (
				<>
					<RadioButtonSelect
						label={__('Lightness', 'kadence-blocks')}
						type={'oklch-lightness'}
						hasCustomControls={true}
						color={currentColor}
						baseColor={color || inheritedColor}
						hue={hue}
						chroma={chroma}
						value={lightness}
						shadeType={'lightness'}
						isHover={isHover}
						inherited={{ inheritedValue: inheritedLightness }}
						onChange={(value) => {
							if (!value && value !== 0) {
								onChange(
									`oklch(from ${color ? color : inheritedColor} calc(l * ${inheritedLightness !== '' ? percentToLightness(inheritedLightness) : '1.00'}) calc(c * ${chroma !== '' ? percentToChroma(chroma) : inheritedChroma !== '' ? percentToChroma(inheritedChroma) : '1.00'}) calc(h + ${hue !== '' ? hue : inheritedHue !== '' ? inheritedHue : '0'}) / ${alpha ? alpha * 100 : inheritedAlpha ? inheritedAlpha * 100 : '100'}%)`
								);
							} else {
								const tempValue = parseInt(value);
								onChange(
									`oklch(from ${color ? color : inheritedColor} calc(l * ${percentToLightness(tempValue)}) calc(c * ${chroma !== '' ? percentToChroma(chroma) : inheritedChroma !== '' ? percentToChroma(inheritedChroma) : '1.00'}) calc(h + ${hue !== '' ? hue : inheritedHue !== '' ? inheritedHue : '0'}) / ${alpha ? alpha * 100 : inheritedAlpha ? inheritedAlpha * 100 : '100'}%)`
								);
							}
						}}
						units={[{ value: '%', label: '%' }]}
						placeholder={100}
						min={0}
						max={200}
						step={1}
					/>
					<RadioButtonSelect
						label={__('Chroma', 'kadence-blocks')}
						type={'oklch-chroma'}
						hasCustomControls={true}
						color={currentColor}
						hue={hue}
						lightness={lightness}
						baseColor={color || inheritedColor}
						shadeType={'chroma'}
						value={chroma}
						isHover={isHover}
						inherited={{ inheritedValue: inheritedChroma }}
						onChange={(value) => {
							if (!value && value !== 0) {
								onChange(
									`oklch(from ${color ? color : inheritedColor} calc(l * ${lightness !== '' ? percentToLightness(lightness) : inheritedLightness !== '' ? percentToLightness(inheritedLightness) : '1.00'}) calc(c * ${inheritedChroma !== '' ? percentToChroma(inheritedChroma) : '1.00'}) calc(h + ${hue !== '' ? hue : inheritedHue !== '' ? inheritedHue : '0'}) / ${alpha ? alpha * 100 : inheritedAlpha ? inheritedAlpha * 100 : '100'}%)`
								);
							} else {
								const tempValue = parseInt(value);
								onChange(
									`oklch(from ${color ? color : inheritedColor} calc(l * ${lightness !== '' ? percentToLightness(lightness) : inheritedLightness !== '' ? percentToLightness(inheritedLightness) : '1.00'}) calc(c * ${percentToChroma(tempValue)}) calc(h + ${hue !== '' ? hue : inheritedHue !== '' ? inheritedHue : '0'}) / ${alpha ? alpha * 100 : inheritedAlpha ? inheritedAlpha * 100 : '100'}%)`
								);
							}
						}}
						units={[{ value: '%', label: '%' }]}
						placeholder={100}
						min={0}
						max={200}
						step={1}
					/>
					<RadioButtonSelect
						label={__('Hue', 'kadence-blocks')}
						type={'oklch-hue'}
						hasCustomControls={true}
						color={currentColor}
						baseColor={color || inheritedColor}
						shadeType={'hue'}
						value={hue}
						isHover={isHover}
						inherited={{ inheritedValue: inheritedHue }}
						onChange={(value) => {
							if (!value && value !== 0) {
								onChange(
									`oklch(from ${color ? color : inheritedColor} calc(l * ${lightness !== '' ? percentToLightness(lightness) : inheritedLightness !== '' ? percentToLightness(inheritedLightness) : '1.00'}) calc(c * ${chroma !== '' ? percentToChroma(chroma) : inheritedChroma !== '' ? percentToChroma(inheritedChroma) : '1.00'}) calc(h + ${inheritedHue !== '' ? inheritedHue : '0'}) / ${alpha ? alpha * 100 : inheritedAlpha ? inheritedAlpha * 100 : '100'}%)`
								);
							} else {
								const tempValue = parseInt(value);
								onChange(
									`oklch(from ${color ? color : inheritedColor} calc(l * ${lightness !== '' ? percentToLightness(lightness) : inheritedLightness !== '' ? percentToLightness(inheritedLightness) : '1.00'}) calc(c * ${chroma !== '' ? percentToChroma(chroma) : inheritedChroma !== '' ? percentToChroma(inheritedChroma) : '1.00'}) calc(h + ${tempValue}) / ${alpha ? alpha * 100 : inheritedAlpha ? inheritedAlpha * 100 : '100'}%)`
								);
							}
						}}
						units={[{ value: '°', label: '°' }]}
						placeholder={0}
						min={-180}
						max={180}
						step={1}
					/>
					<RadioButtonSelect
						label={__('Opacity', 'kadence-blocks')}
						type={'oklch-alpha'}
						hasCustomControls={true}
						color={currentColor}
						baseColor={color || inheritedColor}
						shadeType={'alpha'}
						value={alpha ? alpha * 100 : undefined}
						isHover={isHover}
						inherited={{ inheritedValue: inheritedAlpha ? inheritedAlpha * 100 : undefined }}
						onChange={(value) => {
							if (!value && value !== 0) {
								onChange(
									`oklch(from ${color ? color : inheritedColor} calc(l * ${lightness !== '' ? percentToLightness(lightness) : inheritedLightness !== '' ? percentToLightness(inheritedLightness) : '1.00'}) calc(c * ${chroma !== '' ? percentToChroma(chroma) : inheritedChroma !== '' ? percentToChroma(inheritedChroma) : '1.00'}) calc(h + ${hue !== '' ? hue : inheritedHue !== '' ? inheritedHue : '0'}) / ${inheritedAlpha ? inheritedAlpha * 100 : '100'}%)`
								);
							} else {
								const tempValue = parseInt(value);
								onChange(
									`oklch(from ${color ? color : inheritedColor} calc(l * ${lightness !== '' ? percentToLightness(lightness) : inheritedLightness !== '' ? percentToLightness(inheritedLightness) : '1.00'}) calc(c * ${chroma !== '' ? percentToChroma(chroma) : inheritedChroma !== '' ? percentToChroma(inheritedChroma) : '1.00'}) calc(h + ${hue !== '' ? hue : inheritedHue !== '' ? inheritedHue : '0'}) / ${tempValue}%)`
								);
							}
						}}
						units={[{ value: '%', label: '%' }]}
						placeholder={100}
						min={0}
						max={100}
						step={1}
					/>
				</>
			)}
		</div>
	);
};
export default ColorOKLch;
