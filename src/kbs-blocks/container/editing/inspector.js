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
	PopColorControl,
	ResponsiveMeasurementControls,
	SmallResponsiveControl,
	RangeControl,
	ResponsiveRangeControls,
	KadencePanelBody,
	URLInputControl,
	ResponsiveRadioRangeControls,
	ResponsiveAlignControls,
	BoxShadowControl,
	KadenceFormConditionals,
	BackgroundControl as KadenceBackgroundControl,
	ResponsiveBorderControl,
	BackgroundTypeControl,
	GradientControl,
	InspectorControlTabs,
	KadenceBlockDefaults,
	ResponsiveMeasureRangeControl,
	SpacingVisualizer,
	ColorGroup,
	HoverToggleControl,
	CopyPasteAttributes,
} from '@kadence/components';

/**
 * Kadence Helpers.
 */
import {
	KadenceColorOutput,
	getPreviewSize,
	showSettings,
	mouseOverVisualizer,
	getSpacingOptionOutput,
	getBorderStyle,
	setBlockDefaults,
	getUniqueId,
	getInQueryBlock,
	setDynamicState,
	getPostOrFseId,
} from '@kadence/helpers';

import metadata from '../block.json';
import InspectorGeneral from './inspector-general';
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
	InnerBlocks,
	InspectorControls,
	useBlockProps,
	useInnerBlocksProps,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { ToggleControl, SelectControl, ToolbarGroup, ExternalLink } from '@wordpress/components';

import { applyFilters } from '@wordpress/hooks';
/**
 * Build the section Inspector edit.
 */
export default function Inspector(props) {
	const { attributes, setAttributes, isSelected, clientId, context, className } = props;
	const {
		id,
		topPadding,
		bottomPadding,
		leftPadding,
		rightPadding,
		topPaddingM,
		bottomPaddingM,
		leftPaddingM,
		rightPaddingM,
		topMargin,
		bottomMargin,
		topMarginM,
		bottomMarginM,
		leftMargin,
		rightMargin,
		leftMarginM,
		rightMarginM,
		topMarginT,
		bottomMarginT,
		leftMarginT,
		rightMarginT,
		topPaddingT,
		bottomPaddingT,
		leftPaddingT,
		rightPaddingT,
		backgroundOpacity,
		background,
		zIndex,
		border,
		borderWidth,
		borderOpacity,
		borderRadius,
		uniqueID,
		kadenceAnimation,
		kadenceAOSOptions,
		collapseOrder,
		backgroundImg,
		textAlign,
		textColor,
		linkColor,
		linkHoverColor,
		shadow,
		displayShadow,
		vsdesk,
		vstablet,
		vsmobile,
		paddingType,
		marginType,
		mobileBorderWidth,
		tabletBorderWidth,
		templateLock,
		kadenceBlockCSS,
		kadenceDynamic,
		direction,
		gutter,
		gutterUnit,
		verticalAlignment,
		verticalAlignmentTablet,
		verticalAlignmentMobile,
		justifyContent,
		backgroundImgHover,
		backgroundHover,
		borderHover,
		borderHoverWidth,
		borderHoverRadius,
		shadowHover,
		displayHoverShadow,
		tabletBorderHoverWidth,
		mobileBorderHoverWidth,
		textColorHover,
		linkColorHover,
		linkHoverColorHover,
		linkNoFollow,
		linkSponsored,
		link,
		linkTarget,
		linkTitle,
		wrapContent,
		heightUnit,
		height,
		maxWidth,
		maxWidthUnit,
		maxWidthTabletUnit,
		maxWidthMobileUnit,
		htmlTag,
		sticky,
		stickyOffset,
		stickyOffsetUnit,
		overlay,
		overlayHover,
		overlayImg,
		overlayImgHover,
		overlayOpacity,
		overlayHoverOpacity,
		align,
		padding,
		tabletPadding,
		mobilePadding,
		margin,
		tabletMargin,
		mobileMargin,
		backgroundType,
		backgroundHoverType,
		gradient,
		gradientHover,
		overlayType,
		overlayHoverType,
		overlayGradient,
		overlayGradientHover,
		borderRadiusUnit,
		borderHoverRadiusUnit,
		tabletBorderRadius,
		mobileBorderRadius,
		borderStyle,
		mobileBorderStyle,
		tabletBorderStyle,
		borderHoverStyle,
		tabletBorderHoverStyle,
		mobileBorderHoverStyle,
		tabletBorderHoverRadius,
		mobileBorderHoverRadius,
		inQueryBlock,
		hoverOverlayBlendMode,
		overlayBlendMode,
		rowGapUnit,
		rowGap,
		flexBasis,
		flexBasisUnit,
		rowGapVariable,
		gutterVariable,
		kbVersion,
		flexGrow,
		backdropFilterType,
		backdropFilterSize,
		backdropFilterString,
	} = attributes;
	const [activeTab, setActiveTab] = useState('general');
	
	const previewPaddingType = undefined !== paddingType ? paddingType : 'px';
	const previewMarginType = undefined !== marginType ? marginType : 'px';
	// Margin
	//const previewMarginTop = getPreviewSize( margin );

	return (
		<InspectorControls>
			<InspectorControlTabs panelName={metadata.name} setActiveTab={setActiveTab} activeTab={activeTab} />
			<InspectorGeneral { ...props }/>
						
		</InspectorControls>
	);
}
