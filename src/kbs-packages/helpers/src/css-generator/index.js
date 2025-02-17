import getDeviceAttributeSlug from '../get-device-attribute-slug';

/**
 * CSS Generator class for building CSS strings
 */
class CSSGenerator {
    constructor( selector = '' ) {
        this.rules = new Map();
        this.currentSelector = selector;
    }

    /**
     * Set the current selector for subsequent property additions
     * @param {string} selector - The CSS selector
     * @returns {CSSGenerator} - Returns this instance for chaining
     */
    setSelector(selector) {
        this.currentSelector = selector;
        return this;
    }
    /**
     * Add a CSS attribute to the current selector
     * @param {string} key - The key of the attribute
     * @param {Object} meta - The metadata of the attribute
     * @param {Object} props - The props of the block
     * @returns {CSSGenerator} - Returns this instance for chaining
     */
    addAttribute( key, meta, props ) {
        const { attributes, previewDevice } = props;
        if ( ! attributes ) {
            return this;
        }
        // Check if the attribute exists in the attributes object
        if ( attributes?.[ key ] ) {
            if ( ! meta?.property ) {
                return this;
            }
            if ( ! meta?.selector ) {
                return this;
            }
            switch ( meta.property ) {
                case 'flex-direction':
                    this.renderStringProperty( attributes[ key ], meta.selector, previewDevice );
                    break;
            }
            console.log( 'key', key );
            console.log( 'attributes[ key ]', attributes[ key ] );
            console.log( 'meta', meta );
        }
        return this;
    }
    /**
     * Get the preview property
     * @param {string} attributeValue - The value of the attribute
     * @param {string} previewDevice - The preview device
     * @returns {string} - The preview property
     */
    getPreviewProperty( attributeValue, previewDevice ) {
        const mobile = getDeviceAttributeSlug( 'mobile' );
        const tablet = getDeviceAttributeSlug( 'tablet' );
        const desktop = getDeviceAttributeSlug( 'desktop' );
        if (previewDevice === 'Mobile') {
            if (undefined !== attributeValue?.[mobile] && '' !== attributeValue?.[mobile] && null !== attributeValue?.[mobile]) {
                return attributeValue?.[mobile];
            } else if (undefined !== attributeValue?.[tablet] && '' !== attributeValue?.[tablet] && null !== attributeValue?.[tablet]) {
                return attributeValue?.[tablet];
            }
        } else if (previewDevice === 'Tablet') {
            if (undefined !== attributeValue?.[tablet] && '' !== attributeValue?.[tablet] && null !== attributeValue?.[tablet]) {
                return attributeValue?.[tablet];
            }
        }
        return undefined !== attributeValue?.[desktop] && '' !== attributeValue?.[desktop] && null !== attributeValue?.[desktop] ? attributeValue?.[desktop] : '';
    }
    /**
     * Render the flex direction
     * @param {string} attributeValue - The value of the attribute
     * @param {string} selector - The CSS selector
     * @param {string} previewDevice - The preview device
     */
    renderStringProperty( attributeValue, selector, previewDevice ) {
        const propertyValue = String( this.getPreviewProperty( attributeValue, previewDevice ) );
        if ( ! propertyValue ) {
            return this;
        }
        this.add( { [ selector ]: propertyValue } );
    }
    /**
     * Add CSS properties to the current selector
     * @param {Object} properties - Object containing CSS properties and values
     * @returns {CSSGenerator} - Returns this instance for chaining
     */
    add(properties) {
        if (!this.currentSelector || !properties || Object.keys(properties).length === 0) {
            return this;
        }

        const existingProperties = this.rules.get(this.currentSelector) || {};
        this.rules.set(this.currentSelector, { ...existingProperties, ...properties });
        return this;
    }

    /**
     * Add CSS rules for a specific selector
     * @param {string} selector - The CSS selector
     * @param {Object} properties - Object containing CSS properties and values
     * @returns {CSSGenerator} - Returns this instance for chaining
     */
    addRule(selector, properties) {
        this.setSelector(selector);
        return this.add(properties);
    }

    /**
     * Generate the final CSS string
     * @returns {string} - The generated CSS string
     */
    generate() {
        let css = '';
        this.rules.forEach((properties, selector) => {
            css += this._generateRuleString(selector, properties);
        });
        return css;
    }

    /**
     * Generate a CSS rule string for a selector and its properties
     * @private
     * @param {string} selector - The CSS selector
     * @param {Object} properties - Object containing CSS properties and values
     * @returns {string} - The generated CSS rule string
     */
    _generateRuleString(selector, properties) {
        if (!properties || Object.keys(properties).length === 0) {
            return '';
        }

        let ruleString = `${selector} {\n`;
        Object.entries(properties).forEach(([property, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                ruleString += `    ${property}: ${value};\n`;
            }
        });
        ruleString += '}\n';
        return ruleString;
    }
}

export default CSSGenerator;
