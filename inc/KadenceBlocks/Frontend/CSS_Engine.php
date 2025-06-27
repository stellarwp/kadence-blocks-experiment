<?php
/**
 * Creates minified css via PHP.
 */

namespace KadenceWP\KadenceBlocks\Frontend;

use KadenceWP\KadenceBlocks\Container;
use KadenceWP\KadenceBlocks\Frontend\Global_Style_Css;
use KadenceWP\KadenceBlocks\Blocks\Editor_Assets;

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
	 * The singleton instance
	 */
	private static $instance = null;


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
		'sm' => 'var(--global-kb-font-size-sm, 0.9rem)',
		'md' => 'var(--global-kb-font-size-md, 1.25rem)',
		'lg' => 'var(--global-kb-font-size-lg, 2rem)',
		'xl' => 'var(--global-kb-font-size-xl, 3rem)',
		'xxl' => 'var(--global-kb-font-size-xxl, 4rem)',
		'3xl' => 'var(--global-kb-font-size-xxxl, 5rem)',
	);
	/**
	 * Icon size variables used in string based icon sizes.
	 */
	protected $icon_sizes = array(
		'xs' => 'var(--kbs-iconsize-xs, 1rem)',
		'sm' => 'var(--kbs-iconsize-sm, 2rem)',
		'md' => 'var(--kbs-iconsize-md, 3rem)',
		'lg' => 'var(--kbs-iconsize-lg, 4rem)',
		'xl' => 'var(--kbs-iconsize-xl, 5rem)',
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
	 * constructor
	 */
	public function __construct() {
		add_action( 'wp_enqueue_scripts', [ $this, 'frontend_block_css' ], 180 );

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

		$this->global_styles_css = new Global_Style_Css( $this, $this->device_options );
		
		// Generate global styles CSS when the CSS engine is initialized
		$this->global_styles_css->generate_css();
		
	}

	/**
	 * Render block CSS helper function
	 */
	public function frontend_block_css() {
		if ( ! empty( self::$styles ) ) {
			self::$head_styles = self::$styles;
			$output = '';
			foreach ( self::$styles as $key => $value ) {
				if ( strpos( $key, 'global-styles' ) !== false ) {
					// Global styles go in head_styles but not regular output
					continue;
				}
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
					if ( ! isset( $this->_device_media_queries[ $this->_media_state ][ $this->_selector ] ) ) {
						$this->_device_media_queries[ $this->_media_state ][ $this->_selector ] = '';
					}
					$this->_device_media_queries[ $this->_media_state ][ $this->_selector ] .= sprintf( $format, $property, $value, $prefix );
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
	 * Add properties to the css output based on the attributes.
	 *
	 * @param string $key The key of the attribute to get.
	 * @param array $attributes an array of attributes.
	 * @param WP_Block $block_instance The instance of the WP_Block class that represents the block being rendered.
	 * @return $this
	 */
	public function add_attributes( $attributes, $block_instance ) {
		if ( is_object( $block_instance ) && isset( $block_instance->block_type->attributes ) ) {
			foreach ( $block_instance->block_type->attributes as $key => $attribute ) {
				$attributes_meta = $this->get_attribute_meta( $block_instance, $key );

				if ( empty( $attributes_meta['renderCSS'] ) ) {
					continue;
				}
				if ( ! isset( $attributes_meta['selector'] ) ) {
					continue;
				}
				// If the attribute is a component, add the complex attribute.
				if ( !empty( $attributes_meta['component'] ) ) {
					$this->add_component( $key, $attributes, $attributes_meta, $block_instance );
					continue;
				}
				if ( ! isset( $attributes_meta['property'] ) ) {
					continue;
				}

				$this->add_attribute( $key, $attributes, $attributes_meta, $block_instance );
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
			case 'background':
				$expected_keys = ['color'];		
				break;
			case 'icon':
				$expected_keys = ['iconSize', 'iconLineWidth', 'color', 'iconSizeHover', 'iconLineWidthHover', 'colorHover'];
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
	public function add_component_array( $attributes, $attributes_meta, $variable_name = '' ) {
		$processed_keys = [];
		$is_first_iteration = true;
		$expected_keys   = $this->get_expected_keys( $attributes_meta );

		foreach ( $attributes as $device_name => $device_attributes ) {
			if( isset( $this->_device_media_queries[ $device_name ] ) && is_array( $this->_device_media_queries[ $device_name ] ) ) {
				if ( !empty( $device_attributes ) && is_array( $device_attributes ) ) {
					foreach ( $device_attributes as $attribute_name => $device_attribute ) {
						if ( 'preset' === $attribute_name || ! in_array( $attribute_name, $expected_keys ) ) {
							continue;
						}
						$processed_keys[$attribute_name] = true;

						$this->set_media_state( $device_name );

						$attribute_selector = $this->get_attribute_selector( $attribute_name, $attributes_meta );
						$device_attribute   = $this->get_output_value( $device_attribute, $attribute_name );
						if ( !empty( $device_attribute ) ) {
							$this->add_property( $attribute_selector, $device_attribute );
						}
					}
				}

				// If this is the first device (largest breakpoint), like desktop, handle unprocessed keys
				if( $is_first_iteration && !empty( $variable_name ) ) {
					$unprocessed_keys = array_diff($expected_keys, array_keys($processed_keys));

					if( !empty( $unprocessed_keys ) ) {
						foreach( $unprocessed_keys as $unprocessed_key ) {
							$this->set_media_state( $device_name );

							$kebab_variable_name = preg_replace('/([a-z])([A-Z])/', '$1-$2', $variable_name);
							$attribute_selector = $this->get_attribute_selector( $unprocessed_key, $attributes_meta );
							$this->add_property( $attribute_selector, 'var( --kbs-' . $attribute_selector . '-' . $kebab_variable_name . ')' );
						}
					}
				}
			}
			$is_first_iteration = false;
		}

		$this->set_media_state( 'desktop' );
	}

	/**
	 * Add components to the css output based on the attributes.
	 *
	 * @param string $key The key of the attribute to get.
	 * @param array $attributes an array of attributes.
	 * @param array $attributes_meta The meta of the attribute.
	 * @param WP_Block $block_instance The instance of the WP_Block class that represents the block being rendered.
	 * @return $this
	 */
	public function add_component( $key, $attributes, $attributes_meta = [], $block_instance = null ) {
		$merged_attribute = $this->merge_initial_attribute( $attributes_meta, ( isset( $attributes[ $key ] ) ? $attributes[ $key ] : [] ) );
		if ( empty( $merged_attribute ) || !isset( $attributes[$key] ) ) {
			return $this;
		}
		// TODO: Merge in preset values if set directly on component here
		// if( isset( $$attributes['preset'] ) ) {

		// }
		
		$this->add_component_array( $attributes[$key], $attributes_meta );			

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
			$this->add_property( $selector, $this->get_variable_value( $value_array[ $device_option['key'] ] ) );
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
	public function is_variable_value( $value ) {
		return is_string( $value ) && isset( $this->spacing_sizes[ $value ] );
	}

	/**
	 * @param $value
	 *
	 * @return int|string
	 */
	public function get_variable_value( $value ) {
		if( $this->is_variable_value( $value) ) {
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

}
