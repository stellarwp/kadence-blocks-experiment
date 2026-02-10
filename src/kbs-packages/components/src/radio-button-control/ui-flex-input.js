import clsx from 'clsx';
/**
 * WordPress dependencies
 */
import { __, _x } from '@wordpress/i18n';
import { __experimentalNumberControl as NumberControl, Tooltip } from '@wordpress/components';
import { useMemo } from '@wordpress/element';
import InputUIControl from './ui-input';

function parseFlexValue(value) {
	const [grow, shrink, basis] = value.split(' ');
	return [grow, shrink, basis];
}

function FlexInputUnitControl({ value, onChange, units, className }) {
	const classes = clsx('components-flex-input-unit-control', 'kbs-flex-input-unit-control', className);
	const [grow, shrink, basis] = useMemo(() => parseFlexValue(value), [value]);

	const onShrinkChange = (shrinkValue) => {
		onChange(`${grow ? grow : 0} ${shrinkValue ? shrinkValue : 1} ${basis ? basis : 'auto'}`);
	};
	const onGrowChange = (growValue) => {
		onChange(`${growValue ? growValue : 0} ${shrink ? shrink : 1} ${basis ? basis : 'auto'}`);
	};
	const onBasisChange = (basisValue) => {
		onChange(`${grow ? grow : 0} ${shrink ? shrink : 1} ${basisValue ? basisValue : 'auto'}`);
	};
	return (
		<div className={classes}>
			<NumberControl
				help={__('Grow', 'kadence-blocks')}
				__next40pxDefaultSize={true}
				__nextHasNoMarginBottom={true}
				value={grow}
				placeholder="0"
				onChange={onGrowChange}
				className="kbs-input-unit-control__input kbs-input-unit-control__input-number"
			/>
			<NumberControl
				help={__('Shrink', 'kadence-blocks')}
				__next40pxDefaultSize={true}
				__nextHasNoMarginBottom={true}
				value={shrink}
				placeholder="1"
				onChange={onShrinkChange}
				className="kbs-input-unit-control__input kbs-input-unit-control__input-number"
			/>
			<InputUIControl
				help={__('Basis', 'kadence-blocks')}
				__next40pxDefaultSize={true}
				__nextHasNoMarginBottom={true}
				value={basis}
				units={units}
				placeholder="auto"
				onChange={onBasisChange}
				className="kbs-input-unit-control__input"
			/>
		</div>
	);
}

export default FlexInputUnitControl;
