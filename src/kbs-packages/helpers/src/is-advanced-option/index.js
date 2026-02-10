/**
 * Helper function to handle attribute changes in Kadence controls
 *
 * @param {Object} controls The controls object
 * @param {Object} advancedControls The advanced controls object
 * @param {string} value The value to check
 */
export const isAdvancedOption = (controls, advancedControls, value, key = 'key') => {
	if (!Array.isArray(value)) {
		if (!value) {
			return false;
		}
		// Check if the value is not in the controls array and is in the advanced controls array.
		// Look for it in the key of each object in the array.
		if (
			!controls.some((control) => control?.[key] === value) &&
			advancedControls.some((control) => control?.[key] === value)
		) {
			return true;
		}

		return false;
	}
	if (!value || !controls) {
		return false;
	}
	// Check if all items in the value array are the same
	if (value.length > 0) {
		const firstItem = value[0];
		return !value.every((item) => item === firstItem);
	}
	return false;
};
