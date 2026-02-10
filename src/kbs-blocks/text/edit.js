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
import { __, sprintf } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import { useMemo, useRef, useEffect } from '@wordpress/element';
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
	getGlobalStylesCSSOutput,
	registerGoogleFonts,
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
 * Build the text editor.
 */
export default function TextEdit(props) {
	const { attributes, setAttributes, className, isSelected, clientId, toggleSelection, mergeBlocks, onReplace } =
		props;
	const { uniqueID, content, globalStyleIds, htmlTag, link, kadenceDynamic } = attributes;
	const myElementRef = useRef(null);

	// Get merged global styles IDs using the helper hook
	const globalStylesIds = useGlobalStylesIds(globalStyleIds);
	const globalStylesCss = getGlobalStylesCSSOutput(globalStylesIds);

	const { previewDevice, allowedFormats } = useSelect((select) => {
		return {
			previewDevice: select('kadenceblocks/data').getPreviewDeviceType(),
			allowedFormats: select('core/rich-text').getFormatTypes(),
		};
	}, []);

	uniqueIdHelper(props);
	registerGoogleFonts(props, metadata);

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

	const maxWidthAnyValue = useMemo(
		() => getResolvedValue('maxWidth', attributes, 'any', metadata, 'maxWidth', globalStylesIds),
		[attributes]
	);
	const iconAnyValue = useMemo(
		() => getResolvedValue('icon', attributes, 'any', metadata, 'icon', globalStylesIds),
		[attributes]
	);
	const iconRevealAnyValue = useMemo(
		() => getResolvedValue('iconReveal', attributes, 'any', metadata, 'iconReveal', globalStylesIds),
		[attributes]
	);
	const iconPlacementAnyValue = useMemo(
		() => getResolvedValue('icon', attributes, 'any', metadata, 'placement', globalStylesIds),
		[attributes]
	);
	const previewIconPlacement = iconPlacementAnyValue?.appliedValue;

	//look for gradient text marker in the color value
	const hasGradient = previewColorValue?.includes('gradient(');
	const hasGradientHighlight = previewColorHighlightValue?.includes('gradient(');

	const headingOptions = [
		['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'div', 'span', 'p'].map((tag) => ({
			icon: <HeadingLevelIcon level={tag} isPressed={tag === htmlTag} />,
			title:
				tag === 'div'
					? __('Div', 'kadence-blocks')
					: tag === 'span'
						? __('Span', 'kadence-blocks')
						: tag === 'p'
							? __('Paragraph', 'kadence-blocks')
							: sprintf(
									/* translators: %s: heading level number (1-6) */
									__('Heading %s', 'kadence-blocks'),
									tag.charAt(1)
								),
			isActive: tag === htmlTag,
			onClick: () => setAttributes({ htmlTag: tag }),
		})),
	];

	const hasLink = link?.url ? true : false;
	const hasMaxWidth = maxWidthAnyValue?.appliedValue ? true : false;
	const hasIcon = iconAnyValue?.appliedValue ? true : false;
	const hasIconReveal = iconRevealAnyValue?.appliedValue ? true : false;
	const hasTypedText = content?.includes('kt-typed-text');
	const shouldWrapContent = hasLink || hasMaxWidth || hasIcon || hasGradient || hasTypedText;

	const classes = classnames('kbs-text', {
		[className]: className,
		[`kbs-text-${uniqueID}`]: uniqueID,
		[`has-gradient`]: hasGradient,
		[`has-gradient-highlight`]: hasGradientHighlight,
		[`kbs-text-content`]: !shouldWrapContent,
		'kbs-text-has-icon': hasIcon,
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
			'kbs/highlight',
			'kadence/typed',
			'kadence/tooltips',
			'kadence/insert-dynamic',
			'kadence/ai-text',
			'core/bold',
			'core/italic',
			'core/strikethrough',
			'core/underline',
			'core/subscript',
			'core/superscript',
			'core/keyboard',
			'core/language',
			'core/footnote',
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

	// This is needed because spacing visualizer needs to be able to access the block element and so does core.
	const mergedRefs = useMergeRefs([myElementRef, blockProps.ref]);
	const finalBlocksProps = {
		...blockProps,
		ref: mergedRefs,
		draggable: false,
	};

	const contentHTML = (
		<RichText
			{...(shouldWrapContent ? { className: 'kbs-text-content' } : finalBlocksProps)}
			tagName={shouldWrapContent ? 'span' : htmlTag}
			value={content}
			onChange={onContentChange}
			placeholder={__('Write something…', 'kadence-blocks')}
			allowedFormats={richTextFormats}
			onMerge={mergeBlocks}
			onReplace={onReplace}
			onRemove={() => onReplace([])}
		/>
	);
	const linkContentHTML = getLinkHTML(link, contentHTML);
	const WrapperTag = htmlTag;

	const controlsAndStylesHTML = (
		<>
			<Inspector
				{...props}
				previewDevice={previewDevice}
				globalStylesIds={globalStylesIds}
				hasGradient={hasGradient}
				hasGradientHighlight={hasGradientHighlight}
				blockElementRef={myElementRef}
				globalStylesCss={globalStylesCss}
			/>
			<Styles {...props} previewDevice={previewDevice} globalStylesIds={globalStylesIds} />
			<BlockControls>
				<ToolbarGroup group="tag">
					<ToolbarDropdownMenu
						icon={<HeadingLevelIcon level={htmlTag} />}
						label={__('Change text tag', 'kadence-blocks')}
						controls={headingOptions}
					/>
				</ToolbarGroup>

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
			{!shouldWrapContent && <>{contentHTML}</>}
			{shouldWrapContent && (
				<WrapperTag {...finalBlocksProps}>
					{previewIconPlacement !== 'right' && <IconRender attributeName={'icon'} attributes={attributes} />}
					{link?.url && linkContentHTML}
					{!link?.url && contentHTML}
					{previewIconPlacement === 'right' && <IconRender attributeName={'icon'} attributes={attributes} />}
				</WrapperTag>
			)}
		</GlobalStylesContext.Provider>
	);
}
