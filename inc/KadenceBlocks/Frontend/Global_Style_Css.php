<?php
/**
 * Generates CSS for Global Styles.
 */

namespace KadenceWP\KadenceBlocks\Frontend;
use KadenceWP\KadenceBlocks\Settings\Global_Style;
use KadenceWP\KadenceBlocks\Settings\Global_Styles_Manager;
use KadenceWP\KadenceBlocks\Settings\Global_Style_Item;
use KadenceWP\KadenceBlocks\Blocks\Editor_Assets;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class to generate CSS for Global Styles.
 */
class Global_Style_Css {

	/**
	 * CSS Engine instance.
	 *
	 * @var CSS_Engine
	 */
	private $css;

	/**
	 * Global Styles data.
	 *
	 * @var array
	 */
	private $global_styles = null;
	/**
	 * Responsive device options.
	 *
	 * @var array
	 */
	private $device_options;

	/**
	 * Map of global styles needed for the page
	 * 
	 * Key is the css class of appened global style ids
	 * Value is an array of global style ids
	 *
	 * @var array
	 */
	private $global_style_map = [];

	/**
	 * All CSS variables used on the page.
	 *
	 * @var array
	 */
	private $all_used_variables = [];

	/**
	 * Constructor
	 *
	 * @param CSS_Engine $css_engine The CSS Engine instance.
	 * @param array      $device_options Responsive device options.
	 */
	public function __construct( CSS_Engine $css_engine ) {
		$this->css = $css_engine;
		$this->device_options = Editor_Assets::get_responsive_device_options();
	}

	/**
	 * Fetches global styles from the database.
	 *
	 * @return array Array of global styles
	 */
	private function fetch_global_styles() {
		$all_style_ids = array_merge(...array_values( $this->global_style_map));
		$unique_style_ids = array_unique($all_style_ids);

		if( !in_array('kbs-base', $unique_style_ids)){
			$unique_style_ids[] = 'kbs-base';
		}

		return Global_Styles_Manager::get_global_styles_by_ids( $unique_style_ids );
	}

	/**
	 * Get the component selector.
	 *
	 * @param string $component The component name.
	 * @return string
	 */
	private function get_component_selector( $component ) {
		switch ( $component ) {
			case 'typography':
				return '--kbs-typo-';
			default:
				return '';
		}
	}

	/**
	 * Create a combined style ID from multiple style IDs.
	 *
	 * @param array $style_ids Array of style IDs.
	 * @return string|null Combined ID or null if less than 2 IDs.
	 */
	private function create_combined_style_key( array $style_ids ) {
		return implode( '__', $style_ids );
	}

	/**
	 * Check if a style ID is a combined style ID.
	 *
	 * @param string $style_id The style ID to check.
	 * @return bool True if it's a combined style ID.
	 */
	private function is_combined_style_id( string $style_id ) {
		return strpos( $style_id, '---' ) !== false;
	}

	public function output_style_usage() {
		if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
			echo '<h3>Mappings used</h3>';
			echo '<h4>Global Style IDs (key => component IDs):</h4>';
			echo '<pre>';
			print_r( $this->global_style_map );
			echo '</pre>';
			echo '<h4>Used Variables:</h4>';
			echo '<pre>';
			print_r( $this->all_used_variables );
			echo '</pre>';
		}

		if(  empty( $this->all_used_variables ) ) {
			return '';
		}

		if ( null === $this->global_styles ) {
			$this->global_styles = $this->fetch_global_styles();
		}

		if ( empty( $this->global_styles ) ) {
			return '';
		}

		$this->css->set_style_id( 'kbs-global-styles' );

		// Ensure base variables are emitted on :root when any variables are used
		if ( ! isset( $this->global_style_map['kbs-base'] ) ) {
			$this->global_style_map['kbs-base'] = [ 'kbs-base' ];
		}

		// For each global style class key
		foreach ( $this->global_style_map as $class_name => $global_styles ) {
			// Build selector
			if ( 'kbs-base' === $class_name ) {
				$selector = ':root';
			} else {
				$ids = array_filter( explode( '__', $class_name ) );
				$selector_parts = array_map( function( $id ) {
					return '.kbs-global-style-' . $id;
				}, $ids );
				$selector = implode( '', $selector_parts );
			}

			// For each global style used in this class
			foreach ( $global_styles as $global_style_key ) {
				$style_id   = $global_style_key;
				if ( ! isset( $this->global_styles[ $style_id ] ) ) {
					continue;
				}
				$style_item = new Global_Style_Item( $style_id, $this->global_styles[ $style_id ] );

				// Loop through the used variables and define their value
				foreach ( $this->all_used_variables as $variable_name ) {
					$parts = $this->parse_variable_name( $variable_name );
					if ( ! $parts ) {
						continue;
					}

					$value = $style_item->get_mapping_value( $parts['category'], $parts['token'] );
					if ( $value !== null ) {
						// Resolve references to undefined --global-palette* variables into concrete values
						$value = $this->resolve_global_palette_references( $value );
						$this->css->set_selector( $selector );
						$this->css->add_property( $variable_name, $value );
					}
				}
			}
		}

		$css = $this->css->css_output();
		if ( ! empty( $css ) ) {
			echo '<style id="kbs-global-styles-inline-css">' . $css . '</style>';
		}
		
	}

	/**
	 * Replace references to --global-palette* with actual hex values from the active palette
	 * or known base mappings, so frontend CSS does not depend on undefined theme globals.
	 *
	 * @param string $value Raw mapping value (may include var(--global-paletteX) or color-mix with those)
	 * @return string Resolved value
	 */
	private function resolve_global_palette_references( $value ) {
		if ( ! is_string( $value ) || strpos( $value, 'var(--global-palette' ) === false ) {
			return $value;
		}

		$base_style = isset( $this->global_styles['kbs-base'] ) ? new Global_Style_Item( 'kbs-base', $this->global_styles['kbs-base'] ) : null;

		$replaced = preg_replace_callback( '/var\(\s*--global-palette(-?[a-z0-9]+)\s*\)/i', function( $matches ) use ( $base_style ) {
			$token = ltrim( $matches[1], '-' ); // e.g. '9' or 'alert'
			$hex   = '';
			if ( ctype_digit( $token ) ) {
				// Numeric palette index 1-9
				$hex = Global_Style::palette_option( 'palette' . $token );
			} else {
				// Named notice or complement colors
				if ( $base_style ) {
					$hex = $base_style->get_mapping_value( 'colors', 'palette-' . $token );
				}
			}
			return $hex ? $hex : $matches[0];
		}, $value );

		return $replaced;
	}

	public function track_global_style_uses( $block_instance ) {
		// Check if this is a reusable block
		if ( 'core/block' === $block_instance->name && ! empty( $block_instance->attributes['ref'] ) ) {
			$this->process_reusable_block( $block_instance->attributes['ref'] );
		}

		if( !is_object( $block_instance ) || empty( $block_instance->attributes['uniqueID'] ) ) {
			return;
		}

		$global_style_ids = $block_instance->attributes['globalStyleIds'] ?? [];
		$global_styles_key = $this->create_combined_style_key( $global_style_ids );
		$attributes = $block_instance->attributes;
		$block_name = $block_instance->name ?? '';
		
		if ( !empty( $global_styles_key ) && ! isset( $this->global_style_map[ $global_styles_key ] ) ) {
			$this->global_style_map[ $global_styles_key ] = $global_style_ids;
		}
		
		// Detect CSS variables used by this block
		$used_variables = CSS_Variable_Detector::detect_variables( $attributes, $block_name, $block_instance );
		
		// Track globally used variables
		if ( ! empty( $used_variables ) ) {
			foreach ( $used_variables as $variable ) {
				if ( ! in_array( $variable, $this->all_used_variables, true ) ) {
					$this->all_used_variables[] = $variable;
				}
			}
		}
		
		// Process inner blocks
		foreach( $block_instance->inner_blocks as $inner_block ) {
			$this->track_global_style_uses( $inner_block );
		}
	}

	/**
	 * Process a reusable block by fetching and parsing its content.
	 *
	 * @param int $ref_id The reusable block post ID.
	 */
	private function process_reusable_block( $ref_id ) {
		// Fetch the reusable block post
		$reusable_block = get_post( $ref_id );
		if ( ! $reusable_block || 'wp_block' !== $reusable_block->post_type ) {
			return;
		}
		
		// Parse the reusable block content
		$blocks = parse_blocks( $reusable_block->post_content );
		
		// Process each block in the reusable block
		foreach ( $blocks as $block ) {
			if ( ! empty( $block['blockName'] ) ) {
				// Create a mock block instance
				$mock_block = $this->create_mock_block_instance( $block );
				if ( $mock_block ) {
					$this->track_global_style_uses( $mock_block );
				}
			}
		}
	}
	
	/**
	 * Create a mock block instance from parsed block data.
	 *
	 * @param array $block_data Parsed block data.
	 * @return object|null Mock block instance or null.
	 */
	private function create_mock_block_instance( $block_data ) {
		if ( empty( $block_data['blockName'] ) ) {
			return null;
		}
		
		// Create a mock block instance
		$mock_block = new \stdClass();
		$mock_block->name = $block_data['blockName'];
		$mock_block->attributes = $block_data['attrs'] ?? [];
		$mock_block->inner_blocks = [];
		
		// Process inner blocks recursively
		if ( ! empty( $block_data['innerBlocks'] ) ) {
			foreach ( $block_data['innerBlocks'] as $inner_block_data ) {
				$inner_mock = $this->create_mock_block_instance( $inner_block_data );
				if ( $inner_mock ) {
					$mock_block->inner_blocks[] = $inner_mock;
				}
			}
		}
		
		return $mock_block;
	}

	/**
	 * Parse a CSS variable name to extract category and token.
	 *
	 * @param string $variable_name The CSS variable name (e.g., '--kbs-colors-palette1').
	 * @return array|null Array with 'category' and 'token' keys, or null if invalid.
	 */
	private function parse_variable_name( $variable_name ) {
		// Remove --kbs- prefix
		if ( strpos( $variable_name, '--kbs-' ) !== 0 ) {
			return null;
		}
		
		$name_part = substr( $variable_name, 6 ); // Remove '--kbs-'
		
		// Split into category and token
		$parts = explode( '-', $name_part, 2 );
		if ( count( $parts ) < 2 ) {
			return null;
		}
		
		$category = $parts[0];
		$token = $parts[1];
		
		// Convert kebab-case back to camelCase for certain categories
		$camel_categories = [
			'font-size' => 'fontSize',
			'line-height' => 'lineHeight',
			'letter-spacing' => 'letterSpacing',
			'icon-size' => 'iconSize',
		];
		
		if ( isset( $camel_categories[ $category ] ) ) {
			$category = $camel_categories[ $category ];
		}
		
		return [
			'category' => $category,
			'token' => $token,
		];
	}

    /**
	 * Gets variable name from category and type (PHP equivalent of JS function).
	 *
	 * @param string $category The style category (e.g., 'color', 'typography').
	 * @param string $type The style type or token name (e.g., 'primary', 'body').
	 * @return string The CSS variable name.
	 */
	public static function get_mapping_variable_name( $category, $type ) {
		// First convert camelCase to kebab-case, then clean up
		$category_slug = preg_replace( '/([a-z])([A-Z])/', '$1-$2', (string) $category );
		$category_slug = strtolower( preg_replace( '/[^a-zA-Z0-9-_]/', '-', $category_slug ) );
		$category_slug = trim( $category_slug, '-' );

		$type_slug = preg_replace( '/([a-z])([A-Z])/', '$1-$2', (string) $type );
		$type_slug = strtolower( preg_replace( '/[^a-zA-Z0-9-_]/', '-', $type_slug ) );
		$type_slug = trim( $type_slug, '-' );

		return sprintf( '--kbs-%s-%s', $category_slug, $type_slug );
	}

} 