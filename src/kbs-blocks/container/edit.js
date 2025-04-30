/**
 * BLOCK: Kadence Column
 *
 * Registering a basic block with Gutenberg.
 */

/**
 * Import Controls
 */
import classnames from 'classnames';

/**
 * Kadence Helpers.
 */
import { uniqueIdHelper, getPreviewValue, GlobalStylesContext, useGlobalStylesIds } from '@kadence/kbsHelpers';

import metadata from './block.json';
import Inspector from './editing/inspector';
import Styles from './editing/styles';
/**
 * Import WordPress
 */
import { __ } from '@wordpress/i18n';

import { useSelect, select } from '@wordpress/data';
import { useEffect, Fragment } from '@wordpress/element';
import { InnerBlocks, useBlockProps, useInnerBlocksProps, store as blockEditorStore } from '@wordpress/block-editor';
import { FORM_ALLOWED_BLOCKS } from './constants';

/**
 * Build the section edit.
 */
export default function ContainerEdit(props) {
	const { attributes, setAttributes, isSelected, clientId, context, className } = props;
	const { uniqueID, templateLock, align, globalStyleIds } = attributes;

	// Get merged global styles IDs using the helper hook
	const globalStylesIds = useGlobalStylesIds(globalStyleIds);

	const { hasInnerBlocks, inRowBlock, inFormBlock, previewDevice } = useSelect(
		(select) => {
			const { getBlock, getBlockRootClientId, getBlockParentsByBlockName, getBlocksByClientId } =
				select(blockEditorStore);
			const block = getBlock(clientId);
			const rootID = getBlockRootClientId(clientId);
			let inRowBlock = false;
			let inFormBlock = false;
			if (rootID) {
				const hasForm = getBlockParentsByBlockName(clientId, 'kadence/advanced-form');
				const parentBlock = getBlocksByClientId(rootID);
				inFormBlock = undefined !== hasForm && hasForm.length ? true : false;
				inRowBlock =
					undefined !== parentBlock &&
					undefined !== parentBlock[0] &&
					undefined !== parentBlock[0].name &&
					parentBlock[0].name === 'kadence/rowlayout'
						? true
						: false;
			}
			return {
				inRowBlock,
				hasInnerBlocks: !!(block && block.innerBlocks.length),
				inFormBlock,
				previewDevice: select('kadenceblocks/data').getPreviewDeviceType(),
			};
		},
		[clientId]
	);
	uniqueIdHelper(props);
	useEffect(() => {
		// const isInQueryBlock = getInQueryBlock(context, inQueryBlock);
		// if (attributes.inQueryBlock !== isInQueryBlock) {
		// 	attributes.inQueryBlock = isInQueryBlock;
		// 	setAttributes({ inQueryBlock: isInQueryBlock });
		// }
		// This ensures that align gets cleared when a section is moved into a row where it needs to be locked.
		if (inRowBlock && align !== '') {
			setAttributes({ align: '' });
		}
	}, []);

	const previewDirection = getPreviewValue('direction', attributes, metadata, previewDevice);
	const classes = classnames('kbs-container', {
		[className]: className,
		[`kbs-container-${uniqueID}`]: uniqueID,
		['kbs-only-appender']: !hasInnerBlocks,
	});
	const blockProps = useBlockProps({
		className: classes,
		'data-align': !inRowBlock && ('full' === align || 'wide' === align) ? align : undefined,
	});
	const { children, ...innerBlocksProps } = useInnerBlocksProps({
		orientation: previewDirection === 'row' || previewDirection === 'row-reverse' ? 'horizontal' : 'vertical',
		templateLock,
		renderAppender: hasInnerBlocks ? undefined : InnerBlocks.ButtonBlockAppender,
		allowedBlocks: inFormBlock ? FORM_ALLOWED_BLOCKS : undefined,
	});

	return (
		<GlobalStylesContext.Provider value={globalStylesIds}>
			<div {...blockProps}>
				<Inspector {...props} previewDevice={previewDevice} globalStylesIds={globalStylesIds} />
				{/* <Toolbar {...props} />
					<Inspector {...props} />
					*/}
				<Styles {...props} previewDevice={previewDevice} globalStylesIds={globalStylesIds} />
				{children}
			</div>
		</GlobalStylesContext.Provider>
	);
}
