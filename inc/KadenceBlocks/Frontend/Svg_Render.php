<?php
/**
 * Icon Render Class for Kadence Blocks
 *
 * @package Kadence Blocks
 */

namespace KadenceWP\KadenceBlocks\Frontend;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class to handle icon rendering on the frontend.
 */
class Svg_Render {

	/**
	 * Instance of this class
	 *
	 * @var null
	 */
	private static $instance = null;

	/**
	 * All SVG Icons
	 *
	 * @var null
	 */
	private static $all_icons = null;

	/**
	 * Cache rendered SVG elements
	 * 
	 * @var array
	 */
	private static $cached_render = [];

	/**
	 * Instance Control
	 */
	public static function get_instance() {
		if ( is_null( self::$instance ) ) {
			self::$instance = new self();
		}

		return self::$instance;
	}

	/**
	 * Render an icon from attributes
	 *
	 * @param array  $attributes The icon attributes containing icon name, size, etc.
	 * @param string $attribute_name The attribute name of the icon.
	 * @param string $class_prefix Optional class prefix for the wrapper.
	 * @param array  $wrapper_args Optional additional wrapper arguments.
	 * 
	 * @return string The rendered icon HTML.
	 */
	public static function render_icon( $attributes, $attribute_name, $class_prefix = '', $wrapper_args = [] ) {
		if ( empty( $attributes ) || ! is_array( $attributes ) || empty( $attributes[$attribute_name] ) || empty( $attributes[$attribute_name]['desktop']['icon'] ) ) {
			return '';
		}

		// Get icon properties from desktop (fallback for all devices)
		$icon_name = $attributes[$attribute_name]['desktop']['icon'];
		$title = $attributes[$attribute_name]['desktop']['title'] ?? '';
		$tooltip_content = $attributes[$attribute_name]['desktop']['tooltipContent'] ?? '';
		$tooltip_placement = $attributes[$attribute_name]['desktop']['tooltipPlacement'] ?? '';
		$tooltip_dash = $attributes[$attribute_name]['desktop']['tooltipDash'] ?? false;

		// Check if it's a line icon
		$is_line_icon = strpos( $icon_name, 'fe_' ) === 0;
		$fill = $is_line_icon ? 'none' : 'currentColor';
		
		// Don't set stroke-width in SVG - CSS handles all sizing
		$stroke_width = false;

		// Build wrapper classes
		$wrapper_classes = [
			'kt-svg-icon-wrap',
			'kt-svg-icon-' . esc_attr( $icon_name ),
		];

		if ( ! empty( $class_prefix ) ) {
			$wrapper_classes[] = esc_attr( $class_prefix ) . 'icon-wrap';
		}

		if ( ! empty( $wrapper_args['class'] ) ) {
			$wrapper_classes[] = esc_attr( $wrapper_args['class'] );
		}

		if ( ! empty( $tooltip_dash ) ) {
			$wrapper_classes[] = 'kbs-icon-tooltip-dash';
		}

		// Render the SVG
		$svg = self::render_svg( $icon_name, $fill, $stroke_width, $title );

		if ( empty( $svg ) ) {
			return '';
		}

		// Build wrapper attributes
		$wrapper_atts = [
			'class' => implode( ' ', $wrapper_classes ),
		];

		if ( ! empty( $tooltip_content ) ) {
			$wrapper_atts['data-kb-tooltip-content'] = esc_attr( $tooltip_content );
		}

		if ( ! empty( $tooltip_placement ) ) {
			$wrapper_atts['data-tooltip-placement'] = esc_attr( $tooltip_placement );
		}

		if ( ! empty( $tooltip_dash ) ) {
			$wrapper_atts['data-kb-tooltip-dash'] = esc_attr( $tooltip_dash );
		}

		// Add any additional wrapper attributes
		foreach ( $wrapper_args as $key => $value ) {
			if ( $key !== 'class' ) {
				$wrapper_atts[ $key ] = esc_attr( $value );
			}
		}

		// Build wrapper HTML
		$wrapper_attributes = '';
		foreach ( $wrapper_atts as $key => $value ) {
			$wrapper_attributes .= ' ' . $key . '="' . $value . '"';
		}
		
		return sprintf( '<span%s>%s</span>', $wrapper_attributes, $svg );
	}

	/**
	 * Render an SVG icon
	 *
	 * @param string  $name The icon name.
	 * @param string  $fill The fill color.
	 * @param mixed   $stroke_width The stroke width for line icons.
	 * @param string  $title The icon title for accessibility.
	 * @param boolean $hidden Whether the icon should be hidden from screen readers.
	 * 
	 * @return string The rendered SVG.
	 */
	public static function render_svg( $name, $fill = 'currentColor', $stroke_width = false, $title = '' ) {
		if ( null === self::$all_icons ) {
			self::$all_icons = self::get_icons();
		}

		$hidden = empty( $title );

		// Create cache key
		$key = md5( $name . $fill . $stroke_width . $title . $hidden );

		// Return cached version if available
		if ( ! empty( self::$cached_render[ $key ] ) ) {
			return self::$cached_render[ $key ];
		}

		$svg = '';

		// Handle name replacements
		$name = self::name_replacements( $name );

		// Check for custom SVG
		$is_custom_svg = strpos( $name, 'kb-custom-' ) === 0;
		if ( $is_custom_svg && ! isset( self::$all_icons[ $name ] ) ) {
			$custom_post = get_post( str_replace( 'kb-custom-', '', $name ) );

			if ( ! empty( $custom_post ) && ! is_wp_error( $custom_post ) && 'kadence_custom_svg' === $custom_post->post_type && 'publish' === $custom_post->post_status ) {
				self::$all_icons[ $name ] = json_decode( $custom_post->post_content, true );
			}
		}

		// Build SVG if icon exists
		if ( ! empty( self::$all_icons[ $name ] ) ) {
			$icon = self::$all_icons[ $name ];
			$viewbox = ! empty( $icon['vB'] ) ? $icon['vB'] : '0 0 24 24';
			$preserve = '';
			
			// Check if we need preserveAspectRatio
			$viewbox_array = explode( ' ', $viewbox );
			$type_prefix = substr( $name, 0, 3 );

			if ( $type_prefix && 'fas' !== $type_prefix && 'fe_' !== $type_prefix && 'ic_' !== $type_prefix ) {
				if ( ( isset( $viewbox_array[0] ) && absint( $viewbox_array[0] ) > 0 ) || ( isset( $viewbox_array[1] ) && absint( $viewbox_array[1] ) > 0 ) ) {
					$preserve = ' preserveAspectRatio="xMinYMin meet"';
				}
			}

			// Build SVG element
			$svg .= '<svg class="kt-svg-icon" viewBox="' . esc_attr( $viewbox ) . '"' . $preserve;
			$svg .= ' fill="' . esc_attr( $fill ) . '"';
			
			// For line icons, set stroke but not stroke-width (CSS handles sizing)
			if ( $fill === 'none' ) {
				$svg .= ' stroke="currentColor"';
			}
			
			// Only add stroke-width if explicitly passed (for backwards compatibility)
			if ( ! empty( $stroke_width ) ) {
				$svg .= ' stroke-width="' . esc_attr( $stroke_width ) . '" stroke-linecap="round" stroke-linejoin="round"';
			}
			
			$svg .= ' xmlns="http://www.w3.org/2000/svg"';
			$svg .= $hidden ? ' aria-hidden="true"' : ' role="img"';
			$svg .= '>';

			if ( ! empty( $title ) ) {
				$svg .= '<title>' . esc_html( $title ) . '</title>';
			}

			if ( ! empty( $icon['cD'] ) ) {
				$svg .= self::generate_svg_elements( $icon['cD'] );
			}

			$svg .= '</svg>';
		}

		// Cache the result
		self::$cached_render[ $key ] = $svg;

		return $svg;
	}

	/**
	 * Name replacements for legacy icon names
	 *
	 * @param string $name The icon name.
	 * 
	 * @return string The corrected icon name.
	 */
	private static function name_replacements( $name ) {
		$replacements = [
			'fa_facebook' => 'fa_facebook-n',
		];

		return $replacements[ $name ] ?? $name;
	}

	/**
	 * Recursively generate SVG elements
	 *
	 * @param array $elements The SVG elements array.
	 * 
	 * @return string The generated SVG elements.
	 */
	private static function generate_svg_elements( $elements ) {
		$output = '';
		
		foreach ( $elements as $element ) {
			$tag_name = $element['nE'] ?? '';
			$attributes = $element['aBs'] ?? [];
			$children = $element['children'] ?? [];
			
			if ( empty( $tag_name ) ) {
				continue;
			}

			$attr_strings = [];

			foreach ( $attributes as $key => $value ) {
				if ( ! in_array( $key, [ 'fill', 'stroke', 'none' ], true ) ) {
					$attr_strings[] = $key . '="' . esc_attr( $value ) . '"';
				}
			}

			// Handle stroke for line icons
			if ( isset( $attributes['fill'], $attributes['stroke'] ) && $attributes['fill'] === 'none' ) {
				$attr_strings[] = 'stroke="currentColor"';
			}

			$output .= '<' . $tag_name . ' ' . implode( ' ', $attr_strings );
			
			if ( ! empty( $children ) ) {
				$output .= '>' . self::generate_svg_elements( $children ) . '</' . $tag_name . '>';
			} else {
				$output .= '/>';
			}
		}

		return $output;
	}

	/**
	 * Get all available icons
	 *
	 * @return array The icons array.
	 */
	private static function get_icons() {
		$ico = include KADENCE_BLOCKS_PATH . 'inc/data/icons/Icons_Ico_Array.php';
		$faico = include KADENCE_BLOCKS_PATH . 'inc/data/icons/Icons_Array.php';

		return apply_filters( 'kadence_svg_icons', array_merge( $ico, $faico ) );
	}
}