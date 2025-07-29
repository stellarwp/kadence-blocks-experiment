<?php
/**
 * Global Styles Manager
 *
 * Manages multiple global styles efficiently with caching and optimized loading.
 *
 * @package KadenceWP\KadenceBlocks\Settings
 */

declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Settings;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Manages multiple global styles with caching and optimized loading.
 *
 */
class Global_Styles_Manager {
	/**
	 * Cache for loaded global styles.
	 *
	 * @var array
	 */
	private static $styles_cache = [];

	/**
	 * Post type slug for global styles.
	 *
	 * @var string
	 */
	private static $post_type = 'kadence_global_style';

	/**
	 * Get multiple global styles by their IDs.
	 *
	 * @param array $style_ids Array of global style IDs to fetch.
	 * @return array Array of global styles keyed by style ID.
	 */
	public static function get_global_styles_by_ids( array $style_ids = [] ) {
		if ( empty( $style_ids ) ) {
			return [];
		}

		$styles = [];
		$uncached_ids = [];

		// Check cache first
		foreach ( $style_ids as $style_id ) {
			if ( isset( self::$styles_cache[ $style_id ] ) ) {
				$styles[ $style_id ] = self::$styles_cache[ $style_id ];
			} else {
				$uncached_ids[] = $style_id;
			}
		}

		// Load uncached styles
		if ( ! empty( $uncached_ids ) ) {
			$loaded_styles = self::load_styles_from_database( $uncached_ids );
			foreach ( $loaded_styles as $style_id => $style_data ) {
				self::$styles_cache[ $style_id ] = $style_data;
				$styles[ $style_id ] = $style_data;
			}
		}

		return $styles;
	}

	/**
	 * Get a single global style by ID.
	 *
	 * @param string $style_id The global style ID to fetch.
	 * @return array|null The global style data or null if not found.
	 */
	public static function get_global_style( string $style_id ) {
		$styles = self::get_global_styles_by_ids( [ $style_id ] );
		return isset( $styles[ $style_id ] ) ? $styles[ $style_id ] : null;
	}

	/**
	 * Load styles from the database.
	 *
	 * @param array $style_ids Array of style IDs to load.
	 * @return array Array of loaded styles.
	 */
	private static function load_styles_from_database( array $style_ids ) {
		$styles = [];

		// Load base styles from options
		$base_styles = [
			'kbs-base' => Global_Style::options( 'base' ),
			'kbs-contrast' => Global_Style::options( 'contrast' ),
			'kbs-accent' => Global_Style::options( 'accent' ),
		];

		foreach ( $style_ids as $style_id ) {
			if ( isset( $base_styles[ $style_id ] ) ) {
				$styles[ $style_id ] = $base_styles[ $style_id ];
			}
		}

		// Load custom styles from posts
		$custom_style_ids = array_diff( $style_ids, array_keys( $base_styles ) );
		if ( ! empty( $custom_style_ids ) ) {
			$posts = get_posts( [
				'post_type' => self::$post_type,
				'numberposts' => -1,
				'post_status' => 'publish',
				'meta_query' => [
					[
						'key' => 'kadence_global_style_id',
						'value' => $custom_style_ids,
						'compare' => 'IN',
					],
				],
			] );

			foreach ( $posts as $post ) {
				$decoded_content = json_decode( $post->post_content, true );
				if ( is_array( $decoded_content ) ) {
					$decoded_content['postId'] = $post->ID;
					$global_style_id = $decoded_content['styleId'] ?? '';
					if ( ! empty( $global_style_id ) ) {
						$styles[ $global_style_id ] = $decoded_content;
					}
				}
			}
		}

		return $styles;
	}

	/**
	 * Clear the styles cache.
	 */
	public static function clear_cache() {
		self::$styles_cache = [];
	}
}