/**
 * Border Style Control Component
 * This component is used to control the border style, width and color properties.
 */
import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import { DropdownMenu, MenuGroup, MenuItem } from '@wordpress/components';
import { getDeviceValue, getInheritedDeviceValue, handleAttributeChange } from '@kadence/kbsHelpers';
import TitleBar from '../title-bar';
import ColorControl from '../color-control';
import InputUIControl from '../radio-button-control/ui-input';
import './editor.scss';

export default function BorderStyleControl({
	label,
	attributes,
	setAttributes,
	attributeName,
	meta,
	previewDevice = 'desktop',
	hasCustomControls = true,
	hasAdvancedControls = true,
	styles = ['solid', 'dashed', 'dotted', 'double'],
	max = 200,
	min = 0,
	step = 1,
	view = 'default',
	reset = true,
	hasDeviceControls = false,
	globalStylesIds,
}) {
	const [isAdvanced, setIsAdvanced] = useState(view === 'advanced');

	//Border Style is advanced if any of style, width or color is not the same for all corners.
	const isAdvancedOption = (color, style, width) => {
		if (Array.isArray(color) && color.length > 0) {
			const firstItem = color[0];
			if (!color.every((item) => item === firstItem)) {
				return true;
			}
		}
		if (Array.isArray(style) && style.length > 0) {
			const firstItem = style[0];
			if (!style.every((item) => item === firstItem)) {
				return true;
			}
		}
		if (Array.isArray(width) && width.length > 0) {
			const firstItem = width[0];
			if (!width.every((item) => item === firstItem)) {
				return true;
			}
		}
		return false;
	};

	// Extract individual border properties
	const currentWidth = getDeviceValue(attributeName, attributes, previewDevice, 'width') || ['', '', '', ''];
	const currentStyle = getDeviceValue(attributeName, attributes, previewDevice, 'style') || ['', '', '', ''];
	const currentColor = getDeviceValue(attributeName, attributes, previewDevice, 'color') || ['', '', '', ''];
	const inheritedWidth = getInheritedDeviceValue(
		attributeName,
		attributes,
		previewDevice,
		meta,
		'width',
		globalStylesIds
	);
	const inheritedStyle = getInheritedDeviceValue(
		attributeName,
		attributes,
		previewDevice,
		meta,
		'style',
		globalStylesIds
	);
	const inheritedColor = getInheritedDeviceValue(
		attributeName,
		attributes,
		previewDevice,
		meta,
		'color',
		globalStylesIds
	);

	useEffect(() => {
		if (view !== 'advanced' && currentWidth) {
			setIsAdvanced(isAdvancedOption(currentColor, currentStyle, currentWidth));
		} else if (view === 'advanced' && !isAdvanced) {
			setIsAdvanced(true);
		} else if (view !== 'advanced' && isAdvanced) {
			setIsAdvanced(false);
		}
	}, [view]);

	useEffect(() => {
		if (!isAdvanced && currentWidth) {
			setIsAdvanced(isAdvancedOption(currentColor, currentStyle, currentWidth));
		}
	}, [currentWidth]);

	const onChange = (value, device, type) => {
		handleAttributeChange(value, device, attributeName, attributes, setAttributes, undefined, type, meta);
	};

	const onChangeColor = (color) => {
		const newValue = [color, color, color, color];
		onChange(newValue, previewDevice, 'color');
	};

	const onChangeStyle = (style) => {
		const newValue = [style, style, style, style];
		onChange(newValue, previewDevice, 'style');
	};

	const onChangeWidth = (width) => {
		const newValue = [width, width, width, width];
		onChange(newValue, previewDevice, 'width');
	};

	const onReset = () => {
		let resetValue = undefined;
		if (defaultValue) {
			resetValue = defaultValue;
		}
		onChange(resetValue, previewDevice === 'desktop' ? 'all' : previewDevice, 'border');
	};

	const styleIcons = {
		solid: (
			<svg
				width="16"
				height="16"
				xmlns="http://www.w3.org/2000/svg"
				fillRule="evenodd"
				strokeLinejoin="round"
				strokeMiterlimit="2"
				clipRule="evenodd"
				viewBox="0 0 20 20"
			>
				<path d="M18.988 11.478V8.522H1.012v2.956h17.976z"></path>
			</svg>
		),
		dashed: (
			<svg
				width="16"
				height="16"
				xmlns="http://www.w3.org/2000/svg"
				fillRule="evenodd"
				strokeLinejoin="round"
				strokeMiterlimit="2"
				clipRule="evenodd"
				viewBox="0 0 20 20"
			>
				<path d="M12.512 11.478V8.522H7.488v2.956h5.024zM14.004 8.522v2.956h4.984V8.522h-4.984zM1.012 8.522v2.956H6.05V8.522H1.012z"></path>
			</svg>
		),
		dotted: (
			<svg
				width="16"
				height="16"
				xmlns="http://www.w3.org/2000/svg"
				fillRule="evenodd"
				strokeLinejoin="round"
				strokeMiterlimit="2"
				clipRule="evenodd"
				viewBox="0 0 20 20"
			>
				<circle cx="2.503" cy="10" r="1.487"></circle>
				<circle cx="17.486" cy="10" r="1.487"></circle>
				<circle cx="12.447" cy="10" r="1.487"></circle>
				<circle cx="7.455" cy="10" r="1.487"></circle>
			</svg>
		),
		double: (
			<svg
				width="16"
				height="16"
				xmlns="http://www.w3.org/2000/svg"
				fillRule="evenodd"
				strokeLinejoin="round"
				strokeMiterlimit="2"
				clipRule="evenodd"
				viewBox="0 0 20 20"
			>
				<path d="M1.02 6.561v2.957h17.968V6.561H1.02zM1.012 10.586v2.956H18.98v-2.956H1.012z"></path>
			</svg>
		),
	};

	const styleLabels = {
		solid: __('Solid', 'kadence-blocks'),
		dashed: __('Dashed', 'kadence-blocks'),
		dotted: __('Dotted', 'kadence-blocks'),
		double: __('Double', 'kadence-blocks'),
	};

	return (
		<div className="components-base-control kbs-border-style-control">
			<TitleBar
				label={label}
				reset={reset}
				onReset={onReset}
				hasDeviceControls={hasDeviceControls}
				isAdvanced={isAdvanced}
				onToggleView={() => setIsAdvanced(!isAdvanced)}
				hasAdvancedControls={true}
				hasCustomControls={false}
			/>
			<div className="kbs-border-style-control__content">
				<div className="kbs-border-style-control__row">
					{/* Color Indicator */}
					<div className="kbs-border-style-control__item">
						<ColorControl
							attributes={attributes}
							setAttributes={setAttributes}
							attributeName={attributeName}
							meta={meta}
							previewDevice={previewDevice}
							label=""
							reset={false}
							hasDeviceControls={false}
							hasCustomControls={hasCustomControls}
							hasAdvancedControls={hasAdvancedControls}
							customOnChange={(value) => onChangeColor(value)}
							hasToggleLabel={false}
							hasTitleBar={false}
							currentValue={currentColor[0]}
							inherited={inheritedColor[0] ?? ''}
						/>
					</div>

					{/* Border Style Selector */}
					<div className="kbs-border-style-control__item">
						<DropdownMenu
							className="kbs-border-style-select"
							icon={styleIcons[currentStyle[0]]}
							label={__('Border Style', 'kadence-blocks')}
							popoverProps={{
								className: 'kbs-border-style-select__popover',
								placement: 'bottom',
							}}
						>
							{({ onClose }) => (
								<MenuGroup>
									{styles.map((style) => (
										<MenuItem
											key={style}
											icon={styleIcons[style]}
											onClick={() => {
												onClose();
												onChangeStyle(style);
											}}
											label={styleLabels[style]}
										/>
									))}
								</MenuGroup>
							)}
						</DropdownMenu>
					</div>

					{/* Width Input Control */}
					<div className="kbs-border-style-control__item">
						<div className="kbs-border-width-control">
							<InputUIControl
								className="kbs-border-width-input"
								value={currentWidth[0]}
								placeholder="0"
								onChange={(value) => onChangeWidth(value)}
								min={min}
								max={max}
								step={step}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
