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
} from '@kadence/kbsHelpers';
import { BackgroundStyles, MediaPlaceholder } from '@kadence/kbsComponents';
import metadata from './block.json';
import Inspector from './editing/inspector';
import Styles from './editing/styles';
import { plusCircleFilled } from '@wordpress/icons';
/**
 * Import WordPress
 */
import { __ } from '@wordpress/i18n';

import { useSelect, select } from '@wordpress/data';
import { useEffect, useMemo, useRef } from '@wordpress/element';
import { useBlockProps } from '@wordpress/block-editor';
/**
 * Build the section edit.
 */
export default function ImageEdit(props) {
	const { attributes, setAttributes, isSelected, clientId, className } = props;
	const { uniqueID, globalStyleIds } = attributes;
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

	const filterSimple = filterSimpleAnyResolvedValue?.appliedValue;
	const hasImage = imageResolvedValue?.appliedValue;
	const hasRatio = aspectRatioAnyResolvedValue?.appliedValue;
	const hasOverlay = false;
	const hasWrapper = filterSimple || hasOverlay;

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
	});
	const blockProps = useBlockProps({
		className: classes,
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
				<figure {...blockProps}>
					{hasWrapper && <div className={wrapperClasses}>{imgHTML}</div>}
					{!hasWrapper && imgHTML}
				</figure>
			)}
		</GlobalStylesContext.Provider>
	);
}
