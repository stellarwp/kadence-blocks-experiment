/**
 * KBS Block Early Filters
 * 
 * This file contains filters that modify block registration for KBS blocks.
 * These filters run before blocks are registered to ensure consistent attributes across all KBS blocks.
 */

/**
 * WordPress dependencies
 */
import { addFilter } from '@wordpress/hooks';

/**
 * Add transform attributes to KBS blocks
 * 
 * This filter adds attributes to KBS blocks. This ensures consistent attribute
 * capabilities across all KBS blocks without needing to modify each block.json file.
 * 
 * @param {Object} settings - The block settings
 * @param {string} name - The block name
 * @return {Object} Modified block settings
 */
function getAttributeTemplate(simpleBlockName, type) {
	return {
		renderCSS: true,
		component: type,
		nonInheritable: true,
		selector: `--kbs-${simpleBlockName}-${type}-`,
		classPrefix: `kbs-${simpleBlockName}-${type}-`,
		initial: {},
		type: 'object'
	};
}

function addTransformAttributesToKBSBlocks(settings, name) {
	if (!name.startsWith('kbs/')) {
		return settings;
	}

	const supports = settings?.supports;
	const supportsTransforms = supports?.kbstransforms !== false;
	const supportsTransitions = supports?.kbstransitions !== false;

	// Early return if no features are supported
	if (!supportsTransforms && !supportsTransitions) {
		return settings;
	}

	const simpleBlockName = name.slice(4);
	const newAttributes = {};

	if (supportsTransforms) {
		newAttributes.transform = getAttributeTemplate(simpleBlockName, 'transform');
		newAttributes.transformHover = getAttributeTemplate(simpleBlockName, 'transform');
	}

	if (supportsTransitions) {
		newAttributes.transition = getAttributeTemplate(simpleBlockName, 'transition');
	}

	return {
		...settings,
		attributes: {
			...settings.attributes,
			...newAttributes
		}
	};
}

// Register the filter
addFilter(
	'blocks.registerBlockType',
	'kadence-blocks/add-transform-attributes',
	addTransformAttributesToKBSBlocks
);