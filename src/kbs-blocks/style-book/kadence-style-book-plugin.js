import { map } from 'lodash';

import { PluginSidebar, PluginSidebarMoreMenuItem } from '@wordpress/edit-post';
import { __ } from '@wordpress/i18n';
import { Fragment, useState, useEffect } from '@wordpress/element';
import { PanelBody, Button, Modal, TabPanel, SelectControl, TextControl } from '@wordpress/components';
import { applyFilters } from '@wordpress/hooks';
import { createBlock } from '@wordpress/blocks';
import { BlockPreview, InspectorControls } from '@wordpress/block-editor';
import { useSelect, useDispatch } from '@wordpress/data';
/**
 * Import Icons
 */
import * as BlockIcons from '@kadence/icons';
import { SelectGlobalStyles } from '@kadence/kbsComponents';
import { getGlobalStylesPresetOptions } from '@kadence/kbsHelpers';

import ComponentPresetControl from './component-preset-control';
import BlockDefaultControl from './block-default-control';

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
	const [selectedTab, setSelectedTab] = useState('text');
	const [selectedComponent, setSelectedComponent] = useState('');
	const [selectedBlockDefault, setSelectedBlockDefault] = useState('');
	const [selectedBlockAttributes, setSelectedBlockAttributes] = useState({});
	const [newGlobalStyleName, setNewGlobalStyleName] = useState('');
	const [newPresetName, setNewPresetName] = useState('');

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
		saveStyleBookGlobalStyles,
		setStyleBookAttributes,
		updateStyleBookLocalGlobalStyle,
		setStyleBookComponentPresetByStyleId,
	} = useDispatch('kadenceblocks/global-styles');

	const tabs = [
		{
			name: 'all',
			title: __('All', 'kadence-blocks'),
			className: 'kadence-style-book-tab-global',
		},
		{
			name: 'presets',
			title: __('Presets', 'kadence-blocks'),
			className: 'kadence-style-book-tab-presets',
		},
		{
			name: 'component-settings',
			title: __('Component Settings', 'kadence-blocks'),
			className: 'kadence-style-book-tab-component-settings',
		},
	];

	const getExampleBlock = (blockName, attributes = {}) => {
		return createBlock(blockName, attributes);
	};

	const handleBlockSelect = (blockName) => {
		setSelectedBlockDefault(blockName);
	};

	const renderBlockPreview = (blockName, attributes = {}) => {
		const block = getExampleBlock(blockName, attributes);
		return (
			<div
				className={`kadence-style-book-block-preview ${selectedBlock === blockName ? 'is-selected' : ''}`}
				onClick={() => handleBlockSelect(blockName, attributes)}
				role="button"
				tabIndex={0}
				onKeyDown={(event) => {
					if (event.key === 'Enter' || event.key === ' ') {
						handleBlockSelect(blockName, attributes);
					}
				}}
			>
				<BlockPreview blocks={block} viewportWidth={1000} />
			</div>
		);
	};

	const startNewGlobalStyle = () => {
		const newGlobalStyleId = newGlobalStyleName
			? newGlobalStyleName.toLowerCase().replaceAll(' ', '-')
			: uniqueId('global-style-');
		const name = newGlobalStyleName ? newGlobalStyleName : newGlobalStyleId;
		updateStyleBookLocalGlobalStyle(newGlobalStyleId, { name: name, styleId: newGlobalStyleId });
		setStyleBookAttributes({ globalStyleIds: [newGlobalStyleId] });
		setNewGlobalStyleName('');
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
	};

	const currentPreset = styleBookAttributes?.components?.[selectedComponent]?.selectedPreset;
	const currentGlobalStyleId = styleBookAttributes?.globalStyleIds?.[0];

	// console.log('in component: ', styleBookLocalGlobalStyles, currentGlobalStyleId, currentPreset, styleBookLocalGlobalStyles?.[currentGlobalStyleId]?.components?.[selectedComponent]
	// 	?.presets?.[currentPreset]?.attributes)

	// console.log('top', currentGlobalStyleId, currentPreset, styleBookLocalGlobalStyles);

	const renderSidebarControls = () => {
		var controlContent = null;
		var controlContentUpper = null;

		if (selectedTab == 'presets') {
			controlContentUpper = (
				<>
					<PanelBody>
						<div className="kbs-style-book-preset-controls">
							This is where a preset select control will go.
							<SelectControl
								label={__('Select Preset', 'kadence-blocks')}
								value={currentPreset}
								options={[
									{
										value: '',
										label: '---',
									},
								].concat(
									getGlobalStylesPresetOptions(
										styleBookLocalGlobalStyles,
										styleBookAttributes.globalStyleIds?.[0],
										selectedComponent
									)
								)}
								onChange={(preset) =>
									setStyleBookAttributes({
										components: { [selectedComponent]: { selectedPreset: preset } },
									})
								}
							/>
							<TextControl
								placeholder={__('new preset...', 'kadence-blocks')}
								value={newPresetName}
								onChange={(value) => setNewPresetName(value)}
							/>
							<Button
								variant="secondary"
								onClick={() => {
									startNewPreset();
								}}
							>
								{__('Start New Preset', 'kadence-blocks')}
							</Button>
						</div>
					</PanelBody>
				</>
			);

			if (selectedComponent == 'typography') {
				controlContent = (
					<>
						<PanelBody>
							<InspectorControls.Slot />
							<div className="kbs-style-book-controls">
								This is where a preset option controls will go.
								<ComponentPresetControl
									globalStyleId={currentGlobalStyleId}
									preset={currentPreset}
									property={'typography'}
								/>
							</div>
						</PanelBody>
					</>
				);
			}
		}
		if (selectedTab == 'layout') {
			controlContentUpper = (
				<>
					<PanelBody></PanelBody>
				</>
			);

			if (selectedBlockDefault == 'kbs/container') {
				controlContent = (
					<>
						<PanelBody>
							<InspectorControls.Slot />
							<div className="kbs-style-book-controls">
								This is where block Defaults controls will go.
								<BlockDefaultControl
									globalStyleId={currentGlobalStyleId}
									block={selectedBlockDefault}
								/>
							</div>
						</PanelBody>
					</>
				);
			}
		}
		return (
			<>
				{controlContentUpper}
				{controlContent}
				<PanelBody>
					<Button
						onClick={() => saveStyleBookGlobalStyles()}
						variant="secondary"
						enabled={true}
						isBusy={isSavingStyleBook}
					>
						{__('Save Style Book', 'kadence-blocks')}
					</Button>
				</PanelBody>
			</>
		);
	};

	const renderTabContent = (tab) => {
		switch (tab.name) {
			case 'all':
				return (
					<div className="kadence-style-book-global-blocks">
						<div className="kadence-style-book-block-example">
							<h3>{__('Color Palette', 'kadence-blocks')}</h3>
							<div
								className="kadence-style-book-colors-preview"
								onClick={() => {
									handleBlockSelect('kadence/colors', {});
									setSelectedTab('colors');
								}}
								role="button"
								tabIndex={0}
								onKeyDown={(event) => {
									if (event.key === 'Enter' || event.key === ' ') {
										handleBlockSelect('kadence/colors', {});
										setSelectedTab('colors');
									}
								}}
							>
								this would be a color pallete
							</div>
						</div>
						<div className="kadence-style-book-block-example">
							<h3>{__('Typography', 'kadence-blocks')}</h3>
							<div
								className="kadence-style-book-typography-preview"
								onClick={() => {
									handleBlockSelect('kadence/typography', {});
									setSelectedTab('typography');
								}}
								role="button"
								tabIndex={0}
								onKeyDown={(event) => {
									if (event.key === 'Enter' || event.key === ' ') {
										handleBlockSelect('kadence/typography', {});
										setSelectedTab('typography');
									}
								}}
							>
								<h1 style={{ margin: '0 0 10px' }}>Heading 1</h1>
								<h2 style={{ margin: '0 0 10px' }}>Heading 2</h2>
								<h3 style={{ margin: '0 0 10px' }}>Heading 3</h3>
								<p style={{ margin: '0 0 10px' }}>
									Body Text - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
									tempor incididunt ut labore et dolore magna aliqua.
								</p>
							</div>
						</div>
					</div>
				);
				// return (
				// 	<div className="kadence-style-book-widget-blocks">
				// 		<div className="kadence-style-book-block-example">
				// 			<h3>{__('Info Box', 'kadence-blocks')}</h3>
				// 			{renderBlockPreview('kadence/infobox', {
				// 				title: 'Info Box Title',
				// 				text: 'Info box content goes here.',
				// 				titleSize: ['24', '24', '24'],
				// 				containerBackground: '#ffffff',
				// 				containerBorder: '#eeeeee',
				// 				containerBorderWidth: [1, 1, 1, 1],
				// 				containerBorderRadius: 4,
				// 				containerPadding: [20, 20, 20, 20],
				// 			})}
				// 		</div>
				// 	</div>
				// );
				return <div className="kadence-style-book-widget-blocks">this is where widget previews would go</div>;
			case 'presets':
				const component = 'typography';
				return (
					<>
						<Button onClick={() => setSelectedComponent(component)} variant="secondary" enabled={true}>
							{__('Make a Typography Preset', 'kadence-blocks')}
						</Button>
						{selectedComponent == 'typography' && (
							<>
								<h2 className={'kbs-style-book-preview-heading'}>Typography</h2>
								<div className={'kbs-style-book-preview kbs-style-book-preview-' + selectedComponent}>
									<h1 aria-hidden="true">
										{__('h1: Inner peace cannot be given, only earned', 'kadence-blocks')}
									</h1>
									<h2 aria-hidden="true">
										{__('h2: Inner peace cannot be given, only earned', 'kadence-blocks')}
									</h2>
									<h3 aria-hidden="true">
										{__('h3: Inner peace cannot be given, only earned', 'kadence-blocks')}
									</h3>
									<h4 aria-hidden="true">
										{__('h4: Inner peace cannot be given, only earned', 'kadence-blocks')}
									</h4>
									<h5 aria-hidden="true">
										{__('h5: Inner peace cannot be given, only earned', 'kadence-blocks')}
									</h5>
									<h6 aria-hidden="true">
										{__('h6: Inner peace cannot be given, only earned', 'kadence-blocks')}
									</h6>
									<p aria-hidden="true">
										{__(
											'p: Inner peace cannot be given, only earned. Waiting for such for a thing is fruitless. Only those who persevere and toil will be rewarded.',
											'kadence-blocks'
										)}
									</p>
								</div>
							</>
						)}
					</>
				);
			case 'component-settings':
				return <div className="kadence-style-book-widget-blocks">this is where setting previews would go</div>;
			default:
				return null;
		}
	};

	return (
		<Fragment>
			{isKadenceStyleBookOpened && (
				<Modal
					title={__('Kadence Style Book', 'kadence-blocks')}
					onRequestClose={() => {
						setIsKadenceStyleBookOpened(false);
					}}
					className="kadence-style-book-modal"
					overlayClassName="kadence-style-book-modal-overlay editor-styles-wrapper"
				>
					<div className="kadence-style-book-content">
						<SelectGlobalStyles
							attributes={styleBookAttributes}
							setAttributes={setStyleBookAttributes}
							isMulti={false}
							forStyleBook={true}
						/>
						<TextControl
							placeholder={__('new global style...', 'kadence-blocks')}
							value={newGlobalStyleName}
							onChange={(value) => setNewGlobalStyleName(value)}
						/>
						<Button
							variant="secondary"
							onClick={() => {
								startNewGlobalStyle();
							}}
						>
							{__('Start New Global Style', 'kadence-blocks')}
						</Button>
						<TabPanel
							className="kadence-style-book-tabs"
							activeClass="is-active"
							tabs={tabs}
							onSelect={(tabName) => setSelectedTab(tabName)}
						>
							{(tab) => renderTabContent(tab)}
						</TabPanel>
					</div>
					<div className="kadence-style-book-footer">
						<Button
							variant="secondary"
							onClick={() => {
								setIsKadenceStyleBookOpened(false);
							}}
						>
							{__('Close', 'kadence-blocks')}
						</Button>
					</div>
					<Styles
						previewDevice={previewDevice}
						attributes={
							styleBookLocalGlobalStyles?.[currentGlobalStyleId]?.components?.[selectedComponent]
								?.presets?.[currentPreset]?.attributes
						}
						styleBookAttributes={styleBookAttributes}
						styleBookLocalGlobalStyles={styleBookLocalGlobalStyles}
						selectedComponent={selectedComponent}
					/>
				</Modal>
			)}
			<PluginSidebarMoreMenuItem target="kadence-controls" icon={controlIcon}>
				{controlName}
			</PluginSidebarMoreMenuItem>
			<PluginSidebar isPinnable={true} name="kadence-controls" title={controlName}>
				<>
					<PanelBody>
						<Button
							onClick={() => setIsKadenceStyleBookOpened(!isKadenceStyleBookOpened)}
							variant="secondary"
							isPressed={isKadenceStyleBookOpened}
						>
							{isKadenceStyleBookOpened
								? __('Close Style Book', 'kadence-blocks')
								: __('Open Style Book', 'kadence-blocks')}
						</Button>
					</PanelBody>
					{isKadenceStyleBookOpened && renderSidebarControls()}
				</>
			</PluginSidebar>
		</Fragment>
	);
}

export default KadenceConfig;
