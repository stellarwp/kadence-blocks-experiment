import clsx from 'clsx';
/**
 * WordPress dependencies
 */
import { __, _x } from '@wordpress/i18n';
import { useMemo } from '@wordpress/element';
import InputUIControl from './ui-input';

function parseBackgroundSizeValue(value) {
	const [width, height] = value.split(' ');
	return [width, height];
}

function BackgroundSizeInputUnitControl({ value, onChange, units, className, controls = [] }) {
	const classes = clsx(
		'components-background-size-input-unit-control',
		'kbs-background-size-input-unit-control',
		className
	);
	const [width, height] = useMemo(() => parseBackgroundSizeValue(value), [value]);

	const onWidthChange = (widthValue) => {
		onChange(`${widthValue ? widthValue : 'auto'} ${height ? height : 'auto'}`);
	};
	const onHeightChange = (heightValue) => {
		onChange(`${width ? width : 'auto'} ${heightValue ? heightValue : 'auto'}`);
	};
	return (
		<div className={classes}>
			<InputUIControl
				help={__('Width', 'kadence-blocks')}
				__next40pxDefaultSize={true}
				__nextHasNoMarginBottom={true}
				value={width ? width : ''}
				controls={controls}
				units={units}
				placeholder="auto"
				onChange={onWidthChange}
				className="kbs-input-unit-control__input"
			/>
			<InputUIControl
				help={__('Height', 'kadence-blocks')}
				__next40pxDefaultSize={true}
				__nextHasNoMarginBottom={true}
				value={height ? height : ''}
				units={units}
				controls={controls}
				placeholder="auto"
				onChange={onHeightChange}
				className="kbs-input-unit-control__input"
			/>
		</div>
	);
}

export default BackgroundSizeInputUnitControl;
