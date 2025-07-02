import clsx from 'clsx';
/**
 * WordPress dependencies
 */
import { __, _x } from '@wordpress/i18n';
import { Dropdown, Button, ResizableBox, RangeControl } from '@wordpress/components';
import { useEffect, useState, useMemo, useRef, useCallback } from '@wordpress/element';
/**
 * Internal dependencies.
 */
import RadioToggleGroupButtonUI from './ui-toggle-group';
import InputUIControl from './ui-input';
import { parseValueTypeFromRawValue } from './utils';

function RangeTitleWrapper({ label, activeControl, controls, onChange }) {
	// const startIndex = useRef(activeControl);
	// const [isResizing, setIsResizing] = useState(false);
	// const DRAG_THRESHOLD = 16; // 16 pixels per control change

	// const handleResize = useCallback(
	// 	(event, direction, element, delta) => {
	// 		console.log('handleResize', direction, element, delta);

	// 		const deltaX = delta.width;
	// 		const controlChanges = Math.floor(Math.abs(deltaX) / DRAG_THRESHOLD);
	// 		if (controlChanges > 0) {
	// 			let newIndex;

	// 			if (deltaX > 0) {
	// 				// Dragging right - move forward by the number of changes
	// 				newIndex = activeControl + controlChanges;
	// 			} else {
	// 				// Dragging left - move backward by the number of changes
	// 				newIndex = activeControl - controlChanges;
	// 			}

	// 			// Update the value
	// 			startIndex.current = newIndex;
	// 			if (activeControl !== newIndex) {
	// 				onChange(controls[newIndex].key);
	// 			}
	// 		}
	// 	},
	// 	[controls, onChange]
	// );

	// const resizableBoxProps = useMemo(
	// 	() => ({
	// 		minWidth: '0',
	// 		handleClasses: {
	// 			right: 'kbs-radio-button-control__drag-handle',
	// 			left: 'kbs-radio-button-control__drag-handle',
	// 		},
	// 		grid: [DRAG_THRESHOLD, 1],
	// 		snap: {
	// 			x: controls.map((_, index) => index * DRAG_THRESHOLD),
	// 		},
	// 		snapGap: 16,
	// 		enable: {
	// 			top: false,
	// 			bottom: false,
	// 			topRight: false,
	// 			bottomRight: false,
	// 			bottomLeft: false,
	// 			topLeft: false,
	// 			right: true,
	// 			left: false,
	// 		},
	// 	}),
	// 	[controls, DRAG_THRESHOLD]
	// );

	return (
		<div className={clsx('kbs-radio-button-control__toggle-group-input-title-wrapper')}>
			<div className="kbs-radio-button-control__toggle-group-input-title">{label}</div>
			{/* <ResizableBox
				{...resizableBoxProps}
				onResize={handleResize}
				onResizeStart={() => setIsResizing(true)}
				onResizeStop={() => setIsResizing(false)}
				size={{ width: startIndex.current * DRAG_THRESHOLD, height: 'auto' }}
				className="kbs-radio-button-control__toggle-group-input-title-wrapper-inner"
				title={__('Drag left/right to change value', 'kadence-blocks')}
			>
				<div className="kbs-visual-spinner-drag-wrapper">
					<div className="kbs-visual-spinner-drag-handle"></div>
				</div>
			</ResizableBox> */}
			<RangeControl
				label={undefined}
				beforeIcon={undefined}
				className={clsx('kbs-range-control kbs-input-control components-spacing-drag-control')}
				__next40pxDefaultSize={true}
				__nextHasNoMarginBottom={true}
				value={activeControl}
				onChange={(newVal) => {
					if (undefined === newVal) {
						onChange(undefined);
					} else {
						onChange(controls[newVal].key);
					}
				}}
				marks={controls.map((control, index) => ({
					value: index,
					label: undefined,
				}))}
				min={0}
				max={controls.length - 1}
				step={1}
				help={undefined}
				withInputField={false}
				aria-valuenow={activeControl}
				aria-valuetext={''}
				renderTooltipContent={() => ''}
				initialPosition={0}
				allowReset={false}
				hideLabelFromVision={true}
				onMouseDown={(event) => {
					// If mouse down is near start of range set initial value to 0, which
					// prevents the user have to drag right then left to get 0 setting.
					if (event?.nativeEvent?.offsetX < 35) {
						if (activeControl === undefined) {
							onChange(0);
						}
					}
				}}
			/>
		</div>
	);
}

function RadioToggleGroupPopoverInputUI({
	value,
	onChange,
	inherited,
	controls = [],
	label = __('Gap', 'kadence-blocks'),
	isCustom = false,
	labelPosition = 'top',
	parentLabel = '',
	units = [
		{
			value: 'px',
			label: 'px',
			a11yLabel: __('Pixels (px)', 'kadence-blocks'),
			step: 0.1,
		},
		{
			value: '%',
			label: '%',
			a11yLabel: __('Percent (%)', 'kadence-blocks'),
			step: 0.1,
		},
		{
			value: 'em',
			label: 'em',
			a11yLabel: _x('ems', 'Relative to parent font size (em)', 'kadence-blocks'),
			step: 0.01,
		},
		{
			value: 'rem',
			label: 'rem',
			a11yLabel: _x('rems', 'Relative to root font size (rem)', 'kadence-blocks'),
			step: 0.01,
		},
		{
			value: 'vw',
			label: 'vw',
			a11yLabel: __('Viewport width (vw)', 'kadence-blocks'),
			step: 0.1,
		},
		{
			value: 'vh',
			label: 'vh',
			a11yLabel: __('Viewport height (vh)', 'kadence-blocks'),
			step: 0.1,
		},
		{
			value: 'custom',
			label: 'custom',
			a11yLabel: __('Custom', 'kadence-blocks'),
			step: 0.1,
		},
	],
}) {
	const defaultPopoverProps = {
		placement: 'left-start',
		//offset: 36,
		shift: true,
	};
	const isValueControlled = useMemo(() => parseValueTypeFromRawValue(value, controls), [value]);
	const isValueSet = useMemo(() => value || value === 0, [value]);
	const previewValue = useMemo(() => {
		if (value || value === 0) {
			return value;
		}
		return inherited?.inheritedValue;
	}, [value, inherited]);
	const activeControl =
		previewValue || previewValue === 0 ? controls.findIndex((control) => control.key === previewValue) : undefined;

	const customTooltipContent = (newValue) => {
		return controls[newValue]?.name;
	};
	const setInitialValue = () => {
		if (activeControl === undefined) {
			onChange(0);
		}
	};
	let rangeLabel = parentLabel + ' ' + label + ' ' + __('Unset', 'kadence-blocks');
	if (controls?.[activeControl]?.name) {
		rangeLabel = parentLabel + ' ' + label + ' ' + controls[activeControl]?.name;
	}
	const marks = useMemo(
		() =>
			controls.map((control, index) => ({
				value: index,
				label: undefined,
			})),
		[controls]
	);
	return (
		<div
			key={label}
			className={clsx(
				'kbs-radio-button-control__toggle-group-input',
				`kbs-radio-button-control-popover-${String(label).toLowerCase()}`
			)}
		>
			{!isCustom && (
				<Dropdown
					popoverProps={defaultPopoverProps}
					className="kbs-radio-button-control__toggle-group-input"
					contentClassName="kbs-radio-button-control__toggle-group-input-content"
					renderToggle={({ isOpen, onToggle }) => (
						<>
							<RangeTitleWrapper
								label={label}
								activeControl={activeControl}
								controls={controls}
								onChange={onChange}
							/>
							<div className="kbs-radio-button-popup-toggle">
								<Button
									__next40pxDefaultSize
									onClick={onToggle}
									aria-expanded={isOpen}
									className={clsx(
										'kbs-radio-button-popup-toggle-button',
										isValueSet && 'value-is-set',
										!isValueSet && controls?.[activeControl]?.name && 'value-is-inherited'
									)}
								>
									{controls[activeControl]?.name || __('Unset', 'kadence-blocks')}
								</Button>
							</div>
						</>
					)}
					renderContent={({ isOpen, onToggle }) => (
						<>
							<div className="kbs-radio-button-control__toggle-group-input-content-inner kbs-control">
								<RangeControl
									label={rangeLabel ? rangeLabel : undefined}
									beforeIcon={undefined}
									className={clsx(
										'kbs-range-control kbs-input-control components-spacing-sizes-control__range-control',
										(!value || value === 0) && inherited?.inheritedValue && 'kbs-inherited'
									)}
									__next40pxDefaultSize={true}
									__nextHasNoMarginBottom={true}
									value={activeControl}
									onChange={(newVal) => {
										console.log(newVal);
										if (undefined === newVal) {
											onChange(undefined);
										} else {
											onChange(controls[newVal].key);
										}
									}}
									min={0}
									max={controls.length - 1}
									marks={marks}
									step={1}
									help={undefined}
									withInputField={false}
									aria-valuenow={activeControl}
									aria-valuetext={controls[activeControl]?.name}
									renderTooltipContent={customTooltipContent}
									initialPosition={0}
									allowReset={true}
									hideLabelFromVision={false}
									onMouseDown={(event) => {
										// If mouse down is near start of range set initial value to 0, which
										// prevents the user have to drag right then left to get 0 setting.
										if (event?.nativeEvent?.offsetX < 35) {
											setInitialValue();
										}
									}}
								/>
							</div>
						</>
					)}
				/>
			)}
			{isCustom && (
				<InputUIControl
					label={label}
					value={isValueControlled ? '' : value}
					onChange={onChange}
					controls={controls}
					units={units}
				/>
			)}
		</div>
	);
}

export default RadioToggleGroupPopoverInputUI;
