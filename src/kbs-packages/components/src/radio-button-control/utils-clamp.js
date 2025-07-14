/**
 * Utility functions for handling CSS clamp() values
 */

/**
 * Parse a clamp value into its components
 * @param {string} value - The clamp value to parse (e.g., "clamp(14px, 1rem + 1vw, 24px)")
 * @returns {Object|null} - Object with min, preferred, and max values, or null if not a clamp
 */
export const parseClampValue = (value) => {
	if (!value || typeof value !== 'string' || !value.startsWith('clamp(')) {
		return null;
	}

	// Extract the content inside clamp()
	const match = value.match(/^clamp\s*\(\s*([^,]+)\s*,\s*([^,]+)\s*,\s*([^)]+)\s*\)$/);
	if (!match) {
		return null;
	}

	return {
		min: match[1].trim(),
		preferred: match[2].trim(),
		max: match[3].trim(),
	};
};

/**
 * Extract numeric value and unit from a CSS value
 * @param {string} value - CSS value like "16px" or "1.5rem"
 * @returns {Object} - Object with numeric value and unit
 */
export const parseValueAndUnit = (value) => {
	if (!value || typeof value !== 'string') {
		return { value: '', unit: 'px' };
	}

	const match = value.match(/^(-?\d*\.?\d+)\s*([a-zA-Z%]+)?$/);
	if (!match) {
		return { value: '', unit: 'px' };
	}

	return {
		value: parseFloat(match[1]),
		unit: match[2] || 'px',
	};
};

/**
 * Calculate the preferred (middle) value for clamp based on min and max
 * @param {string} min - Minimum value (e.g., "14px")
 * @param {string} max - Maximum value (e.g., "24px")
 * @param {number} minViewport - Minimum viewport width (default: 500)
 * @param {number} maxViewport - Maximum viewport width (default: 1200)
 * @returns {string} - Calculated preferred value
 */
export const calculatePreferredValue = (min, max, minViewport = 500, maxViewport = 1200) => {
	const minParsed = parseValueAndUnit(min);
	const maxParsed = parseValueAndUnit(max);

	// If units don't match or values are invalid, return a simple formula
	if (!minParsed.value || !maxParsed.value || minParsed.unit !== maxParsed.unit) {
		return '1rem + 1vw';
	}

	// Convert to rem for calculation if needed
	let minInRem = minParsed.value;
	let maxInRem = maxParsed.value;

	if (minParsed.unit === 'px') {
		minInRem = minParsed.value / 16; // Assuming 16px = 1rem
		maxInRem = maxParsed.value / 16;
	}

	// Calculate the base rem value (closer to minimum)
	const baseRem = minInRem + (maxInRem - minInRem) * 0.25;
	
	// Calculate viewport unit to scale from min to max
	const viewportRange = maxViewport - minViewport;
	const sizeRange = maxInRem - minInRem;
	const viewportUnit = (sizeRange / viewportRange) * 100;

	// Round to reasonable precision
	const roundedBase = Math.round(baseRem * 100) / 100;
	const roundedViewport = Math.round(viewportUnit * 100) / 100;

	return `${roundedBase}rem + ${roundedViewport}vw`;
};

/**
 * Calculate preferred value with custom viewport widths using precise calc formula
 * @param {string} min - Minimum value (e.g., "14px")
 * @param {string} max - Maximum value (e.g., "24px") 
 * @param {number} minViewport - Minimum viewport width
 * @param {number} maxViewport - Maximum viewport width
 * @returns {string} - Calculated preferred value as calc expression
 */
export const calculatePreferredValueWithViewports = (min, max, minViewport, maxViewport) => {
	const minParsed = parseValueAndUnit(min);
	const maxParsed = parseValueAndUnit(max);

	// If units don't match, return fallback
	if (!minParsed.value || !maxParsed.value || minParsed.unit !== maxParsed.unit) {
		return calculatePreferredValue(min, max, minViewport, maxViewport);
	}

	// Use the same unit as the input values
	const unit = minParsed.unit;
	const minValue = minParsed.value;
	const maxValue = maxParsed.value;

	// Create a calc expression that scales linearly between viewports
	// Formula: min + (max - min) * ((100vw - minVp) / (maxVp - minVp))
	// Note: We need to include the unit with the difference value for calc to work properly
	const difference = maxValue - minValue;
	const viewportRange = maxViewport - minViewport;
	
	return `calc(${minValue}${unit} + ${difference}${unit} * ((100vw - ${minViewport}px) / ${viewportRange}))`;
};

/**
 * Generate a clamp value from mobile and desktop sizes
 * @param {string} mobile - Mobile/minimum size
 * @param {string} desktop - Desktop/maximum size
 * @param {number} mobileViewport - Mobile viewport width (optional)
 * @param {number} desktopViewport - Desktop viewport width (optional)
 * @returns {string} - Generated clamp value
 */
export const generateClampValue = (mobile, desktop, mobileViewport, desktopViewport) => {
	if (!mobile || !desktop) {
		return '';
	}

	let preferred;
	if (mobileViewport && desktopViewport) {
		preferred = calculatePreferredValueWithViewports(mobile, desktop, mobileViewport, desktopViewport);
	} else {
		preferred = calculatePreferredValue(mobile, desktop);
	}
	
	return `clamp(${mobile}, ${preferred}, ${desktop})`;
};

/**
 * Check if a value is a clamp expression
 * @param {string} value - Value to check
 * @returns {boolean} - True if value is a clamp expression
 */
export const isClampValue = (value) => {
	return value && typeof value === 'string' && value.trim().startsWith('clamp(');
};

/**
 * Parse viewport values from a clamp calc expression
 * @param {string} preferred - The preferred/middle value from clamp
 * @returns {Object} - Object with minViewport and maxViewport
 */
export const parseViewportsFromPreferred = (preferred) => {
	if (!preferred || typeof preferred !== 'string') {
		return { minViewport: 320, maxViewport: 1200 };
	}

	// Try to match the calc pattern with viewport values
	// Pattern: calc(...px + (...px) * ((100vw - XXXpx) / YYY))
	const match = preferred.match(/\(100vw\s*-\s*(\d+)px\)\s*\/\s*(\d+)/); 
	
	if (match) {
		const minViewport = parseInt(match[1]);
		const divisor = parseInt(match[2]);
		// maxViewport = minViewport + divisor
		const maxViewport = minViewport + divisor;
		return { minViewport, maxViewport };
	}

	// Default viewport values
	return { minViewport: 500, maxViewport: 1200 };
};

/**
 * Get mobile and desktop values from a clamp or regular value
 * @param {string} value - The value to parse
 * @returns {Object} - Object with mobile, desktop values and viewport widths
 */
export const getClampOrSimpleValues = (value) => {
	if (!value) {
		return { 
			mobile: '', 
			desktop: '',
			mobileViewport: 500,
			desktopViewport: 1200
		};
	}

	const clampParsed = parseClampValue(value);
	
	if (clampParsed) {
		const viewports = parseViewportsFromPreferred(clampParsed.preferred);
		return {
			mobile: clampParsed.min,
			desktop: clampParsed.max,
			mobileViewport: viewports.minViewport,
			desktopViewport: viewports.maxViewport
		};
	}

	// If it's a simple value, use it for both mobile and desktop
	return {
		mobile: value,
		desktop: value,
		mobileViewport: 500,
		desktopViewport: 1200
	};
};