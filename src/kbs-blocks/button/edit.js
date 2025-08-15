/**
 * BLOCK: Kadence Button
 *
 * Registering a basic block with Gutenberg.
 */

/**
 * Import Controls
 */
import classnames from 'classnames';

import Styles from './editing/styles';
import Inspector from './editing/inspector';
import '../text/formats/markformat';
import '../text/formats/typed-text';

import metadata from './block.json';

/**
 * Import WordPress
 */
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import { useMemo, useRef } from '@wordpress/element';
import { useMergeRefs } from '@wordpress/compose';
import { RichText, useBlockProps, BlockControls, AlignmentToolbar } from '@wordpress/block-editor';
import { ToolbarGroup, ToolbarDropdownMenu } from '@wordpress/components';
import { applyFilters } from '@wordpress/hooks';

import {
	uniqueIdHelper,
	GlobalStylesContext,
	useGlobalStylesIds,
	getLinkHTML,
	getResolvedValue,
	getColorOutput,
	handleAttributeChange,
} from '@kadence/kbsHelpers';
import {
	DynamicTextControl,
	IconRender,
	InlinePaddingResizer,
	CopyPasteAttributes,
	TextAlignToolbar,
	HeadingLevelIcon,
} from '@kadence/kbsComponents';

const nonTransAttrs = ['content', 'htmlTag', 'link'];

/**
 * Build the button editor.
 */
export default function ButtonEdit(props) {
	const { attributes, setAttributes, className, isSelected, clientId, toggleSelection, mergeBlocks, onReplace } =
		props;
	const { uniqueID, content, textAlign, globalStyleIds, htmlTag, link, kadenceDynamic } = attributes;
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
		'desktop',
		metadata,
		'color',
		globalStylesIds
	);
	const previewColorHighlightValue = getColorOutput(colorHighlightValue?.appliedValue);

	const previewTag = 'span';

	const iconAnyValue = useMemo(
		() => getResolvedValue('icon', attributes, 'any', metadata, 'icon', globalStylesIds),
		[attributes]
	);
	const iconPlacementAnyValue = useMemo(
		() => getResolvedValue('icon', attributes, 'any', metadata, 'placement', globalStylesIds),
		[attributes]
	);
	const iconRevealAnyValue = useMemo(
		() => getResolvedValue('iconReveal', attributes, 'any', metadata, 'iconReveal', globalStylesIds),
		[attributes]
	);

	const previewIconPlacement = iconPlacementAnyValue?.appliedValue;

	//look for gradient text marker in the color value
	const hasGradient = previewColorValue?.includes('gradient(');
	const hasGradientHighlight = previewColorHighlightValue?.includes('gradient(');

	const hasIcon = iconAnyValue?.appliedValue ? true : false;
	const hasIconReveal = iconRevealAnyValue?.appliedValue ? true : false;

	const classes = classnames('kbs-button', {
		[className]: className,
		[`kbs-button-${uniqueID}`]: uniqueID,
		[`has-text-align-${textAlign}`]: textAlign,
		[`has-gradient`]: hasGradient,
		[`has-gradient-highlight`]: hasGradientHighlight,
		'kbs-button-has-icon': hasIcon,
		'icon-reveal': hasIcon && hasIconReveal,
	});

	const blockProps = useBlockProps({
		className: classes,
	});

	const onContentChange = (value) => {
		setAttributes({ content: value });
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
			'core/strikethrough',
			'core/superscript',
			'core/superscript',
			'toolset/inline-field',
			'kadence/ai-text',
		],
		'kbs/button'
	);

	let richTextFormats = allowedFormats.map((format) => format.name);
	if (link || kadenceDynamic?.content?.shouldReplace) {
		richTextFormatsBase = !kadenceDynamic?.content?.shouldReplace
			? [...['kadence/insert-dynamic'], ...richTextFormatsBase]
			: richTextFormatsBase;
		richTextFormats = richTextFormatsBase;
	}

	// This is needed because spacing visualizer needs to be able to access the block element and so does core.
	const mergedRefs = useMergeRefs([myElementRef, blockProps.ref]);
	const finalBlocksProps = {
		...blockProps,
		ref: mergedRefs,
		draggable: false,
	};

	const contentHTML = (
		<RichText
			className="kbs-button-content"
			tagName={previewTag}
			value={content}
			onChange={onContentChange}
			placeholder={__('Write something…', 'kadence-blocks')}
			allowedFormats={richTextFormats}
			onMerge={mergeBlocks}
			onSplit={(value) => {
				if (!value && !isDefaultEditorBlock) {
					return createBlock('core/paragraph');
				}
				return createBlock('kadence/advancedheading', {
					...attributes,
					content: value ?? '',
				});
			}}
			onReplace={onReplace}
			onRemove={() => onReplace([])}
		/>
	);

	const linkContentHTML = getLinkHTML(link, contentHTML);

	const controlsAndStylesHTML = (
		<>
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
				<TextAlignToolbar {...props} />
				<CopyPasteAttributes
					attributes={attributes}
					excludedAttrs={nonTransAttrs}
					defaultAttributes={metadata.attributes}
					blockSlug={metadata.name}
					onPaste={(attributesToPaste) => setAttributes(attributesToPaste)}
				/>
				{Boolean(kadenceDynamic?.content?.shouldReplace) && (
					<DynamicTextControl dynamicAttribute={'content'} {...props} />
				)}
			</BlockControls>
		</>
	);

	return (
		<GlobalStylesContext.Provider value={globalStylesIds}>
			{controlsAndStylesHTML}
			<span {...finalBlocksProps}>
				{previewIconPlacement !== 'right' && <IconRender attributeName={'icon'} attributes={attributes} />}
				{link?.url && linkContentHTML}
				{!link?.url && contentHTML}
				{previewIconPlacement === 'right' && <IconRender attributeName={'icon'} attributes={attributes} />}
			</span>
		</GlobalStylesContext.Provider>
	);
}
