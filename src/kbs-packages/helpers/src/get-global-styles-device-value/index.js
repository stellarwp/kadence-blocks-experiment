/**
 * Get device-specific value from global styles JSON
 * 
 * @param {string} attributeName - The component key in the global styles JSON (e.g., 'typography', 'flex')
 * @param {string} presetKey - The preset key to look for (e.g., 'base')
 * @param {object} globalStylesJson - The global styles JSON object
 * @param {string} device - The device to get the value for (e.g., 'desktop', 'tablet', 'mobile')
 * @param {string} type - The specific attribute type to retrieve (e.g., 'fontFamily', 'direction')
 * @returns {string|object} - The value found in the global styles JSON or empty string if not found
 */
export default function getGlobalStylesDeviceValue(attributeName, globalStylesJson, device, type) {
    // If any required parameters are missing, return empty string
    if (!attributeName || !globalStylesJson || !device || !type) {
        return '';
    }

    // Check if the component exists in the global styles JSON
    if (!globalStylesJson?.components?.[attributeName]) {
        return '';
    }

    // Check if the preset exists for the component
    if (!globalStylesJson.components[attributeName]?.presets?.base?.attributes[attributeName]?.[device]?.[type] ) {
        console.log( 'Could not find preset', globalStylesJson );
        return '';
    }

    const preset = globalStylesJson.components[attributeName]?.presets?.base?.attributes[attributeName]?.[device]?.[type];

    if( preset ) {
        return preset;
    }

    // TODO: Loop through all device sizes

    // If no match found, return empty string
    return '';
} 