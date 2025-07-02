/**
 * Transform Origin Component
 */

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState, useCallback, useMemo, useEffect, useRef } from '@wordpress/element';
import { Button } from '@wordpress/components';
import { undo } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import RadioToggleGroupPopoverInputUI from '../radio-button-control/ui-toggle-group-popover-input';

const GRID_SIZE = 120;
const DOT_POSITIONS = [
	{ x: 0, y: 0, label: 'top-left' },
	{ x: 50, y: 0, label: 'top-center' },
	{ x: 100, y: 0, label: 'top-right' },
	{ x: 0, y: 50, label: 'center-left' },
	{ x: 50, y: 50, label: 'center' },
	{ x: 100, y: 50, label: 'center-right' },
	{ x: 0, y: 100, label: 'bottom-left' },
	{ x: 50, y: 100, label: 'bottom-center' },
	{ x: 100, y: 100, label: 'bottom-right' },
];

export default function TransformOrigin(props) {
	const { 
		onChange, 
		resolvedValues
	} = props;
	
	const [isDragging, setIsDragging] = useState(false);
	const [visualOrigin, setVisualOrigin] = useState(null);
	const gridRef = useRef(null);
	const dragStartRef = useRef(null);
	const rafRef = useRef(null);

	const { directValue, inheritedValue, isInherited, appliedValue } = resolvedValues;
	const value = directValue || {};

	const originUnits = useMemo(() => [
		{ 
			value: '%', 
			label: '%', 
			a11yLabel: __('Percent (%)', 'kadence-blocks'), 
			step: 1 
		}
	], []);
	
	const originValue = useMemo(() => value || { x: '50%', y: '50%' }, [value]);
	const effectiveOriginValue = useMemo(() => appliedValue || { x: '50%', y: '50%' }, [appliedValue]);
	
	const parseOriginValue = useCallback((value) => {
		if (typeof value === 'string' && value.endsWith('%')) {
			return parseFloat(value);
		}
		return parseFloat(value) || 50;
	}, []);
	
	const handleOriginChange = useCallback((newValue, axis) => {
		const updatedOrigin = { ...originValue };
		updatedOrigin[axis] = newValue;
		onChange(updatedOrigin);
	}, [originValue, onChange]);

	const handleReset = useCallback(() => {
		onChange('');
	}, [onChange]);

	const handleDotClick = useCallback((position) => {
		onChange({ x: position.x + '%', y: position.y + '%' });
	}, [onChange]);

	const handleBlueDotMouseDown = useCallback((e) => {
		e.preventDefault();
		e.stopPropagation();
		
		const grid = gridRef.current;
		if (!grid) return;
		
		const rect = grid.getBoundingClientRect();
		
		setIsDragging(true);
		
		dragStartRef.current = {
			gridRect: rect,
			startX: e.clientX,
			startY: e.clientY
		};
	}, []);

	const handleMouseMove = useCallback((e) => {
		if (!isDragging || !dragStartRef.current) return;
		
		const { gridRect } = dragStartRef.current;
		
		const x = ((e.clientX - gridRect.left) / gridRect.width) * 100;
		const y = ((e.clientY - gridRect.top) / gridRect.height) * 100;
		
		// Set visual state immediately for smooth feedback
		setVisualOrigin({ x, y });
		
		if (rafRef.current) {
			cancelAnimationFrame(rafRef.current);
		}
		
		// Throttle onChange calls
		rafRef.current = requestAnimationFrame(() => {
			onChange({ x: Math.round(x) + '%', y: Math.round(y) + '%' });
		});
	}, [isDragging, onChange]);

	const handleMouseUp = useCallback(() => {
		if (rafRef.current) {
			cancelAnimationFrame(rafRef.current);
			rafRef.current = null;
		}
		
		setIsDragging(false);
		setVisualOrigin(null);
		dragStartRef.current = null;
	}, []);

	useEffect(() => {
		if (isDragging) {
			document.body.classList.add('is-dragging-origin');
			window.addEventListener('mousemove', handleMouseMove);
			window.addEventListener('mouseup', handleMouseUp);
			
			return () => {
				document.body.classList.remove('is-dragging-origin');
				window.removeEventListener('mousemove', handleMouseMove);
				window.removeEventListener('mouseup', handleMouseUp);
				
				// Clean up any pending RAF on unmount
				if (rafRef.current) {
					cancelAnimationFrame(rafRef.current);
					rafRef.current = null;
				}
			};
		}
	}, [isDragging, handleMouseMove, handleMouseUp]);

	const currentX = visualOrigin ? visualOrigin.x : parseOriginValue(effectiveOriginValue.x);
	const currentY = visualOrigin ? visualOrigin.y : parseOriginValue(effectiveOriginValue.y);

	return (
		<div className="kadence-transform-origin-content">
			<div className="kadence-transform-title-wrapper">
				<span className="kadence-transform-origin-title">
					{__('Transform Origin', 'kadence-blocks')}
				</span>
				<Button
					className="kadence-transform-reset-button"
					onClick={handleReset}
					icon={undo}
					size="small"
					label={__('Reset origin', 'kadence-blocks')}
					aria-label={__('Reset origin to center (50%, 50%)', 'kadence-blocks')}
				/>
			</div>
			
			<div className="kadence-transform-origin-visual">
				<div 
					className="kadence-transform-origin-container"
				>
					<div className={`kadence-transform-origin-reference-box${isInherited ? ' kbs-inherited' : ''}`} ref={gridRef}>
						{DOT_POSITIONS.map((position, index) => (
							<div
								key={index}
								className={`kadence-transform-origin-dot kadence-transform-origin-dot-${position.label}`}
								style={{
									left: `${position.x}%`,
									top: `${position.y}%`
								}}
								onClick={(e) => {
									e.stopPropagation();
									handleDotClick(position);
								}}
							/>
						))}
						
						<div
							className={`kadence-transform-origin-dot kadence-transform-origin-dot-active ${isDragging ? 'is-dragging' : ''}${isInherited ? ' kbs-inherited' : ''}`}
							style={{
								left: `${currentX}%`,
								top: `${currentY}%`
							}}
							onMouseDown={handleBlueDotMouseDown}
						/>
					</div>
				</div>
			</div>
			
			<div className="kadence-transform-origin-controls">
				<div className="kadence-transform-origin-input-wrapper">
					<RadioToggleGroupPopoverInputUI
						label={__('X', 'kadence-blocks')}
						value={originValue.x}
						onChange={(newValue) => handleOriginChange(newValue, 'x')}
						inherited={{ inheritedValue: inheritedValue?.x }}
						isCustom={true}
						parentLabel={__('Origin', 'kadence-blocks')}
						units={originUnits}
					/>
					
					<RadioToggleGroupPopoverInputUI
						label={__('Y', 'kadence-blocks')}
						value={originValue.y}
						onChange={(newValue) => handleOriginChange(newValue, 'y')}
						inherited={{ inheritedValue: inheritedValue?.y }}
						isCustom={true}
						parentLabel={__('Origin', 'kadence-blocks')}
						units={originUnits}
					/>
				</div>
			</div>
		</div>
	);
}