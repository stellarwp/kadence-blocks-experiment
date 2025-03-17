import { map } from 'lodash';

import { PluginSidebar, PluginSidebarMoreMenuItem } from '@wordpress/edit-post';
import { __ } from '@wordpress/i18n';
import { Fragment, useState, useEffect } from '@wordpress/element';
import { PanelBody, Button, Modal, TabPanel } from '@wordpress/components';
import { applyFilters } from '@wordpress/hooks';
import { createBlock } from '@wordpress/blocks';
import { BlockPreview, InspectorControls } from '@wordpress/block-editor';
import { useSelect, useDispatch } from '@wordpress/data';
/**
 * Import Icons
 */
import * as BlockIcons from '@kadence/icons';

import ComponentPresetControl from './component-preset-control';

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
	const [selectedBlock, setSelectedBlock] = useState(null);
	const [selectedBlockAttributes, setSelectedBlockAttributes] = useState({});

	const { styleBookLocalGlobalStyles } = useSelect((select) => {
		return {
			styleBookLocalGlobalStyles: select('kadenceblocks/global-styles').getStyleBookLocalGlobalStyles(),
		};
	}, []);

	const { setStyleBookLocalGlobalStyles } = useDispatch('kadenceblocks/global-styles');

	const tabs = [
		{
			name: 'global',
			title: __('Global', 'kadence-blocks'),
			className: 'kadence-style-book-tab-global',
		},
		{
			name: 'text',
			title: __('Text', 'kadence-blocks'),
			className: 'kadence-style-book-tab-text',
		},
		{
			name: 'layout',
			title: __('Layout', 'kadence-blocks'),
			className: 'kadence-style-book-tab-layout',
		},
		{
			name: 'media',
			title: __('Media', 'kadence-blocks'),
			className: 'kadence-style-book-tab-media',
		},
		{
			name: 'widgets',
			title: __('Widgets', 'kadence-blocks'),
			className: 'kadence-style-book-tab-widgets',
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

	const saveStyleBook = () => {
		setStyleBookLocalGlobalStyles({ id: 54321 });
		console.log('save style book');
	};

	const getExampleBlock = (blockName, attributes = {}) => {
		return createBlock(blockName, attributes);
	};

	const handleBlockSelect = (blockName, attributes) => {
		setSelectedBlock(blockName);
		setSelectedBlockAttributes(attributes);
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

	const renderSidebarControls = () => {
		var controlContent = null;

		if (selectedTab == 'presets') {
			if (selectedComponent == 'typography')
				controlContent = (
					<>
						<PanelBody>
							<InspectorControls.Slot />
							<div className="kadence-style-book-controls">
								This is where a preset control will go.
								<ComponentPresetControl property={'typography'}></ComponentPresetControl>
							</div>
						</PanelBody>
					</>
				);
		}
		return (
			<>
				{controlContent}
				<PanelBody>
					<Button onClick={() => saveStyleBook()} variant="secondary" enabled={true}>
						{__('Save Style Book', 'kadence-blocks')}
					</Button>
				</PanelBody>
			</>
		);
	};

	const renderTabContent = (tab) => {
		switch (tab.name) {
			case 'global':
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
			case 'text':
				// return (
				// 	<div className="kadence-style-book-text-blocks">
				// 		<div className="kadence-style-book-block-example">
				// 			<h3>{__('Advanced Text', 'kadence-blocks')}</h3>
				// 			{renderBlockPreview('kadence/advancedheading', {
				// 				content: 'Example Heading',
				// 				level: 2,
				// 				colorClass: 'theme-primary',
				// 				htmlTag: 'h2',
				// 			})}
				// 		</div>
				// 		<div className="kadence-style-book-block-example">
				// 			<h3>{__('Icon List', 'kadence-blocks')}</h3>
				// 			{renderBlockPreview('kadence/iconlist', {
				// 				listItems: [
				// 					{ text: 'First item', icon: 'fe_checkCircle' },
				// 					{ text: 'Second item', icon: 'fe_checkCircle' },
				// 					{ text: 'Third item', icon: 'fe_checkCircle' },
				// 				],
				// 				listStyles: [
				// 					{
				// 						size: 20,
				// 						color: '#555555',
				// 						background: 'transparent',
				// 					},
				// 				],
				// 			})}
				// 		</div>
				// 	</div>
				// );
				return <div className="kadence-style-book-widget-blocks">this is where text previews would go</div>;
			case 'layout':
				// return (
				// 	<div className="kadence-style-book-layout-blocks">
				// 		<div className="kadence-style-book-block-example">
				// 			<h3>{__('Row Layout', 'kadence-blocks')}</h3>
				// 			{renderBlockPreview('kadence/rowlayout', {
				// 				columns: 2,
				// 				colLayout: '50-50',
				// 				columnGutter: ['30', '30', '30'],
				// 				firstColumnWidth: 50,
				// 			})}
				// 		</div>
				// 		<div className="kadence-style-book-block-example">
				// 			<h3>{__('Tabs', 'kadence-blocks')}</h3>
				// 			{renderBlockPreview('kadence/tabs', {
				// 				titles: [
				// 					{
				// 						text: 'Tab 1',
				// 						icon: '',
				// 						id: 0,
				// 					},
				// 					{
				// 						text: 'Tab 2',
				// 						icon: '',
				// 						id: 1,
				// 					},
				// 				],
				// 				initialTab: 0,
				// 				layout: 'tabs',
				// 			})}
				// 		</div>
				// 	</div>
				// );
				return <div className="kadence-style-book-widget-blocks">this is where layout previews would go</div>;
			case 'media':
				// return (
				// 	<div className="kadence-style-book-media-blocks">
				// 		<div className="kadence-style-book-block-example">
				// 			<h3>{__('Advanced Gallery', 'kadence-blocks')}</h3>
				// 			{renderBlockPreview('kadence/advancedgallery', {
				// 				columns: [3, 3, 3],
				// 				type: 'masonry',
				// 				ids: [],
				// 				gap: ['20', '20', '20'],
				// 			})}
				// 		</div>
				// 	</div>
				// );
				return <div className="kadence-style-book-widget-blocks">this is where media previews would go</div>;
			case 'widgets':
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
				return (
					<>
						<div className="kadence-style-book-widget-blocks">this is where preset previews would go</div>
						<Button onClick={() => setSelectedComponent('typography')} variant="secondary" enabled={true}>
							{__('Make a Typography Preset', 'kadence-blocks')}
						</Button>
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
