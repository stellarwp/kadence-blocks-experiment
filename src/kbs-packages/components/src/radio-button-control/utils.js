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
