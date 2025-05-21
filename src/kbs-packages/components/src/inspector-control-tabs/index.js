/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Icon } from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import { createRef, useEffect } from '@wordpress/element';
import { blockDefault, brush, settings } from '@wordpress/icons';
/**
 * Internal dependencies
 */
import './editor.scss';

function InspectorControlTabs({ allowedTabs = null, activeTab, setActiveTab, panelName = '', tabs = null }) {
	const defaultTabs = [
		{
			key: 'general',
			title: __('General', 'kadence-blocks'),
			icon: blockDefault,
		},
		{
			key: 'style',
			title: __('Style', 'kadence-blocks'),
			icon: brush,
		},
		{
			key: 'advanced',
			title: __('Advanced', 'kadence-blocks'),
			icon: settings,
		},
	];

	const tabKeys = ['general', 'style', 'advanced'];
	const allowedTabKeys = allowedTabs ? allowedTabs : tabKeys;
	const tabsMap = tabs ? tabs : defaultTabs;
	const tabsContainer = createRef();

	let componentsPanel;

	const selectedBlockClientId = useSelect((select) => {
		return select('core/block-editor').getSelectedBlockClientId();
	}, []);

	const openedTab = useSelect(
		(select) => {
			const initialOpen = 'general';
			return select('kadenceblocks/data').getOpenSidebarTabKey(panelName + selectedBlockClientId, initialOpen);
		},
		[panelName, selectedBlockClientId]
	);

	const { switchEditorTabOpened } = useDispatch('kadenceblocks/data');

	useEffect(() => {
		componentsPanel = tabsContainer.current.closest('.components-panel');
	});

	useEffect(() => {
		if (activeTab !== openedTab) {
			console.log('activeTab', activeTab);
			console.log('openedTab', openedTab);
			setActiveTab(openedTab);
		}
	}, [activeTab, openedTab]);

	const setDataAttr = (key) => {
		if (componentsPanel) {
			componentsPanel.setAttribute('data-kadence-hide-advanced', key !== 'advanced');
			componentsPanel.setAttribute('data-kadence-active-tab', key);
		}
	};

	const switchTab = (key) => {
		switchEditorTabOpened(panelName + selectedBlockClientId, key);
		setActiveTab(key);
	};

	useEffect(() => {
		setDataAttr(activeTab);
		return () => {
			if (componentsPanel) {
				const kadenceInspectorTabs = componentsPanel.querySelector('.kadence-blocks-inspector-tabs');

				if (!kadenceInspectorTabs || null === kadenceInspectorTabs) {
					componentsPanel.removeAttribute('data-kadence-hide-advanced');
					componentsPanel.removeAttribute('data-kadence-active-tab');
				}
			}
		};
	}, [activeTab]);

	return (
		<div className="kadence-blocks-inspector-tabs" ref={tabsContainer}>
			{tabsMap.map(({ key, title, icon }, i) => {
				if (allowedTabKeys.includes(key)) {
					return (
						<button
							key={key}
							aria-label={title + ' ' + __('tab', 'kadence-blocks')}
							onClick={() => switchTab(key)}
							className={clsx({
								['is-active']: key === activeTab,
							})}
						>
							<Icon icon={icon} /> {title}
						</button>
					);
				}
			})}
		</div>
	);
}

export default InspectorControlTabs;
