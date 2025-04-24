import { select } from '@wordpress/data';

/**
 * Get preset values from global styles
 * 
 * This function retrieves the preset value for a block attribute from global styles.
 * It handles the inheritance chain: block attribute > block preset > global style
 * 
 * @param {string} attributeName - The attribute name (e.g., 'typography')
 * @param {object} attributes - The block attributes
 * @param {string} device - The current device (e.g., 'desktop', 'tablet', 'mobile')
 * @param {string} type - The specific property type (e.g., 'fontFamily')
 * @param {object} globalStylesIds - The global styles IDs passed from the component
 * @returns {*} - The value from the preset for the given attribute and device
 */
export default function getPresetValue(attributeName, attributes, device, type, mergedGlobalStyle, basePresetKey = null) {
    // Check if the block's attribute has a preset defined
    const attriubtePresetKey = basePresetKey ? basePresetKey : attributes?.[attributeName]?.preset;
    if ( basePresetKey !== null && undefined === attriubtePresetKey) {
        return { value: undefined, source: undefined };
    }

	// if( type === 'fontFamily' ){
	// 	console.log('attriubtePresetKey', attriubtePresetKey);
    //     console.log( 'mergedGlobalStyle' );
    //     console.log( mergedGlobalStyle );
	// }

    const presetData = getPresetData(attriubtePresetKey, attributeName, mergedGlobalStyle);

    // Get the preset value from the merged global style
    if( presetData ) {
        // Find the attriubte value in the preset data
        const attributeValue = presetData?.attributes?.[device.toLowerCase()]?.[type];

        if( attributeValue ) {
            return { value: attributeValue, source: 'preset' };
        }

    }

    return { value: undefined, source: undefined };
} 


const getPresetData = (presetKey, componentType, mergedGlobalStyle) => {
    return mergedGlobalStyle?.components?.[componentType]?.presets?.[presetKey];
}