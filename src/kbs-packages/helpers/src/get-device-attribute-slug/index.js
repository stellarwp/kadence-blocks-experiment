/**
 * Simple get a device attribute slug.
 */
export default function getDeviceAttributeSlug(device) {
	let deviceSlug = 'dt';
	if ( ! device ) {
		return deviceSlug;
	}

	switch ( device ) {
		case 'tablet':
			deviceSlug = 'td';
			break;
		case 'mobile':
			deviceSlug = 'mb';
			break;
	}
	return deviceSlug;
}
