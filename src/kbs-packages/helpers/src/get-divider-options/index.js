import { useSelect } from '@wordpress/data';
import { useEffect, useMemo } from '@wordpress/element';
import { useSettings } from '@wordpress/block-editor';
import { dividers, sideDividers } from '../constants/dividers';
/**
 * Get an options array from the global styles preset object.
 */
export default function getDividerOptions() {
	return { horizontal: dividers, vertical: sideDividers };
}
