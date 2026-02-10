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
	Spinner,
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
import PatternLibraryContentPatterns from './pattern-library-content-patterns';
import PatternLibraryContentPages from './pattern-library-content-pages';

const PatternLibraryContent = ({
	pageCategory,
	category,
	subTab,
	search,
	setSearch,
	style,
	patterns,
	patternsHTML,
	pages,
	isError,
	isLoading,
	isImporting,
	onSelect,
	getLibraryContent,
	backgrounds,
	mappingStyles,
	baseStyles,
}) => {
	return (
		<div className="kbs-pattern-library-content">
			{isImporting || isLoading || false === patterns || isError ? (
				<>
					{!isError && isLoading && (
						<div className="kbs-pattern-library-loading">
							<Spinner />
						</div>
					)}
					{!isError && isImporting && (
						<div className="kbs-pattern-library-preparing-content">
							<Spinner />
							<h2>{__('Preparing Content…', 'kadence-blocks')}</h2>
						</div>
					)}
					{isError && isError === 'general' && (
						<div className="kb-pattern-error-wrapper">
							<h2 style={{ textAlign: 'center' }}>
								{__(
									'Error, Unable to access library database, please try re-syncing',
									'kadence-blocks'
								)}
							</h2>
							<div style={{ textAlign: 'center' }}>
								<Button
									className="kt-reload-templates"
									icon={update}
									onClick={() => (!isLoading ? getLibraryContent(subTab, true) : null)}
								>
									{__('Sync with Cloud', 'kadence-blocks')}
								</Button>
							</div>
						</div>
					)}
					{isError && isError === 'reload' && (
						<div className="kb-pattern-error-wrapper">
							<h2 style={{ textAlign: 'center' }}>
								{__(
									'Error, Unable to access library, please reload this page in your browser.',
									'kadence-blocks'
								)}
							</h2>
						</div>
					)}
				</>
			) : (
				<>
					{subTab === 'pages' ? (
						<PatternLibraryContentPatterns
							patterns={patterns}
							patternsHTML={patternsHTML}
							category={category}
							style={style}
							onSelect={(pattern) => onSelect(pattern)}
							search={search}
							setSearch={setSearch}
							backgrounds={backgrounds}
						/>
					) : (
						<PatternLibraryContentPatterns
							patterns={patterns}
							patternsHTML={patternsHTML}
							category={category}
							style={style}
							onSelect={(pattern) => onSelect(pattern)}
							search={search}
							setSearch={setSearch}
							backgrounds={backgrounds}
							mappingStyles={mappingStyles}
							baseStyles={baseStyles}
						/>
					)}
				</>
			)}
		</div>
	);
};

export default PatternLibraryContent;
