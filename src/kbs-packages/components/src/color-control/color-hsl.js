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

const getColorHSLValues = (value) => {
	if (!value) {
		return ['', '', '', '', ''];
	}
	if (value.startsWith('hsl')) {
		// Parse hsl string like: hsl(from var(--kbs-colors-palette1) calc(h + 0) calc(s + 0) calc(l +20) / 100%)
		// Or hsl(from #489372 calc(h + 0) calc(s + 0) calc(l + 10) / 100%)
		// Or hsl(from #000000 calc(h + 20) calc(s + 0) calc(l + -10) / 100%)
		console.log('Input value:', value);
		console.log('Value length:', value.length);
		const regex = /hsl\(\s*from\s+(?<color>var\(--[a-zA-Z0-9-]+\)|#[0-9a-fA-F]{6})\s+calc\(h\s*\+\s*(?<h_op>[-+]?\s*\d+)\)\s+calc\(s\s*\+\s*(?<s_op>[-+]?\s*\d+)\)\s+calc\(l\s*\+\s*(?<l_op>[-+]?\s*\d+)\)\s*\/\s*(?<alpha>\d+)%\)/;
		  
			const match = value.match(regex);
		  
			if (match) {
		  
			const { color, h_op, s_op, l_op, alpha } = match.groups;
			console.log('Match result:', match);
			return [
			  color,
			  parseInt(h_op.replace(/\s/g, ''), 10),
			  parseInt(s_op.replace(/\s/g, ''), 10),
			  parseInt(l_op.replace(/\s/g, ''), 10),
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
	return ['', '', '', '', ''];
};
const ColorHSL = ({ onChange, value, globalClasses, isHover, inherited, globalStylesCss }) => {
	const [color, hue, saturation, lightness, alpha] = getColorHSLValues(value);
	const [inheritedColor, inheritedHue, inheritedSaturation, inheritedLightness, inheritedAlpha] = getColorHSLValues(inherited?.inheritedValue);

	return (
		<div className="kbs-color-hsl-control">
			<ColorSelect
				label={__('Color', 'kadence-blocks')}
				isHover={isHover}
				value={color}
				inherited={{ inheritedValue: inheritedColor }}
				onChange={(value) =>
					onChange(
						`hsl(from ${getColorOutput(value)} calc(h + ${hue ? hue : inheritedHue ? inheritedHue : '0'}) calc(s + ${saturation ? saturation : inheritedSaturation ? inheritedSaturation : '0'}) calc(l + ${lightness ? lightness : inheritedLightness ? inheritedLightness : '0'}) / ${alpha ? alpha : inheritedAlpha ? inheritedAlpha : '100%'})`
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
						label={__('Shade', 'kadence-blocks')}
						type={'color-shade'}
						hasCustomControls={true}
						color={color ? color : inheritedColor}
						value={lightness}
						shadeType={'shade'}
						isHover={isHover}
						inherited={{ inheritedValue: inheritedLightness }}
						onChange={(value) => {
							if (!value) {
								`hsl(from ${color ? color : inheritedColor} calc(h + ${hue ? hue : inheritedHue ? inheritedHue : '0'}) calc(s + ${saturation ? saturation : inheritedSaturation ? inheritedSaturation : '0'}) calc(l + ${inheritedLightness ? inheritedLightness : '0'}) / ${alpha ? alpha : inheritedAlpha ? inheritedAlpha : '100%'})`
							} else {
								// the value is the percentage of the shade convert to a number
								const tempValue = parseInt(value);
								onChange(
									`hsl(from ${color ? color : inheritedColor} calc(h + ${hue ? hue : inheritedHue ? inheritedHue : '0'}) calc(s + ${saturation ? saturation : inheritedSaturation ? inheritedSaturation : '0'}) calc(l + ${tempValue}) / ${alpha ? alpha : inheritedAlpha ? inheritedAlpha : '100%'})`
								);
							}
						}}
						units={[{ value: '%', label: '%' }]}
						placeholder={0}
						min={-100}
						max={100}
						step={1}
					/>
					<RadioButtonSelect
							label={__('Opacity', 'kadence-blocks')}
							type={'color-alpha'}
							hasCustomControls={true}
							color={color ? color : inheritedColor}
							shadeType={'alpha'}
							value={alpha}
							isHover={isHover}
							inherited={{ inheritedValue: inheritedLightness }}
							onChange={(value) => {
								if (!value && 0 !== value) {
									onChange(
										`hsl(from ${color ? color : inheritedColor} calc(h + ${hue ? hue : inheritedHue ? inheritedHue : '0'}) calc(s + ${saturation ? saturation : inheritedSaturation ? inheritedSaturation : '0'}) calc(l + ${lightness ? lightness : inheritedLightness ? inheritedLightness : '0'}) / ${inheritedAlpha ? inheritedAlpha : '100%'})`
									);
								} else {
									// the value is the percentage of the shade convert to a number
									const tempValue = parseInt(value);
									onChange(
										`hsl(from ${color ? color : inheritedColor} calc(h + ${hue ? hue : inheritedHue ? inheritedHue : '0'}) calc(s + ${saturation ? saturation : inheritedSaturation ? inheritedSaturation : '0'}) calc(l + ${lightness ? lightness : inheritedLightness ? inheritedLightness : '0'}) / ${tempValue}%)`
									);
								}
							}}
							units={[{ value: '%', label: '%' }]}
							placeholder={100}
							min={0}
							max={100}
							step={1}
						/>
						<RadioButtonSelect
							label={__('Hue', 'kadence-blocks')}
							type={'color-hue'}
							hasCustomControls={true}
							color={color ? color : inheritedColor}
							shadeType={'hue'}
							value={hue}
							isHover={isHover}
							inherited={{ inheritedValue: inheritedHue }}
							onChange={(value) => {
								if (!value) {
									onChange(
										`hsl(from ${color ? color : inheritedColor} calc(h + ${inheritedHue ? inheritedHue : '0'}) calc(s + ${saturation ? saturation : inheritedSaturation ? inheritedSaturation : '0'}) calc(l + ${lightness ? lightness : inheritedLightness ? inheritedLightness : '0'}) / ${alpha ? alpha : inheritedAlpha ? inheritedAlpha : '100%'})`
									);
								} else {
									// the value is the percentage of the shade convert to a number
									const tempValue = parseInt(value);
									onChange(
										`hsl(from ${color ? color : inheritedColor} calc(h + ${tempValue}) calc(s + ${saturation ? saturation : inheritedSaturation ? inheritedSaturation : '0'}) calc(l + ${lightness ? lightness : inheritedLightness ? inheritedLightness : '0'}) / ${alpha ? alpha : inheritedAlpha ? inheritedAlpha : '100%'})`
									);
								}
							}}
							units={[{ value: '%', label: '%' }]}
							placeholder={50}
							min={0}
							max={100}
							step={1}
						/>
				</>
			)}
		</div>
	);
};
export default ColorHSL;
