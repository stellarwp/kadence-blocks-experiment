/**
 * WordPress dependencies
 */
import { Modal, TabPanel, SearchControl, Spinner } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import { useDispatch, useSelect } from '@wordpress/data';
import { store as blockEditorStore } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import PatternLibrary from './pattern-library';
import TemplateLibrary from './template-library';
import CloudLibrary from './cloud-library';
import { usePatternData } from '../hooks/use-pattern-data';

const PrebuiltLibraryModal = ( { clientId, onClose } ) => {
	const [ searchTerm, setSearchTerm ] = useState( '' );
	const [ selectedCategory, setSelectedCategory ] = useState( 'all' );
	
	const { replaceBlock } = useDispatch( blockEditorStore );
	
	// Get block being edited
	const block = useSelect( 
		( select ) => select( blockEditorStore ).getBlock( clientId ),
		[ clientId ]
	);

	// Custom hook for pattern data
	const { patterns, categories, isLoading } = usePatternData();

	// Tab configuration following WordPress patterns
	const tabs = [
		{
			name: 'templates',
			title: __( 'Templates', 'kadence-blocks' ),
			className: 'kadence-prebuilt-tab-templates',
		},
		{
			name: 'patterns',
			title: __( 'Patterns', 'kadence-blocks' ),
			className: 'kadence-prebuilt-tab-patterns',
		},
		{
			name: 'cloud',
			title: __( 'Cloud', 'kadence-blocks' ),
			className: 'kadence-prebuilt-tab-cloud',
		},
	];

	if ( ! block?.attributes?.isPrebuiltModal ) {
		return null;
	}

	return (
		<Modal
			title={ __( 'Design Library', 'kadence-blocks' ) }
			onRequestClose={ onClose }
			className="kadence-prebuilt-library-modal"
			size="fill"
		>
			<div className="kadence-prebuilt-library-header">
				<SearchControl
					value={ searchTerm }
					onChange={ setSearchTerm }
					placeholder={ __( 'Search patterns...', 'kadence-blocks' ) }
				/>
			</div>

			<TabPanel
				className="kadence-prebuilt-library-tabs"
				activeClass="is-active"
				tabs={ tabs }
			>
				{ ( tab ) => {
					if ( isLoading ) {
						return (
							<div className="kadence-prebuilt-library-loading">
								<Spinner />
							</div>
						);
					}

					switch ( tab.name ) {
						case 'templates':
							return (
								<TemplateLibrary
									searchTerm={ searchTerm }
									onSelect={ ( template ) => {
										// Handle template selection
										replaceBlock( clientId, template.blocks );
										onClose();
									} }
								/>
							);
						case 'patterns':
							return (
								<PatternLibrary
									patterns={ patterns }
									categories={ categories }
									searchTerm={ searchTerm }
									selectedCategory={ selectedCategory }
									onCategoryChange={ setSelectedCategory }
									onSelect={ ( pattern ) => {
										// Handle pattern selection
										replaceBlock( clientId, pattern.blocks );
										onClose();
									} }
								/>
							);
						case 'cloud':
							return (
								<CloudLibrary
									searchTerm={ searchTerm }
									onSelect={ ( cloudItem ) => {
										// Handle cloud item selection
										replaceBlock( clientId, cloudItem.blocks );
										onClose();
									} }
								/>
							);
					}
				} }
			</TabPanel>
		</Modal>
	);
};

export default PrebuiltLibraryModal;