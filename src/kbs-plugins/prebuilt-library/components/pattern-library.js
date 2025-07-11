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
import { PATTERN_CATEGORY_GROUPS } from '../utils/constants';
import PatternLibrarySidebar from './pattern-library-sidebar';
import PatternLibraryContent from './pattern-library-content';
import { getPresetBackgrounds } from '../hooks/get-preset-backgrounds';
import { getPresetMappingStyles } from '../hooks/get-preset-mapping-styles';

const PatternLibrary = ({ onSelect, activeStorage, updateStorage }) => {
	const isAIDisabled = window?.kbs_params?.isAIDisabled ? true : false;
	const isAuthorized = window?.kbs_params?.isAuthorized ? true : false;
	const activateLink = window?.kbs_params?.homeLink ? window.kbs_params.homeLink : '';
	const { patterns, patternsHTML, categories, pageCategories, isLoading } = usePatternData();
	const backgrounds = getPresetBackgrounds();
	const mappingStyles = getPresetMappingStyles();
	// For now, base styles are empty.
	const baseStyles = '';
	const [isImporting, setIsImporting] = useState(false);
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedSubTab, setSelectedSubTab] = useState(
		activeStorage?.selectedSubTab ? activeStorage.selectedSubTab : 'patterns'
	);
	const updateSelectedSubTab = (newSubTab) => {
		setSelectedSubTab(newSubTab);
		activeStorage.selectedSubTab = newSubTab;
		updateStorage(activeStorage);
	};
	const [selectedCategory, setSelectedCategory] = useState(
		activeStorage?.selectedCategory ? activeStorage.selectedCategory : ''
	);
	const updateSelectedCategory = (newCat) => {
		setSelectedCategory(newCat);
		activeStorage.selectedCategory = newCat;
		updateStorage(activeStorage);
	};
	const [selectedPageCategory, setSelectedPageCategory] = useState(
		activeStorage?.selectedPageCategory ? activeStorage.selectedPageCategory : ''
	);
	const updateSelectedPageCategory = (newCat) => {
		setSelectedPageCategory(newCat);
		activeStorage.selectedPageCategory = newCat;
		updateStorage(activeStorage);
	};
	const [selectedStyle, setSelectedStyle] = useState(activeStorage?.selectedStyle ? activeStorage.selectedStyle : '');
	const updateSelectedStyle = (newStyle) => {
		setSelectedStyle(newStyle);
		activeStorage.selectedStyle = newStyle;
		updateStorage(activeStorage);
	};

	// // Filter patterns based on search and category
	// const filteredPatterns = useMemo(() => {
	// 	return filterPatterns(patterns, {
	// 		searchTerm,
	// 		category: selectedCategory,
	// 	});
	// }, [patterns, searchTerm, selectedCategory]);

	// Category options for select control
	// const categoryOptions = useMemo(() => {
	// 	return [
	// 		{ label: __('All Categories', 'kadence-blocks'), value: 'all' },
	// 		...categories.map((cat) => ({
	// 			label: cat.label,
	// 			value: cat.slug,
	// 		})),
	// 	];
	// }, [categories]);

	async function handlePatternSelect(pattern) {
		setIsImporting(true);
		const patternBlocks = pattern?.content ? pattern.content : '';
		const response = await processPattern(
			patternBlocks,
			imageCollection,
			pattern?.cpt_blocks ? pattern.cpt_blocks : [],
			pattern?.style ? pattern.style : ''
		);
		if (response.success) {
			setIsImporting(false);
			onSelect(response);
		}
	}

	return (
		<div className="kbs-pattern-library-body">
			<PatternLibrarySidebar
				pageCategory={selectedPageCategory}
				category={selectedCategory}
				subTab={selectedSubTab}
				setSubTab={updateSelectedSubTab}
				setPageCategory={updateSelectedPageCategory}
				pageCategories={pageCategories}
				categories={categories}
				setCategory={updateSelectedCategory}
				style={selectedStyle}
				setStyle={updateSelectedStyle}
				search={searchTerm}
			/>
			<PatternLibraryContent
				pageCategory={selectedPageCategory}
				style={selectedStyle}
				subTab={selectedSubTab}
				category={selectedCategory}
				patterns={patterns}
				patternsHTML={patternsHTML}
				search={searchTerm}
				setSearch={setSearchTerm}
				onSelect={handlePatternSelect}
				isLoading={isLoading}
				isImporting={isImporting}
				backgrounds={backgrounds}
				mappingStyles={mappingStyles}
				baseStyles={baseStyles}
				// isError={isError}
				// pages={pages}
			/>
			{/* <PatternLibrarySync
				patterns={filteredPatterns}
				selectedCategory={selectedCategory}
				selectedPageCategory={selectedPageCategory}
				onSelect={handlePatternSelect}
			/>  */}
		</div>
	);
};

export default PatternLibrary;
