/**
 * External dependencies
 */
import clsx from 'clsx';
/**
 * WordPress dependencies
 */
import {
	Icon,
	Dropdown,
	ColorIndicator as CoreColorIndicator,
	Button,
	HStack,
	FlexItem,
	TabPanel,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useRef, useMemo, useEffect } from '@wordpress/element';
import { color as colorIcon, check as checkIcon, close as closeIcon } from '@wordpress/icons';
import { useSettings } from '@wordpress/block-editor';
/**
 * Internal dependencies
 */
import {
	getColorOutput,
	getColorOptions,
	getDeviceValue,
	getInheritedDeviceValue,
	handleAttributeChange,
} from '@kadence/kbsHelpers';
import TitleBar from '../title-bar';
import ColorSelector from './color-selector';
import ColorToggle from './color-toggle';
import { getColorLabel } from './utils';

function ColorDropdownContent({
	colors,
	currentValue,
	inherited,
	onChange,
	previewDevice,
	type,
	hasGradient,
	hasMix,
	hasOKLch,
	globalStylesCss,
	onToggle,
	isOpen,
	hasPalette,
	hasCustomColors = true,
	hasGradientPalette = true,
}) {
	const handleColorChange = (color) => {
		onChange(color, previewDevice, type);
	};
	const divRef = useRef(null);
	useEffect(() => {
		if (divRef.current) {
			if (globalStylesCss) {
				divRef.current.setAttribute('style', globalStylesCss);
			} else {
				divRef.current.removeAttribute('style');
			}
		}
	}, [globalStylesCss, isOpen, divRef?.current]);
	return (
		<div className="kbs-color-control kbs-color-select-control__dropdown-content-inner" ref={divRef}>
			<ColorSelector
				handleColorChange={handleColorChange}
				colors={colors}
				currentValue={currentValue}
				inherited={inherited}
				hasGradient={hasGradient}
				hasMix={hasMix}
				hasOKLch={hasOKLch}
				globalStylesCss={globalStylesCss}
				hasPalette={hasPalette}
				hasCustomColors={hasCustomColors}
				hasGradientPalette={hasGradientPalette}
			/>
			<div className="kbs-color-select-control__dropdown-content-close">
				<Button __next40pxDefaultSize onClick={onToggle}>
					<Icon icon={closeIcon} size={24} />
				</Button>
			</div>
		</div>
	);
}
export default function ColorDropdown({
	colors,
	currentValue,
	inherited,
	onChange,
	previewDevice,
	type,
	hasGradient,
	hasMix,
	hasOKLch,
	globalStylesCss,
	hasPalette,
	hasGradientPalette = true,
	hasCustomColors = true,
}) {
	return ({ onToggle, isOpen }) => {
		return (
			<ColorDropdownContent
				colors={colors}
				currentValue={currentValue}
				inherited={inherited}
				onChange={onChange}
				previewDevice={previewDevice}
				type={type}
				hasGradient={hasGradient}
				hasMix={hasMix}
				hasOKLch={hasOKLch}
				globalStylesCss={globalStylesCss}
				onToggle={onToggle}
				isOpen={isOpen}
				hasPalette={hasPalette}
				hasCustomColors={hasCustomColors}
				hasGradientPalette={hasGradientPalette}
			/>
		);
	};
}
