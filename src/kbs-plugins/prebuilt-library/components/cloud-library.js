/**
 * WordPress dependencies
 */
import { 
	__experimentalGrid as Grid,
	Card,
	CardBody,
	CardMedia,
	Button,
	TextControl,
	Notice
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { useCloudData } from '../hooks/use-cloud-data';

const CloudLibrary = ( { searchTerm, onSelect } ) => {
	const [ cloudKey, setCloudKey ] = useState( '' );
	const { 
		cloudItems, 
		isLoading, 
		error, 
		isConnected,
		connectCloud 
	} = useCloudData( cloudKey );

	const handleConnect = () => {
		connectCloud( cloudKey );
	};

	if ( ! isConnected ) {
		return (
			<div className="kadence-cloud-library-connect">
				<h2>{ __( 'Connect to Kadence Cloud', 'kadence-blocks' ) }</h2>
				<p>{ __( 'Enter your Kadence Cloud key to access your saved templates and patterns.', 'kadence-blocks' ) }</p>
				
				<TextControl
					label={ __( 'Cloud Key', 'kadence-blocks' ) }
					value={ cloudKey }
					onChange={ setCloudKey }
					placeholder="XXXX-XXXX-XXXX-XXXX"
				/>
				
				<Button
					variant="primary"
					onClick={ handleConnect }
					disabled={ ! cloudKey }
				>
					{ __( 'Connect', 'kadence-blocks' ) }
				</Button>
			</div>
		);
	}

	return (
		<div className="kadence-cloud-library">
			{ error && (
				<Notice status="error" isDismissible={ false }>
					{ error }
				</Notice>
			) }

			<Grid
				columns={ 3 }
				gap={ 4 }
				className="kadence-cloud-library-grid"
			>
				{ cloudItems
					.filter( item => 
						! searchTerm || 
						item.title.toLowerCase().includes( searchTerm.toLowerCase() )
					)
					.map( ( item ) => (
						<Card
							key={ item.id }
							className="kadence-cloud-library-item"
							isElevated
						>
							<CardMedia>
								<img
									src={ item.thumbnail }
									alt={ item.title }
									loading="lazy"
								/>
							</CardMedia>
							<CardBody>
								<h3>{ item.title }</h3>
								<Button
									variant="primary"
									onClick={ () => onSelect( item ) }
								>
									{ __( 'Import', 'kadence-blocks' ) }
								</Button>
							</CardBody>
						</Card>
					) ) }
			</Grid>
		</div>
	);
};

export default CloudLibrary;