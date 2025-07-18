import { TabPanel, Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useRef, useMemo } from '@wordpress/element';
/**
 * Internal dependencies
 */
import { getColorOutput } from '@kadence/kbsHelpers';
import { getColorHex } from './utils';
import ColorPicker from './color-picker';
import ColorStorybook from './color-storybook';
import GradientPicker from '../gradient-control';
import ColorUnifiedMix from './color-unified-mix';
import { hoverIcon } from '../constants/icons';
const getInitialTabName = (currentValue, inherited, hasGradient, hasMix, hasPalette = true) => {
	const tempValue = currentValue ? currentValue : inherited?.inheritedValue ? inherited.inheritedValue : '';
	if (!tempValue) {
		return hasPalette ? 'storybook' : 'custom';
	}
	if (
		hasGradient &&
		(tempValue.startsWith('linear-gradient') ||
			tempValue.startsWith('radial-gradient') ||
			tempValue.startsWith('conic-gradient'))
	) {
		return 'gradient';
	}
	// Both color-mix and oklch now go to the unified mix tab
	if (hasMix && (tempValue.startsWith('color-mix') || tempValue.startsWith('oklch'))) {
		return 'mix';
	}
	if (tempValue.startsWith('#')) {
		return 'custom';
	}
	return hasPalette ? 'storybook' : 'custom';
};
const ColorSelector = ({
	handleColorChange,
	colors,
	currentValue,
	inherited,
	hasGradient = false,
	hasMix = true,
	globalClasses,
	hasHoverControls = false,
	isHover = false,
	onToggleHover,
	globalStylesCss,
	hasPalette = true,
	hasCustomColors = true,
	hasGradientPalette = true,
}) => {
	const presetButtonRef = useRef(undefined);
	const defaultTabs = useMemo(() => {
		const tempTabs = [
			{
				name: 'storybook',
				title: __('Palette', 'kadence-blocks'),
			},
			{
				name: 'custom',
				title: __('Custom', 'kadence-blocks'),
			},
		];
		if (!hasPalette) {
			tempTabs.splice(0, 1);
			if (!hasCustomColors) {
				tempTabs.splice(0, 1);
			}
		} else if (!hasCustomColors) {
			tempTabs.splice(1, 1);
		}
		if (hasGradient) {
			tempTabs.push({ name: 'gradient', title: __('Gradient', 'kadence-blocks') });
		}
		// Unified mix tab for both color-mix and OKLch
		if (hasMix) {
			tempTabs.push({ name: 'mix', title: __('Mix', 'kadence-blocks') });
		}
		return tempTabs;
	}, [hasGradient, hasMix]);
	const initialTabName = getInitialTabName(currentValue, inherited, hasGradient, hasMix, hasPalette);
	return (
		<div className="kbs-color-selector-tab-wrapper">
			<TabPanel
				ref={presetButtonRef}
				initialTabName={defaultTabs.length === 1 ? defaultTabs[0].name : initialTabName}
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
									globalStylesCss={globalStylesCss}
									hasGradientPalette={hasGradientPalette}
								/>
							);
						} else if ('mix' === tab.name) {
							return (
								<ColorUnifiedMix
									value={currentValue}
									onChange={handleColorChange}
									globalClasses={globalClasses}
									isHover={isHover}
									inherited={inherited}
									globalStylesCss={globalStylesCss}
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
