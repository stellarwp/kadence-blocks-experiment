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
	 * Set default theme option values
	 *
	 * @return default values of the theme.
	 */
	public static function defaults() {
		// Don't store defaults until after init.
		if ( is_null( self::$default_options ) ) {
			$styles = [];
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
	 * Set default theme option values
	 *
	 * @return default values of the theme.
	 */
	public static function dark_defaults() {
		// Don't store defaults until after init.
		if ( is_null( self::$default_dark_options ) ) {
			$styles = [];
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
			$styles = [];
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
			$options       = json_decode( get_option( self::get_base_option_name(), '[]' ), true );
			self::$base_options = wp_parse_args( $options, self::defaults() );
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
			$options       = json_decode( get_option( self::get_dark_option_name(), '[]' ), true );
			self::$dark_options = wp_parse_args( $options, self::dark_defaults() );
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
			$options       = json_decode( get_option( self::get_accent_option_name(), '[]' ), true );
			self::$accent_options = wp_parse_args( $options, self::accent_defaults() );
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
	 * @access public
	 * @return array
	 */
	public static function save_options( $global_style, $type = 'base' ) {
		return update_option( self::get_option_name( $type ), $global_style );
	}
}
