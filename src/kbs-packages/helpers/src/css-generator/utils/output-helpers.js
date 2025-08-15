import {
	SPACING_SIZES_MAP,
	ICON_SIZES_MAP,
	CONTENT_WIDTH_SIZES_MAP,
	LINE_HEIGHT_SIZES_MAP,
	FONT_SIZES_MAP,
	LETTER_SPACING_SIZES_MAP,
} from '../../constants';
import { BORDER_RADIUS_SIZES_MAP } from '../../constants/borders';
import getColorOutput from '../../get-color-output';

/**
 * Generic function to get size map output
 * @param {string} value - The value to look up
 * @param {Array} sizeMap - The size map to search in
 * @returns {string} - The mapped output value
 */
function getSizeMapOutput(value, sizeMap) {
	if (undefined === value) {
		return '';
	}
	if (!sizeMap) {
		return value;
	}
	if (value === '0' || value === 0) {
		return '0';
	}
	const found = sizeMap.find((option) => option.value === value);
	return found ? found.output : value;
}

/**
 * Get the spacing option output
 * @param {string} value - The value of the attribute
 * @returns {string} - The spacing option output
 */
export function getSpacingOutput(value) {
	return getSizeMapOutput(value, SPACING_SIZES_MAP);
}

/**
 * Get the font sizing option output (alias for getSpacingOutput)
 * @param {string} value - The value of the attribute
 * @returns {string} - The font sizing option output
 */
export function getSizingOutput(value) {
	return getSizeMapOutput(value, SPACING_SIZES_MAP);
}

/**
 * Get the line height option output
 * @param {string} value - The value of the attribute
 * @returns {string} - The line height option output
 */
export function getLineHeightOutput(value) {
	return getSizeMapOutput(value, LINE_HEIGHT_SIZES_MAP);
}

/**
 * Get the font size option output
 * @param {string} value - The value of the attribute
 * @returns {string} - The font size option output
 */
export function getFontSizeOutput(value) {
	return getSizeMapOutput(value, FONT_SIZES_MAP);
}

/**
 * Get the letter spacing option output
 * @param {string} value - The value of the attribute
 * @returns {string} - The letter spacing option output
 */
export function getLetterSpacingOutput(value) {
	return getSizeMapOutput(value, LETTER_SPACING_SIZES_MAP);
}

/**
 * Get the content width option output
 * @param {string} value - The value of the attribute
 * @returns {string} - The content width option output
 */
export function getContentWidthOutput(value) {
	return getSizeMapOutput(value, CONTENT_WIDTH_SIZES_MAP);
}

/**
 * Get the border radius option output
 * @param {string} value - The value of the attribute
 * @returns {string} - The border radius option output
 */
export function getBorderRadiusOutput(value) {
	return getSizeMapOutput(value, BORDER_RADIUS_SIZES_MAP);
}

/**
 * Get the icon size option output
 * @param {string} value - The value of the attribute
 * @returns {string} - The icon size option output
 */
export function getIconSizeOutput(value) {
	// Note: Icon size doesn't check for '0' in original
	if (undefined === value) {
		return '';
	}
	if (!ICON_SIZES_MAP) {
		return value;
	}
	const found = ICON_SIZES_MAP.find((option) => option.value === value);
	return found ? found.output : value;
}

// Re-export getColorOutput for convenience
export { getColorOutput };
