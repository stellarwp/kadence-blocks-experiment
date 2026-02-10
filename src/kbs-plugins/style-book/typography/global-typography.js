import { __ } from '@wordpress/i18n';
import { useSelect, useDispatch } from '@wordpress/data';
import { useEffect, useState, useRef, useMemo } from '@wordpress/element';
import { Button, Dropdown, ColorIndicator, SVG, Path, Popover } from '@wordpress/components';
import { plus } from '@wordpress/icons';

import { BLOCK_COMPONENTS, BackgroundPresetRender, TextControl, ColorSelect } from '@kadence/kbsComponents';
import {
	getColorOptions,
	getColorOutput,
	getGradientOptions,
	getFontSizeLabel,
	getPresetOptions,
	getLineHeightOutput,
	getFontSizeOutput,
	getLetterSpacingOutput,
	getDeviceValue,
} from '@kadence/kbsHelpers';

import './editor.scss';

export const typographyIcon = (
	<SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
		<Path d="M437.69-180v-515h-217.3v-85H740v85H522.69v515z" />
	</SVG>
);

const getStylebookSettingValue = (tempAttributes, baseAttributes, attributeName, device, type) => {
	// eslint-disable-next-line @wordpress/no-unused-vars-before-return
	const deviceOptions = window?.kbs_params?.responsive_device_options || [];
	// eslint-disable-next-line @wordpress/no-unused-vars-before-return
	const currentDeviceIndex = deviceOptions.findIndex(
		(option) =>
			option.key?.toLowerCase() === device?.toLowerCase() || option.name?.toLowerCase() === device?.toLowerCase()
	);
	// Check if there's a direct value on the block (highest priority)
	const directValue = getDeviceValue(attributeName, tempAttributes, device, type);
	if (directValue) {
		return directValue;
	}

	if (device !== 'none') {
		// Check direct value from parent device
		for (let i = currentDeviceIndex - 1; i >= 0; i--) {
			const parentDevice = deviceOptions[i];
			const parentDeviceName = parentDevice.key || parentDevice.name;

			const parentValue = getDeviceValue(attributeName, tempAttributes, parentDeviceName, type);
			if (parentValue) {
				return parentValue;
			}
		}
	}
	const baseValue = getDeviceValue(attributeName, baseAttributes, device, type);
	if (baseValue) {
		return baseValue;
	}
	if (device !== 'none') {
		// Check direct value from parent device
		for (let i = currentDeviceIndex - 1; i >= 0; i--) {
			const parentDevice = deviceOptions[i];
			const parentDeviceName = parentDevice.key || parentDevice.name;

			const parentValue = getDeviceValue(attributeName, baseAttributes, parentDeviceName, type);
			if (parentValue) {
				return parentValue;
			}
		}
	}
	return undefined;
};
/**
 * Build the component preset
 */
export default function GlobalTypography(props) {
	const {
		setStyleBookAttributes,
		setSelectedComponent,
		globalStyleId,
		currentPreset,
		previewDevice,
		isFontPairingCreatorOpen,
		setIsFontPairingCreatorOpen,
	} = props;

	const { styleBookLocalGlobalStyles } = useSelect((select) => {
		return {
			styleBookLocalGlobalStyles: select('kadenceblocks/global-styles').getStyleBookLocalGlobalStyles(),
		};
	});

	const tempTypography = styleBookLocalGlobalStyles?.[globalStyleId]?.components?.typography?.presets || [];
	const baseTypography = styleBookLocalGlobalStyles?.['kbs-base']?.components?.typography?.presets || [];
	//console.log(tempTypography);
	const globalTypography = getPresetOptions('typography');

	// const setStyleBookColorPalette = (colorPalette) => {
	// 	setStyleBookComponentMappingByStyleId(globalStyleId, 'colors', 'palette1', colorPalette.colors?.[0]);
	// 	setStyleBookComponentMappingByStyleId(globalStyleId, 'colors', 'palette2', colorPalette.colors?.[1]);
	// 	setStyleBookComponentMappingByStyleId(globalStyleId, 'colors', 'palette-complement', colorPalette.colors?.[2]);
	// 	setStyleBookComponentMappingByStyleId(globalStyleId, 'colors', 'palette3', colorPalette.colors?.[3]);
	// 	setStyleBookComponentMappingByStyleId(globalStyleId, 'colors', 'palette4', colorPalette.colors?.[4]);
	// 	setStyleBookComponentMappingByStyleId(globalStyleId, 'colors', 'palette5', colorPalette.colors?.[5]);
	// 	setStyleBookComponentMappingByStyleId(globalStyleId, 'colors', 'palette6', colorPalette.colors?.[6]);
	// 	setStyleBookComponentMappingByStyleId(globalStyleId, 'colors', 'palette7', colorPalette.colors?.[7]);
	// 	setStyleBookComponentMappingByStyleId(globalStyleId, 'colors', 'palette8', colorPalette.colors?.[8]);
	// 	setStyleBookComponentMappingByStyleId(globalStyleId, 'colors', 'palette9', colorPalette.colors?.[9]);
	// 	setNeedsSave(true);
	// };
	const [popoverAnchor, setPopoverAnchor] = useState(null);

	return (
		<div className="kbs-typography-mapping-wrap">
			<div className="kbs-typography-mapping kbs-preset-control kbs-control">
				<div className="kbs-storybook-section-header kbs-typography-mapping-header">
					<div className="kbs-storybook-header-title kbs-typography-mapping-header-title">
						<div className="kbs-storybook-header-title-subtab-wrap">
							<div className="kbs-storybook-header-title-title">{__('Typography', 'kadence-blocks')}</div>
						</div>
					</div>
					<div className="kbs-popover-add-global-style">
						{/* TODO: Add back in when we have a way to edit the typography pairing */}
						{/* <Button
							icon={typographyIcon}
							ref={setPopoverAnchor}
							className="kbs-advanced-controls-button kbs-custom-popover-toggle"
							onClick={() => {
								setIsFontPairingCreatorOpen(true);
							}}
							isPressed={isFontPairingCreatorOpen}
							variant="secondary"
							aria-expanded={isFontPairingCreatorOpen}
							iconSize={18}
							text={__('Edit Typography Pairing', 'kadence-blocks')}
						/> */}
					</div>
					{isFontPairingCreatorOpen && popoverAnchor && (
						<Popover
							anchor={popoverAnchor}
							noArrow={true}
							placement="left-start"
							shift={true}
							offset={10}
							onClose={() => {
								setIsFontPairingCreatorOpen(false);
							}}
							className="kbs-popover-edit-typography-global-style"
						>
							<div className="kbs-popover-add-global-style-content">
								<h2 className="kbs-popover-add-global-style-content-title">
									{__('Font Pairing Editor', 'kadence-blocks')}
								</h2>
							</div>
						</Popover>
					)}
				</div>
				<div className="kbs-control-inner kbs-typography-mapping-grid">
					{globalTypography.map((item, index) => {
						const fontFamily = getStylebookSettingValue(
							{ typography: tempTypography?.[item.value]?.attributes },
							{ typography: baseTypography?.[item.value]?.attributes },
							'typography',
							previewDevice,
							'fontFamily'
						);
						const fontSize = getStylebookSettingValue(
							{ typography: tempTypography?.[item.value]?.attributes },
							{ typography: baseTypography?.[item.value]?.attributes },
							'typography',
							previewDevice,
							'fontSize'
						);
						const fontWeight = getStylebookSettingValue(
							{ typography: tempTypography?.[item.value]?.attributes },
							{ typography: baseTypography?.[item.value]?.attributes },
							'typography',
							previewDevice,
							'fontWeight'
						);
						const fontStyle = getStylebookSettingValue(
							{ typography: tempTypography?.[item.value]?.attributes },
							{ typography: baseTypography?.[item.value]?.attributes },
							'typography',
							previewDevice,
							'fontStyle'
						);
						const fontColor = getStylebookSettingValue(
							{ typography: tempTypography?.[item.value]?.attributes },
							{ typography: baseTypography?.[item.value]?.attributes },
							'typography',
							previewDevice,
							'color'
						);
						const backgroundColor = getStylebookSettingValue(
							{ typography: tempTypography?.[item.value]?.attributes },
							{ typography: baseTypography?.[item.value]?.attributes },
							'typography',
							previewDevice,
							'backgroundColor'
						);
						const fontLetterSpacing = getStylebookSettingValue(
							{ typography: tempTypography?.[item.value]?.attributes },
							{ typography: baseTypography?.[item.value]?.attributes },
							'typography',
							previewDevice,
							'letterSpacing'
						);
						const fontLineHeight = getStylebookSettingValue(
							{ typography: tempTypography?.[item.value]?.attributes },
							{ typography: baseTypography?.[item.value]?.attributes },
							'typography',
							previewDevice,
							'lineHeight'
						);
						const fontTextTransform = getStylebookSettingValue(
							{ typography: tempTypography?.[item.value]?.attributes },
							{ typography: baseTypography?.[item.value]?.attributes },
							'typography',
							previewDevice,
							'textTransform'
						);
						let fontFamilyLabel = fontFamily ? fontFamily : __('Unset', 'kadence-blocks');
						if (fontFamilyLabel === 'var(--kbs-font-family-heading)') {
							fontFamilyLabel = __('Heading Font Family', 'kadence-blocks');
						} else if (fontFamilyLabel === 'var(--kbs-font-family-body)') {
							fontFamilyLabel = __('Body Font Family', 'kadence-blocks');
						}
						return (
							<Button
								key={index}
								onClick={() => {
									setSelectedComponent('typography');
									setStyleBookAttributes({
										components: { typography: { selectedPreset: item.value } },
									});
								}}
								isPressed={item.value === currentPreset}
								className="kbs-typography-control-btn"
							>
								<div className="kbs-typography-control-inner-info">
									<div className="kbs-typography-control-label-wrap">
										<div className="kbs-typography-control-label">{item.label}</div>
										<ColorIndicator
											colorValue={getColorOutput(fontColor)}
											className="kbs-typography-control-color-indicator"
										/>
									</div>
									<div className="kbs-typography-control-meta">
										<div className="kbs-typography-control-family">{fontFamilyLabel}</div>
										<span className="kbs-typography-control-size-divider">/</span>
										<div className="kbs-typography-control-size">
											<span className="kbs-typography-control-size-value">
												{getFontSizeLabel(fontSize) || __('Unset', 'kadence-blocks')}
											</span>
											<span className="kbs-typography-control-size-divider">/</span>
											<span className="kbs-typography-control-weight-value">
												{fontWeight || __('Unset', 'kadence-blocks')}
											</span>
										</div>
									</div>
								</div>
								<div
									className="kbs-typography-control-preview"
									style={{
										fontFamily,
										fontWeight,
										letterSpacing: getLetterSpacingOutput(fontLetterSpacing),
										fontSize: getFontSizeOutput(fontSize),
										lineHeight: getLineHeightOutput(fontLineHeight),
										fontStyle,
										color: getColorOutput(fontColor),
										textTransform: fontTextTransform,
										backgroundColor: getColorOutput(backgroundColor),
									}}
								>
									{__(
										'Visualize your font styles. Design is not just what it looks like and feels like. Design is how it works.',
										'kadence-blocks'
									)}
								</div>
							</Button>
						);
					})}
				</div>
			</div>
		</div>
	);
}
