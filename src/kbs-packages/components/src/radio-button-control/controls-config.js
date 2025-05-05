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
} from './constants';

import { JustifyToolbar, BlockVerticalAlignmentToolbar } from '@wordpress/blockEditor';
import RadioButtonUI from './ui';
import RadioTextButtonUI from './ui-text';
import RadioToggleGroupButtonUI from './ui-toggle-group';

export const getRadioConfig = (radioType, previewDirection) => {
	let UIComponent = RadioButtonUI;
	let controls;

	switch (radioType) {
		case 'justify':
			UIComponent = JustifyToolbar;
			break;
		case 'vertical':
			UIComponent = BlockVerticalAlignmentToolbar;
			break;
		case 'flex-wrap':
		case 'flexWrap':
			// UIComponent = RadioToggleGroupButtonUI;
			controls = getFlexWrapControls();
			break;
		case 'flex-direction':
		case 'flexDirection':
			controls = getFlexDirectionControls();
			break;
		case 'justify-content':
		case 'justifyContent':
			// UIComponent = RadioToggleGroupButtonUI;
			controls = getJustifyContentControls(previewDirection);
			break;
		case 'align-items':
		case 'alignItems':
			controls = getAlignItemsControls(previewDirection);
			break;
	}

	return { UIComponent, controls };
};

export const getFlexWrapControls = () => [
	{
		icon: wrap,
		title: __('Wrap', 'kadence-blocks'),
		align: 'wrap',
	},
	{
		icon: nowrap,
		title: __('No Wrap', 'kadence-blocks'),
		align: 'nowrap',
	},
];

export const getFlexDirectionControls = () => [
	{
		icon: arrowDown,
		title: __('Vertical Direction', 'kadence-blocks'),
		align: 'column',
	},
	{
		icon: arrowRight,
		title: __('Horizontal Direction', 'kadence-blocks'),
		align: 'row',
	},
	{
		icon: arrowUp,
		title: __('Vertical Reverse', 'kadence-blocks'),
		align: 'column-reverse',
	},
	{
		icon: arrowLeft,
		title: __('Horizontal Reverse', 'kadence-blocks'),
		align: 'row-reverse',
	},
];

export const getJustifyContentControls = (direction) => {
	const controlsByDirection = {
		column: [
			{
				icon: alignTop,
				title: __('Start', 'kadence-blocks'),
				align: 'flex-start',
			},
			{
				icon: alignCenter,
				title: __('Center', 'kadence-blocks'),
				align: 'center',
			},
			{
				icon: alignBottom,
				title: __('End', 'kadence-blocks'),
				align: 'flex-end',
			},
			{
				icon: alignStretch,
				title: __('Stretch', 'kadence-blocks'),
				align: 'stretch',
			},
			{
				icon: verticalSpaceBetween,
				title: __('Space Between', 'kadence-blocks'),
				align: 'space-between',
			},
			{
				icon: verticalSpaceAround,
				title: __('Space Around', 'kadence-blocks'),
				align: 'space-around',
			},
			{
				icon: verticalSpaceEvenly,
				title: __('Space Evenly', 'kadence-blocks'),
				align: 'space-evenly',
			},
		],
		'column-reverse': [
			{
				icon: justifyRight,
				title: __('Start', 'kadence-blocks'),
				align: 'flex-start',
			},
			{
				icon: justifyCenter,
				title: __('Center', 'kadence-blocks'),
				align: 'center',
			},
			{
				icon: justifyLeft,
				title: __('End', 'kadence-blocks'),
				align: 'flex-end',
			},
			{
				icon: justifyStretch,
				title: __('Stretch', 'kadence-blocks'),
				align: 'stretch',
			},
		],
		row: [
			{
				icon: justifyLeft,
				title: __('Start', 'kadence-blocks'),
				align: 'flex-start',
			},
			{
				icon: justifyCenter,
				title: __('Center', 'kadence-blocks'),
				align: 'center',
			},
			{
				icon: justifyRight,
				title: __('End', 'kadence-blocks'),
				align: 'flex-end',
			},
			{
				icon: justifySpaceBetween,
				title: __('Space Between', 'kadence-blocks'),
				align: 'space-between',
			},
			{
				icon: spaceAround,
				title: __('Space Around', 'kadence-blocks'),
				align: 'space-around',
			},
			{
				icon: spaceEvenly,
				title: __('Space Evenly', 'kadence-blocks'),
				align: 'space-evenly',
			},
		],
		'row-reverse': [
			{
				icon: justifyRight,
				title: __('Start', 'kadence-blocks'),
				align: 'flex-start',
			},
			{
				icon: justifyCenter,
				title: __('Center', 'kadence-blocks'),
				align: 'center',
			},
			{
				icon: justifyLeft,
				title: __('End', 'kadence-blocks'),
				align: 'flex-end',
			},
			{
				icon: justifySpaceBetween,
				title: __('Space Between', 'kadence-blocks'),
				align: 'space-between',
			},
			{
				icon: spaceAround,
				title: __('Space Around', 'kadence-blocks'),
				align: 'space-around',
			},
			{
				icon: spaceEvenly,
				title: __('Space Evenly', 'kadence-blocks'),
				align: 'space-evenly',
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
				align: 'stretch',
			},
			{
				icon: justifyLeft,
				title: __('Start', 'kadence-blocks'),
				align: 'flex-start',
			},
			{
				icon: justifyCenter,
				title: __('Center', 'kadence-blocks'),
				align: 'center',
			},
			{
				icon: justifyRight,
				title: __('End', 'kadence-blocks'),
				align: 'flex-end',
			},
		],
		'column-reverse': [
			{
				icon: justifyStretch,
				title: __('Stretch', 'kadence-blocks'),
				align: 'stretch',
			},
			{
				icon: justifyLeft,
				title: __('End', 'kadence-blocks'),
				align: 'flex-end',
			},
			{
				icon: justifyCenter,
				title: __('Center', 'kadence-blocks'),
				align: 'center',
			},
			{
				icon: justifyRight,
				title: __('Start', 'kadence-blocks'),
				align: 'flex-start',
			},
		],
		row: [
			{
				icon: alignStretch,
				title: __('Stretch', 'kadence-blocks'),
				align: 'stretch',
			},
			{
				icon: alignTop,
				title: __('Start', 'kadence-blocks'),
				align: 'flex-start',
			},
			{
				icon: alignCenter,
				title: __('Center', 'kadence-blocks'),
				align: 'center',
			},
			{
				icon: alignBottom,
				title: __('End', 'kadence-blocks'),
				align: 'flex-end',
			},
		],
		'row-reverse': [
			{
				icon: alignStretch,
				title: __('Stretch', 'kadence-blocks'),
				align: 'stretch',
			},
			{
				icon: alignBottom,
				title: __('End', 'kadence-blocks'),
				align: 'flex-end',
			},
			{
				icon: alignCenter,
				title: __('Center', 'kadence-blocks'),
				align: 'center',
			},
			{
				icon: alignTop,
				title: __('Start', 'kadence-blocks'),
				align: 'flex-start',
			},
		],
	};

	return controlsByDirection[direction] || [];
};
