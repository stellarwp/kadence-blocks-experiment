/**
 * BLOCK: Kadence Column
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
	getGlobalStylesCSSOutput,
	getResolvedValue,
	handleMultipleAttributeChange,
	handleAttributeChange,
} from '@kadence/kbsHelpers';
import { BackgroundStyles, MediaPlaceholder } from '@kadence/kbsComponents';
import metadata from './block.json';
import Inspector from './editing/inspector';
import Styles from './editing/styles';
import { ALLOWED_MEDIA_TYPES } from './constants';
/**
 * Import WordPress
 */
import { __ } from '@wordpress/i18n';

import { useSelect, select } from '@wordpress/data';
import { useEffect, useMemo, useRef, useState, useCallback } from '@wordpress/element';
import { useBlockProps, BlockControls, BlockAlignmentControl } from '@wordpress/block-editor';
import { caption as captionIcon } from '@wordpress/icons';
import { ToolbarButton, plusCircleFilled } from '@wordpress/components';
import { usePrevious } from '@wordpress/compose';
import { RichText, MediaReplaceFlow } from '@wordpress/block-editor';
import { createBlock } from '@wordpress/blocks';

/**
 * Build the section edit.
 */
export default function ImageEdit(props) {
	const { attributes, setAttributes, isSelected, clientId, className, onUploadError } = props;
	const { uniqueID, globalStyleIds, caption, align } = attributes;
	const myElementRef = useRef(null);
	// Get merged global styles IDs using the helper hook
	const globalStylesIds = useGlobalStylesIds(globalStyleIds);
	const { previewDevice } = useSelect(
		(select) => {
			return {
				previewDevice: select('kadenceblocks/data').getPreviewDeviceType(),
			};
		},
		[clientId]
	);
	uniqueIdHelper(props);

	const onImageSelect = (value, device = 'none') => {
		handleMultipleAttributeChange(
			[value?.url ? value?.url : undefined, value?.id ? value?.id : undefined],
			device,
			'image',
			attributes,
			setAttributes,
			null,
			['image', 'imageId'],
			metadata
		);
	};

	const dynamicAttribute = 'image';

	const imageResolvedValue = getResolvedValue('image', attributes, 'none', metadata, 'image', globalStylesIds);
	const imageIdResolvedValue = getResolvedValue('image', attributes, 'none', metadata, 'imageId', globalStylesIds);
	const aspectRatioAnyResolvedValue = getResolvedValue(
		'aspectRatio',
		attributes,
		'any',
		metadata,
		'aspectRatio',
		globalStylesIds
	);
	const ratioAnyResolvedValue = getResolvedValue('ratio', attributes, 'any', metadata, 'ratio', globalStylesIds);
	const filterSimpleAnyResolvedValue = getResolvedValue(
		'filter',
		attributes,
		'any',
		metadata,
		'simple',
		globalStylesIds
	);
	const captionEnableAnyResolvedValue = getResolvedValue(
		'caption',
		attributes,
		'any',
		metadata,
		'enable',
		globalStylesIds
	);
	const captionEnableValue = captionEnableAnyResolvedValue?.appliedValue;
	const captionAnyResolvedValue = getResolvedValue(
		'caption',
		attributes,
		'any',
		metadata,
		'caption',
		globalStylesIds
	);
	const captionValue = captionAnyResolvedValue?.appliedValue;

	const filterSimple = filterSimpleAnyResolvedValue?.appliedValue;
	const hasImage = imageResolvedValue?.appliedValue;
	const hasRatio = aspectRatioAnyResolvedValue?.appliedValue;
	const hasOverlay = false;
	const hasWrapper = filterSimple || hasOverlay;
	const hasCaption = (!RichText.isEmpty(caption) || isSelected) && captionEnableValue;
	const isWideAligned = ['wide', 'full'].includes(align);

	const prevCaption = usePrevious(captionValue);
	// We need to show the caption when changes come from
	// history navigation(undo/redo).
	useEffect(() => {
		if (captionValue && !prevCaption) {
			onToggleCaption(true);
		}
	}, [captionValue, prevCaption]);

	// Focus the caption when we click to add one.
	const captionRef = useCallback(
		(node) => {
			if (node && !captionValue) {
				node.focus();
			}
		},
		[captionValue]
	);

	const onToggleCaption = (value = undefined) => {
		handleAttributeChange(
			value ? value : captionEnableValue ? false : true,
			'desktop',
			'caption',
			attributes,
			setAttributes,
			undefined,
			'enable',
			metadata
		);
	};

	function updateAlignment(nextAlign) {
		const extraUpdatedAttributes = ['wide', 'full'].includes(nextAlign)
			? { width: undefined, height: undefined }
			: {};
		setAttributes({
			...extraUpdatedAttributes,
			align: nextAlign,
		});
	}

	const globalStylesCss = getGlobalStylesCSSOutput(globalStylesIds);
	const globalClasses = useMemo(() => {
		return Object.keys(
			(globalStylesIds || []).reduce((acc, styleId) => {
				acc[`kbs-global-style-${styleId}`] = true;
				return acc;
			}, {})
		);
	}, [globalStylesIds]);

	const classes = classnames('kbs-image', globalClasses, {
		[className]: className,
		[`kbs-image-${uniqueID}`]: uniqueID,
		'kbs-image-has-image': hasImage,
		'kbs-image-has-ratio': hasRatio,
		'kbs-image-has-overlay': hasOverlay,
		'kbs-image-has-wrapper': hasWrapper,
		'kbs-image-is-wide-aligned': isWideAligned,
	});
	const blockProps = useBlockProps({
		className: classes,
		'data-align': align ? align : undefined,
	});

	const wrapperClasses = classnames('kbs-image-wrapper', {
		[`kbs-filter-${filterSimple}`]: filterSimple,
	});

	const imgHTML = <img className="kbs-image-img" src={imageResolvedValue?.appliedValue} />;

	return (
		<GlobalStylesContext.Provider value={globalStylesIds}>
			<Inspector
				{...props}
				previewDevice={previewDevice}
				globalStylesIds={globalStylesIds}
				globalStylesCss={globalStylesCss}
				blockElementRef={myElementRef}
				hasImage={hasImage}
			/>
			<Styles
				{...props}
				previewDevice={previewDevice}
				globalStylesIds={globalStylesIds}
				globalStylesCss={globalStylesCss}
			/>
			{!hasImage && (
				<div {...blockProps}>
					<MediaPlaceholder
						labels={''}
						value={{ url: imageResolvedValue?.appliedValue, id: imageIdResolvedValue?.appliedValue }}
						selectIcon={plusCircleFilled}
						selectLabel={__('Select Image', 'kadence-blocks')}
						onSelect={(image) => {
							onImageSelect(image);
						}}
						onSelectURL={(newURL) => onImageSelect({ url: newURL })}
						className={'kbs-image-upload-placeholder'}
						allowedTypes={'image'}
						disableMediaButtons={false}
					/>
				</div>
			)}
			{hasImage && (
				<>
					<BlockControls group="block">
						<BlockAlignmentControl value={align} onChange={updateAlignment} />
						<ToolbarButton
							onClick={() => {
								onToggleCaption();
							}}
							icon={captionIcon}
							isPressed={captionEnableValue}
							label={
								captionEnableValue
									? __('Remove caption', 'kadence-blocks')
									: __('Add caption', 'kadence-blocks')
							}
						/>
					</BlockControls>

					<BlockControls group="other">
						<MediaReplaceFlow
							mediaId={imageIdResolvedValue?.appliedValue}
							mediaURL={imageResolvedValue?.appliedValue}
							allowedTypes={ALLOWED_MEDIA_TYPES}
							accept="image/*"
							onSelect={onImageSelect}
							onSelectURL={onImageSelect}
							onError={onUploadError}
						/>
					</BlockControls>
					<figure {...blockProps}>
						{hasWrapper && <div className={wrapperClasses}>{imgHTML}</div>}
						{!hasWrapper && imgHTML}
						{hasCaption && (
							<RichText
								ref={captionRef}
								tagName="figcaption"
								aria-label={__('Image caption text', 'kadence-blocks')}
								placeholder={__('Add caption', 'kadence-blocks')}
								value={captionValue}
								onChange={(value) =>
									handleAttributeChange(
										value,
										'desktop',
										'caption',
										attributes,
										setAttributes,
										undefined,
										'caption',
										metadata
									)
								}
								className="kbs-image-caption"
								inlineToolbar
								allowedFormats={['core/bold', 'core/italic', 'core/link']}
								__unstableOnSplitAtEnd={() => insertBlocksAfter(createBlock('core/paragraph'))}
							/>
						)}
					</figure>
				</>
			)}
		</GlobalStylesContext.Provider>
	);
}
