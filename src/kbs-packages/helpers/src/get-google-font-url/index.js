/**
 * Build a Google Font URL from block attributes
 */

/**
 * Group font attributes by their suffix
 * @param {Object} attributes - Block attributes
 * @param {Object} attributesMeta - Block attributes metadata
 * @returns {Object} Grouped font attributes
 */
const groupFontAttributes = (attributes, attributesMeta) => {
    const fontGroups = {};

    // Find all typography attributes
    Object.entries(attributesMeta).forEach(([key, meta]) => {
        if (!meta.renderCSS || !meta.property) {
            return;
        }

        if (meta.property !== 'typography') {
            return;
        }

        if (!attributes[key]) {
            return;
        }

        const typography = attributes[key];
        
        fontGroups[key] = {
            family: {
                dt: typography?.dt?.fontFamily,
                td: typography?.td?.fontFamily,
                mb: typography?.mb?.fontFamily
            },
            weight: {
                dt: typography?.dt?.fontWeight || '400',
                td: typography?.td?.fontWeight || '400',
                mb: typography?.mb?.fontWeight || '400'
            },
            source: {
                dt: typography?.dt?.fontSource || '',
                td: typography?.td?.fontSource || '',
                mb: typography?.mb?.fontSource || ''
            }
        };
    });

    return fontGroups;
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
        // Create a mapping of font families to their device sizes
        const deviceFonts = {
            dt: { family: group.family?.dt, weight: group.weight?.dt, source: group.source?.dt },
            td: { family: group.family?.td, weight: group.weight?.td, source: group.source?.td },
            mb: { family: group.family?.mb, weight: group.weight?.mb, source: group.source?.mb }
        };

        // For each device size, if it has a weight but no family, find the closest parent's family and source
        ['mb', 'td', 'dt'].forEach((device, index, devices) => {
            if (deviceFonts[device].weight && !deviceFonts[device].family) {
                // Look for closest parent with a font family
                for (let i = index + 1; i < devices.length; i++) {
                    if (deviceFonts[devices[i]].family) {
                        deviceFonts[device].family = deviceFonts[devices[i]].family;
                        deviceFonts[device].source = deviceFonts[devices[i]].source;
                        break;
                    }
                }
            }
        });

        // Process fonts for each device size
        Object.values(deviceFonts).forEach(({ family, weight, source }) => {
            if (!family || !source) {
                return;
            }

            // Handle Google fonts
            if (source === 'google') {
                if (fonts.has(family)) {
                    const existingWeights = fonts.get(family);
                    if (weight && !existingWeights.includes(weight)) {
                        existingWeights.push(weight);
                    }
                } else {
                    fonts.set(family, weight ? [weight] : ['400']);
                }
            }
        });
    });

    if (fonts.size === 0) {
        return '';
    }

    // Build the URL using CSS2 endpoint
    const familyStrings = [];
    fonts.forEach((weights, family) => {
        // Sort weights numerically for consistent output
        const sortedWeights = [...new Set(weights)].sort((a, b) => parseInt(a) - parseInt(b));
        
        // For variable fonts, we'll use the wght axis
        // Convert the family name to the CSS2 format (no + signs, uses encoded spaces)
        const familyName = encodeURIComponent(family);
        
        // Add the weights as a variable axis range or specific weights
        const weightString = sortedWeights.length === 1 
            ? `:wght@${sortedWeights[0]}` 
            : `:wght@${sortedWeights.join(';')}`;
            
        familyStrings.push(`family=${familyName}${weightString}`);
    });

    return `https://fonts.googleapis.com/css2?${familyStrings.join('&')}&display=swap`;
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