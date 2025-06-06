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
import { patternIcon } from '../constants/icons';
import TitleBar from '../title-bar';
import './editor.scss';

export function PopoverPatternRender({ pattern, className }) {
	const style = {};
	if (pattern?.background) {
		style.background = pattern.background;
	}
	if (pattern?.['background-image']) {
		style.backgroundImage = pattern['background-image'];
	}
	if (pattern?.['background-size']) {
		style.backgroundSize = pattern['background-size'];
	}
	if (pattern?.['background-position']) {
		style.backgroundPosition = pattern['background-position'];
	}
	return <div className={clsx('kbs-popover-background-select-control-style', className)} style={style} />;
}

export function PopoverDropdown({ patterns, value, onChange, previewDevice, type }) {
	return ({ onToggle, isOpen }) => {
		const handlePatternChange = (update) => {
			onChange(update, previewDevice, type);
			if (!value) {
				onToggle();
			}
		};
		return (
			<div className="kbs-popover-background-select-control kbs-popover-background-select-control__dropdown-content-inner">
				<div className="kbs-popover-background-select-control__dropdown-content-items">
					{patterns.map((pattern) => (
						<Button
							key={pattern.value}
							label={pattern.label}
							isPressed={pattern.value === value}
							className={`kbs-radio-popover-select-control-button`}
							onClick={() => handlePatternChange(pattern.value)}
						>
							<PopoverPatternRender pattern={pattern} />
						</Button>
					))}
				</div>
				<div className="kbs-popover-background-select-control__dropdown-content-close">
					<Button __next40pxDefaultSize onClick={onToggle}>
						<Icon icon={closeIcon} size={24} />
					</Button>
				</div>
			</div>
		);
	};
}
export function PopoverToggle({ value, patterns, inherited, type }) {
	return ({ onToggle, isOpen }) => {
		const presetButtonRef = useRef(undefined);

		const toggleProps = {
			onClick: onToggle,
			className: clsx(
				'kbs-popover-background-select-button',
				'kbs-popover-background-select-control__toggle-button',
				{
					'is-open': isOpen,
					'is-selected': value,
					'is-inherited': !value && inherited,
				}
			),
			'aria-expanded': isOpen,
			ref: presetButtonRef,
		};
		const currentItem = useMemo(() => {
			if (value) {
				return patterns.find((pattern) => pattern.value === value);
			}
			if (inherited) {
				return patterns.find((pattern) => pattern.value === inherited);
			}
			return {};
		}, [inherited, value]);
		const icon = useMemo(() => {
			if (type === 'color') {
				return colorIcon;
			}
			if (type === 'pattern') {
				return patternIcon;
			}
			return null;
		}, [type]);
		return (
			<>
				<Button __next40pxDefaultSize {...toggleProps}>
					<Icon className="kbs-popover-background-select-control__toggle-icon" icon={icon} size={24} />
					<span className="kbs-popover-background-select-control__toggle-label">
						{value ? currentItem?.label : __('Select Pattern', 'kadence-blocks')}
					</span>
				</Button>
				{value && currentItem && (
					<div className="kbs-color-select-control__toggle-preview">
						<PopoverPatternRender pattern={currentItem} />
					</div>
				)}
			</>
		);
	};
}

export default function PopoverSelect({
	type,
	reset = true,
	label,
	previewDevice = 'desktop',
	defaultValue = undefined,
	globalClasses,
	patterns = [],
	onChange,
	value,
	patternColor = undefined,
	patternBackground = undefined,
	inherited = undefined,
}) {
	const popoverProps = {
		placement: 'left-start',
		//offset: 36,
		shift: true,
	};

	const onReset = () => {
		let resetValue = undefined;
		if (defaultValue) {
			resetValue = defaultValue;
		}
		onChange(resetValue, 'all', type);
	};
	const classes = clsx('kbs-popover-background-select-control__dropdown-content', globalClasses);
	return (
		<div className={`components-base-control kbs-control kbs-popover-background-select-control`}>
			{label && <TitleBar label={label} reset={reset} onReset={onReset} />}
			<div className="kbs-control-inner">
				<Dropdown
					popoverProps={popoverProps}
					className={clsx('kbs-popover-background-select-control__dropdown', {
						'has-pattern-value': value || inherited,
					})}
					contentClassName={classes}
					renderToggle={PopoverToggle({
						value: value,
						patterns: patterns,
						type: type,
						inherited: inherited,
						patternColor: patternColor,
						patternBackground: patternBackground,
					})}
					renderContent={PopoverDropdown({
						patterns: patterns,
						value: value,
						onChange: onChange,
						previewDevice: previewDevice,
						type: type,
						patternColor: patternColor,
						patternBackground: patternBackground,
					})}
				/>
			</div>
		</div>
	);
}
