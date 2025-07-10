<?php
/**
 * Handles all functionality related to the A/B Testing Block
 *
 * @since 0.1.1
 *
 * @package KadenceWP\KadenceBlocks
 */

declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Settings;

use KadenceWP\KadenceBlocks\REST\Global_Styles_Controller;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Handles all functionality related to the A/B Testing Block.
 *
 * @since 0.1.1
 *
 * @package KadenceWP\KadenceBlocks
 */
class Global_Style {
	/**
	 * Holds default style book values
	 *
	 * @var default values of the style book.
	 */
	protected static $default_options = null;
	/**
	 * Holds default style book values
	 *
	 * @var default values of the style book.
	 */
	protected static $default_dark_options = null;
	/**
	 * Holds default style book values
	 *
	 * @var default values of the style book.
	 */
	protected static $default_accent_options = null;

	/**
	 * Holds default style book values
	 *
	 * @var default values of the style book.
	 */
	protected static $base_options = null;
	/**
	 * Holds default style book values
	 *
	 * @var default values of the style book.
	 */
	protected static $dark_options = null;
	/**
	 * Holds default style book values
	 *
	 * @var default values of the style book.
	 */
	protected static $accent_options = null;
	/**
	 * Settings database Name.
	 *
	 * @var array
	 */
	private static $base_opt_name = null;
	/**
	 * Settings database Name.
	 *
	 * @var array
	 */
	private static $dark_opt_name = null;

	/**
	 * Settings database Name.
	 *
	 * @var array
	 */
	private static $accent_opt_name = null;
	/**
	 * Holds default palette values
	 *
	 * @var values of the theme settings.
	 */
	protected static $default_palette = null;

	/**
	 * Holds palette values
	 *
	 * @var values of the theme settings.
	 */
	protected static $palette = null;

	private static $slug = 'kadence_global_style';
	
	/**
	 * Get Palette Option.
	 *
	 * @param string $subkey option subkey.
	 * @param string $active_palette the active palette.
	 */
	public static function palette_option( $subkey, $active_palette = null ) {
		if ( is_null( self::$palette ) ) {
			$palette = get_option( 'kadence_global_palette' );
			if ( $palette && ! empty( $palette ) ) {
				self::$palette = json_decode( $palette, true );
			} else {
				self::$palette = json_decode( self::palette_defaults(), true );
			}
		}
		$active = ! empty( $active_palette ) ? $active_palette : apply_filters( 'kadence_active_palette', ( self::$palette && is_array( self::$palette ) && isset( self::$palette['active'] ) && ! empty( self::$palette['active'] ) ? self::$palette['active'] : 'palette' ) );
		$value  = '';
		if ( self::$palette && is_array( self::$palette ) && isset( self::$palette[ $active ] ) && is_array( self::$palette[ $active ] ) ) {
			$palette_number = (int) substr( $subkey, -1 ) - 1;
			$palette_item   = ( isset( self::$palette[ $active ][ $palette_number ] ) && is_array( self::$palette[ $active ][ $palette_number ] ) ? self::$palette[ $active ][ $palette_number ] : [] );
			if ( isset( $palette_item['slug'] ) && $palette_item['slug'] === $subkey ) {
				$value = ( isset( $palette_item['color'] ) && ! empty( $palette_item['color'] ) ? $palette_item['color'] : '' );
			}
		}

		return apply_filters( 'kadence_palette_option', $value, $subkey );
	}
	/**
	 * Set default theme option values
	 *
	 * @return string values of the theme.
	 */
	public static function palette_defaults() {
		// Don't store defaults until after init.
		if ( is_null( self::$default_palette ) ) {
			self::$default_palette = apply_filters( 'kadence_global_palette_defaults', '{"palette":[{"color":"#2B6CB0","slug":"palette1","name":"Palette Color 1"},{"color":"#215387","slug":"palette2","name":"Palette Color 2"},{"color":"#1A202C","slug":"palette3","name":"Palette Color 3"},{"color":"#2D3748","slug":"palette4","name":"Palette Color 4"},{"color":"#4A5568","slug":"palette5","name":"Palette Color 5"},{"color":"#718096","slug":"palette6","name":"Palette Color 6"},{"color":"#EDF2F7","slug":"palette7","name":"Palette Color 7"},{"color":"#F7FAFC","slug":"palette8","name":"Palette Color 8"},{"color":"#ffffff","slug":"palette9","name":"Palette Color 9"}],"second-palette":[{"color":"#2B6CB0","slug":"palette1","name":"Palette Color 1"},{"color":"#215387","slug":"palette2","name":"Palette Color 2"},{"color":"#1A202C","slug":"palette3","name":"Palette Color 3"},{"color":"#2D3748","slug":"palette4","name":"Palette Color 4"},{"color":"#4A5568","slug":"palette5","name":"Palette Color 5"},{"color":"#718096","slug":"palette6","name":"Palette Color 6"},{"color":"#EDF2F7","slug":"palette7","name":"Palette Color 7"},{"color":"#F7FAFC","slug":"palette8","name":"Palette Color 8"},{"color":"#ffffff","slug":"palette9","name":"Palette Color 9"}],"third-palette":[{"color":"#2B6CB0","slug":"palette1","name":"Palette Color 1"},{"color":"#215387","slug":"palette2","name":"Palette Color 2"},{"color":"#1A202C","slug":"palette3","name":"Palette Color 3"},{"color":"#2D3748","slug":"palette4","name":"Palette Color 4"},{"color":"#4A5568","slug":"palette5","name":"Palette Color 5"},{"color":"#718096","slug":"palette6","name":"Palette Color 6"},{"color":"#EDF2F7","slug":"palette7","name":"Palette Color 7"},{"color":"#F7FAFC","slug":"palette8","name":"Palette Color 8"},{"color":"#ffffff","slug":"palette9","name":"Palette Color 9"}],"active":"palette"}' );
		}
		return self::$default_palette;
	}

	/**
	 * Get default options by type
	 *
	 * @param string $type The type of options to get.
	 * @return array The default options.
	 */
	public static function get_default_options_by_type( $type = 'base' ) {
		switch ( $type ) {
			case 'base':
				return self::defaults();
			case 'dark':
				return self::dark_defaults();
			case 'accent':
				return self::accent_defaults();
		}
	}

	/**
	 * Set default theme option values
	 *
	 * @return default values of the theme.
	 */
	public static function defaults() {
		// Don't store defaults until after init.
		if ( is_null( self::$default_options ) ) {
			$styles    = [];
			$base_file = KADENCE_BLOCKS_PATH . 'inc/data/base.json';
			if ( file_exists( $base_file ) ) {
				$base_content = json_decode( file_get_contents( $base_file ), true );
				if ( $base_content ) {
					$styles = $base_content;
				}
			}
			self::$default_options = apply_filters(
				'kadence_blocks_stylebook_defaults',
				$styles
			);
		}
		return self::$default_options;
	}
	/**
	 * Get Palette
	 */
	public static function get_palette() {
		$palette = get_option( 'kadence_global_palette' );
		if ( ! $palette || empty( $palette ) ) {
			$palette = self::palette_defaults();
		}
		return $palette;
	}
	/**
	 * Save Base Palette
	 */
	public static function save_base_palette( $global_style ) {
		$global_palette = json_decode( self::get_palette(), true );
		if ( isset( $global_palette['active'] ) && ! empty( $global_palette['active'] ) ) {
			$active = $global_palette['active'];
		} else {
			$active = 'palette';
		}
		$update_palette = false;
		if ( isset( $global_style['mappings']['colors'] ) && is_array( $global_style['mappings']['colors'] ) ) {
			foreach ( $global_style['mappings']['colors'] as $key => $value ) {
				if ( $key === 'palette1' && ! empty( $value['value'] ) ) {
					$global_palette[ $active ][0]['color'] = $value['value'];
					$update_palette                        = true;
				}
				if ( $key === 'palette2' && ! empty( $value['value'] ) ) {
					$global_palette[ $active ][1]['color'] = $value['value'];
					$update_palette                        = true;
				}
				if ( $key === 'palette3' && ! empty( $value['value'] ) ) {
					$global_palette[ $active ][2]['color'] = $value['value'];
					$update_palette                        = true;
				}
				if ( $key === 'palette4' && ! empty( $value['value'] ) ) {
					$global_palette[ $active ][3]['color'] = $value['value'];
					$update_palette                        = true;
				}
				if ( $key === 'palette5' && ! empty( $value['value'] ) ) {
					$global_palette[ $active ][4]['color'] = $value['value'];
					$update_palette                        = true;
				}
				if ( $key === 'palette6' && ! empty( $value['value'] ) ) {
					$global_palette[ $active ][5]['color'] = $value['value'];
					$update_palette                        = true;
				}
				if ( $key === 'palette7' && ! empty( $value['value'] ) ) {
					$global_palette[ $active ][6]['color'] = $value['value'];
					$update_palette                        = true;
				}
				if ( $key === 'palette8' && ! empty( $value['value'] ) ) {
					$global_palette[ $active ][7]['color'] = $value['value'];
					$update_palette                        = true;
				}
				if ( $key === 'palette9' && ! empty( $value['value'] ) ) {
					$global_palette[ $active ][8]['color'] = $value['value'];
					$update_palette                        = true;
				}
			}
		}
		if ( $update_palette ) {
			update_option( 'kadence_global_palette', json_encode( $global_palette ) );
		}
		return $global_style;
	}
	/**
	 * Merge colors
	 *
	 * @param array $styles styles.
	 * @param array $global_colors global colors.
	 * @return array
	 */
	public static function merge_colors( $colors, $global_colors ) {
		foreach ( $colors as $key => $value ) {
			if ( ! empty( $global_colors[ $key ] ) ) {
				$colors[ $key ]['value'] = $global_colors[ $key ];
			}
		}
		return $colors;
	}

	/**
	 * Get dark defaults.
	 *
	 * @return array
	 */
	public static function dark_defaults() {
		// Don't store defaults until after init.
		if ( is_null( self::$default_dark_options ) ) {
			$styles    = [];
			$dark_file = KADENCE_BLOCKS_PATH . 'inc/data/dark.json';
			if ( file_exists( $dark_file ) ) {
				$dark_content = json_decode( file_get_contents( $dark_file ), true );
				if ( $dark_content ) {
					$styles = $dark_content;
				}
			}
			self::$default_dark_options = apply_filters(
				'kadence_blocks_stylebook_dark_defaults',
				$styles
			);
		}
		return self::$default_dark_options;
	}
	/**
	 * Set default theme option values
	 *
	 * @return default values of the theme.
	 */
	public static function accent_defaults() {
		// Don't store defaults until after init.
		if ( is_null( self::$default_accent_options ) ) {
			$styles      = [];
			$accent_file = KADENCE_BLOCKS_PATH . 'inc/data/accent.json';
			if ( file_exists( $accent_file ) ) {
				$accent_content = json_decode( file_get_contents( $accent_file ), true );
				if ( $accent_content ) {
					$styles = $accent_content;
				}
			}
			self::$default_accent_options = apply_filters(
				'kadence_blocks_stylebook_accent_defaults',
				$styles
			);
		}
		return self::$default_accent_options;
	}
	/**
	 * Get Base Option Name
	 *
	 * @access public
	 * @return string
	 */
	public static function get_base_option_name() {
		// Define sections.
		if ( is_null( self::$base_opt_name ) ) {
			self::$base_opt_name = apply_filters( 'kadence_blocks_stylebook_option_name', 'kadence_blocks_stylebook' );
		}
		// Return option_name.
		return self::$base_opt_name;
	}
	/**
	 * Get Dark Option Name
	 *
	 * @access public
	 * @return string
	 */
	public static function get_dark_option_name() {
		// Define sections.
		if ( is_null( self::$dark_opt_name ) ) {
			self::$dark_opt_name = apply_filters( 'kadence_blocks_stylebook_dark_option_name', 'kadence_blocks_stylebook_dark' );
		}
		// Return option_name.
		return self::$dark_opt_name;
	}
	/**
	 * Get Accent Option Name
	 *
	 * @access public
	 * @return string
	 */
	public static function get_accent_option_name() {
		// Define sections.
		if ( is_null( self::$accent_opt_name ) ) {
			self::$accent_opt_name = apply_filters( 'kadence_blocks_stylebook_accent_option_name', 'kadence_blocks_stylebook_accent' );
		}
		// Return option_name.
		return self::$accent_opt_name;
	}
	/**
	 * Get Base Options
	 *
	 * @access public
	 * @return array
	 */
	public static function get_base_options() {
		if ( is_null( self::$base_options ) ) {
			$options                                = json_decode( get_option( self::get_base_option_name(), '[]' ), true );
			$settings_options                       = self::deep_merge( self::defaults(), $options );
			$global_colors                          = [
				'palette1' => self::palette_option( 'palette1' ),
				'palette2' => self::palette_option( 'palette2' ),
				'palette3' => self::palette_option( 'palette3' ),
				'palette4' => self::palette_option( 'palette4' ),
				'palette5' => self::palette_option( 'palette5' ),
				'palette6' => self::palette_option( 'palette6' ),
				'palette7' => self::palette_option( 'palette7' ),
				'palette8' => self::palette_option( 'palette8' ),
				'palette9' => self::palette_option( 'palette9' ),
			];
			$settings_options['mappings']['colors'] = self::merge_colors( $settings_options['mappings']['colors'], $global_colors );
			self::$base_options                     = $settings_options;
		}
		return self::$base_options;
	}
	/**
	 * Get Dark Options
	 *
	 * @access public
	 * @return array
	 */
	public static function get_dark_options() {
		if ( is_null( self::$dark_options ) ) {
			$options            = json_decode( get_option( self::get_dark_option_name(), '[]' ), true );
			self::$dark_options = self::deep_merge( $options, self::dark_defaults() );
		}
		return self::$dark_options;
	}
	/**
	 * Get Accent Options
	 *
	 * @access public
	 * @return array
	 */
	public static function get_accent_options() {
		if ( is_null( self::$accent_options ) ) {
			$options              = json_decode( get_option( self::get_accent_option_name(), '[]' ), true );
			self::$accent_options = self::deep_merge( $options, self::accent_defaults() );
		}
		return self::$accent_options;
	}
	/**
	 * Get Option
	 *
	 * @param string $key option key.
	 * @param mix    $default option default.
	 */
	public static function options( $type = 'base' ) {
		$options = [];
		switch ( $type ) {
			case 'base':
				$options = self::get_base_options();
				break;
			case 'dark':
				$options = self::get_dark_options();
				break;
			case 'accent':
				$options = self::get_accent_options();
				break;
		}
		return $options;
	}
	/**
	 * Get Option Name
	 *
	 * @access public
	 * @return string
	 */
	public static function get_option_name( $type = 'base' ) {
		switch ( $type ) {
			case 'base':
				return self::get_base_option_name();
			case 'dark':
				return self::get_dark_option_name();
			case 'accent':
				return self::get_accent_option_name();
		}
	}
	/**
	 * Get Global Style
	 * 
	 * @param array  $global_style The global style to save. 
	 * @param string $type The type of options to save.
	 * @return bool True if the options were saved, false otherwise.
	 */
	public static function save_options( $global_style = [], $type = 'base' ) {
		$default_options       = self::get_default_options_by_type( $type );
		$new_options           = self::deep_diff( $default_options, $global_style, true );
		$stamped_new_options   = Global_Styles_Controller::stamp_changes( $global_style, $new_options );
		$sanitized_new_options = Global_Styles_Controller::sanitize_global_style( $stamped_new_options );
		return update_option( self::get_option_name( $type ), json_encode( $sanitized_new_options ) );
	}
	/**
	 * Deep merge arrays with defaults
	 *
	 * @param array $defaults The default array to merge into.
	 * @param array $args The array to merge from.
	 * @return array The merged array.
	 */
	public static function deep_merge( $defaults, $args ) {
		$result = $defaults;

		if ( ! is_array( $defaults ) || ! is_array( $args ) ) {
			return $args;
		}

		foreach ( $args as $key => $value ) {
			if ( is_array( $value ) && isset( $result[ $key ] ) && is_array( $result[ $key ] ) ) {
				$result[ $key ] = self::deep_merge( $result[ $key ], $value );
			} else {
				$result[ $key ] = $value;
			}
		}

		return $result;
	}

	/**
	 * Get deep differences between two arrays
	 *
	 * @param array $array1 The first array to compare.
	 * @param array $array2 The second array to compare.
	 * @param bool  $ignore_empty Whether to ignore empty values.
	 * @return array The differences between the arrays.
	 */
	public static function deep_diff( $array1, $array2, $ignore_empty = false ) {
		$diff = [];

		// Handle non-array inputs
		if ( ! is_array( $array1 ) || ! is_array( $array2 ) ) {
			if ( $ignore_empty && empty( $array2 ) ) {
				return [];
			} else {
				return $array1 !== $array2 ? $array2 : [];
			}
		}

		// Check for keys in array2 that are different or not in array1
		foreach ( $array2 as $key => $value ) {
			if ( ! isset( $array1[ $key ] ) ) {
				if ( $ignore_empty && empty( $value ) ) {
					continue;
				}
				$diff[ $key ] = $value;
			} elseif ( is_array( $value ) && is_array( $array1[ $key ] ) ) {
				$nested_diff = self::deep_diff( $array1[ $key ], $value, $ignore_empty );
				if ( ! empty( $nested_diff ) ) {
					$diff[ $key ] = $nested_diff;
				}
			} elseif ( $value !== $array1[ $key ] ) {
				if ( $ignore_empty && empty( $value ) ) {
					continue;
				}
				$diff[ $key ] = $value;
			}
		}

		// Check for keys in array1 that are not in array2
		foreach ( $array1 as $key => $value ) {
			if ( ! $ignore_empty && ! isset( $array2[ $key ] ) ) {
				$diff[ $key ] = null;
			}
		}

		return $diff;
	}

	/**
	 * Get Global Styles
	 *
	 * @access public
	 * @return array
	 */
	public static function get_global_styles() {
		$gs_contents = [
			'kbs-base'   => self::options( 'base' ),
			'kbs-dark'   => self::options( 'dark' ),
			'kbs-accent' => self::options( 'accent' ),
		];

		$all_posts = get_posts( 
			[
				'post_type'   => self::$slug,
				'numberposts' => -1,
				'post_status' => [ 'publish' ],
			] 
		);

		if ( $all_posts ) {
			foreach ( $all_posts as $_post ) {
				$decoded_content = json_decode( $_post->post_content, true );
				if ( ! is_array( $decoded_content ) ) {
					continue;
				}
				$decoded_content['postId'] = $_post->ID;
				$global_style_id           = $decoded_content['styleId'] ?? '';
				// If data is corrupt, skip it
				if ( ! empty( $global_style_id ) ) {
					$gs_contents[ $global_style_id ] = $decoded_content;
				}
			}
		}
		return $gs_contents;
	}
}
