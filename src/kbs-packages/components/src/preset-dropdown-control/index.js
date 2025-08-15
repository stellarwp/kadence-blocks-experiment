/**
 * WordPress dependencies
 */
import clsx from 'clsx';
import { Icon, Dropdown, DropdownContentWrapper, Button, HStack, FlexItem } from '@wordpress/components';
import { compose } from '@wordpress/compose';
import { useSelect, select } from '@wordpress/data';
import { showSettings } from '@kadence/helpers';
import { get } from 'lodash';
import { __ } from '@wordpress/i18n';
import { useRef, useEffect } from '@wordpress/element';
import { shadow as shadowIcon, check, reset } from '@wordpress/icons';
import { useSelectOptions } from '../select-control/helpers';
import { store as blockEditorStore } from '@wordpress/block-editor';

import './editor.scss';

function renderPresetToggle(presetType, presetValue, onClear) {
	return ({ onToggle, isOpen }) => {
		const presetButtonRef = useRef(undefined);

		const toggleProps = {
			onClick: onToggle,
			className: clsx({ 'is-open': isOpen }),
			'aria-expanded': isOpen,
			ref: presetButtonRef,
		};

		const removeButtonProps = {
			onClick: () => {
				if (isOpen) {
					onToggle();
				}
				onClear();
				// Return focus to parent button.
				presetButtonRef.current?.focus();
			},
			className: clsx('kbs-preset-select-control__remove-button', { 'is-open': isOpen }),
			label: __('Remove', 'kadence-blocks'),
		};

		return (
			<>
				<Button __next40pxDefaultSize {...toggleProps}>
					<HStack justify="flex-start">
						<Icon className="kbs-preset-select-control__toggle-icon" icon={shadowIcon} size={24} />
						<FlexItem>{__('Preset', 'kadence-blocks')}</FlexItem>
					</HStack>
				</Button>
				{!!presetValue && <Button __next40pxDefaultSize size="small" icon={reset} {...removeButtonProps} />}
			</>
		);
	};
}

const getPresets = (presetType) => {
	switch (presetType) {
		case 'background':
			return [
				{
					value: 'kbs-bg-base',
					label: 'Base',
				},
				{
					value: 'kbs-bg-variant-1',
					label: 'Variant 1',
				},
				{
					value: 'kbs-bg-variant-2',
					label: 'Variant 2',
				},
			];
		default:
			return [];
	}
};
export default function PresetDropdownControl({
	attributes,
	setAttributes,
	attributeName,
	meta,
	previewDevice,
	globalStylesIds,
	forStyleBook = false,
}) {
	const popoverProps = {
		placement: 'left-start',
		offset: 36,
		shift: true,
	};
	const presetType = meta?.attributes?.[attributeName]?.component ? meta?.attributes?.[attributeName]?.component : '';
	const attributeMeta = meta?.attributes?.[attributeName];
	if (!presetType) {
		return null;
	}
	const presetValue = attributes?.[attributeName]?.preset;
	const onClear = () => {
		setAttributes({
			[attributeName]: {
				preset: undefined,
			},
		});
	};

	// Fetch available presets
	const presets = getPresets(presetType);
	console.log(presets);
	return (
		<Dropdown
			popoverProps={popoverProps}
			className="kbs-preset-select-control__dropdown"
			//renderToggle={ renderPresetToggle( presetType, presetValue, onClear ) }
			renderToggle={({ isOpen, onToggle }) => (
				<Button variant="primary" onClick={onToggle} aria-expanded={isOpen}>
					Toggle Popover!
				</Button>
			)}
			renderContent={() => (
				<div className="kbs-preset-select-control__dropdown-content">
					{presets.map((option) => (
						<Button
							key={option.value}
							onClick={() =>
								setAttributes({
									[attributeName]: {
										preset: option.value,
									},
								})
							}
						>
							{option.label}
						</Button>
					))}
				</div>
			)}
		/>
	);
}
