/**
 * Transform Translate Component
 */

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState, useCallback, useMemo, useEffect, useRef } from '@wordpress/element';
import { undo } from '@wordpress/icons';
import { Button } from '@wordpress/components';

/**
 * Internal dependencies
 */
import RadioToggleGroupPopoverInputUI from '../radio-button-control/ui-toggle-group-popover-input';

const MOVEMENT_SCALE = 5; // 1px visual movement = 5 units

function TransformTranslate(props) {
	const { onChange, resolvedValues } = props;

	const [isDragging, setIsDragging] = useState(false);
	const [visualTranslate, setVisualTranslate] = useState(null);
	const boxRef = useRef(null);
	const containerRef = useRef(null);
	const dragStartRef = useRef(null);
	const rafRef = useRef(null);

	const { directValue, inheritedValue, isInherited, appliedValue } = resolvedValues;
	const value = directValue || {};

	const translateValue = useMemo(() => value || { x: '0px', y: '0px' }, [value]);
	const effectiveTranslateValue = useMemo(() => appliedValue || { x: '0px', y: '0px' }, [appliedValue]);

	const parseTranslateValue = useCallback((value, containerSize = 0) => {
		if (!value) {
			return 0;
		}
		if (typeof value === 'string') {
			const numValue = parseFloat(value) || 0;

			if (value.endsWith('px')) {
				return numValue;
			} else if (value.endsWith('%')) {
				return (numValue / 100) * (containerSize || 100);
			} else if (value.endsWith('em')) {
				return numValue * 16;
			} else if (value.endsWith('rem')) {
				return numValue * 16;
			} else if (value.endsWith('vw')) {
				return numValue * 10;
			} else if (value.endsWith('vh')) {
				return numValue * 10;
			}
			return numValue;
		}
		return parseFloat(value) || 0;
	}, []);

	const getUnit = useCallback((val) => {
		if (typeof val === 'string') {
			const match = val.match(/[a-z%]+$/i);
			return match ? match[0] : 'px';
		}
		return 'px';
	}, []);

	const handleTranslateChange = useCallback(
		(newValue, axis) => {
			const updatedTranslate = { ...translateValue };
			const otherAxis = axis === 'x' ? 'y' : 'x';

			const currentUnit = getUnit(translateValue[axis]);
			const newUnit = getUnit(newValue);
			const otherUnit = getUnit(translateValue[otherAxis]);

			if (currentUnit !== newUnit || otherUnit !== newUnit) {
				updatedTranslate.x = '0' + newUnit;
				updatedTranslate.y = '0' + newUnit;
			} else {
				updatedTranslate[axis] = newValue;
			}

			onChange(updatedTranslate);
		},
		[translateValue, onChange, getUnit]
	);

	const handleReset = useCallback(() => {
		onChange('');
	}, [onChange]);

	const handleMouseDown = useCallback(
		(e) => {
			e.preventDefault();
			e.stopPropagation();

			const container = containerRef.current;
			const box = boxRef.current;
			if (!container || !box) {
				return;
			}

			const containerRect = container.getBoundingClientRect();
			const boxRect = box.getBoundingClientRect();

			setIsDragging(true);

			dragStartRef.current = {
				mouseX: e.clientX,
				mouseY: e.clientY,
				initialX: parseTranslateValue(effectiveTranslateValue.x),
				initialY: parseTranslateValue(effectiveTranslateValue.y),
				containerWidth: containerRect.width,
				containerHeight: containerRect.height,
			};
		},
		[translateValue, parseTranslateValue]
	);

	const handleMouseMove = useCallback(
		(e) => {
			if (!isDragging || !dragStartRef.current) {
				return;
			}

			const { mouseX, mouseY, initialX, initialY } = dragStartRef.current;

			const deltaX = e.clientX - mouseX;
			const deltaY = e.clientY - mouseY;

			const actualX = initialX + deltaX * MOVEMENT_SCALE;
			const actualY = initialY + deltaY * MOVEMENT_SCALE;

			const visualX = actualX / MOVEMENT_SCALE;
			const visualY = actualY / MOVEMENT_SCALE;

			setVisualTranslate({ x: visualX, y: visualY });

			if (rafRef.current) {
				window.cancelAnimationFrame(rafRef.current);
			}

			rafRef.current = window.requestAnimationFrame(() => {
				const getUnit = (val) => {
					if (typeof val === 'string') {
						const match = val.match(/[a-z%]+$/i);
						return match ? match[0] : 'px';
					}
					return 'px';
				};

				const xUnit = getUnit(translateValue.x);
				const yUnit = getUnit(translateValue.y);

				const formatValue = (value, unit) => {
					const rounded = Math.round(value);
					if (unit === 'em' || unit === 'rem') {
						return (rounded / 16).toFixed(2) + unit;
					} else if (unit === 'vw' || unit === 'vh') {
						return (rounded / 10).toFixed(1) + unit;
					} else if (unit === '%') {
						return rounded + unit;
					}
					return rounded + 'px';
				};

				onChange({
					x: formatValue(actualX, xUnit),
					y: formatValue(actualY, yUnit),
				});
			});
		},
		[isDragging, onChange, translateValue]
	);

	const handleMouseUp = useCallback(() => {
		if (rafRef.current) {
			window.cancelAnimationFrame(rafRef.current);
			rafRef.current = null;
		}

		setIsDragging(false);
		setVisualTranslate(null);
		dragStartRef.current = null;
	}, []);

	useEffect(() => {
		if (isDragging) {
			document.body.classList.add('is-dragging-translate');
			window.addEventListener('mousemove', handleMouseMove);
			window.addEventListener('mouseup', handleMouseUp);

			return () => {
				document.body.classList.remove('is-dragging-translate');
				window.removeEventListener('mousemove', handleMouseMove);
				window.removeEventListener('mouseup', handleMouseUp);
			};
		}
	}, [isDragging, handleMouseMove, handleMouseUp]);

	const transformStyle = useMemo(() => {
		const x = visualTranslate ? visualTranslate.x : parseTranslateValue(effectiveTranslateValue.x) / MOVEMENT_SCALE;
		const y = visualTranslate ? visualTranslate.y : parseTranslateValue(effectiveTranslateValue.y) / MOVEMENT_SCALE;
		return {
			transform: `translate(${x}px, ${y}px)`,
		};
	}, [visualTranslate, translateValue, parseTranslateValue]);

	return (
		<div className="kadence-transform-translate-content">
			<div className="kadence-transform-title-wrapper">
				<span className="kadence-transform-translate-title">{__('Transform Translate', 'kadence-blocks')}</span>
				<Button
					className="kadence-transform-reset-button"
					icon={undo}
					size="small"
					onClick={handleReset}
					label={__('Reset translate', 'kadence-blocks')}
					aria-label={__('Reset translate values', 'kadence-blocks')}
				/>
			</div>

			<div className="kadence-transform-translate-visual" ref={containerRef}>
				<div className={`kadence-transform-translate-box-reference${isInherited ? ' kbs-inherited' : ''}`} />

				<div
					className={`kadence-transform-translate-box ${isDragging ? 'is-dragging' : ''}${isInherited ? ' kbs-inherited' : ''}`}
					ref={boxRef}
					style={transformStyle}
					onMouseDown={handleMouseDown}
				/>
			</div>

			<div className="kadence-transform-translate-controls">
				<div className="kadence-transform-translate-input-wrapper">
					<RadioToggleGroupPopoverInputUI
						label={__('X', 'kadence-blocks')}
						value={translateValue.x}
						onChange={(newValue) => handleTranslateChange(newValue, 'x')}
						inherited={{ inheritedValue: inheritedValue?.x }}
						isCustom={true}
						parentLabel={__('Translate', 'kadence-blocks')}
					/>

					<RadioToggleGroupPopoverInputUI
						label={__('Y', 'kadence-blocks')}
						value={translateValue.y}
						onChange={(newValue) => handleTranslateChange(newValue, 'y')}
						inherited={{ inheritedValue: inheritedValue?.y }}
						isCustom={true}
						parentLabel={__('Translate', 'kadence-blocks')}
					/>
				</div>
			</div>
		</div>
	);
}

export default TransformTranslate;
