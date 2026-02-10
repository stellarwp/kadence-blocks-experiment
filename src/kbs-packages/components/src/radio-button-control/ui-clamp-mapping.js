/**
 * Font Size Mapping UI Component
 * Provides both simple size input and clamp() value support
 */

/**
 * WordPress dependencies
 */
import { __, _x } from '@wordpress/i18n';
import { useEffect, useState, useMemo } from '@wordpress/element';
import { ToggleControl } from '@wordpress/components';

/**
 * Internal dependencies
 */
import InputUIControl from './ui-input';
import { isClampValue, getClampOrSimpleValues, generateClampValue, parseValueAndUnit } from './utils-clamp';
import TitleBar from '../title-bar';

function UIClampMapping({ value, onChange, placeholder = '', inherited, label, previewDevice = 'Desktop' }) {
	// Parse initial values
	const initialIsClamp = isClampValue(value || inherited?.inheritedValue);
	const initialValues = getClampOrSimpleValues(value || inherited?.inheritedValue);

	// State
	const [isCustom, setIsCustom] = useState(initialIsClamp);
	const [simpleValue, setSimpleValue] = useState(initialIsClamp ? '' : value || '');
	const [mobileValue, setMobileValue] = useState(initialValues.mobile);
	const [desktopValue, setDesktopValue] = useState(initialValues.desktop);
	const [mobileViewport, setMobileViewport] = useState(initialValues.mobileViewport || 500);
	const [desktopViewport, setDesktopViewport] = useState(initialValues.desktopViewport || 1200);

	// Default units for font sizes
	const fontUnits = [
		{
			value: 'px',
			label: 'px',
			a11yLabel: __('Pixels (px)', 'kadence-blocks'),
			step: 1,
		},
		{
			value: 'rem',
			label: 'rem',
			a11yLabel: _x('rems', 'Relative to root font size (rem)', 'kadence-blocks'),
			step: 0.1,
		},
	];

	// Update values when prop changes
	useEffect(() => {
		const newIsClamp = isClampValue(value);
		const newValues = getClampOrSimpleValues(value);

		if (newIsClamp !== isCustom) {
			setIsCustom(newIsClamp);
		}

		if (newIsClamp) {
			setMobileValue(newValues.mobile);
			setDesktopValue(newValues.desktop);
			setMobileViewport(newValues.mobileViewport || 500);
			setDesktopViewport(newValues.desktopViewport || 1200);
		} else if (value !== undefined) {
			setSimpleValue(value || '');
		}
	}, [value]);

	// Handle custom toggle
	const handleCustomToggle = (newIsCustom) => {
		setIsCustom(newIsCustom);

		if (newIsCustom) {
			// Switching to custom mode
			if (simpleValue) {
				// Use simple value as both mobile and desktop initially
				setMobileValue(simpleValue);
				setDesktopValue(simpleValue);
				// Generate and emit clamp value
				const clampValue = generateClampValue(simpleValue, simpleValue, mobileViewport, desktopViewport);
				onChange(clampValue);
			} else if (!mobileValue && !desktopValue) {
				// No values set, use inherited or placeholder
				const inheritedValue = inherited?.inheritedValue || placeholder || '16px';
				setMobileValue(inheritedValue);
				setDesktopValue(inheritedValue);
			}
		} else {
			// Switching to simple mode
			// Use desktop value as the simple value (or mobile if desktop is empty)
			const newSimpleValue = desktopValue || mobileValue || '';
			setSimpleValue(newSimpleValue);
			onChange(newSimpleValue);
		}
	};

	// Handle simple value change
	const handleSimpleChange = (newValue) => {
		setSimpleValue(newValue);
		onChange(newValue);
	};

	// Handle mobile value change
	const handleMobileChange = (newValue) => {
		setMobileValue(newValue);
		// Check if the new value has a different unit type then desktop value
		const newUnit = parseValueAndUnit(newValue)?.unit;
		const desktopUnit = parseValueAndUnit(desktopValue)?.unit;
		let newDesktopValue = desktopValue;
		if (newUnit !== desktopUnit) {
			// If the new value has a different unit type then desktop value, set the desktop value to the new value
			newDesktopValue = parseValueAndUnit(desktopValue)?.value + newUnit;
			setDesktopValue(newDesktopValue);
		}
		if (newValue && desktopValue) {
			const clampValue = generateClampValue(newValue, newDesktopValue, mobileViewport, desktopViewport);
			onChange(clampValue);
		}
	};

	// Handle desktop value change
	const handleDesktopChange = (newValue) => {
		setDesktopValue(newValue);
		// Check if the new value has a different unit type then mobile value
		const newUnit = parseValueAndUnit(newValue)?.unit;
		const mobileUnit = parseValueAndUnit(mobileValue)?.unit;
		let newMobileValue = mobileValue;
		if (newUnit !== mobileUnit) {
			// If the new value has a different unit type then mobile value, set the mobile value to the new value
			newMobileValue = parseValueAndUnit(mobileValue)?.value + newUnit;
			setMobileValue(newMobileValue);
		}
		if (mobileValue && newValue) {
			const clampValue = generateClampValue(newMobileValue, newValue, mobileViewport, desktopViewport);
			onChange(clampValue);
		}
	};

	// Handle mobile viewport change
	const handleMobileViewportChange = (newValue) => {
		const numValue = parseInt(newValue) || 500;
		setMobileViewport(numValue);
		if (mobileValue && desktopValue) {
			const clampValue = generateClampValue(mobileValue, desktopValue, numValue, desktopViewport);
			onChange(clampValue);
		}
	};

	// Handle desktop viewport change
	const handleDesktopViewportChange = (newValue) => {
		const numValue = parseInt(newValue) || 1200;
		setDesktopViewport(numValue);
		if (mobileValue && desktopValue) {
			const clampValue = generateClampValue(mobileValue, desktopValue, mobileViewport, numValue);
			onChange(clampValue);
		}
	};

	const onReset = () => {
		setIsCustom(false);
		setSimpleValue('');
		setMobileValue('');
		setDesktopValue('');
		handleSimpleChange(undefined);
	};

	// Calculate placeholders
	const simplePlaceholder = useMemo(() => {
		if (inherited?.inheritedValue && !isClampValue(inherited.inheritedValue)) {
			return inherited.inheritedValue;
		}
		return placeholder || '16px';
	}, [inherited, placeholder]);

	const mobilePlaceholder = useMemo(() => {
		if (inherited?.inheritedValue) {
			const values = getClampOrSimpleValues(inherited.inheritedValue);
			return values.mobile;
		}
		return '14px';
	}, [inherited]);

	const desktopPlaceholder = useMemo(() => {
		if (inherited?.inheritedValue) {
			const values = getClampOrSimpleValues(inherited.inheritedValue);
			return values.desktop;
		}
		return '24px';
	}, [inherited]);

	return (
		<>
			{label && (
				<TitleBar
					label={label}
					reset={true}
					onReset={onReset}
					hasDeviceControls={false}
					isCustom={isCustom}
					onToggleCustom={() => handleCustomToggle(!isCustom)}
					hasCustomControls={true}
					previewDevice={previewDevice}
				/>
			)}
			<div className="kbs-font-size-mapping-control">
				{!isCustom && (
					<div className="kbs-font-size-mapping-simple">
						<InputUIControl
							value={simpleValue}
							placeholder={simplePlaceholder}
							onChange={handleSimpleChange}
							className="kbs-font-size-mapping-input"
						/>
					</div>
				)}
				{isCustom && (
					<div className="kbs-font-size-mapping-clamp-container">
						<div className="kbs-font-size-mapping-clamp">
							<div className="kbs-font-size-mapping-field">
								<div className="kbs-font-size-mapping-field-inner kbs-font-size-mapping-field-inner-font-size-mapping">
									<div className="kbs-font-size-mapping-field-label">
										{__('Size Range', 'kadence-blocks')}
									</div>
									<div className="kbs-font-size-mapping-inner-columns">
										<InputUIControl
											label={__('Minimum Size', 'kadence-blocks')}
											labelPosition="bottom"
											value={mobileValue}
											placeholder={mobilePlaceholder}
											onChange={handleMobileChange}
											units={fontUnits}
											className="kbs-font-size-mapping-input"
										/>
										<InputUIControl
											label={__('Maximum Size', 'kadence-blocks')}
											labelPosition="bottom"
											value={desktopValue}
											placeholder={desktopPlaceholder}
											onChange={handleDesktopChange}
											units={fontUnits}
											className="kbs-font-size-mapping-input"
										/>
									</div>
								</div>
							</div>

							<div className="kbs-font-size-mapping-field">
								<div className="kbs-font-size-mapping-field-inner">
									<div className="kbs-font-size-mapping-field-label">
										{__('Viewport Range', 'kadence-blocks')}
									</div>
									<div className="kbs-font-size-mapping-inner-columns">
										<InputUIControl
											label={__('Minimum viewport Width', 'kadence-blocks')}
											value={mobileViewport + 'px'}
											labelPosition="bottom"
											placeholder="500px"
											onChange={handleMobileViewportChange}
											units={[{ value: 'px', label: 'px' }]}
											className="kbs-font-size-mapping-viewport-input"
										/>
										<InputUIControl
											label={__('Maximum viewport Width', 'kadence-blocks')}
											value={desktopViewport + 'px'}
											labelPosition="bottom"
											placeholder="1200px"
											onChange={handleDesktopViewportChange}
											units={[{ value: 'px', label: 'px' }]}
											className="kbs-font-size-mapping-viewport-input"
										/>
									</div>
								</div>
							</div>
						</div>

						{mobileValue && desktopValue && (
							<div className="kbs-font-size-mapping-preview" style={{ display: 'none' }}>
								<span className="components-base-control__label">
									{__('Output:', 'kadence-blocks')}
								</span>
								<code>
									{generateClampValue(mobileValue, desktopValue, mobileViewport, desktopViewport)}
								</code>
							</div>
						)}
					</div>
				)}
			</div>
		</>
	);
}

export default UIClampMapping;
