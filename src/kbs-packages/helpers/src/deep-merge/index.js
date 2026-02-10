/**
 * deep merge an array of objects.
 */
export default function deepMerge(objectsToMerge) {
	return objectsToMerge.reduce((result, style) => {
		// Deep merging objects
		const deepMergeInner = (target, source) => {
			const output = { ...target };

			if (isObject(target) && isObject(source)) {
				Object.keys(source).forEach((key) => {
					if (isObject(source[key])) {
						if (!(key in target)) {
							Object.assign(output, { [key]: source[key] });
						} else {
							output[key] = deepMergeInner(target[key], source[key]);
						}
					} else {
						Object.assign(output, { [key]: source[key] });
					}
				});
			}
			return output;
		};

		// Helper to check if value is an object
		const isObject = (item) => item && typeof item === 'object' && !Array.isArray(item);

		return deepMergeInner(result, style);
	}, {});
}
