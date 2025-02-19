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
            }
        };
    });

    console.log(fontGroups);

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
        // Create a mapping of font families to their device sizes
        const deviceFonts = {
            dt: { family: group.family?.dt, weight: group.weight?.dt },
            td: { family: group.family?.td, weight: group.weight?.td },
            mb: { family: group.family?.mb, weight: group.weight?.mb }
        };

        // For each device size, if it has a weight but no family, find the closest parent's family
        ['mb', 'td', 'dt'].forEach((device, index, devices) => {
            if (deviceFonts[device].weight && !deviceFonts[device].family) {
                // Look for closest parent with a font family
                for (let i = index + 1; i < devices.length; i++) {
                    if (deviceFonts[devices[i]].family) {
                        deviceFonts[device].family = deviceFonts[devices[i]].family;
                        break;
                    }
                }
            }
        });

        // Process fonts for each device size
        Object.values(deviceFonts).forEach(({ family, weight }) => {
            if (!family || !isGoogleFont(family)) {
                return;
            }

            if (fonts.has(family)) {
                const existingWeights = fonts.get(family);
                if (weight && !existingWeights.includes(weight)) {
                    existingWeights.push(weight);
                }
            } else {
                fonts.set(family, weight ? [weight] : ['400']);
            }
        });
    });

    if (fonts.size === 0) {
        return '';
    }

    // Build the URL
    const familyStrings = [];
    fonts.forEach((weights, family) => {
        const weightString = [...new Set(weights)].join(',');
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