import { useMemo } from '@wordpress/element';
export default function getComponentView(componentName) {
	if (!componentName) {
		return 'normal';
	}
	const returnValue = useMemo(() => {
		const blockSettings = kadence_blocks_params.settings ? JSON.parse(kadence_blocks_params.settings) : {};
		let userViewSettings = {};
		const userRole = kadence_blocks_params.userrole ? kadence_blocks_params.userrole : 'admin';
		if (blockSettings?.[userRole] !== undefined && typeof blockSettings[userRole] === 'object') {
			userViewSettings = blockSettings[userRole];
		}
		if (undefined === userViewSettings?.[componentName]) {
			return 'normal';
		} else if ('normal' === userViewSettings?.[componentName]) {
			return 'normal';
		} else if ('advanced' === userViewSettings?.[componentName]) {
			return 'advanced';
		} else if ('preset' === userViewSettings?.[componentName]) {
			return 'preset';
		}
		return 'normal';
	}, [componentName]);
	return returnValue;
}
