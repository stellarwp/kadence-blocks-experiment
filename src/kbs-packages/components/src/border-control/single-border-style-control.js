import ColorControl from '../color-control';
import { __ } from '@wordpress/i18n';
import { DropdownMenu, MenuGroup, MenuItem } from '@wordpress/components';
import InputUIControl from '../radio-button-control/ui-input';
import UnitControl from '../unit-control';
import './editor.scss';

export default function SingleBorderStyleControl({
	attributes,
	setAttributes,
	attributeName,
	meta,
	previewDevice,
	currentColor,
	currentStyle,
	currentWidth,
	inheritedColor,
	inheritedStyle,
	inheritedWidth,
	onChangeColor,
	onChangeStyle,
	onChangeWidth,
	styles = ['solid', 'dashed', 'dotted', 'double'],
	max = 200,
	min = 0,
	step = 1,
	units,
}) {
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
						customOnChange={(value) => onChangeColor(value)}
						hasToggleLabel={false}
						hasTitleBar={false}
						currentValue={currentColor}
						inherited={inheritedColor ?? ''}
					/>
				</div>

				{/* Border Style Selector */}
				<div className="kbs-border-style-control__item">
					<DropdownMenu
						className="kbs-border-style-select"
						icon={styleIcons[currentStyle] ?? styleIcons.solid}
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
						<UnitControl
							value={currentWidth}
							inheritedValue={inheritedWidth}
							meta={meta}
							onChange={(size) => onChangeWidth(size)}
							placeholder={'0'}
							units={units}
							previewDevice={previewDevice}
							max={max}
							min={min}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
