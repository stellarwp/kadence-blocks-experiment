import { TabPanel } from '@wordpress/components';
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
const getInitialTabName = (currentValue, inherited, hasGradient, hasMix) => {
	const tempValue = currentValue ? currentValue : inherited;
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
const ColorSelector = ({ handleColorChange, colors, currentValue, inherited, hasGradient, hasMix, globalClasses }) => {
	const presetButtonRef = useRef(undefined);
	const defaultTabs = [
		{
			name: 'storybook',
			title: __('Storybook', 'kadence-blocks'),
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
							/>
						);
					} else if ('mix' === tab.name) {
						return (
							<ColorMix value={currentValue} onChange={handleColorChange} globalClasses={globalClasses} />
						);
					} else {
						return (
							<ColorStorybook colors={colors} currentValue={currentValue} onChange={handleColorChange} />
						);
					}
				}
			}}
		</TabPanel>
	);
};
export default ColorSelector;
