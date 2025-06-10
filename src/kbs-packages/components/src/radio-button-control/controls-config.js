import { __ } from '@wordpress/i18n';
import {
	arrowUp,
	arrowLeft,
	arrowRight,
	arrowDown,
	justifyLeft,
	justifyCenter,
	justifyRight,
	justifySpaceBetween,
	justifyStretch,
	justifyTop,
	justifyBottom,
	formatBold,
	formatUnderline,
} from '@wordpress/icons';

import {
	alignBottom,
	alignCenter,
	alignTop,
	alignStretch,
	verticalSpaceBetween,
	verticalSpaceEvenly,
	verticalSpaceAround,
	spaceAround,
	spaceEvenly,
	wrap,
	nowrap,
	flexShrink,
	flexGrow,
	flexForce,
	flexAuto,
	noRepeat,
	repeat,
	repeatX,
	repeatY,
} from './constants';
import NoToggleInputUI from './ui-no-toggle-input';
import RadioToggleGroupButtonUI from './ui-toggle-group';
import RadioToggleGroupInputUI from './ui-toggle-group-input';
import RadioToggleGroupFlexSizeUI from './ui-toggle-group-flex-size';
import RadioToggleGroupInputRangeUI from './ui-toggle-group-input-range';
import RadioToggleGroupBackgroundSizeUI from './ui-toggle-group-background-size';
import RadioToggleGroupShadeRangeUI from './ui-toggle-group-shade-range';
import RadioToggleGroupInputRangeUINoUnit from './ui-toggle-group-input-range-no-unit';
export const getRadioConfig = (radioType, previewDirection) => {
	let UIComponent = RadioToggleGroupButtonUI;
	let controls;
	let advancedControls;

	switch (radioType) {
		case 'width':
		case 'height':
			UIComponent = RadioToggleGroupInputRangeUI;
			break;
		case 'color-mix':
		case 'colorMix':
			controls = getColorMixControls();
			break;
		case 'align-x':
		case 'alignX':
			controls = getAlignXControls();
			break;
		case 'align-y':
		case 'alignY':
			controls = getAlignYControls();
			break;
		case 'mask-size':
		case 'maskSize':
			controls = getMaskSizeControls();
			break;
		case 'divider-position':
		case 'dividerPosition':
			controls = getDividerPositionControls();
			break;
		case 'pattern-size':
		case 'patternSize':
			controls = getPatternSizeControls();
			UIComponent = RadioToggleGroupInputRangeUINoUnit;
			break;
		case 'color-mix-amount':
		case 'colorMixAmount':
			UIComponent = RadioToggleGroupShadeRangeUI;
			controls = getColorMixAmountControls();
			break;
		case 'color-shade':
		case 'colorShade':
			UIComponent = RadioToggleGroupShadeRangeUI;
			controls = getColorShadeControls();
			break;
		case 'color-transparent':
		case 'colorTransparent':
			UIComponent = RadioToggleGroupShadeRangeUI;
			controls = getColorTransparentControls();
			break;
		case 'flex-wrap':
		case 'flexWrap':
			controls = getFlexWrapControls();
			break;
		case 'flex-direction':
		case 'flexDirection':
			controls = getFlexDirectionControls();
			advancedControls = getFlexDirectionAdvancedControls();
			break;
		case 'justify-content':
		case 'justifyContent':
		case 'justifySelf':
			controls = getJustifyContentControls(previewDirection);
			advancedControls = getJustifyContentAdvancedControls(previewDirection);
			break;
		case 'align-content':
		case 'alignContent':
			controls = getAlignContentControls(previewDirection);
			break;
		case 'align-items':
		case 'alignItems':
		case 'alignSelf':
			controls = getAlignItemsControls(previewDirection);
			break;
		case 'row-gap':
		case 'rowGap':
			UIComponent = RadioToggleGroupInputUI;
			controls = getGapControls();
			break;
		case 'column-gap':
		case 'columnGap':
			UIComponent = RadioToggleGroupInputUI;
			controls = getGapControls();
			break;
		case 'flex':
			UIComponent = RadioToggleGroupFlexSizeUI;
			controls = getFlexSizeControls();
			break;
		case 'text-decoration':
		case 'textDecoration':
			controls = getTextDecorationControls();
			break;
		case 'max-width':
		case 'maxWidth':
			UIComponent = RadioToggleGroupInputRangeUI;
			controls = getMaxWidthControls();
			break;
		case 'max-height':
		case 'maxHeight':
		case 'minHeight':
		case 'min-height':
			UIComponent = RadioToggleGroupInputRangeUI;
			break;
		case 'opacity':
		case 'hoverOpacity':
		case 'backgroundOpacity':
			UIComponent = RadioToggleGroupInputRangeUI;
			break;
		case 'mix':
			UIComponent = RadioToggleGroupInputRangeUI;
			break;
		case 'objectFit':
			controls = getObjectFitControls();
			break;
		case 'backgroundSize':
		case 'background-size':
		case 'size':
			UIComponent = RadioToggleGroupBackgroundSizeUI;
			controls = getBackgroundSizeControls();
			break;
		case 'repeat':
		case 'background-repeat':
		case 'backgroundRepeat':
			controls = getBackgroundRepeatControls();
			break;
		case 'attachment':
		case 'background-attachment':
		case 'backgroundAttachment':
			controls = getBackgroundAttachmentControls();
			break;
	}

	return { UIComponent, controls, advancedControls };
};

export const getMaskSizeControls = () => [
	{
		title: __('Cover', 'kadence-blocks'),
		name: __('Cover', 'kadence-blocks'),
		key: 'cover',
	},
	{
		title: __('Contain', 'kadence-blocks'),
		name: __('Contain', 'kadence-blocks'),
		key: 'contain',
	},
	{
		title: __('Stretch', 'kadence-blocks'),
		name: __('Stretch', 'kadence-blocks'),
		key: 'stretch',
	},
];

export const getObjectFitControls = () => [
	{
		title: __('Cover', 'kadence-blocks'),
		name: __('Cover', 'kadence-blocks'),
		key: 'cover',
	},
	{
		title: __('Contain', 'kadence-blocks'),
		name: __('Contain', 'kadence-blocks'),
		key: 'contain',
	},
	{
		title: __('Fill', 'kadence-blocks'),
		name: __('Fill', 'kadence-blocks'),
		key: 'fill',
	},
	{
		title: __('None', 'kadence-blocks'),
		name: __('None', 'kadence-blocks'),
		key: 'none',
	},
];
export const getDividerPositionControls = () => [
	{
		title: __('Top', 'kadence-blocks'),
		icon: justifyTop,
		key: 'top',
	},
	{
		title: __('Bottom', 'kadence-blocks'),
		icon: justifyBottom,
		key: 'bottom',
	},
	{
		title: __('Left', 'kadence-blocks'),
		icon: justifyLeft,
		key: 'left',
	},
	{
		title: __('Right', 'kadence-blocks'),
		icon: justifyRight,
		key: 'right',
	},
];
export const getColorMixControls = () => [
	{
		title: __('Shade', 'kadence-blocks'),
		name: __('Shade', 'kadence-blocks'),
		key: 'shade',
	},
	{
		title: __('Transparent', 'kadence-blocks'),
		name: __('Transparent', 'kadence-blocks'),
		key: 'transparent',
	},
	{
		title: __('Mix', 'kadence-blocks'),
		name: __('Mix', 'kadence-blocks'),
		key: 'mix',
	},
];
export const getPatternSizeControls = () => [
	{
		title: __('X Small', 'kadence-blocks'),
		name: 'XS',
		key: '10',
	},
	{
		title: __('Small', 'kadence-blocks'),
		name: 'SM',
		key: '20',
	},
	{
		title: __('Medium', 'kadence-blocks'),
		name: 'MD',
		key: '30',
	},
	{
		title: __('Large', 'kadence-blocks'),
		name: 'LG',
		key: '40',
	},
	{
		title: __('X Large', 'kadence-blocks'),
		name: 'XL',
		key: '50',
	},
];
export const getColorShadeControls = () => [
	{
		title: __('70% Lighter', 'kadence-blocks'),
		name: '',
		key: 70,
	},
	{
		title: __('60% Lighter', 'kadence-blocks'),
		name: '',
		key: 60,
	},
	{
		title: __('50% Lighter', 'kadence-blocks'),
		name: '',
		key: 50,
	},
	{
		title: __('40% Lighter', 'kadence-blocks'),
		name: '',
		key: 40,
	},
	{
		title: __('30% Lighter', 'kadence-blocks'),
		name: '',
		key: 30,
	},
	{
		title: __('20% Lighter', 'kadence-blocks'),
		name: '',
		key: 20,
	},
	{
		title: __('10% Lighter', 'kadence-blocks'),
		name: '',
		key: 10,
	},
	{
		title: __('10% Darker', 'kadence-blocks'),
		name: '',
		key: -10,
	},
	{
		title: __('20% Darker', 'kadence-blocks'),
		name: '',
		key: -20,
	},
	{
		title: __('30% Darker', 'kadence-blocks'),
		name: '',
		key: -30,
	},
	{
		title: __('40% Darker', 'kadence-blocks'),
		name: '',
		key: -40,
	},
	{
		title: __('50% Darker', 'kadence-blocks'),
		name: '',
		key: -50,
	},
	{
		title: __('60% Darker', 'kadence-blocks'),
		name: '',
		key: -60,
	},
	{
		title: __('70% Darker', 'kadence-blocks'),
		name: '',
		key: -70,
	},
];

export const getColorTransparentControls = () => [
	{
		title: __('90% Opacity', 'kadence-blocks'),
		name: '',
		key: 10,
	},
	{
		title: __('80% Opacity', 'kadence-blocks'),
		name: '',
		key: 20,
	},
	{
		title: __('70% Opacity', 'kadence-blocks'),
		name: '',
		key: 30,
	},
	{
		title: __('60% Opacity', 'kadence-blocks'),
		name: '',
		key: 40,
	},
	{
		title: __('50% Opacity', 'kadence-blocks'),
		name: '',
		key: 50,
	},
	{
		title: __('40% Opacity', 'kadence-blocks'),
		name: '',
		key: 60,
	},
	{
		title: __('30% Opacity', 'kadence-blocks'),
		name: '',
		key: 70,
	},
	{
		title: __('20% Opacity', 'kadence-blocks'),
		name: '',
		key: 80,
	},
	{
		title: __('10% Opacity', 'kadence-blocks'),
		name: '',
		key: 90,
	},
];

export const getColorMixAmountControls = () => [
	{
		title: __('10%/90%', 'kadence-blocks'),
		name: '',
		key: 10,
	},
	{
		title: __('20%/80%', 'kadence-blocks'),
		name: '',
		key: 20,
	},
	{
		title: __('30%/70%', 'kadence-blocks'),
		name: '',
		key: 30,
	},
	{
		title: __('40%/60%', 'kadence-blocks'),
		name: '',
		key: 40,
	},
	{
		title: __('50%/50%', 'kadence-blocks'),
		name: '',
		key: 50,
	},
	{
		title: __('60%/40%', 'kadence-blocks'),
		name: '',
		key: 60,
	},
	{
		title: __('70%/30%', 'kadence-blocks'),
		name: '',
		key: 70,
	},
	{
		title: __('80%/20%', 'kadence-blocks'),
		name: '',
		key: 80,
	},
	{
		title: __('90%/10%', 'kadence-blocks'),
		name: '',
		key: 90,
	},
];

export const getBackgroundAttachmentControls = () => [
	{
		title: __('Scroll', 'kadence-blocks'),
		name: __('Scroll', 'kadence-blocks'),
		key: 'scroll',
	},
	{
		title: __('Fixed', 'kadence-blocks'),
		name: __('Fixed', 'kadence-blocks'),
		key: 'fixed',
	},
	{
		title: __('Parallax', 'kadence-blocks'),
		name: __('Parallax', 'kadence-blocks'),
		key: 'parallax',
	},
];
export const getBackgroundRepeatControls = () => [
	{
		title: __('No Repeat', 'kadence-blocks'),
		icon: noRepeat,
		key: 'no-repeat',
	},
	{
		title: __('Repeat', 'kadence-blocks'),
		icon: repeat,
		key: 'repeat',
	},
	{
		title: __('Repeat X', 'kadence-blocks'),
		icon: repeatX,
		key: 'repeat-x',
	},
	{
		title: __('Repeat Y', 'kadence-blocks'),
		icon: repeatY,
		key: 'repeat-y',
	},
];
export const getBackgroundSizeControls = () => [
	{
		title: __('Cover', 'kadence-blocks'),
		name: __('Cover', 'kadence-blocks'),
		key: 'cover',
	},
	{
		title: __('Contain', 'kadence-blocks'),
		name: __('Contain', 'kadence-blocks'),
		key: 'contain',
	},
	{
		title: __('Auto', 'kadence-blocks'),
		name: __('Auto', 'kadence-blocks'),
		key: 'auto',
	},
];
export const getFlexSizeControls = () => [
	{
		title: __('Auto', 'kadence-blocks'),
		icon: flexAuto,
		key: 'auto',
	},
	{
		title: __('Shrink if needed', 'kadence-blocks'),
		icon: flexShrink,
		key: 'shrink',
	},
	{
		title: __('Grow if possible', 'kadence-blocks'),
		icon: flexGrow,
		key: 'grow',
	},
	{
		title: __('Force size', 'kadence-blocks'),
		icon: flexForce,
		key: 'force',
	},
];
export const getGapControls = () => [
	{
		title: __('None', 'kadence-blocks'),
		name: '0',
		key: '0',
	},
	{
		title: __('X Small', 'kadence-blocks'),
		name: 'XS',
		key: 'xs',
	},
	{
		title: __('Small', 'kadence-blocks'),
		name: 'SM',
		key: 'sm',
	},
	{
		title: __('Medium', 'kadence-blocks'),
		name: 'MD',
		key: 'md',
	},
	{
		title: __('Large', 'kadence-blocks'),
		name: 'LG',
		key: 'lg',
	},
	{
		title: __('X Large', 'kadence-blocks'),
		name: 'XL',
		key: 'xl',
	},
];
export const getMaxWidthControls = () => [
	{
		title: __('Normal', 'kadence-blocks'),
		name: 'Normal',
		key: 'normal',
	},
	{
		title: __('Narrow', 'kadence-blocks'),
		name: 'Narrow',
		key: 'narrow',
	},
	{
		title: __('Full Width', 'kadence-blocks'),
		name: 'Full Width',
		key: 'full',
	},
];
export const getFlexWrapControls = () => [
	{
		icon: wrap,
		title: __('Wrap', 'kadence-blocks'),
		key: 'wrap',
	},
	{
		icon: nowrap,
		title: __('No Wrap', 'kadence-blocks'),
		key: 'nowrap',
	},
];

export const getFlexDirectionControls = () => [
	{
		icon: arrowDown,
		title: __('Vertical Direction', 'kadence-blocks'),
		key: 'column',
	},
	{
		icon: arrowRight,
		title: __('Horizontal Direction', 'kadence-blocks'),
		key: 'row',
	},
];
export const getTextDecorationControls = () => [
	{
		icon: formatBold,
		title: __('None', 'kadence-blocks'),
		key: 'none',
	},
	{
		icon: formatUnderline,
		title: __('Underline', 'kadence-blocks'),
		key: 'underline',
	},
	{
		icon: formatUnderline,
		title: __('Underline on Hover', 'kadence-blocks'),
		key: 'hover-underline',
	},
];
export const getFlexDirectionAdvancedControls = () => [
	{
		icon: arrowDown,
		title: __('Vertical Direction', 'kadence-blocks'),
		key: 'column',
	},
	{
		icon: arrowRight,
		title: __('Horizontal Direction', 'kadence-blocks'),
		key: 'row',
	},
	{
		icon: arrowUp,
		title: __('Vertical Reverse', 'kadence-blocks'),
		key: 'column-reverse',
	},
	{
		icon: arrowLeft,
		title: __('Horizontal Reverse', 'kadence-blocks'),
		key: 'row-reverse',
	},
];
export const getJustifyContentAdvancedControls = (direction) => {
	const controlsByDirection = {
		column: [
			{
				icon: alignTop,
				title: __('Start', 'kadence-blocks'),
				key: 'flex-start',
			},
			{
				icon: alignCenter,
				title: __('Center', 'kadence-blocks'),
				key: 'center',
			},
			{
				icon: alignBottom,
				title: __('End', 'kadence-blocks'),
				key: 'flex-end',
			},
			{
				icon: alignStretch,
				title: __('Stretch', 'kadence-blocks'),
				key: 'stretch',
			},
			{
				icon: verticalSpaceBetween,
				title: __('Space Between', 'kadence-blocks'),
				key: 'space-between',
			},
			{
				icon: verticalSpaceAround,
				title: __('Space Around', 'kadence-blocks'),
				key: 'space-around',
			},
			{
				icon: verticalSpaceEvenly,
				title: __('Space Evenly', 'kadence-blocks'),
				key: 'space-evenly',
			},
		],
		'column-reverse': [
			{
				icon: alignBottom,
				title: __('Start', 'kadence-blocks'),
				key: 'flex-start',
			},
			{
				icon: alignCenter,
				title: __('Center', 'kadence-blocks'),
				key: 'center',
			},
			{
				icon: alignTop,
				title: __('End', 'kadence-blocks'),
				key: 'flex-end',
			},
			{
				icon: alignStretch,
				title: __('Stretch', 'kadence-blocks'),
				key: 'stretch',
			},
			{
				icon: verticalSpaceBetween,
				title: __('Space Between', 'kadence-blocks'),
				key: 'space-between',
			},
			{
				icon: verticalSpaceAround,
				title: __('Space Around', 'kadence-blocks'),
				key: 'space-around',
			},
			{
				icon: verticalSpaceEvenly,
				title: __('Space Evenly', 'kadence-blocks'),
				key: 'space-evenly',
			},
		],
		row: [
			{
				icon: justifyLeft,
				title: __('Start', 'kadence-blocks'),
				key: 'flex-start',
			},
			{
				icon: justifyCenter,
				title: __('Center', 'kadence-blocks'),
				key: 'center',
			},
			{
				icon: justifyRight,
				title: __('End', 'kadence-blocks'),
				key: 'flex-end',
			},
			{
				icon: justifySpaceBetween,
				title: __('Space Between', 'kadence-blocks'),
				key: 'space-between',
			},
			{
				icon: spaceAround,
				title: __('Space Around', 'kadence-blocks'),
				key: 'space-around',
			},
			{
				icon: spaceEvenly,
				title: __('Space Evenly', 'kadence-blocks'),
				key: 'space-evenly',
			},
		],
		'row-reverse': [
			{
				icon: justifyRight,
				title: __('Start', 'kadence-blocks'),
				key: 'flex-start',
			},
			{
				icon: justifyCenter,
				title: __('Center', 'kadence-blocks'),
				key: 'center',
			},
			{
				icon: justifyLeft,
				title: __('End', 'kadence-blocks'),
				key: 'flex-end',
			},
			{
				icon: justifySpaceBetween,
				title: __('Space Between', 'kadence-blocks'),
				key: 'space-between',
			},
			{
				icon: spaceAround,
				title: __('Space Around', 'kadence-blocks'),
				key: 'space-around',
			},
			{
				icon: spaceEvenly,
				title: __('Space Evenly', 'kadence-blocks'),
				key: 'space-evenly',
			},
		],
	};

	return controlsByDirection[direction] || [];
};
export const getAlignXControls = () => [
	{
		icon: justifyLeft,
		title: __('Left', 'kadence-blocks'),
		key: 'min',
	},
	{
		icon: justifyCenter,
		title: __('Center', 'kadence-blocks'),
		key: 'mid',
	},
	{
		icon: justifyRight,
		title: __('Right', 'kadence-blocks'),
		key: 'max',
	},
];
export const getAlignYControls = () => [
	{
		icon: alignTop,
		title: __('Top', 'kadence-blocks'),
		key: 'min',
	},
	{
		icon: alignCenter,
		title: __('Center', 'kadence-blocks'),
		key: 'mid',
	},
	{
		icon: alignBottom,
		title: __('Bottom', 'kadence-blocks'),
		key: 'max',
	},
];
export const getJustifyContentControls = (direction) => {
	const controlsByDirection = {
		column: [
			{
				icon: alignTop,
				title: __('Start', 'kadence-blocks'),
				key: 'flex-start',
			},
			{
				icon: alignCenter,
				title: __('Center', 'kadence-blocks'),
				key: 'center',
			},
			{
				icon: alignBottom,
				title: __('End', 'kadence-blocks'),
				key: 'flex-end',
			},
			{
				icon: alignStretch,
				title: __('Stretch', 'kadence-blocks'),
				key: 'stretch',
			},
			{
				icon: verticalSpaceBetween,
				title: __('Space Between', 'kadence-blocks'),
				key: 'space-between',
			},
		],
		'column-reverse': [
			{
				icon: alignBottom,
				title: __('Start', 'kadence-blocks'),
				key: 'flex-start',
			},
			{
				icon: alignCenter,
				title: __('Center', 'kadence-blocks'),
				key: 'center',
			},
			{
				icon: alignTop,
				title: __('End', 'kadence-blocks'),
				key: 'flex-end',
			},
			{
				icon: alignStretch,
				title: __('Stretch', 'kadence-blocks'),
				key: 'stretch',
			},
			{
				icon: verticalSpaceBetween,
				title: __('Space Between', 'kadence-blocks'),
				key: 'space-between',
			},
		],
		row: [
			{
				icon: justifyLeft,
				title: __('Start', 'kadence-blocks'),
				key: 'flex-start',
			},
			{
				icon: justifyCenter,
				title: __('Center', 'kadence-blocks'),
				key: 'center',
			},
			{
				icon: justifyRight,
				title: __('End', 'kadence-blocks'),
				key: 'flex-end',
			},
			{
				icon: justifySpaceBetween,
				title: __('Space Between', 'kadence-blocks'),
				key: 'space-between',
			},
		],
		'row-reverse': [
			{
				icon: justifyRight,
				title: __('Start', 'kadence-blocks'),
				key: 'flex-start',
			},
			{
				icon: justifyCenter,
				title: __('Center', 'kadence-blocks'),
				key: 'center',
			},
			{
				icon: justifyLeft,
				title: __('End', 'kadence-blocks'),
				key: 'flex-end',
			},
			{
				icon: justifySpaceBetween,
				title: __('Space Between', 'kadence-blocks'),
				key: 'space-between',
			},
		],
	};

	return controlsByDirection[direction] || [];
};

export const getAlignItemsControls = (direction) => {
	const controlsByDirection = {
		column: [
			{
				icon: justifyStretch,
				title: __('Stretch', 'kadence-blocks'),
				key: 'stretch',
			},
			{
				icon: justifyLeft,
				title: __('Start', 'kadence-blocks'),
				key: 'flex-start',
			},
			{
				icon: justifyCenter,
				title: __('Center', 'kadence-blocks'),
				key: 'center',
			},
			{
				icon: justifyRight,
				title: __('End', 'kadence-blocks'),
				key: 'flex-end',
			},
		],
		'column-reverse': [
			{
				icon: justifyStretch,
				title: __('Stretch', 'kadence-blocks'),
				key: 'stretch',
			},
			{
				icon: justifyLeft,
				title: __('End', 'kadence-blocks'),
				key: 'flex-end',
			},
			{
				icon: justifyCenter,
				title: __('Center', 'kadence-blocks'),
				key: 'center',
			},
			{
				icon: justifyRight,
				title: __('Start', 'kadence-blocks'),
				key: 'flex-start',
			},
		],
		row: [
			{
				icon: alignStretch,
				title: __('Stretch', 'kadence-blocks'),
				key: 'stretch',
			},
			{
				icon: alignTop,
				title: __('Start', 'kadence-blocks'),
				key: 'flex-start',
			},
			{
				icon: alignCenter,
				title: __('Center', 'kadence-blocks'),
				key: 'center',
			},
			{
				icon: alignBottom,
				title: __('End', 'kadence-blocks'),
				key: 'flex-end',
			},
		],
		'row-reverse': [
			{
				icon: alignStretch,
				title: __('Stretch', 'kadence-blocks'),
				key: 'stretch',
			},
			{
				icon: alignBottom,
				title: __('Start', 'kadence-blocks'),
				key: 'flex-start',
			},
			{
				icon: alignCenter,
				title: __('Center', 'kadence-blocks'),
				key: 'center',
			},
			{
				icon: alignTop,
				title: __('End', 'kadence-blocks'),
				key: 'flex-end',
			},
		],
	};

	return controlsByDirection[direction] || [];
};
export const getAlignContentControls = (direction) => {
	const controlsByDirection = {
		column: [
			{
				icon: justifyLeft,
				title: __('Start', 'kadence-blocks'),
				key: 'flex-start',
			},
			{
				icon: justifyCenter,
				title: __('Center', 'kadence-blocks'),
				key: 'center',
			},
			{
				icon: justifyRight,
				title: __('End', 'kadence-blocks'),
				key: 'flex-end',
			},
			{
				icon: justifySpaceBetween,
				title: __('Space Between', 'kadence-blocks'),
				key: 'space-between',
			},
			{
				icon: spaceAround,
				title: __('Space Around', 'kadence-blocks'),
				key: 'space-around',
			},
			{
				icon: spaceEvenly,
				title: __('Space Evenly', 'kadence-blocks'),
				key: 'space-evenly',
			},
		],
		'column-reverse': [
			{
				icon: justifyRight,
				title: __('Start', 'kadence-blocks'),
				key: 'flex-start',
			},
			{
				icon: justifyCenter,
				title: __('Center', 'kadence-blocks'),
				key: 'center',
			},
			{
				icon: justifyLeft,
				title: __('End', 'kadence-blocks'),
				key: 'flex-end',
			},
			{
				icon: justifySpaceBetween,
				title: __('Space Between', 'kadence-blocks'),
				key: 'space-between',
			},
			{
				icon: spaceAround,
				title: __('Space Around', 'kadence-blocks'),
				key: 'space-around',
			},
			{
				icon: spaceEvenly,
				title: __('Space Evenly', 'kadence-blocks'),
				key: 'space-evenly',
			},
		],
		row: [
			{
				icon: alignTop,
				title: __('Start', 'kadence-blocks'),
				key: 'flex-start',
			},
			{
				icon: alignCenter,
				title: __('Center', 'kadence-blocks'),
				key: 'center',
			},
			{
				icon: alignBottom,
				title: __('End', 'kadence-blocks'),
				key: 'flex-end',
			},
			{
				icon: alignStretch,
				title: __('Stretch', 'kadence-blocks'),
				key: 'stretch',
			},
			{
				icon: verticalSpaceBetween,
				title: __('Space Between', 'kadence-blocks'),
				key: 'space-between',
			},
			{
				icon: verticalSpaceAround,
				title: __('Space Around', 'kadence-blocks'),
				key: 'space-around',
			},
			{
				icon: verticalSpaceEvenly,
				title: __('Space Evenly', 'kadence-blocks'),
				key: 'space-evenly',
			},
		],
		'row-reverse': [
			{
				icon: alignBottom,
				title: __('Start', 'kadence-blocks'),
				key: 'flex-start',
			},
			{
				icon: alignCenter,
				title: __('Center', 'kadence-blocks'),
				key: 'center',
			},
			{
				icon: alignTop,
				title: __('End', 'kadence-blocks'),
				key: 'flex-end',
			},
			{
				icon: alignStretch,
				title: __('Stretch', 'kadence-blocks'),
				key: 'stretch',
			},
			{
				icon: verticalSpaceBetween,
				title: __('Space Between', 'kadence-blocks'),
				key: 'space-between',
			},
			{
				icon: verticalSpaceAround,
				title: __('Space Around', 'kadence-blocks'),
				key: 'space-around',
			},
			{
				icon: verticalSpaceEvenly,
				title: __('Space Evenly', 'kadence-blocks'),
				key: 'space-evenly',
			},
		],
	};

	return controlsByDirection[direction] || [];
};
