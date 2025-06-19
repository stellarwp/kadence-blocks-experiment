import { __ } from '@wordpress/i18n';
import { useSelect, useDispatch } from '@wordpress/data';
import { useEffect, useState, useRef, useMemo } from '@wordpress/element';
import { Button, Dropdown, ColorIndicator, SVG, Path, Popover } from '@wordpress/components';
import { plus } from '@wordpress/icons';

import './editor.scss';
/**
 * Build the component preset
 */
export default function Preview(props) {
	const { globalStyleId, isPaletteCreatorOpen = false, colorsSubTab = 'colors', customPalette, styleBookLocalGlobalStyles } = props;

	const tempColors = styleBookLocalGlobalStyles[globalStyleId]?.mappings?.colors || [];
	const tempGradients = styleBookLocalGlobalStyles[globalStyleId]?.mappings?.gradients || [];

	const cssVariables = useMemo(() => {
		let outputCssString = '';
		if (!customPalette?.colors || customPalette?.colors?.length === 0) {
			return '';
		}

		// Loop through global style ids
		customPalette?.colors?.forEach((color, index) => {
			if (color) {
				outputCssString += `  --kbs-colors-palette${index + 1}: ${color};\n`;
			}
		});
		Object.entries(tempGradients).forEach(([key, value]) => {
			if (value?.value) {
				outputCssString += `--kbs-gradients-${key}: ${value.value};\n`;
			}
		});
		return outputCssString;
	}, [customPalette?.colors]);

	const baseVariables = useMemo(() => {
		let outputCssString = '';
		if ( tempColors ) {
			// Loop through global style ids
			Object.entries(tempColors).forEach(([key, value]) => {
				if (value?.value) {
					outputCssString += `--kbs-colors-${key}: ${value.value};\n`;
				}
			});
		}
		if ( tempGradients ) {
			Object.entries(tempGradients).forEach(([key, value]) => {
				if (value?.value) {
					outputCssString += `--kbs-gradients-${key}: ${value.value};\n`;
				}
			});
		}
		return outputCssString;
	}, [tempColors, tempGradients]);
	const divRef = useRef(null);
	useEffect(() => {
		if (divRef.current) {
			if (cssVariables && isPaletteCreatorOpen) {
				divRef.current.setAttribute('style', cssVariables);
			} else {
				divRef.current.setAttribute('style', baseVariables);
			}
		}
	}, [cssVariables, divRef?.current, isPaletteCreatorOpen, baseVariables]);
	return (
		<div className="kbs-stylebook-preview-wrap">
			<div ref={divRef} className="kbs-color-example-wrap">
				<div className="kbs-color-example-shrink">
					<div
						className="kbs-color-example-inner"
						style={{
							background: colorsSubTab === 'gradients' ? 'var(--kbs-gradients-gradient5)' : undefined,
						}}
					>
						<div className="kbs-color-example-header">
							<div className="kbs-color-example-header-inner">
								<div className="kbs-color-example-header-logo">
									<svg
										class="kbs-example-logo"
										fill="currentColor"
										version="1.1"
										xmlns="http://www.w3.org/2000/svg"
										width="100%"
										height="100%"
										viewBox="0 0 512 422"
									>
										<path d="M308.49,149.956l-145.192,261.944l-155.041,0l222.713,-401.8l77.52,139.856Zm-72.274,173.694l48.916,88.25l-97.831,0l48.915,-88.25Zm10.445,-18.843l98.861,-178.356l158.221,285.449l-197.721,0l-59.361,-107.093Z"></path>
									</svg>
								</div>
								<div className="kbs-color-example-header-nav">
									<div className="kbs-color-example-header-nav-item">
										{__('Home', 'kadence-blocks')}
									</div>
									<div className="kbs-color-example-header-nav-item">
										{__('About', 'kadence-blocks')}
									</div>
									<div className="kbs-color-example-header-nav-item">
										{__('Contact', 'kadence-blocks')}
									</div>
									<div className="kbs-color-example-header-nav-item">
										{__('Blog', 'kadence-blocks')}
									</div>
								</div>
							</div>
						</div>
						<div className="kbs-color-example-hero">
							<div className="kbs-color-example-hero-text">
								<h2 className="kbs-color-example-hero-title kbs-example-hero2">
									{__('Visualize your website colors', 'kadence-blocks')}
								</h2>
								<p className="kbs-color-example-hero-description">
									{__(
										'See how your website will look with different color combinations.',
										'kadence-blocks'
									)}
								</p>
								<div className="kbs-color-example-hero-buttons kbs-color-example-buttons">
									<div className="kbs-color-example-btn kbs-color-btns-hero-primary">
										{__('Primary Button', 'kadence-blocks')}
									</div>
									<div className="kbs-color-example-btn kbs-color-btns-hero-secondary">
										{__('Secondary Button', 'kadence-blocks')}
									</div>
								</div>
							</div>
							<div
								className="kbs-color-example-hero-image"
								style={{
									background: colorsSubTab === 'gradients' ? 'var(--kbs-gradients-gradient3)' : undefined,
								}}
							>
								<svg viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
									<rect
										x="0"
										y="0"
										width="800"
										height="800"
										fill={colorsSubTab === 'gradients' ? 'transparent' : 'var(--kbs-colors-palette7)'}
									/>
									<path
										d="M748.958,536.375l-142.794,-142.795l-204.188,204.188l151.19,151.19l195.792,0l0,-212.583Z"
										fill={
											colorsSubTab === 'gradients'
												? 'var(--kbs-colors-palette7)'
												: 'var(--kbs-colors-palette5)'
										}
									/>
									<path
										d="M51.042,722.75l-0,26.549l441.187,0l-212.704,-211.112l-228.483,184.563Z"
										fill={
											colorsSubTab === 'gradients'
												? 'var(--kbs-colors-palette8)'
												: 'var(--kbs-colors-palette6)'
										}
									/>
									<path
										d="M281.09,356.07c45.486,0 82.47,-37.002 82.47,-82.461c0,-45.486 -36.984,-82.506 -82.47,-82.506c-45.503,0 -82.523,37.02 -82.523,82.506c0,45.459 37.02,82.461 82.523,82.461Z"
										fill="var(--kbs-colors-palette1)"
									/>
									<path
										d="M259.077,412.492l-0,22.374c-0,12.158 9.855,22.013 22.013,22.013c12.176,0 22.031,-9.855 22.031,-22.013l-0,-22.374c-0,-12.158 -9.855,-22.013 -22.031,-22.013c-12.158,0 -22.013,9.855 -22.013,22.013Zm-88.413,-59.578l-19.183,19.112c-8.633,8.589 -8.65,22.532 -0.052,31.148c4.29,4.325 9.942,6.488 15.586,6.488c5.636,-0 11.244,-2.163 15.543,-6.418l19.2,-19.112c8.607,-8.607 8.616,-22.532 0.053,-31.147c-8.598,-8.625 -22.541,-8.66 -31.147,-0.071Zm188.65,0.378c-8.43,8.774 -8.14,22.699 0.668,31.13l19.904,19.094c4.255,4.106 9.732,6.146 15.244,6.146c5.784,-0 11.551,-2.304 15.885,-6.778c8.431,-8.792 8.159,-22.735 -0.65,-31.148l-19.903,-19.112c-8.739,-8.404 -22.717,-8.123 -31.148,0.668Zm-239.543,-57.661l22.374,-0c12.158,-0 22.013,-9.855 22.013,-22.022c0,-12.158 -9.855,-22.013 -22.013,-22.013l-22.374,-0c-12.158,-0 -22.013,9.855 -22.013,22.013c0,12.167 9.855,22.022 22.013,22.022Zm278.198,-22.022c0,12.167 9.873,22.022 22.031,22.022l22.391,-0c12.141,-0 22.013,-9.855 22.013,-22.022c0,-12.158 -9.872,-22.013 -22.013,-22.013l-22.391,-0c-12.158,-0 -22.031,9.855 -22.031,22.013Zm-22.769,-72.141c5.653,0 11.279,-2.163 15.569,-6.453l19.939,-19.92c8.606,-8.607 8.606,-22.532 -0,-31.13c-8.607,-8.598 -22.541,-8.607 -31.148,-0l-19.92,19.903c-8.607,8.589 -8.607,22.558 -0,31.147c4.29,4.29 9.942,6.453 15.56,6.453Zm-204.536,-7.191c4.307,4.308 9.925,6.435 15.543,6.435c5.652,0 11.296,-2.163 15.604,-6.453c8.571,-8.606 8.571,-22.54 -0.035,-31.147l-19.218,-19.165c-8.606,-8.589 -22.532,-8.589 -31.129,0.018c-8.589,8.606 -8.589,22.558 0.017,31.147l19.218,19.165Zm110.426,-37.547c12.176,-0 22.031,-9.855 22.031,-22.031l-0,-22.444c-0,-12.176 -9.855,-22.013 -22.031,-22.013c-12.158,-0 -22.013,9.837 -22.013,22.013l-0,22.444c-0,12.176 9.855,22.031 22.013,22.031Z"
										fill="var(--kbs-colors-palette2)"
									/>
								</svg>
							</div>
						</div>
						<div className="kbs-color-example-content">
							<div className="kbs-color-example-content-inner">
								<div
									className="kbs-color-example-content-item kbs-color-example-content-item-1"
									style={{
										background:
											colorsSubTab === 'gradients' ? 'var(--kbs-gradients-gradient6)' : undefined,
									}}
								>
									<div className="kbs-color-example-content-item-color">
										<h3 className="kbs-color-example-content-item-color-title kbs-example-hero4">
											{__('Visualize Colors', 'kadence-blocks')}
										</h3>
										<p className="kbs-color-example-content-item-color-description">
											{__(
												'See how your website will look with different color combinations.',
												'kadence-blocks'
											)}
										</p>
									</div>
								</div>
								<div
									className="kbs-color-example-content-item kbs-color-example-content-item-2"
									style={{
										background:
											colorsSubTab === 'gradients' ? 'var(--kbs-gradients-gradient6)' : undefined,
									}}
								>
									<div className="kbs-color-example-content-item-color">
										<h3 className="kbs-color-example-content-item-color-title kbs-example-hero4">
											{__('Visualize Colors', 'kadence-blocks')}
										</h3>
										<p className="kbs-color-example-content-item-color-description">
											{__(
												'See how your website will look with different color combinations.',
												'kadence-blocks'
											)}
										</p>
									</div>
								</div>
								<div
									className="kbs-color-example-content-item kbs-color-example-content-item-2"
									style={{
										background:
											colorsSubTab === 'gradients' ? 'var(--kbs-gradients-gradient6)' : undefined,
									}}
								>
									<div className="kbs-color-example-content-item-color">
										<h3 className="kbs-color-example-content-item-color-title">
											{__('Visualize Colors', 'kadence-blocks')}
										</h3>
										<p className="kbs-color-example-content-item-color-description">
											{__(
												'See how your website will look with different color combinations.',
												'kadence-blocks'
											)}
										</p>
									</div>
								</div>
							</div>
						</div>
						<div className="kbs-color-example-cta">
							<div className="kbs-color-example-cta-inner">
								<h2 className="kbs-color-example-cta-title">
									{__('Visualize your website colors', 'kadence-blocks')}
								</h2>
								<p className="kbs-color-example-cta-description">
									{__(
										'See how your website will look with different color combinations.',
										'kadence-blocks'
									)}
								</p>
								<div className="kbs-color-example-hero-buttons kbs-color-example-buttons">
									<div className="kbs-color-example-btn kbs-color-btns-hero-primary">
										{__('Primary Button', 'kadence-blocks')}
									</div>
									<div className="kbs-color-example-btn kbs-color-btns-hero-secondary">
										{__('Secondary Button', 'kadence-blocks')}
									</div>
								</div>
							</div>
						</div>
						<div className="kbs-color-example-posts">
							<div className="kbs-color-example-posts-inner">
								<div className="kbs-color-example-posts-header">
									<h2 className="kbs-color-example-cta-title kbs-example-hero2">
										{__('Visualize your website colors', 'kadence-blocks')}
									</h2>
									<p className="kbs-color-example-cta-description">
										{__(
											'See how your website will look with different color combinations.',
											'kadence-blocks'
										)}
									</p>
								</div>
								<div className="kbs-color-example-posts-column-wrap">
									<div className="kbs-color-example-posts-column">
										<div className="kbs-color-example-posts-column-image">
											<svg
												width="100%"
												height="100%"
												viewBox="0 0 800 400"
												xmlns="http://www.w3.org/2000/svg"
											>
												<rect
													x="0"
													y="0"
													width="800"
													height="400"
													fill="var(--kbs-colors-palette8)"
												/>
												<path
													d="M749.299,325.711l0,23.588l-391.973,0l188.977,-187.563l202.996,163.975Z"
													fill="var(--kbs-colors-palette6)"
												/>
												<path
													d="M399.977,197.266c-40.412,0 -73.271,-32.875 -73.271,-73.263c-0,-40.412 32.859,-73.302 73.271,-73.302c40.427,-0 73.317,32.89 73.317,73.302c0,40.388 -32.89,73.263 -73.317,73.263Z"
													fill="var(--kbs-colors-palette4)"
												/>
												<path
													d="M50.701,145.578l-0,203.721l230.983,0l81.246,-81.246l-217.352,-217.352l-94.877,94.877Z"
													fill="var(--kbs-colors-palette2)"
												/>
											</svg>
										</div>
										<h2 className="kbs-color-example-posts-title kbs-example-hero4">
											{__('Visualize your website colors', 'kadence-blocks')}
										</h2>
										<div className="kbs-color-example-post-excerpt">
											{__(
												'See how your website will look with different color combinations.',
												'kadence-blocks'
											)}
										</div>
									</div>
									<div className="kbs-color-example-posts-column">
										<div className="kbs-color-example-posts-column-image">
											<svg
												width="100%"
												height="100%"
												viewBox="0 0 800 400"
												xmlns="http://www.w3.org/2000/svg"
											>
												<rect
													x="0"
													y="0"
													width="800"
													height="400"
													fill="var(--kbs-colors-palette8)"
												/>
												<path
													d="M749.299,325.711l0,23.588l-391.973,0l188.977,-187.563l202.996,163.975Z"
													fill="var(--kbs-colors-palette6)"
												/>
												<path
													d="M399.977,197.266c-40.412,0 -73.271,-32.875 -73.271,-73.263c-0,-40.412 32.859,-73.302 73.271,-73.302c40.427,-0 73.317,32.89 73.317,73.302c0,40.388 -32.89,73.263 -73.317,73.263Z"
													fill="var(--kbs-colors-palette4)"
												/>
												<path
													d="M50.701,145.578l-0,203.721l230.983,0l81.246,-81.246l-217.352,-217.352l-94.877,94.877Z"
													fill="var(--kbs-colors-palette2)"
												/>
											</svg>
										</div>
										<h2 className="kbs-color-example-posts-title kbs-example-hero4">
											{__('Visualize your website colors', 'kadence-blocks')}
										</h2>
										<div className="kbs-color-example-post-excerpt">
											{__(
												'See how your website will look with different color combinations.',
												'kadence-blocks'
											)}
										</div>
									</div>
									<div className="kbs-color-example-posts-column">
										<div className="kbs-color-example-posts-column-image">
											<svg
												width="100%"
												height="100%"
												viewBox="0 0 800 400"
												xmlns="http://www.w3.org/2000/svg"
											>
												<rect
													x="0"
													y="0"
													width="800"
													height="400"
													fill="var(--kbs-colors-palette8)"
												/>
												<path
													d="M749.299,325.711l0,23.588l-391.973,0l188.977,-187.563l202.996,163.975Z"
													fill="var(--kbs-colors-palette6)"
												/>
												<path
													d="M399.977,197.266c-40.412,0 -73.271,-32.875 -73.271,-73.263c-0,-40.412 32.859,-73.302 73.271,-73.302c40.427,-0 73.317,32.89 73.317,73.302c0,40.388 -32.89,73.263 -73.317,73.263Z"
													fill="var(--kbs-colors-palette4)"
												/>
												<path
													d="M50.701,145.578l-0,203.721l230.983,0l81.246,-81.246l-217.352,-217.352l-94.877,94.877Z"
													fill="var(--kbs-colors-palette2)"
												/>
											</svg>
										</div>
										<h2 className="kbs-color-example-posts-title kbs-example-hero4">
											{__('Visualize your website colors', 'kadence-blocks')}
										</h2>
										<div className="kbs-color-example-post-excerpt">
											{__(
												'See how your website will look with different color combinations.',
												'kadence-blocks'
											)}
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="kbs-color-example-cta kbs-color-example-cta-footer">
							<div className="kbs-color-example-cta-inner">
								<div className="kbs-color-example-cta-inner-inner">
									<h2 className="kbs-color-example-cta-title kbs-example-hero1">
										{__('Visualize your website colors', 'kadence-blocks')}
									</h2>
									<p className="kbs-color-example-cta-description">
										{__(
											'See how your website will look with different color combinations.',
											'kadence-blocks'
										)}
									</p>
								</div>
								<div className="kbs-color-example-hero-buttons kbs-color-example-buttons">
									<div className="kbs-color-example-btn kbs-color-btns-hero-primary">
										{__('Primary Button', 'kadence-blocks')}
									</div>
									<div className="kbs-color-example-btn kbs-color-btns-hero-secondary">
										{__('Secondary Button', 'kadence-blocks')}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
