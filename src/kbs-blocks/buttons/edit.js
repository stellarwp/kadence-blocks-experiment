/**
 * BLOCK: Kadence Column
 *
 * Registering a basic block with Gutenberg.
 */

/**
 * Import Controls
 */
import classnames from 'classnames';
import { get } from 'lodash';

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

import { useSelect, useDispatch } from '@wordpress/data';
import { useEffect, useMemo, useRef } from '@wordpress/element';
import { ToolbarGroup, ToolbarButton } from '@wordpress/components';
import {
	InnerBlocks,
	useBlockProps,
	useInnerBlocksProps,
	store as blockEditorStore,
	BlockControls,
} from '@wordpress/block-editor';
import { FORM_ALLOWED_BLOCKS } from './constants';
import { useMergeRefs } from '@wordpress/compose';
import { plusCircle } from '@wordpress/icons';
import { createBlock } from '@wordpress/blocks';
/**
 * Build the section edit.
 */
export default function ButtonsEdit(props) {
	const { attributes, setAttributes, isSelected, clientId, context, className, toggleSelection } = props;
	const { uniqueID, templateLock, align, globalStyleIds, tagName: TagName = 'div' } = attributes;
	const myElementRef = useRef(null);
	// Get merged global styles IDs using the helper hook
	const globalStylesIds = useGlobalStylesIds(globalStyleIds);
	const { insertBlock } = useDispatch(blockEditorStore);
	const { hasInnerBlocks, previewDevice, thisBlock } = useSelect(
		(select) => {
			const { getBlock } = select(blockEditorStore);
			const block = getBlock(clientId);

			return {
				hasInnerBlocks: !!(block && block.innerBlocks.length),
				previewDevice: select('kadenceblocks/data').getPreviewDeviceType(),
				thisBlock: select('core/block-editor').getBlock(clientId),
			};
		},
		[clientId]
	);
	uniqueIdHelper(props);

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
	const classes = classnames('kbs-buttons', globalClasses, {
		[className]: className,
		[`kbs-buttons-${uniqueID}`]: uniqueID,
		['kbs-only-appender']: !hasInnerBlocks,
	});
	const blockProps = useBlockProps({
		className: classes,
	});
	const allowedBlocks = ['kbs/button'];
	const template = [['kbs/button']];
	const defaultBlock = {
		name: 'kbs/button',
		attributesToCopy: ['sizePreset', 'inheritStyles', 'widthType'],
	};
	const { children, ...innerBlocksProps } = useInnerBlocksProps(blockProps, {
		orientation: 'horizontal',
		templateLock: false,
		templateInsertUpdatesSelection: true,
		defaultBlock: defaultBlock,
		directInsert: true,
		allowedBlocks: allowedBlocks,
		template: template,
	});

	const getAddNewAttributes = () => {
		return get(thisBlock, ['innerBlocks', thisBlock.innerBlocks.length - 1, 'attributes'], {});
	};

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
			<BlockControls>
				<ToolbarGroup>
					<ToolbarButton
						className="kb-icons-add-icon"
						icon={plusCircle}
						onClick={() => {
							const prevAttributes = getAddNewAttributes();
							const latestAttributes = JSON.parse(JSON.stringify(prevAttributes));
							latestAttributes.uniqueID = '';
							const newBlock = createBlock('kbs/button', latestAttributes);
							insertBlock(newBlock, parseInt(thisBlock.innerBlocks.length), clientId);
						}}
						label={__('Duplicate Previous Button', 'kadence-blocks')}
						showTooltip={true}
					/>
				</ToolbarGroup>
			</BlockControls>
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
				{/* {isSelected && (
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
				)} */}
			</TagName>
		</GlobalStylesContext.Provider>
	);
}
