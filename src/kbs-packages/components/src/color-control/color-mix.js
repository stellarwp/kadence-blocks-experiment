import { Button } from '@wordpress/components';
import clsx from 'clsx';
import { __ } from '@wordpress/i18n';
import { __experimentalUnitControl as UnitControl, RangeControl, Flex, FlexItem } from '@wordpress/components';
/**
 * Internal dependencies
 */
import { getColorOutput } from '@kadence/kbsHelpers';
import ColorSelect from './color-select';
import RadioButtonSelect from '../radio-button-control/radio-button-select';
import { getColorLabel } from './utils';

const getColorMixValues = (value) => {
	if (!value) {
		return ['var(--kbs-colors-palette1)', 'black', '50%'];
	}
	if (value.startsWith('color-mix')) {
		// Parse color-mix string like: color-mix(in srgb, var(--kbs-colors-palette1), black 90%)
		const match = value.match(/color-mix\(in\s+srgb,\s*([^,]+),\s*([^\s]+)\s+(\d+)%\)/);
		if (match) {
			return [match[1].trim(), match[2].trim(), match[3] + '%'];
		}
		return ['var(--kbs-colors-palette1)', 'black', '50%'];
	}
	return [getColorOutput(value), 'black', '50%'];
};
const ColorMix = ({ onChange, value, globalClasses }) => {
	const [color, type, mix] = getColorMixValues(value);
	return (
		<div className="kbs-color-mix-control">
			<ColorSelect
				label={__('Color', 'kadence-blocks')}
				value={color}
				onChange={(value) => onChange(`color-mix(in srgb, ${getColorOutput(value)}, ${type} ${mix})`)}
				globalClasses={globalClasses}
				hasGradient={false}
				hasMix={false}
			/>
			<RadioButtonSelect
				label={__('Mix Type', 'kadence-blocks')}
				value={type}
				type={'color-mix'}
				inherited={{ inheritedValue: 'black' }}
				view={'normal'}
				hasCustomControls={false}
				onChange={(value) => {
					if (!value) {
						onChange(`color-mix(in srgb, ${color}, black ${mix})`);
					} else {
						onChange(`color-mix(in srgb, ${color}, ${value} ${mix})`);
					}
				}}
			/>
			<RadioButtonSelect
				label={__('Mix Amount', 'kadence-blocks')}
				type={'mix'}
				value={mix}
				onChange={(value) => {
					if (!value) {
						onChange(`color-mix(in srgb, ${color}, ${type} 0%)`);
					} else {
						onChange(`color-mix(in srgb, ${color}, ${type} ${value})`);
					}
				}}
				units={[{ value: '%', label: '%' }]}
				placeholder={50}
				min={0}
				max={100}
				step={1}
			/>
		</div>
	);
};
export default ColorMix;
