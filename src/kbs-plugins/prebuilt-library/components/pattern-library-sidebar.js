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
import { aiSettingsIcon } from '../utils/icons';
import { kadenceIcon } from '@kadence/kbsHelpers';

const PatternLibrarySidebar = ({
	pageCategory,
	category,
	subTab,
	setSubTab,
	setPageCategory,
	pageCategories,
	categories,
	setCategory,
	search,
}) => {
	const [popoverAnchor, setPopoverAnchor] = useState();
	const [isVisible, setIsVisible] = useState(false);
	const toggleVisible = () => setIsVisible(!isVisible);
	return (
		<div className="kbs-pattern-library-sidebar">
			<div className="kbs-pattern-library-sidebar-header">
				<div className="kbs-pattern-library-logo-wrapper">
					<div className="kbs-pattern-library-logo">{kadenceIcon}</div>
					<div className="kbs-pattern-library-settings">
						<Button
							className={'kbs-trigger-extra-settings'}
							icon={aiSettings}
							ref={setPopoverAnchor}
							isPressed={isVisible}
							disabled={isVisible}
							onClick={toggleVisible}
						/>
					</div>
				</div>
			</div>
			<div className="kbs-pattern-library-sidebar-subtabs">
				<Button
					className={
						'kbs-pattern-library-subtab-button kbs-trigger-patterns' +
						(subTab === 'patterns' ? ' is-pressed' : '')
					}
					aria-pressed={subTab === 'patterns'}
					onClick={() => {
						setSubTab('patterns');
					}}
				>
					{__('Patterns', 'kadence-blocks')}
				</Button>
				<Button
					className={
						'kbs-pattern-library-subtab-button kbs-trigger-pages' +
						(subTab === 'pages' ? ' is-pressed' : '')
					}
					aria-pressed={subTab === 'pages'}
					onClick={() => {
						setSubTab('pages');
					}}
				>
					{__('Pages', 'kadence-blocks')}
				</Button>
			</div>
		</div>
	);
};

export default PatternLibrary;
