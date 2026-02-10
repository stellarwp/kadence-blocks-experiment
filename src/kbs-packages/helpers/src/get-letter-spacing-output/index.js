import { LETTER_SPACING_SIZES_MAP } from '../constants';
/**
 * Get the color option output
 * @param {string} value - The value of the attribute
 * @returns {string} - The color option output
 */
export default function getLineHeightOutput(value) {
	if (undefined === value) {
		return '';
	}
	if (!LETTER_SPACING_SIZES_MAP) {
		return value;
	}
	if (value === '0') {
		return '0';
	}
	if (value === 0) {
		return '0';
	}
	const found = LETTER_SPACING_SIZES_MAP.find((option) => option.value === value);
	if (!found) {
		return value;
	}
	return found.output;
}
