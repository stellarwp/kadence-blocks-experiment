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
	/**
	 * The Google Fonts.
	 *
	 * @var array
	 */
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
	 * Get the System Font Options.
	 *
	 * @return array The System Font Options.
	 */
	public function get_system_font_options() {
		return [
			'var(--kbs-font-family-system)'         => [
				'label'  => __( 'System Font', 'kadence-blocks' ),
				'family' => 'var(--kbs-font-family-system)',
			],
			'Arial, Helvetica, sans-serif'          => [
				'label'  => __( 'Arial, sans-serif', 'kadence-blocks' ),
				'family' => 'Arial, Helvetica, sans-serif',
			],
			'"Arial Black", Gadget, sans-serif'     => [
				'label'  => __( '"Arial Black", sans-serif', 'kadence-blocks' ),
				'family' => '"Arial Black", Gadget, sans-serif',
			],
			'Helvetica, sans-serif'                 => [
				'label'  => __( 'Helvetica, sans-serif', 'kadence-blocks' ),
				'family' => 'Helvetica, sans-serif',
			],
			'Impact, Charcoal, sans-serif'          => [
				'label'  => __( 'Impact, sans-serif', 'kadence-blocks' ),
				'family' => 'Impact, Charcoal, sans-serif',
			],
			'"Lucida Sans Unicode", "Lucida Grande", sans-serif' => [
				'label'  => __( '"Lucida Sans Unicode", sans-serif', 'kadence-blocks' ),
				'family' => '"Lucida Sans Unicode", "Lucida Grande", sans-serif',
			],
			'Tahoma, Geneva, sans-serif'            => [
				'label'  => __( 'Tahoma, sans-serif', 'kadence-blocks' ),
				'family' => 'Tahoma, Geneva, sans-serif',
			],
			'"Trebuchet MS", Helvetica, sans-serif' => [
				'label'  => __( '"Trebuchet MS", sans-serif', 'kadence-blocks' ),
				'family' => '"Trebuchet MS", Helvetica, sans-serif',
			],
			'Verdana, Geneva, sans-serif'           => [
				'label'  => __( 'Verdana, sans-serif', 'kadence-blocks' ),
				'family' => 'Verdana, Geneva, sans-serif',
			],
			'Georgia, serif'                        => [
				'label'  => __( 'Georgia, serif', 'kadence-blocks' ),
				'family' => 'Georgia, serif',
			],
			'"Palatino Linotype", "Book Antiqua", Palatino, serif' => [
				'label'  => __( '"Palatino Linotype", serif', 'kadence-blocks' ),
				'family' => '"Palatino Linotype", "Book Antiqua", Palatino, serif',
			],
			'"Times New Roman", Times, serif'       => [
				'label'  => __( '"Times New Roman", serif', 'kadence-blocks' ),
				'family' => '"Times New Roman", Times, serif',
			],
			'"Comic Sans MS", cursive, sans-serif'  => [
				'label'  => __( '"Comic Sans MS", cursive', 'kadence-blocks' ),
				'family' => '"Comic Sans MS", cursive, sans-serif',
			],
			'Courier, monospace'                    => [
				'label'  => __( 'Courier, monospace', 'kadence-blocks' ),
				'family' => 'Courier, monospace',
			],
			'"Lucida Console", Monaco, monospace'   => [
				'label'  => __( '"Lucida Console", monospace', 'kadence-blocks' ),
				'family' => '"Lucida Console", Monaco, monospace',
			],
		];
	}

	/**
	 * Get a collection of fonts.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function get_fonts( $request ) {
		$all_fonts = [
			'google' => $this->get_google_fonts(),
			'theme'  => $this->get_theme_json_fonts(),
			'custom' => apply_filters( 'kadence_blocks_custom_fonts', [] ),
			'system' => $this->get_system_font_options(),
		];
		$all_fonts = apply_filters( 'kbs_font_choices', $all_fonts );
		return rest_ensure_response( $all_fonts );
	}
	/** 
	 * Get System Font Weights.
	 */
	public function get_system_font_appearance_options() {
		return [
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
			[
				'value' => '100italic',
				'label' => __( 'Thin 100 Italic', 'kadence-blocks' ),
			],
			[
				'value' => '200italic',
				'label' => __( 'Extra-Light 200 Italic', 'kadence-blocks' ),
			],
			[
				'value' => '300italic',
				'label' => __( 'Light 300 Italic', 'kadence-blocks' ),
			],
			[
				'value' => 'italic',
				'label' => __( 'Italic', 'kadence-blocks' ),
			],
			[
				'value' => '500italic',
				'label' => __( 'Medium 500 Italic', 'kadence-blocks' ),
			],
			[
				'value' => '600italic',
				'label' => __( 'Semi-Bold 600 Italic', 'kadence-blocks' ),
			],
			[
				'value' => '700italic',
				'label' => __( 'Bold 700 Italic', 'kadence-blocks' ),
			],
			[
				'value' => '800italic',
				'label' => __( 'Extra-Bold 800 Italic', 'kadence-blocks' ),
			],
			[
				'value' => '900italic',
				'label' => __( 'Ultra-Bold 900 Italic', 'kadence-blocks' ),
			],
		];
	}
	
	/**
	 * Get an array font weight options.
	 */
	public function get_theme_heading_font_appearance_options() {
		$appearance_options = [];
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
					$variants = $this->get_google_font_variants( $heading_font['family'] );
					if ( ! empty( $variants['min'] ) ) {
						// Variable font.
						return [
							'min'         => $variants['min'],
							'max'         => $variants['max'],
							'styles'      => $variants['styles'],
							'is_variable' => true,
						];
					} elseif ( ! empty( $variants ) && is_array( $variants ) ) {
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
						foreach ( $variants as $key => $value ) {
							$label = $this->get_variant_label( $value );
							if ( in_array( $value, $new_weight_variant ) ) {
								$appearance_options[] = [
									'value' => ( $value === 'regular' ? '400' : $value ),
									'label' => $label,
								];
							} else {
								$appearance_options[] = [
									'value' => $value,
									'label' => $label . ' ' . __( '(Not Globally Used)', 'kadence-blocks' ),
								];
							}
						}
					}
				} elseif ( ! empty( $heading_font['family'] ) && substr( $heading_font['family'], 0, strlen( '-apple-system' ) ) === '-apple-system' ) {
					// System Font Weights.
					$appearance_options = $this->get_system_font_appearance_options();
				} elseif ( ! empty( $heading_font['family'] ) && ( $heading_font['family'] === 'var(--kadence-system-font)' || $heading_font['family'] === 'var(--kbs-system-font)' ) ) {
					// System Font Weights.
					$appearance_options = $this->get_system_font_appearance_options();
				}
			}
		}
		return apply_filters( 'kadence_blocks_heading_font_appearance_options', $appearance_options );
	}
	/**
	 * Get an array font weight options.
	 */
	public function get_google_font_variants( $font ) {
		$google_fonts = $this->get_google_fonts();
		if ( isset( $google_fonts[ $font ]['is_variable'] ) && $google_fonts[ $font ]['is_variable'] ) {
			// Find the min and max weights.
			$min_weight = 400;
			$max_weight = 700;
			if ( isset( $google_fonts[ $font ]['axes'] ) && is_array( $google_fonts[ $font ]['axes'] ) ) {
				foreach ( $google_fonts[ $font ]['axes'] as $axis ) {
					if ( $axis['tag'] === 'wght' ) {
						$min_weight = ! empty( $axis['min'] ) ? $axis['min'] : 400;
						$max_weight = ! empty( $axis['max'] ) ? $axis['max'] : 700;
						break;
					}
				}
			}
			// Find the styles.
			return [
				'min'    => $min_weight,
				'max'    => $max_weight,
				'styles' => ! empty( $google_fonts[ $font ]['variants'] ) ? $google_fonts[ $font ]['variants'] : [],
			];
		}
		if ( isset( $google_fonts[ $font ]['variants'] ) && is_array( $google_fonts[ $font ]['variants'] ) ) {
			return $google_fonts[ $font ]['variants'];
		}
		return [];
	}
	/**
	 * Get the font weight label.
	 *
	 * @param string $value The font weight value.
	 */
	public function get_variant_label( $value ) {
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
				$label = __( 'Bold 700', 'kadence-blocks' );
				break;
			case '800':
				$label = __( 'Extra-Bold 800', 'kadence-blocks' );
				break;
			case '900':
				$label = __( 'Ultra-Bold 900', 'kadence-blocks' );
				break;
			case 'italic':
				$label = __( 'Italic', 'kadence-blocks' );
				break;
			case '100italic':
				$label = __( 'Thin 100 Italic', 'kadence-blocks' );
				break;
			case '200italic':
				$label = __( 'Extra-Light 200 Italic', 'kadence-blocks' );
				break;
			case '300italic':
				$label = __( 'Light 300 Italic', 'kadence-blocks' );
				break;
			case '400italic':
				$label = __( 'Regular Italic', 'kadence-blocks' );
				break;
			case '500italic':
				$label = __( 'Medium 500 Italic', 'kadence-blocks' );
				break;
			case '600italic':
				$label = __( 'Semi-Bold 600 Italic', 'kadence-blocks' );
				break;
			case '700italic':
				$label = __( 'Bold 700 Italic', 'kadence-blocks' );
				break;
			case '800italic':
				$label = __( 'Extra-Bold 800 Italic', 'kadence-blocks' );
				break;
			case '900italic':
				$label = __( 'Ultra-Bold 900 Italic', 'kadence-blocks' );
				break;
		}
		return $label;
	}
	/**
	 * Get an array font weight options.
	 */
	public function get_theme_body_font_appearance_options() {
		$appearance_options = [];
		if ( function_exists( 'Kadence\kadence' ) ) {
			$base_font = \Kadence\kadence()->option( 'base_font' );
			if ( ! empty( $base_font['family'] ) ) {
				if ( isset( $base_font['google'] ) && $base_font['google'] ) {
					$variants = $this->get_google_font_variants( $base_font['family'] );
					if ( ! empty( $variants['min'] ) ) {
						// Variable font.
						return [
							'min'         => $variants['min'],
							'max'         => $variants['max'],
							'styles'      => $variants['styles'],
							'is_variable' => true,
						];
					} elseif ( ! empty( $variants ) && is_array( $variants ) ) {
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
						foreach ( $variants as $key => $value ) {
							$label = $this->get_variant_label( $value );
							if ( in_array( $value, $new_weight_variant ) ) {
								$appearance_options[] = [
									'value' => ( $value === 'regular' ? '400' : $value ),
									'label' => $label,
								];
							} else {
								$appearance_options[] = [
									'value' => $value,
									'label' => $label . ' ' . __( '(Not Globally Used)', 'kadence-blocks' ),
								];
							}
						}
					}
				} elseif ( isset( $base_font['family'] ) && ! empty( $base_font['family'] ) && substr( $base_font['family'], 0, strlen( '-apple-system' ) ) === '-apple-system' ) {
					$appearance_options = $this->get_system_font_appearance_options();
				}
			}
		}
		return apply_filters( 'kadence_blocks_body_font_appearance_options', $appearance_options );
	}

	/**
	 * Get the fonts from the theme.json file.
	 *
	 * @return array The fonts from the theme.json file.
	 */
	private function get_theme_json_fonts() {
		$formatted_fonts = [];
		if ( function_exists( 'Kadence\kadence' ) ) {
			$heading_font_appearance_options                   = $this->get_theme_heading_font_appearance_options();
			$formatted_fonts['var(--kbs-font-family-heading)'] = [
				'label'          => __( 'Heading Font Family', 'kadence-blocks' ),
				'family'         => 'var(--kbs-font-family-heading)',
				'combinedLabels' => ( ! isset( $heading_font_appearance_options['is_variable'] ) ? $heading_font_appearance_options : [] ),
				'styles'         => ( $heading_font_appearance_options['styles'] ?? [] ),
				'min'            => ( $heading_font_appearance_options['min'] ?? '' ),
				'max'            => ( $heading_font_appearance_options['max'] ?? '' ),
				'weights'        => [],
				'is_variable'    => ( isset( $heading_font_appearance_options['is_variable'] ) ? true : false ),
			];
			$body_font_appearance_options                      = $this->get_theme_body_font_appearance_options();
			$formatted_fonts['var(--kbs-font-family-body)']    = [
				'label'          => __( 'Body Font Family', 'kadence-blocks' ),
				'family'         => 'var(--kbs-font-family-body)',
				'combinedLabels' => ( ! isset( $body_font_appearance_options['is_variable'] ) ? $body_font_appearance_options : [] ),
				'styles'         => ( $body_font_appearance_options['styles'] ?? [] ),
				'min'            => ( $body_font_appearance_options['min'] ?? '' ),
				'max'            => ( $body_font_appearance_options['max'] ?? '' ),
				'weights'        => [],
				'is_variable'    => ( isset( $body_font_appearance_options['is_variable'] ) ? true : false ),
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
								'weights'     => [],
								'min'         => '',
								'max'         => '',
								'combined'    => [],
								'is_variable' => false,
							];
						}
						// Check if the font is a variable font.
						if ( isset( $font['src'][0] ) && strpos( $font['src'][0], 'VariableFont' ) !== false ) {
							$formatted_fonts[ $font['font-family'] ]['is_variable'] = true;
							// Normally looks like this [font-weight] => 300 800.
							$weights                                        = explode( ' ', $font['font-weight'] );
							$formatted_fonts[ $font['font-family'] ]['min'] = ! empty( $weights[0] ) ? $weights[0] : '';
							$formatted_fonts[ $font['font-family'] ]['max'] = ! empty( $weights[1] ) ? $weights[1] : '';
							if ( ! empty( $font['font-style'] ) && ! isset( $formatted_fonts[ $font['font-family'] ]['styles'][ $font['font-style'] ] ) ) {
								$formatted_fonts[ $font['font-family'] ]['styles'][] = $font['font-style'];
							}
						}
						// Styles and weights are combined because with theme fonts we may only be loading specific variants.
						if ( ! empty( $font['font-style'] ) && 'normal' !== $font['font-style'] ) {
							if ( ! empty( $font['font-weight'] ) && $font['font-weight'] !== '400' ) {
								if ( ! in_array( $font['font-weight'] . $font['font-style'], $formatted_fonts[ $font['font-family'] ]['combined'], true ) ) {
									$formatted_fonts[ $font['font-family'] ]['combined'][] = $font['font-weight'] . $font['font-style'];
								}
							} elseif ( ! in_array( $font['font-style'], $formatted_fonts[ $font['font-family'] ]['combined'], true ) ) {
									$formatted_fonts[ $font['font-family'] ]['combined'][] = $font['font-style'];
							}
						} elseif ( ! empty( $font['font-weight'] ) && ! in_array( $font['font-weight'], $formatted_fonts[ $font['font-family'] ]['combined'], true ) ) {
							$formatted_fonts[ $font['font-family'] ]['combined'][] = $font['font-weight'];
						}
					}
				}
			}
		}
		return $formatted_fonts;
	}
}
