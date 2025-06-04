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
import { applyFilters } from '@wordpress/hooks';

import { DynamicTextControl } from '@kadence/kbsComponents';

/**
 * Build the text editor.
 */
export default function TextEdit(props) {
	const { attributes, setAttributes, className } = props;
	const { uniqueID, content, align, globalStyleIds, htmlTag, link, kadenceDynamic } = attributes;

	// Get merged global styles IDs using the helper hook
	const globalStylesIds = useGlobalStylesIds(globalStyleIds);

	const { previewDevice, allowedFormats } = useSelect((select) => {
		return {
			previewDevice: select('kadenceblocks/data').getPreviewDeviceType(),
			allowedFormats: select('core/rich-text').getFormatTypes(),
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

	const isDynamicReplaced =
		undefined !== kadenceDynamic &&
		undefined !== kadenceDynamic.content &&
		undefined !== kadenceDynamic.content.enable &&
		kadenceDynamic.content.enable;

	let richTextFormatsBase = applyFilters(
		'kadence.whitelist_richtext_formats',
		[
			'core/bold',
			'core/italic',
			'kadence/mark',
			'kadence/typed',
			'core/strikethrough',
			'core/superscript',
			'core/superscript',
			'toolset/inline-field',
		],
		'kbs/text'
	);

	let richTextFormats = allowedFormats.map((format) => format.name);
	if (link || kadenceDynamic?.content?.shouldReplace) {
		richTextFormatsBase = !kadenceDynamic?.content?.shouldReplace
			? [...['kadence/insert-dynamic'], ...richTextFormatsBase]
			: richTextFormatsBase;
		richTextFormats = richTextFormatsBase;
	}

	const contentHTML = (
		<RichText
			tagName={htmlTag}
			className="kbs-text-content"
			value={content}
			onChange={onContentChange}
			placeholder={__('Write something…', 'kadence-blocks')}
			allowedFormats={richTextFormats}
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
					{Boolean(kadenceDynamic?.content?.shouldReplace) && (
						<DynamicTextControl dynamicAttribute={'content'} {...props} />
					)}
				</BlockControls>
				{link?.url && linkContentHTML}
				{!link?.url && contentHTML}
			</div>
		</GlobalStylesContext.Provider>
	);
}
