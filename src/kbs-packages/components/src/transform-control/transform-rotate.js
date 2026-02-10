/**
 * Transform Rotate Component
 */

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useCallback, useMemo } from '@wordpress/element';
import { AnglePickerControl, Button } from '@wordpress/components';
import { undo } from '@wordpress/icons';

function TransformRotate(props) {
	const { onChange, resolvedValues } = props;

	const { directValue, inheritedValue, isInherited, appliedValue } = resolvedValues;
	const value = directValue || {};

	const rotateValue = useMemo(() => value || { x: '0deg', y: '0deg', z: '0deg' }, [value]);
	const effectiveRotateValue = useMemo(() => appliedValue || { x: '0deg', y: '0deg', z: '0deg' }, [appliedValue]);

	const parseRotateValue = useCallback((value) => {
		if (!value) {
			return 0;
		}
		if (typeof value === 'string' && value.endsWith('deg')) {
			return parseFloat(value) || 0;
		}
		return parseFloat(value) || 0;
	}, []);

	const handleAngleChange = useCallback(
		(angle, axis) => {
			const updatedRotate = { ...rotateValue };
			updatedRotate[axis] = angle + 'deg';
			onChange(updatedRotate);
		},
		[rotateValue, onChange]
	);

	const handleReset = useCallback(() => {
		onChange('');
	}, [onChange]);

	return (
		<div className="kadence-transform-rotate-content">
			<div className="kadence-transform-title-wrapper">
				<span className="kadence-transform-rotate-title">{__('Transform Rotate', 'kadence-blocks')}</span>
				<Button
					className="kadence-transform-reset-button"
					icon={undo}
					size="small"
					onClick={handleReset}
					label={__('Reset rotate', 'kadence-blocks')}
					aria-label={__('Reset rotation values', 'kadence-blocks')}
				/>
			</div>

			<div className={`kadence-transform-rotate-angle-pickers${isInherited ? ' kbs-inherited' : ''}`}>
				<div className="kadence-transform-rotate-angle-picker-wrapper">
					<AnglePickerControl
						label={__('Z-axis', 'kadence-blocks')}
						value={parseRotateValue(rotateValue.z)}
						onChange={(angle) => handleAngleChange(angle, 'z')}
						className={!rotateValue.z && inheritedValue?.z ? 'kbs-inherited' : ''}
					/>
				</div>

				<div className="kadence-transform-rotate-angle-picker-wrapper">
					<AnglePickerControl
						label={__('X-axis', 'kadence-blocks')}
						value={parseRotateValue(rotateValue.x)}
						onChange={(angle) => handleAngleChange(angle, 'x')}
						className={!rotateValue.x && inheritedValue?.x ? 'kbs-inherited' : ''}
					/>
				</div>

				<div className="kadence-transform-rotate-angle-picker-wrapper">
					<AnglePickerControl
						label={__('Y-axis', 'kadence-blocks')}
						value={parseRotateValue(rotateValue.y)}
						onChange={(angle) => handleAngleChange(angle, 'y')}
						className={!rotateValue.y && inheritedValue?.y ? 'kbs-inherited' : ''}
					/>
				</div>
			</div>
		</div>
	);
}

export default TransformRotate;
