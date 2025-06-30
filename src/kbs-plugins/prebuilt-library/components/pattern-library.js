/**
 * WordPress dependencies
 */
import { 
	Button, 
	SelectControl, 
	ToggleControl,
	__experimentalGrid as Grid,
	Card,
	CardBody,
	CardMedia
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useState, useMemo } from '@wordpress/element';
import { rawHandler } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import PatternPreview from './pattern-preview';
import { filterPatterns } from '../utils/filter-patterns';

const PatternLibrary = ( {
	patterns,
	categories,
	searchTerm,
	selectedCategory,
	onCategoryChange,
	onSelect,
} ) => {
	const [ viewMode, setViewMode ] = useState( 'grid' ); // grid or list
	const [ previewPattern, setPreviewPattern ] = useState( null );
	const [ useAI, setUseAI ] = useState( false );

	// Filter patterns based on search and category
	const filteredPatterns = useMemo( () => {
		return filterPatterns( patterns, {
			searchTerm,
			category: selectedCategory,
		} );
	}, [ patterns, searchTerm, selectedCategory ] );

	// Category options for select control
	const categoryOptions = useMemo( () => {
		return [
			{ label: __( 'All Categories', 'kadence-blocks' ), value: 'all' },
			...categories.map( ( cat ) => ( {
				label: cat.label,
				value: cat.slug,
			} ) ),
		];
	}, [ categories ] );

	const handlePatternSelect = ( pattern ) => {
		// Parse the pattern content to blocks
		const blocks = rawHandler( {
			HTML: pattern.content,
		} );

		onSelect( {
			...pattern,
			blocks,
		} );
	};

	return (
		<div className="kadence-pattern-library">
			<div className="kadence-pattern-library-controls">
				<SelectControl
					label={ __( 'Category', 'kadence-blocks' ) }
					value={ selectedCategory }
					options={ categoryOptions }
					onChange={ onCategoryChange }
				/>
				
				<ToggleControl
					label={ __( 'Use AI Content', 'kadence-blocks' ) }
					checked={ useAI }
					onChange={ setUseAI }
				/>
			</div>

			<Grid
				columns={ viewMode === 'grid' ? 3 : 1 }
				gap={ 4 }
				className="kadence-pattern-library-grid"
			>
				{ filteredPatterns.map( ( pattern ) => (
					<Card
						key={ pattern.id }
						className="kadence-pattern-library-item"
						isElevated
					>
						<CardMedia
							onClick={ () => setPreviewPattern( pattern ) }
						>
							<img
								src={ pattern.thumbnail }
								alt={ pattern.title }
								loading="lazy"
							/>
						</CardMedia>
						<CardBody>
							<h3>{ pattern.title }</h3>
							<div className="kadence-pattern-library-item-actions">
								<Button
									variant="secondary"
									onClick={ () => setPreviewPattern( pattern ) }
								>
									{ __( 'Preview', 'kadence-blocks' ) }
								</Button>
								<Button
									variant="primary"
									onClick={ () => handlePatternSelect( pattern ) }
								>
									{ __( 'Insert', 'kadence-blocks' ) }
								</Button>
							</div>
						</CardBody>
					</Card>
				) ) }
			</Grid>

			{ previewPattern && (
				<PatternPreview
					pattern={ previewPattern }
					onClose={ () => setPreviewPattern( null ) }
					onSelect={ handlePatternSelect }
					useAI={ useAI }
				/>
			) }
		</div>
	);
};

export default PatternLibrary;