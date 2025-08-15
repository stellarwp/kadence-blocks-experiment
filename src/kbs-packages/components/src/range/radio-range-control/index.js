/**
 * Radio Range Control Component for Kadence Blocks
 */
import { __ } from '@wordpress/i18n';
import { settings } from '@wordpress/icons';
import {
	Button,
	ButtonGroup,
	Flex,
	FlexItem,
	SelectControl,
	__experimentalNumberControl as NumberControl,
} from '@wordpress/components';
import './editor.scss';

/**
 * Build the Radio Range Control
 *
 * @param {Object} props Component props.
 * @return {JSX.Element} Radio Range control.
 */
export default function RadioRangeControl({
	value = '',
	inheritedValue = '',
	label,
	onChange,
	isSelected = false,
	className = '',
	options = [],
	appliedValue = '',
	disableCustomSizes = false,
	units = [],
}) {
	const unitOptions = units.map((unit) => ({ label: unit, value: unit }));
	const displayNumericInput = !isNaN(parseInt(appliedValue[0])) && appliedValue !== 'xxl' && appliedValue !== '3xl';
	const { unit: existingUnit, number: existingNumber } = getValueAndUnit(appliedValue);

	const { min, max, step } = getRangeSettings(existingUnit);

	const onChangeManual = (value, unit) => {
		if (value === '') {
			onChange('');
		} else {
			onChange(value + unit);
		}
	};

	return (
		<div className={`components-base-control kbs-radio-range-control${className ? ' ' + className : ''}`}>
			{label && (
				<Flex justify="space-between" className={'kbs-radio-range__header'}>
					<FlexItem>
						<label className="components-base-control__label">{label}</label>
					</FlexItem>
				</Flex>
			)}
			<div className={'kbs-controls-content'}>
				{displayNumericInput && (
					<div className="kbs-numeric-input">
						<Flex className={'kbs-radio-range__header'}>
							<FlexItem>
								<NumberControl
									style={{ width: '170px' }}
									value={existingNumber}
									onChange={(value) => onChangeManual(value, existingUnit)}
									min={min}
									max={max}
									step={step}
								/>
							</FlexItem>
							<FlexItem>
								<SelectControl
									value={existingUnit}
									onChange={(value) => onChangeManual(existingNumber, value)}
									options={unitOptions}
								/>
							</FlexItem>
						</Flex>
					</div>
				)}
				{!displayNumericInput && (
					<ButtonGroup className="kbs-radio-container-control">
						{options.map((option, index) => (
							<Button
								key={`${option.label}-${option.value}-${index}`}
								variant="secondary"
								className={`kbs-radio-item radio-${option.value} kbs-radio-btn-outline ${option.value === value ? 'is-selected' : ''} ${!value && inheritedValue === option.value ? 'is-inherited' : ''}`}
								isPressed={isSelected}
								icon={option.icon !== undefined ? option.icon : undefined}
								aria-pressed={isSelected}
								onClick={() => {
									onChange(option.value);
								}}
							>
								{option.label}
							</Button>
						))}
						{!disableCustomSizes && (
							<Button
								className={'kbs-radio-item radio-custom only-icon kbs-radio-btn-outline'}
								label={__('Set custom size', 'kadence-blocks')}
								icon={settings}
								onClick={() => onChange('15px')}
								isPressed={false}
								variant="secondary"
							/>
						)}
					</ButtonGroup>
				)}
			</div>
		</div>
	);
}
function getValueAndUnit(value) {
	if (!value) {
		return { unit: 'px', number: '15' };
	}

	// Match the numeric part and the unit part
	const matches = value.match(/^(\d*\.?\d*)(.*)$/);

	if (matches) {
		const number = matches[1] || '15';
		const unit = matches[2] || 'px';
		return { unit, number };
	}

	return { unit: 'px', number: '15' };
}

function getRangeSettings(unit) {
	const min = 0;
	const max = unit === 'rem' ? 10 : 100;
	const step = 1;

	return { min, max, step };
}
