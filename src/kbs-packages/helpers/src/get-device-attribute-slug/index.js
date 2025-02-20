/**
 * Simple get a device attribute slug.
 */
export default function getDeviceAttributeSlug(device) {
	let deviceSlug = 'dt';
	if ( ! device ) {
		return deviceSlug;
	}
	// make lowercase
	device = device.toLowerCase();
	
	if( kadence_blocks_params.responsive_device_options.find( option => option.key === device ) ){
		deviceSlug = kadence_blocks_params.responsive_device_options.find( option => option.key === device ).attributeSlug;
	}
	return deviceSlug;
}
