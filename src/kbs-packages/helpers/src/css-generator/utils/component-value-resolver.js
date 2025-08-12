import getDeviceValue from '../../get-device-value';
import getInheritedDeviceValue from '../../get-inherited-device-value';
import getBundlePresetValue from '../../get-bundle-preset-value';
import { merge } from 'lodash';

/**
 * Get all component keys for a given component type
 */
function getComponentKeys(componentType) {
	const componentKeysMap = {
		color: ['color', 'colorHover'],
		border: [
			'borderTopLeftRadius',
			'borderTopRightRadius',
			'borderBottomRightRadius',
			'borderBottomLeftRadius',
			'borderTopLeftRadiusHover',
			'borderTopRightRadiusHover',
			'borderBottomRightRadiusHover',
			'borderBottomLeftRadiusHover',
			'borderTop',
			'borderLeft',
			'borderRight',
			'borderBottom',
			'borderTopHover',
			'borderLeftHover',
			'borderRightHover',
			'borderBottomHover',
		],
		background: ['color', 'gradient', 'image', 'size', 'position', 'repeat', 'attachment'],
		boxShadow: ['boxShadow'],
		textShadow: ['textShadow'],
		textAlign: ['textAlign'],
		flexBox: ['flexDirection', 'justifyContent', 'alignItems', 'alignContent', 'flexWrap', 'rowGap', 'columnGap'],
		padding: ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft'],
		margin: ['marginTop', 'marginRight', 'marginBottom', 'marginLeft'],
		typography: [
			'fontFamily',
			'fontWeight',
			'fontSize',
			'lineHeight',
			'letterSpacing',
			'textTransform',
			'fontStyle',
			'color',
			'backgroundColor',
		],
		icon: [
			'iconSize',
			'iconLineWidth',
			'color',
			'iconSizeHover',
			'iconLineWidthHover',
			'colorHover',
			'paddingTop',
			'paddingRight',
			'paddingBottom',
			'paddingLeft',
			'paddingHoverTop',
			'paddingHoverRight',
			'paddingHoverBottom',
			'paddingHoverLeft',
			'alignItems',
		],
		linkStyle: ['textDecoration'],
		textOrientation: ['textOrientation', 'writingMode'],
		maxWidth: ['maxWidth'],
		maxHeight: ['maxHeight'],
		minHeight: ['minHeight'],
		minWidth: ['minWidth'],
		width: ['width'],
		transition: ['transitionProperty', 'transitionDuration', 'transitionTimingFunction'],
		transform: ['scale', 'translate', 'rotate', 'skew', 'origin'],
	};

	return componentKeysMap[componentType] || [componentType];
}

/**
 * Resolve all values for a component at once, merging global styles efficiently
 *
 * @param {string} attributeName - The name of the attribute (e.g., 'typography')
 * @param {Object} attributes - The block's attributes
 * @param {string} device - The current preview device
 * @param {Object} metadata - The block's metadata
 * @param {string[]} globalStylesIds - Array of global style IDs (priority: later = higher)
 * @param {string} componentType - The component type (e.g., 'typography', 'flexBox')
 * @returns {Object} Merged values for all component sub-attributes
 */
export function resolveComponentValues(attributeName, attributes, device, metadata, globalStylesIds, componentType) {
	const componentKeys = getComponentKeys(componentType);
	const resolvedValues = {};

	// Process each sub-attribute with simplified resolution
	componentKeys.forEach((key) => {
		const resolved = resolveSingleValue(
			attributeName,
			attributes,
			device,
			metadata,
			key,
			globalStylesIds
		);

		if (resolved) {
			resolvedValues[key] = resolved;
		}
	});

	return resolvedValues;
}

/**
 * Resolve a single value with clear priority order
 * Priority: Direct > Parent Device > Preset > Bundle Preset > Initial
 *
 * @param {string} attributeName - The attribute name
 * @param {Object} attributes - The block attributes
 * @param {string} device - The current device
 * @param {Object} metadata - The block metadata
 * @param {string} key - The sub-attribute key
 * @param {string[]} globalStylesIds - Global style IDs
 * @returns {Object|null} Resolved value with source information
 */
function resolveSingleValue(attributeName, attributes, device, metadata, key, globalStylesIds) {
	// Priority 1: Direct value from current device (check individual keys first)
	const directValue = getDeviceValue(attributeName, attributes, device, key);
	if (directValue !== undefined && directValue !== null && directValue !== '') {
		return {
			value: directValue,
			source: 'direct',
			inherited: false,
		};
	}
	
	// Special handling for border radius stored as array (check after individual keys)
	if (attributeName === 'border' && key.includes('Radius')) {
		const isHover = key.includes('Hover');
		const arrayKey = isHover ? 'borderRadiusHover' : 'borderRadius';
		
		// Check if borderRadius is stored as an array at the attribute level
		const borderRadiusArray = getDeviceValue(attributeName, attributes, device, arrayKey);
		
		if (Array.isArray(borderRadiusArray)) {
			let cornerValue;
			// Map individual corner keys to array indices
			if (key === 'borderTopLeftRadius' || key === 'borderTopLeftRadiusHover') {
				cornerValue = borderRadiusArray[0];
			} else if (key === 'borderTopRightRadius' || key === 'borderTopRightRadiusHover') {
				cornerValue = borderRadiusArray[1];
			} else if (key === 'borderBottomRightRadius' || key === 'borderBottomRightRadiusHover') {
				cornerValue = borderRadiusArray[2];
			} else if (key === 'borderBottomLeftRadius' || key === 'borderBottomLeftRadiusHover') {
				cornerValue = borderRadiusArray[3];
			}
			
			if (cornerValue !== undefined && cornerValue !== null && cornerValue !== '') {
				return {
					value: cornerValue,
					source: 'direct',
					inherited: false,
				};
			}
		}
	}

	// Priority 2: Parent device value (responsive inheritance)
	if (device !== 'desktop') {
		const parentValue = getParentDeviceValue(attributeName, attributes, device, key);
		if (parentValue !== undefined && parentValue !== null) {
			return {
				value: parentValue,
				source: 'parent',
				inherited: true,
				inheritedType: 'responsive',
			};
		}
	}

	// Priority 3: Preset value (check for standard presets first)
	// We only check preset if the attribute has a preset defined
	if (attributes[attributeName]?.preset) {
		const { inheritedValue, inheritedSource, inheritedType } = getInheritedDeviceValue(
			attributeName,
			attributes,
			device,
			metadata,
			key,
			globalStylesIds
		);

		if (inheritedValue !== undefined && inheritedValue !== null && inheritedValue !== '') {
			return {
				value: inheritedValue,
				source: inheritedSource || 'preset',
				inherited: true,
				inheritedType: inheritedType || 'preset',
			};
		}
	}

	// Priority 4: Bundle preset value
	const { value: bundlePresetValue, source: bundlePresetSource } = getBundlePresetValue(
		attributeName,
		attributes,
		device,
		metadata,
		key,
		globalStylesIds
	);
	
	if (bundlePresetValue !== undefined && bundlePresetValue !== null && bundlePresetValue !== '') {
		return {
			value: bundlePresetValue,
			source: bundlePresetSource || 'bundle-preset',
			inherited: true,
			inheritedType: 'preset',
		};
	}

	// Priority 5: Initial value from metadata
	const initialValue = getInitialValue(attributeName, device, metadata, key);
	if (initialValue !== undefined && initialValue !== null) {
		return {
			value: initialValue,
			source: 'initial',
			inherited: true,
			inheritedType: 'initial',
		};
	}

	return null;
}

/**
 * Get parent device value for responsive inheritance
 *
 * @param {string} attributeName - The attribute name
 * @param {Object} attributes - The block attributes
 * @param {string} device - The current device
 * @param {string} key - The sub-attribute key
 * @returns {*} The parent device value or undefined
 */
function getParentDeviceValue(attributeName, attributes, device, key) {
	const deviceHierarchy = {
		mobile: ['tablet', 'desktop'],
		tablet: ['desktop'],
		desktop: [],
	};

	const parentDevices = deviceHierarchy[device] || [];
	
	// First check for individual key values in parent devices
	for (const parentDevice of parentDevices) {
		const parentValue = getDeviceValue(attributeName, attributes, parentDevice, key);
		if (parentValue !== undefined && parentValue !== null && parentValue !== '') {
			return parentValue;
		}
	}
	
	// Special handling for border radius arrays (only check if individual keys not found)
	if (attributeName === 'border' && key.includes('Radius')) {
		const isHover = key.includes('Hover');
		const arrayKey = isHover ? 'borderRadiusHover' : 'borderRadius';
		
		for (const parentDevice of parentDevices) {
			const borderRadiusArray = getDeviceValue(attributeName, attributes, parentDevice, arrayKey);
			
			if (Array.isArray(borderRadiusArray)) {
				let cornerValue;
				// Map individual corner keys to array indices
				if (key === 'borderTopLeftRadius' || key === 'borderTopLeftRadiusHover') {
					cornerValue = borderRadiusArray[0];
				} else if (key === 'borderTopRightRadius' || key === 'borderTopRightRadiusHover') {
					cornerValue = borderRadiusArray[1];
				} else if (key === 'borderBottomRightRadius' || key === 'borderBottomRightRadiusHover') {
					cornerValue = borderRadiusArray[2];
				} else if (key === 'borderBottomLeftRadius' || key === 'borderBottomLeftRadiusHover') {
					cornerValue = borderRadiusArray[3];
				}
				
				if (cornerValue !== undefined && cornerValue !== null && cornerValue !== '') {
					return cornerValue;
				}
			}
		}
	}

	return undefined;
}

/**
 * Get initial value from metadata
 *
 * @param {string} attributeName - The attribute name
 * @param {string} device - The current device
 * @param {Object} metadata - The block metadata
 * @param {string} key - The sub-attribute key
 * @returns {*} The initial value or undefined
 */
function getInitialValue(attributeName, device, metadata, key) {
	if (!metadata?.attributes?.[attributeName]?.initial) {
		return undefined;
	}

	const initial = metadata.attributes[attributeName].initial;

	// Check device-specific initial value
	if (initial[device]?.[key] !== undefined) {
		return initial[device][key];
	}

	// Check non-responsive initial value
	if (initial[key] !== undefined) {
		return initial[key];
	}

	return undefined;
}

/**
 * Resolve values for a layered component (background, shadows)
 */
export function resolveLayeredComponentValues(
	attributeName,
	attributes,
	device,
	metadata,
	globalStylesIds,
	layerIndex
) {
	// This function would handle the special case of layered components
	// Implementation would follow similar pattern but handle layer arrays
	const resolvedValues = {};

	// TODO: Implement layered component resolution
	// This would merge layers from multiple global styles efficiently

	return resolvedValues;
}

/**
 * Check if a resolved value should be rendered based on inheritance rules
 */
export function shouldRenderValue(resolvedValue, meta) {
	if (!resolvedValue) return false;

	const { value, source, inherited } = resolvedValue;

	// Always render direct values and parent device values
	if (source === 'direct' || source === 'parent') {
		return true;
	}

	// For non-inheritable properties, render preset values
	if (meta?.nonInheritable && (source === 'preset' || source === 'preset-parent')) {
		return true;
	}

	// Don't render inherited preset values (they're handled by class names)
	if (inherited && (source === 'preset' || source === 'preset-parent') && !meta?.nonInheritable) {
		return false;
	}

	return !!value;
}