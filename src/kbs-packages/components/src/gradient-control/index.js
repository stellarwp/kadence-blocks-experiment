/**
 * External dependencies
 */

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { AnglePickerControl, Flex, FlexItem, SelectControl } from '@wordpress/components';
/**
 * Internal dependencies
 */
import CustomGradientBar from './gradient-bar';
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

export default function GradientPicker({ value, onChange, isRenderedInSidebar = true, globalClasses }) {
	const gradientAST = getGradientAstWithDefault(value);
	// On radial gradients the bar should display a linear gradient.
	// On radial gradients the bar represents a slice of the gradient from the center until the outside.
	// On liner gradients the bar represents the color stops from left to right independently of the angle.
	const background = getLinearGradientRepresentation(gradientAST);
	const hasGradient = gradientAST.value !== DEFAULT_GRADIENT;
	// Control points color option may be hex from presets, custom colors will be rgb.
	// The position should always be a percentage.
	const controlPoints = gradientAST.colorStops.map((colorStop) => ({
		color: getStopCssColor(colorStop),
		position: parseInt(colorStop.length.value),
	}));
	return (
		<div className={'components-base-control kbs-control kbs-gradient-control'}>
			<CustomGradientBar
				isRenderedInSidebar={isRenderedInSidebar}
				background={background}
				hasGradient={hasGradient}
				value={controlPoints}
				globalClasses={globalClasses}
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
