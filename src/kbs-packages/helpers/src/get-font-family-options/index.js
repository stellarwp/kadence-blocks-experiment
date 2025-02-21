/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useSelect, useDispatch } from '@wordpress/data';
import { useEffect } from '@wordpress/element';

/**
 * Get standard font options
 * @returns {Array} Array of standard font options
 */
export const getStandardFontOptions = () => [
	{ label: 'Default', value: '', source: 'system' },
	{ label: 'Arial, Helvetica, sans-serif', value: 'Arial, Helvetica, sans-serif', source: 'system' },
	{ label: '"Arial Black", Gadget, sans-serif', value: '"Arial Black", Gadget, sans-serif', source: 'system' },
	{ label: 'Helvetica, sans-serif', value: 'Helvetica, sans-serif', source: 'system' },
	{ label: '"Comic Sans MS", cursive, sans-serif', value: '"Comic Sans MS", cursive, sans-serif', source: 'system' },
	{ label: 'Impact, Charcoal, sans-serif', value: 'Impact, Charcoal, sans-serif', source: 'system' },
	{ label: '"Lucida Sans Unicode", "Lucida Grande", sans-serif', value: '"Lucida Sans Unicode", "Lucida Grande", sans-serif', source: 'system' },
	{ label: 'Tahoma, Geneva, sans-serif', value: 'Tahoma, Geneva, sans-serif', source: 'system' },
	{ label: '"Trebuchet MS", Helvetica, sans-serif', value: '"Trebuchet MS", Helvetica, sans-serif', source: 'system' },
	{ label: 'Verdana, Geneva, sans-serif', value: 'Verdana, Geneva, sans-serif', source: 'system' },
	{ label: 'Georgia, serif', value: 'Georgia, serif', source: 'system' },
	{ label: '"Palatino Linotype", "Book Antiqua", Palatino, serif', value: '"Palatino Linotype", "Book Antiqua", Palatino, serif', source: 'system' },
	{ label: '"Times New Roman", Times, serif', value: '"Times New Roman", Times, serif', source: 'system' },
	{ label: 'Courier, monospace', value: 'Courier, monospace', source: 'system' },
	{ label: '"Lucida Console", Monaco, monospace', value: '"Lucida Console", Monaco, monospace', source: 'system' },
];

/**
 * Get all font options grouped by type
 * @returns {Object} Object containing font options array and loading state
 */
export const useFontOptions = () => {
	const { fonts, loaded } = useSelect((select) => {
		const { getFonts, areFontsLoaded } = select('kadenceblocks/data');
		const fontData = getFonts();
		return {
			fonts: fontData,
			loaded: areFontsLoaded()
		};
	}, []);

	const { fetchFonts } = useDispatch('kadenceblocks/data');

	useEffect(() => {
		if (!loaded) {
			fetchFonts();
		}
	}, [loaded, fetchFonts]);

	let options = [];

	// If not loaded yet, return standard fonts at minimum
	if (!loaded) {
		return {
            fontOptions: [],
			isLoadingFonts: true
		};
	} else {
        // Add standard fonts
        options.push({
            type: 'group',
            label: __('Standard Fonts', 'kadence-blocks'),
            options: getStandardFontOptions(),
        });
    }

	// Add theme fonts if available
	if (fonts?.theme) {
		const themeOptions = Object.entries(fonts.theme).map(([family, data]) => ({
			label: family,
			value: family,
			source: 'theme',
			google: false,
			weights: data.styles,
			isVariable: data.is_variable
		}));
		
		if (themeOptions.length) {
			options.push({
				type: 'group',
				label: __('Theme Global Fonts', 'kadence-blocks'),
				options: themeOptions,
			});
		}
	}

	// Add custom fonts if available
	if (fonts?.custom) {
		const customOptions = Object.entries(fonts.custom).map(([family, data]) => ({
			label: family,
			value: family,
			source: 'kadence_custom',
			google: false,
			weights: data.styles,
			isVariable: data.is_variable
		}));

		if (customOptions.length) {
			options.push({
				type: 'group',
				label: __('Custom Fonts', 'kadence-blocks'),
				options: customOptions,
			});
		}
	}

	// Add Google fonts
	if (fonts?.google) {
		const googleOptions = Object.entries(fonts.google).map(([family, data]) => ({
			label: data.family,
			value: family,
			source: 'google',
			google: true,
			weights: data.styles,
			isVariable: data.is_variable
		}));

		if (googleOptions.length) {
			options.push({
				type: 'group',
				label: __('Google Fonts', 'kadence-blocks'),
				options: googleOptions,
			});
		}
	}

	return {
		fontOptions: options,
		isLoadingFonts: !loaded
	};
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