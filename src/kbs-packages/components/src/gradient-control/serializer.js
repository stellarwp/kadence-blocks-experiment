export function serializeGradientColor({ type, value }) {
	if (type === 'literal') {
		return value;
	}
	if (type === 'hex') {
		return `#${value}`;
	}
	return `${type}(${value.join(',')})`;
}

export function serializeGradientPosition(position) {
	if (!position) {
		return '';
	}
	const { value, type } = position;
	return `${value}${type}`;
}

export function serializeGradientColorStop({ type, value, length }) {
	return `${serializeGradientColor({
		type,
		value,
	})} ${serializeGradientPosition(length)}`;
}

export function serializeGradientOrientation(type, orientation) {
	if ('radial-gradient' === type) {
		if (!orientation || orientation?.type !== 'shape') {
			return;
		}
		if ('%' === orientation.at.value.x.type) {
			return `${orientation.value} at ${orientation.at.value.x.value}% ${orientation.at.value.y.value}%`;
		}
		return `${orientation.value} at ${orientation.at.value.x.value} ${orientation.at.value.y.value}`;
	}
	if ('conic-gradient' === type) {
		if (!orientation || !orientation?.type) {
			return;
		}
		if ('%' === orientation?.at?.value?.x?.type) {
			return `from ${orientation.value}deg at ${orientation.at.value.x.value}% ${orientation.at.value.y.value}%`;
		}
		return `from ${orientation.value}deg at ${orientation?.at?.value?.x?.value} ${orientation?.at?.value?.y?.value}`;
	}
	if (!orientation || orientation.type !== 'angular') {
		return;
	}
	return `${orientation.value}deg`;
}

export function serializeGradient({ type, orientation, colorStops }) {
	const serializedOrientation = serializeGradientOrientation(type, orientation);
	const serializedColorStops = colorStops
		.sort((colorStop1, colorStop2) => {
			return (colorStop1?.length?.value ?? 0) - (colorStop2?.length?.value ?? 0);
		})
		.map(serializeGradientColorStop);
	return `${type}(${[serializedOrientation, ...serializedColorStops].filter(Boolean).join(',')})`;
}
