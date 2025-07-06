/**
 * WordPress dependencies
 */
import { Modal, Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { BlockPreview } from '@wordpress/block-editor';
import { useMemo, useCallback } from '@wordpress/element';
import { rawHandler } from '@wordpress/blocks';
import { useResizeObserver } from '@wordpress/compose';
import { useState, useRef, useEffect } from '@wordpress/element';
import { Disabled, Spinner } from '@wordpress/components';
import root from 'react-shadow';

import { useInView } from 'react-intersection-observer';
const MAX_HEIGHT = 1200;

const LazyLoad = ({ rootScroll, className, onContentVisible, children }) => {
	const options = {
		// root: rootScroll ? rootScroll : undefined,
		triggerOnce: true,
		rootMargin: '600px 0px',
		onChange: (inView) => {
			if (inView) {
				onContentVisible();
			}
		},
	};
	const { ref, inView } = useInView(options);
	return (
		<div ref={ref} className={`LazyLoad${inView ? ' is-visible' : ''}${className ? ` ${className}` : ''}`}>
			{inView ? [children] : null}
		</div>
	);
};

function ScaledPatternShadowPreview({
	html,
	viewportWidth,
	containerWidth,
	minHeight = 70,
	additionalStyles = [],
	title,
	ratio,
	shadowCompatStyles,
	shadowStyles = [],
	patternType = 'pattern',
	rootScroll,
}) {
	if (!viewportWidth) {
		viewportWidth = containerWidth;
	}
	const [refreshHeight, setRefreshHeight] = useState(false);
	const [loadingOpacity, setLoadingOpacity] = useState(0);
	const [contentResizeListener, { height: contentHeight }] = useResizeObserver();

	// Memoize expensive calculations
	const scale = useMemo(() => containerWidth / viewportWidth, [containerWidth, viewportWidth]);
	const finalContentHeight = useMemo(() => (refreshHeight ? 'auto' : contentHeight), [refreshHeight, contentHeight]);

	// Memoize transition speed calculation
	const trans_scroll_speed = useMemo(() => {
		if (contentHeight >= MAX_HEIGHT) {
			const heightDiff = finalContentHeight - MAX_HEIGHT;
			return Math.max(1000, Math.min(8000, (heightDiff / 650) * 1000)); // Clamp between 1-8 seconds
		}
		return 2000;
	}, [contentHeight, finalContentHeight]);

	const transitionSpeed = useMemo(() => `transform ${trans_scroll_speed}ms linear !important`, [trans_scroll_speed]);

	// Memoize style assets to prevent recreation on every render
	const styleAssets = useMemo(
		() => (
			<>
				<link
					rel="stylesheet"
					id="kadence-blocks-iframe-base"
					href={window?.kbs_params?.livePreviewStyles}
					media="all"
				></link>
				{shadowCompatStyles}
			</>
		),
		[shadowCompatStyles]
	);

	// Memoize shadow assets with optimized CSS processing
	const shadowAssets = useMemo(
		() => (
			<>
				{shadowStyles.map((style, index) => {
					if (style?.css) {
						// Pre-compile CSS replacements for better performance
						const finalCSS = style.css
							.replace(/ .block-editor-block-list__layout/g, '')
							.replace(/:root/g, '.pattern-shadow-wrap')
							.replace(/body/g, '.single-iframe-content');
						return <style key={index}>{finalCSS}</style>;
					}
					return null;
				})}
			</>
		),
		[shadowStyles]
	);

	const shadowRef = useRef(null);

	// Optimize style loading check with useCallback
	const checkStylesLoaded = useCallback(() => {
		if (!shadowRef.current?.shadowRoot) return;

		const styles = shadowRef.current.shadowRoot.querySelectorAll('style, link[rel="stylesheet"]');
		let loadedCount = 0;
		const totalStyles = styles.length;

		if (totalStyles === 0) {
			setLoadingOpacity(1);
			return;
		}

		styles.forEach((style) => {
			if (style.sheet) {
				loadedCount++;
			} else if (style.tagName.toLowerCase() === 'link') {
				style.onload = () => {
					loadedCount++;
					if (loadedCount === totalStyles) {
						setLoadingOpacity(1);
					}
				};
			}
		});

		if (loadedCount === totalStyles) {
			setLoadingOpacity(1);
		}
	}, []);

	useEffect(() => {
		if (shadowRef.current) {
			checkStylesLoaded();
		}
	}, [shadowRef?.current, checkStylesLoaded]);

	// Memoize container styles to prevent recreation
	const containerStyles = useMemo(
		() => ({
			transform: `scale(${scale})`,
			height: finalContentHeight !== 'auto' ? finalContentHeight * scale : 'auto',
			maxHeight: finalContentHeight > MAX_HEIGHT ? MAX_HEIGHT * scale : undefined,
		}),
		[scale, finalContentHeight]
	);

	// Memoize shadow container styles
	const shadowContainerStyles = useMemo(
		() => ({
			opacity: loadingOpacity,
			position: 'absolute',
			width: viewportWidth,
			height: 'auto',
			pointerEvents: 'none',
			maxHeight: MAX_HEIGHT,
			minHeight: scale !== 0 && scale < 1 && minHeight ? minHeight / scale : minHeight,
		}),
		[loadingOpacity, viewportWidth, scale, minHeight]
	);
	const resizeClear = useCallback(() => {
		const timer1 = setTimeout(() => setRefreshHeight(true), 100);
		const timer2 = setTimeout(() => setRefreshHeight(false), 400);
		const timer3 = setTimeout(() => setLoadingOpacity(1), 800);

		// Cleanup timers if component unmounts
		return () => {
			clearTimeout(timer1);
			clearTimeout(timer2);
			clearTimeout(timer3);
		};
	}, []);
	return (
		<>
			<LazyLoad
				offset={200}
				rootScroll={rootScroll}
				onContentVisible={() => {
					resizeClear();
				}}
			>
				<Disabled className="kbs-pattern-preview-content" style={containerStyles}>
					<root.div
						ref={shadowRef}
						className={`kb-pattern-shadow-container${
							contentHeight >= MAX_HEIGHT ? ' kb-pattern-overflow' : ''
						}`}
						aria-hidden
						tabIndex={-1}
						style={shadowContainerStyles}
					>
						{styleAssets}
						{shadowAssets}
						<style>{`.pattern-shadow-wrap { transition: ${transitionSpeed} }`}</style>
						<div part={'container'} className={'editor-styles-wrapper pattern-shadow-wrap'}>
							{contentResizeListener}
							<div
								className={`single-iframe-content${
									window?.kbs_params?.isKadenceT ? ' single-content' : ''
								}`}
								dangerouslySetInnerHTML={{ __html: html }}
							/>
						</div>
					</root.div>
				</Disabled>
			</LazyLoad>
			{!loadingOpacity && (
				<div
					className="kb-preview-iframe-loader-ratio"
					style={{ paddingBottom: ratio ? ratio : undefined, minHeight: ratio ? undefined : minHeight }}
				>
					<div className="kb-preview-iframe-loader">
						<Spinner />
					</div>
				</div>
			)}
		</>
	);
}

function AutoHeightPatternPreview(props) {
	const [containerResizeListener, { width: containerWidth }] = useResizeObserver();
	return (
		<>
			<div style={{ position: 'relative', width: '100%', height: 0 }}>{containerResizeListener}</div>
			<div className="kbs-pattern-preview-container">
				<ScaledPatternShadowPreview {...props} containerWidth={containerWidth} />
			</div>
		</>
	);
}

export default function PatternPreview({
	html,
	viewportWidth = 1200,
	minHeight,
	additionalStyles = [],
	title,
	ratio,
	shadowStyles,
	shadowCompatStyles,
	patternType,
	rootScroll,
}) {
	if (!html) {
		return null;
	}

	return (
		<AutoHeightPatternPreview
			viewportWidth={viewportWidth}
			minHeight={minHeight}
			html={html}
			additionalStyles={additionalStyles}
			title={title}
			ratio={ratio}
			shadowStyles={shadowStyles}
			shadowCompatStyles={shadowCompatStyles}
			patternType={patternType}
			rootScroll={rootScroll}
		/>
	);
}
