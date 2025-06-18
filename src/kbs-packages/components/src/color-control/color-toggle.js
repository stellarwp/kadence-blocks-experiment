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
import { getColorLabel } from './utils';

export default function ColorToggle({
	currentValue,
	inherited,
	colors,
	gradients = [],
	hasToggleLabel = true,
	useGlobalPalette = false,
}) {
	return ({ onToggle, isOpen }) => {
		const presetButtonRef = useRef(undefined);

		const toggleProps = {
			onClick: onToggle,
			className: clsx('kbs-color-select-button', 'kbs-color-select-control__toggle-button', {
				'is-open': isOpen,
				'is-selected': currentValue,
				'is-inherited': !currentValue && inherited,
			}),
			'aria-expanded': isOpen,
			ref: presetButtonRef,
		};
		const isPaletteColor = useMemo(() => {
			return (
				(currentValue && currentValue.startsWith('palette')) || (inherited && inherited.startsWith('palette'))
			);
		}, [currentValue, inherited]);
		const displayValue = useMemo(() => {
			if (currentValue) {
				return currentValue;
			}
			return inherited;
		}, [inherited, currentValue]);
		const previewColorString = useMemo(() => {
			if (displayValue) {
				return getColorOutput(displayValue);
			}
			return '';
		}, [displayValue]);
		return (
			<>
				<Button __next40pxDefaultSize {...toggleProps}>
					{hasToggleLabel && isPaletteColor && (
						<Icon className="kbs-color-select-control__toggle-icon" icon={colorIcon} size={24} />
					)}
					{hasToggleLabel && (
						<span className="kbs-color-select-control__toggle-label">
							{displayValue
								? getColorLabel(displayValue, colors, gradients)
								: __('Unset', 'kadence-blocks')}
						</span>
					)}
					<CoreColorIndicator
						className="kbs-color-select-control__toggle-preview"
						colorValue={previewColorString}
					/>
				</Button>
			</>
		);
	};
}
