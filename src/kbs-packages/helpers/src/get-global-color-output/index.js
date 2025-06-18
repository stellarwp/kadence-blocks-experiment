/**
 * Get the color option output
 * @param {string} value - The value of the attribute
 * @returns {string} - The color option output
 */
export default function getGlobalColorOutput(value) {
	if (undefined === value) {
		return '';
	}
	if (value && value.startsWith('palette')) {
		//value = 'var(--global-' + value + ')';
		value = 'var(--global-' + value + ')';
	}
	return value;
}
