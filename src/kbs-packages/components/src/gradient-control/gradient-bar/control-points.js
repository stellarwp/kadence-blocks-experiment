/**
 * External dependencies
 */
import clsx from 'clsx';
/**
 * WordPress dependencies
 */
import { useSetting } from '@wordpress/block-editor';
import { useInstanceId, useMergeRefs } from '@wordpress/compose';
import { useEffect, useRef, useState, useMemo } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';
import { plus } from '@wordpress/icons';

/**
 * Internal dependencies
 */
// import { HStack } from '../../h-stack';
// import { ColorPicker } from '../../color-picker';
// import { VisuallyHidden } from '../../visually-hidden';
import ColorSelector from '../../color-control/color-selector';
import {
	__experimentalHStack as HStack,
	Button,
	VisuallyHidden,
	Popover,
	__experimentalNumberControl as NumberControl,
} from '@wordpress/components';
import {
	addControlPoint,
	clampPercent,
	removeControlPoint,
	updateControlPointColor,
	updateControlPointColorByPosition,
	updateControlPointPosition,
	getHorizontalRelativeGradientPosition,
} from './utils';
import { MINIMUM_SIGNIFICANT_MOVE, KEYBOARD_CONTROL_POINT_VARIATION } from './constants';
import { getColorOptions } from '@kadence/kbsHelpers';
import UnitControl from '../../unit-control/unit-control';

function useObservableState(initialState, onStateChange) {
	const [state, setState] = useState(initialState);
	return [
		state,
		(value) => {
			setState(value);
			if (onStateChange) {
				onStateChange(value);
			}
		},
	];
}

function CustomDropdown(props) {
	const {
		renderContent,
		renderToggle,
		className,
		contentClassName,
		expandOnMobile,
		headerTitle,
		focusOnMount,
		position,
		popoverProps,
		onClose,
		onToggle,
		style,
		globalStylesCss,
	} = props;
	// Use internal state instead of a ref to make sure that the component
	// re-renders when the popover's anchor updates.
	const [fallbackPopoverAnchor, setFallbackPopoverAnchor] = useState(null);
	const containerRef = useRef();
	const [isOpen, setIsOpen] = useObservableState(false, onToggle);
	const divRef = useRef();
	useEffect(() => {
		if (divRef.current) {
			if (globalStylesCss) {
				divRef.current.setAttribute('style', globalStylesCss);
			} else {
				divRef.current.removeAttribute('style');
			}
		}
	}, [globalStylesCss, divRef?.current, isOpen]);
	useEffect(
		() => () => {
			if (onToggle && isOpen) {
				onToggle(false);
			}
		},
		[onToggle, isOpen]
	);

	function toggle() {
		setIsOpen(!isOpen);
	}

	/**
	 * Closes the popover when focus leaves it unless the toggle was pressed or
	 * focus has moved to a separate dialog. The former is to let the toggle
	 * handle closing the popover and the latter is to preserve presence in
	 * case a dialog has opened, allowing focus to return when it's dismissed.
	 */
	function closeIfFocusOutside() {
		const { ownerDocument } = containerRef.current;
		const dialog = ownerDocument.activeElement.closest('[role="dialog"]');
		if (
			!containerRef.current.contains(ownerDocument.activeElement) &&
			(!dialog || dialog.contains(containerRef.current))
		) {
			close();
		}
	}

	function close() {
		if (onClose) {
			onClose();
		}
		setIsOpen(false);
	}

	const args = { isOpen, onToggle: toggle, onClose: close };
	const popoverPropsHaveAnchor =
		!!popoverProps?.anchor ||
		// Note: `anchorRef`, `getAnchorRect` and `anchorRect` are deprecated and
		// be removed from `Popover` from WordPress 6.3
		!!popoverProps?.anchorRef ||
		!!popoverProps?.getAnchorRect ||
		!!popoverProps?.anchorRect;

	return (
		<div
			className={clsx('components-dropdown', className)}
			ref={useMergeRefs([setFallbackPopoverAnchor, containerRef])}
			// Some UAs focus the closest focusable parent when the toggle is
			// clicked. Making this div focusable ensures such UAs will focus
			// it and `closeIfFocusOutside` can tell if the toggle was clicked.
			tabIndex="-1"
			style={style}
		>
			{renderToggle(args)}
			{isOpen && (
				<Popover
					position={position}
					onClose={close}
					onFocusOutside={closeIfFocusOutside}
					expandOnMobile={expandOnMobile}
					headerTitle={headerTitle}
					focusOnMount={focusOnMount}
					// This value is used to ensure that the dropdowns
					// align with the editor header by default.
					offset={13}
					anchor={!popoverPropsHaveAnchor ? fallbackPopoverAnchor : undefined}
					{...popoverProps}
					className={clsx(
						'components-dropdown__content',
						popoverProps ? popoverProps.className : undefined,
						contentClassName
					)}
				>
					<div ref={divRef}>{renderContent(args)}</div>
				</Popover>
			)}
		</div>
	);
}

function CustomColorPickerDropdown({
	isRenderedInSidebar,
	popoverProps: receivedPopoverProps,
	globalClasses,
	globalStylesCss,
	...props
}) {
	const popoverProps = useMemo(
		() => ({
			shift: true,
			...(isRenderedInSidebar
				? {
						// When in the sidebar: open to the left (stacking),
						// leaving the same gap as the parent popover.
						placement: 'left-start',
						offset: 34,
					}
				: {
						// Default behavior: open below the anchor
						placement: 'bottom',
						offset: 8,
					}),
			...receivedPopoverProps,
		}),
		[isRenderedInSidebar, receivedPopoverProps]
	);

	return (
		<CustomDropdown
			globalStylesCss={globalStylesCss}
			contentClassName={clsx(
				'components-color-palette__custom-color-dropdown-content kbs-color-control',
				globalClasses
			)}
			popoverProps={popoverProps}
			{...props}
		/>
	);
}

function ControlPointButton({ isOpen, position, color, ...additionalProps }) {
	const instanceId = useInstanceId(ControlPointButton);
	const descriptionId = `kbs-gradient-control__control-point-button-description-${instanceId}`;
	return (
		<>
			<Button
				aria-label={sprintf(
					// translators: %1$s: gradient position e.g: 70, %2$s: gradient color code e.g: rgb(52,121,151).
					__('Gradient control point at position %1$s%% with color code %2$s.'),
					position,
					color
				)}
				aria-describedby={descriptionId}
				aria-haspopup="true"
				aria-expanded={isOpen}
				className={clsx('kbs-gradient-control__control-point-button', {
					'is-active': isOpen,
				})}
				{...additionalProps}
			/>
			<VisuallyHidden id={descriptionId}>
				{__(
					'Use your left or right arrow keys or drag and drop with the mouse to change the gradient position. Press the button to change the color or remove the control point.'
				)}
			</VisuallyHidden>
		</>
	);
}

function GradientColorPickerDropdown({ isRenderedInSidebar, className, ...props }) {
	// Open the popover below the gradient control/insertion point
	const popoverProps = useMemo(
		() => ({
			placement: 'bottom',
			offset: 8,
		}),
		[]
	);

	const mergedClassName = clsx('kbs-gradient-control__control-point-dropdown', className);

	return (
		<CustomColorPickerDropdown
			isRenderedInSidebar={isRenderedInSidebar}
			popoverProps={popoverProps}
			className={mergedClassName}
			{...props}
		/>
	);
}
function getReadableColor(value, colors, containerRef) {
	if (!value) {
		return '';
	}
	if (!colors) {
		return value;
	}
	// if (value.startsWith('var(--global-')) {
	// 	const foundColor = colors.find((option) => option.value === value);
	// 	if (foundColor) {
	// 		return foundColor.color;
	// 	}
	// 	let slug = value.replace('var(--global-', '');
	// 	slug = slug.substring(0, 8);
	// 	slug = 'theme-' + slug;
	// 	const found = colors.find((option) => option.slug === slug);
	// 	if (found) {
	// 		return found.color;
	// 	}
	// 	if (containerRef?.current) {
	// 		let temp_value = window
	// 			.getComputedStyle(containerRef.current)
	// 			.getPropertyValue(value.replace('var(', '').replace(' ', '').replace(')', ''));
	// 		if ('' === temp_value) {
	// 			temp_value = window
	// 				.getComputedStyle(containerRef.current)
	// 				.getPropertyValue(value.replace('var(', '').replace(' ', '').split(',')[0].replace(')', ''));
	// 		}
	// 		if (temp_value) {
	// 			return temp_value;
	// 		}
	// 	}
	// } else if (value.startsWith('var(--kbs-colors-')) {
	// 	const foundColor = colors.find((option) => option.value === value);
	// 	if (foundColor) {
	// 		console.log('foundColor', foundColor);
	// 		return foundColor.color;
	// 	}
	// 	let slug = value.replace('var(--kbs-colors-', '');
	// 	slug = slug.substring(0, 8);
	// 	const foundPalette = colors.find((option) => option.slug === slug);
	// 	if (foundPalette) {
	// 		console.log('foundPalette', foundPalette);
	// 		return foundPalette.color;
	// 	}
	// 	slug = 'theme-' + slug;
	// 	const found = colors.find((option) => option.slug === slug);
	// 	if (found) {
	// 		console.log('found', found);
	// 		return found.color;
	// 	}
	// 	if (containerRef?.current) {
	// 		let temp_value = window
	// 			.getComputedStyle(containerRef.current)
	// 			.getPropertyValue(value.replace('var(', '').replace(' ', '').replace(')', ''));
	// 		if ('' === temp_value) {
	// 			temp_value = window
	// 				.getComputedStyle(containerRef.current)
	// 				.getPropertyValue(value.replace('var(', '').replace(' ', '').split(',')[0].replace(')', ''));
	// 		}
	// 		if (temp_value) {
	// 			return temp_value;
	// 		}
	// 	}
	// } else if (value.startsWith('var(') && containerRef?.current) {
	// 	let temp_value = window
	// 		.getComputedStyle(containerRef.current)
	// 		.getPropertyValue(value.replace('var(', '').replace(' ', '').replace(')', ''));
	// 	if ('' === temp_value) {
	// 		temp_value = window
	// 			.getComputedStyle(containerRef.current)
	// 			.getPropertyValue(value.replace('var(', '').replace(' ', '').split(',')[0].replace(')', ''));
	// 	}
	// 	if (temp_value) {
	// 		return temp_value;
	// 	}
	// }

	return value;
}

function ControlPoints({
	disableRemove,
	gradientPickerDomRef,
	ignoreMarkerPosition,
	value: controlPoints,
	onChange,
	onStartControlPointChange,
	onStopControlPointChange,
	isRenderedInSidebar,
	globalClasses,
	containerRef,
	globalColors,
	globalStylesCss,
}) {
	const controlPointMoveState = useRef();

	const onMouseMove = (event) => {
		const relativePosition = getHorizontalRelativeGradientPosition(event.clientX, gradientPickerDomRef.current);
		const { initialPosition, index, significantMoveHappened } = controlPointMoveState.current;
		if (!significantMoveHappened && Math.abs(initialPosition - relativePosition) >= MINIMUM_SIGNIFICANT_MOVE) {
			controlPointMoveState.current.significantMoveHappened = true;
		}

		onChange(updateControlPointPosition(controlPoints, index, relativePosition));
	};

	const cleanEventListeners = () => {
		if (
			window &&
			window.removeEventListener &&
			controlPointMoveState.current &&
			controlPointMoveState.current.listenersActivated
		) {
			window.removeEventListener('mousemove', onMouseMove);
			window.removeEventListener('mouseup', cleanEventListeners);
			onStopControlPointChange();
			controlPointMoveState.current.listenersActivated = false;
		}
	};

	// Adding `cleanEventListeners` to the dependency array below requires the function itself to be wrapped in a `useCallback`
	// This memoization would prevent the event listeners from being properly cleaned.
	// Instead, we'll pass a ref to the function in our `useEffect` so `cleanEventListeners` itself is no longer a dependency.
	const cleanEventListenersRef = useRef();
	cleanEventListenersRef.current = cleanEventListeners;

	useEffect(() => {
		return () => {
			cleanEventListenersRef.current();
		};
	}, []);
	const disableCustomColors = !useSetting('color.custom');

	return controlPoints.map((point, index) => {
		const initialPosition = point?.position;
		const pointColor = getReadableColor(point.color, globalColors, containerRef);
		return (
			ignoreMarkerPosition !== initialPosition && (
				<GradientColorPickerDropdown
					isRenderedInSidebar={isRenderedInSidebar}
					key={index}
					onClose={onStopControlPointChange}
					globalClasses={globalClasses}
					globalStylesCss={globalStylesCss}
					renderToggle={({ isOpen, onToggle }) => (
						<ControlPointButton
							key={index}
							onClick={() => {
								if (
									controlPointMoveState.current &&
									controlPointMoveState.current.significantMoveHappened
								) {
									return;
								}
								if (isOpen) {
									onStopControlPointChange();
								} else {
									onStartControlPointChange();
								}
								onToggle();
							}}
							onMouseDown={() => {
								if (window && window.addEventListener) {
									controlPointMoveState.current = {
										initialPosition,
										index,
										significantMoveHappened: false,
										listenersActivated: true,
									};
									onStartControlPointChange();
									window.addEventListener('mousemove', onMouseMove);
									window.addEventListener('mouseup', cleanEventListeners);
								}
							}}
							onKeyDown={(event) => {
								if (event.code === 'ArrowLeft') {
									// Stop propagation of the key press event to avoid focus moving
									// to another editor area.
									event.stopPropagation();
									onChange(
										updateControlPointPosition(
											controlPoints,
											index,
											clampPercent(point.position - KEYBOARD_CONTROL_POINT_VARIATION)
										)
									);
								} else if (event.code === 'ArrowRight') {
									// Stop propagation of the key press event to avoid focus moving
									// to another editor area.
									event.stopPropagation();
									onChange(
										updateControlPointPosition(
											controlPoints,
											index,
											clampPercent(point.position + KEYBOARD_CONTROL_POINT_VARIATION)
										)
									);
								}
							}}
							isOpen={isOpen}
							position={point.position}
							color={point.color}
						/>
					)}
					renderContent={({ onClose }) => (
						<div className="kadence-pop-gradient-color-picker kbs-color-control">
							{!disableCustomColors && (
								<ColorSelector
									handleColorChange={(value) => {
										if (value.startsWith('palette')) {
											onChange(
												updateControlPointColor(
													controlPoints,
													index,
													'var(--kbs-colors-' + value + ')'
												)
											);
										} else {
											onChange(updateControlPointColor(controlPoints, index, value));
										}
									}}
									colors={globalColors}
									currentValue={pointColor ? pointColor : ''}
									inherited={''}
									globalStylesCss={globalStylesCss}
								/>
							)}
							{point?.position !== undefined && (
								<UnitControl
									label={__('Control Point Position', 'kadence-blocks')}
									className="kbs-gradient-control__control-point-position"
									max={100}
									min={0}
									units={[{ value: '%', label: '%' }]}
									value={point.position}
									placeholder={100}
									step={0.01}
									onChange={(value) => {
										onChange(
											updateControlPointPosition(
												controlPoints,
												index,
												clampPercent(parseFloat(value))
											)
										);
									}}
								/>
							)}
							{!disableRemove && controlPoints.length > 2 && (
								<HStack
									className="components-custom-gradient-picker__remove-control-point-wrapper"
									alignment="center"
								>
									<Button
										onClick={() => {
											onChange(removeControlPoint(controlPoints, index));
											onClose();
										}}
										variant="link"
									>
										{__('Remove Control Point', 'kadence-blocks')}
									</Button>
								</HStack>
							)}
						</div>
					)}
					style={{
						left: `${point.position}%`,
						transform: 'translateX( -50% )',
					}}
				/>
			)
		);
	});
}

function InsertPoint({
	value: controlPoints,
	onChange,
	onOpenInserter,
	onCloseInserter,
	insertPosition,
	isRenderedInSidebar,
	globalClasses,
	containerRef,
	globalColors,
	globalStylesCss,
}) {
	const [alreadyInsertedPoint, setAlreadyInsertedPoint] = useState(false);
	const disableCustomColors = !useSetting('color.custom');
	const [tempColor, setTempColor] = useState('');
	const pointColor = getReadableColor(tempColor, globalColors, containerRef);
	return (
		<GradientColorPickerDropdown
			isRenderedInSidebar={isRenderedInSidebar}
			className="kbs-gradient-control__inserter"
			globalClasses={globalClasses}
			globalStylesCss={globalStylesCss}
			onClose={() => {
				onCloseInserter();
			}}
			renderToggle={({ isOpen, onToggle }) => (
				<Button
					aria-expanded={isOpen}
					aria-haspopup="true"
					onClick={() => {
						if (isOpen) {
							onCloseInserter();
						} else {
							setAlreadyInsertedPoint(false);
							onOpenInserter();
						}
						onToggle();
					}}
					className="kbs-gradient-control__insert-point-dropdown"
					icon={plus}
				/>
			)}
			renderContent={() => (
				<div className="kadence-pop-gradient-color-picker">
					{!disableCustomColors && (
						<ColorSelector
							handleColorChange={(value) => {
								setTempColor(value);
								if (!alreadyInsertedPoint) {
									if (value.startsWith('palette')) {
										onChange(
											addControlPoint(
												controlPoints,
												insertPosition,
												'var(--kbs-colors-' + value + ')'
											)
										);
									} else {
										onChange(addControlPoint(controlPoints, insertPosition, value));
									}
									setAlreadyInsertedPoint(true);
								} else {
									if (value.startsWith('palette')) {
										onChange(
											updateControlPointColorByPosition(
												controlPoints,
												insertPosition,
												'var(--kbs-colors-' + value + ')'
											)
										);
									} else {
										onChange(
											updateControlPointColorByPosition(controlPoints, insertPosition, value)
										);
									}
								}
							}}
							globalStylesCss={globalStylesCss}
							colors={globalColors}
							currentValue={pointColor ? pointColor : ''}
							inherited={''}
						/>
					)}
				</div>
			)}
			style={
				insertPosition !== null
					? {
							left: `${insertPosition}%`,
							transform: 'translateX( -50% )',
						}
					: undefined
			}
		/>
	);
}
ControlPoints.InsertPoint = InsertPoint;

export default ControlPoints;
