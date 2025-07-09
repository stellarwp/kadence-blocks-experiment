import clsx from 'clsx';
import { __ } from '@wordpress/i18n';
import { 
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
	RangeControl,
	Flex,
	FlexItem 
} from '@wordpress/components';
import { useMemo, useState, useEffect } from '@wordpress/element';
/**
 * Internal dependencies
 */
import { getColorOutput } from '@kadence/kbsHelpers';
import ColorSelect from './color-select';
import RadioButtonSelect from '../radio-button-control/radio-button-select';
import { getColorLabel } from './utils';

// Helper to detect current format
const detectColorFormat = (value) => {
	if (!value || typeof value !== 'string') {
		return 'none';
	}
	if (value.startsWith('oklch(from')) {
		return 'oklch';
	}
	if (value.startsWith('color-mix')) {
		return 'color-mix';
	}
	// Regular color values default to OKLch
	return 'oklch';
};

// Parse OKLch values
const getColorOKLchValues = (value) => {
	if (!value) {
		return ['', '', '', '', ''];
	}
	if (value.startsWith('oklch')) {
		// Parse oklch string - handles both multiplication and addition formats for lightness
		const regex = /oklch\(\s*from\s+(?<color>var\(--[a-zA-Z0-9-]+\)|#[0-9a-fA-F]{6})\s+calc\((?<l_calc>l\s*\*\s*\d*\.?\d+|l\s*\+\s*\d*\.?\d+\s*\*\s*\(1\s*-\s*l\))\)\s+calc\(c\s*\*\s*(?<c_op>\d*\.?\d+)\)\s+calc\(h\s*\+\s*(?<h_op>[-+]?\s*\d+)\)\s*\/\s*(?<alpha>\d+)%\)/;
		
		const match = value.match(regex);
		
		if (match) {
			const { color, l_calc, c_op, h_op, alpha } = match.groups;
			
			// Parse lightness value
			let lightnessPercent = 100;
			if (l_calc.includes('*') && l_calc.includes('(1 - l)')) {
				// Addition format: l + X * (1 - l)
				const addMatch = l_calc.match(/l\s*\+\s*(\d*\.?\d+)\s*\*/);
				if (addMatch) {
					lightnessPercent = 100 + Math.round(parseFloat(addMatch[1]) * 100);
				}
			} else if (l_calc.includes('*')) {
				// Multiplication format: l * X
				const multMatch = l_calc.match(/l\s*\*\s*(\d*\.?\d+)/);
				if (multMatch) {
					lightnessPercent = Math.round(parseFloat(multMatch[1]) * 100);
				}
			}
			
			return [
				color,
				lightnessPercent,
				Math.round(parseFloat(c_op) * 100), // Convert multiplier back to percentage for UI
				parseInt(h_op.replace(/\s/g, ''), 10),
				parseInt(alpha, 10) / 100,
			];
		}
		return ['', '', '', '', ''];
	}
	if (value.startsWith('linear-gradient') || value.startsWith('radial-gradient') || value.startsWith('conic-gradient')) {
		return ['', '', '', '', ''];
	}
	return [getColorOutput(value), 100, 100, 0, 1];
};

// Parse color-mix values
const getColorMixValues = (value) => {
	if (!value || typeof value !== 'string') {
		return ['', '', ''];
	}
	
	// Handle color-mix format
	if (value.startsWith('color-mix')) {
		const regex = /color-mix\(\s*in\s+oklch\s*,\s*([^,]+(?:\([^)]*\)[^,]*)?)\s*,\s*(.+)\s+(\d+(?:\.\d+)?%)\s*\)/;
		const match = value.match(regex);
		
		if (match) {
			const firstColor = match[1].trim();
			const secondColor = match[2].trim();
			const percentage = match[3];
			
			return [firstColor, secondColor, percentage];
		}
		return ['', '#000000', '50%'];
	}
	
	// Handle regular color values
	return [getColorOutput(value), '#000000', '50%'];
};

// Convert percentage to OKLch values
const percentToLightness = (percent) => {
	if (percent <= 100) {
		// Darken: multiply (0% = black, 100% = original)
		return `l * ${(percent / 100).toFixed(2)}`;
	} else {
		// Lighten: add to approach white (100% = original, 200% = white)
		const addValue = ((percent - 100) / 100).toFixed(2);
		return `l + ${addValue} * (1 - l)`;
	}
};
const percentToChroma = (percent) => (percent / 100).toFixed(2);

const ColorUnifiedMix = ({ onChange, value, globalClasses, isHover, inherited, globalStylesCss }) => {
	// Detect initial mode based on value
	const initialMode = useMemo(() => {
		const format = detectColorFormat(value || inherited?.inheritedValue);
		return format === 'color-mix' ? 'color-mix' : 'oklch';
	}, []);
	
	const [mode, setMode] = useState(initialMode);
	// Track the base color separately to maintain it across mode switches
	const [baseColorState, setBaseColorState] = useState(null);
	
	// Update mode when value changes externally
	useEffect(() => {
		const format = detectColorFormat(value);
		if (format === 'color-mix' && mode !== 'color-mix') {
			setMode('color-mix');
		} else if (format === 'oklch' && mode !== 'oklch') {
			setMode('oklch');
		}
	}, [value]);
	
	// Parse values based on current mode
	const [color, lightness, chroma, hue, alpha] = getColorOKLchValues(mode === 'oklch' ? value : (value && !value.startsWith('color-mix') ? value : ''));
	const [inheritedColor, inheritedLightness, inheritedChroma, inheritedHue, inheritedAlpha] = getColorOKLchValues(inherited?.inheritedValue);
	
	const [mixColor1, mixColor2, mixPercent] = getColorMixValues(mode === 'color-mix' ? value : '');
	const [inheritedMixColor1, inheritedMixColor2, inheritedMixPercent] = getColorMixValues(inherited?.inheritedValue);
	
	// Determine the current base color (prefer state over parsed values)
	const currentBaseColor = baseColorState || (mode === 'oklch' ? (color || inheritedColor) : (mixColor1 || inheritedMixColor1));
	
	// Update base color state when the actual base color changes
	useEffect(() => {
		const newBaseColor = mode === 'oklch' ? (color || inheritedColor) : (mixColor1 || inheritedMixColor1);
		if (newBaseColor && newBaseColor !== baseColorState) {
			setBaseColorState(newBaseColor);
		}
	}, [color, mixColor1, inheritedColor, inheritedMixColor1, mode]);
	
	// Calculate the current color for live previews (OKLch mode)
	const currentOKLchColor = useMemo(() => {
		if (!currentBaseColor) return '';
		
		const l = lightness !== '' ? lightness : (inheritedLightness !== '' ? inheritedLightness : 100);
		const c = chroma !== '' ? chroma : (inheritedChroma !== '' ? inheritedChroma : 100);
		const h = hue !== '' ? hue : (inheritedHue !== '' ? inheritedHue : 0);
		const a = alpha ? alpha * 100 : (inheritedAlpha ? inheritedAlpha * 100 : 100);
		
		return `oklch(from ${currentBaseColor} calc(${percentToLightness(l)}) calc(c * ${percentToChroma(c)}) calc(h + ${h}) / ${a}%)`;
	}, [currentBaseColor, lightness, chroma, hue, alpha, inheritedLightness, inheritedChroma, inheritedHue, inheritedAlpha]);
	
	// Handle mode change
	const handleModeChange = (newMode) => {
		if (newMode === mode) return;
		
		// Use the tracked base color for conversion
		const baseColorToUse = currentBaseColor || '#000000';
		
		if (newMode === 'oklch') {
			// Convert to OKLch using the base color
			onChange(`oklch(from ${getColorOutput(baseColorToUse)} calc(l) calc(c) calc(h) / 100%)`);
		} else {
			// Convert to color-mix using the base color
			onChange(`color-mix(in oklch, ${getColorOutput(baseColorToUse)}, #000000 50%)`);
		}
		setMode(newMode);
	};
	
	// Render appropriate controls based on mode
	return (
		<div className="kbs-color-unified-mix-control">
			<ColorSelect
				label={__('Base Color', 'kadence-blocks')}
				isHover={isHover}
				value={currentBaseColor}
				inherited={{ inheritedValue: mode === 'oklch' ? inheritedColor : inheritedMixColor1 }}
				onChange={(value) => {
					// Update the base color state
					setBaseColorState(value);
					
					if (mode === 'oklch') {
						onChange(
							`oklch(from ${getColorOutput(value)} calc(${lightness !== '' ? percentToLightness(lightness) : inheritedLightness !== '' ? percentToLightness(inheritedLightness) : 'l'}) calc(c * ${chroma !== '' ? percentToChroma(chroma) : inheritedChroma !== '' ? percentToChroma(inheritedChroma) : '1.00'}) calc(h + ${hue !== '' ? hue : inheritedHue !== '' ? inheritedHue : '0'}) / ${alpha ? alpha * 100 : inheritedAlpha ? inheritedAlpha * 100 : '100'}%)`
						);
					} else {
						onChange(
							`color-mix(in oklch, ${getColorOutput(value)}, ${mixColor2 || inheritedMixColor2 || '#000000'} ${mixPercent || inheritedMixPercent || '50%'})`
						);
					}
				}}
				globalClasses={globalClasses}
				globalStylesCss={globalStylesCss}
				hasGradient={false}
				hasMix={false}
			/>
			
			{/* Mode selector */}
			<div className="kbs-color-unified-mix-mode-selector">
				<ToggleGroupControl
					label={__('Color Mode', 'kadence-blocks')}
					value={mode}
					onChange={handleModeChange}
					isBlock
					__nextHasNoMarginBottom
				>
					<ToggleGroupControlOption
						value="oklch"
						label={__('OKLch', 'kadence-blocks')}
					/>
					<ToggleGroupControlOption
						value="color-mix"
						label={__('Mix', 'kadence-blocks')}
					/>
				</ToggleGroupControl>
			</div>
			
			{/* OKLch Controls */}
			{mode === 'oklch' && currentBaseColor && (
				<>
					<RadioButtonSelect
						label={__('Lightness', 'kadence-blocks')}
						type={'oklch-lightness'}
						hasCustomControls={true}
						color={currentOKLchColor}
						baseColor={currentBaseColor}
						hue={hue}
						chroma={chroma}
						value={lightness}
						shadeType={'lightness'}
						isHover={isHover}
						inherited={{ inheritedValue: inheritedLightness }}
						onChange={(value) => {
							if (!value && value !== 0) {
								onChange(
									`oklch(from ${currentBaseColor} calc(${inheritedLightness !== '' ? percentToLightness(inheritedLightness) : 'l'}) calc(c * ${chroma !== '' ? percentToChroma(chroma) : inheritedChroma !== '' ? percentToChroma(inheritedChroma) : '1.00'}) calc(h + ${hue !== '' ? hue : inheritedHue !== '' ? inheritedHue : '0'}) / ${alpha ? alpha * 100 : inheritedAlpha ? inheritedAlpha * 100 : '100'}%)`
								);
							} else {
								const tempValue = parseInt(value);
								onChange(
									`oklch(from ${currentBaseColor} calc(${percentToLightness(tempValue)}) calc(c * ${chroma !== '' ? percentToChroma(chroma) : inheritedChroma !== '' ? percentToChroma(inheritedChroma) : '1.00'}) calc(h + ${hue !== '' ? hue : inheritedHue !== '' ? inheritedHue : '0'}) / ${alpha ? alpha * 100 : inheritedAlpha ? inheritedAlpha * 100 : '100'}%)`
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
						color={currentOKLchColor}
						hue={hue}
						lightness={lightness}
						baseColor={currentBaseColor}
						shadeType={'chroma'}
						value={chroma}
						isHover={isHover}
						inherited={{ inheritedValue: inheritedChroma }}
						onChange={(value) => {
							if (!value && value !== 0) {
								onChange(
									`oklch(from ${currentBaseColor} calc(${lightness !== '' ? percentToLightness(lightness) : inheritedLightness !== '' ? percentToLightness(inheritedLightness) : 'l'}) calc(c * ${inheritedChroma !== '' ? percentToChroma(inheritedChroma) : '1.00'}) calc(h + ${hue !== '' ? hue : inheritedHue !== '' ? inheritedHue : '0'}) / ${alpha ? alpha * 100 : inheritedAlpha ? inheritedAlpha * 100 : '100'}%)`
								);
							} else {
								const tempValue = parseInt(value);
								onChange(
									`oklch(from ${currentBaseColor} calc(${lightness !== '' ? percentToLightness(lightness) : inheritedLightness !== '' ? percentToLightness(inheritedLightness) : 'l'}) calc(c * ${percentToChroma(tempValue)}) calc(h + ${hue !== '' ? hue : inheritedHue !== '' ? inheritedHue : '0'}) / ${alpha ? alpha * 100 : inheritedAlpha ? inheritedAlpha * 100 : '100'}%)`
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
						color={currentOKLchColor}
						baseColor={currentBaseColor}
						shadeType={'hue'}
						value={hue}
						lightness={lightness}
						chroma={chroma}
						isHover={isHover}
						inherited={{ inheritedValue: inheritedHue }}
						onChange={(value) => {
							if (!value && value !== 0) {
								onChange(
									`oklch(from ${currentBaseColor} calc(${lightness !== '' ? percentToLightness(lightness) : inheritedLightness !== '' ? percentToLightness(inheritedLightness) : 'l'}) calc(c * ${chroma !== '' ? percentToChroma(chroma) : inheritedChroma !== '' ? percentToChroma(inheritedChroma) : '1.00'}) calc(h + ${inheritedHue !== '' ? inheritedHue : '0'}) / ${alpha ? alpha * 100 : inheritedAlpha ? inheritedAlpha * 100 : '100'}%)`
								);
							} else {
								const tempValue = parseInt(value);
								onChange(
									`oklch(from ${currentBaseColor} calc(${lightness !== '' ? percentToLightness(lightness) : inheritedLightness !== '' ? percentToLightness(inheritedLightness) : 'l'}) calc(c * ${chroma !== '' ? percentToChroma(chroma) : inheritedChroma !== '' ? percentToChroma(inheritedChroma) : '1.00'}) calc(h + ${tempValue}) / ${alpha ? alpha * 100 : inheritedAlpha ? inheritedAlpha * 100 : '100'}%)`
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
						color={currentOKLchColor}
						baseColor={currentBaseColor}
						shadeType={'alpha'}
						value={alpha ? alpha * 100 : ''}
						isHover={isHover}
						inherited={{ inheritedValue: inheritedAlpha ? inheritedAlpha * 100 : '' }}
						onChange={(value) => {
							if (!value && value !== 0) {
								onChange(
									`oklch(from ${currentBaseColor} calc(${lightness !== '' ? percentToLightness(lightness) : inheritedLightness !== '' ? percentToLightness(inheritedLightness) : 'l'}) calc(c * ${chroma !== '' ? percentToChroma(chroma) : inheritedChroma !== '' ? percentToChroma(inheritedChroma) : '1.00'}) calc(h + ${hue !== '' ? hue : inheritedHue !== '' ? inheritedHue : '0'}) / ${inheritedAlpha ? inheritedAlpha * 100 : '100'}%)`
								);
							} else {
								const tempValue = parseInt(value);
								onChange(
									`oklch(from ${currentBaseColor} calc(${lightness !== '' ? percentToLightness(lightness) : inheritedLightness !== '' ? percentToLightness(inheritedLightness) : 'l'}) calc(c * ${chroma !== '' ? percentToChroma(chroma) : inheritedChroma !== '' ? percentToChroma(inheritedChroma) : '1.00'}) calc(h + ${hue !== '' ? hue : inheritedHue !== '' ? inheritedHue : '0'}) / ${tempValue}%)`
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
			
			{/* Color Mix Controls */}
			{mode === 'color-mix' && currentBaseColor && (
				<>
					<ColorSelect
						label={__('Mix Color', 'kadence-blocks')}
						isHover={isHover}
						value={mixColor2}
						inherited={{ inheritedValue: inheritedMixColor2 }}
						onChange={(value) =>
							onChange(
								`color-mix(in oklch, ${currentBaseColor}, ${getColorOutput(value)} ${mixPercent || inheritedMixPercent || '50%'})`
							)
						}
						globalClasses={globalClasses}
						globalStylesCss={globalStylesCss}
						hasGradient={false}
						hasMix={false}
					/>
					<div className="kbs-color-mix-amount-control">
						<RangeControl
							label={__('Mix Amount', 'kadence-blocks')}
							value={parseInt(mixPercent) || 50}
							onChange={(value) =>
								onChange(
									`color-mix(in oklch, ${currentBaseColor}, ${mixColor2 || inheritedMixColor2 || '#000000'} ${value}%)`
								)
							}
							min={0}
							max={100}
							step={1}
							initialPosition={parseInt(inheritedMixPercent) || 50}
							__nextHasNoMarginBottom
						/>
					</div>
				</>
			)}
		</div>
	);
};

export default ColorUnifiedMix;