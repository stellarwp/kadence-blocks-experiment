/**
 * WordPress dependencies
 */
import { __experimentalGrid as Grid, Card, CardMedia, CardBody } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useDispatch, useSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { STORE_NAME } from '../../store';

const ImageCollectionStep = () => {
	const { setImageCollection } = useDispatch( STORE_NAME );
	const selectedCollection = useSelect( 
		select => select( STORE_NAME ).getImageCollection(), 
		[] 
	);

	// Image collections based on business types
	const collections = [
		{
			id: 'business',
			name: __( 'Business & Corporate', 'kadence-blocks' ),
			thumbnail: 'https://patterns.startertemplatecloud.com/images/business-thumb.jpg',
		},
		{
			id: 'medical',
			name: __( 'Medical & Healthcare', 'kadence-blocks' ),
			thumbnail: 'https://patterns.startertemplatecloud.com/images/medical-thumb.jpg',
		},
		{
			id: 'food',
			name: __( 'Food & Restaurant', 'kadence-blocks' ),
			thumbnail: 'https://patterns.startertemplatecloud.com/images/food-thumb.jpg',
		},
		{
			id: 'fitness',
			name: __( 'Fitness & Wellness', 'kadence-blocks' ),
			thumbnail: 'https://patterns.startertemplatecloud.com/images/fitness-thumb.jpg',
		},
		{
			id: 'education',
			name: __( 'Education & Learning', 'kadence-blocks' ),
			thumbnail: 'https://patterns.startertemplatecloud.com/images/education-thumb.jpg',
		},
		{
			id: 'technology',
			name: __( 'Technology & Software', 'kadence-blocks' ),
			thumbnail: 'https://patterns.startertemplatecloud.com/images/tech-thumb.jpg',
		},
		{
			id: 'creative',
			name: __( 'Creative & Design', 'kadence-blocks' ),
			thumbnail: 'https://patterns.startertemplatecloud.com/images/creative-thumb.jpg',
		},
		{
			id: 'generic',
			name: __( 'Generic & Abstract', 'kadence-blocks' ),
			thumbnail: 'https://patterns.startertemplatecloud.com/images/generic-thumb.jpg',
		},
	];

	return (
		<div className="kadence-ai-wizard-image-collection">
			<p>{ __( 'Choose an image collection that matches your business:', 'kadence-blocks' ) }</p>
			
			<Grid columns={ 3 } gap={ 4 }>
				{ collections.map( collection => (
					<Card
						key={ collection.id }
						className={ `kadence-image-collection-item ${
							selectedCollection === collection.id ? 'is-selected' : ''
						}` }
						isElevated
						onClick={ () => setImageCollection( collection.id ) }
					>
						<CardMedia>
							<img
								src={ collection.thumbnail }
								alt={ collection.name }
							/>
						</CardMedia>
						<CardBody>
							<h4>{ collection.name }</h4>
						</CardBody>
					</Card>
				) ) }
			</Grid>
		</div>
	);
};

export default ImageCollectionStep;