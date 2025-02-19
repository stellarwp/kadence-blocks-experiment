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

		$font_groups = $this->group_font_attributes( $attributes, $attributes_meta );
		$fonts = [];

		foreach ( $font_groups as $group ) {
			if ( empty( $group['family'] ) ) {
				continue;
			}

			$font_families = array_filter( [
				$group['family']['dt'] ?? null,
				$group['family']['td'] ?? null,
				$group['family']['mb'] ?? null,
			] );

			$weights = array_filter( [
				$group['weight']['dt'] ?? null,
				$group['weight']['td'] ?? null,
				$group['weight']['mb'] ?? null,
				'400', // Default weight
			] );

			foreach ( $font_families as $font_family ) {
				if ( ! $this->is_google_font( $font_family ) ) {
					continue;
				}

				$key = str_replace( ' ', '+', $font_family );
				if ( ! isset( $fonts[ $key ] ) ) {
					$fonts[ $key ] = [
						'fontfamily'   => $font_family,
						'fontvariants' => array_unique( $weights ),
					];
				} else {
					$fonts[ $key ]['fontvariants'] = array_unique( 
						array_merge( 
							$fonts[ $key ]['fontvariants'],
							$weights
						)
					);
				}
			}
		}

		if ( ! empty( $fonts ) ) {
			$this->add_fonts( $fonts );
		}
	}

	/**
	 * Get Google Font URL from block attributes
	 * This is kept for backwards compatibility but fonts should be processed through process_block_fonts
	 *
	 * @param array $attributes Block attributes.
	 * @param array $attributes_meta Block attributes metadata.
	 * @return string The Google Font URL.
	 * @deprecated Use process_block_fonts() instead
	 */
	public function get_google_font_url( array $attributes, array $attributes_meta ): string {
		if ( empty( $attributes ) || empty( $attributes_meta ) ) {
			return '';
		}

		$font_groups = $this->group_font_attributes( $attributes, $attributes_meta );
		$fonts = [];

		foreach ( $font_groups as $group ) {
			if ( empty( $group['family'] ) ) {
				continue;
			}

			$font_families = array_filter( [
				$group['family']['dt'] ?? null,
				$group['family']['td'] ?? null,
				$group['family']['mb'] ?? null,
			] );

			$weights = array_filter( [
				$group['weight']['dt'] ?? null,
				$group['weight']['td'] ?? null,
				$group['weight']['mb'] ?? null,
				'400', // Default weight
			] );

			foreach ( $font_families as $font_family ) {
				if ( ! $this->is_google_font( $font_family ) ) {
					continue;
				}

				$fonts[ $font_family ] = isset( $fonts[ $font_family ] )
					? array_unique( array_merge( $fonts[ $font_family ], $weights ) )
					: array_unique( $weights );
			}
		}

		if ( empty( $fonts ) ) {
			return '';
		}

		return $this->build_google_fonts_url( $fonts );
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
	 * Group font attributes by their suffix
	 *
	 * @param array $attributes Block attributes.
	 * @param array $attributes_meta Block attributes metadata.
	 * @return array Grouped font attributes.
	 */
	protected function group_font_attributes( array $attributes, array $attributes_meta ): array {
		$font_groups = [];

		foreach ( $attributes_meta as $key => $meta ) {
			if ( empty( $meta['renderCSS'] ) || empty( $meta['property'] ) ) {
				continue;
			}

			if ( $meta['property'] !== 'font-family' && $meta['property'] !== 'font-weight' ) {
				continue;
			}

			$suffix = $this->get_attribute_suffix( $key );
			$group_key = $suffix ?: 'default';

			if ( ! isset( $font_groups[ $group_key ] ) ) {
				$font_groups[ $group_key ] = [];
			}

			if ( $meta['property'] === 'font-family' ) {
				$font_groups[ $group_key ]['family'] = $attributes[ $key ] ?? null;
				$font_groups[ $group_key ]['familyMeta'] = $meta;
			} elseif ( $meta['property'] === 'font-weight' ) {
				$font_groups[ $group_key ]['weight'] = $attributes[ $key ] ?? null;
				$font_groups[ $group_key ]['weightMeta'] = $meta;
			}
		}

		return $font_groups;
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
