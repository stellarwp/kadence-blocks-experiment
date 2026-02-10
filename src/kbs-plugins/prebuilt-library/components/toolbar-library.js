/**
 * WordPress dependencies
 */
import { ToolbarButton } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useDispatch, useSelect, subscribe } from '@wordpress/data';
import { createBlock, isUnmodifiedDefaultBlock } from '@wordpress/blocks';
import { store as blockEditorStore } from '@wordpress/block-editor';
import { createRoot, useState, useEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { kadenceIcon, isSettingEnabled } from '@kadence/kbsHelpers';
import '../store';

/**
 * Toolbar Library Component
 * Adds the Design Library button to the WordPress editor top toolbar
 */
const ToolbarLibrary = () => {
	const { getSelectedBlock, getBlockIndex, getBlockHierarchyRootClientId } = useSelect(blockEditorStore);
	const { replaceBlocks, insertBlocks } = useDispatch(blockEditorStore);

	const openDesignLibrary = () => {
		const selectedBlock = getSelectedBlock();
		if (selectedBlock && isUnmodifiedDefaultBlock(selectedBlock)) {
			replaceBlocks(
				selectedBlock.clientId,
				createBlock('kbs/row', {
					prebuilt: true,
				}),
				null,
				0
			);
		} else if (selectedBlock) {
			const destinationRootClientId = getBlockHierarchyRootClientId(selectedBlock.clientId);
			let destinationIndex = 0;
			if (destinationRootClientId) {
				destinationIndex = getBlockIndex(destinationRootClientId) + 1;
			} else {
				destinationIndex = getBlockIndex(selectedBlock.clientId) + 1;
			}
			insertBlocks(
				createBlock('kbs/row', {
					prebuilt: true,
				}),
				destinationIndex
			);
		} else {
			insertBlocks(
				createBlock('kbs/row', {
					prebuilt: true,
				})
			);
		}
	};

	const LibraryButton = () => (
		<ToolbarButton className="kbs-toolbar-prebuilt-button" icon={kadenceIcon} onClick={openDesignLibrary}>
			{__('Design Library', 'kadence-blocks')}
		</ToolbarButton>
	);

	const renderButton = (selector) => {
		const patternButton = document.createElement('div');
		patternButton.classList.add('kbs-toolbar-design-library');
		selector.appendChild(patternButton);
		const root = createRoot(patternButton);
		root.render(<LibraryButton />);
	};

	// Watch for the toolbar to be visible and the design library button to be missing
	useEffect(() => {
		const unsubscribe = subscribe(() => {
			const editToolbar = document.querySelector('.edit-post-header-toolbar');
			if (!editToolbar) {
				return;
			}
			if (isSettingEnabled('show', 'kadence/designlibrary') && kbs_params.showDesignLibrary) {
				if (!editToolbar.querySelector('.kbs-toolbar-design-library')) {
					renderButton(editToolbar);
				}
			}
		});

		return () => {
			// Cleanup on unmount
			const button = document.querySelector('.kadence-toolbar-design-library');
			if (button) {
				button.remove();
			}
		};
	}, []);

	return null;
};

export default ToolbarLibrary;
