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
} from './constants';

import RadioToggleGroupButtonUI from './ui-toggle-group';
import RadioToggleGroupInputUI from './ui-toggle-group-input';
import RadioToggleGroupFlexSizeUI from './ui-toggle-group-flex-size';
import RadioToggleGroupInputRangeUI from './ui-toggle-group-input-range';

export const getRadioConfig = (radioType, previewDirection) => {
	let UIComponent = RadioToggleGroupButtonUI;
	let controls;
	let advancedControls;

	switch (radioType) {
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
		case 'link-style':
		case 'linkStyle':
			controls = getLinkStyleControls();
			break;
		case 'max-width':
		case 'maxWidth':
			UIComponent = RadioToggleGroupInputRangeUI;
			controls = getMaxWidthControls();
			break;
		case 'max-height':
		case 'maxHeight':
			UIComponent = RadioToggleGroupInputRangeUI;
			break;
	}

	return { UIComponent, controls, advancedControls };
};

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
	}	
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
export const getLinkStyleControls = () => [
	{
		icon: arrowDown,
		title: __('None', 'kadence-blocks'),
		key: 'none',
	},
	{
		icon: arrowLeft,
		title: __('Underline', 'kadence-blocks'),
		key: 'underline',
	},
	{
		icon: arrowRight,
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
