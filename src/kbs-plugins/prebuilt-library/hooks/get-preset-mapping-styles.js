/**
 * WordPress dependencies
 */
import { useEffect, useState, useMemo } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { PATTERN_STYLES } from '../utils/constants';
import { cssGenerator } from '@kadence/kbsHelpers';
import { getGlobalStylesCSSOutput } from '@kadence/kbsHelpers';

/**
 * Custom hook to fetch and manage template data
 */
export const getPresetMappingStyles = () => {
	return {
		'kbs-base': '',
		'kbs-contrast': getGlobalStylesCSSOutput(['kbs-contrast']),
		'kbs-accent': getGlobalStylesCSSOutput(['kbs-accent']),
	};
};
