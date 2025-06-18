import { colord, extend } from 'colord';
import mixPlugin from 'colord/plugins/mix';
import a11yPlugin from 'colord/plugins/a11y';
import harmoniesPlugin from 'colord/plugins/harmonies';

import { __ } from '@wordpress/i18n';
import { useSelect, useDispatch } from '@wordpress/data';
import { useEffect, useState } from '@wordpress/element';
import { Button, Dropdown, ColorIndicator, SVG, Path, Popover } from '@wordpress/components';
import { file, close } from '@wordpress/icons';

import {
	BLOCK_COMPONENTS,
	BackgroundPresetRender,
	TextControl,
	ColorSelect,
	RadioToggleGroupButtonUI,
} from '@kadence/kbsComponents';
import { getColorOptions, getColorOutput } from '@kadence/kbsHelpers';
import { PREBUILT_PALETTES } from './palettes';

export const colorIcon = (
	<SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
		<Path d="M7.5 15.6c-.494 0-.9.406-.9.9s.406.9.9.9.9-.406.9-.9-.406-.9-.9-.9M18.354 12l1.107-1.107a2.71 2.71 0 0 0 0-3.816l-2.547-2.538a2.71 2.71 0 0 0-3.816 0L12 5.646A2.71 2.71 0 0 0 9.3 3H5.7A2.713 2.713 0 0 0 3 5.7v12.599c0 1.481 1.219 2.7 2.7 2.7h12.599c1.481 0 2.7-1.219 2.7-2.7v-3.6a2.71 2.71 0 0 0-2.646-2.7zM10.2 18.3c0 .494-.406.9-.9.9H5.7a.904.904 0 0 1-.9-.9V5.701c0-.494.406-.9.9-.9h3.6c.494 0 .9.406.9.9zM12 8.184l2.376-2.376a.905.905 0 0 1 1.269 0L18.192 8.4a.905.905 0 0 1 0 1.269L15.6 12.261 12 15.816zM19.2 18.3c0 .494-.406.9-.9.9h-6.462a2.8 2.8 0 0 0 .153-.828l4.572-4.572H18.3c.494 0 .9.406.9.9z" />
	</SVG>
);
extend([harmoniesPlugin]);
extend([a11yPlugin]);
extend([mixPlugin]);
export default function GlobalPaletteCreator({ onToggle, setStyleBookColorPalette, customPalette, setCustomPalette }) {
	const [readable, setReadable] = useState('');
	const [trigger, setTrigger] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const [popoverAnchor, setPopoverAnchor] = useState(null);
	useEffect(() => {
		if (!customPalette.mainColor) {
			const newPalette = {
				...customPalette,
				colors: [],
			};
			setCustomPalette(newPalette);
			return;
		}
		const mainColor = colord(customPalette.mainColor);
		let darkenA = 0.2;
		let darkenB = 0.1;
		let lightenA = 0.3;
		let lightenB = 0.4;
		let isReadable = '';
		if (customPalette.isLight && !colord(customPalette.mainColor).isReadable()) {
			isReadable = __(
				'This color may be hard for people to read on light backgrounds. Consider making it darker.',
				'kadence-starter-templates'
			);
		}
		if (!customPalette.isLight && !colord(customPalette.mainColor).isReadable('#000000')) {
			isReadable = __(
				'This color may be hard for people to read on dark backgrounds. Consider making it brighter.',
				'kadence-starter-templates'
			);
		}
		let accentColor2 = customPalette.mainColor;
		let contrastColor1 = mainColor.darken(darkenA).mix('#222222', 0.8).toHex();
		let contrastColor2 = mainColor.darken(darkenA).mix('#353535', 0.8).toHex();
		let contrastColor3 = mainColor.darken(darkenB).mix('#454545', 0.8).toHex();
		let contrastColor4 = mainColor.mix('#676767', 0.8).toHex();
		let backgroundColor1 = mainColor.lighten(lightenA).mix('#eeeeee', 0.9).toHex();
		let backgroundColor2 = mainColor.lighten(lightenB).mix('#f7f7f7', 0.9).toHex();
		let backgroundColor3 = '#ffffff';
		let btnColor = '#ffffff';
		if (mainColor.isLight()) {
			btnColor = '#000000';
			accentColor2 = mainColor.lighten(0.1).toHex();
			contrastColor1 = mainColor.darken(0.5).mix('#222222', 0.8).toHex();
			contrastColor2 = mainColor.darken(0.5).mix('#353535', 0.8).toHex();
			contrastColor3 = mainColor.darken(0.3).mix('#454545', 0.8).toHex();
			contrastColor4 = mainColor.darken(0.3).mix('#676767', 0.8).toHex();
			backgroundColor1 = mainColor.lighten(0.1).mix('#eeeeee', 0.9).toHex();
			backgroundColor2 = mainColor.lighten(0.1).mix('#f7f7f7', 0.9).toHex();
		} else {
			accentColor2 = mainColor.darken(0.11).toHex();
		}
		if (!customPalette.isLight) {
			contrastColor1 = '#ffffff';
			contrastColor2 = mainColor.lighten(0.2).mix('#f7f7f7', 0.9).toHex();
			contrastColor3 = mainColor.lighten(0.1).mix('#eeeeee', 0.9).toHex();
			contrastColor4 = mainColor.lighten(0.1).mix('#cccccc', 0.9).toHex();
			backgroundColor1 = mainColor.darken(0.3).mix('#111111', 0.8).toHex();
			backgroundColor2 = mainColor.darken(0.3).mix('#222222', 0.8).toHex();
			backgroundColor3 = mainColor.darken(0.3).mix('#353535', 0.8).toHex();
		}
		if (customPalette.sat === 3) {
			contrastColor1 = colord(contrastColor1)
				.saturate(customPalette.isLight ? 0.2 : 0.2)
				.toHex();
			contrastColor2 = colord(contrastColor2)
				.saturate(customPalette.isLight ? 0.25 : 0.2)
				.toHex();
			contrastColor3 = colord(contrastColor3)
				.saturate(customPalette.isLight ? 0.25 : 0.2)
				.toHex();
			contrastColor4 = colord(contrastColor4)
				.saturate(customPalette.isLight ? 0.3 : 0.2)
				.toHex();
		}
		if (customPalette.sat === 2 && customPalette.isLight) {
			contrastColor1 = colord(contrastColor1).saturate(0.1).toHex();
			contrastColor2 = colord(contrastColor2).saturate(0.1).toHex();
			contrastColor3 = colord(contrastColor3).saturate(0.1).toHex();
			contrastColor4 = colord(contrastColor4).saturate(0.1).toHex();
		}
		if (customPalette.sat === 1) {
			contrastColor1 = colord(contrastColor1).desaturate(0.1).toHex();
			contrastColor2 = colord(contrastColor2).desaturate(0.05).toHex();
			contrastColor3 = colord(contrastColor3).desaturate(0.05).toHex();
			contrastColor4 = colord(contrastColor4).desaturate(0.05).toHex();
		}
		if (customPalette.sat === 0) {
			contrastColor1 = colord(contrastColor1).desaturate(0.5).toHex();
			contrastColor2 = colord(contrastColor2).desaturate(0.5).toHex();
			contrastColor3 = colord(contrastColor3).desaturate(0.5).toHex();
			contrastColor4 = colord(contrastColor4).desaturate(0.5).toHex();
		}
		if (customPalette.saturation === 3) {
			backgroundColor1 = colord(backgroundColor1)
				.saturate(customPalette.isLight ? 0.25 : 0.2)
				.toHex();
			backgroundColor2 = colord(backgroundColor2)
				.saturate(customPalette.isLight ? 0.35 : 0.2)
				.toHex();
			if (!customPalette.isLight) {
				backgroundColor3 = colord(backgroundColor3).saturate(0.1).toHex();
			} else {
				backgroundColor3 = colord(mainColor).lighten(0.5).mix('#fcfcfc', 0.8).toHex();
			}
		}
		if (customPalette.saturation === 2 && customPalette.isLight) {
			backgroundColor1 = colord(backgroundColor1).saturate(0.15).toHex();
			backgroundColor2 = colord(backgroundColor2).saturate(0.25).toHex();
			backgroundColor3 = colord(mainColor).lighten(0.5).mix('#fcfcfc', 0.9).toHex();
		}
		if (customPalette.saturation === 1) {
			backgroundColor1 = colord(backgroundColor1).desaturate(0.05).toHex();
			backgroundColor2 = colord(backgroundColor2).desaturate(0.05).toHex();
			if (!customPalette.isLight) {
				backgroundColor3 = colord(backgroundColor3).desaturate(0.1).toHex();
			}
		}
		if (customPalette.saturation === 0) {
			backgroundColor1 = colord(backgroundColor1).desaturate(0.5).toHex();
			backgroundColor2 = colord(backgroundColor2).desaturate(0.5).toHex();
			if (!customPalette.isLight) {
				backgroundColor3 = colord(backgroundColor3).desaturate(0.5).toHex();
			}
		}
		if (customPalette.bright === 0) {
			contrastColor1 = colord(contrastColor1).darken(0.08).toHex();
			contrastColor2 = colord(contrastColor2).darken(0.08).toHex();
			contrastColor3 = colord(contrastColor3).darken(0.08).toHex();
			contrastColor4 = colord(contrastColor4).darken(0.08).toHex();
		}
		if (customPalette.bright === 1) {
			contrastColor1 = colord(contrastColor1).darken(0.04).toHex();
			contrastColor2 = colord(contrastColor2).darken(0.04).toHex();
			contrastColor3 = colord(contrastColor3).darken(0.04).toHex();
			contrastColor4 = colord(contrastColor4).darken(0.04).toHex();
		}
		if (customPalette.bright === 3) {
			contrastColor1 = colord(contrastColor1).lighten(0.04).toHex();
			contrastColor2 = colord(contrastColor2).lighten(0.04).toHex();
			contrastColor3 = colord(contrastColor3).lighten(0.04).toHex();
			contrastColor4 = colord(contrastColor4).lighten(0.04).toHex();
		}
		if (customPalette.brightness === 0) {
			backgroundColor1 = colord(backgroundColor1).darken(0.04).toHex();
			backgroundColor2 = colord(backgroundColor2).darken(0.04).toHex();
			backgroundColor3 = colord(backgroundColor3).darken(0.08).toHex();
		}
		if (customPalette.brightness === 1) {
			backgroundColor1 = colord(backgroundColor1).darken(0.02).toHex();
			backgroundColor2 = colord(backgroundColor2).darken(0.02).toHex();
			backgroundColor3 = colord(backgroundColor3).darken(0.04).toHex();
		}
		if (customPalette.brightness === 3) {
			backgroundColor1 = colord(backgroundColor1).lighten(0.02).toHex();
			backgroundColor2 = colord(backgroundColor2).lighten(0.02).toHex();
			backgroundColor3 = colord(backgroundColor3).lighten(0.04).toHex();
		}
		const newPalette = {
			...customPalette,
			btnColor: btnColor,
			colors: [
				customPalette.mainColor,
				accentColor2,
				contrastColor1,
				contrastColor2,
				contrastColor3,
				contrastColor4,
				backgroundColor1,
				backgroundColor2,
				backgroundColor3,
			],
		};
		setCustomPalette(newPalette);
		setReadable(isReadable);
	}, [
		customPalette.mainColor,
		customPalette.isLight,
		customPalette.saturation,
		customPalette.brightness,
		customPalette.sat,
		customPalette.bright,
		trigger,
	]);
	return (
		<div className="kbs-global-palette-creator">
			<div className="kbs-global-palette-creator-inner">
				<ColorSelect
					label={__('Main Accent Color', 'kadence-starter-templates')}
					value={customPalette?.mainColor ? customPalette.mainColor : ''}
					onChange={(value) => {
						const newPalette = {
							...customPalette,
							mainColor: value,
						};
						setCustomPalette(newPalette);
						setTrigger(!trigger);
					}}
					hasMix={false}
					hasPalette={false}
					popoverProps={{
						placement: 'left-start',
						shift: true,
					}}
					colorPalette={[
						{ color: '#AA4F77' },
						{ color: '#474e2b' },
						{ color: '#0b63a9' },
						{ color: '#C04A30' },
						{ color: '#373475' },
						{ color: '#256D59' },
						{ color: '#A12C65' },
						{ color: '#2351ff' },
						{ color: '#c21c27' },
					]}
				/>
				<Button
					icon={file}
					__next40pxDefaultSize
					ref={setPopoverAnchor}
					className="kbs-advanced-controls-button kbs-custom-popover-toggle"
					onClick={() => {
						setIsOpen(true);
					}}
					isPressed={isOpen}
					variant="secondary"
					aria-expanded={isOpen}
					iconSize={18}
					label={__('View Prebuilt Palettes', 'kadence-blocks')}
				/>
				{isOpen && popoverAnchor && (
					<Popover
						anchor={popoverAnchor}
						noArrow={true}
						placement="right-start"
						shift={true}
						offset={10}
						onClose={() => {
							setIsOpen(false);
						}}
						className="kbs-popover-edit-colors-global-style"
					>
						<div className="kbs-popover-global-style-palettes">
							<h2 className="kbs-popover-add-global-style-content-title">
								{__('Prebuilt Palettes', 'kadence-blocks')}
							</h2>
							<div className="kbs-prebuilt-palettes-inner">
								{PREBUILT_PALETTES.map((palette, index) => {
									return (
										<Button
											key={index}
											className="kbs-prebuilt-palette-button"
											onClick={() => {
												const newPalette = {
													mainColor: palette.mainColor,
													isLight: palette.isLight,
													sat: palette.sat,
													bright: palette.bright,
													saturation: palette.saturation,
													brightness: palette.brightness,
													btnColor: palette.btnColor,
													colors: [],
												};
												setCustomPalette(newPalette);
												setTrigger(!trigger);
												setIsOpen(false);
											}}
										>
											{palette.colors.map((color, index) => {
												return (
													<ColorIndicator
														key={index}
														colorValue={color}
														className="kbs-custom-color-indicator"
													/>
												);
											})}
										</Button>
									);
								})}
							</div>
							<Button
								className="kbs-prebuilt-palettes-close"
								__next40pxDefaultSize
								icon={close}
								onClick={() => setIsOpen(false)}
								label={__('Close', 'kadence-blocks')}
							/>
						</div>
					</Popover>
				)}
			</div>
			{readable && <div className="kbs-color-palette_warning components-notice is-warning">{readable}</div>}
			<div className="kbs-custom-palette-wrap">
				<div className="kbs-palette">
					{customPalette?.colors && (
						<>
							{customPalette.colors.map((color, index) => {
								return (
									<ColorIndicator
										key={index}
										colorValue={color}
										data-color-value={color}
										className="kbs-custom-color-indicator"
									/>
								);
							})}
						</>
					)}
				</div>
			</div>
			{customPalette?.mainColor && (
				<>
					<div className="components-base-control kbs-control kbs-radio-control">
						<div className="components-base-control-label kbs-control-label">
							{__('Style', 'kadence-starter-templates')}
						</div>
						<div className="kbs-control-inner">
							<RadioToggleGroupButtonUI
								value={customPalette.isLight ? 'light' : 'dark'}
								onChange={(value) => {
									setCustomPalette({ ...customPalette, isLight: value === 'light' });
								}}
								controls={[
									{
										title: __('Light', 'kadence-blocks'),
										name: __('Light', 'kadence-blocks'),
										key: 'light',
									},
									{
										title: __('Dark', 'kadence-blocks'),
										name: __('Dark', 'kadence-blocks'),
										key: 'dark',
									},
								]}
							/>
						</div>
					</div>
					<div className="components-base-control kbs-control kbs-radio-control kbs-category-control">
						<div className="components-base-control-label kbs-control-label kbs-category-control-label">
							{__('Contrast Colors', 'kadence-starter-templates')}
						</div>
						<div className="kbs-control-inner kbs-category-control-inner">
							<div className="components-base-control kbs-control kbs-radio-control">
								<div className="components-base-control-label kbs-control-label">
									{__('Saturation', 'kadence-starter-templates')}
								</div>
								<div className="kbs-control-inner">
									<RadioToggleGroupButtonUI
										value={customPalette.sat}
										onChange={(value) => {
											setCustomPalette({ ...customPalette, sat: value });
										}}
										controls={[
											{
												title: __('Low', 'kadence-blocks'),
												name: '0',
												key: 0,
											},
											{
												title: __('Light', 'kadence-blocks'),
												name: '1',
												key: 1,
											},
											{
												title: __('Medium', 'kadence-blocks'),
												name: '2',
												key: 2,
											},
											{
												title: __('High', 'kadence-blocks'),
												name: '3',
												key: 3,
											},
										]}
									/>
								</div>
							</div>
							<div className="components-base-control kbs-control kbs-radio-control">
								<div className="components-base-control-label kbs-control-label">
									{__('Brightness', 'kadence-starter-templates')}
								</div>
								<div className="kbs-control-inner">
									<RadioToggleGroupButtonUI
										value={customPalette.bright}
										onChange={(value) => {
											setCustomPalette({ ...customPalette, bright: value });
										}}
										controls={[
											{
												title: __('Darkest', 'kadence-blocks'),
												name: '0',
												key: 0,
											},
											{
												title: __('Darker', 'kadence-blocks'),
												name: '1',
												key: 1,
											},
											{
												title: __('Normal', 'kadence-blocks'),
												name: '2',
												key: 2,
											},
											{
												title: __('Lighter', 'kadence-blocks'),
												name: '3',
												key: 3,
											},
										]}
									/>
								</div>
							</div>
						</div>
					</div>
					<div className="components-base-control kbs-control kbs-radio-control kbs-category-control">
						<div className="components-base-control-label kbs-control-label kbs-category-control-label">
							{__('Background Colors', 'kadence-starter-templates')}
						</div>

						<div className="kbs-control-inner kbs-category-control-inner">
							<div className="components-base-control kbs-control kbs-radio-control">
								<div className="components-base-control-label kbs-control-label">
									{__('Saturation', 'kadence-starter-templates')}
								</div>
								<div className="kbs-control-inner">
									<RadioToggleGroupButtonUI
										value={customPalette.saturation}
										onChange={(value) => {
											setCustomPalette({ ...customPalette, saturation: value });
										}}
										controls={[
											{
												title: __('Low', 'kadence-blocks'),
												name: '0',
												key: 0,
											},
											{
												title: __('Light', 'kadence-blocks'),
												name: '1',
												key: 1,
											},
											{
												title: __('Medium', 'kadence-blocks'),
												name: '2',
												key: 2,
											},
											{
												title: __('High', 'kadence-blocks'),
												name: '3',
												key: 3,
											},
										]}
									/>
								</div>
							</div>
							<div className="components-base-control kbs-control kbs-radio-control">
								<div className="components-base-control-label kbs-control-label">
									{__('Brightness', 'kadence-starter-templates')}
								</div>
								<div className="kbs-control-inner">
									<RadioToggleGroupButtonUI
										value={customPalette.brightness}
										onChange={(value) => {
											setCustomPalette({ ...customPalette, brightness: value });
										}}
										controls={[
											{
												title: __('Darkest', 'kadence-blocks'),
												name: '0',
												key: 0,
											},
											{
												title: __('Darker', 'kadence-blocks'),
												name: '1',
												key: 1,
											},
											{
												title: __('Normal', 'kadence-blocks'),
												name: '2',
												key: 2,
											},
											{
												title: __('Lighter', 'kadence-blocks'),
												name: '3',
												key: 3,
											},
										]}
									/>
								</div>
							</div>
						</div>
					</div>
				</>
			)}
			<div className="kbs-palette-controls-btns-wrap">
				<Button
					__next40pxDefaultSize
					variant="primary"
					disabled={!customPalette?.mainColor}
					onClick={() => {
						setStyleBookColorPalette(customPalette);
						onToggle();
					}}
				>
					{__('Apply Palette', 'kadence-blocks')}
				</Button>
				<Button __next40pxDefaultSize onClick={onToggle}>
					{__('Cancel', 'kadence-blocks')}
				</Button>
			</div>
		</div>
	);
}
