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
import { BackgroundStyles } from '@kadence/kbsComponents';
import metadata from './block.json';
import Inspector from './editing/inspector';
import Styles from './editing/styles';
/**
 * Import WordPress
 */
import { __ } from '@wordpress/i18n';

import { useSelect, select } from '@wordpress/data';
import { useEffect, useMemo } from '@wordpress/element';
import { InnerBlocks, useBlockProps, useInnerBlocksProps, store as blockEditorStore } from '@wordpress/block-editor';
import { FORM_ALLOWED_BLOCKS } from './constants';

/**
 * Build the section edit.
 */
export default function ContainerEdit(props) {
	const { attributes, setAttributes, isSelected, clientId, context, className } = props;
	const { uniqueID, templateLock, align, globalStyleIds, tagName: TagName = 'div' } = attributes;

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
	const globalClasses = useMemo(() => {
		return Object.keys(
			(globalStylesIds || []).reduce((acc, styleId) => {
				acc[`kbs-global-style-${styleId}`] = true;
				return acc;
			}, {})
		);
	}, [globalStylesIds]);
	const classes = classnames('kbs-container', globalClasses, {
		[className]: className,
		[`kbs-container-${uniqueID}`]: uniqueID,
		['kbs-only-appender']: !hasInnerBlocks,
	});
	const blockProps = useBlockProps({
		className: classes,
		'data-align': !inRowBlock && ('full' === align || 'wide' === align) ? align : undefined,
	});
	const { children, ...innerBlocksProps } = useInnerBlocksProps(blockProps, {
		orientation: previewDirection === 'row' || previewDirection === 'row-reverse' ? 'horizontal' : 'vertical',
		templateLock,
		renderAppender: hasInnerBlocks ? undefined : InnerBlocks.ButtonBlockAppender,
		allowedBlocks: inFormBlock ? FORM_ALLOWED_BLOCKS : undefined,
	});

	return (
		<GlobalStylesContext.Provider value={globalStylesIds}>
			<Inspector {...props} previewDevice={previewDevice} globalStylesIds={globalStylesIds} />
			{/* <Toolbar {...props} />
				<Inspector {...props} />
				*/}
			<Styles {...props} previewDevice={previewDevice} globalStylesIds={globalStylesIds} />
			<TagName {...innerBlocksProps}>
				<BackgroundStyles
					previewDevice={previewDevice}
					meta={metadata}
					globalStylesIds={globalStylesIds}
					backgroundAttribute="background"
					{...props}
				/>
				{children}
			</TagName>
		</GlobalStylesContext.Provider>
	);
}
