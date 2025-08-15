import { BaseComponentGenerator } from './base-generator';
import { shouldRenderValue } from '../utils/component-value-resolver';

/**
 * Text component CSS generator
 * Handles text alignment, orientation, and link styles
 */
export class TextGenerator extends BaseComponentGenerator {
	/**
	 * Generate CSS for text component
	 * @param {string} attributeName - The attribute name
	 * @param {Object} meta - Component metadata
	 * @param {Object} resolvedValues - Pre-resolved component values
	 */
	generate(attributeName, meta, resolvedValues) {
		const componentType = meta.component;

		switch (componentType) {
			case 'textAlign':
				this.generateTextAlign(resolvedValues, meta);
				break;
			case 'linkStyle':
				this.generateLinkStyle(resolvedValues, meta);
				break;
			case 'textOrientation':
				this.generateTextOrientation(resolvedValues, meta);
				break;
			default:
				// Generic text property handling
				this.generateGenericText(resolvedValues, meta);
		}
	}

	/**
	 * Generate text alignment CSS
	 */
	generateTextAlign(resolvedValues, meta) {
		const textAlign = resolvedValues.textAlign;
		if (textAlign && shouldRenderValue(textAlign, meta)) {
			this.applyProperty('textAlign', textAlign, meta);
		}
	}

	/**
	 * Generate link style CSS
	 */
	generateLinkStyle(resolvedValues, meta) {
		const textDecoration = resolvedValues.textDecoration;
		if (textDecoration && shouldRenderValue(textDecoration, meta)) {
			const cssValue = this.processLinkStyleValue(textDecoration.value);
			if (cssValue) {
				// Check if this is a hover-only underline
				if (textDecoration.value === 'hover-underline') {
					// Apply underline on hover
					const hoverSelector = this.currentSelector + ':hover';
					const currentSelectorBackup = this.currentSelector;
					this.setSelector(hoverSelector);
					this.add({ 'text-decoration': 'underline' });
					this.setSelector(currentSelectorBackup);
				} else {
					// Apply regular text decoration
					this.applyProperty('textDecoration', { ...textDecoration, value: cssValue }, meta);
				}
			}
		}
	}

	/**
	 * Generate text orientation CSS
	 */
	generateTextOrientation(resolvedValues, meta) {
		const textOrientation = resolvedValues.textOrientation;
		const writingMode = resolvedValues.writingMode;

		// Prefer explicit writingMode; otherwise infer from textOrientation
		const shouldApplyOrientation = textOrientation && shouldRenderValue(textOrientation, meta);
		const shouldApplyWritingMode = writingMode && shouldRenderValue(writingMode, meta);

		if (shouldApplyOrientation) {
			const orientationValue = this.processTextOrientationValue(textOrientation.value);
			if (orientationValue) {
				this.applyProperty('textOrientation', { ...textOrientation, value: orientationValue }, meta);
			}
		}

		const wmSource = shouldApplyWritingMode ? writingMode : shouldApplyOrientation ? textOrientation : null;
		if (wmSource) {
			const wmValue = this.processWritingModeValue(wmSource.value);
			if (wmValue) {
				this.applyProperty('writingMode', { ...wmSource, value: wmValue }, meta);
			}
		}
	}

	/**
	 * Generate generic text properties
	 */
	generateGenericText(resolvedValues, meta) {
		Object.entries(resolvedValues).forEach(([key, resolvedValue]) => {
			if (shouldRenderValue(resolvedValue, meta)) {
				this.applyProperty(key, resolvedValue, meta);
			}
		});
	}

	/**
	 * Process link style value
	 */
	processLinkStyleValue(value) {
		if (value === 'hover-underline') {
			// This is handled specially in generateLinkStyle
			return null;
		}
		return value;
	}

	/**
	 * Process text orientation value
	 */
	processTextOrientationValue(value) {
		if (value === 'stacked') {
			return 'upright';
		}
		if (value === 'sideways-down' || value === 'sideways-up') {
			return 'sideways';
		}
		return '';
	}

	/**
	 * Process writing mode value
	 */
	processWritingModeValue(value) {
		if (value === 'stacked' || value === 'sideways-down') {
			return 'vertical-lr';
		}
		if (value === 'sideways-up') {
			return 'sideways-lr';
		}
		return '';
	}
}
