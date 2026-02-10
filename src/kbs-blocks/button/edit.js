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

import metadata from './block.json';

/**
 * Import WordPress
 */
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import { useMemo, useRef } from '@wordpress/element';
import { useMergeRefs } from '@wordpress/compose';
import { RichText, useBlockProps, BlockControls, AlignmentToolbar, createBlock } from '@wordpress/block-editor';
import { ToolbarGroup, ToolbarDropdownMenu } from '@wordpress/components';
import { applyFilters } from '@wordpress/hooks';

import {
	uniqueIdHelper,
	GlobalStylesContext,
	useGlobalStylesIds,
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
	LinkControlToolbar,
} from '@kadence/kbsComponents';

const nonTransAttrs = ['content', 'htmlTag', 'link'];

/**
 * Build the button editor.
 */
export default function ButtonEdit(props) {
	const { attributes, setAttributes, className, isSelected, clientId, toggleSelection, mergeBlocks, onReplace } =
		props;
	const { uniqueID, content, globalStyleIds, link, kadenceDynamic } = attributes;
	const myElementRef = useRef(null);

	// Get merged global styles IDs using the helper hook
	const globalStylesIds = useGlobalStylesIds(globalStyleIds);

	const { previewDevice } = useSelect((select) => {
		return {
			previewDevice: select('kadenceblocks/data').getPreviewDeviceType(),
		};
	}, []);

	uniqueIdHelper(props);

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

	const hasIcon = iconAnyValue?.appliedValue ? true : false;
	const hasIconReveal = iconRevealAnyValue?.appliedValue ? true : false;

	const classes = classnames('kbs-button', {
		[className]: className,
		[`kbs-button-${uniqueID}`]: uniqueID,
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

	const richTextFormatsBase = applyFilters(
		'kadence.whitelist_richtext_formats',
		[
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
		'kbs/button'
	);

	const richTextFormats = !kadenceDynamic?.content?.shouldReplace
		? [...['kadence/insert-dynamic'], ...richTextFormatsBase]
		: richTextFormatsBase;

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
			onReplace={onReplace}
			onRemove={() => onReplace([])}
		/>
	);

	const controlsAndStylesHTML = (
		<>
			<Inspector
				{...props}
				previewDevice={previewDevice}
				globalStylesIds={globalStylesIds}
				blockElementRef={myElementRef}
			/>
			<Styles {...props} previewDevice={previewDevice} globalStylesIds={globalStylesIds} />
			<BlockControls>
				<LinkControlToolbar
					additionalControls={true}
					allowClear={true}
					dynamicAttribute={'link'}
					isSelected={isSelected}
					attributes={attributes}
					setAttributes={setAttributes}
					name={'kadence/button'}
					clientId={clientId}
					attributeName={'link'}
					previewDevice={'none'}
					globalStylesIds={globalStylesIds}
					meta={metadata}
				/>
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
				{contentHTML}
				{previewIconPlacement === 'right' && <IconRender attributeName={'icon'} attributes={attributes} />}
			</span>
		</GlobalStylesContext.Provider>
	);
}
