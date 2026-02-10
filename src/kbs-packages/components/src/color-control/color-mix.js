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

// Constants for commonly used CSS variables
const MIX_BLACK = 'var(--kbs-mix-black, #000000)';
const MIX_WHITE = 'var(--kbs-mix-white, #ffffff)';
const MIX_TRANSPARENT = 'var(--kbs-mix-transparent, transparent)';

const getColorMixValues = (value) => {
	if (!value || typeof value !== 'string') {
		return ['', '', ''];
	}

	// Handle color-mix format
	if (value.startsWith('color-mix')) {
		// Improved regex to handle nested parentheses and various color formats
		// Matches: color-mix(in oklch, color1, color2 percentage%)
		const regex = /color-mix\(\s*in\s+oklch\s*,\s*([^,]+(?:\([^)]*\)[^,]*)?)\s*,\s*(.+)\s+(\d+(?:\.\d+)?%)\s*\)/;
		const match = value.match(regex);

		if (match) {
			const firstColor = match[1].trim();
			const secondColor = match[2].trim();
			const percentage = match[3];

			return [firstColor, secondColor, percentage];
		}
		// If no match, return default values
		return ['', MIX_BLACK, '0%'];
	}

	// Handle gradient formats - these should not be converted to color-mix
	if (
		value.startsWith('linear-gradient') ||
		value.startsWith('radial-gradient') ||
		value.startsWith('conic-gradient')
	) {
		return ['', MIX_BLACK, '0%'];
	}

	// Handle oklch format - don't convert to color-mix
	if (value.startsWith('oklch')) {
		return ['', MIX_BLACK, '0%'];
	}

	// Handle regular color values
	return [getColorOutput(value), MIX_BLACK, '0%'];
};
const ColorMix = ({ onChange, value, globalClasses, isHover, inherited, globalStylesCss }) => {
	const [color, type, mix] = getColorMixValues(value);
	const [inheritedColor, inheritedType, inheritedMix] = getColorMixValues(inherited?.inheritedValue);
	const isShade = type === MIX_BLACK || type === MIX_WHITE;
	const isMix = type && type !== MIX_TRANSPARENT && type !== MIX_WHITE && type !== MIX_BLACK;
	const typeValue = useMemo(() => {
		if (!type) {
			return '';
		}
		if (type === MIX_BLACK || type === MIX_WHITE) {
			return 'shade';
		}
		if (type === MIX_TRANSPARENT) {
			return 'transparent';
		}
		return 'mix';
	}, [type]);
	const inheritedTypeValue = useMemo(() => {
		if (!inheritedType) {
			return '';
		}
		if (inheritedType === MIX_BLACK || inheritedType === MIX_WHITE) {
			return 'shade';
		}
		if (inheritedType === MIX_TRANSPARENT) {
			return 'transparent';
		}
		return 'mix';
	}, [inheritedType]);
	const shadeValue = useMemo(() => {
		if (!type) {
			return '';
		}
		if (type === MIX_BLACK) {
			// Make the mix a negative value. So 37.5% becomes -37.5%
			return -parseInt(mix);
		}
		return parseInt(mix);
	}, [mix, type]);
	const actionableType = typeValue || inheritedTypeValue;
	return (
		<div className="kbs-color-mix-control">
			<ColorSelect
				label={__('Color', 'kadence-blocks')}
				isHover={isHover}
				value={color}
				inherited={{ inheritedValue: inheritedColor }}
				onChange={(value) =>
					onChange(
						`color-mix(in oklch, ${getColorOutput(value)}, ${type ? type : inheritedType ? inheritedType : 'black'} ${mix ? mix : inheritedMix ? inheritedMix : '50%'})`
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
						label={__('Mix Type', 'kadence-blocks')}
						isHover={isHover}
						inherited={{ inheritedValue: inheritedTypeValue }}
						value={typeValue}
						type={'color-mix'}
						view={'normal'}
						hasCustomControls={false}
						onChange={(value) => {
							if (!value) {
								if (inheritedTypeValue) {
									onChange(
										`color-mix(in oklch, ${color ? color : inheritedColor}, ${inheritedTypeValue} ${mix ? mix : inheritedMix ? inheritedMix : '50%'})`
									);
								}
							} else if (value === 'shade') {
								if (!isShade) {
									onChange(
										`color-mix(in oklch, ${color ? color : inheritedColor}, ${MIX_BLACK} ${mix ? mix : inheritedMix ? inheritedMix : '10%'})`
									);
								}
							} else if (value === 'mix') {
								if (!isMix) {
									const tempColor = type === MIX_BLACK ? '#000000' : '#ffffff';
									onChange(
										`color-mix(in oklch, ${color ? color : inheritedColor}, ${tempColor} ${mix ? mix : inheritedMix ? inheritedMix : '50%'})`
									);
								}
							} else if (value === 'transparent') {
								onChange(
									`color-mix(in oklch, ${color ? color : inheritedColor}, ${MIX_TRANSPARENT} ${mix ? mix : inheritedMix ? inheritedMix : '50%'})`
								);
							} else {
								onChange(
									`color-mix(in oklch, ${color ? color : inheritedColor}, ${value} ${mix ? mix : inheritedMix ? inheritedMix : '50%'})`
								);
							}
						}}
					/>
					{actionableType === 'shade' && (
						<RadioButtonSelect
							label={__('Shade', 'kadence-blocks')}
							type={'color-shade'}
							hasCustomControls={true}
							color={color ? color : inheritedColor}
							value={shadeValue}
							shadeType={'shade'}
							isHover={isHover}
							inherited={{ inheritedValue: inheritedMix }}
							onChange={(value) => {
								if (!value) {
									onChange(
										`color-mix(in oklch, ${color ? color : inheritedColor}, ${type ? type : inheritedType ? inheritedType : MIX_BLACK} 0%)`
									);
								} else {
									// the value is the percentage of the shade convert to a number
									const tempValue = parseInt(value);
									// If negative value the type is black, if positive value the type is white
									const tempType = tempValue < 0 ? MIX_BLACK : MIX_WHITE;
									onChange(
										`color-mix(in oklch, ${color ? color : inheritedColor}, ${tempType} ${Math.abs(tempValue)}%)`
									);
								}
							}}
							units={[{ value: '%', label: '%' }]}
							placeholder={50}
							min={-100}
							max={100}
							step={1}
						/>
					)}
					{actionableType === 'transparent' && (
						<RadioButtonSelect
							label={__('Opacity', 'kadence-blocks')}
							type={'color-transparent'}
							hasCustomControls={true}
							color={color ? color : inheritedColor}
							shadeType={'transparent'}
							value={shadeValue}
							isHover={isHover}
							inherited={{ inheritedValue: inheritedMix }}
							onChange={(value) => {
								if (!value) {
									onChange(
										`color-mix(in oklch, ${color ? color : inheritedColor}, ${type ? type : inheritedType ? inheritedType : MIX_TRANSPARENT} 0%)`
									);
								} else {
									// the value is the percentage of the shade convert to a number
									const tempValue = parseInt(value);
									onChange(
										`color-mix(in oklch, ${color ? color : inheritedColor}, ${MIX_TRANSPARENT} ${Math.abs(tempValue)}%)`
									);
								}
							}}
							units={[{ value: '%', label: '%' }]}
							placeholder={50}
							min={0}
							max={100}
							step={1}
						/>
					)}
					{actionableType === 'mix' && (
						<>
							<ColorSelect
								label={__('Mix Color', 'kadence-blocks')}
								isHover={isHover}
								value={type}
								inherited={{ inheritedValue: inheritedType }}
								onChange={(value) =>
									onChange(
										`color-mix(in oklch, ${color ? color : inheritedColor}, ${getColorOutput(value)} ${mix ? mix : inheritedMix ? inheritedMix : '50%'})`
									)
								}
								globalClasses={globalClasses}
								globalStylesCss={globalStylesCss}
								hasGradient={false}
								hasMix={false}
							/>
							<RadioButtonSelect
								label={__('Mix Amount', 'kadence-blocks')}
								type={'color-mix-amount'}
								hasCustomControls={true}
								color={color ? color : inheritedColor}
								shadeType={type ? type : inheritedType ? inheritedType : ''}
								value={shadeValue}
								isHover={isHover}
								inherited={{ inheritedValue: inheritedMix }}
								onChange={(value) => {
									if (!value) {
										onChange(
											`color-mix(in oklch, ${color ? color : inheritedColor}, ${type ? type : inheritedType ? inheritedType : '#ffffff'} 0%)`
										);
									} else {
										// the value is the percentage of the shade convert to a number
										const tempValue = parseInt(value);
										onChange(
											`color-mix(in oklch, ${color ? color : inheritedColor}, ${type ? type : inheritedType ? inheritedType : '#ffffff'} ${Math.abs(tempValue)}%)`
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
				</>
			)}
		</div>
	);
};
export default ColorMix;
