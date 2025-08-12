import { BaseComponentGenerator } from './base-generator';

/**
 * Transform component CSS generator
 */
export class TransformGenerator extends BaseComponentGenerator {
	/**
	 * Generate CSS for transform component
	 * @param {string} attributeName - The attribute name
	 * @param {Object} meta - Component metadata
	 * @param {Object} resolvedValues - Pre-resolved component values
	 */
	generate(attributeName, meta, resolvedValues) {
		// Build transform string from resolved values
		const transformStrings = [];
		const { scale, translate, rotate, skew, origin } = this.extractTransformValues(resolvedValues);

		// Process translate
		if (translate?.value) {
			const x = translate.value.x || '0px';
			const y = translate.value.y || '0px';
			if (x !== '0px' || y !== '0px') {
				transformStrings.push(`translate(${x}, ${y})`);
			}
		}

		// Process rotate
		if (rotate?.value) {
			if (rotate.value.x && rotate.value.x !== '0deg') {
				transformStrings.push(`rotateX(${rotate.value.x})`);
			}
			if (rotate.value.y && rotate.value.y !== '0deg') {
				transformStrings.push(`rotateY(${rotate.value.y})`);
			}
			if (rotate.value.z && rotate.value.z !== '0deg') {
				transformStrings.push(`rotateZ(${rotate.value.z})`);
			}
		}

		// Process scale
		if (scale?.value) {
			const x = parseFloat(scale.value.x || '100') / 100;
			const y = parseFloat(scale.value.y || '100') / 100;
			
			if (x !== 1 || y !== 1) {
				transformStrings.push(`scale(${x}, ${y})`);
			}
		}

		// Process skew
		if (skew?.value) {
			const x = skew.value.x || '0deg';
			const y = skew.value.y || '0deg';
			if (x !== '0deg' || y !== '0deg') {
				transformStrings.push(`skew(${x}, ${y})`);
			}
		}

		// Apply transform if we have any transforms
		if (transformStrings.length > 0) {
			// Create a pseudo resolved value for the transform property
			const transformValue = {
				value: transformStrings.join(' '),
				source: 'direct'
			};
			// Pass the key with Hover suffix if the attribute name has it
			// This allows base generator's getSelector to handle hover state
			const transformKey = attributeName.endsWith('Hover') ? 'transformHover' : 'transform';
			this.applyProperty(transformKey, transformValue, meta);
		}

		// Apply transform-origin if set
		if (origin?.value) {
			const x = origin.value.x || '50%';
			const y = origin.value.y || '50%';
			if (x !== '50%' || y !== '50%') {
				// Use applyProperty for consistent hover handling
				const originValue = {
					value: `${x} ${y}`,
					source: 'direct'
				};
				// Pass the key with Hover suffix if needed
				const originKey = attributeName.endsWith('Hover') ? 'originHover' : 'origin';
				this.applyProperty(originKey, originValue, meta);
			}
		}
	}

	/**
	 * Extract transform values from resolved values
	 * @param {Object} resolvedValues - The resolved values
	 * @returns {Object} - Extracted transform values
	 */
	extractTransformValues(resolvedValues) {
		return {
			scale: resolvedValues.scale,
			translate: resolvedValues.translate,
			rotate: resolvedValues.rotate,
			skew: resolvedValues.skew,
			origin: resolvedValues.origin,
		};
	}

	/**
	 * For hover transforms, we need to merge with base transform values
	 * This should be handled at the resolution level in the future
	 */
	mergeWithBaseTransform(hoverValues, baseAttributeName) {
		// This logic would ideally be moved to the resolution phase
		// For now, keeping it simple and assuming the resolution handles it
		return hoverValues;
	}
}