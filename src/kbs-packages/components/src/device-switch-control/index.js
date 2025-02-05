/**
 * Responsive Range Component
 *
 */

/**
 * Internal block libraries
 */
import { useSelect, useDispatch } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { map } from 'lodash';
import { capitalizeFirstLetter } from '@kadence/helpers';
import { mobile, tablet, desktop } from '@wordpress/icons'
import {
	Dashicon,
	Button,
	ButtonGroup,
} from '@wordpress/components';
import './editor.scss';
/**
 * Build the Radio Button control.
 */
export default function DeviceSwitchControl( ) {
	const {
		setPreviewDeviceType,
	} = useDispatch( 'kadenceblocks/data' );
	const deviceType = useSelect( ( select ) => {
		return select( 'kadenceblocks/data' ).getPreviewDeviceType();
	}, [] );	
	const devices = [
		{
			name: 'Desktop',
			key: 'desktop',
			icon: desktop,
			itemClass: 'kbs-desk-size',
		},
		{
			name: 'Tablet',
			key: 'tablet',
			icon: tablet,
			itemClass: 'kbs-tablet-size',
		},
		{
			name: 'Mobile',
			key: 'mobile',
			icon: mobile,
			itemClass: 'kbs-mobile-size',
		},
	];
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
