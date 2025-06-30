/**
 * WordPress dependencies
 */
import { useEffect, useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

/**
 * Custom hook to manage cloud library data
 */
export const useCloudData = ( cloudKey ) => {
	const [ cloudItems, setCloudItems ] = useState( [] );
	const [ isLoading, setIsLoading ] = useState( false );
	const [ error, setError ] = useState( null );
	const [ isConnected, setIsConnected ] = useState( false );

	const connectCloud = async ( key ) => {
		try {
			setIsLoading( true );
			setError( null );
			
			// Verify cloud key
			const response = await apiFetch( {
				path: '/kadence-blocks/v1/cloud/connect',
				method: 'POST',
				data: { key },
			} );
			
			if ( response.success ) {
				setIsConnected( true );
				// Store key in user meta or options
				localStorage.setItem( 'kadence_cloud_key', key );
			} else {
				setError( response.message );
			}
		} catch ( err ) {
			setError( err.message );
		} finally {
			setIsLoading( false );
		}
	};

	useEffect( () => {
		// Check for existing cloud connection
		const savedKey = localStorage.getItem( 'kadence_cloud_key' );
		if ( savedKey ) {
			setIsConnected( true );
			fetchCloudItems();
		}
	}, [] );

	const fetchCloudItems = async () => {
		try {
			setIsLoading( true );
			
			const items = await apiFetch( {
				path: '/kadence-blocks/v1/cloud/items',
			} );
			
			setCloudItems( items );
		} catch ( err ) {
			setError( err.message );
		} finally {
			setIsLoading( false );
		}
	};

	return {
		cloudItems,
		isLoading,
		error,
		isConnected,
		connectCloud,
	};
};