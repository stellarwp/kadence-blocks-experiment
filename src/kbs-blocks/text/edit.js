/**
 * BLOCK: Kadence Text
 *
 * Registering a basic block with Gutenberg.
 */

/**
 * Import Controls
 */
import classnames from 'classnames';

import Styles from './editing/styles';
import Inspector from './editing/inspector';
import './formats/markformat';
import './formats/typed-text';
import './formats/tooltips';

import metadata from './block.json';

/**
 * Import WordPress
 */
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import { useRef } from '@wordpress/element';
import { useMergeRefs } from '@wordpress/compose';
import { RichText, useBlockProps, BlockControls, AlignmentToolbar } from '@wordpress/block-editor';
import { applyFilters } from '@wordpress/hooks';

import {
	uniqueIdHelper,
	GlobalStylesContext,
	useGlobalStylesIds,
	getLinkHTML,
	getResolvedValue,
	getColorOutput,
} from '@kadence/kbsHelpers';
import { DynamicTextControl, IconRender, InlinePaddingResizer } from '@kadence/kbsComponents';

/**
 * Build the text editor.
 */
export default function TextEdit(props) {
	const { attributes, setAttributes, className, isSelected, clientId, toggleSelection } = props;
	const { uniqueID, content, align, globalStyleIds, htmlTag, link, kadenceDynamic } = attributes;
	const myElementRef = useRef(null);

	// Get merged global styles IDs using the helper hook
	const globalStylesIds = useGlobalStylesIds(globalStyleIds);

	const { previewDevice, allowedFormats } = useSelect((select) => {
		return {
			previewDevice: select('kadenceblocks/data').getPreviewDeviceType(),
			allowedFormats: select('core/rich-text').getFormatTypes(),
		};
	}, []);

	uniqueIdHelper(props);

	const colorValue = getResolvedValue('color', attributes, previewDevice, metadata, 'color', globalStylesIds);
	const previewColorValue = getColorOutput(colorValue?.appliedValue);
	const colorHighlightValue = getResolvedValue(
		'colorHighlight',
		attributes,
		previewDevice,
		metadata,
		'color',
		globalStylesIds
	);
	const previewColorHighlightValue = getColorOutput(colorHighlightValue?.appliedValue);

	//look for gradient text marker in the color value
	const hasGradient = previewColorValue?.includes('gradient(');
	const hasGradientHighlight = previewColorHighlightValue?.includes('gradient(');

	const classes = classnames('kbs-text', {
		[className]: className,
		[`kbs-text-${uniqueID}`]: uniqueID,
		[`has-text-align-${align}`]: align,
		[`has-gradient`]: hasGradient,
		[`has-gradient-highlight`]: hasGradientHighlight,
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

	//TODO
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
			'kadence/tooltips',
			'core/strikethrough',
			'core/superscript',
			'core/superscript',
			'toolset/inline-field',
			'kadence/ai-text',
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

	// This is needed because spacing visualizer needs to be able to access the block element and so does core.
	const mergedRefs = useMergeRefs([myElementRef, blockProps.ref]);
	const finalBlocksProps = {
		...blockProps,
		ref: mergedRefs,
		draggable: false,
	};
	return (
		<GlobalStylesContext.Provider value={globalStylesIds}>
			<div {...finalBlocksProps}>
				<Inspector
					{...props}
					previewDevice={previewDevice}
					globalStylesIds={globalStylesIds}
					hasGradient={hasGradient}
					hasGradientHighlight={hasGradientHighlight}
					blockElementRef={myElementRef}
				/>
				<Styles {...props} previewDevice={previewDevice} globalStylesIds={globalStylesIds} />
				<BlockControls>
					<AlignmentToolbar value={align} onChange={onAlignChange} />
					{Boolean(kadenceDynamic?.content?.shouldReplace) && (
						<DynamicTextControl dynamicAttribute={'content'} {...props} />
					)}
				</BlockControls>
				{link?.url && linkContentHTML}
				{!link?.url && contentHTML}

				<IconRender attributeName={'icon'} attributes={attributes} />
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
			</div>
		</GlobalStylesContext.Provider>
	);
}
