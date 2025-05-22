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

const ColorSelector = ({ handleColorChange, colors, currentValue, inherited }) => {
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
	return (
		<TabPanel ref={presetButtonRef} className="kbs-color-select-tabs" activeClass="is-active" tabs={defaultTabs}>
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
