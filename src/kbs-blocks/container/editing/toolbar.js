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
 * Kadence Components.
 */
import {
	CopyPasteAttributes,
} from '@kadence/components';

/**
 * Kadence Helpers.
 */
import {
	getPreviewSize,
} from '@kadence/helpers';

import metadata from '../block.json';
/**
 * Import WordPress
 */
import { __ } from '@wordpress/i18n';

import { useSelect, useDispatch } from '@wordpress/data';
import { useEffect, useState } from '@wordpress/element';
import {
	BlockAlignmentToolbar,
	BlockVerticalAlignmentToolbar,
	BlockControls,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { ToggleControl, SelectControl, ToolbarGroup, ExternalLink } from '@wordpress/components';

/**
 * Build the section edit.
 */
export default function SectionToolbar(props) {
	const { attributes, setAttributes, isSelected, clientId, context, className } = props;
	const {
		direction,
		verticalAlignment,
		verticalAlignmentTablet,
		verticalAlignmentMobile,
		align,
	} = attributes;
	const { previewDevice } = useSelect(
		(select) => {
			return {
				previewDevice: select('kadenceblocks/data').getPreviewDeviceType(),
			};
		},
		[clientId]
	);

	const { inRowBlock } = useSelect(
		(select) => {
			const {  getBlockRootClientId, getBlocksByClientId } =
				select(blockEditorStore);
			const rootID = getBlockRootClientId(clientId);
			let inRowBlock = false;
			if (rootID) {
				const parentBlock = getBlocksByClientId(rootID);
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
			};
		},
		[clientId]
	);


	const previewVerticalAlign = getPreviewSize(
		previewDevice,
		verticalAlignment ? verticalAlignment : '',
		verticalAlignmentTablet ? verticalAlignmentTablet : '',
		verticalAlignmentMobile ? verticalAlignmentMobile : ''
	);

	const previewDirection = getPreviewSize(
		previewDevice,
		direction && '' !== direction[0] ? direction[0] : 'vertical',
		direction && '' !== direction[1] ? direction[1] : '',
		direction && '' !== direction[2] ? direction[2] : ''
	);

	const nonTransAttrs = ['images', 'imagesDynamic'];


	const actualVerticalAlign = previewVerticalAlign
		? previewVerticalAlign
		: previewDirection === 'horizontal' || previewDirection === 'horizontal-reverse'
		? 'middle'
		: 'top';


	return (
		<BlockControls>
			{!inRowBlock && (
				<BlockAlignmentToolbar
					value={align}
					controls={['wide', 'full']}
					onChange={(value) => setAttributes({ align: value })}
				/>
			)}
			{/* <BlockVerticalAlignmentToolbar
				value={actualVerticalAlign === 'middle' ? 'center' : actualVerticalAlign}
				controls={['top', 'center', 'bottom', 'stretch']}
				onChange={(value) => {
					if (value === 'center') {
						setAttributes({ verticalAlignment: 'middle' });
					} else if (value === 'bottom') {
						setAttributes({ verticalAlignment: 'bottom' });
					} else if (value === 'top') {
						setAttributes({ verticalAlignment: 'top' });
					} else if (value === 'stretch') {
						setAttributes({ verticalAlignment: 'stretch' });
					} else {
						setAttributes({ verticalAlignment: '' });
					}
				}}
			/> */}
			{/* <CopyPasteAttributes
				attributes={attributes}
				excludedAttrs={nonTransAttrs}
				defaultAttributes={metadata.attributes}
				blockSlug={metadata.name}
				onPaste={(attributesToPaste) => setAttributes(attributesToPaste)}
			/> */}
		</BlockControls>
	);
}
