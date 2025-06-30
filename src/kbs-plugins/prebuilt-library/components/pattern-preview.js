/**
 * WordPress dependencies
 */
import { Modal, Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { BlockPreview } from '@wordpress/block-editor';
import { useMemo } from '@wordpress/element';
import { rawHandler } from '@wordpress/blocks';

const PatternPreview = ( { pattern, onClose, onSelect, useAI } ) => {
	// Parse pattern content to blocks for preview
	const previewBlocks = useMemo( () => {
		return rawHandler( {
			HTML: pattern.content,
		} );
	}, [ pattern.content ] );

	return (
		<Modal
			title={ pattern.title }
			onRequestClose={ onClose }
			className="kadence-pattern-preview-modal"
			size="large"
		>
			<div className="kadence-pattern-preview-content">
				<BlockPreview
					blocks={ previewBlocks }
					viewportWidth={ 1200 }
				/>
			</div>
			
			<div className="kadence-pattern-preview-actions">
				<Button
					variant="secondary"
					onClick={ onClose }
				>
					{ __( 'Cancel', 'kadence-blocks' ) }
				</Button>
				<Button
					variant="primary"
					onClick={ () => {
						onSelect( pattern );
						onClose();
					} }
				>
					{ __( 'Insert Pattern', 'kadence-blocks' ) }
				</Button>
			</div>
		</Modal>
	);
};

export default PatternPreview;