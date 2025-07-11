/**
 * WordPress dependencies
 */
import { useEffect, useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { PATTERN_STYLES } from '../utils/constants';
import { cssGenerator } from '@kadence/kbsHelpers';
import { getPresetOptions } from '@kadence/kbsHelpers';

const getSingleStylePresetBackgrounds = (globalStyleId, presetsOptions) => {
	const meta = {
		attributes: {
			background: {
				renderCSS: true,
				component: 'background',
				nonInheritable: true,
				type: 'object',
				selector: '--kbs-cont-',
				classPrefix: 'kbs-cont-bg-',
				hasLayers: true,
			},
		},
	};

	const backgrounds = presetsOptions.reduce((acc, option) => {
		// Get the preset data
		const rawPresetData = wp.data
			.select('kadenceblocks/global-styles')
			.getResolvedStyleData([globalStyleId], 'background', 'presets.' + option.value);

		const attributes = rawPresetData?.attributes || {};

		// Generate CSS
		const selector = `.preset-${globalStyleId}-${option.value}`;
		const css = new cssGenerator(selector);
		const reverseLayers = Array.isArray(attributes?.layers) ? [...attributes.layers].reverse() : [];

		if (reverseLayers.length > 0) {
			reverseLayers.forEach((layer, index) =>
				css.processBackgroundLayer(layer, index, meta.attributes.background, { previewDevice: 'desktop' }, meta)
			);
		}

		const cssOutput = css.generate();

		// Generate HTML structure
		const layersCount = Array.isArray(attributes?.layers) ? attributes.layers.length : 0;
		const reverseLayersForHTML = Array.isArray(attributes?.layers) ? [...attributes.layers].reverse() : [];

		let htmlLayers = '';
		for (let i = 0; i < layersCount; i++) {
			const layer = reverseLayersForHTML[i];
			const type = layer?.desktop?.type || 'color';
			const video = layer?.desktop?.video;
			const videoType = layer?.desktop?.videoType || 'local';
			const youtube = layer?.desktop?.youtube;
			const vimeo = layer?.desktop?.vimeo;
			const videoPoster = layer?.desktop?.image;

			// Skip first layer if no effects and not special types
			const anyBackgroundOpacity = layer?.Mobile?.opacity;
			if (i === 0 && type !== 'video' && type !== 'mask' && !anyBackgroundOpacity) {
				continue;
			}

			htmlLayers += `<div class="kbs-bg-layer ${meta.attributes.background.classPrefix}${i} bg-type-${type}">`;

			if (type === 'video') {
				if (videoType === 'local' && video) {
					htmlLayers += `<video src="${video}" class="kbs-bg-video" autoplay muted loop playsinline poster="${videoPoster || ''}"></video>`;
				} else if (videoType === 'youtube' && youtube) {
					htmlLayers += `<img src="https://img.youtube.com/vi/${youtube}/maxresdefault.jpg" class="kbs-bg-video" />`;
				} else if (videoType === 'vimeo' && vimeo) {
					htmlLayers += `<img src="https://vumbnail.com/${vimeo}.jpg" class="kbs-bg-video" />`;
				}
			}
			// Add mask rendering if needed
			if (type === 'mask') {
				htmlLayers += `<div class="kbs-mask-layer"></div>`;
			}

			htmlLayers += '</div>';
		}

		// Create the complete HTML with CSS
		const classes = `kbs-bg-preset-render preset-${globalStyleId}-${option.value}`;
		const hasNoBackground = !attributes?.layers?.length ? ' has-no-background' : '';

		acc[option.value] = {
			html: `<div class="${classes}${hasNoBackground}">${htmlLayers}</div>`,
			css: cssOutput + '.kbs-bg-preset-render {position: absolute;left: 0;right: 0;top: 0;bottom: 0;}',
		};

		return acc;
	}, {});

	return backgrounds;
};

/**
 * Custom hook to fetch and manage template data
 */
export const getPresetBackgrounds = () => {
	const [backgrounds, setBackgrounds] = useState({});
	const presetsOptions = getPresetOptions('background');
	useEffect(() => {
		let tempBackgrounds = {};

		PATTERN_STYLES.map((item) => {
			const backgrounds = getSingleStylePresetBackgrounds(item.value, presetsOptions);
			tempBackgrounds[item.value] = backgrounds;
		});
		setBackgrounds(tempBackgrounds);
	}, []);

	return backgrounds;
};
