/**
 * Parse Shadow Style Helper
 * This helper contains functions for parsing and manipulating shadow style values.
 */

import { SHADOW_STYLES_DEFAULTS, TEXT_SHADOW_STYLES_DEFAULTS } from '../constants/shadows';

/**
 * Parses a shadow style string into its component parts
 * @param {string} shadowStyle - The shadow style string to parse (e.g., "6px 6px 9px 0 #00000033" or "drop-shadow(6px 6px 9px #00000033)")
 * @param {string} type - The shadow type ('boxShadow', 'textShadow', or 'dropShadow')
 * @returns {Object} Object containing color, x, y, blur, spread, and inset properties
 */
export default function parseShadowStyle(shadowStyle, type = 'boxShadow') {
	if (!shadowStyle || typeof shadowStyle !== 'string') {
		return {
			color: '',
			x: '',
			y: '',
			blur: '',
			spread: '',
			inset: false,
		};
	}

	const shadowDefaults = type === 'boxShadow' ? SHADOW_STYLES_DEFAULTS : TEXT_SHADOW_STYLES_DEFAULTS;

	// Handle drop-shadow() wrapper for dropShadow type
	let shadowString = shadowStyle.trim();
	if (type === 'dropShadow' && shadowString.startsWith('drop-shadow(') && shadowString.endsWith(')')) {
		// Extract the content inside drop-shadow()
		shadowString = shadowString.slice(12, -1); // Remove 'drop-shadow(' and ')'
	}

	const parts = shadowString.split(' ');

	let currentColorValue = '';
	let currentXValue = '';
	let currentYValue = '';
	let currentBlurValue = '';
	let currentSpreadValue = '';
	let currentInsetValue = false;

	// Handle inset keyword for box shadows
	let startIndex = 0;
	if (type === 'boxShadow' && parts[0] === 'inset') {
		currentInsetValue = true;
		startIndex = 1;
	}

	// Parse the remaining parts
	const remainingParts = parts.slice(startIndex);

	if (remainingParts.length >= 4) {
		// Format: x y blur [spread] color
		currentXValue = remainingParts[0].includes(shadowDefaults.x.var) ? '' : remainingParts[0];
		currentYValue = remainingParts[1].includes(shadowDefaults.y.var) ? '' : remainingParts[1];
		currentBlurValue = remainingParts[2].includes(shadowDefaults.blur.var) ? '' : remainingParts[2];

		// Check if we have a spread value (4th part before color)
		if (remainingParts.length === 5) {
			currentSpreadValue = remainingParts[3].includes(shadowDefaults.spread.var) ? '' : remainingParts[3];
			currentColorValue = remainingParts[4].includes(shadowDefaults.color.var) ? '' : remainingParts[4];
		} else {
			currentColorValue = remainingParts[3].includes(shadowDefaults.color.var) ? '' : remainingParts[3];
		}
	} else if (remainingParts.length === 3) {
		// Format: x y blur color (text shadow or box shadow without spread)
		currentXValue = remainingParts[0].includes(shadowDefaults.x.var) ? '' : remainingParts[0];
		currentYValue = remainingParts[1].includes(shadowDefaults.y.var) ? '' : remainingParts[1];
		currentBlurValue = remainingParts[2].includes(shadowDefaults.blur.var) ? '' : remainingParts[2];
	}

	return {
		color: currentColorValue,
		x: currentXValue,
		y: currentYValue,
		blur: currentBlurValue,
		spread: currentSpreadValue,
		inset: currentInsetValue,
	};
}

/**
 * Creates a shadow style string from component parts
 * @param {Object} shadowParts - Object containing color, x, y, blur, spread, and inset properties
 * @param {string} type - The shadow type ('boxShadow', 'textShadow', or 'dropShadow')
 * @returns {string} The formatted shadow string
 */
export function createShadowStyleString(shadowParts, type = 'boxShadow') {
	const shadowDefaults = type === 'boxShadow' ? SHADOW_STYLES_DEFAULTS : TEXT_SHADOW_STYLES_DEFAULTS;

	const { color = '', x = '', y = '', blur = '', spread = '', inset = false } = shadowParts;

	// Use placeholder values for empty parts
	const colorToUse = color || shadowDefaults.color.var;
	const xToUse = x || shadowDefaults.x.var;
	const yToUse = y || shadowDefaults.y.var;
	const blurToUse = blur || shadowDefaults.blur.var;
	const spreadToUse = spread || shadowDefaults.spread.var;

	// Build shadow string with correct CSS order: [inset] x y blur [spread] color
	let shadowString = '';

	if (type === 'boxShadow') {
		// Box shadow format: [inset] x y blur [spread] color
		if (inset) {
			shadowString += 'inset ';
		}
		shadowString += `${xToUse} ${yToUse} ${blurToUse}`;
		if (spreadToUse !== shadowDefaults.spread.var) {
			shadowString += ` ${spreadToUse}`;
		}
		shadowString += ` ${colorToUse}`;
	} else if (type === 'dropShadow') {
		// Drop shadow format: x y blur color (no spread or inset)
		shadowString = `${xToUse} ${yToUse} ${blurToUse} ${colorToUse}`;
		// Wrap in drop-shadow() function
		shadowString = `drop-shadow(${shadowString})`;
	} else {
		// Text shadow format: x y blur color (no spread or inset)
		shadowString = `${xToUse} ${yToUse} ${blurToUse} ${colorToUse}`;
	}

	return shadowString.trim();
}
