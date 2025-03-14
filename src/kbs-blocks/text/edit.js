/**
 * BLOCK: Kadence Text
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
	useGlobalStylesIds
} from '@kadence/kbsHelpers';

import metadata from './block.json';
import Styles from './editing/styles';
import Inspector from './editing/inspector';

/**
 * Import WordPress
 */
import { __ } from '@wordpress/i18n';

import { useSelect } from '@wordpress/data';
import { useEffect, useContext, Fragment } from '@wordpress/element';
import {
	RichText,
	useBlockProps,
	store as blockEditorStore,
	BlockControls,
	AlignmentToolbar
} from '@wordpress/block-editor';

/**
 * Build the text editor.
 */
export default function TextEdit(props) {
	const { attributes, setAttributes, isSelected, clientId, context, className } = props;
	const {
		uniqueID,
		content,
		align,
		globalStyleIds
	} = attributes;

	// Get merged global styles IDs using the helper hook
	const globalStylesIds = useGlobalStylesIds(globalStyleIds);

	const { globalStylesJson, previewDevice } = useSelect(
		(select) => {
			return {
				globalStylesJson: select('kadenceblocks/global-styles').getMergedGlobalStyle(globalStylesIds),
				previewDevice: select('kadenceblocks/data').getPreviewDeviceType(),
			};
		},
		[globalStylesIds]
	);

	uniqueIdHelper(props);

	const classes = classnames('kbs-text', {
		[className]: className,
		[`kbs-text-${uniqueID}`]: uniqueID,
		[`has-text-align-${align}`]: align,
	});
	
	const blockProps = useBlockProps({
		className: classes,
	});

	const onContentChange = (value) => {
		setAttributes({ content: value });
	};

	const onAlignChange = (nextAlign) => {
		setAttributes({ align: nextAlign });
	};

	return (
		<GlobalStylesContext.Provider value={globalStylesIds}>
			<div {...blockProps}>
				<Inspector {...{ previewDevice, globalStylesJson, ...props }} />
				<Styles {...{ previewDevice, ...props }} />
				<BlockControls>
					<AlignmentToolbar value={align} onChange={onAlignChange} />
				</BlockControls>
				<RichText
					tagName="div"
					className="kbs-text-content"
					value={content}
					onChange={onContentChange}
					placeholder={__('Add text…', 'kadence-blocks')}
					keepPlaceholderOnFocus
				/>
			</div>
		</GlobalStylesContext.Provider>
	);
} 