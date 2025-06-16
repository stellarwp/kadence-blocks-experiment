import clsx from 'clsx';
import { PluginSidebar, PluginSidebarMoreMenuItem } from '@wordpress/editor';
import { __ } from '@wordpress/i18n';
import { useState, useEffect, useRef, useMemo } from '@wordpress/element';
import {
	PanelBody,
	Button,
	Modal,
	TabPanel,
	SelectControl,
	DropdownMenu,
	MenuGroup,
	MenuItem,
	Dropdown,
} from '@wordpress/components';
import { plus, moreVertical } from '@wordpress/icons';
import { applyFilters } from '@wordpress/hooks';
import { useSelect, useDispatch } from '@wordpress/data';

import { useEditorElement, getGlobalStylesPresetOptions, getGlobalStylesCSSOutput } from '@kadence/kbsHelpers';
import { SelectGlobalStyles, TextControl, TitleBar } from '@kadence/kbsComponents';
import { KadencePanelBody } from '@kadence/components';
import * as BlockIcons from '@kadence/icons';

import ComponentPresetControl from './component-preset-control';
import ComponentMappingControl from './component-mapping-control';
import BackgroundPresets from './presets/background-presets';
import GlobalColors from './colors/global-colors';
import Styles from './editing/styles';

import { uniqueId } from 'lodash';

/**
 * Build the row edit
 */
function KadenceConfig() {
	const [controlName, setControlName] = useState(
		applyFilters('kadence.block_sidebar_control_name', __('Style Book Controls', 'kadence-blocks'))
	);
	const [controlIcon, setControlIcon] = useState(
		applyFilters('kadence.block_sidebar_control_icon', BlockIcons.kadenceNewIcon)
	);
	const [isKadenceStyleBookOpened, setIsKadenceStyleBookOpened] = useState(false);
	const [selectedTab, setSelectedTab] = useState('all');
	const [selectedComponent, setSelectedComponent] = useState('');
	const [newGlobalStyleName, setNewGlobalStyleName] = useState('');
	const [newPresetName, setNewPresetName] = useState('');
	const [needsSave, setNeedsSave] = useState(false);
	const divRef = useRef(null);
	const modalRef = useRef(null);

	const { styleBookLocalGlobalStyles, isSavingStyleBook, styleBookAttributes, previewDevice } = useSelect(
		(select) => {
			return {
				styleBookLocalGlobalStyles: select('kadenceblocks/global-styles').getStyleBookLocalGlobalStyles(),
				isSavingStyleBook: select('kadenceblocks/global-styles').isSavingStyleBook(),
				styleBookAttributes: select('kadenceblocks/global-styles').getStyleBookAttributes(),
				previewDevice: select('kadenceblocks/data').getPreviewDeviceType(),
			};
		},
		[]
	);

	const {
		saveStyleBookGlobalStyle,
		saveStyleBookGlobalStyles,
		setStyleBookAttributes,
		updateStyleBookLocalGlobalStyle,
		setStyleBookComponentPresetByStyleId,
	} = useDispatch('kadenceblocks/global-styles');

	const tabs = [
		{
			name: 'all',
			title: __('General', 'kadence-blocks'),
			className: 'kadence-style-book-tab-global',
		},
		{
			name: 'presets',
			title: __('Presets', 'kadence-blocks'),
			className: 'kadence-style-book-tab-presets',
		},
		{
			name: 'component-settings',
			title: __('Mappings', 'kadence-blocks'),
			className: 'kadence-style-book-tab-component-settings',
		},
	];

	const startNewGlobalStyle = () => {
		const newGlobalStyleId = newGlobalStyleName
			? newGlobalStyleName.toLowerCase().replaceAll(' ', '-')
			: uniqueId('global-style-');
		const name = newGlobalStyleName ? newGlobalStyleName : newGlobalStyleId;
		updateStyleBookLocalGlobalStyle(newGlobalStyleId, { name: name, styleId: newGlobalStyleId });
		setStyleBookAttributes({ globalStyleIds: [newGlobalStyleId] });
		setNewGlobalStyleName('');
		setNeedsSave(true);
	};
	const startNewPreset = () => {
		const newPresetId = newPresetName
			? newPresetName.toLowerCase().replaceAll(' ', '-')
			: uniqueId('global-style-');
		const name = newPresetName ? newPresetName : newPresetId;
		setStyleBookComponentPresetByStyleId(currentGlobalStyleId, selectedComponent, newPresetId, { name: name });
		setStyleBookAttributes({
			components: { [selectedComponent]: { selectedPreset: newPresetId } },
		});
		setNewPresetName('');
		setNeedsSave(true);
	};

	const currentPreset = styleBookAttributes?.components?.[selectedComponent]?.selectedPreset;
	const currentGlobalStyleId = styleBookAttributes?.globalStyleIds?.[0];

	const isListViewOpen = useSelect((select) => {
		return select('core/editor').isListViewOpened();
	}, []);

	const ref = useRef();
	const editorElement = useEditorElement(
		ref,
		[previewDevice, isListViewOpen, isKadenceStyleBookOpened, styleBookLocalGlobalStyles],
		'editor-visual-editor'
	);
	const editorWidth = editorElement?.clientWidth;
	const editorLeft = editorElement?.getBoundingClientRect().left;

	const resetStyleBookUI = () => {
		setStyleBookAttributes({
			components: { [selectedComponent]: { selectedPreset: '' } },
		});
		setStyleBookAttributes({ globalStyleIds: ['kbs-base'] });
		setSelectedTab('all');
		setSelectedComponent('');
		setNeedsSave(true);
	};

	const globalStylesCss = getGlobalStylesCSSOutput(currentGlobalStyleId !== 'kbs-base' ? [currentGlobalStyleId] : []);

	// console.log('style book local: ', editorStyles, editorElement, isListViewOpen);

	// console.log('in component: ', styleBookLocalGlobalStyles, currentGlobalStyleId, currentPreset, styleBookLocalGlobalStyles?.[currentGlobalStyleId]?.components?.[selectedComponent]
	// 	?.presets?.[currentPreset]?.attributes)

	// console.log('top', currentGlobalStyleId, currentPreset, styleBookLocalGlobalStyles);

	const renderSidebarControls = () => {
		var controlContent = null;
		var controlContentUpper = null;
		const canResetAll = true;
		const onResetAll = () => {
			console.log('reset all');
		};
		const classes = clsx('components-panel__body-title kbs-style-book-control-title');
		const controlContentGlobal = (
			<PanelBody>
				<div className="kbs-style-book-controls">
					<h2 className={classes}>
						<div className="kbs-control-title-bar-inner">
							<span className="kbs-control-title">{__('Select Global Style', 'kadence-blocks')}</span>
						</div>
						<Dropdown
							popoverProps={{
								placement: 'left-start',
								//offset: 36,
								shift: true,
							}}
							className={'kbs-popover-add-global-style'}
							contentClassName={'kbs-popover-add-global-style-content'}
							renderToggle={({ isOpen, onToggle }) => (
								<Button
									icon={plus}
									className="kbs-advanced-controls-button"
									onClick={onToggle}
									isPressed={isOpen}
									aria-expanded={isOpen}
									iconSize={18}
									label={__('Add Global Style', 'kadence-blocks')}
								/>
							)}
							renderContent={({ isOpen, onToggle }) => (
								<div className="kbs-popover-add-global-style-content">
									<h2 className="kbs-popover-add-global-style-content-title">
										{__('Add Global Style', 'kadence-blocks')}
									</h2>
									<div className="kbs-popover-add-global-style-content-items kbs-control">
										<TextControl
											label={__('Global Style Name', 'kadence-blocks')}
											value={newGlobalStyleName}
											onChange={(value) => setNewGlobalStyleName(value)}
										/>
										<div className="kbs-popover-add-global-style-content-items-buttons">
											<Button
												variant="primary"
												disabled={!newGlobalStyleName}
												onClick={() => {
													startNewGlobalStyle();
													onToggle();
												}}
											>
												{__('Add Global Style', 'kadence-blocks')}
											</Button>
											<Button __next40pxDefaultSize onClick={onToggle}>
												{__('Cancel', 'kadence-blocks')}
											</Button>
										</div>
									</div>
								</div>
							)}
						/>
						<DropdownMenu
							icon={moreVertical}
							className={`kbs-tools-panel-body__tools-dropdown`}
							label="Global Style Settings"
						>
							{({ onClose }) => (
								<>
									<MenuGroup label={__('Reset Global Style', 'kadence-blocks')}>
										<MenuItem
											disabled={!canResetAll}
											variant="tertiary"
											onClick={() => {
												if (canResetAll) {
													onResetAll();
													speak(__('All global style options reset'), 'assertive');
													onClose();
												}
											}}
										>
											{__('Reset Global Style')}
										</MenuItem>
									</MenuGroup>
								</>
							)}
						</DropdownMenu>
					</h2>
					<SelectGlobalStyles
						attributes={styleBookAttributes}
						setAttributes={setStyleBookAttributes}
						isMulti={false}
						forStyleBook={true}
					/>
				</div>
			</PanelBody>
		);

		// if (selectedTab == 'presets' && selectedComponent) {
		// 	controlContentUpper = (
		// 		<>
		// 			<KadencePanelBody title={__('Select Preset', 'kadence-blocks')} panelName={'kb-container-settings'}>
		// 				<div className="kbs-style-book-preset-controls">
		// 					<SelectControl
		// 						value={currentPreset}
		// 						options={[
		// 							{
		// 								value: '',
		// 								label: '---',
		// 							},
		// 						].concat(
		// 							getGlobalStylesPresetOptions(
		// 								styleBookLocalGlobalStyles,
		// 								styleBookAttributes.globalStyleIds?.[0],
		// 								selectedComponent
		// 							)
		// 						)}
		// 						onChange={(preset) =>
		// 							setStyleBookAttributes({
		// 								components: { [selectedComponent]: { selectedPreset: preset } },
		// 							})
		// 						}
		// 					/>
		// 					<TextControl
		// 						placeholder={__('new preset...', 'kadence-blocks')}
		// 						value={newPresetName}
		// 						onChange={(value) => setNewPresetName(value)}
		// 					/>
		// 					<Button
		// 						variant="secondary"
		// 						onClick={() => {
		// 							startNewPreset();
		// 						}}
		// 					>
		// 						{__('Start New Preset', 'kadence-blocks')}
		// 					</Button>
		// 				</div>
		// 			</KadencePanelBody>
		// 		</>
		// 	);
		// }
		// if (selectedTab == 'presets' && selectedComponent && currentPreset) {
		// 	controlContentUpper = (
		// 		<PresetTitleBar selectedComponent={selectedComponent} currentPreset={currentPreset} />
		// 	);
		// }
		if (selectedComponent == 'typography') {
			controlContent = (
				<>
					<KadencePanelBody title={__('Typography', 'kadence-blocks')} panelName={'kb-container-settings'}>
						<div className="kbs-style-book-controls">
							<ComponentPresetControl
								globalStyleId={currentGlobalStyleId}
								preset={currentPreset}
								property={'typography'}
							/>
						</div>
					</KadencePanelBody>
				</>
			);
		}
		if (selectedComponent == 'background' && currentPreset) {
			controlContent = (
				<ComponentPresetControl
					globalStyleId={currentGlobalStyleId}
					preset={currentPreset}
					property={selectedComponent}
					globalStylesCss={globalStylesCss}
				/>
			);
		}
		return (
			<div className="block-editor-block-inspector">
				{controlContentGlobal}
				{controlContentUpper}
				{controlContent}
				<PanelBody>
					<Button
						onClick={() => {
							saveStyleBookGlobalStyle(currentGlobalStyleId);
							setNeedsSave(false);
						}}
						variant="primary"
						isBusy={isSavingStyleBook}
						disabled={!needsSave}
					>
						{__('Save Style Book', 'kadence-blocks')}
					</Button>
				</PanelBody>
			</div>
		);
	};

	const colorComponentPreviewContent = (
		<div className="kbs-style-book-component-preview-container">
			<h2 className={'kbs-style-book-preview-heading'}>{__('Color Palette', 'kadence-blocks')}</h2>
			<div className="kbs-style-book-component-preview">
				<div
					className="kbs-style-book-preview-element kbs-color-preview"
					onClick={() => {
						setSelectedComponent('color');
					}}
					role="button"
				>
					this would be a color pallete
				</div>
			</div>
		</div>
	);

	const typographyComponentPreviewContent = (
		<div className="kbs-style-book-component-preview-container">
			<h2 className={'kbs-style-book-preview-heading'}>{__('Typography', 'kadence-blocks')}</h2>
			<div className="kbs-style-book-component-preview">
				<div className="kbs-flex-horizontal kbs-flex-gap-lg">
					<div className={'kbs-column'}>
						<div
							className={'kbs-style-book-preview-element kbs-heading-main-preview'}
							onClick={() => {
								setSelectedComponent('typography');
								setStyleBookAttributes({
									components: { typography: { selectedPreset: 'heading' } },
								});
							}}
							role="button"
						>
							<h1 aria-hidden="true">{__('Headings', 'kadence-blocks')}</h1>
							<h2>
								{__(
									'A a B b C c D d E e F f G g H h I i J j K k L l M m N n O o P p Q q R r S s T t U u V v W w X x Y y Z z',
									'kadence-blocks'
								)}
							</h2>
						</div>
						<div
							className={'kbs-style-book-preview-element kbs-heading-1-preview'}
							onClick={() => {
								setSelectedComponent('typography');
								setStyleBookAttributes({
									components: { typography: { selectedPreset: 'heading-1' } },
								});
							}}
							role="button"
						>
							<h1 aria-hidden="true">{__('Heading 1', 'kadence-blocks')}</h1>
						</div>
						<div
							className={'kbs-style-book-preview-element kbs-heading-2-preview'}
							onClick={() => {
								setSelectedComponent('typography');
								setStyleBookAttributes({
									components: { typography: { selectedPreset: 'heading-2' } },
								});
							}}
							role="button"
						>
							<h2 aria-hidden="true">{__('Heading 2', 'kadence-blocks')}</h2>
						</div>
						<div
							className={'kbs-style-book-preview-element kbs-heading-3-preview'}
							onClick={() => {
								setSelectedComponent('typography');
								setStyleBookAttributes({
									components: { typography: { selectedPreset: 'heading-3' } },
								});
							}}
							role="button"
						>
							<h3 aria-hidden="true">{__('Heading 3', 'kadence-blocks')}</h3>
						</div>
						<div
							className={'kbs-style-book-preview-element kbs-heading-4-preview'}
							onClick={() => {
								setSelectedComponent('typography');
								setStyleBookAttributes({
									components: { typography: { selectedPreset: 'heading-4' } },
								});
							}}
							role="button"
						>
							<h4 aria-hidden="true">{__('Heading 4', 'kadence-blocks')}</h4>
						</div>
						<div
							className={'kbs-style-book-preview-element kbs-heading-5-preview'}
							onClick={() => {
								setSelectedComponent('typography');
								setStyleBookAttributes({
									components: { typography: { selectedPreset: 'heading-5' } },
								});
							}}
							role="button"
						>
							<h5 aria-hidden="true">{__('Heading 5', 'kadence-blocks')}</h5>
						</div>
						<div
							className={'kbs-style-book-preview-element kbs-heading-6-preview'}
							onClick={() => {
								setSelectedComponent('typography');
								setStyleBookAttributes({
									components: { typography: { selectedPreset: 'heading-6' } },
								});
							}}
							role="button"
						>
							<h6 aria-hidden="true">{__('Heading 6', 'kadence-blocks')}</h6>
						</div>
					</div>
					<div className={'kbs-column'}>
						<div
							className={'kbs-style-book-preview-element kbs-body-preview'}
							onClick={() => {
								setSelectedComponent('typography');
								setStyleBookAttributes({
									components: { typography: { selectedPreset: 'text-body' } },
								});
							}}
							role="button"
						>
							<p aria-hidden="true">
								{__('This is what your body text will look like.', 'kadence-blocks')}
							</p>
							<p aria-hidden="true">
								{__(
									'When you hear a true story, there is a part of you that responds to it regardless of art, regardless of evidence. Let it be the most obvious fabrication and you will still believe whatever truth is in it, because you can not deny truth no matter how shabbily it is dressed.',
									'kadence-blocks'
								)}
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);

	const renderTabContent = (tab) => {
		switch (tab.name) {
			case 'all':
				return (
					<div className="kbs-style-book-all">
						<GlobalColors
							setNeedsSave={(value) => {
								setNeedsSave(value);
							}}
							setSelectedComponent={setSelectedComponent}
							globalStyleId={currentGlobalStyleId}
							currentPreset={currentPreset}
							previewDevice={previewDevice}
							globalStylesCss={globalStylesCss}
							startNewPreset={startNewPreset}
							newPresetName={newPresetName}
							setNewPresetName={setNewPresetName}
						/>
						{typographyComponentPreviewContent}
					</div>
				);
			case 'presets':
				const component = 'typography';
				return (
					<>
						<BackgroundPresets
							setStyleBookAttributes={(props) => {
								setStyleBookAttributes(props);
								setNeedsSave(true);
							}}
							setSelectedComponent={setSelectedComponent}
							globalStyleId={currentGlobalStyleId}
							currentPreset={currentPreset}
							previewDevice={previewDevice}
							globalStylesCss={globalStylesCss}
							startNewPreset={startNewPreset}
							newPresetName={newPresetName}
							setNewPresetName={setNewPresetName}
						/>
						{/* <Button
							onClick={() => setSelectedComponent(component)}
							variant="secondary"
							style={{ marginBottom: '10px' }}
						>
							{__('Make a Typography Preset', 'kadence-blocks')}
						</Button>
						{selectedComponent == 'typography' && typographyComponentPreviewContent} */}
					</>
				);
			case 'component-settings':
				return (
					<>
						<ComponentMappingControl globalStyleId={currentGlobalStyleId} />
					</>
				);

			default:
				return null;
		}
	};

	useEffect(() => {
		if (divRef.current) {
			if (globalStylesCss) {
				divRef.current.setAttribute('style', globalStylesCss);
			} else {
				divRef.current.removeAttribute('style');
			}
		}
	}, [globalStylesCss, divRef?.current]);

	useEffect(() => {
		if (modalRef.current) {
			if (globalStylesCss) {
				modalRef.current.setAttribute('style', globalStylesCss);
			} else {
				modalRef.current.removeAttribute('style');
			}
		}
	}, [globalStylesCss, modalRef?.current]);

	return (
		<>
			{isKadenceStyleBookOpened && (
				<Modal
					title={__('Style Book', 'kadence-blocks')}
					onRequestClose={() => {
						setIsKadenceStyleBookOpened(false);
					}}
					className="kbs-style-book-modal"
					overlayClassName="kbs-style-book-modal-overlay"
				>
					<div className="kbs-style-book-content" ref={modalRef}>
						<TabPanel
							className="kbs-style-book-tabs"
							activeClass="is-active"
							initialTabName="all"
							tabs={tabs}
							onSelect={(tabName) => {
								setSelectedTab(tabName);
								setSelectedComponent('');
							}}
						>
							{(tab) => renderTabContent(tab)}
						</TabPanel>
					</div>
					<div className="kbs-style-book-footer">
						<Button
							variant="secondary"
							onClick={() => {
								resetStyleBookUI();
								setIsKadenceStyleBookOpened(false);
							}}
							style={{ marginTop: '20px' }}
						>
							{__('Close', 'kadence-blocks')}
						</Button>
					</div>
					<Styles
						previewDevice={previewDevice}
						styleBookAttributes={styleBookAttributes}
						styleBookLocalGlobalStyles={styleBookLocalGlobalStyles}
						currentGlobalStyleId={currentGlobalStyleId}
						currentPreset={currentPreset}
						selectedComponent={selectedComponent}
						selectedTab={selectedTab}
					/>
					<style>
						{'.kbs-style-book-modal-overlay{width:' + editorWidth + 'px; left: ' + editorLeft + 'px;}'}
					</style>
				</Modal>
			)}
			<PluginSidebarMoreMenuItem target="kbs-style-book-controls" icon={controlIcon}>
				{controlName}
			</PluginSidebarMoreMenuItem>
			<PluginSidebar isPinnable={true} name="kbs-style-book-controls" title={controlName}>
				<div ref={divRef} className="kbs-style-book-controls-container">
					{!isKadenceStyleBookOpened && (
						<PanelBody>
							<Button
								onClick={() => {
									if (isKadenceStyleBookOpened) resetStyleBookUI();
									setIsKadenceStyleBookOpened(!isKadenceStyleBookOpened);
								}}
								variant="secondary"
								isPressed={isKadenceStyleBookOpened}
							>
								{isKadenceStyleBookOpened
									? __('Close Style Book', 'kadence-blocks')
									: __('Open Style Book', 'kadence-blocks')}
							</Button>
						</PanelBody>
					)}
					{isKadenceStyleBookOpened && renderSidebarControls()}
				</div>
			</PluginSidebar>
			<div className={'kbs-style-book-ref'} ref={ref} />
		</>
	);
}

export default KadenceConfig;
