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
//import Masonry from 'react-masonry-css';
import { Masonry } from 'masonic';
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
}) => {
	const showAllItems = (patterns) => {
		const items = [];
		for (let i = 0; i < patterns.length; i++) {
			if (undefined !== patterns[i]?.name) {
				items.push(
					<PatternPreviewWrapper
						key={patterns[i]?.slug || i}
						pattern={patterns[i]}
						patternHTML={patternsHTML ? patternsHTML?.[patterns[i]?.slug]?.html : null}
						onClick={onClick}
						customStyles={customStyles}
						shadowStyles={shadowStyles}
						previewMode={previewMode}
						selectedStyle={selectedStyle}
						shadowCompatStyles={shadowCompatStyles}
						patternType={patternType}
					/>
				);
			}
		}
		return items;
	};
	const MasonryCard = ({ index, data, width }) => (
		<PatternPreviewWrapper
			itemKey={patterns[index]?.slug || index}
			pattern={patterns[index]}
			patternHTML={patternsHTML ? patternsHTML?.[patterns[index]?.slug]?.html : null}
			onClick={onClick}
			customStyles={customStyles}
			shadowStyles={shadowStyles}
			previewMode={previewMode}
			selectedStyle={selectedStyle}
			shadowCompatStyles={shadowCompatStyles}
			patternType={patternType}
		/>
	);
	console.log(patterns);
	return (
		<div className="kbs-pattern-library-content-patterns">
			<div className="kbs-pattern-library-content-patterns-list">
				<Masonry
					columnCount={3}
					columnGutter={48}
					items={patterns}
					className={`kbs-pattern-library-masonry-grid`}
					render={MasonryCard}
				/>
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
		/>
	);
};

export default PatternLibraryContentPatterns;
