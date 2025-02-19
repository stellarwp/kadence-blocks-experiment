/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Get standard font options
 * @returns {Array} Array of standard font options
 */
export const getStandardFontOptions = () => [
	{ label: 'Default', value: '', google: false },
	{ label: 'Arial, Helvetica, sans-serif', value: 'Arial, Helvetica, sans-serif', google: false },
	{ label: '"Arial Black", Gadget, sans-serif', value: '"Arial Black", Gadget, sans-serif', google: false },
	{ label: 'Helvetica, sans-serif', value: 'Helvetica, sans-serif', google: false },
	{ label: '"Comic Sans MS", cursive, sans-serif', value: '"Comic Sans MS", cursive, sans-serif', google: false },
	{ label: 'Impact, Charcoal, sans-serif', value: 'Impact, Charcoal, sans-serif', google: false },
	{ label: '"Lucida Sans Unicode", "Lucida Grande", sans-serif', value: '"Lucida Sans Unicode", "Lucida Grande", sans-serif', google: false },
	{ label: 'Tahoma, Geneva, sans-serif', value: 'Tahoma, Geneva, sans-serif', google: false },
	{ label: '"Trebuchet MS", Helvetica, sans-serif', value: '"Trebuchet MS", Helvetica, sans-serif', google: false },
	{ label: 'Verdana, Geneva, sans-serif', value: 'Verdana, Geneva, sans-serif', google: false },
	{ label: 'Georgia, serif', value: 'Georgia, serif', google: false },
	{ label: '"Palatino Linotype", "Book Antiqua", Palatino, serif', value: '"Palatino Linotype", "Book Antiqua", Palatino, serif', google: false },
	{ label: '"Times New Roman", Times, serif', value: '"Times New Roman", Times, serif', google: false },
	{ label: 'Courier, monospace', value: 'Courier, monospace', google: false },
	{ label: '"Lucida Console", Monaco, monospace', value: '"Lucida Console", Monaco, monospace', google: false },
];

/**
 * Get theme font options if Kadence theme is active
 * @returns {Array} Array of theme font options
 */
export const getThemeFontOptions = () => {
	const isKadenceT = (typeof kadence_blocks_params !== 'undefined' && kadence_blocks_params?.isKadenceT);
	if (!isKadenceT) return [];

	return [
		{ label: 'Inherit Heading Font Family', value: 'var( --global-heading-font-family, inherit )', google: false },
		{ label: 'Inherit Body Font Family', value: 'var( --global-body-font-family, inherit )', google: false },
	];
};

/**
 * Get Google font options from kadence_blocks_params
 * @returns {Array} Array of Google font options
 */
export const getGoogleFontOptions = () => {
	if (typeof kadence_blocks_params === 'undefined' || !kadence_blocks_params.g_font_names) {
		return [];
	}

	return kadence_blocks_params.g_font_names.map((name) => ({
		label: name,
		value: name,
		google: true
	}));
};

/**
 * Get custom font options from kadence_blocks_params
 * @returns {Array} Array of custom font options
 */
export const getCustomFontOptions = () => {
	if (typeof kadence_blocks_params === 'undefined' || !kadence_blocks_params.c_fonts) {
		return [];
	}

	return Object.keys(kadence_blocks_params.c_fonts).map(font => {
		const name = kadence_blocks_params.c_fonts[font].name;
		const weights = Object.keys(kadence_blocks_params.c_fonts[font].weights).map(weight => ({
			value: kadence_blocks_params.c_fonts[font].weights[weight],
			label: kadence_blocks_params.c_fonts[font].weights[weight],
		}));
		const styles = Object.keys(kadence_blocks_params.c_fonts[font].styles).map(style => ({
			value: kadence_blocks_params.c_fonts[font].weights[style],
			label: kadence_blocks_params.c_fonts[font].weights[style],
		}));

		return {
			label: name,
			value: name,
			google: false,
			weights,
			styles,
		};
	});
};

/**
 * Get all font options grouped by type
 * @returns {Array} Array of font option groups
 */
export const getFontOptions = () => {
	let options = [];

	// Add theme fonts if available
	const themeFonts = getThemeFontOptions();
	if (themeFonts.length) {
		options.push({
			type: 'group',
			label: __('Theme Global Fonts', 'kadence-blocks'),
			options: themeFonts,
		});
	}

	// Add custom fonts if available
	const customFonts = getCustomFontOptions();
	if (customFonts.length) {
		options.push({
			type: 'group',
			label: __('Custom Fonts', 'kadence-blocks'),
			options: customFonts,
		});
	}

	// Add standard fonts
	options.push({
		type: 'group',
		label: __('Standard Fonts', 'kadence-blocks'),
		options: getStandardFontOptions(),
	});

	// Add Google fonts
	const googleFonts = getGoogleFontOptions();
	if (googleFonts.length) {
		options.push({
			type: 'group',
			label: __('Google Fonts', 'kadence-blocks'),
			options: googleFonts,
		});
	}

	// Allow filtering of font options
	if (typeof window.wp !== 'undefined' && window.wp.hooks) {
		options = window.wp.hooks.applyFilters('kadence.typography_options', options);
	}

	return options;
};

/**
 * Get font weight options for a specific font
 * @param {string} fontFamily The font family to get weights for
 * @param {string} fontGroup Optional font group (heading, body, button)
 * @returns {Array} Array of font weight options
 */
export const getFontWeightOptions = (fontFamily, fontGroup = '') => {
	const isKadenceT = (typeof kadence_blocks_params !== 'undefined' && kadence_blocks_params?.isKadenceT);
	
	// System font weights
	const systemWeights = [
		{ value: 'inherit', label: __('Inherit', 'kadence-blocks') },
		{ value: '100', label: __('Thin 100', 'kadence-blocks') },
		{ value: '200', label: __('Extra-Light 200', 'kadence-blocks') },
		{ value: '300', label: __('Light 300', 'kadence-blocks') },
		{ value: '400', label: __('Regular', 'kadence-blocks') },
		{ value: '500', label: __('Medium 500', 'kadence-blocks') },
		{ value: '600', label: __('Semi-Bold 600', 'kadence-blocks') },
		{ value: '700', label: __('Bold 700', 'kadence-blocks') },
		{ value: '800', label: __('Extra-Bold 800', 'kadence-blocks') },
		{ value: '900', label: __('Ultra-Bold 900', 'kadence-blocks') },
	];

	// Standard weights
	let standardWeights = [
		{ value: 'inherit', label: __('Inherit', 'kadence-blocks') },
		{ value: '400', label: __('Normal', 'kadence-blocks') },
		{ value: 'bold', label: __('Bold', 'kadence-blocks') },
	];

	// Theme-specific weights
	if (isKadenceT && fontGroup) {
		if (fontGroup === 'heading' && kadence_blocks_params?.headingWeights) {
			standardWeights = kadence_blocks_params.headingWeights;
		} else if (fontGroup === 'body' && kadence_blocks_params?.bodyWeights) {
			standardWeights = kadence_blocks_params.bodyWeights;
		} else if (fontGroup === 'button' && kadence_blocks_params?.buttonWeights) {
			standardWeights = kadence_blocks_params.buttonWeights;
		}
	}

	// System font
	if (fontFamily === '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"') {
		return systemWeights;
	}

	// Theme variable fonts
	if (fontFamily === 'var( --global-heading-font-family, inherit )') {
		return kadence_blocks_params?.headingWeights || standardWeights;
	}
	if (fontFamily === 'var( --global-body-font-family, inherit )') {
		return kadence_blocks_params?.bodyWeights || standardWeights;
	}

	// Google fonts
	if (typeof kadence_blocks_params !== 'undefined' && kadence_blocks_params.g_fonts && kadence_blocks_params.g_fonts[fontFamily]) {
		return kadence_blocks_params.g_fonts[fontFamily].w.map(opt => ({
			label: opt === 'regular' ? __('Regular', 'kadence-blocks') : opt,
			value: opt === 'regular' ? '400' : opt
		}));
	}

	// Custom fonts
	if (typeof kadence_blocks_params !== 'undefined' && kadence_blocks_params.c_fonts) {
		const customFont = Object.values(kadence_blocks_params.c_fonts).find(font => font.name === fontFamily);
		if (customFont?.weights) {
			return customFont.weights;
		}
	}

	return standardWeights;
};

/**
 * Get font style options for a specific font
 * @param {string} fontFamily The font family to get styles for
 * @returns {Array} Array of font style options
 */
export const getFontStyleOptions = (fontFamily) => {
	const standardStyles = [
		{ value: 'normal', label: __('Normal', 'kadence-blocks') },
		{ value: 'italic', label: __('Italic', 'kadence-blocks') },
	];

	// Google fonts
	if (typeof kadence_blocks_params !== 'undefined' && kadence_blocks_params.g_fonts && kadence_blocks_params.g_fonts[fontFamily]) {
		return kadence_blocks_params.g_fonts[fontFamily].i.map(opt => ({
			label: __(`${opt.charAt(0).toUpperCase()}${opt.slice(1)}`, 'kadence-blocks'),
			value: opt
		}));
	}

	// Custom fonts
	if (typeof kadence_blocks_params !== 'undefined' && kadence_blocks_params.c_fonts) {
		const customFont = Object.values(kadence_blocks_params.c_fonts).find(font => font.name === fontFamily);
		if (customFont?.styles) {
			return customFont.styles;
		}
	}

	return standardStyles;
}; 