import clsx from 'clsx';
import { PluginSidebar, PluginSidebarMoreMenuItem } from '@wordpress/editor';
import { __ } from '@wordpress/i18n';
import { speak } from '@wordpress/a11y';
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
import { plus, moreVertical, close } from '@wordpress/icons';
import { applyFilters } from '@wordpress/hooks';
import { useSelect, useDispatch } from '@wordpress/data';

import { useEditorElement, getGlobalStylesPresetOptions, getGlobalStylesCSSOutput } from '@kadence/kbsHelpers';
import { SelectGlobalStyles, TextControl, TitleBar } from '@kadence/kbsComponents';
import { KadencePanelBody } from '@kadence/components';
import * as BlockIcons from '@kadence/icons';

import ComponentPresetControl from './component-preset-control';
import ComponentPresetBundledControl from './component-preset-control/bundled-controls';
import ComponentMappingControl from './component-mapping-control';
import BackgroundPresets from './presets/background-presets';
import ButtonPresets from './presets/button-presets';
import GlobalColors from './colors/global-colors';
import GlobalTypography from './typography/global-typography';
import Preview from './preview';
import Styles from './editing/styles';

import { uniqueId } from 'lodash';
import V3Controls from './v3-controls';

/**
 * Build the row edit
 */
function KadenceConfig() {
	const v3Enabled = typeof kadence_blocks_params !== 'undefined' ? kadence_blocks_params?.v3Enabled : false;
	const [controlName, setControlName] = useState(__('Style Book Controls', 'kadence-blocks'));
	const [controlIcon, setControlIcon] = useState(
		applyFilters('kadence.block_sidebar_control_icon', BlockIcons.kadenceNewIcon)
	);
	const [isKadenceStyleBookOpened, setIsKadenceStyleBookOpened] = useState(false);
	const [selectedTab, setSelectedTab] = useState('style-guide');
	const [selectedMappingComponent, setSelectedMappingComponent] = useState('fontSize');
	const [selectedComponent, setSelectedComponent] = useState('');
	const [newGlobalStyleName, setNewGlobalStyleName] = useState('');
	const [newPresetName, setNewPresetName] = useState('');
	const [needsSave, setNeedsSave] = useState(false);
	const [customPalette, setCustomPalette] = useState({
		mainColor: '',
		isLight: true,
		contrast: 'middle',
		saturation: 1,
		sat: 1,
		bright: 2,
		brightness: 2,
		btnColor: '#ffffff',
		colors: [],
	});
	const [colorsSubTab, setColorsSubTab] = useState('colors');
	const [isPaletteCreatorOpen, setIsPaletteCreatorOpen] = useState(false);
	const [isFontPairingCreatorOpen, setIsFontPairingCreatorOpen] = useState(false);
	const [isConfirmCloseModal, setIsConfirmCloseModal] = useState(false);
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

	const startNewGlobalStyle = () => {
		const newGlobalStyleId = newGlobalStyleName
			? newGlobalStyleName.toLowerCase().replaceAll(' ', '-')
			: uniqueId('global-style-');
		const name = newGlobalStyleName ? newGlobalStyleName : newGlobalStyleId;
		updateStyleBookLocalGlobalStyle(newGlobalStyleId, { name, styleId: newGlobalStyleId });
		setStyleBookAttributes({ globalStyleIds: [newGlobalStyleId] });
		setNewGlobalStyleName('');
		setNeedsSave(true);
	};
	const startNewPreset = () => {
		const newPresetId = newPresetName
			? newPresetName.toLowerCase().replaceAll(' ', '-')
			: uniqueId('global-style-');
		const name = newPresetName ? newPresetName : newPresetId;
		setStyleBookComponentPresetByStyleId(currentGlobalStyleId, selectedComponent, newPresetId, { name });
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
		setSelectedTab('style-guide');
		setSelectedComponent('');
		setNeedsSave(true);
	};

	const globalStylesCss = getGlobalStylesCSSOutput(currentGlobalStyleId !== 'kbs-base' ? [currentGlobalStyleId] : []);

	// console.log('style book local: ', editorStyles, editorElement, isListViewOpen);

	// console.log('in component: ', styleBookLocalGlobalStyles, currentGlobalStyleId, currentPreset, styleBookLocalGlobalStyles?.[currentGlobalStyleId]?.components?.[selectedComponent]
	// 	?.presets?.[currentPreset]?.attributes)

	// console.log('top', currentGlobalStyleId, currentPreset, styleBookLocalGlobalStyles);

	const renderSidebarControls = () => {
		let controlContent = null;
		const controlContentUpper = null;
		const canResetAll = true;
		const onResetAll = () => {
			console.log('reset all currently does not work');
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
		if (selectedComponent == 'buttonVariant') {
			controlContent = (
				<>
					<ComponentPresetBundledControl
						globalStyleId={currentGlobalStyleId}
						preset={currentPreset}
						property={'buttonVariant'}
					/>
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
					headerActions={
						<>
							<div className="kbs-style-book-header-actions">
								<Button
									className="kbs-storybook-subtab-btn"
									isPressed={selectedTab === 'style-guide'}
									onClick={() => setSelectedTab('style-guide')}
								>
									{__('Style Guide', 'kadence-blocks')}
								</Button>
								<Button
									className="kbs-storybook-subtab-btn"
									isPressed={selectedTab === 'design-system'}
									onClick={() => setSelectedTab('design-system')}
								>
									{__('Presets', 'kadence-blocks')}
								</Button>
								<Button
									className="kbs-storybook-subtab-btn"
									isPressed={selectedTab === 'mappings'}
									onClick={() => setSelectedTab('mappings')}
								>
									{__('Control Settings', 'kadence-blocks')}
								</Button>
							</div>
							<div className="kbs-style-book-close-header">
								<Button
									size="compact"
									icon={close}
									onClick={() => {
										if (needsSave) {
											setIsConfirmCloseModal(true);
										} else {
											setIsKadenceStyleBookOpened(false);
										}
									}}
									label={__('Close', 'kadence-blocks')}
								/>
							</div>
						</>
					}
					onRequestClose={() => {
						if (needsSave) {
							setIsConfirmCloseModal(true);
						} else {
							setIsKadenceStyleBookOpened(false);
						}
					}}
					isDismissible={false}
					className="kbs-style-book-modal"
					overlayClassName="kbs-style-book-modal-overlay"
				>
					<div className="kbs-style-book-content kbs-style-book-controls-preview" ref={modalRef}>
						{selectedTab == 'style-guide' && (
							<>
								<div className="kbs-style-book-style-guide">
									<div className="kbs-style-book-style-guide-left">
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
											colorsSubTab={colorsSubTab}
											setColorsSubTab={setColorsSubTab}
											isPaletteCreatorOpen={isPaletteCreatorOpen}
											setIsPaletteCreatorOpen={setIsPaletteCreatorOpen}
											customPalette={customPalette}
											setCustomPalette={setCustomPalette}
										/>
									</div>
									<div className="kbs-style-book-style-guide-right">
										<Preview
											globalStyleId={currentGlobalStyleId}
											colorsSubTab={colorsSubTab}
											setColorsSubTab={setColorsSubTab}
											isPaletteCreatorOpen={isPaletteCreatorOpen}
											setIsPaletteCreatorOpen={setIsPaletteCreatorOpen}
											customPalette={customPalette}
											setCustomPalette={setCustomPalette}
											styleBookLocalGlobalStyles={styleBookLocalGlobalStyles}
										/>
									</div>
								</div>
								<div className="kbs-style-book-style-guide-divider" />
								<div className="kbs-style-book-style-guide kbs-style-book-style-guide-typography">
									<GlobalTypography
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
										isFontPairingCreatorOpen={isFontPairingCreatorOpen}
										setIsFontPairingCreatorOpen={setIsFontPairingCreatorOpen}
									/>
								</div>
							</>
						)}
						{selectedTab == 'design-system' && (
							<div className="kbs-style-book-design-system">
								<ButtonPresets
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
							</div>
						)}
						{selectedTab == 'mappings' && (
							<div className="kbs-style-book-mappings">
								<ComponentMappingControl
									globalStyleId={currentGlobalStyleId}
									setNeedsSave={setNeedsSave}
									selectedMappingComponent={selectedMappingComponent}
									setSelectedMappingComponent={setSelectedMappingComponent}
								/>
							</div>
						)}
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
			{isConfirmCloseModal && (
				<Modal
					title={__('Save Changes?', 'kadence-blocks')}
					onRequestClose={() => {
						setIsConfirmCloseModal(false);
						setIsKadenceStyleBookOpened(false);
					}}
					className="kbs-style-book-close-modal"
					overlayClassName="kbs-style-book-close-modal-overlay"
				>
					<div className="kbs-style-book-close-modal-content">
						<p>
							{__(
								'You have unsaved changes. Would you like to save them before closing?',
								'kadence-blocks'
							)}
						</p>
						<div className="kbs-style-book-close-modal-actions">
							<Button
								variant="primary"
								onClick={() => {
									saveStyleBookGlobalStyle(currentGlobalStyleId);
									setNeedsSave(false);
									setIsConfirmCloseModal(false);
									setIsKadenceStyleBookOpened(false);
								}}
							>
								{__('Save', 'kadence-blocks')}
							</Button>
							<Button
								variant="secondary"
								onClick={() => {
									setIsConfirmCloseModal(false);
									setIsKadenceStyleBookOpened(false);
								}}
							>
								{__('Close without saving', 'kadence-blocks')}
							</Button>
						</div>
					</div>
				</Modal>
			)}
			<PluginSidebarMoreMenuItem target="kbs-style-book-controls" icon={controlIcon}>
				{controlName}
			</PluginSidebarMoreMenuItem>
			<PluginSidebar isPinnable={true} name="kbs-style-book-controls" title={controlName}>
				<div ref={divRef} className="kbs-style-book-controls-container">
					{!isKadenceStyleBookOpened && (
						<>
							<PanelBody>
								<Button
									onClick={() => {
										if (isKadenceStyleBookOpened) {
											resetStyleBookUI();
										}
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
							{v3Enabled && <V3Controls />}
						</>
					)}
					{isKadenceStyleBookOpened && renderSidebarControls()}
				</div>
			</PluginSidebar>
			<div className={'kbs-style-book-ref'} ref={ref} />
		</>
	);
}

export default KadenceConfig;
