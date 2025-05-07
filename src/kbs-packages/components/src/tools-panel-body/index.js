/**
 * External dependencies
 */
import { get } from 'lodash';
import clsx from 'clsx';
/**
 * WordPress dependencies
 */
import { PanelRow, Button, PanelBody, Panel, Icon, DropdownMenu, MenuGroup, MenuItem } from '@wordpress/components';
import { useReducedMotion, useMergeRefs } from '@wordpress/compose';
import { forwardRef, useRef } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import { getComponentView } from '@kadence/kbs-helpers';
import { moreVertical, check, chevronUp, chevronDown } from '@wordpress/icons';
import { speak } from '@wordpress/a11y';
import { __ } from '@wordpress/i18n';
import DeviceSwitchControl from '../device-switch-control';

/**
 * Internal dependencies
 */
import { useUpdateEffect } from '@kadence/kbs-helpers';
import './editor.scss';

const proSvg = (
	<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" style={{ paddingTop: '1px' }}>
		<rect width="20" height="16" fill="#0073e6" rx="3" ry="3"></rect>
		<text x="50%" y="57%" fontSize="9" textAnchor="middle" color={'#fff'}>
			Pro
		</text>
	</svg>
);

const PanelBodyTitle = forwardRef(
	(
		{
			isOpened,
			onToggle,
			icon,
			title,
			hasViewControls,
			currentView,
			hasDeviceControls,
			onSelectView,
			onResetAll,
			canResetAll = true,
			buttonProps = {},
			componentName,
		},
		ref
	) => {
		if (!title) {
			return null;
		}
		// TODO: Decide later if we want to pursue Component View settings and implement or fully remove.
		// const currentView = getComponentView( componentName );
		// const tools = [
		// 	{
		// 		label: __( 'Preset Only', 'kadence-blocks' ),
		// 		value: 'preset',
		// 	},
		// 	{
		// 		label: __( 'Normal', 'kadence-blocks' ),
		// 		value: 'normal',
		// 	},
		// 	{
		// 		label: __( 'Advanced', 'kadence-blocks' ),
		// 		value: 'advanced',
		// 	},
		// ]
		const viewControls = [
			{
				label: __('Normal', 'kadence-blocks'),
				value: 'normal',
			},
			{
				label: __('Advanced', 'kadence-blocks'),
				value: 'advanced',
			},
		];
		const isAdvancedView = hasViewControls && currentView === 'advanced';
		const viewControl = (onClose) => (
			<MenuGroup label={__('Component View', 'kadence-blocks')}>
				{viewControls.map((control, index) => {
					const isSelected = control?.value === currentView;
					const label = control?.label;
					return (
						<MenuItem
							key={index}
							icon={isSelected ? check : null}
							isSelected={isSelected}
							disabled={isSelected}
							label={label}
							onClick={() => {
								if (!isSelected) {
									speak(
										sprintf(
											// translators: %s: The name of the control being reset e.g. "Padding".
											__('%s is now the active view'),
											label
										),
										'assertive'
									);
									onSelectView(control?.value);
									onClose();
								}
							}}
							role="menuitemcheckbox"
						>
							{label}
						</MenuItem>
					);
				})}
			</MenuGroup>
		);
		const classes = clsx('components-panel__body-title kbs-tools-panel-body-title', {
			'kbs-has-device-controls': hasDeviceControls,
			'kbs-has-view-controls': hasViewControls,
			'kbs-full-expanded-padding': hasDeviceControls && hasViewControls,
			'kbs-expanded-padding': hasDeviceControls || hasViewControls,
		});
		return (
			<h2 className={classes}>
				<Button
					__next40pxDefaultSize
					className="components-panel__body-toggle"
					aria-expanded={isOpened}
					onClick={() => {
						console.log('toggleOpened', componentName);
						onToggle();
					}}
					ref={ref}
					{...buttonProps}
				>
					{/*
					Firefox + NVDA don't announce aria-expanded because the browser
					repaints the whole element, so this wrapping span hides that.
				*/}
					<span aria-hidden="true">
						<Icon className="components-panel__arrow" icon={isOpened ? chevronUp : chevronDown} />
					</span>
					{title}
					{icon && <Icon icon={icon} className="components-panel__icon" size={20} />}
				</Button>
				<span className="kbs-tools-panel-body__tools">
					{hasDeviceControls && <DeviceSwitchControl compact={true} />}
					<DropdownMenu
						icon={moreVertical}
						className={`kbs-tools-panel-body__tools-dropdown ${isAdvancedView ? 'kbs-tools-panel-body__tools-dropdown-advanced' : ''}`}
						label="Component Settings"
					>
						{({ onClose }) => (
							<>
								{hasViewControls && viewControl(onClose)}
								<MenuGroup label={__('Reset Component Settings', 'kadence-blocks')}>
									<MenuItem
										disabled={!canResetAll}
										variant="tertiary"
										onClick={() => {
											if (canResetAll) {
												onResetAll();
												speak(__('All component options reset'), 'assertive');
												onClose();
											}
										}}
									>
										{__('Reset Settings')}
									</MenuItem>
								</MenuGroup>
							</>
						)}
					</DropdownMenu>
				</span>
			</h2>
		);
	}
);

export function UnforwardedToolsPanelBody(props, ref) {
	const {
		children,
		title,
		className = '',
		buttonProps = {},
		proTag = false,
		initialOpen = true,
		componentName,
		panelName,
		resetAll,
		setAttributes,
		attributeName,
		canResetAll = true,
		hasDeviceControls = true,
		hasViewControls = false,
		onSelectView,
		currentView = 'normal',
		scrollAfterOpen = true,
	} = props;

	const index = get(props, ['index'], '');
	const selectedBlockClientId = useSelect((select) => select('core/block-editor').getSelectedBlockClientId(), []);

	const isOpened = useSelect(
		(select) =>
			select('kadenceblocks/data').isEditorPanelOpened(panelName + index + selectedBlockClientId, initialOpen),
		[panelName, index, selectedBlockClientId, initialOpen]
	);

	const { toggleEditorPanelOpened } = useDispatch('kadenceblocks/data');

	const toggleOpened = () => {
		toggleEditorPanelOpened(panelName + index + selectedBlockClientId, initialOpen);
	};
	// Defaults to 'smooth' scrolling
	// https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView
	const scrollBehavior = useReducedMotion() ? 'auto' : 'smooth';
	const onResetAll = () => {
		if (typeof resetAll === 'function') {
			resetAll();
		} else if (setAttributes && attributeName) {
			setAttributes({ [attributeName]: undefined });
		}
	};
	const scrollAfterOpenRef = useRef();
	scrollAfterOpenRef.current = scrollAfterOpen;
	const nodeRef = useRef();

	// Runs after initial render.
	useUpdateEffect(() => {
		if (isOpened && scrollAfterOpenRef.current && nodeRef.current?.scrollIntoView) {
			/*
			 * Scrolls the content into view when visible.
			 * This improves the UX when there are multiple stacking <PanelBody />
			 * components in a scrollable container.
			 */
			nodeRef.current.scrollIntoView({
				inline: 'nearest',
				block: 'nearest',
				behavior: scrollBehavior,
			});
		}
	}, [isOpened, scrollBehavior]);

	const classes = clsx('components-panel__body kbs-tools-panel-body', className, {
		'is-opened': isOpened,
		[`kbs-panel-${panelName}`]: panelName,
	});
	return (
		<div className={classes} ref={useMergeRefs([nodeRef, ref])}>
			<PanelBodyTitle
				isOpened={isOpened}
				onToggle={toggleOpened}
				buttonProps={buttonProps}
				title={title}
				hasViewControls={hasViewControls}
				currentView={currentView}
				hasDeviceControls={hasDeviceControls}
				canResetAll={canResetAll}
				onSelectView={onSelectView}
				onResetAll={onResetAll}
				componentName={componentName}
				icon={proTag ? proSvg : null}
			/>
			{isOpened && children}
		</div>
	);
}

const ToolsPanelBody = forwardRef(UnforwardedToolsPanelBody);
export default ToolsPanelBody;
