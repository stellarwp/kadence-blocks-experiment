/**
 * Build a Google Font URL from block attributes
 */

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

    // Track unique font families and their weights
    const fonts = new Map();

    // Loop through attributesMeta to find typography properties
    Object.entries(attributesMeta).forEach(([key, meta]) => {
        if (meta.property === 'typography') {
            const typographyValues = attributes[key];
            
            if (typographyValues) {
                Object.values(typographyValues).forEach(value => {
                    if (value?.fontFamily && value?.fontSource === 'google') {
                        // Get or initialize font weights array
                        const weights = fonts.get(value.fontFamily) || new Set();
                        
                        // Add the font weight if specified
                        if (value.fontWeight) {
                            // Convert 'regular' to '400'
                            const weight = value.fontWeight === 'regular' ? '400' : value.fontWeight;
                            weights.add(weight);
                        }
                        
                        fonts.set(value.fontFamily, weights);
                    }
                });
            }
        }
    });

    // If no Google fonts found, return empty string
    if (fonts.size === 0) {
        return '';
    }

    // Build the Google Fonts URL with separate family parameters
    const baseUrl = 'https://fonts.googleapis.com/css2';
    const familyParams = Array.from(fonts.entries()).map(([family, weights]) => {
        const weightStr = weights.size > 0 ? `:${Array.from(weights).join(',')}` : '';
        return `family=${encodeURIComponent(family + weightStr)}`;
    }).join('&');

    // Build final URL with display=swap for better performance
    const url = `${baseUrl}?${familyParams}&display=swap`;

    console.log(url);

    return url;
}