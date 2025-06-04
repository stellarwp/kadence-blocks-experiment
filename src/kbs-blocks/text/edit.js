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
	useGlobalStylesIds,
	getLinkHTML,
} from '@kadence/kbsHelpers';

import metadata from './block.json';
import Styles from './editing/styles';
import Inspector from './editing/inspector';

/**
 * Import WordPress
 */
import { __ } from '@wordpress/i18n';

import { useSelect, select } from '@wordpress/data';
import { useEffect, useContext, Fragment } from '@wordpress/element';
import {
	RichText,
	useBlockProps,
	store as blockEditorStore,
	BlockControls,
	AlignmentToolbar,
} from '@wordpress/block-editor';

import { DynamicTextControl } from '@kadence/kbsComponents';

/**
 * Build the text editor.
 */
export default function TextEdit(props) {
	const { attributes, setAttributes, className } = props;
	const { uniqueID, content, align, globalStyleIds, htmlTag, link } = attributes;

	// Get merged global styles IDs using the helper hook
	const globalStylesIds = useGlobalStylesIds(globalStyleIds);

	const { previewDevice } = useSelect((select) => {
		return {
			previewDevice: select('kadenceblocks/data').getPreviewDeviceType(),
		};
	}, []);

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

	const contentHTML = (
		<RichText
			tagName={htmlTag}
			className="kbs-text-content"
			value={content}
			onChange={onContentChange}
			placeholder={__('Write something…', 'kadence-blocks')}
		/>
	);

	const linkContentHTML = getLinkHTML(link, contentHTML);

	return (
		<GlobalStylesContext.Provider value={globalStylesIds}>
			<div {...blockProps}>
				<Inspector {...props} previewDevice={previewDevice} globalStylesIds={globalStylesIds} />
				<Styles {...props} previewDevice={previewDevice} globalStylesIds={globalStylesIds} />
				<BlockControls>
					<AlignmentToolbar value={align} onChange={onAlignChange} />
					<DynamicTextControl dynamicAttribute={'content'} {...props} />
				</BlockControls>
				{link?.url && linkContentHTML}
				{!link?.url && contentHTML}
			</div>
		</GlobalStylesContext.Provider>
	);
}
