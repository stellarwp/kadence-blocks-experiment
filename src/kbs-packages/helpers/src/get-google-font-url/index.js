/**
 * Build a Google Font URL from block attributes
 */

/**
 * Get the suffix part of an attribute name (part after the underscore)
 * @param {string} attributeName - The full attribute name
 * @returns {string} The attribute suffix or empty string if no suffix
 */
const getAttributeSuffix = (attributeName) => {
    const parts = attributeName.split('_');
    return parts.length > 1 ? parts[1] : '';
};

/**
 * Group font attributes by their suffix
 * @param {Object} attributes - Block attributes
 * @param {Object} attributesMeta - Block attributes metadata
 * @returns {Object} Grouped font attributes
 */
const groupFontAttributes = (attributes, attributesMeta) => {
    const fontGroups = {};

    // Find all font-family and font-weight attributes
    Object.entries(attributesMeta).forEach(([key, meta]) => {
        if (!meta.renderCSS || !meta.property) {
            return;
        }

        if (meta.property !== 'font-family' && meta.property !== 'font-weight') {
            return;
        }

        const suffix = getAttributeSuffix(key);
        const groupKey = suffix || 'default';

        if (!fontGroups[groupKey]) {
            fontGroups[groupKey] = {};
        }

        if (meta.property === 'font-family') {
            fontGroups[groupKey].family = attributes[key];
            fontGroups[groupKey].familyMeta = meta;
        } else if (meta.property === 'font-weight') {
            fontGroups[groupKey].weight = attributes[key];
            fontGroups[groupKey].weightMeta = meta;
        }
    });

    return fontGroups;
};

/**
 * Check if a font is a Google font
 * @param {string} fontFamily - The font family name
 * @returns {boolean} Whether the font is a Google font
 */
const isGoogleFont = (fontFamily) => {
    if (!fontFamily || typeof kadence_blocks_params === 'undefined' || !kadence_blocks_params.g_fonts) {
        return false;
    }
    return !!kadence_blocks_params.g_fonts[fontFamily];
};

/**
 * Build the Google Font URL from the font groups
 * @param {Object} fontGroups - Grouped font attributes
 * @returns {string} The Google Font URL
 */
const buildGoogleFontURL = (fontGroups) => {
    const fonts = new Map();

    // Process each font group
    Object.values(fontGroups).forEach(group => {
        // Get font family for all device sizes
        const fontFamilies = [
            group.family?.dt,
            group.family?.td,
            group.family?.mb
        ].filter(Boolean);

        // Get weights for all device sizes
        const weights = [
            group.weight?.dt, 
            group.weight?.td,
            group.weight?.mb,
            '400' // Default weight
        ].filter(Boolean);

        // Process each font family
        fontFamilies.forEach(fontFamily => {
            if (!isGoogleFont(fontFamily)) {
                return;
            }

            if (fonts.has(fontFamily)) {
                const existingWeights = fonts.get(fontFamily);
                weights.forEach(weight => {
                    if (!existingWeights.includes(weight)) {
                        existingWeights.push(weight);
                    }
                });
            } else {
                fonts.set(fontFamily, [...new Set(weights)]);
            }
        });
    });

    if (fonts.size === 0) {
        return '';
    }

    // Build the URL
    const familyStrings = [];
    fonts.forEach((weights, family) => {
        const weightString = weights.join(',');
        familyStrings.push(`${family.replace(/ /g, '+')}:${weightString}`);
    });

    return `https://fonts.googleapis.com/css?family=${familyStrings.join('|')}&display=swap`;
};

/**
 * Get Google Font URL from block attributes
 * @param {Object} attributes - Block attributes
 * @param {Object} attributesMeta - Block attributes metadata
 * @returns {string} The Google Font URL
 */
export default function getGoogleFontUrl(attributes, attributesMeta) {
    if (!attributes || !attributesMeta) {
        return '';
    }

    const fontGroups = groupFontAttributes(attributes, attributesMeta);
    return buildGoogleFontURL(fontGroups);
} 