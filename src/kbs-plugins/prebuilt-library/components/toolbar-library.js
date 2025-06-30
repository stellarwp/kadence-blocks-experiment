/**
 * WordPress dependencies
 */
import { ToolbarButton } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useDispatch, useSelect } from '@wordpress/data';
import { createBlock } from '@wordpress/blocks';
import { BlockControls } from '@wordpress/block-editor';
import { useState, useEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { kadenceIcon } from '@kadence/kbsHelpers';
import PrebuiltLibraryModal from './prebuilt-library-modal';
import '../store';

/**
 * Toolbar Library Component
 * Adds the Design Library button to the WordPress editor toolbar
 */
const ToolbarLibrary = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [modalClientId, setModalClientId] = useState(null);

	const { insertBlock, removeBlock } = useDispatch('core/block-editor');

	// Check for temporary block that triggers the modal
	const temporaryBlock = useSelect((select) => {
		const blocks = select('core/block-editor').getBlocks();
		return blocks.find((block) => block.name === 'kadence/rowlayout' && block.attributes?.isPrebuiltModal === true);
	}, []);

	useEffect(() => {
		if (temporaryBlock) {
			setModalClientId(temporaryBlock.clientId);
			setIsModalOpen(true);
		}
	}, [temporaryBlock]);

	const openDesignLibrary = () => {
		// Create a temporary block that triggers the modal
		const block = createBlock('kadence/rowlayout', {
			isPrebuiltModal: true,
		});
		insertBlock(block);
	};

	const closeModal = () => {
		setIsModalOpen(false);
		if (modalClientId) {
			removeBlock(modalClientId);
			setModalClientId(null);
		}
	};

	return (
		<>
			<BlockControls group="block">
				<ToolbarButton
					icon={kadenceIcon}
					label={__('Design Library', 'kadence-blocks')}
					onClick={openDesignLibrary}
				/>
			</BlockControls>

			{isModalOpen && modalClientId && <PrebuiltLibraryModal clientId={modalClientId} onClose={closeModal} />}
		</>
	);
};

export default ToolbarLibrary;
