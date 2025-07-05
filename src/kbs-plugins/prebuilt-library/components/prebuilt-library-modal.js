/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * WordPress dependencies
 */
import { Modal, TabPanel, SearchControl, Spinner, Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import { useDispatch, useSelect } from '@wordpress/data';
import { store as blockEditorStore } from '@wordpress/block-editor';
import { applyFilters } from '@wordpress/hooks';
import { apiFetch } from '@wordpress/data';
import { plusCircle } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import { isSettingEnabled, SafeParseJSON } from '@kadence/kbsHelpers';

import PatternLibrary from './pattern-library';
import TemplateLibrary from './template-library';
import CloudLibrary from './cloud-library';
import { usePatternData } from '../hooks/use-pattern-data';

const defaultTabs = [
	{
		name: 'patterns',
		title: __('Patterns', 'kadence-blocks'),
		className: 'kbs-prebuilt-tab-patterns',
	},
	{
		name: 'cloud',
		title: __('Cloud', 'kadence-blocks'),
		className: 'kbs-prebuilt-tab-cloud',
	},
];

const noConnectActions = [
	{
		name: 'patterns',
		title: __('Patterns', 'kadence-blocks'),
		className: 'kbs-prebuilt-tab-patterns',
	},
];

export default function PrebuiltLibraryModal({ clientId, onlyModal, isOpen, setIsOpen }) {
	const [isFetching, setIsFetching] = useState(false);
	const [reloadTabs, setReloadTabs] = useState(false);
	const [activeTab, setActiveTab] = useState(null);
	const [cloudSettings, setCloudSettings] = useState(
		kbs_params?.cloud_settings ? JSON.parse(kbs_params.cloud_settings) : {}
	);
	const [librarySettings, setLibrarySettings] = useState(
		kbs_params?.library_settings ? JSON.parse(kbs_params.library_settings) : {}
	);
	const [libraryTabs, setLibraryTabs] = useState(kbs_params?.cloud_enabled ? defaultTabs : noConnectActions);

	const { replaceBlock, removeBlock } = useDispatch(blockEditorStore);

	const reloadAllTabs = () => {
		setIsFetching(true);
		apiFetch({ path: '/wp/v2/settings' }).then((res) => {
			setCloudSettings(JSON.parse(res.kadence_blocks_cloud));
			setReloadTabs(false);
			setIsFetching(false);
		});
	};
	const saveSettings = (cloudSettings) => {
		kbs_params.cloud_settings = JSON.stringify(cloudSettings);
		apiFetch({
			path: '/wp/v2/settings',
			method: 'POST',
			data: { kadence_blocks_cloud: JSON.stringify(cloudSettings) },
		}).then((response) => {
			console.log('saved', response);
		});
	};
	const onClose = () => {
		setIsOpen(false);
		if (onlyModal) {
			removeBlock(clientId);
		}
	};

	const [activeStorage, setActiveStorage] = useState(() =>
		SafeParseJSON(localStorage.getItem('kadenceBlocksPrebuilt'), true)
	);
	const updateStorage = (newData) => {
		localStorage.setItem('kadenceBlocksPrebuilt', JSON.stringify(newData));
		setActiveStorage(newData);
	};
	const activeSavedTab = activeStorage && activeStorage.activeTab ? activeStorage.activeTab : 'patterns';
	const currentTab = activeTab ? activeTab : activeSavedTab;

	useEffect(() => {
		if (typeof kbs_params?.prebuilt_libraries === 'object' && kbs_params?.prebuilt_libraries !== null) {
			setLibraryTabs(
				applyFilters('kadence.prebuilt_library_tabs', kbs_params?.prebuilt_libraries.concat(libraryTabs))
			);
		} else {
			setLibraryTabs(applyFilters('kadence.prebuilt_library_tabs', libraryTabs));
		}
	}, []);

	if (!isOpen) {
		return null;
	}

	return (
		<Modal
			title={__('Design Library', 'kadence-blocks')}
			className="kbs-prebuilt-library-modal"
			size="fill"
			__experimentalHideHeader={true}
			onRequestClose={(event) => {
				// No action on blur event (prevents AI modal from closing when Media Library modal opens).
				if (event?.type && event.type === 'blur') {
					return;
				}
				onClose();
			}}
		>
			<div className="kbs-prebuilt-library-header">
				<div className="kbs-prebuilt-library-sidebar-placeholder"></div>
				<div className="kbs-prebuilt-library-tabs">
					{reloadTabs ? (
						<Spinner />
					) : (
						<>
							{libraryTabs.map(
								(action, index) =>
									isSettingEnabled(action.name, 'kadence/designlibrary') && (
										<Button
											key={`${action.name}-${index}`}
											className={clsx(
												'kbs-action-button',
												currentTab === action.name ? 'is-pressed' : ''
											)}
											aria-pressed={currentTab === action.name}
											icon={action.name === 'cloud' ? plusCircle : undefined}
											label={
												action.name === 'cloud'
													? __('Cloud Connect', 'kadence-blocks')
													: undefined
											}
											onClick={() => {
												activeStorage.activeTab = action.name;
												updateStorage(activeStorage);
												setActiveTab(action.name);
											}}
										>
											{action.name === 'cloud' ? undefined : <span> {action.title} </span>}
										</Button>
									)
							)}
						</>
					)}
				</div>
				<div className="kbs-prebuilt-library-close-placeholder"></div>
			</div>
			<div className="kbs-prebuilt-library-content">
				{currentTab === 'cloud' && <CloudConnect clientId={clientId} onReload={() => setReloadTabs(true)} />}
				{currentTab === 'patterns' && (
					<PatternLibrary
						activeStorage={activeStorage}
						updateStorage={updateStorage}
						onClose={onClose}
						onSelect={(pattern) => {
							// Handle pattern selection
							replaceBlock(clientId, pattern.blocks);
							setIsOpen(false);
						}}
					/>
				)}
				{currentTab === 'templates' && (
					<TemplateLibrary
						searchTerm={searchTerm}
						onSelect={(template) => {
							// Handle template selection
							replaceBlock(clientId, template.blocks);
							onClose();
						}}
					/>
				)}
				{'templates' !== currentTab && 'cloud' !== currentTab && 'patterns' !== currentTab && (
					<CloudSections
						clientId={clientId}
						tab={currentTab}
						libraries={libraryTabs}
						onLibraryUpdate={() => setReloadTabs(true)}
					/>
				)}
			</div>
		</Modal>
	);
}
