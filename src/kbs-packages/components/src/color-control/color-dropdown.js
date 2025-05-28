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
import { useRef, useMemo } from '@wordpress/element';
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

export default function ColorDropdown({ colors, currentValue, inherited, onChange, previewDevice, type }) {
	return ({ onToggle, isOpen }) => {
		const handleColorChange = (color) => {
			onChange(color, previewDevice, type);
		};
		return (
			<div className="kbs-color-control kbs-color-select-control__dropdown-content-inner">
				<ColorSelector
					handleColorChange={handleColorChange}
					colors={colors}
					currentValue={currentValue}
					inherited={inherited}
				/>
				<div className="kbs-color-select-control__dropdown-content-close">
					<Button __next40pxDefaultSize onClick={onToggle}>
						<Icon icon={closeIcon} size={24} />
					</Button>
				</div>
			</div>
		);
	};
}
