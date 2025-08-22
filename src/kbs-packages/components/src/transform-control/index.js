/**
 * Transform Control Component
 */

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import ToolsPanelBody from '../tools-panel-body';
import './editor.scss';
import { getResolvedValue, handleAttributeChange } from '@kadence/kbsHelpers';
import { TabPanel } from '@wordpress/components';

import { scaleIcon, translateIcon, rotateIcon, skewIcon, originIcon } from './constants';
import TransformScale from './transform-scale';
import TransformTranslate from './transform-translate';
import TransformRotate from './transform-rotate';
import TransformSkew from './transform-skew';
import TransformOrigin from './transform-origin';

/**
 * Build the Transform control
 */
export default function TransformControl(props) {
	const {
		label = __('Transform', 'kadence-blocks'),
		attributes,
		setAttributes,
		previewDevice,
		customOnChange,
		meta,
		attributeName = 'transform',
		panelName = 'transform',
		componentName = 'transform-control',
		globalStylesIds = {},
		hasHoverControls = false,
	} = props;

	const [activeTab, setActiveTab] = useState('scale');
	const [isHover, setIsHover] = useState(false);

	// {
	// 	type: 'scale',
	// 	scale: { x: 1, y: 1 },
	// 	translate: { x: '0px', y: '0px', z: '0px' },
	// 	rotate: { x: '0deg', y: '0deg', z: '0deg' },
	// 	skew: { x: '0deg', y: '0deg' },
	// 	origin: { x: '50%', y: '50%' }
	// }

	const onToggleHover = () => {
		setIsHover(!isHover);
	};

	const onReset = () => {
		const resetValue = '';
		onChange(resetValue, 'all');
	};
	const onChange = (value, device) => {
		const currentAttributeName = isHover ? `${attributeName}Hover` : attributeName;
		handleAttributeChange(
			value,
			device,
			currentAttributeName,
			attributes,
			setAttributes,
			customOnChange,
			'transform',
			meta
		);
	};

	const tabs = [
		{
			name: 'scale',
			title: __('Scale', 'kadence-blocks'),
			icon: scaleIcon,
			className: 'kadence-transform-tab-scale',
		},
		{
			name: 'translate',
			title: __('Translate', 'kadence-blocks'),
			icon: translateIcon,
			className: 'kadence-transform-tab-translate',
		},
		{
			name: 'rotate',
			title: __('Rotate', 'kadence-blocks'),
			icon: rotateIcon,
			className: 'kadence-transform-tab-rotate',
		},
		{
			name: 'skew',
			title: __('Skew', 'kadence-blocks'),
			icon: skewIcon,
			className: 'kadence-transform-tab-skew',
		},
		{
			name: 'origin',
			title: __('Origin', 'kadence-blocks'),
			icon: originIcon,
			className: 'kadence-transform-tab-origin',
		},
	];

	const renderTabContent = (tab) => {
		const currentAttributeName = isHover ? `${attributeName}Hover` : attributeName;
		const tabResolvedValue = getResolvedValue(
			currentAttributeName,
			attributes,
			previewDevice,
			meta,
			tab.name,
			globalStylesIds
		);

		switch (tab.name) {
			case 'scale':
				return (
					<TransformScale
						resolvedValues={tabResolvedValue}
						onChange={(value) => onChange({ scale: value }, previewDevice)}
						isHover={isHover}
						{...props}
					/>
				);
			case 'translate':
				return (
					<TransformTranslate
						resolvedValues={tabResolvedValue}
						onChange={(value) => onChange({ translate: value }, previewDevice)}
						isHover={isHover}
						{...props}
					/>
				);
			case 'rotate':
				return (
					<TransformRotate
						resolvedValues={tabResolvedValue}
						onChange={(value) => onChange({ rotate: value }, previewDevice)}
						isHover={isHover}
						{...props}
					/>
				);
			case 'skew':
				return (
					<TransformSkew
						resolvedValues={tabResolvedValue}
						onChange={(value) => onChange({ skew: value }, previewDevice)}
						isHover={isHover}
						{...props}
					/>
				);
			case 'origin':
				return (
					<TransformOrigin
						resolvedValues={tabResolvedValue}
						onChange={(value) => onChange({ origin: value }, previewDevice)}
						isHover={isHover}
						{...props}
					/>
				);
			default:
				return null;
		}
	};

	return (
		<ToolsPanelBody
			title={label}
			panelName={panelName}
			componentName={componentName}
			initialOpen={false}
			hasHoverControls={hasHoverControls}
			isHover={isHover}
			onToggleHover={onToggleHover}
		>
			<TabPanel
				className="kadence-transform-tabs"
				activeClass="is-active"
				initialTabName={activeTab}
				onSelect={(tabName) => {
					setActiveTab(tabName);
				}}
				tabs={tabs}
			>
				{(tab) => renderTabContent(tab)}
			</TabPanel>
		</ToolsPanelBody>
	);
}
