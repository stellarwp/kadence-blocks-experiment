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
	{ label: 'System Default', value: 'var(--kbs-font-family-system)', source: 'system' },
	{ label: 'Arial, Helvetica, sans-serif', value: 'Arial, Helvetica, sans-serif', source: 'system' },
	{ label: '"Arial Black", Gadget, sans-serif', value: '"Arial Black", Gadget, sans-serif', source: 'system' },
	{ label: 'Helvetica, sans-serif', value: 'Helvetica, sans-serif', source: 'system' },
	{ label: '"Comic Sans MS", cursive, sans-serif', value: '"Comic Sans MS", cursive, sans-serif', source: 'system' },
	{ label: 'Impact, Charcoal, sans-serif', value: 'Impact, Charcoal, sans-serif', source: 'system' },
	{
		label: '"Lucida Sans Unicode", "Lucida Grande", sans-serif',
		value: '"Lucida Sans Unicode", "Lucida Grande", sans-serif',
		source: 'system',
	},
	{ label: 'Tahoma, Geneva, sans-serif', value: 'Tahoma, Geneva, sans-serif', source: 'system' },
	{
		label: '"Trebuchet MS", Helvetica, sans-serif',
		value: '"Trebuchet MS", Helvetica, sans-serif',
		source: 'system',
	},
	{ label: 'Verdana, Geneva, sans-serif', value: 'Verdana, Geneva, sans-serif', source: 'system' },
	{ label: 'Georgia, serif', value: 'Georgia, serif', source: 'system' },
	{
		label: '"Palatino Linotype", "Book Antiqua", Palatino, serif',
		value: '"Palatino Linotype", "Book Antiqua", Palatino, serif',
		source: 'system',
	},
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
			loaded: areFontsLoaded(),
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
			isLoadingFonts: true,
		};
	}

	// Add theme fonts if available
	if (fonts?.theme) {
		const themeOptions = Object.entries(fonts.theme).map(([family, data]) => ({
			label: data?.label || family,
			value: family,
			source: 'theme',
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
		}));

		if (customOptions.length) {
			options.push({
				type: 'group',
				label: __('Custom Fonts', 'kadence-blocks'),
				options: customOptions,
			});
		}
	}
	// Add standard fonts
	options.push({
		type: 'group',
		label: __('Standard Fonts', 'kadence-blocks'),
		options: getStandardFontOptions(),
		source: 'standard',
	});
	// Add Google fonts
	if (fonts?.google) {
		const googleOptions = Object.entries(fonts.google).map(([family, data]) => ({
			label: data.family,
			value: family,
			source: 'google',
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
		isLoadingFonts: !loaded,
	};
};

/**
 * Builds a list of font style and weight options based on font family faces.
 * Defaults to the standard font styles and weights if no font family faces are provided.
 *
 * @param {string} fontFamily font family value
 * @return {Object} new object with combined and separated font style and weight properties
 */
export function getFontStylesAndWeights(fontFamily) {
	// System font weights
	const systemWeights = [
		{ value: '', label: __('Default', 'kadence-blocks') },
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
	const standardWeights = [
		{ value: '', label: __('Default', 'kadence-blocks') },
		{ value: 'normal', label: __('Normal', 'kadence-blocks') },
		{ value: 'bold', label: __('Bold', 'kadence-blocks') },
	];
	// Standard styles
	const standardStyles = [
		{ value: '', label: __('Default', 'kadence-blocks') },
		{ value: 'normal', label: __('Normal', 'kadence-blocks') },
		{ value: 'italic', label: __('Italic', 'kadence-blocks') },
	];

	// Standard Combined
	const standardCombined = [
		{ value: '', label: __('Default', 'kadence-blocks') },
		{ value: 'normal', label: __('Normal', 'kadence-blocks') },
		{ value: '400italic', label: __('Italic', 'kadence-blocks') },
		{ value: 'normal', label: __('Normal', 'kadence-blocks') },
	];

	// Get fonts from the data store
	const { fonts, loaded } = useSelect((select) => {
		const { getFonts, areFontsLoaded } = select('kadenceblocks/data');
		return {
			fonts: getFonts() || {},
			loaded: areFontsLoaded(),
		};
	}, []);

	// Return standard weights if no fonts data
	if (!fonts || !loaded) {
		return {
			type: 'static',
			weights: standardWeights,
			styles: standardStyles,
			combined: standardCombined,
			fontsLoaded: loaded,
		};
	}

	// Check theme fonts
	if (fonts.theme && fonts.theme[fontFamily]) {
		const themeFont = fonts.theme[fontFamily];
		if (themeFont.styles && themeFont.styles.length) {
			return {
				fontsLoaded: true,
				type: 'static',
				options: themeFont.styles.map((style) => ({
					value: style,
					label: style === 'regular' ? __('Regular', 'kadence-blocks') : style,
				})),
			};
		}
	}

	// Check custom fonts
	if (fonts.custom && fonts.custom[fontFamily]) {
		const customFont = fonts.custom[fontFamily];
		if (customFont.styles && customFont.styles.length) {
			return {
				fontsLoaded: true,
				type: 'static',
				options: customFont.styles.map((style) => ({
					value: style,
					label: style === 'regular' ? __('Regular', 'kadence-blocks') : style,
				})),
			};
		}
	}

	// Check Google fonts
	if (fonts.google && fonts.google[fontFamily]) {
		const googleFont = fonts.google[fontFamily];

		if (googleFont?.is_variable) {
			const axesWeights = googleFont.axes.filter((axis) => axis.tag === 'wght');
			const tempStyles = googleFont.variants.map((variant) => ({
				value: variant === 'regular' ? 'normal' : variant,
				label:
					variant === 'regular'
						? __('Normal', 'kadence-blocks')
						: variant === 'italic'
							? __('Italic', 'kadence-blocks')
							: variant,
			}));
			tempStyles.unshift({
				value: '',
				label: __('Default', 'kadence-blocks'),
			});
			return {
				fontsLoaded: true,
				type: 'variable',
				weights: [],
				styles: tempStyles,
				combined: [],
				minWeight: axesWeights[0].start,
				maxWeight: axesWeights[0].end,
			};
		}

		if (googleFont.variants && googleFont.variants.length) {
			const tempCombined = googleFont.variants.map((variant) => ({
				value: variant === 'regular' ? '400' : variant,
				label:
					variant === 'regular'
						? __('Normal', 'kadence-blocks')
						: variant === 'italic'
							? __('Italic', 'kadence-blocks')
							: variant,
			}));
			tempCombined.unshift({
				value: '',
				label: __('Default', 'kadence-blocks'),
			});
			return {
				fontsLoaded: true,
				type: 'static',
				weights: [],
				styles: [],
				combined: tempCombined,
			};
		}
	}

	// Return standard weights as fallback
	return {
		type: 'static',
		weights: standardWeights,
		styles: standardStyles,
		combined: standardCombined,
		fontsLoaded: loaded,
	};
}

/**
 * Custom hook to get font weight options for a specific font
 * @param {string} fontFamily The font family to get weights for
 * @returns {Array} Array of font weight options
 */
export const useFontWeightOptions = (fontFamily) => {
	// System font weights
	const systemWeights = [
		{ value: '', label: __('Default', 'kadence-blocks') },
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
	const standardWeights = [
		{ value: 'inherit', label: __('Inherit', 'kadence-blocks') },
		{ value: '400', label: __('Normal', 'kadence-blocks') },
		{ value: 'bold', label: __('Bold', 'kadence-blocks') },
	];

	// Theme variable fonts
	if (
		fontFamily === 'var( --global-heading-font-family, inherit )' ||
		fontFamily === 'var( --global-body-font-family, inherit )'
	) {
		return { type: 'static', options: systemWeights, fontsLoaded: true };
	}

	// Get fonts from the data store
	const { fonts, loaded } = useSelect((select) => {
		const { getFonts, areFontsLoaded } = select('kadenceblocks/data');
		return {
			fonts: getFonts() || {},
			loaded: areFontsLoaded(),
		};
	}, []);

	// Return standard weights if no fonts data
	if (!fonts || !loaded) {
		return { type: 'static', options: standardWeights, fontsLoaded: loaded };
	}

	// Check theme fonts
	if (fonts.theme && fonts.theme[fontFamily]) {
		const themeFont = fonts.theme[fontFamily];
		if (themeFont.styles && themeFont.styles.length) {
			return {
				fontsLoaded: true,
				type: 'static',
				options: themeFont.styles.map((style) => ({
					value: style,
					label: style === 'regular' ? __('Regular', 'kadence-blocks') : style,
				})),
			};
		}
	}

	// Check custom fonts
	if (fonts.custom && fonts.custom[fontFamily]) {
		const customFont = fonts.custom[fontFamily];
		if (customFont.styles && customFont.styles.length) {
			return {
				fontsLoaded: true,
				type: 'static',
				options: customFont.styles.map((style) => ({
					value: style,
					label: style === 'regular' ? __('Regular', 'kadence-blocks') : style,
				})),
			};
		}
	}

	// Check Google fonts
	if (fonts.google && fonts.google[fontFamily]) {
		const googleFont = fonts.google[fontFamily];

		if (googleFont.is_variable) {
			const axesWeights = googleFont.axes.filter((axis) => axis.tag === 'wght');
			return {
				fontsLoaded: true,
				type: 'variable',
				minWeight: axesWeights[0].start,
				maxWeight: axesWeights[0].end,
			};
		}

		if (googleFont.styles && googleFont.styles.length) {
			return {
				fontsLoaded: true,
				type: 'static',
				options: googleFont.styles.map((style) => ({
					value: style === 'regular' ? '400' : style,
					label: style === 'regular' ? __('Regular', 'kadence-blocks') : style,
				})),
			};
		}
	}

	// Return standard weights as fallback
	return { type: 'static', options: standardWeights, fontsLoaded: loaded };
};

/**
 * Get font weight options for a specific font - non-hook version
 * This is a wrapper around useFontWeightOptions for use in non-React contexts
 * @param {string} fontFamily The font family to get weights for
 * @param {string} fontGroup Optional font group (heading, body, button)
 * @returns {Array} Array of font weight options
 */
export const getFontWeightOptions = (fontFamily, fontGroup = '') => {
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
	const standardWeights = [
		{ value: 'inherit', label: __('Inherit', 'kadence-blocks') },
		{ value: '400', label: __('Normal', 'kadence-blocks') },
		{ value: 'bold', label: __('Bold', 'kadence-blocks') },
	];

	// System font
	if (
		fontFamily ===
		'-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"'
	) {
		return systemWeights;
	}

	// Theme variable fonts
	if (fontFamily === 'var( --global-heading-font-family, inherit )') {
		return systemWeights;
	}
	if (fontFamily === 'var( --global-body-font-family, inherit )') {
		return systemWeights;
	}

	// For non-system fonts, return standard weights as we can't access the store outside of React
	return standardWeights;
};
