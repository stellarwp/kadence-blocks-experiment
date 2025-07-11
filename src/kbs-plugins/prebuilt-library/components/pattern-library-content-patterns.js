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
import { useState, useMemo, useEffect, useRef } from '@wordpress/element';
import Masonry from 'react-masonry-css';
/**
 * Internal dependencies
 */
import PatternPreviewWrapper from './pattern-preview-wrapper';
import { filterPatterns } from '../utils/filter-patterns';
import { usePatternData } from '../hooks/use-pattern-data';
import { PATTERN_CATEGORY_GROUPS, PATTERN_STYLES } from '../utils/constants';
import { aiSettingsIcon } from '../utils/icons';
import replaceImages from '../utils/replace/replace-images';
import replaceMasks from '../utils/replace/replace-masks';
import { searchItems } from '../utils/search-items';

const PatternLibraryContentPatternsList = ({
	patterns,
	patternsHTML,
	onClick,
	customStyles,
	shadowStyles,
	previewMode = 'html',
	selectedStyle = 'base',
	shadowCompatStyles,
	patternType = 'pattern',
	backgrounds,
}) => {
	const [visibleItems, setVisibleItems] = useState(32); // Start with 12 items
	const [isLoading, setIsLoading] = useState(false);
	const loadMoreRef = useRef(null);
	const itemsPerLoad = 32; // Load 12 more items each time

	// Intersection Observer for lazy loading
	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				const [entry] = entries;
				if (entry.isIntersecting && !isLoading && visibleItems < patterns.length) {
					setIsLoading(true);
					// Add a small delay to prevent too rapid loading
					setTimeout(() => {
						setVisibleItems((prev) => Math.min(prev + itemsPerLoad, patterns.length));
						setIsLoading(false);
					}, 100);
				}
			},
			{
				rootMargin: '100px', // Start loading when within 100px of the load more element
				threshold: 0.1,
			}
		);

		if (loadMoreRef.current) {
			observer.observe(loadMoreRef.current);
		}

		return () => {
			if (loadMoreRef.current) {
				observer.unobserve(loadMoreRef.current);
			}
		};
	}, [visibleItems, patterns.length, isLoading]);

	// Reset visible items when patterns change
	useEffect(() => {
		setVisibleItems(32);
	}, [patterns]);

	const showAllItems = (patterns) => {
		const items = [];
		const itemsToShow = patterns.slice(0, visibleItems);

		for (let i = 0; i < itemsToShow.length; i++) {
			if (undefined !== itemsToShow[i]?.name) {
				items.push(
					<PatternPreviewWrapper
						key={itemsToShow[i]?.slug || i}
						pattern={itemsToShow[i]}
						patternHTML={patternsHTML ? patternsHTML?.[itemsToShow[i]?.slug]?.html : null}
						onClick={onClick}
						customStyles={customStyles}
						shadowStyles={shadowStyles}
						previewMode={previewMode}
						selectedStyle={selectedStyle}
						shadowCompatStyles={shadowCompatStyles}
						patternType={patternType}
						backgrounds={backgrounds}
					/>
				);
			}
		}
		return items;
	};

	return (
		<div className="kbs-pattern-library-content-patterns">
			<div className="kbs-pattern-library-content-patterns-list">
				<Masonry
					breakpointCols={{
						default: 3,
						1600: 2,
						1200: 2,
						500: 1,
					}}
					className={`kbs-pattern-library-masonry-grid`}
					columnClassName="kbs-pattern-library-masonry-grid-column"
				>
					{showAllItems(patterns)}
				</Masonry>

				{/* Load more trigger element */}
				{visibleItems < patterns.length && (
					<div
						ref={loadMoreRef}
						className="kbs-pattern-library-load-more-trigger"
						style={{
							height: '20px',
							marginTop: '20px',
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
						}}
					>
						{isLoading && (
							<div className="kbs-pattern-library-loading">
								{__('Loading more patterns...', 'kadence-blocks')}
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

const PatternLibraryContentPatterns = ({
	patterns,
	patternsHTML,
	category,
	style,
	onSelect,
	search,
	imageCollection,
	setSearch,
	backgrounds,
}) => {
	const [sortBy, setSortBy] = useState('id_desc');
	const [layoutFilter, setLayoutFilter] = useState([]);
	const [componentFilter, setComponentFilter] = useState([]);
	const thePatterns = useMemo(() => {
		const allPatterns = [];
		const hasPremiumAccess =
			'true' !== window.kbs_params.pro || 'true' !== window.kbs_params.creativeKit ? true : false;
		let variation = 0;
		Object.keys(patterns).map(function (key, index) {
			const temp = [];
			if (
				'true' !== window.kbs_params.pro &&
				patterns[key]?.requiredPlugins &&
				Object.keys(patterns[key].requiredPlugins).includes('blocks-pro')
			) {
				return;
			}
			if (variation === 11) {
				variation = 0;
			}
			temp.title = patterns[key].name;
			temp.name = patterns[key].name;
			temp.image = patterns[key].image;
			temp.imageWidth = patterns[key].imageW;
			temp.imageHeight = patterns[key].imageH;
			temp.id = patterns[key].id;
			temp.slug = patterns[key].slug;
			temp.styles = patterns[key].styles ? Object.keys(patterns[key].styles) : [];
			temp.contexts = patterns[key].contexts ? Object.keys(patterns[key].contexts) : [];
			temp.hpcontexts = patterns[key].hpcontexts ? Object.keys(patterns[key].hpcontexts) : [];
			temp.keywords = patterns[key].keywords ? patterns[key].keywords : [];

			// Process newCategory with decoded HTML entities if needed
			temp.categories = patterns[key]?.categories ? { ...patterns[key].categories } : null;
			if (temp.categories && typeof temp.categories === 'object') {
				// Decode category labels within the newCategory object
				Object.keys(temp.categories).forEach((slug) => {
					if (temp.categories[slug]?.name) {
						temp.categories[slug].name = decodeHTMLEntities(temp.categories[slug].name);
					}
				});
			}

			temp.sidebarHeading = patterns[key]?.sidebarHeading || null;
			if (patterns[key]?.html) {
				temp.html = replaceMasks(patterns[key].html);
			}
			temp.content = patterns[key]?.content || '';
			temp.pro = patterns[key].pro;
			temp.locked = patterns[key].pro && !hasPremiumAccess ? true : false;
			temp.proRender = false;
			temp.viewportWidth = 1200;
			temp.variation = variation;
			temp.layout = patterns[key]?.layout || {};
			temp.component = patterns[key]?.component || {};
			temp.labels = patterns[key]?.label || {};
			variation++;
			allPatterns.push(temp);
		});
		return allPatterns;
	}, [patterns]);
	const filteredBlockPatterns = useMemo(() => {
		let allPatterns = thePatterns;

		if (!search) {
			if (category && category === 'new') {
				// Filter for "New" patterns
				allPatterns = allPatterns.filter((pattern) => pattern.labels?.new);
			} else if (category && category !== '') {
				// Filter by Category
				allPatterns = allPatterns.filter((pattern) => {
					// Check if the category exists as a key in the pattern's categories object
					return pattern?.categories && pattern.categories.hasOwnProperty(category);
				});
			}
		}

		if (layoutFilter && layoutFilter.length > 0) {
			allPatterns = allPatterns.filter((pattern) => {
				return pattern.layout && Object.keys(pattern.layout).some((key) => layoutFilter.includes(key));
			});
		}
		if (componentFilter && componentFilter.length > 0) {
			allPatterns = allPatterns.filter((pattern) => {
				// Check if the pattern has a component object and if any of its keys are in the componentFilter array
				return pattern.component && Object.keys(pattern.component).some((key) => componentFilter.includes(key));
			});
		}

		if (imageCollection) {
			let variation = 0;
			allPatterns = allPatterns.map((item) => {
				if (variation === 11) {
					variation = 0;
				}
				if (patternsHTML?.[item?.slug]?.html) {
					patternsHTML[item?.slug].html = replaceImages(
						patternsHTML[item?.slug].html,
						imageCollection,
						item.categories,
						item.id,
						item.variation,
						teamCollection
					);
					item.content = replaceImages(
						item.content,
						imageCollection,
						item.categories,
						item.id,
						item.variation,
						teamCollection
					);
				} else {
					item.content = replaceImages(
						item.content,
						imageCollection,
						item.categories,
						item.id,
						item.variation,
						teamCollection
					);
				}
				variation++;
				return item;
			});
		}
		// Apply Sorting
		if (sortBy === 'name_asc') {
			// Names like Hero 2 should be After Hero 1 but before Hero 11.
			allPatterns.sort((a, b) => {
				// Extract the base name and number separately
				const aMatch = a.name.match(/^(.*?)(\d+)?$/);
				const bMatch = b.name.match(/^(.*?)(\d+)?$/);

				const aBase = aMatch[1].trim();
				const bBase = bMatch[1].trim();

				// If base names are different, sort by base name
				if (aBase !== bBase) {
					return aBase.localeCompare(bBase);
				}

				// If base names are the same, sort by number
				const aNum = aMatch[2] ? parseInt(aMatch[2], 10) : 0;
				const bNum = bMatch[2] ? parseInt(bMatch[2], 10) : 0;

				return aNum - bNum;
			});
		} else if (sortBy === 'name_desc') {
			// Names like Hero 2 should be After Hero 1 but before Hero 11.
			allPatterns.sort((a, b) => {
				// Extract the base name and number separately
				const aMatch = a.name.match(/^(.*?)(\d+)?$/);
				const bMatch = b.name.match(/^(.*?)(\d+)?$/);

				const aBase = aMatch[1].trim();
				const bBase = bMatch[1].trim();

				// If base names are different, sort by base name
				if (aBase !== bBase) {
					return bBase.localeCompare(aBase);
				}

				// If base names are the same, sort by number
				const aNum = aMatch[2] ? parseInt(aMatch[2], 10) : 0;
				const bNum = bMatch[2] ? parseInt(bMatch[2], 10) : 0;

				return bNum - aNum;
			});
		} else if (sortBy === 'id_desc') {
			// Default sort: id_desc (Last Added)
			allPatterns.sort((a, b) => b.id - a.id);
		}

		return searchItems(allPatterns, search);
	}, [search, category, thePatterns, style]);
	return (
		<PatternLibraryContentPatternsList
			patterns={filteredBlockPatterns}
			patternsHTML={patternsHTML}
			onClick={onSelect}
			backgrounds={backgrounds[style]}
		/>
	);
};

export default PatternLibraryContentPatterns;
