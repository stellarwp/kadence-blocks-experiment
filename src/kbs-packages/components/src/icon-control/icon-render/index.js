/**
 * Icon Render Component
 *
 */
import GenIcon from '../gen-icon';
import { applyFilters } from '@wordpress/hooks';
import { useSelect, useDispatch } from '@wordpress/data';
import { useEffect } from '@wordpress/element';
import { Spinner } from '@wordpress/components';

/**
 * Icon Render Component using Redux store
 */
function IconRender( props ) {
	const { name } = props;

	const { icons, areIconsLoaded } = useSelect((select) => {
		const rawIcons = select('kadenceblocks/data').getIcons();

		return {
			icons: applyFilters('kadence.icon_options', rawIcons.combinedIcons),
			areIconsLoaded: select('kadenceblocks/data').areIconsLoaded(),
		};
	}, []);

	const { fetchIcons } = useDispatch('kadenceblocks/data');

	// Fetch icons if not loaded
	useEffect(() => {
		if (!areIconsLoaded) {
			fetchIcons();
		}
	}, [areIconsLoaded]);


	if ( !areIconsLoaded || !icons || !icons[ name ] ) {
		return <Spinner />;
	}

	return <GenIcon name={ name } icon={ icons[ name ] } { ...props } />;
}

export default IconRender;

