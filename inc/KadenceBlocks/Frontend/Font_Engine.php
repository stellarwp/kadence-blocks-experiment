<?php
/**
 * Handles font loading and deduplication for Kadence Blocks
 */

namespace KadenceWP\KadenceBlocks\Frontend;

use KadenceWP\KadenceBlocks\Container;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class to handle font loading and deduplication
 */
class Font_Engine {
	/**
	 * Stores all the Google Fonts that need to be loaded
	 *
	 * @var array<string, array>
	 */
	protected static $google_fonts = [];

	/**
	 * Instance of this class
	 *
	 * @var self|null
	 */
	private static $instance = null;

	/**
	 * Instance Control
	 *
	 * @return self
	 */
	public static function get_instance(): self {
		if ( is_null( self::$instance ) ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * Class Constructor.
	 */
	public function __construct() {
		add_action( 'wp_head', [ $this, 'print_google_fonts' ], 89 );
		add_action( 'wp_footer', [ $this, 'print_late_google_fonts' ], 89 );
	}

	/**
	 * Add Google Fonts
	 *
	 * @param array $fonts Array of fonts to add.
	 * @return void
	 */
	public function add_fonts( array $fonts ): void {
		if ( empty( $fonts ) ) {
			return;
		}

		foreach ( $fonts as $key => $font ) {
			if ( ! array_key_exists( $key, self::$google_fonts ) ) {
				self::$google_fonts[$key] = $font;
			} else {
				foreach ( $font['fontvariants'] as $variant ) {
					if ( ! in_array( $variant, self::$google_fonts[$key]['fontvariants'], true ) ) {
						self::$google_fonts[$key]['fontvariants'][] = $variant;
					}
				}
			}
		}
	}

	/**
	 * Print Google Fonts in header
	 *
	 * @return void
	 */
	public function print_google_fonts(): void {
		if ( empty( self::$google_fonts ) ) {
			return;
		}

		$this->print_fonts_link();
	}

	/**
	 * Print Google Fonts in footer
	 *
	 * @return void
	 */
	public function print_late_google_fonts(): void {
		if ( empty( self::$google_fonts ) ) {
			return;
		}
		$this->print_fonts_link();
		self::$google_fonts = [];
	}

	/**
	 * Process fonts from a block and add them to the collection
	 *
	 * @param array $attributes Block attributes.
	 * @param array $attributes_meta Block attributes metadata.
	 * @return void
	 */
	public function process_block_fonts( array $attributes, array $attributes_meta ): void {
		if ( empty( $attributes ) || empty( $attributes_meta ) ) {
			return;
		}

        $font_attributes = [];
        $fonts = [];

        foreach( $attributes_meta as $key => $meta ) {
            if( empty( $meta['renderCSS'] ) || empty( $meta['property'] ) ) {
                continue;
            }
            
            if( $meta['property'] === 'typography' && !empty( $attributes[ $meta['property'] ] ) ) {
                $font_attributes[] = $attributes[ $meta['property'] ];
            }
        }
		foreach ( $font_attributes as $group ) {
			// Get font families for each device size
			$dt_font = $group['dt']['fontFamily'] ?? null;
			$td_font = $group['td']['fontFamily'] ?? $dt_font; // Fallback to desktop
			$mb_font = $group['mb']['fontFamily'] ?? $td_font ?? $dt_font; // Fallback to tablet or desktop

			// Get weights for each device size
			$dt_weight = $group['dt']['fontWeight'] ?? '400';
			$td_weight = $group['td']['fontWeight'] ?? '400';
			$mb_weight = $group['mb']['fontWeight'] ?? '400';

			// Process desktop font and weight
			if ( $dt_font && $this->is_google_font( $dt_font ) ) {
				$key = str_replace( ' ', '+', $dt_font );
				if ( ! isset( $fonts[ $key ] ) ) {
					$fonts[ $key ] = [
						'fontfamily'   => $dt_font,
						'fontvariants' => [ $dt_weight ],
					];
				} else {
					$fonts[ $key ]['fontvariants'][] = $dt_weight;
					$fonts[ $key ]['fontvariants'] = array_unique( $fonts[ $key ]['fontvariants'] );
				}
			}

			// Process tablet font and weight
			if ( $td_font && $this->is_google_font( $td_font ) ) {
				$key = str_replace( ' ', '+', $td_font );
				if ( ! isset( $fonts[ $key ] ) ) {
					$fonts[ $key ] = [
						'fontfamily'   => $td_font,
						'fontvariants' => [ $td_weight ],
					];
				} else {
					$fonts[ $key ]['fontvariants'][] = $td_weight;
					$fonts[ $key ]['fontvariants'] = array_unique( $fonts[ $key ]['fontvariants'] );
				}
			}

			// Process mobile font and weight
			if ( $mb_font && $this->is_google_font( $mb_font ) ) {
				$key = str_replace( ' ', '+', $mb_font );
				if ( ! isset( $fonts[ $key ] ) ) {
					$fonts[ $key ] = [
						'fontfamily'   => $mb_font,
						'fontvariants' => [ $mb_weight ],
					];
				} else {
					$fonts[ $key ]['fontvariants'][] = $mb_weight;
					$fonts[ $key ]['fontvariants'] = array_unique( $fonts[ $key ]['fontvariants'] );
				}
			}
		}

		if ( ! empty( $fonts ) ) {
			$this->add_fonts( $fonts );
		}
	}

	/**
	 * Add a Google font to the collection
	 *
	 * @param string $font_family The font family name.
	 * @param array  $weights Array of font weights.
	 * @return void
	 */
	public function add_google_font( string $font_family, array $weights = [] ): void {
		if ( empty( $font_family ) || ! $this->is_google_font( $font_family ) ) {
			return;
		}

		if ( ! isset( self::$google_fonts[ $font_family ] ) ) {
			self::$google_fonts[ $font_family ] = [
				'fontfamily' => $font_family,
				'fontvariants' => $weights,
			];
		} else {
			self::$google_fonts[ $font_family ]['fontvariants'] = array_unique(
				array_merge(
					self::$google_fonts[ $font_family ]['fontvariants'],
					$weights
				)
			);
		}
	}

	/**
	 * Get all registered Google fonts
	 *
	 * @return array Array of Google fonts.
	 */
	public function get_google_fonts(): array {
		return self::$google_fonts;
	}

	/**
	 * Clear all registered Google fonts
	 *
	 * @return void
	 */
	public function clear_google_fonts(): void {
		self::$google_fonts = [];
	}

	/**
	 * Get the suffix part of an attribute name
	 *
	 * @param string $attribute_name The full attribute name.
	 * @return string The attribute suffix or empty string if no suffix.
	 */
	protected function get_attribute_suffix( string $attribute_name ): string {
		$parts = explode( '_', $attribute_name );
		return count( $parts ) > 1 ? $parts[1] : '';
	}

	/**
	 * Check if a font is a Google font
	 *
	 * @param string $font_family The font family name.
	 * @return bool Whether the font is a Google font.
	 */
	protected function is_google_font( string $font_family ): bool {
		if ( empty( $font_family ) ) {
			return false;
		}
		$google_fonts = include KADENCE_BLOCKS_PATH . 'includes/gfonts-names-array.php';
		
		return in_array( $font_family, $google_fonts, true );
	}

	/**
	 * Print Google Font Link
	 *
	 * @return void
	 */
	private function print_fonts_link(): void {
		$font_families = [];
		foreach ( self::$google_fonts as $key => $font ) {
			$variants = ! empty( $font['fontvariants'] ) ? ':' . implode( ',', $font['fontvariants'] ) : '';
			$font_families[] = $key . $variants;
		}

		if ( empty( $font_families ) ) {
			return;
		}

		$font_url = $this->build_google_fonts_url( $font_families );

		if ( 'preload' === apply_filters( 'kadence_blocks_google_fonts_load_type', 'link' ) ) {
			echo '<link rel="preload" as="style" href="' . esc_url( $font_url ) . '">';
			echo '<link rel="stylesheet" href="' . esc_url( $font_url ) . '">'; // phpcs:ignore WordPress.WP.EnqueuedResources.NonEnqueuedStylesheet
		} else {
			echo '<link rel="stylesheet" href="' . esc_url( $font_url ) . '">'; // phpcs:ignore WordPress.WP.EnqueuedResources.NonEnqueuedStylesheet
		}
	}

	/**
	 * Build Google Fonts URL
	 *
	 * @param array $font_families Array of font families with their variants.
	 * @return string Complete Google Fonts URL.
	 */
	private function build_google_fonts_url( array $font_families ): string {
		$base_url = 'https://fonts.googleapis.com/css?family=' . implode( '|', $font_families );
		
		if ( apply_filters( 'kadence_display_swap_google_fonts', true ) ) {
			$base_url .= '&display=swap';
		}

		return $base_url;
	}
}
