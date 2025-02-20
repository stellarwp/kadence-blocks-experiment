/**
 * Responsive Device Switch Component
 */

/**
 * Internal block libraries
 */
import { useSelect, useDispatch } from '@wordpress/data';
import { useMemo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { map } from 'lodash';
import { capitalizeFirstLetter } from '@kadence/helpers';
import { mobile, tablet, desktop } from '@wordpress/icons';
import {
	Dashicon,
	Button,
	ButtonGroup,
} from '@wordpress/components';
import './editor.scss';

const availableIcons = {
	desktop,
	tablet,
	mobile,
};
/**
 * Build the Device Switch control.
 */
export default function DeviceSwitchControl( ) {
	const {
		setPreviewDeviceType,
	} = useDispatch( 'kadenceblocks/data' );
	const deviceType = useSelect( ( select ) => {
		return select( 'kadenceblocks/data' ).getPreviewDeviceType();
	}, [] );

	const devices = useMemo( () => {
		if ( kadence_blocks_params.responsive_device_options && kadence_blocks_params.responsive_device_options.length > 0 ) {
			return kadence_blocks_params.responsive_device_options.map(device => ({
				...device,
				icon: typeof device.icon === 'string' && availableIcons[device.icon] ? availableIcons[device.icon] : desktop
			}));
		}
		return [];
	}, [ kadence_blocks_params.responsive_device_options ] );
	
	return (
		<ButtonGroup className="kbs-device-options kbs-device-button-group" aria-label={ __( 'Select Device', 'kadence-blocks' ) }>
			{ map( devices, ( { name, key, icon, itemClass } ) => (
				<Button
					key={ key }
					className={ `kbs-device-btn ${ itemClass }${ name === deviceType ? ' is-active' : '' }` }
					size='small'
					aria-pressed={ deviceType === name }
					onClick={ () => setPreviewDeviceType( capitalizeFirstLetter( name ) ) }
					label={capitalizeFirstLetter( name )}
					icon={ icon }
				/>
			) ) }
		</ButtonGroup>
		
	);
}
