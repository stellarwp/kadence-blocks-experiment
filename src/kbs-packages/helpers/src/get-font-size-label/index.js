import { FONT_SIZES_MAP } from '../constants';
/**
 * Get the label for a font size.
 */
export default function getFontSizeLabel(fontSize) {
	const fontSizeOption = FONT_SIZES_MAP.find((option) => option.value === fontSize);
	return fontSizeOption?.name || fontSize;
}
