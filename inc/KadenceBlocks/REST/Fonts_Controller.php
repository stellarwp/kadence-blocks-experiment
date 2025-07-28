<?php
/**
 * Fonts REST API Controller
 *
 * @package KadenceWP\KadenceBlocks\REST
 */

namespace KadenceWP\KadenceBlocks\REST;

use WP_REST_Controller;
use WP_REST_Server;
use WP_REST_Request;
use WP_REST_Response;
use WP_Error;

/**
 * Fonts REST API Controller class
 */
class Fonts_Controller extends WP_REST_Controller {
	private $google_fonts;
	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->namespace = 'kb-fonts/v1';
		$this->rest_base = 'fonts';
	}

	/**
	 * Registers the routes for the objects of the controller.
	 *
	 * @see register_rest_route()
	 */
	public function register_routes() {
		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base,
			[
				[
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => [ $this, 'get_fonts' ],
					'permission_callback' => '__return_true',
				],
			]
		);
	}
	/**
	 * Get the Google Fonts.
	 *
	 * @return array The Google Fonts.
	 */
	public function get_google_fonts() {
		if ( ! is_null( $this->google_fonts ) ) {
			return $this->google_fonts;
		}
		$this->google_fonts = kbs_get_google_fonts();
		return $this->google_fonts;
	}

	/**
	 * Get a collection of fonts.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function get_fonts( $request ) {
		$all_fonts = [
			'google'         => $this->get_google_fonts(),
			'theme_json'     => $this->get_theme_json_fonts(),
			'kadence_custom' => apply_filters( 'kadence_blocks_custom_fonts', [] ),
		];

		return rest_ensure_response( $all_fonts );
	}
	/** 
	 * Get System Font Weights.
	 */
	public function get_system_font_weights() {
		return [
			[
				'value' => '',
				'label' => __( 'Inherit', 'kadence-blocks' ),
			],
			[
				'value' => '100',
				'label' => __( 'Thin 100', 'kadence-blocks' ),
			],
			[
				'value' => '200',
				'label' => __( 'Extra-Light 200', 'kadence-blocks' ),
			],
			[
				'value' => '300',
				'label' => __( 'Light 300', 'kadence-blocks' ),
			],
			[
				'value' => '400',
				'label' => __( 'Regular', 'kadence-blocks' ),
			],
			[
				'value' => '500',
				'label' => __( 'Medium 500', 'kadence-blocks' ),
			],
			[
				'value' => '600',
				'label' => __( 'Semi-Bold 600', 'kadence-blocks' ),
			],
			[
				'value' => '700',
				'label' => __( 'Bold 700', 'kadence-blocks' ),
			],
			[
				'value' => '800',
				'label' => __( 'Extra-Bold 800', 'kadence-blocks' ),
			],
			[
				'value' => '900',
				'label' => __( 'Ultra-Bold 900', 'kadence-blocks' ),
			],
		];
	}
	
	/**
	 * Get an array font weight options.
	 */
	public function get_theme_heading_weights() {
		$weights = [];
		if ( function_exists( 'Kadence\kadence' ) ) {
			$heading_font = \Kadence\kadence()->option( 'heading_font' );
			$is_body      = false;
			$body_font    = [];
			if ( is_array( $heading_font ) ) {
				if ( ! empty( $heading_font['family'] ) && 'inherit' === $heading_font['family'] ) {
					// Inherit from Body.
					$is_body      = true;
					$body_font    = \Kadence\kadence()->option( 'base_font' );
					$heading_font = $body_font;
				}
				if ( isset( $heading_font['google'] ) && $heading_font['google'] ) {
					// Google font.
					$variants = $this->get_google_font_weights( $heading_font['family'] );
					if ( is_array( $variants ) ) {
						if ( $is_body ) {
							$new_weight_variant = [ $body_font['variant'] ];
						} else {
							$new_weight_variant = [];
						}
						foreach ( [ 'h1_font', 'h2_font', 'h3_font', 'h4_font', 'h5_font', 'h6_font' ] as $option ) {
							$h_font = \Kadence\kadence()->option( $option );
							if ( ! empty( $h_font['family'] ) && ( 'inherit' === $h_font['family'] || $heading_font['family'] === $h_font['family'] ) ) {
								if ( ! in_array( $h_font['variant'], $new_weight_variant, true ) ) {
									array_push( $new_weight_variant, $h_font['variant'] );
								}
							}
						}
						$weights[] = [
							'value' => '',
							'label' => __( 'Inherit', 'kadence-blocks' ),
						];
						foreach ( $variants as $key => $value ) {
							$label = $this->get_weight_label( $value );
							if ( in_array( $value, $new_weight_variant ) ) {
								$weights[] = [
									'value' => ( $value === 'regular' ? '400' : $value ),
									'label' => $label,
								];
							} else {
								$weights[] = [
									'value' => $value,
									'label' => $label . ' ' . __( '(Not Globally Used)', 'kadence-blocks' ),
								];
							}
						}
					}
				} elseif ( ! empty( $heading_font['family'] ) && substr( $heading_font['family'], 0, strlen( '-apple-system' ) ) === '-apple-system' ) {
					// System Font Weights.
					$weights = $this->get_system_font_weights();
				} elseif ( ! empty( $heading_font['family'] ) && $heading_font['family'] === 'var(--kadence-system-font)' ) {
					// System Font Weights.
					$weights = $this->get_system_font_weights();
				}
			}
		}
		return apply_filters( 'kadence_blocks_heading_weight_options', $weights );
	}
	/**
	 * Get an array font weight options.
	 */
	public function get_google_font_weights( $font ) {
		$google_fonts = $this->get_google_fonts();
		if ( isset( $google_fonts[ $font ]['weights'] ) && is_array( $google_fonts[ $font ]['weights'] ) ) {
			return $google_fonts[ $font ]['weights'];
		}
		return [];
	}
	/**
	 * Get the font weight label.
	 *
	 * @param string $value The font weight value.
	 */
	public function get_weight_label( $value ) {
		$label = $value;
		switch ( $value ) {
			case '100':
				$label = __( 'Thin 100', 'kadence-blocks' );
				break;
			case '200':
				$label = __( 'Extra-Light 200', 'kadence-blocks' );
				break;
			case '300':
				$label = __( 'Light 300', 'kadence-blocks' );
				break;
			case 'regular':
				$label = __( 'Regular', 'kadence-blocks' );
				break;
			case '400':
				$label = __( 'Regular', 'kadence-blocks' );
				break;
			case '500':
				$label = __( 'Medium 500', 'kadence-blocks' );
				break;
			case '600':
				$label = __( 'Semi-Bold 600', 'kadence-blocks' );
				break;
			case '700':
				$label = __( 'Extra-Bold 800', 'kadence-blocks' );
				break;
			case '800':
				$label = __( 'Extra-Bold 800', 'kadence-blocks' );
				break;
			case '900':
				$label = __( 'Ultra-Bold 900', 'kadence-blocks' );
				break;
		}
		return $label;
	}
	/**
	 * Get an array font weight options.
	 */
	public function get_theme_body_weights() {
		$weights = [];
		if ( function_exists( 'Kadence\kadence' ) ) {
			$base_font = \Kadence\kadence()->option( 'base_font' );
			if ( ! empty( $base_font['family'] ) ) {
				if ( isset( $base_font['google'] ) && $base_font['google'] ) {
					$variants = $this->get_google_font_weights( $base_font['family'] );
					if ( is_array( $variants ) ) {
						$new_weight_variant = [ $base_font['variant'] ];
						$heading_font       = \Kadence\kadence()->option( 'heading_font' );
						foreach ( [ 'h1_font', 'h2_font', 'h3_font', 'h4_font', 'h5_font', 'h6_font' ] as $option ) {
							$h_font = \Kadence\kadence()->option( $option );
							if ( ! empty( $h_font['family'] ) && ( ( 'inherit' === $heading_font['family'] && 'inherit' === $h_font['family'] ) || $base_font['family'] === $h_font['family'] ) ) {
								if ( ! in_array( $h_font['variant'], $new_weight_variant, true ) ) {
									array_push( $new_weight_variant, $h_font['variant'] );
								}
							}
						}
						$weights[] = [
							'value' => '',
							'label' => __( 'Inherit', 'kadence-blocks' ),
						];
						foreach ( $variants as $key => $value ) {
							$label = $this->get_weight_label( $value );
							if ( in_array( $value, $new_weight_variant ) ) {
								$weights[] = [
									'value' => ( $value === 'regular' ? '400' : $value ),
									'label' => $label,
								];
							} else {
								// For now, don't add until we smart load when used.
								// $weights[] = array( 'value' => $value, 'label' => $label . ' ' . __( '(Not Globally Used)', 'kadence-blocks' ) );
							}
						}
					}
				} elseif ( isset( $base_font['family'] ) && ! empty( $base_font['family'] ) && substr( $base_font['family'], 0, strlen( '-apple-system' ) ) === '-apple-system' ) {
					$weights = $this->get_system_font_weights();
				}
			}
		}
		return apply_filters( 'kadence_blocks_body_weight_options', $weights );
	}

	/**
	 * Get the fonts from the theme.json file.
	 *
	 * @return array The fonts from the theme.json file.
	 */
	private function get_theme_json_fonts() {
		$formatted_fonts = [];
		if ( function_exists( 'Kadence\kadence' ) ) {
			$formatted_fonts['kbs-heading'] = [
				'label'       => __( 'Heading Font Family', 'kadence-blocks' ),
				'family'      => 'var(--kbs-font-family-heading)',
				'weights'     => $this->get_theme_heading_weights(),
				'styles'      => [],
				'is_variable' => false,
			];
			$formatted_fonts['kbs-body']    = [
				'label'       => __( 'Body Font Family', 'kadence-blocks' ),
				'family'      => 'var(--kbs-font-family-body)',
				'weights'     => $this->get_theme_body_weights(),
				'styles'      => [],
				'is_variable' => false,
			];
		}
		if ( ! wp_is_block_theme() || ! class_exists( '\WP_Font_Face_Resolver' ) ) {
			return $formatted_fonts;
		}

		$theme_fonts = \WP_Font_Face_Resolver::get_fonts_from_theme_json();
		if ( ! empty( $theme_fonts ) ) {
			foreach ( $theme_fonts as $font_group ) {
				foreach ( $font_group as $font ) {
					if ( isset( $font['font-family'] ) ) {
						// Initialize font family if it doesn't exist
						if ( ! isset( $formatted_fonts[ $font['font-family'] ] ) ) {
							$formatted_fonts[ $font['font-family'] ] = [
								'family'      => $font['font-family'],
								'styles'      => [],
								'is_variable' => false,
							];
						}

						// Initialize font style as array if it doesn't exist
						if ( ! isset( $formatted_fonts[ $font['font-family'] ]['styles'][ $font['font-style'] ] ) ) {
							$formatted_fonts[ $font['font-family'] ]['styles'][ $font['font-style'] ] = [];
						}

						// Add weight to the style array if not already present
						if ( ! in_array( $font['font-weight'], (array) $formatted_fonts[ $font['font-family'] ]['styles'][ $font['font-style'] ] ) ) {
							$formatted_fonts[ $font['font-family'] ]['styles'][ $font['font-style'] ][] = $font['font-weight'];

							// Check if the font is a variable font
							if ( isset( $font['src'][0] ) && strpos( $font['src'][0], 'VariableFont' ) !== false ) {
								$formatted_fonts[ $font['font-family'] ]['is_variable'] = true;
							}
						}
					}
				}
			}
		}

		return $formatted_fonts;
	}
}
