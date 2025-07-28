import getFontSizeOptions from '../get-font-size-options';
/**
 * Get the label for a font size.
 */
export default function getFontSizeLabel(fontSize) {
	const fontSizeOptions = getFontSizeOptions();
	const fontSizeOption = fontSizeOptions.find((option) => option.key === fontSize);
	return fontSizeOption?.name || fontSize;
}
