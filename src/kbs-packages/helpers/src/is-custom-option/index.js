/**
 * Helper function to handle attribute changes in Kadence controls
 *
 * @param {Object} controls The controls object
 * @param {Object} advancedControls The advanced controls object
 * @param {string} value The value to check
 */
export const isCustomOption = (controls, value, key = 'key') => {
	if (!value) {
		return false;
	}
	// Check if the value is not in the controls array and is in the advanced controls array.
	// Look for it in the align key of each object in the array.
	if (!controls.some((control) => control?.[key] === value)) {
		return true;
	}

	return false;
};
