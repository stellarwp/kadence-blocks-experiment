/**
 * Parses a quantity and unit from a raw string value, given a list of allowed
 * units and otherwise falling back to the default unit.
 *
 * @param rawValue     The raw value as a string (may or may not contain the unit)
 * @param allowedUnits Units to derive from.
 * @return The extracted quantity and unit. The quantity can be `undefined` in case the raw value
 * could not be parsed to a number correctly. The unit can be `undefined` in case the unit parsed
 * from the raw value could not be matched against the list of allowed units.
 */
export function parseUnitTypeFromRawValue(rawValue, allowedUnits) {
	let trimmedValue;
	// create a simple array from allowedUnits, exclude empty values
	const allowedUnitsArray = allowedUnits.filter((unit) => unit.value !== '').map((unit) => unit.value);
	if (typeof rawValue !== 'undefined' || rawValue === null) {
		trimmedValue = `${rawValue}`.trim();
	}
	// if trimmedValue is empty, return empty string
	if (trimmedValue === '') {
		return 'default';
	}
	const unitMatch = trimmedValue?.match(/[\d.\-\+]*\s*(.*)/);
	const matchedUnit = unitMatch?.[1]?.toLowerCase();
	let unitToReturn;
	if (allowedUnitsArray.includes(matchedUnit)) {
		unitToReturn = 'matched';
	} else {
		unitToReturn = 'unmatched';
	}

	return unitToReturn;
}

/**
 * Extracts the unit from a raw value if it matches the allowed units, otherwise returns null.
 *
 * @param {string} rawValue     The raw value as a string (may or may not contain the unit)
 * @param {Array}  allowedUnits Units to match against.
 * @return {string|undefined} The extracted unit if matched, null otherwise.
 */
export function getUnitFromRawValue(rawValue, allowedUnits) {
	let trimmedValue;
	// create a simple array from allowedUnits, exclude empty values
	const allowedUnitsArray = allowedUnits.filter((unit) => unit.value !== '').map((unit) => unit.value);

	if (typeof rawValue !== 'undefined' && rawValue !== null) {
		trimmedValue = `${rawValue}`.trim();
	} else {
		return undefined;
	}

	// if trimmedValue is empty, return undefined
	if (trimmedValue === '') {
		return undefined;
	}

	const unitMatch = trimmedValue.match(/[\d.\-\+]*\s*(.*)/);
	const matchedUnit = unitMatch?.[1]?.toLowerCase();

	if (allowedUnitsArray.includes(matchedUnit)) {
		return matchedUnit;
	}

	return undefined;
}

/**
 * Extracts the numeric part from a raw value string.
 *
 * @param {string} rawValue The raw value as a string (may contain both number and unit)
 * @return {number|undefined} The extracted number if valid, undefined otherwise.
 */
export function getNumberFromRawValue(rawValue) {
	if (typeof rawValue === 'undefined' || rawValue === null) {
		return undefined;
	}

	const trimmedValue = `${rawValue}`.trim();

	// If trimmedValue is empty, return undefined
	if (trimmedValue === '') {
		return undefined;
	}

	// Extract numeric part from the string
	const numberMatch = trimmedValue.match(/^([-+]?\d*\.?\d+)/);
	const numberStr = numberMatch?.[1];

	if (numberStr) {
		const number = parseFloat(numberStr);
		// Check if the parsed number is valid
		return !isNaN(number) ? number : undefined;
	}

	return undefined;
}

/**
 * Parses a quantity and unit from a raw string value, given a list of allowed
 * units and otherwise falling back to the default unit.
 *
 * @param rawValue     The raw value as a string (may or may not contain the unit)
 * @param controls     The radio button controls to derive from.
 * @return The extracted quantity and unit. The quantity can be `undefined` in case the raw value
 * could not be parsed to a number correctly. The unit can be `undefined` in case the unit parsed
 * from the raw value could not be matched against the list of allowed units.
 */
export function parseValueTypeFromRawValue(rawValue, controls) {
	const trimmedValue = `${rawValue}`.trim();
	if (trimmedValue === '') {
		return true;
	}
	const match = controls.find((control) => control.key === trimmedValue);
	if (match) {
		return true;
	}
	return false;
}
