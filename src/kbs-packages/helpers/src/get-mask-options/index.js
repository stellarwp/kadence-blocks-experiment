import { useSelect } from '@wordpress/data';
import { useEffect, useMemo } from '@wordpress/element';
import { useSettings } from '@wordpress/block-editor';
import { masks } from '../constants/masks';
/**
 * Get an options array from the global styles preset object.
 */
export default function getMaskOptions() {
	return masks;
}
