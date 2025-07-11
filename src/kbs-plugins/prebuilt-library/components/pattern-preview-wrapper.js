import clsx from 'clsx';
/**
 * WordPress dependencies
 */
import {
	Button,
	SelectControl,
	ToggleControl,
	__experimentalGrid as Grid,
	Card,
	CardBody,
	CardMedia,
	VisuallyHidden,
	ExternalLink,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useState, useMemo } from '@wordpress/element';
import { rawHandler } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import PatternPreview from './pattern-preview';
import { filterPatterns } from '../utils/filter-patterns';
import { usePatternData } from '../hooks/use-pattern-data';
import { PATTERN_CATEGORY_GROUPS, PATTERN_STYLES } from '../utils/constants';
import { aiSettingsIcon } from '../utils/icons';
import { kadenceIcon } from '@kadence/kbsHelpers';
import replaceImages from '../utils/replace/replace-images';
import replaceMasks from '../utils/replace/replace-masks';
import replaceBackgrounds from '../utils/replace/replace-backgrounds';
import { searchItems } from '../utils/search-items';

const roundAccurately = (number, decimalPlaces) =>
	Number(Math.round(Number(number + 'e' + decimalPlaces)) + 'e' + decimalPlaces * -1);

export default function PatternPreviewWrapper({
	pattern,
	patternHTML,
	onClick,
	customStyles,
	previewMode = 'html',
	selectedStyle,
	editorStyles,
	shadowStyles,
	shadowCompatStyles,
	patternType = 'pattern',
	rootScroll,
	itemKey,
	backgrounds,
}) {
	const { content, viewportWidth, pro, locked, image, imageHeight, imageWidth, html } = pattern;
	let htmlContent = html;
	if (!html && patternHTML) {
		htmlContent = replaceMasks(patternHTML);
		htmlContent = replaceBackgrounds(htmlContent, backgrounds);
	} else if (!html) {
		htmlContent = ' ';
	}
	const descriptionId = `block-editor-block-patterns-list__item-description-${itemKey}`;
	function getFooter() {
		if ('page' === patternType) {
			return (
				<div className="kbs-pattern-library_item-title kb-pattern-type-page">
					<div className="kb-pattern-footer-top">
						<span className="kb-pattern-title" dangerouslySetInnerHTML={{ __html: pattern.title }}></span>
						{pattern?.pageStyles &&
							pattern.pageStyles.length &&
							Object.values(pattern.pageStyles).map((style) => (
								<span className="kb-pattern-style-tag">{style}</span>
							))}
					</div>
					{pattern.description ? (
						<div className="kbs-pattern-library_item-description">{pattern.description}</div>
					) : null}
				</div>
			);
		}
		return (
			<div className="kbs-pattern-library_item-title">
				<span className="kb-pattern-inline-title" dangerouslySetInnerHTML={{ __html: pattern.title }}></span>
				{undefined !== pro && pro && (
					<span className="kbs-pattern-pro-item">{__('Premium', 'kadence-blocks')}</span>
				)}
			</div>
		);
	}

	return (
		<div key={itemKey} className={`kbs-pattern-library_item kb-pattern-style-${selectedStyle}`}>
			<div
				role="option"
				className={`kbs-pattern-library_item${locked ? ' kb-pattern-item-locked' : ''}`}
				onClick={() => {
					if (!locked) {
						onClick(pattern, content);
					} else {
						console.log('Can not install');
					}
				}}
				aria-disabled={locked ? true : undefined}
				aria-label={pattern.title}
				aria-describedby={pattern.description ? descriptionId : undefined}
			>
				{'image' !== previewMode && htmlContent && (
					<PatternPreview
						html={htmlContent}
						title={pattern.title}
						viewportWidth={viewportWidth}
						additionalStyles={customStyles}
						ratio={
							imageWidth && imageHeight
								? roundAccurately((imageHeight / imageWidth) * 100, 2) + '%'
								: undefined
						}
						shadowStyles={shadowStyles}
						shadowCompatStyles={shadowCompatStyles}
						patternType={patternType}
						rootScroll={rootScroll}
					/>
				)}
				{'image' === previewMode && (
					<div
						className="kb-pattern-image-wrap"
						style={{
							paddingBottom:
								imageWidth && imageHeight
									? roundAccurately((imageHeight / imageWidth) * 100, 2) + '%'
									: undefined,
						}}
					>
						<img src={image} loading={'lazy'} alt={pattern.title} />
					</div>
				)}
				{locked && (
					<div className="kb-pattern-requires-active-pro">
						<span className="kb-pattern-requires-active-pro-item">
							<ExternalLink
								href={
									'https://www.kadencewp.com/pricing/?utm_source=in-app&utm_medium=kadence-blocks&utm_campaign=patterns'
								}
							>
								{__('Requires Kadence Premium Designs', 'kadence-blocks')}
							</ExternalLink>
						</span>
					</div>
				)}
				{getFooter()}
				{!!pattern.description && <VisuallyHidden id={descriptionId}>{pattern.description}</VisuallyHidden>}
			</div>
		</div>
	);
}
