/**
 * BLOCK: Kadence Column
 *
 * Registering a basic block with Gutenberg.
 */

/**
 * Import Controls
 */
import classnames from 'classnames';
import { debounce } from 'lodash';

/**
 * Kadence Helpers.
 */
import {
	uniqueIdHelper,
} from '@kadence/kbsHelpers';

import metadata from './block.json';
import Inspector from './editing/inspector';
import Styles from './editing/styles';
import Toolbar from './editing/toolbar';
/**
 * Import WordPress
 */
import { __ } from '@wordpress/i18n';

import { useSelect, useDispatch } from '@wordpress/data';
import { useEffect, useState, Fragment } from '@wordpress/element';
import {
	BlockAlignmentToolbar,
	BlockVerticalAlignmentToolbar,
	BlockControls,
	InnerBlocks,
	InspectorControls,
	useBlockProps,
	useInnerBlocksProps,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { ToggleControl, SelectControl, ToolbarGroup, ExternalLink } from '@wordpress/components';
import { FORM_ALLOWED_BLOCKS } from './constants';
import { applyFilters } from '@wordpress/hooks';
/**
 * Build the section edit.
 */
export default function ContainerEdit(props) {
	const { attributes, setAttributes, isSelected, clientId, context, className } = props;
	const {
		uniqueID,
		templateLock,
		align,
	} = attributes;
	const { hasInnerBlocks, inRowBlock, inFormBlock } = useSelect(
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
			};
		},
		[clientId]
	);
	uniqueIdHelper( props );
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

	const previewDirection = 'vertical';
	const classes = classnames( 'kbs-container',{
		[className]: className,
		[`kbs-container-${uniqueID}`]: uniqueID,
		[ 'kbs-only-appender' ]: ! hasInnerBlocks,
	});
	const blockProps = useBlockProps({
		className: classes,
		'data-align': !inRowBlock && ('full' === align || 'wide' === align) ? align : undefined,
	});
	const innerBlocksProps = useInnerBlocksProps(
		{
			orientation:
				previewDirection === 'horizontal' || previewDirection === 'horizontal-reverse'
					? 'horizontal'
					: 'vertical',
			templateLock,
			renderAppender: hasInnerBlocks ? undefined : InnerBlocks.ButtonBlockAppender,
			allowedBlocks: inFormBlock ? FORM_ALLOWED_BLOCKS : undefined,
		}
	);
	// console.log('RenderEdit', { props, attributes, clientId, context, className, hasInnerBlocks, inRowBlock, inFormBlock, blockProps, innerBlocksProps });
	return (
		<div {...blockProps}>
			<Inspector {...props} />
			{/* <Toolbar {...props} />
			<Inspector {...props} />
			<Styles {...props} /> */}
			<Fragment {...innerBlocksProps} />
			{/* <SpacingVisualizer
				style={{
					marginLeft:
						undefined !== previewMarginLeft
							? getSpacingOptionOutput(previewMarginLeft, previewMarginType)
							: undefined,
					marginRight:
						undefined !== previewMarginRight
							? getSpacingOptionOutput(previewMarginRight, previewMarginType)
							: undefined,
					marginTop:
						undefined !== previewMarginTop
							? getSpacingOptionOutput(previewMarginTop, previewMarginType)
							: undefined,
					marginBottom:
						undefined !== previewMarginBottom
							? getSpacingOptionOutput(previewMarginBottom, previewMarginType)
							: undefined,
				}}
				type="inside"
				forceShow={paddingMouseOver.isMouseOver}
				spacing={[
					getSpacingOptionOutput(previewPaddingTop, previewPaddingType),
					getSpacingOptionOutput(previewPaddingRight, previewPaddingType),
					getSpacingOptionOutput(previewPaddingBottom, previewPaddingType),
					getSpacingOptionOutput(previewPaddingLeft, previewPaddingType),
				]}
			/>
			<SpacingVisualizer
				type="outsideVertical"
				forceShow={marginMouseOver.isMouseOver}
				spacing={[
					getSpacingOptionOutput(previewMarginTop, previewMarginType),
					getSpacingOptionOutput(previewMarginRight, previewMarginType),
					getSpacingOptionOutput(previewMarginBottom, previewMarginType),
					getSpacingOptionOutput(previewMarginLeft, previewMarginType),
				]}
			/> */}
		</div>
	);
}
