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
import {
	uniqueIdHelper,
	getPreviewValue,
	GlobalStylesContext,
	useGlobalStylesIds,
	getGlobalStylesCSSOutput,
} from '@kadence/kbsHelpers';
import { BackgroundStyles, InlinePaddingResizer } from '@kadence/kbsComponents';
import metadata from './block.json';
import Inspector from './editing/inspector';
import Styles from './editing/styles';
import PrebuiltLibraryModal from '../../kbs-plugins/prebuilt-library/components/prebuilt-library-modal';
/**
 * Import WordPress
 */
import { __ } from '@wordpress/i18n';

import { useSelect, select } from '@wordpress/data';
import { useEffect, useMemo, useRef } from '@wordpress/element';
import { InnerBlocks, useBlockProps, useInnerBlocksProps, store as blockEditorStore } from '@wordpress/block-editor';
import { FORM_ALLOWED_BLOCKS } from './constants';
import { useMergeRefs } from '@wordpress/compose';
/**
 * Build the section edit.
 */
function RowEdit(props) {
	const { attributes, setAttributes, isSelected, clientId, context, className, toggleSelection } = props;
	const { uniqueID, templateLock, align, globalStyleIds, tagName: TagName = 'div' } = attributes;
	const myElementRef = useRef(null);
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
	const globalStylesCss = getGlobalStylesCSSOutput(globalStylesIds);
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
	// This is needed because spacing visualizer needs to be able to access the block element and so does core.
	const mergedRefs = useMergeRefs([myElementRef, innerBlocksProps.ref]);
	const finalInnerBlocksProps = {
		...innerBlocksProps,
		ref: mergedRefs,
		draggable: false,
	};
	return (
		<GlobalStylesContext.Provider value={globalStylesIds}>
			<Inspector
				{...props}
				previewDevice={previewDevice}
				globalStylesIds={globalStylesIds}
				globalStylesCss={globalStylesCss}
				blockElementRef={myElementRef}
			/>
			{/* <Toolbar {...props} />
				<Inspector {...props} />
				*/}
			<Styles
				{...props}
				previewDevice={previewDevice}
				globalStylesIds={globalStylesIds}
				globalStylesCss={globalStylesCss}
			/>
			<TagName {...finalInnerBlocksProps}>
				<BackgroundStyles
					previewDevice={previewDevice}
					meta={metadata}
					globalStylesIds={globalStylesIds}
					backgroundAttribute="background"
					{...props}
				/>
				{children}
				{isSelected && (
					<InlinePaddingResizer
						previewDevice={previewDevice}
						type={'padding'}
						attributes={attributes}
						setAttributes={setAttributes}
						attributeName={'padding'}
						meta={metadata}
						globalStylesIds={globalStylesIds}
						blockElementRef={myElementRef}
						clientId={clientId}
						uniqueID={uniqueID}
						toggleSelection={toggleSelection}
					/>
				)}
			</TagName>
		</GlobalStylesContext.Provider>
	);
}
const RowEditWrapper = (props) => {
	const { clientId, attributes, setAttributes } = props;
	const { prebuilt } = attributes;
	// Cut everything short if we are just accessing the modal.
	if (prebuilt) {
		return <PrebuiltLibraryModal clientId={clientId} onlyModal={true} isOpen={true} setIsOpen={() => {}} />;
	}

	return <RowEdit {...props} />;
};
export default RowEditWrapper;
