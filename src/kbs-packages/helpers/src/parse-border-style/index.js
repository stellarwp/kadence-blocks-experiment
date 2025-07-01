/**
 * Parse Border Style Helper
 * This helper contains functions for parsing and manipulating border style values.
 */

import { BORDER_STYLES_DEFAULTS } from '../constants/borders';

/**
 * Parses a border style string into its component parts (width, style, color)
 * @param {string} borderStyle - The border style string to parse (e.g., "1px solid black")
 * @returns {Object} Object containing color, style, and width properties
 */
export default function parseBorderStyle(borderStyle) {
	if (!borderStyle || typeof borderStyle !== 'string') {
		return {
			color: '',
			style: '',
			width: '',
		};
	}

	const parts = borderStyle.split(' ');
	let currentWidthValue = '';
	let currentStyleValue = '';
	let currentColorValue = '';

	// Border string should have 3 parts: width style color
	// If the part is the default value, it should be considered empty
	if (parts.length === 3) {
		currentWidthValue = parts[0].includes(BORDER_STYLES_DEFAULTS.width.var) ? '' : parts[0];
		currentStyleValue = parts[1].includes(BORDER_STYLES_DEFAULTS.style.var) ? '' : parts[1];
		currentColorValue = parts[2].includes(BORDER_STYLES_DEFAULTS.color.var) ? '' : parts[2];
	}

	return { color: currentColorValue, style: currentStyleValue, width: currentWidthValue };
}
