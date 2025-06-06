import { TabPanel, Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useRef } from '@wordpress/element';
/**
 * Internal dependencies
 */
import { getColorOutput } from '@kadence/kbsHelpers';
import { getColorHex } from './utils';
import ColorPicker from './color-picker';
import ColorStorybook from './color-storybook';
import GradientPicker from '../gradient-control';
import ColorMix from './color-mix';
import { hoverIcon } from '../constants/icons';
const getInitialTabName = (currentValue, inherited, hasGradient, hasMix) => {
	const tempValue = currentValue ? currentValue : inherited?.inheritedValue ? inherited.inheritedValue : '';
	if (!tempValue) {
		return 'storybook';
	}
	if (
		hasGradient &&
		(tempValue.startsWith('linear-gradient') ||
			tempValue.startsWith('radial-gradient') ||
			tempValue.startsWith('conic-gradient'))
	) {
		return 'gradient';
	}
	if (hasMix && tempValue.startsWith('color-mix')) {
		return 'mix';
	}
	if (tempValue.startsWith('#')) {
		return 'custom';
	}
	return 'storybook';
};
const ColorSelector = ({
	handleColorChange,
	colors,
	currentValue,
	inherited,
	hasGradient,
	hasMix,
	globalClasses,
	hasHoverControls = false,
	isHover = false,
	onToggleHover,
}) => {
	const presetButtonRef = useRef(undefined);
	const defaultTabs = [
		{
			name: 'storybook',
			title: __('Palette', 'kadence-blocks'),
		},
		{
			name: 'custom',
			title: __('Custom', 'kadence-blocks'),
		},
	];
	if (hasGradient) {
		defaultTabs.push({
			name: 'gradient',
			title: __('Gradient', 'kadence-blocks'),
		});
	}
	if (hasMix) {
		defaultTabs.push({
			name: 'mix',
			title: __('Mix', 'kadence-blocks'),
		});
	}
	const initialTabName = getInitialTabName(currentValue, inherited, hasGradient, hasMix);
	return (
		<div className="kbs-color-selector-tab-wrapper">
			<TabPanel
				ref={presetButtonRef}
				initialTabName={initialTabName}
				className="kbs-color-select-tabs"
				activeClass="is-active"
				tabs={defaultTabs}
			>
				{(tab) => {
					if (tab.name) {
						if ('custom' === tab.name) {
							return (
								<ColorPicker
									color={getColorOutput(
										getColorHex(currentValue ? currentValue : inherited, presetButtonRef)
									)}
									onChange={handleColorChange}
								/>
							);
						} else if ('gradient' === tab.name) {
							return (
								<GradientPicker
									value={currentValue}
									onChange={handleColorChange}
									globalClasses={globalClasses}
									containerRef={presetButtonRef}
								/>
							);
						} else if ('mix' === tab.name) {
							return (
								<ColorMix
									value={currentValue}
									onChange={handleColorChange}
									globalClasses={globalClasses}
									isHover={isHover}
									inherited={inherited}
								/>
							);
						} else {
							return (
								<ColorStorybook
									colors={colors}
									currentValue={currentValue}
									onChange={handleColorChange}
								/>
							);
						}
					}
				}}
			</TabPanel>
			{hasHoverControls && onToggleHover && (
				<div className="kbs-color-selector-hover-controls">
					<Button
						icon={hoverIcon}
						className="kbs-color-selector-hover-controls-button"
						isPressed={isHover}
						onClick={onToggleHover}
						iconSize={18}
						label={isHover ? __('Switch to Normal', 'kadence-blocks') : __('Hover State', 'kadence-blocks')}
					/>
				</div>
			)}
		</div>
	);
};
export default ColorSelector;
