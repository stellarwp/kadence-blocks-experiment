<?php
/**
 * Creates minified css via PHP.
 */

namespace KadenceWP\KadenceBlocks\Frontend;

use KadenceWP\KadenceBlocks\Container;
use KadenceWP\KadenceBlocks\Frontend\Global_Style_Css;
use KadenceWP\KadenceBlocks\Blocks\Editor_Assets;
use KadenceWP\KadenceBlocks\Settings\Global_Style;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class to create a minified css output.
 */
class CSS_Engine {

	/**
	 * CSS to enqueue
	 *
	 * @var array
	 */
	public static $styles = array();

	/**
	 * CSS to enqueue
	 *
	 * @var array
	 */
	public static $head_styles = array();

	/**
	 * CSS to enqueue
	 *
	 * @var array
	 */
	public static $custom_styles = array();

	/**
	 * Global styles css
	 *
	 * @var object
	 */
	protected $global_styles_css = null;

	/**
	 * The css group id.
	 *
	 * @access protected
	 * @var string
	 */
	protected $_style_id = '';

	/**
	 * The css selector that you're currently adding rules to
	 *
	 * @access protected
	 * @var string
	 */
	protected $_selector = '';

	/**
	 * Associative array of Google Fonts to load.
	 *
	 * Do not access this property directly, instead use the `get_google_fonts()` method.
	 *
	 * @var array
	 */
	protected static $google_fonts = array();

	/**
	 * Stores the final css output with all of its rules for the current selector.
	 *
	 * @access protected
	 * @var string
	 */
	protected $_selector_output = '';

	/**
	 * Can store a list of additional selector states which can be added and removed.
	 *
	 * @access protected
	 * @var array
	 */
	protected $_selector_states = array();

	/**
	 * Arrays that hold all of the css to output inside of media queries for each device
	 *
	 * @access protected
	 * @var array
	 */
	protected $_device_media_queries = array();

	/**
	 * The current media state (device) being targeted
	 *
	 * @access protected
	 * @var string
	 */
	protected $_media_state = 'desktop';

	/**
	 * Stores a list of css properties that require more formating
	 *
	 * @access private
	 * @var array
	 */
	private $_special_properties_list = array(
		'transition',
		'transition-delay',
		'transition-duration',
		'transition-property',
		'transition-timing-function',
	);

	/**
	 * Stores all of the rules that will be added to the selector
	 *
	 * @access protected
	 * @var string
	 */
	protected $_css = '';

	/**
	 * Stores all of the custom css.
	 *
	 * @access protected
	 * @var string
	 */
	protected $_css_string = '';

	/**
	 * The string that holds all of the css to output
	 *
	 * @access protected
	 * @var string
	 */
	protected $_output = '';

	/**
	 * Stores media queries
	 *
	 * @var null
	 */
	protected $_media_query = null;

	/**
	 * The string that holds all of the css to output inside of the media query
	 *
	 * @access protected
	 * @var string
	 */
	protected $_media_query_output = '';

	/**
	 * Stores media queries
	 *
	 * @var null
	 */
	protected $media_queries = null;

	/**
	 * The device options
	 *
	 * @var array
	 */
	protected $device_options = null;

	/**
	 * The device slugs
	 * 
	 * @var array
	 */
	protected $device_slugs = array();

	/**
	 * Spacing variables used in string based padding / margin.
	 */
	protected $spacing_sizes = array(
		'none' => 'var(--global-kb-spacing-none, 0rem )',
		'ss-auto' => 'var(--global-kb-spacing-auto, auto)',
		'xxs' => 'var(--global-kb-spacing-xxs, 0.5rem)',
		'xs' => 'var(--global-kb-spacing-xs, 1rem)',
		'sm' => 'var(--global-kb-spacing-sm, 1.5rem)',
		'md' => 'var(--global-kb-spacing-md, 2rem)',
		'lg' => 'var(--global-kb-spacing-lg, 3rem)',
		'xl' => 'var(--global-kb-spacing-xl, 4rem)',
		'xxl' => 'var(--global-kb-spacing-xxl, 5rem)',
		'3xl' => 'var(--global-kb-spacing-3xl, 6.5rem)',
		'4xl' => 'var(--global-kb-spacing-4xl, 8rem)',
		'5xl' => 'var(--global-kb-spacing-5xl, 10rem)'
	);
	/**
	 * Font size variables used in string based font sizes.
	 */
	protected $font_sizes = array(
		'sm' => 'var(--kbs-font-size-sm, 0.9rem)',
		'md' => 'var(--kbs-font-size-md, 1.25rem)',
		'lg' => 'var(--kbs-font-size-lg, 2rem)',
		'xl' => 'var(--kbs-font-size-xl, 3rem)',
		'xxl' => 'var(--kbs-font-size-xxl, 4rem)',
		'3xl' => 'var(--kbs-font-size-3xl, 5rem)',
	);
	/**
	 * Line height variables used in string based line heights.
	 */
	protected $line_heights = array(
		'sm' => 'var(--kbs-line-height-sm, 1.2)',
		'md' => 'var(--kbs-line-height-md, 1.5)',
		'lg' => 'var(--kbs-line-height-lg, 1.8)',
	);
	/**
	 * Letter spacing variables used in string based letter spacing.
	 */
	protected $letter_spacings = array(
		'sm' => 'var(--kbs-letter-spacing-sm, -0.05em)',
		'md' => 'var(--kbs-letter-spacing-md, 0)',
		'lg' => 'var(--kbs-letter-spacing-lg, 0.05em)',
	);
	/**
	 * Icon size variables used in string based icon sizes.
	 */
	protected $icon_sizes = array(
		'xs' => 'var(--kbs-icon-size-xs, 1rem)',
		'sm' => 'var(--kbs-icon-size-sm, 2rem)',
		'md' => 'var(--kbs-icon-size-md, 3rem)',
		'lg' => 'var(--kbs-icon-size-lg, 4rem)',
		'xl' => 'var(--kbs-icon-size-xl, 5rem)',
	);
	/**
	 * Gaps variables used in string based gutters.
	 */
	protected $gap_sizes = array(
		'none' => 'var(--global-kb-gap-none, 0rem )',
		'skinny' => 'var(--global-kb-gap-sm, 1rem)',
		'narrow' => '20px',
		'wide' => '40px',
		'widest' => '80px',
		'default' => 'var(--global-kb-gap-md, 2rem)',
		'wider' => 'var(--global-kb-gap-lg, 4rem)',
		'xs' => 'var(--global-kb-gap-xs, 0.5rem )',
		'sm' => 'var(--global-kb-gap-sm, 1rem)',
		'md' => 'var(--global-kb-gap-md, 2rem)',
		'lg' => 'var(--global-kb-gap-lg, 4rem)',
	);
	/**
	 * Global styles.
	 *
	 * @var array
	 */
	protected $global_styles = null;

	/**
	 * constructor
	 */
	public function __construct() {

		$this->device_options = Editor_Assets::get_responsive_device_options();
		// Initialize device slugs and media query arrays dynamically
		foreach ( $this->device_options as $device_option ) {
			$device_key = isset( $device_option['key'] ) ? $device_option['key'] : '';
			if ( $device_key ) {
				// Initialize device media query array
				$this->_device_media_queries[ $device_key ] = array();
				
				// Create shorthand slugs
				if ( ! isset( $this->device_slugs[ $device_key ] ) ) {
					// Create a shorthand 2-character code from the device key
					$this->device_slugs[ $device_key ] = substr( $device_key, 0, 2 );
				}
			}
		}
		if( null === $this->global_styles ) {
            $this->global_styles = $this->get_global_styles();
        }
		// Set up the global styles css engine in the global styles css engine.
		$this->global_styles_css = new Global_Style_Css( $this, $this->device_options );
	}

	/**
	 * Setup global styles.
	 */
	public function setup_global_styles() {
		// Generate global styles CSS for all mappings.
		$this->global_styles_css->generate_css();
	}
	/**
	 * Get global styles.
	 */
	public function get_global_styles() {
		$global_style_data = Global_Style::get_global_styles();
		if ( ! $global_style_data ) {
			return [];
		}

		return $global_style_data;
	}

	/**
	 * Render block CSS helper function
	 */
	public function frontend_block_css() {
		if ( ! empty( self::$styles ) ) {
			self::$head_styles = self::$styles;
			$output = '';
			foreach ( self::$styles as $key => $value ) {
				// Remove the comments if we want to change how the global mappings are loaded.
				// if ( strpos( $key, 'global-styles' ) !== false ) {
				// 	continue;
				// }
				$output .= $value;
			}
			$custom_output = '';
			if ( ! empty( self::$custom_styles ) && is_array( self::$custom_styles ) ) {
				foreach ( self::$custom_styles as $c_key => $c_value ) {
					$custom_output .= $c_value;
				}
			}
			if ( ! empty( $output ) ) {
				wp_register_style( 'kbs_css', false );
				wp_enqueue_style( 'kbs_css' );
				wp_add_inline_style( 'kbs_css', $output );
			}
			if ( ! empty( $custom_output ) ) {
				wp_register_style( 'kbs_custom_css', false );
				wp_enqueue_style( 'kbs_custom_css' );
				wp_add_inline_style( 'kbs_custom_css', $custom_output );
			}
		}
	}
	/**
	 * Sets a style id to keep a record of rendering.
	 *
	 * @access public
	 * @since  1.0
	 *
	 * @param  string $style_id - the css group id.
	 * @return $this
	 */
	public function set_style_id( $style_id = '' ) {
		if ( empty( $style_id ) ) {
			return;
		}
		// Render the css in the output string everytime the style_id changes.
		if ( ! isset( self::$styles[ $style_id ] ) ) {
			self::$styles[ $style_id ] = '';
		}
		$this->_style_id = $style_id;
		return $this;
	}

	/**
	 * Sets a style id to keep a record of rendering.
	 *
	 * @access public
	 * @since  1.0
	 *
	 * @param  string $style_id - the css group id.
	 * @return $this
	 */
	public function has_styles( $style_id = '' ) {
		if ( empty( $style_id ) ) {
			return false;
		}
		if ( isset( self::$styles[ $style_id ] ) ) {
			return true;
		}
		return false;
	}
	/**
	 * Sets a style id to keep a record of rendering.
	 *
	 * @access public
	 * @since  1.0
	 *
	 * @param  string $style_id - the css group id.
	 * @return $this
	 */
	public function has_header_styles( $style_id = '' ) {
		if ( empty( $style_id ) ) {
			return false;
		}
		if ( isset( self::$head_styles[ $style_id ] ) ) {
			return true;
		}
		return false;
	}
	/**
	 * Sets a selector to the object and changes the current selector to a new one
	 *
	 * @access public
	 * @since  1.0
	 *
	 * @param  string $selector - the css identifier of the html that you wish to target.
	 * @return $this
	 */
	public function set_selector( $selector = '' ) {
		// Render the css in the output string every time the selector changes from what it is currently set to.
		if ( '' !== $this->_selector && $selector !== $this->_selector ) {
			$this->add_selector_rules_to_output();
		}
		$this->_selector = $selector;
		return $this;
	}
	/**
	 * Sets css string for final output.
	 *
	 * @param  string $string - the css string.
	 * @return $this
	 */
	public function add_css_string( $string ) {
		$string = str_replace( PHP_EOL, '', trim( $string ) );
		$this->_css_string .= $string;
		return $this;
	}
	/**
	 * Get media queries.
	 *
	 * @param  string $device - the device size.
	 * @return $this
	 */
	public function get_media_queries( $device ) {
		if ( ! isset( $this->media_queries[ $device ] ) ) {
			$media_query            = array();

			foreach ( $this->device_options as $device_option ) {
				$media_query[ $device_option['key'] ] = $device_option['mediaQuery'];
			}

			$this->media_queries    = $media_query;
		}
		return isset( $this->media_queries[ $device ] ) ? $this->media_queries[ $device ] : '';
	}
	/**
	 * Wrapper for the set_selector method, changes the selector to add new rules
	 *
	 * @access public
	 * @since  1.0
	 *
	 * @see    set_selector()
	 * @param  string $selector the css selector.
	 * @return $this
	 */
	public function change_selector( $selector = '' ) {
		return $this->set_selector( $selector );
	}

	/**
	 * Adds a pseudo class to the selector ex. :hover, :active, :focus
	 *
	 * @access public
	 * @since  1.0
	 *
	 * @param  $state - the selector state
	 * @param  reset - if true the        $_selector_states variable will be reset
	 * @return $this
	 */
	public function add_selector_state( $state, $reset = true ) {
		if ( $reset ) {
			$this->reset_selector_states();
		}
		$this->_selector_states[] = $state;
		return $this;
	}

	/**
	 * Adds multiple pseudo classes to the selector
	 *
	 * @access public
	 * @since  1.0
	 *
	 * @param  array $states - the states you would like to add
	 * @return $this
	 */
	public function add_selector_states( $states = array() ) {
		$this->reset_selector_states();
		foreach ( $states as $state ) {
			$this->add_selector_state( $state, false );
		}
		return $this;
	}

	/**
	 * Removes the selector's pseudo classes
	 *
	 * @access public
	 * @since  1.0
	 *
	 * @return $this
	 */
	public function reset_selector_states() {
		$this->add_selector_rules_to_output();
		if ( ! empty( $this->_selector_states ) ) {
			$this->_selector_states = array();
		}
		return $this;
	}

	/**
	 * Get the current selector with any states applied
	 *
	 * @access public
	 * @since  1.0
	 *
	 * @return string
	 */
	public function get_current_selector_with_states() {
		if ( ! empty( $this->_selector_states ) ) {
			// For now, we'll just concatenate all states to the selector
			// This handles cases like :hover, :focus, etc.
			return $this->_selector . implode( '', $this->_selector_states );
		}
		return $this->_selector;
	}
	/**
	 * Check to see if variable contains a number including 0.
	 *
	 * @access public
	 *
	 * @param  string $value - the css property.
	 * @return boolean
	 */
	public function is_number( &$value ) {
		return isset( $value ) && is_numeric( $value );
	}
	/**
	 * Adds a new rule to the css output
	 *
	 * @access public
	 * @since  1.0
	 *
	 * @param  string $property - the css property.
	 * @param  string $value - the value to be placed with the property.
	 * @param  string $prefix - not required, but allows for the creation of a browser prefixed property.
	 * @return $this
	 */
	public function add_rule( $property, $value, $prefix = null ) {
		$format = is_null( $prefix ) ? '%1$s:%2$s;' : '%3$s%1$s:%2$s;';
		if ( $value && ! empty( $value ) ) {
			if ( $this->_media_state !== 'desktop' ) {
				if ( isset( $this->_device_media_queries[ $this->_media_state ] ) ) {
					// Use the selector with states (e.g., including :hover) for media queries
					$selector_key = $this->get_current_selector_with_states();
					if ( ! isset( $this->_device_media_queries[ $this->_media_state ][ $selector_key ] ) ) {
						$this->_device_media_queries[ $this->_media_state ][ $selector_key ] = '';
					}
					$this->_device_media_queries[ $this->_media_state ][ $selector_key ] .= sprintf( $format, $property, $value, $prefix );
				}
			} else {
				$this->_css .= sprintf( $format, $property, $value, $prefix );
			}
		}
		return $this;
	}

	/**
	 * Adds browser prefixed rules, and other special rules to the css output
	 *
	 * @access public
	 * @since  1.0
	 *
	 * @param  string $property - the css property
	 * @param  string $value - the value to be placed with the property
	 * @return $this
	 */
	public function add_special_rules( $property, $value ) {
		// Switch through the property types and add prefixed rules.
		switch ( $property ) {
			case 'background-image':
				$this->add_rule( $property, sprintf( "url('%s')", $value ) );
				break;
			case 'content':
				$this->add_rule( $property, sprintf( '%s', $value ) );
				break;
			default:
				$this->add_rule( $property, $value, '-webkit-' );
				$this->add_rule( $property, $value, '-moz-' );
				$this->add_rule( $property, $value );
				break;
		}

		return $this;
	}

	/**
	 * Adds a css property with value to the css output
	 *
	 * @access public
	 * @since  1.0
	 *
	 * @param  string $property - the css property
	 * @param  mixed  $value - the value to be placed with the property
	 * @param  mixed  $check_empty - the value to be checked if empty
	 * @return $this
	 */
	public function add_property( $property, $value = null, $check_empty = null ) {
		if ( null === $value ) {
			return $this;
		}
		if ( null !== $check_empty && empty( $value ) ) {
			return $this;
		}
		$value = wp_strip_all_tags( $value );
		if ( in_array( $property, $this->_special_properties_list ) ) {
			$this->add_special_rules( $property, $value );
		} else {
			$this->add_rule( $property, $value );
		}
		return $this;
	}

	/**
	 * Adds multiple properties with their values to the css output
	 *
	 * @access public
	 * @since  1.0
	 *
	 * @param  array $properties - a list of properties and values
	 * @return $this
	 */
	public function add_properties( $properties ) {
		foreach ( (array) $properties as $property => $value ) {
			$this->add_property( $property, $value );
		}
		return $this;
	}

	/**
	 * Sets a media query in the class
	 *
	 * @since  1.1
	 * @param  string $value
	 * @return $this
	 */
	public function start_media_query( $value ) {
		// Add the current rules to the output
		$this->add_selector_rules_to_output();

		// Add any previous media queries to the output
		if ( $this->has_media_query() ) {
			$this->add_media_query_rules_to_output();
		}

		// Set the new media query
		$this->_media_query = $value;
		return $this;
	}
	/**
	 * Sets a media query in the class
	 *
	 * @since  1.1
	 * @param  string $value
	 * @return $this
	 */
	public function set_media_state( $value ) {
		// Set the new media query
		$this->_media_state = $value;
		return $this;
	}
	/**
	 * Get media state
	 *
	 * @return string
	 */
	public function get_media_state() {
		return $this->_media_state;
	}
	/**
	 * Stops using a media query.
	 *
	 * @see    start_media_query()
	 *
	 * @since  1.1
	 * @return $this
	 */
	public function stop_media_query() {
		return $this->start_media_query( null );
	}

	/**
	 * Gets the media query if it exists in the class
	 *
	 * @since  1.1
	 * @return string|int|null
	 */
	public function get_media_query() {
		return $this->_media_query;
	}

	/**
	 * Checks if there is a media query present in the class
	 *
	 * @since  1.1
	 * @return boolean
	 */
	public function has_media_query() {
		if ( ! empty( $this->get_media_query() ) ) {
			return true;
		}

		return false;
	}

	/**
	 * Adds the current media query's rules to the class' output variable
	 *
	 * @since  1.1
	 * @return $this
	 */
	private function add_media_query_rules_to_output() {
		if ( ! empty( $this->_media_query_output ) ) {
			$this->_output .= sprintf( '@media all and %1$s{%2$s}', $this->get_media_query(), $this->_media_query_output );

			// Reset the media query output string.
			$this->_media_query_output = '';
		}

		return $this;
	}

	/**
	 * Adds the current selector rules to the output variable
	 *
	 * @access private
	 * @since  1.0
	 *
	 * @return $this
	 */
	private function add_selector_rules_to_output() {
		if ( ! empty( $this->_css ) ) {
			$this->prepare_selector_output();
			$selector_output = sprintf( '%1$s{%2$s}', $this->_selector_output, $this->_css );

			if ( $this->has_media_query() ) {
				$this->_media_query_output .= $selector_output;
				$this->reset_css();
			} else {
				$this->_output .= $selector_output;
			}

			// Reset the css.
			$this->reset_css();
		}

		return $this;
	}

	/**
	 * Prepares the $_selector_output variable for rendering
	 *
	 * @access private
	 * @since  1.0
	 *
	 * @return $this
	 */
	private function prepare_selector_output() {
		if ( ! empty( $this->_selector_states ) ) {
			// Create a new variable to store all of the states.
			$new_selector = '';

			foreach ( (array) $this->_selector_states as $state ) {
				$format = end( $this->_selector_states ) === $state ? '%1$s%2$s' : '%1$s%2$s,';
				$new_selector .= sprintf( $format, $this->_selector, $state );
			}
			$this->_selector_output = $new_selector;
		} else {
			$this->_selector_output = $this->_selector;
		}
		return $this;
	}

	/**
	 * Get the attribute meta from the block instance.
	 *
	 * @param WP_Block $block_instance The instance of the WP_Block class that represents the block being rendered.
	 * @param string $attribute_name The name of the attribute to get.
	 * @return array
	 */
	public function get_attribute_meta( $block_instance, $attribute_name ) {
		if ( is_object( $block_instance ) && isset( $block_instance->block_type->attributes[ $attribute_name ] ) ) {
			return $block_instance->block_type->attributes[ $attribute_name ];
		}
		return [];
	}

	/**
	 * Get the initial attribute with device slugs.
	 *
	 * @param array/string $initial_attribute The initial attribute.
	 * @return array
	 */
	public function get_initial_with_device_slugs( $initial_attribute ) {
		if ( is_array( $initial_attribute ) ) {
			// replace the device key with the device slugs.
			foreach ( $this->device_slugs as $device_name => $device_slug ) {
				if ( isset( $initial_attribute[ $device_name ] ) ) {
					$initial_attribute[ $device_slug ] = $initial_attribute[ $device_name ];
					unset( $initial_attribute[ $device_name ] );
				}
			}
		}
		return $initial_attribute;
	}
	
	/**
	 * Merge the initial attribute with the attribute value.
	 *
	 * @param array $attributes_meta The meta of the attribute.
	 * @param array $attribute_value The value of the attribute.
	 * @return array
	 */
	public function merge_initial_attribute( $attributes_meta, $attribute_value ) {
		if ( ! empty( $attributes_meta['initial'] ) ) {
			$initial_attribute = $this->get_initial_with_device_slugs( $attributes_meta['initial'] );
			// Merge and make sure $attribute_value has priority.
			return array_merge( $initial_attribute, $attribute_value );
		}
		return $attribute_value;
	}
	/**
	 * Get the global styles ids.
	 *
	 * @param array $attributes The attributes of the block.
	 * @param WP_Block $block_instance The instance of the WP_Block class that represents the block being rendered.
	 * @return array
	 */
	public function get_global_styles_ids( $attributes, $block_instance ) {
		$parent_global_styles_ids = [];
		if ( is_object( $block_instance ) && !empty( $block_instance->context['kbs/parentGlobalStyles'] ) && is_array( $block_instance->context['kbs/parentGlobalStyles'] ) ) {
			$parent_global_styles_ids = $block_instance->context['kbs/parentGlobalStyles'];
		}
		$current_global_styles_ids = [];
		if ( !empty( $attributes['globalStyleIds'] ) && is_array( $attributes['globalStyleIds'] ) ) {
			$current_global_styles_ids = $attributes['globalStyleIds'];
		}
		$global_styles_ids = array_merge( $parent_global_styles_ids, $current_global_styles_ids, [ 'kbs-base' ] );
		return $global_styles_ids;
	}
	/**
	 * Add global style css.
	 *
	 * @param array $global_styles_ids The global styles ids.
	 * @param array $attributes_meta The attributes meta.
	 * @param WP_Block $block_instance The block instance.
	 * @return $this
	 */
	public function add_global_style_css( $global_styles_ids, $attributes_meta, $block_instance ) {
		if( !empty( $global_styles_ids ) && is_array( $global_styles_ids ) ) {
			// Use the global styles ids order, this makes the last one have priority.
			foreach( $global_styles_ids as $global_style_id ) {
				if ( !empty( $this->global_styles[ $global_style_id ] ) ) {
					$this->process_global_style( $this->global_styles[ $global_style_id ], $attributes_meta, $block_instance );
				}
			}
		}
	}
	/**
	 * Gets variable name from category and type (PHP equivalent of JS function).
	 *
	 * @param string $category The style category (e.g., 'color', 'typography').
	 * @param string $type The style type or token name (e.g., 'primary', 'body').
	 * @return string The CSS variable name.
	 */
	public function get_mapping_variable_name( $category, $type ) {
		// First convert camelCase to kebab-case, then clean up
		$category_slug = preg_replace( '/([a-z])([A-Z])/', '$1-$2', (string) $category );
		$category_slug = strtolower( preg_replace( '/[^a-zA-Z0-9-_]/', '-', $category_slug ) );
		$category_slug = trim( $category_slug, '-' );

		$type_slug = preg_replace( '/([a-z])([A-Z])/', '$1-$2', (string) $type );
		$type_slug = strtolower( preg_replace( '/[^a-zA-Z0-9-_]/', '-', $type_slug ) );
		$type_slug = trim( $type_slug, '-' );

		return sprintf( '--kbs-%s-%s', $category_slug, $type_slug );
	}
	/**
	 * Process global style.
	 *
	 * @param array $global_style The global style.
	 * @param array $attributes_meta The attributes meta.
	 * @param WP_Block $block_instance The block instance.
	 * @return $this
	 */
	public function process_global_style( $global_style, $attributes_meta, $block_instance ) {
		if( !empty( $global_style['mappings'] ) && is_array( $global_style['mappings'] ) ) {
			foreach ( $global_style['mappings'] as $category => $tokens ) {
				if ( ! empty( $tokens ) && is_array( $tokens ) ) {
					foreach ( $tokens as $token => $token_data ) {
						if ( isset( $token_data['value'] ) && $token_data['value'] !== '' ) {
							$variable_name = $this->get_mapping_variable_name( $category, $token );
							$this->add_property( $variable_name, $token_data['value'] );
						}
					}
				}
			}
		}
	}
	/**
	 * Add properties to the css output based on the attributes.
	 *
	 * @param string $key The key of the attribute to get.
	 * @param array $attributes an array of attributes.
	 * @param WP_Block $block_instance The instance of the WP_Block class that represents the block being rendered.
	 * @return $this
	 */
	public function add_attributes( $attributes, $block_instance ) {
		$global_styles_ids = $this->get_global_styles_ids( $attributes, $block_instance );
		if ( is_object( $block_instance ) && isset( $block_instance->block_type->attributes ) ) {
			foreach ( $block_instance->block_type->attributes as $key => $attribute ) {
				$attributes_meta = $this->get_attribute_meta( $block_instance, $key );
				// Only process global style ids if there is more then one global style id that way priority is correct otherwise we rely on the class to handle the global styles css.
				// This only relates to the mappings part of the global styles.
				if( 'globalStyleIds' === $key && !empty( $attributes['globalStyleIds'] ) && count( $attributes['globalStyleIds'] ) > 1 ) {
					$this->add_global_style_css( $attributes['globalStyleIds'], $attributes_meta, $block_instance );
					continue;
				}
				if ( empty( $attributes_meta['renderCSS'] ) ) {
					continue;
				}
				if ( ! isset( $attributes_meta['component'] ) && ! isset( $attributes_meta['property'] ) ) {
					continue;
				}
				// If the attribute is a component, add the complex attribute.
				if ( !empty( $attributes_meta['component'] ) ) {
					$this->add_component( $key, $attributes, $attributes_meta, $block_instance, $global_styles_ids );
					continue;
				}
				if ( ! isset( $attributes_meta['property'] ) ) {
					continue;
				}

				$this->add_attribute( $key, $attributes, $attributes_meta, $block_instance, $global_styles_ids );
			}
		}
		return $this;
	}
	/**
	 * Add properties to the css output based on the attributes.
	 *
	 * @param string $key The key of the attribute to get.
	 * @param array $attributes an array of attributes.
	 * @param array $attributes_meta The meta of the attribute.
	 * @param WP_Block $block_instance The instance of the WP_Block class that represents the block being rendered.
	 * @return $this
	 */
	public function add_attribute( $key, $attributes, $attributes_meta = [], $block_instance = null ) {
		if ( empty( $attributes_meta ) ) {
			$attributes_meta = $this->get_attribute_meta( $block_instance, $key );
		}
		if ( ! isset( $attributes_meta['property'] ) ) {
			return $this;
		}
		if ( ! isset( $attributes_meta['selector'] ) ) {
			return $this;
		}
		$merged_attribute = $this->merge_initial_attribute( $attributes_meta, ( isset( $attributes[ $key ] ) ? $attributes[ $key ] : [] ) );
		if ( empty( $merged_attribute ) ) {
			return $this;
		}
		switch ( $attributes_meta['property'] ) {
			case 'flex-direction':
			case 'flex-wrap':
			case 'align-content':
			case 'align-items':
			case 'justify-content':
			case 'row-gap':
			case 'column-gap':
				$this->array_string_property( $attributes_meta['selector'], $merged_attribute );
				break;
		}
		return $this;
	}
	/**
	 * Get the expected keys for the component.
	 *
	 * @param array $attributes_meta The meta of the attribute.
	 * @return array
	 */
	public function get_expected_keys( $attributes_meta ) {
		if ( empty( $attributes_meta['component'] ) ) {
			return [];
		}
		switch ( $attributes_meta['component'] ) {
			case 'typography':
				$expected_keys = ['fontSize', 'fontFamily', 'fontWeight', 'textTransform', 'letterSpacing', 'lineHeight'];
				break;
			case 'flexBox':
				$expected_keys = ['flexDirection', 'flexWrap', 'alignContent', 'alignItems', 'justifyContent', 'rowGap', 'columnGap'];
				break;
			case 'padding':
				$expected_keys = ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft'];		
				break;
			case 'icon':
				$expected_keys = ['iconSize', 'iconLineWidth', 'color', 'iconSizeHover', 'iconLineWidthHover', 'colorHover'];
				break;
			case 'transform':
				$expected_keys = [];		
				break;
			default:
				$expected_keys = [ $attributes_meta['component'] ];		
				break;
		}
		return $expected_keys;
	}
	/**
	 * Get the output value for the attribute.
	 *
	 * @param string $value The value of the attribute.
	 * @param string $attribute_name The name of the attribute.
	 * @return string
	 */
	public function get_output_value( $value, $attribute_name ) {
		if ( empty( $attribute_name ) ) {
			return $value;
		}
		switch ( $attribute_name ) {
			case 'paddingTop':
			case 'paddingRight':
			case 'paddingBottom':
			case 'paddingLeft':
			case 'marginTop':
			case 'marginRight':
			case 'marginBottom':
			case 'marginLeft':
				return $this->get_spacing_size( $value );
			case 'rowGap':
			case 'columnGap':
			case 'column-gap':
			case 'row-gap':
				return $this->get_gap_size( $value );
			case 'color':
			case 'colorHover':
				return $this->sanitize_color( $value );
			case 'iconSize':
			case 'iconSizeHover':
				// Check if it's a variable icon size value
				$icon_size_value = $this->get_variable_icon_size_value( $value );
				if ( $icon_size_value ) {
					return $icon_size_value;
				}
				return $value;
			case 'fontSize':
			case 'font-size':
				// Check if it's a variable font size value
				$font_size_value = $this->get_variable_font_size_value( $value );
				if ( $font_size_value ) {
					return $font_size_value;
				}
				return $value;
			case 'lineHeight':
			case 'line-height':
				// Check if it's a variable line height value
				$line_height_value = $this->get_variable_line_height_value( $value );
				if ( $line_height_value ) {
					return $line_height_value;
				}
				return $value;
			case 'letterSpacing':
			case 'letter-spacing':
				// Check if it's a variable letter spacing value
				$letter_spacing_value = $this->get_variable_letter_spacing_value( $value );
				if ( $letter_spacing_value ) {
					return $letter_spacing_value;
				}
				return $value;
			default:
				return $value;
		}
	}
	/**
	 * Get the attribute selector.
	 *
	 * @param string $attribute_name The name of the attribute.
	 * @param array $attributes_meta The meta of the attribute.
	 * @return string
	 */
	public function get_attribute_selector( $attribute_name, $attributes_meta ) {
		if ( empty( $attribute_name ) ) {
			return '';
		}
		$use_variable_name = ( isset( $attributes_meta['nonInheritable'] ) && $attributes_meta['nonInheritable'] ) ? false : true;
		$selector_prefix = ( isset( $attributes_meta['selector'] ) ) ? $attributes_meta['selector'] : '';
		$component_name = ( isset( $attributes_meta['component'] ) ) ? $attributes_meta['component'] : '';
		$attribute_name = preg_replace('/([a-z])([A-Z])/', '$1-$2', $attribute_name);
		$attribute_name = strtolower($attribute_name);
		if ( $use_variable_name ) {
			return $selector_prefix . $attribute_name;
		}
		$attribute_name = $this->map_attribute_for_component( $attribute_name, $component_name );
		return $attribute_name;
	}
	/**
	 * Map the attribute for the component.
	 *
	 * @param string $attribute_name The name of the attribute.
	 * @param string $component_name The name of the component.
	 * @return string
	 */
	public function map_attribute_for_component( $attribute_name, $component_name ) {
		if ( empty( $component_name ) ) {
			return $attribute_name;
		}
		switch ( $component_name ) {
			case 'background':
				if ( 'color' === $attribute_name ) {
					return 'background-color';
				}
				return $attribute_name;
			default:
				return $attribute_name;
		}
	}
	/**
	 * Add the component array to the css output.
	 *
	 * @param string $key The key of the attribute to get.
	 * @param array $attributes an array of attributes.
	 * @param array $attributes_meta The meta of the attribute.
	 * @param WP_Block $block_instance The instance of the WP_Block class that represents the block being rendered.
	 * @param array $global_styles_ids The global styles ids.
	 * @return $this
	 */
	public function add_component_array( $component_attributes, $attributes_meta, $block_instance, $global_styles_ids ) {
		if ( empty( $component_attributes ) || !is_array( $component_attributes ) ) {
			return $this;
		}
		$processed_keys = [];
		$is_first_iteration = true;
		$expected_keys   = $this->get_expected_keys( $attributes_meta );
		foreach ( $component_attributes as $device_name => $device_attributes ) {
			if( isset( $this->_device_media_queries[ $device_name ] ) && is_array( $this->_device_media_queries[ $device_name ] ) ) {
				if ( !empty( $device_attributes ) && is_array( $device_attributes ) ) {
					foreach ( $device_attributes as $attribute_name => $device_attribute ) {
						if ( ! in_array( $attribute_name, $expected_keys ) ) {
							continue;
						}
						// $processed_keys[$attribute_name] = true;

						$this->set_media_state( $device_name );

						$attribute_selector = $this->get_attribute_selector( $attribute_name, $attributes_meta );
						$device_attribute   = $this->get_output_value( $device_attribute, $attribute_name );
						if ( !empty( $device_attribute ) ) {
							$this->add_property( $attribute_selector, $device_attribute );
						}
					}
				}

				/* TODO: I'm not sure if we need this below, I'm not sure what it's for but I need to come back to it. */

				// // If this is the first device (largest breakpoint), like desktop, handle unprocessed keys
				// if( $is_first_iteration && !empty( $variable_name ) ) {
				// 	$unprocessed_keys = array_diff($expected_keys, array_keys($processed_keys));

				// 	if( !empty( $unprocessed_keys ) ) {
				// 		foreach( $unprocessed_keys as $unprocessed_key ) {
				// 			$this->set_media_state( $device_name );

				// 			$kebab_variable_name = preg_replace('/([a-z])([A-Z])/', '$1-$2', $variable_name);
				// 			$attribute_selector = $this->get_attribute_selector( $unprocessed_key, $attributes_meta );
				// 			$this->add_property( $attribute_selector, 'var( --kbs-' . $attribute_selector . '-' . $kebab_variable_name . ')' );
				// 		}
				// 	}
				// }
			}
			$is_first_iteration = false;
		}

		$this->set_media_state( 'desktop' );

		return $this;
	}

	/**
	 * Add components to the css output based on the attributes.
	 *
	 * @param string $key The key of the attribute to get.
	 * @param array $attributes an array of attributes.
	 * @param array $attributes_meta The meta of the attribute.
	 * @param WP_Block $block_instance The instance of the WP_Block class that represents the block being rendered.
	 * @param array $global_styles_ids The global styles ids.
	 * @return $this
	 */
	public function add_component( $key, $attributes, $attributes_meta = [], $block_instance = null, $global_styles_ids = [] ) {
		$merged_attribute = $this->merge_initial_attribute( $attributes_meta, ( isset( $attributes[ $key ] ) ? $attributes[ $key ] : [] ) );
		if ( empty( $merged_attribute ) || !isset( $attributes[$key] ) ) {
			return $this;
		}
		// Handle layered components (background, shadows)
		if ( isset( $attributes_meta['hasLayers'] ) && $attributes_meta['hasLayers'] ) {
			$this->process_layered_component( $key, $attributes, $attributes_meta, $block_instance, $global_styles_ids );
			return $this;
		}
		// Handle component preset.
		if ( !empty( $merged_attribute['preset'] ) ) {
			$this->process_component_preset( $merged_attribute['preset'], $attributes_meta, $block_instance, $global_styles_ids );
			return $this;
		}

		$this->add_component_array( $merged_attribute, $attributes_meta, $block_instance, $global_styles_ids );			

		return $this;
	}
	/**
	 * Get preset data.
	 *
	 * @param string $preset_key The preset key.
	 * @param array $global_styles_ids Global style IDs.
	 * @return array
	 */
	public function get_preset_data( $preset_key, $component, $global_styles_ids ) {
		// We use the order of the global styles ids to get the first defined preset. If the global ID doesn't have a defined preset we move to the next.
		foreach( $global_styles_ids as $global_style_id ) {
			if(  !empty( $this->global_styles[$global_style_id]['components'][$component]['presets'] ) && is_array( $this->global_styles[$global_style_id]['components'][$component]['presets'] ) ) {
				foreach( $this->global_styles[$global_style_id]['components'][$component]['presets'] as $preset_item_key => $preset_data ) {
					if( $preset_key === $preset_item_key ) {
						return $preset_data;
						break;
					}
				}
			}
		}
	}

	/**
	 * Process preset layers.
	 *
	 * @param string $layers_preset The preset layers.
	 * @param array $attributes_meta The attribute metadata.
	 * @param array $attributes The attributes array.
	 * @param WP_Block $block_instance The block instance.
	 * @param array $global_styles_ids Global style IDs.
	 * @return $this
	 */
	public function process_preset_layers( $layers_preset, $attributes_meta, $attributes, $block_instance, $global_styles_ids ) {
		$preset_data = $this->get_preset_data( $layers_preset, $attributes_meta['component'], $global_styles_ids );
		if ( empty( $preset_data ) ) {
			return;
		}
		$layers = !empty( $preset_data['attributes']['layers'] ) ? $preset_data['attributes']['layers'] : [];
		// Reverse the layers so we process the first layer last.
		$reversed_layers = array_reverse( $layers );
		foreach ( $reversed_layers as $index => $layer ) {
			$this->process_background_layer( $layer, $index, $attributes_meta, $attributes, $block_instance, $global_styles_ids );
		}
	}
	/**
	 * Process component preset.
	 *
	 * @param string $preset_key The preset key.
	 * @param array $attributes_meta The attribute metadata.
	 * @param WP_Block $block_instance The block instance.
	 * @param array $global_styles_ids Global style IDs.
	 * @return $this
	 */
	public function process_component_preset( $preset_key, $attributes_meta, $block_instance, $global_styles_ids ) {
		$preset_data = $this->get_preset_data( $preset_key, $attributes_meta['component'], $global_styles_ids );
		if ( empty( $preset_data ) ) {
			return;
		}
		$this->add_component_array( $preset_data['attributes'], $attributes_meta, $block_instance, $global_styles_ids );

	}
	/**
	 * Get the device value from the layer.
	 *
	 * @param array $layer The layer data.
	 * @param string $attribute_name The attribute name.
	 * @param string $device_name The device name.
	 * @return string
	 */
	public function get_layer_device_value( $layer, $attribute_name, $device_name ) {
		if( empty( $layer ) || !is_array( $layer ) ) {
			return;
		}
		return !empty( $layer[ $device_name ][ $attribute_name ] ) ? $layer[ $device_name ][ $attribute_name ] : '';
	}
	/**
	 * Check if the layer has a value.
	 *
	 * @param array $layer The layer data.
	 * @param string $attribute_name The attribute name.
	 * @return bool
	 */
	public function has_layer_value( $layer, $attribute_name, $default_value = '' ) {
		if( empty( $layer ) || !is_array( $layer ) ) {
			return false;
		}
		foreach ( $this->device_options as $device_option ) {
			if ( isset( $layer[ $device_option['key'] ][ $attribute_name ] ) && '' !== $layer[ $device_option['key'] ][ $attribute_name ] && $default_value !== $layer[ $device_option['key'] ][ $attribute_name ] ) {
				return true;
				break;
			}
		}
		return false;
	}
	/**
	 * Process background layer.
	 *
	 * @param array $layer The layer data.
	 * @param int $index The index of the layer.
	 * @param array $attributes_meta The attribute metadata.
	 * @param array $attributes The attributes array.
	 * @param WP_Block $block_instance The block instance.
	 * @param array $global_styles_ids Global style IDs.
	 * @return $this
	 */
	public function process_background_layer( $layer, $index, $attributes_meta, $attributes, $block_instance, $global_styles_ids ) {
		if( empty( $layer ) || !is_array( $layer ) ) {
			return;
		}
		$current_selector = $this->_selector;
		$temp_selector = $current_selector;
		$meta_class_prefix = isset( $attributes_meta['classPrefix'] ) ? $attributes_meta['classPrefix'] : 'kbs-bg-style-';
		// Background type can't change per device so we just get the desktop value.
		$background_type = $this->get_layer_device_value( $layer, 'type', 'desktop' ) ?: 'color';
		$has_effects = false;
		$has_forced_layer_type = false;
		if ( $index === 0 ) {
			if ( $this->has_layer_value( $layer, 'opacity', '100%' ) || $this->has_layer_value( $layer, 'opacityHover', '100%' ) || $this->has_layer_value( $layer, 'blendMode', 'normal' ) || $this->has_layer_value( $layer, 'blendModeHover', 'normal' ) || apply_filters( 'kbs_always_use_bg_layers', false ) ) {
				$has_effects = true;
			}
			if ( $background_type === 'video' || $background_type === 'mask' ) {
				$has_forced_layer_type = true;
			}
		}

		if ( $index === 0 && !$has_forced_layer_type && ! $has_effects ) {
			$temp_selector = $current_selector;
			$this->set_selector( $current_selector );
		} else {
			$temp_selector = $current_selector . ' > .' . $meta_class_prefix . $index;
			$this->set_selector( $temp_selector );
		}
		// Loop through the layers devices and add the properties to the css output.
		foreach ( $layer as $device_name => $device_attributes ) {
			if( isset( $this->_device_media_queries[ $device_name ] ) && is_array( $this->_device_media_queries[ $device_name ] ) ) {
				if ( !empty( $device_attributes ) && is_array( $device_attributes ) ) {
					$this->set_media_state( $device_name );
					if ( !empty( $device_attributes['opacity'] ) ) {
						$this->add_property( 'opacity', $device_attributes['opacity'] );
					}
					if ( !empty( $device_attributes['blendMode'] ) ) {
						$this->add_property( 'mix-blend-mode', $device_attributes['blendMode'] );
					}
					switch ( $background_type ) {
						case 'color':
							if ( !empty( $device_attributes['color'] ) ) {
								$this->add_property( 'background-color', $this->sanitize_color( $device_attributes['color'] ) );
							}
							break;
						case 'image':
							if ( !empty( $device_attributes['color'] ) ) {
								$this->add_property( 'background-color', $this->sanitize_color( $device_attributes['color'] ) );
							}
							if (!empty( $device_attributes['image'] ) ) {
								$this->add_property( 'background-image', 'url(' . $device_attributes['image'] . ')' );
							}
							if ( !empty( $device_attributes['position'] ) ) {
								$this->add_property( 'background-position', $device_attributes['position'] );
							}
							if ( !empty( $device_attributes['size'] ) ) {
								$this->add_property( 'background-size', $device_attributes['size'] );
							}
							if ( !empty( $device_attributes['repeat'] ) ) {
								$this->add_property( 'background-repeat', $device_attributes['repeat'] );
							}
							if ( !empty( $device_attributes['attachment'] ) ) {
								$this->add_property( 'background-attachment', $device_attributes['attachment'] === 'parallax' ? 'fixed' : $device_attributes['attachment'] );
							}
							break;
						case 'gradient':
							if ( !empty( $device_attributes['color'] ) ) {
								$this->add_property( 'background-color', $this->sanitize_color( $device_attributes['color'] ) );
							}
							if ( !empty( $device_attributes['gradient'] ) ) {
								$this->add_property( 'background-image', $device_attributes['gradient'] );
							}
							break;
						case 'mask':
							$mask_type = $this->get_layer_device_value( $layer, 'maskType', $device_name ) ?: 'mask';
							if ( !empty( $device_attributes['color'] ) ) {
								$this->add_property( 'background-color', $this->sanitize_color( $device_attributes['color'] ) );
								$this->add_property( '--kbs-mask-bg', $this->sanitize_color( $device_attributes['color'] ) );
							}
							if ( !empty( $device_attributes['maskColor'] ) ) {
								$this->add_property( '--kbs-mask-color', $this->sanitize_color( $device_attributes['maskColor'] ) );
							}
							switch ( $mask_type ) {
								case 'pattern':
									$this->add_property( 'mask-image', 'url("data:image/svg+xml, ' . $device_attributes['mask'] . '")' );
									break;
								case 'divider':
									$this->add_property( 'mask-image', 'url("data:image/svg+xml, ' . $device_attributes['mask'] . '")' );
									break;
								default:
									$mask_slug = !empty( $device_attributes['mask'] ) ? $device_attributes['mask'] : '';
									if ( !empty( $mask_slug ) ) {
										$this->set_selector( $current_selector . ' > .' . $meta_class_prefix . $index . ' .kbs-pattern-mask-svg' );
										$mask_inverted = !empty( $device_attributes['maskInverted'] ) ? $device_attributes['maskInverted'] : '';
										$mask_size = !empty( $device_attributes['maskSize'] ) ? $device_attributes['maskSize'] : '';
										$mask_ratio = $mask_size === 'stretch' ? 'none' : 'xMidYMid meet';
										$mask_subset = $mask_inverted === 'enabled' ? 'inverted' : 'normal';
										$mask_data = $this->get_mask_data( $mask_slug, $mask_subset );
										if ( !empty( $mask_data['path'] ) ) {
											if ( !empty( $device_attributes['maskColor'] ) ) {
												$this->add_property( 'background', $this->sanitize_color( $device_attributes['maskColor'] ) );
											} else if ( $device_name === 'desktop' ) {
												$this->add_property( 'background', 'var(--kbs-colors-palette3)' );
											}
											$this->add_property( 'mask-image', 'url("data:image/svg+xml, ' . rawurlencode( '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="'. esc_attr( $mask_ratio ) . '" viewBox="0 0 1920 1200" fill="black"><path d="'. esc_attr( $mask_data['path'] ) . '" /></svg>' ) . '")' );
											$this->add_property( 'mask-repeat', 'no-repeat' );
											if ( $mask_size === 'contain' ) {
												$this->add_property( 'mask-size', 'contain' );
											} else {
												$this->add_property( 'mask-size', 'cover' );
											}
										}
									}
									$position_x = 'center';
									$position_y = 'center';
									if ( !empty( $device_attributes['alignX'] ) ) {
										if ( $device_attributes['alignX'] === 'min' ) {
											$position_x = 'left';
										} else if ( $device_attributes['alignX'] === 'max' ) {
											$position_x = 'right';
										}
									}
									if ( !empty( $device_attributes['alignY'] ) ) {
										if ( $device_attributes['alignY'] === 'min' ) {
											$position_y = 'top';
										} else if ( $device_attributes['alignY'] === 'max' ) {
											$position_y = 'bottom';
										}
									}
									$this->add_property( 'mask-position', $position_x . ' ' . $position_y );
									$flip_x = !empty( $device_attributes['flipX'] ) ? $device_attributes['flipX'] : '';
									$flip_y = !empty( $device_attributes['flipY'] ) ? $device_attributes['flipY'] : '';
									if ( $flip_x === 'enabled' || $flip_y === 'enabled' ) {
										$this->add_property( 'transform', 'scaleX(' . ( $flip_x === 'enabled' ? '-1' : '1' ) . ') scaleY(' . ( $flip_y === 'enabled' ? '-1' : '1' ) . ')' );
									}
									break;
							}
							$this->set_selector( $temp_selector );
							break;

				// if (maskType === 'divider') {
				// 	const backgroundDivider = getLayerDeviceValue('divider', layer, props.previewDevice);
				// 	const dividerWidth = getLayerDeviceValue('dividerWidth', layer, props.previewDevice);
				// 	const dividerHeight = getLayerDeviceValue('dividerHeight', layer, props.previewDevice);
				// 	const dividerPosition = getLayerDeviceValue('dividerPosition', layer, props.previewDevice);
				// 	const dividerSide =
				// 		dividerPosition === 'left' || dividerPosition === 'right' ? 'vertical' : 'horizontal';
				// 	if (dividerWidth) {
				// 		this.add({ '--kbs-divider-width': dividerWidth });
				// 	}
				// 	if (dividerHeight) {
				// 		this.add({ '--kbs-divider-height': dividerHeight });
				// 	}
				// 	if (backgroundDivider) {
				// 		const dividerObject =
				// 			getDividerOptions()[dividerSide].find(({ value }) => value === backgroundDivider) || {};
				// 		if (dividerObject) {
				// 			if (dividerObject?.['svg']) {
				// 				this.setSelector(tempSelector + ' .kbs-divider-svg-wrapper .kbs-divider-svg');
				// 				if (maskColor) {
				// 					this.add({ background: getColorOutput(maskColor) });
				// 				} else {
				// 					this.add({ background: getColorOutput('palette3') });
				// 				}
				// 				this.add({
				// 					'mask-image': `url("data:image/svg+xml, ${encodeURIComponent(dividerObject['svg'])}")`,
				// 				});
				// 				this.add({ 'mask-repeat': 'no-repeat' });
				// 				this.setSelector(tempSelector);
				// 			}
				// 		}
				// 	}
				// }
				// if (maskType === 'pattern') {
				// 	const backgroundPattern = getLayerDeviceValue('pattern', layer, props.previewDevice);
				// 	if (backgroundPattern) {
				// 		const patternSize = getLayerDeviceValue('patternSize', layer, props.previewDevice);
				// 		const patternPosition =
				// 			getLayerDeviceValue('patternPosition', layer, props.previewDevice) || 'top left';
				// 		if (patternSize) {
				// 			this.add({ '--kbs-pattern-size': patternSize });
				// 		} else {
				// 			this.add({ '--kbs-pattern-size': '20' });
				// 		}
				// 		const pattern = getPatternOptions().find((pattern) => pattern.value === backgroundPattern);
				// 		if (pattern) {
				// 			if (pattern?.['svg']) {
				// 				this.setSelector(tempSelector + ' .kbs-pattern-svg');
				// 				if (maskColor) {
				// 					this.add({ background: getColorOutput(maskColor) });
				// 				} else {
				// 					this.add({ background: getColorOutput('palette3') });
				// 				}
				// 				this.add({
				// 					'mask-image': `url("data:image/svg+xml, ${encodeURIComponent(pattern['svg'])}")`,
				// 				});
				// 				this.add({ 'mask-repeat': 'repeat' });
				// 				const currentPatternSize = pattern?.['size'];
				// 				this.add({
				// 					'mask-size':
				// 						'calc( (1px * ' + currentPatternSize + ') * (var(--kbs-pattern-size) / 20))',
				// 				});
				// 				this.add({ 'mask-position': patternPosition });
				// 				this.setSelector(tempSelector);
				// 			}
				// 		}
				// 	}
				// }
							break;	
						/* TODO: I need to add all the other background types here. */
					}
					// Handle hover states
					if ( $index === 0 && !$has_forced_layer_type && ! $has_effects ) {
						$this->set_selector( $current_selector . ':hover' );
					} else {
						$this->set_selector( $current_selector . ':hover > .' . $meta_class_prefix . $index );
					}
					
					if ( !empty( $device_attributes['opacityHover'] ) ) {
						$this->add_property( 'opacity', $device_attributes['opacityHover'] );
					}
					if ( !empty( $device_attributes['blendModeHover'] ) ) {
						$this->add_property( 'mix-blend-mode', $device_attributes['blendModeHover'] );
					}
					
					// Process hover states based on type
					switch ( $background_type ) {
						case 'color':
						case 'image':
						case 'video':
						case 'gradient':
							if ( !empty( $device_attributes['colorHover'] ) ) {
								$this->add_property( 'background-color', $this->sanitize_color( $device_attributes['colorHover'] ) );
							}
							break;
							
						case 'backdrop':
							if ( !empty( $device_attributes['backdropFilterHover'] ) ) {
								if ( $device_attributes['backdropFilterHover'] === 'none' ) {
									$this->add_property( 'backdrop-filter', 'none' );
								} else {
									$hover_unit = $device_attributes['backdropFilterHover'] === 'blur' ? 'px' : ( $device_attributes['backdropFilterHover'] === 'hue-rotate' ? 'deg' : '%' );
									$backdrop_size = $this->get_layer_device_value( 'backdropSize', $layer, $device_name ) ?: '1';
									$hover_backdrop_size = $this->get_layer_device_value( 'backdropSizeHover', $layer, $device_name );
									if ( ! $hover_backdrop_size && $hover_backdrop_size !== 0 ) {
										$hover_backdrop_size = $backdrop_size;
									}								
									$this->add_property( 'backdrop-filter', $device_attributes['backdropFilterHover'] . '(' . $hover_backdrop_size . $hover_unit . ')' );
								}
							}
							break;
					}
					
				}
			}
		}
		// Reset the selector to the original selector.
		$this->set_selector( $current_selector );
		// Reset the media state to desktop.
		$this->set_media_state( 'desktop' );
		return $this;
	}

	/**
	 * Process layered component (backgrounds, shadows).
	 *
	 * @param string $attribute_name The attribute name.
	 * @param array $attributes The attributes array.
	 * @param array $attributes_meta The attribute metadata.
	 * @param WP_Block $block_instance The block instance.
	 * @param array $global_styles_ids Global style IDs.
	 * @return $this
	 */
	protected function process_layered_component( $attribute_name, $attributes, $attributes_meta = [], $block_instance = null, $global_styles_ids = [] ) {
		$layers_preset = !empty( $attributes[ $attribute_name ]['preset'] ) ? $attributes[ $attribute_name ]['preset'] : '';
		
		if ( !empty( $layers_preset ) ) {
			$this->process_preset_layers( $layers_preset, $attributes_meta, $attributes, $block_instance, $global_styles_ids );
			return $this;
		}
		
		// Get layers
		$layers_data = !empty( $attributes[ $attribute_name ]['layers'] ) ? $attributes[ $attribute_name ]['layers'] : [];
		if ( $attributes_meta['component'] === 'background' ) {
			// Process background layers in reverse order
			$reversed_layers = array_reverse( $layers_data );
			foreach ( $reversed_layers as $index => $layer ) {
				$this->process_background_layer( $layer, $index, $attributes_meta, $attributes, $block_instance, $global_styles_ids );
			}
		}
		
		// Handle globally filtered attributes
		if ( 'transform' === $attributes_meta['component'] ) {
			// Check if this is a hover transform
			$is_hover = substr( $key, -5 ) === 'Hover';
			if ( $is_hover ) {
				$this->add_selector_state( ':hover' );
			}
			
			$this->add_transform_styles( $attributes[$key], $attributes_meta, $attributes, $is_hover );
			
			// Reset selector state if it was hover
			if ( $is_hover ) {
				$this->reset_selector_states();
			}
			
			return $this;
		}
		
		$this->add_component_array( $attributes[$key], $attributes_meta );			


		return $this;
	}


	/**
	 * Get inherited transform property value from parent devices.
	 *
	 * @param array  $transform_data The complete transform data.
	 * @param string $property The transform property to get (translate, scale, rotate, skew, origin).
	 * @param int    $device_index The current device index.
	 * @return mixed The inherited value or null.
	 */
	private function get_inherited_transform_property( $transform_data, $property, $device_index ) {
		// Check current and parent devices for the property
		for ( $i = $device_index; $i >= 0; $i-- ) {
			$device_key = $this->device_options[ $i ]['key'];
			
			if ( isset( $transform_data[ $device_key ][ $property ] ) && $transform_data[ $device_key ][ $property ] !== '' ) {
				return $transform_data[ $device_key ][ $property ];
			}
		}
		
		return null;
	}

	/**
	 * Get transform property value with hover/base fallback logic.
	 *
	 * @param array  $transform_data The transform data (hover or base).
	 * @param array  $base_transform_data The base transform data (for hover fallback).
	 * @param string $property The transform property to get.
	 * @param int    $device_index The current device index.
	 * @param bool   $is_hover Whether this is for hover state.
	 * @return mixed The property value or null.
	 */
	private function get_transform_property_value( $transform_data, $base_transform_data, $property, $device_index, $is_hover ) {
		if ( $is_hover ) {
			// For hover, first check hover value, then fall back to base
			$hover_value = $this->get_inherited_transform_property( $transform_data, $property, $device_index );
			if ( $hover_value !== null ) {
				return $hover_value;
			}
			// Fall back to base value
			return $this->get_inherited_transform_property( $base_transform_data, $property, $device_index );
		} else {
			// For non-hover, just get the inherited value
			return $this->get_inherited_transform_property( $transform_data, $property, $device_index );
		}
	}

	/**
	 * Add transform styles to the css output.
	 *
	 * @param array $transform_data The transform attribute data.
	 * @param array $attributes_meta The meta of the attribute.
	 * @param array $all_attributes All attributes (used for hover to get base values).
	 * @param bool $is_hover Whether this is a hover transform.
	 * @return $this
	 */
	public function add_transform_styles( $transform_data, $attributes_meta, $all_attributes = null, $is_hover = false ) {
		if ( empty( $transform_data ) || ! is_array( $transform_data ) ) {
			return $this;
		}

		// Get base transform data if this is hover
		$base_transform_data = array();
		if ( $is_hover && $all_attributes ) {
			// Find the hover key to determine the base key
			$hover_keys = array_filter( array_keys( $all_attributes ), function( $k ) {
				return substr( $k, -5 ) === 'Hover' && strpos( $k, 'transform' ) === 0;
			} );
			
			if ( ! empty( $hover_keys ) ) {
				$hover_key = reset( $hover_keys );
				$base_key = str_replace( 'Hover', '', $hover_key );
				$base_transform_data = isset( $all_attributes[ $base_key ] ) ? $all_attributes[ $base_key ] : array();
			}
		}

		// Process each device
		foreach ( $this->device_options as $device_index => $device_option ) {
			$device_key = $device_option['key'];
			
			// For hover, check if this device or any parent device has hover transforms
			if ( $is_hover ) {
				$has_hover_for_device = false;
				
				// Check from current device up to desktop for hover transforms
				for ( $i = $device_index; $i >= 0; $i-- ) {
					$check_device_key = $this->device_options[ $i ]['key'];
					if ( isset( $transform_data[ $check_device_key ] ) && is_array( $transform_data[ $check_device_key ] ) ) {
						foreach ( array( 'translate', 'scale', 'rotate', 'skew', 'origin' ) as $prop ) {
							if ( isset( $transform_data[ $check_device_key ][ $prop ] ) && ! empty( $transform_data[ $check_device_key ][ $prop ] ) ) {
								$has_hover_for_device = true;
								break 2;
							}
						}
					}
				}
				
				// Skip this device if no hover transforms are defined for it or its parents
				if ( ! $has_hover_for_device ) {
					continue;
				}
			}
			
			if ( 'desktop' !== $device_key ) {
				$this->set_media_state( $device_key );
			}
			
			// Build transform string
			$transform_parts = array();
			
			// Get values for each property
			$translate = $this->get_transform_property_value( $transform_data, $base_transform_data, 'translate', $device_index, $is_hover );
			$scale = $this->get_transform_property_value( $transform_data, $base_transform_data, 'scale', $device_index, $is_hover );
			$rotate = $this->get_transform_property_value( $transform_data, $base_transform_data, 'rotate', $device_index, $is_hover );
			$skew = $this->get_transform_property_value( $transform_data, $base_transform_data, 'skew', $device_index, $is_hover );
			$origin = $this->get_transform_property_value( $transform_data, $base_transform_data, 'origin', $device_index, $is_hover );
			
			// Add translate
			if ( $translate && is_array( $translate ) && ( !empty( $translate['x'] ) || !empty( $translate['y'] ) ) ) {
				$x = !empty( $translate['x'] ) ? $translate['x'] : '0px';
				$y = !empty( $translate['y'] ) ? $translate['y'] : '0px';
				
				if ( ( $x !== '0px' && $x !== '0' && $x !== '' ) || ( $y !== '0px' && $y !== '0' && $y !== '' ) ) {
					$transform_parts[] = sprintf( 'translate(%s, %s)', $x, $y );
				}
			}
			
			// Add scale
			if ( $scale && is_array( $scale ) ) {
				$x = isset( $scale['x'] ) ? $scale['x'] : '100%';
				$y = isset( $scale['y'] ) ? $scale['y'] : '100%';
				
				// Convert percentage to decimal
				$scale_x = is_string( $x ) && strpos( $x, '%' ) !== false ? floatval( $x ) / 100 : floatval( $x );
				$scale_y = is_string( $y ) && strpos( $y, '%' ) !== false ? floatval( $y ) / 100 : floatval( $y );
				
				if ( $scale_x != 1 || $scale_y != 1 ) {
					$transform_parts[] = sprintf( 'scale(%s, %s)', $scale_x, $scale_y );
				}
			}
			
			// Add rotate
			if ( $rotate && is_array( $rotate ) ) {
				if ( isset( $rotate['x'] ) && $rotate['x'] !== '0deg' && $rotate['x'] !== '0' && $rotate['x'] !== '' ) {
					$transform_parts[] = sprintf( 'rotateX(%s)', $rotate['x'] );
				}
				if ( isset( $rotate['y'] ) && $rotate['y'] !== '0deg' && $rotate['y'] !== '0' && $rotate['y'] !== '' ) {
					$transform_parts[] = sprintf( 'rotateY(%s)', $rotate['y'] );
				}
				if ( isset( $rotate['z'] ) && $rotate['z'] !== '0deg' && $rotate['z'] !== '0' && $rotate['z'] !== '' ) {
					$transform_parts[] = sprintf( 'rotateZ(%s)', $rotate['z'] );
				}
			}
			
			// Add skew
			if ( $skew && is_array( $skew ) ) {
				$x = isset( $skew['x'] ) ? $skew['x'] : '0deg';
				$y = isset( $skew['y'] ) ? $skew['y'] : '0deg';
				
				if ( ( $x !== '0deg' && $x !== '0' && $x !== '' ) || ( $y !== '0deg' && $y !== '0' && $y !== '' ) ) {
					$transform_parts[] = sprintf( 'skew(%s, %s)', $x, $y );
				}
			}
			
			// Apply transform if we have any transforms
			if ( ! empty( $transform_parts ) ) {
				$this->add_property( 'transform', implode( ' ', $transform_parts ) );
			}
			
			// Apply transform-origin
			if ( $origin && is_array( $origin ) ) {
				$x = isset( $origin['x'] ) ? $origin['x'] : '50%';
				$y = isset( $origin['y'] ) ? $origin['y'] : '50%';
				
				if ( $x !== '50%' || $y !== '50%' ) {
					$this->add_property( 'transform-origin', sprintf( '%s %s', $x, $y ) );
				}
			}
		}
		
		$this->set_media_state( 'desktop' );
		return $this;
	}

	/**
	 * Add a string property to the css output.
	 *
	 * @param string $selector the selector to add the property to.
	 * @param string $value the value of the property.
	 * @return $this
	 */
	public function array_string_property( $selector, $value_array ) {
		if ( ! is_array( $value_array ) ) {
			return $this;
		}
		foreach ( $this->device_options as $device_option ) {
			if ( empty( $value_array[ $device_option['key'] ] ) ) {
				continue;
			}
			if ( 'desktop' !== $device_option['key'] ) {
				$this->set_media_state( $device_option['key'] );
			}
			$this->add_property( $selector, $this->get_variable_spacing_value( $value_array[ $device_option['key'] ] ) );
		}
		$this->set_media_state( 'desktop' );
		return $this;
	}
	/**
	 * Generates the color output.
	 *
	 * @param string $color any color attribute.
	 * @return string
	 */
	public function sanitize_color( $color ) {
		if ( empty( $color ) ) {
			return '';
		}
		if ( ! is_array( $color ) && strpos( $color, 'palette' ) === 0 ) {
			switch ( $color ) {
				case 'palette2':
					$fallback = '#2B6CB0';
					break;
				case 'palette3':
					$fallback = '#1A202C';
					break;
				case 'palette4':
					$fallback = '#2D3748';
					break;
				case 'palette5':
					$fallback = '#4A5568';
					break;
				case 'palette6':
					$fallback = '#718096';
					break;
				case 'palette7':
					$fallback = '#EDF2F7';
					break;
				case 'palette8':
					$fallback = '#F7FAFC';
					break;
				case 'palette9':
					$fallback = '#ffffff';
					break;
				case 'palette-success':
					$fallback = '#13612e';
					break;
				case 'palette-info':
					$fallback = '#1159af';
					break;
				case 'palette-alert':
					$fallback = '#b82105';
					break;
				case 'palette-warning':
					$fallback = '#f7630c';
					break;
				case 'palette-rating':
					$fallback = '#F5A524';
					break;
				default:
					$fallback = '#3182CE';
					break;
			}
			$color = 'var(--kbs-colors-' . $color . ', ' . $fallback . ')';
		}
		return $color;
	}


	/**
	 * Add google font to array.
	 *
	 * @param string $font_name the font name.
	 * @param string $variant the font variant.
	 * @param string $subset the font subset.
	 */
	public function maybe_add_google_font( $font_name, $font_variant = null, $subset = null ) {
		// Prevent empty array in google fonts.
		if ( empty( $font_name ) ) {
			return;
		}
		// Check if the font has been added yet.
		if ( ! array_key_exists( $font_name, self::$google_fonts ) ) {
			$add_font = array(
				'fontfamily'   => $font_name,
				'fontvariants' => ( isset( $font_variant ) && ! empty( $font_variant ) ? array( $font_variant ) : array() ),
				'fontsubsets'  => ( isset( $subset ) && ! empty( $subset ) ? array( $subset ) : array() ),
			);
			self::$google_fonts[ $font_name ] = $add_font;
		} else {
			if ( ! in_array( $font_variant, self::$google_fonts[ $font_name ]['fontvariants'], true ) ) {
				array_push( self::$google_fonts[ $font_name ]['fontvariants'], $font_variant );
			}
		}
	}

	/**
	 * Resets the css variable
	 *
	 * @access private
	 * @since  1.1
	 *
	 * @return void
	 */
	private function reset_css() {
		$this->_css = '';
		return;
	}
	/**
	 * Resets the css variable
	 *
	 * @access private
	 * @since  1.1
	 *
	 * @return void
	 */
	public function render_media_queries() {
		// Handle all device media queries
		foreach ( $this->device_options as $device_option ) {
			$device_key = isset( $device_option['key'] ) ? $device_option['key'] : '';
			
			// Skip desktop as it's handled as default CSS
			if ( $device_key && $device_key !== 'desktop' && isset( $this->_device_media_queries[ $device_key ] ) ) {
				$device_queries = $this->_device_media_queries[ $device_key ];
				
				if ( is_array( $device_queries ) && ! empty( $device_queries ) ) {
					$media_query = $this->get_media_queries( $device_key );
					
					if ( $media_query ) {
						foreach ( $device_queries as $selector => $string ) {
							$this->start_media_query( $media_query );
							$this->set_selector( $selector );
							$this->_css .= $string;
							$this->stop_media_query();
						}
					}
				}
			}
		}
		
		// Handle desktop specific media query
		if ( isset( $this->_device_media_queries['desktop'] ) && is_array( $this->_device_media_queries['desktop'] ) && ! empty( $this->_device_media_queries['desktop'] ) ) {
			$desktop_media_query = $this->get_media_queries( 'desktop' );
			if ( $desktop_media_query ) {
				$this->start_media_query( $desktop_media_query );
				foreach ( $this->_device_media_queries['desktop'] as $selector => $string ) {
					$this->set_selector( $selector );
					$this->_css .= $string;
				}
				$this->stop_media_query();
			}
		}
	}

	/**
	 * Returns the google fonts array from the compiled css.
	 *
	 * @access public
	 * @since  1.0
	 *
	 * @return string
	 */
	public function fonts_output() {
		return self::$google_fonts;
	}
	/**
	 * Clears everything.
	 *
	 * @access public
	 * @since  1.0
	 *
	 * @return string
	 */
	public function clear() {
		$this->_selector = '';
		self::$google_fonts = array();
		$this->_selector_output = '';
		$this->_selector_states = array();
		
		// Clear all device media queries
		foreach ( $this->_device_media_queries as $device => $queries ) {
			$this->_device_media_queries[ $device ] = array();
		}
		
		$this->_media_state = 'desktop';
		$this->_css = '';
		$this->_css_string = '';
		$this->_output = '';
		$this->_media_query = null;
		$this->_media_query_output = '';
		$this->media_queries = null;
	}

	/**
	 * Returns the minified css in the $_output variable
	 *
	 * @access public
	 * @since  1.0
	 *
	 * @return string
	 */
	public function css_output() {
		if ( apply_filters( 'kadence_blocks_css_output_media_queries', true ) ) {
			$this->render_media_queries();
		}
		// Add current selector's rules to output
		$this->add_selector_rules_to_output();
		// Output minified css.
		self::$styles[ $this->_style_id ] = $this->_output;
		if ( ! empty( $this->_css_string ) ) {
			if ( ! isset( self::$custom_styles[ $this->_style_id ] ) ) {
				self::$custom_styles[ $this->_style_id ] = '';
			}
			self::$custom_styles[ $this->_style_id ] = $this->_css_string;
		}
		$this->clear();
		return self::$styles[ $this->_style_id ] . ( isset( self::$custom_styles[ $this->_style_id ] ) ? self::$custom_styles[ $this->_style_id ] : '' );
	}
	/**
	 * Generates the gap output.
	 *
	 * @param string  $size a string or number with the gap size.
	 * @param string $unit a string with the unit type.
	 * @return string
	 */
	public function get_gap_size( $size, $unit = '' ) {
		if ( $this->is_variable_gap_value( $size ) ) {
			return $this->get_variable_gap_value( $size );
		}
		return $size . $unit;
	}
	/**
	 * Generates the spacing output.
	 *
	 * @param string  $size a string or number with the spacing size.
	 * @return string
	 */
	public function get_spacing_size( $size ) {
		if ( $this->is_variable_spacing_value( $size ) ) {
			return $this->get_variable_spacing_value( $size );
		}
		return $size . 'px';
	}
	/**
	 * @param $value
	 *
	 * @return bool
	 */
	public function is_variable_gap_value( $value ) {
		return isset( $this->gap_sizes[ $value ] );
	}
	/**
	 * @param $value
	 *
	 * @return bool|string
	 */
	public function get_variable_gap_value( $value ) {
		if ( $this->is_variable_gap_value( $value ) ) {
			return $this->gap_sizes[ $value ];
		}

		return false;
	}
	/**
	 * @param $value
	 *
	 * @return bool
	 */
	public function is_variable_font_size_value( $value ) {
		return is_string( $value ) && isset( $this->font_sizes[ $value ] );
	}
	/**
	 * @param $value
	 *
	 * @return bool|string
	 */
	public function get_variable_font_size_value( $value ) {
		if ( $this->is_variable_font_size_value( $value ) ) {
			return $this->font_sizes[ $value ];
		}

		return false;
	}
	/**
	 * @param $value
	 *
	 * @return bool
	 */
	public function is_variable_line_height_value( $value ) {
		return is_string( $value ) && isset( $this->line_heights[ $value ] );
	}
	/**
	 * @param $value
	 *
	 * @return bool|string
	 */
	public function get_variable_line_height_value( $value ) {
		if ( $this->is_variable_line_height_value( $value ) ) {
			return $this->line_heights[ $value ];
		}

		return false;
	}
	/**
	 * @param $value
	 *
	 * @return bool
	 */
	public function is_variable_letter_spacing_value( $value ) {
		return is_string( $value ) && isset( $this->letter_spacings[ $value ] );
	}
	/**
	 * @param $value
	 *
	 * @return bool|string
	 */
	public function get_variable_letter_spacing_value( $value ) {
		if ( $this->is_variable_letter_spacing_value( $value ) ) {
			return $this->letter_spacings[ $value ];
		}

		return false;
	}
	/**
	 * @param $value
	 *
	 * @return bool
	 */
	public function is_variable_icon_size_value( $value ) {
		return is_string( $value ) && isset( $this->icon_sizes[ $value ] );
	}
	/**
	 * @param $value
	 *
	 * @return bool|string
	 */
	public function get_variable_icon_size_value( $value ) {
		if ( $this->is_variable_icon_size_value( $value ) ) {
			return $this->icon_sizes[ $value ];
		}

		return false;
	}
	/**
	 * @param $value
	 *
	 * @return bool
	 */
	public function is_variable_spacing_value( $value ) {
		return is_string( $value ) && isset( $this->spacing_sizes[ $value ] );
	}

	/**
	 * @param $value
	 *
	 * @return int|string
	 */
	public function get_variable_spacing_value( $value ) {
		if( $this->is_variable_spacing_value( $value) ) {
			return $this->spacing_sizes[$value];
		}

		return $value;
	}

	/**
	 * @param array $sizes
	 *
	 * @return void
	 */
	public function set_spacing_sizes( $sizes ) {
		$this->spacing_sizes = $sizes;
	}
	/**
	 * Encodes the string.
	 *
	 * @param string $str
	 * @return string
	 */
	public function encode_uri_component($str) {
		$revert = array('%21'=>'!', '%2A'=>'*', '%27'=>"'", '%28'=>'(', '%29'=>')');
		return strtr(rawurlencode($str), $revert);
	}

	/**
	 * Returns the mask data.
	 *
	 * @param string $mask_slug
	 * @param string $mask_subset
	 * @return array
	 */
	public function get_mask_data( $mask_slug, $mask_subset ) {

		$masks = [
			'normal' => [
				'kbs-mask-panels-1' => [
					'label' => __('Panels 1', 'kadence-blocks'),
					'value' => 'kbs-mask-panels-1',
					'path' => 'M1661.42,0l-1661.42,0l0,1200l461.418,0l1200,-1200Zm258.582,337.987l-862.013,862.013l-172.305,0l1034.32,-1034.32l0,172.305Zm0,600.056l-261.957,261.957l-175.792,0l437.749,-437.749l0,175.792Z',
				],
				'kbs-mask-panels-2' => [
					'label' => __('Panels 2', 'kadence-blocks'),
					'value' => 'kbs-mask-panels-2',
					'path' => 'M1920,68.988l0,-68.988l-1920,0l0,1200l788.988,0l1131.01,-1131.01Zm0,869.055l-261.957,261.957l-152.737,0l414.694,-414.694l0,152.737Zm0,-435.58l-697.537,697.537l-150.632,0l848.169,-848.169l0,150.632Z',
				],
				'kbs-mask-panels-3' => [
					'label' => __('Panels 3', 'kadence-blocks'),
					'value' => 'kbs-mask-panels-3',
					'path' => 'M1072.83,0l-1072.83,0l0,1200l751.286,0l321.539,-1200Zm314.653,1200l-111.811,0l321.539,-1200l111.811,0l-321.539,1200Zm-318.866,0l-110.27,0l321.539,-1200l110.27,0l-321.539,1200Zm847.461,-1200l-321.539,1200l325.466,0l0,-1200l-3.927,0Z',
				],
				'kbs-mask-panels-4' => [
					'label' => __('Panels 4', 'kadence-blocks'),
					'value' => 'kbs-mask-panels-4',
					'path' => 'M1122.29,0l-1122.29,0l0,1200l800.754,0l321.539,-1200Zm-218.921,1200l-50.855,0l321.539,-1200l50.855,0l-321.539,1200Zm196.562,0l-93.034,0l321.539,-1200l93.034,0l-321.539,1200Zm412.398,0l-205.343,0l321.539,-1200l205.343,0l-321.539,1200Z',
				],
				'kbs-mask-shape-1' => [
					'label' => __('Shape 1', 'kadence-blocks'),
					'value' => 'kbs-mask-shape-1',
					'path' => 'M872.129,0l-872.129,0l0,1200l1920,0l0,-198.91l-275.551,116.977c-139.204,59.096 -300.198,-5.942 -359.293,-145.146l-413.027,-972.921Z',
				],
				'kbs-mask-shape-2' => [
					'label' => __('Shape 2', 'kadence-blocks'),
					'value' => 'kbs-mask-shape-2',
					'path' => 'M1438.9,0l-1438.9,0l0,1200l900.699,0l-137.148,-137.148c-106.935,-106.934 -106.935,-280.569 -0,-387.503l675.349,-675.349Z',
				],
			],
			'inverted' => [
				'kbs-mask-panels-1' => [
					'label' => __('Panels 1', 'kadence-blocks'),
					'value' => 'kbs-mask-panels-1',
					'path' => 'M1920,165.684l0,-165.684l-258.582,0l-1200,1200l424.266,0l1034.32,-1034.32Zm0,172.305l0,424.264l-437.747,437.747l-424.264,0l862.011,-862.011Zm0,862.011l-261.955,0l261.955,-261.955l0,261.955Z',
				],
				'kbs-mask-panels-2' => [
					'label' => __('Panels 2', 'kadence-blocks'),
					'value' => 'kbs-mask-panels-2',
					'path' => 'M1920,0l0,1200l-261.957,0l261.957,-261.957l0,-152.737l-414.694,414.694l-282.843,0l697.537,-697.537l0,-150.632l-848.169,848.169l-282.843,0l1131.01,-1131.01l0,-68.988Z',
				],
				'kbs-mask-panels-3' => [
					'label' => __('Panels 3', 'kadence-blocks'),
					'value' => 'kbs-mask-panels-3',
					'path' => 'M1594.54,1200l-207.056,0l321.539,-1200l207.056,0l-321.539,1200Zm-318.867,0l-207.055,0l321.539,-1200l207.055,0l-321.539,1200Zm-317.325,0l321.539,-1200l-207.061,0l-321.539,1200l207.061,0Z',
				],
				'kbs-mask-panels-4' => [
					'label' => __('Panels 4', 'kadence-blocks'),
					'value' => 'kbs-mask-panels-4',
					'path' => 'M1920,0l0,1200l-407.671,0l321.539,-1200l86.132,0Zm-613.014,1200l-207.055,0l321.539,-1200l207.055,0l-321.539,1200Zm-300.089,0l-103.528,0l321.539,-1200l103.528,0l-321.539,1200Zm-154.383,0l321.539,-1200l-51.76,0l-321.539,1200l51.76,0Z',
				],
				'kbs-mask-shape-1' => [
					'label' => __('Shape 1', 'kadence-blocks'),
					'value' => 'kbs-mask-shape-1',
					'path' => 'M872.129,0l413.027,972.921c59.095,139.204 220.089,204.242 359.293,145.146l275.551,-116.977l0,198.91l0,-1200l-1047.87,0Z',
				],
				'kbs-mask-shape-2' => [
					'label' => __('Shape 2', 'kadence-blocks'),
					'value' => 'kbs-mask-shape-2',
					'path' => 'M1438.9,0l-675.349,675.349c-106.935,106.934 -106.935,280.569 -0,387.503l137.148,137.148l1019.3,0l0,-1200l-481.1,0Z',
				],
			],
		];
		return isset( $masks[$mask_subset][$mask_slug] ) ? $masks[$mask_subset][$mask_slug] : [];
	}

}
