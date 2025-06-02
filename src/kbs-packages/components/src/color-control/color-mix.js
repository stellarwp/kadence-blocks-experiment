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
		return ['', '', ''];
	}
	if (value.startsWith('color-mix')) {
		// Parse color-mix string like: color-mix(in srgb, var(--kbs-colors-palette1), black 90%)
		const match = value.match(/color-mix\(in\s+srgb,\s*([^,]+),\s*([^\s]+)\s+(\d+)%\)/);
		if (match) {
			return [match[1].trim(), match[2].trim(), match[3] + '%'];
		}
		return ['', 'black', '50%'];
	}
	return [getColorOutput(value), 'black', '50%'];
};
const ColorMix = ({ onChange, value, globalClasses, isHover, inherited }) => {
	const [color, type, mix] = getColorMixValues(value);
	const [inheritedColor, inheritedType, inheritedMix] = getColorMixValues(inherited?.inheritedValue);
	console.log(inheritedColor, inheritedType, inheritedMix);
	console.log(color, type, mix);
	return (
		<div className="kbs-color-mix-control">
			<ColorSelect
				label={__('Color', 'kadence-blocks')}
				isHover={isHover}
				value={color}
				inherited={{ inheritedValue: inheritedColor }}
				onChange={(value) =>
					onChange(
						`color-mix(in srgb, ${getColorOutput(value)}, ${type ? type : inheritedType ? inheritedType : 'black'} ${mix ? mix : inheritedMix ? inheritedMix : '50%'})`
					)
				}
				globalClasses={globalClasses}
				hasGradient={false}
				hasMix={false}
			/>
			{(color || inheritedColor) && (
				<>
					<RadioButtonSelect
						label={__('Mix Type', 'kadence-blocks')}
						isHover={isHover}
						inherited={{ inheritedValue: inheritedType }}
						value={type}
						type={'color-mix'}
						view={'normal'}
						hasCustomControls={false}
						onChange={(value) => {
							if (!value) {
								onChange(
									`color-mix(in srgb, ${color ? color : inheritedColor}, ${inheritedType ? inheritedType : 'black'} ${mix ? mix : inheritedMix ? inheritedMix : '50%'})`
								);
							} else {
								onChange(
									`color-mix(in srgb, ${color ? color : inheritedColor}, ${value} ${mix ? mix : inheritedMix ? inheritedMix : '50%'})`
								);
							}
						}}
					/>
					<RadioButtonSelect
						label={__('Mix Amount', 'kadence-blocks')}
						type={'mix'}
						value={mix}
						isHover={isHover}
						inherited={{ inheritedValue: inheritedMix }}
						onChange={(value) => {
							if (!value) {
								onChange(
									`color-mix(in srgb, ${color ? color : inheritedColor}, ${type ? type : inheritedType ? inheritedType : 'black'} 0%)`
								);
							} else {
								onChange(
									`color-mix(in srgb, ${color ? color : inheritedColor}, ${type ? type : inheritedType ? inheritedType : 'black'} ${value})`
								);
							}
						}}
						units={[{ value: '%', label: '%' }]}
						placeholder={50}
						min={0}
						max={100}
						step={1}
					/>
				</>
			)}
		</div>
	);
};
export default ColorMix;
