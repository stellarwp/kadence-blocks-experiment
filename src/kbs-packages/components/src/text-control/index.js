/**
 * Select Styled
 */
import clsx from 'clsx';
/**
 * WordPress dependencies
 */
import { TextControl as CoreTextControl } from '@wordpress/components';

import './editor.scss';

/**
 * Build the Font Select control
 *
 * @param {Object} props Component props.
 * @return {JSX.Element} Font select control.
 */
export default function TextControl(props) {
	const { className, ...rest } = props;
	return (
		<CoreTextControl
			{...rest}
			__next40pxDefaultSize
			__nextHasNoMarginBottom
			className={clsx('kbs-text-control kbs-input-control', className)}
		/>
	);
}
