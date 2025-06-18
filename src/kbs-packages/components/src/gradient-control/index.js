/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { AnglePickerControl, Button, Flex, FlexItem, SelectControl } from '@wordpress/components';
import { useMemo, useEffect } from '@wordpress/element';
/**
 * Internal dependencies
 */
import { getGradientOptions, getColorOptions } from '@kadence/kbsHelpers';
import CustomGradientBar from './gradient-bar';
import ColorIndicator from '../color-control/color-indicator';
import {
	getGradientAstWithDefault,
	getLinearGradientRepresentation,
	getGradientAstWithControlPoints,
	getStopCssColor,
} from './utils';
import { serializeGradient } from './serializer';
import {
	DEFAULT_LINEAR_GRADIENT_ANGLE,
	HORIZONTAL_GRADIENT_ORIENTATION,
	CONIC_GRADIENT_ORIENTATION,
	GRADIENT_OPTIONS,
	RADIAL_GRADIENT_ORIENTATION,
	DEFAULT_GRADIENT,
	DEFAULT_RADIAL_GRADIENT_POSITION,
	DEFAULT_RADIAL_GRADIENT_SHAPE,
} from './constants';
import FocalPointPicker from '../focal-point-picker';

import './editor.scss';

const GradientAnglePicker = ({ gradientAST, hasGradient, onChange }) => {
	const angle = gradientAST?.orientation?.value ?? DEFAULT_LINEAR_GRADIENT_ANGLE;
	const onAngleChange = (newAngle) => {
		if (gradientAST.type === 'conic-gradient') {
			onChange(
				serializeGradient({
					...gradientAST,
					orientation: {
						type: 'from_angular',
						value: newAngle,
						at: {
							type: gradientAST.orientation.at.type,
							value: {
								x: {
									type: gradientAST.orientation.at.value.x.type,
									value: gradientAST.orientation.at.value.x.value,
								},
								y: {
									type: gradientAST.orientation.at.value.y.type,
									value: gradientAST.orientation.at.value.y.value,
								},
							},
						},
					},
				})
			);
			return;
		}
		onChange(
			serializeGradient({
				...gradientAST,
				orientation: {
					type: 'angular',
					value: newAngle,
				},
			})
		);
	};
	return (
		<AnglePickerControl
			__next40pxDefaultSize
			__nextHasNoMarginBottom
			className="kbs-input-control kbs-gradient-control__angle-picker"
			label={__('Angle', 'kadence-blocks')}
			onChange={onAngleChange}
			labelPosition="top"
			value={hasGradient ? angle : ''}
		/>
	);
};

const GradientTypePicker = ({ gradientAST, hasGradient, onChange }) => {
	const { type } = gradientAST;
	const onSetLinearGradient = () => {
		onChange(
			serializeGradient({
				...gradientAST,
				...{ orientation: HORIZONTAL_GRADIENT_ORIENTATION },
				type: 'linear-gradient',
			})
		);
	};

	const onSetRadialGradient = () => {
		onChange(
			serializeGradient({
				...gradientAST,
				...{ orientation: RADIAL_GRADIENT_ORIENTATION },
				type: 'radial-gradient',
			})
		);
	};

	const onSetConicGradient = () => {
		onChange(
			serializeGradient({
				...gradientAST,
				...{ orientation: CONIC_GRADIENT_ORIENTATION },
				type: 'conic-gradient',
			})
		);
	};

	const handleOnChange = (next) => {
		if (next === 'linear-gradient') {
			onSetLinearGradient();
		}
		if (next === 'radial-gradient') {
			onSetRadialGradient();
		}
		if (next === 'conic-gradient') {
			onSetConicGradient();
		}
	};

	return (
		<SelectControl
			__next40pxDefaultSize
			__nextHasNoMarginBottom
			className="kbs-gradient-control__type-picker kbs-core-select-control"
			label={__('Type', 'kadence-blocks')}
			labelPosition="top"
			onChange={handleOnChange}
			options={GRADIENT_OPTIONS}
			value={hasGradient && type}
		/>
	);
};
const GradientPositionPicker = ({ gradient, gradientAST, hasGradient, onChange }) => {
	let position = DEFAULT_RADIAL_GRADIENT_POSITION;
	if (gradientAST?.orientation?.at?.value?.x?.value) {
		if (gradientAST.orientation.at.value.x.type !== 'position-keyword') {
			position = gradientAST.orientation.at.value.x.value + '% ' + gradientAST.orientation.at.value.y.value + '%';
		} else {
			position = gradientAST.orientation.at.value.x.value + ' ' + gradientAST.orientation.at.value.y.value;
		}
	}
	const onPositionChange = (newPosition) => {
		const positionArray = newPosition.split(' ');
		if (gradientAST.type === 'conic-gradient') {
			onChange(
				serializeGradient({
					...gradientAST,
					orientation: {
						type: 'from_angular',
						value: gradientAST?.orientation?.value || 90,
						at: {
							type: 'position',
							value: {
								x: {
									type: '%',
									value: positionArray?.[0] ? parseInt(positionArray?.[0]) : 50,
								},
								y: {
									type: '%',
									value: positionArray?.[1] ? parseInt(positionArray?.[1]) : 50,
								},
							},
						},
					},
				})
			);
			return;
		}
		onChange(
			serializeGradient({
				...gradientAST,
				orientation: {
					type: 'shape',
					value: gradientAST?.orientation?.value || 'ellipse',
					at: {
						type: 'position',
						value: {
							x: {
								type: '%',
								value: positionArray?.[0] ? parseInt(positionArray?.[0]) : 50,
							},
							y: {
								type: '%',
								value: positionArray?.[1] ? parseInt(positionArray?.[1]) : 50,
							},
						},
					},
				},
			})
		);
	};
	if (!hasGradient) {
		return;
	}
	return (
		<div className={`components-base-control kadence-gradient-position-control`}>
			<Flex justify="space-between" className={'kadence-gradient-position_header'}>
				<FlexItem>
					<label className="kadence-gradient-position__label">{__('Position', 'kadence-blocks')}</label>
				</FlexItem>
			</Flex>
			<FocalPointPicker
				className="kbs-focal-point-picker kbs-gradient-control__focal-point-picker"
				style={{
					'--background-gradient': gradient,
				}}
				url={''}
				value={position}
				onChange={(position) => onPositionChange(position)}
			/>
		</div>
	);
};
const GradientShapePicker = ({ gradientAST, hasGradient, onChange }) => {
	let shape = DEFAULT_RADIAL_GRADIENT_SHAPE;
	if (
		gradientAST?.orientation &&
		gradientAST?.orientation?.type &&
		'shape' === gradientAST?.orientation?.type &&
		gradientAST?.orientation?.value
	) {
		shape = gradientAST?.orientation && gradientAST?.orientation?.value;
	}
	const onShapeChange = (newShape) => {
		onChange(
			serializeGradient({
				...gradientAST,
				orientation: {
					type: 'shape',
					value: newShape,
					at: gradientAST.orientation.at,
				},
			})
		);
	};
	return (
		<SelectControl
			__next40pxDefaultSize
			__nextHasNoMarginBottom
			className="kbs-gradient-control__shape-picker kbs-core-select-control"
			label={__('Shape', 'kadence-blocks')}
			labelPosition="top"
			onChange={onShapeChange}
			options={[
				{ value: 'ellipse', label: __('Ellipse', 'kadence-blocks') },
				{ value: 'circle', label: __('Circle', 'kadence-blocks') },
			]}
			value={hasGradient && shape}
		/>
	);
};

export const getGradientComputedValue = (value, ref, globalColors) => {
	if (value.startsWith('var(') && ref?.current) {
		// Get the raw CSS variable value without computing it
		const cssVar = value.replace('var(', '').split(',')[0].replace(')', '');
		// Get the raw value of the CSS variable
		const rawValue = window.getComputedStyle(ref.current).getPropertyValue(cssVar);

		// If we have a raw value, try to replace hex colors with their CSS variables
		if (rawValue) {
			// Get all global colors
			const computedStyle = window.getComputedStyle(ref.current);
			const colorMap = {};

			// Map computed colors to their CSS variables
			for (let i = 0; i < globalColors.length; i++) {
				const varSlug = globalColors[i]?.slug || '';
				const varName = `--kbs-colors-${varSlug.replace('theme-', '')}`;
				const computedColor = computedStyle.getPropertyValue(varName).trim();
				if (computedColor) {
					colorMap[computedColor.toLowerCase()] = `var(${varName})`;
				}
			}

			// Replace hex colors with their CSS variables
			let result = rawValue;
			Object.entries(colorMap).forEach(([hex, cssVar]) => {
				result = result.replace(new RegExp(hex, 'gi'), cssVar);
			});

			return result;
		}
		return value;
	}
	return value;
};

export default function GradientPicker({
	value,
	onChange,
	isRenderedInSidebar = true,
	globalClasses,
	containerRef,
	globalStylesCss,
	hasGradientPalette = true,
}) {
	const globalGradients = getGradientOptions();
	const globalColors = getColorOptions();
	const currentGradient = useMemo(
		() => (value.startsWith('var(') ? getGradientComputedValue(value, containerRef, globalColors) : value),
		[value, containerRef, globalColors]
	);
	const gradientAST = getGradientAstWithDefault(currentGradient);
	// On radial gradients the bar should display a linear gradient.
	// On radial gradients the bar represents a slice of the gradient from the center until the outside.
	// On liner gradients the bar represents the color stops from left to right independently of the angle.
	const background = getLinearGradientRepresentation(gradientAST);
	const hasGradient = gradientAST.value !== DEFAULT_GRADIENT;
	// Control points color option may be hex from presets, custom colors will be rgb.
	// The position should always be a percentage.
	const controlPoints = gradientAST.colorStops.map((colorStop) => ({
		color: getStopCssColor(colorStop),
		position: parseFloat(colorStop.length.value),
	}));
	return (
		<div className={'components-base-control kbs-control kbs-gradient-control'}>
			{hasGradientPalette && (
				<div className="kbs-gradient-swatches">
					{globalGradients.map((gradient) => {
						const isActive = 'var(--kbs-gradients-' + gradient.slug + ')' === value;
						return (
							<div key={gradient.slug} className="kbs-gradient-swatch">
								<Button
									key={gradient.slug}
									__next40pxDefaultSize
									className={clsx(
										'kbs-color-select-button',
										'kbs-color-select-control__select-button',
										{
											'is-selected': isActive,
										}
									)}
									label={gradient.name}
									onClick={() => {
										onChange('var(--kbs-gradients-' + gradient.slug + ')');
									}}
								>
									<ColorIndicator
										colorValue={'var(--kbs-gradients-' + gradient.slug + ')'}
										isChecked={isActive}
									/>
								</Button>
							</div>
						);
					})}
				</div>
			)}
			<CustomGradientBar
				isRenderedInSidebar={isRenderedInSidebar}
				background={background}
				hasGradient={hasGradient}
				value={controlPoints}
				globalClasses={globalClasses}
				containerRef={containerRef}
				globalColors={globalColors}
				globalStylesCss={globalStylesCss}
				onChange={(newControlPoints) => {
					onChange(serializeGradient(getGradientAstWithControlPoints(gradientAST, newControlPoints)));
				}}
			/>
			<Flex gap={3} className="kbs-gradient-control__ui-line">
				<div className="kbs-gradient-control__item kbs-gradient-control__type">
					<GradientTypePicker gradientAST={gradientAST} hasGradient={hasGradient} onChange={onChange} />
				</div>
				{gradientAST.type !== 'radial-gradient' && (
					<div className="kbs-gradient-control__item kbs-gradient-control__angle">
						<GradientAnglePicker gradientAST={gradientAST} hasGradient={hasGradient} onChange={onChange} />
					</div>
				)}
				{gradientAST.type === 'radial-gradient' && (
					<div className="kbs-gradient-control__item kbs-gradient-control__shape">
						<GradientShapePicker gradientAST={gradientAST} hasGradient={hasGradient} onChange={onChange} />
					</div>
				)}
			</Flex>
			{gradientAST.type !== 'linear-gradient' && (
				<Flex gap={3} className="kbs-gradient-control__ui-line">
					<div className="kbs-gradient-control__item kbs-gradient-control__position">
						<GradientPositionPicker
							gradient={value}
							gradientAST={gradientAST}
							hasGradient={hasGradient}
							onChange={onChange}
						/>
					</div>
				</Flex>
			)}
		</div>
	);
}
