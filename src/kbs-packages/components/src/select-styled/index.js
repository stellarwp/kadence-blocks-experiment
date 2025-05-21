/**
 * Select Styled
 */
import clsx from 'clsx';
/**
 * WordPress dependencies
 */
import { __, isRTL } from '@wordpress/i18n';
import { useMemo } from '@wordpress/element';

/**
 * External dependencies
 */
import Select from 'react-select';

import './editor.scss';

/**
 * Build the Font Select control
 *
 * @param {Object} props Component props.
 * @return {JSX.Element} Font select control.
 */
export default function SelectStyled(props) {
	const { className, ...rest } = props;
	return <Select {...rest} classNamePrefix="kbs-select" className={clsx('kbs-select-styled', className)} />;
}
