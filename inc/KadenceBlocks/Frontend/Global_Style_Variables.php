<?php
/**
 * Generates CSS variables for Global Styles.
 */

namespace KadenceWP\KadenceBlocks\Frontend;
use KadenceWP\KadenceBlocks\Settings\Global_Style;
use KadenceWP\KadenceBlocks\Settings\Global_Styles_Manager;
use KadenceWP\KadenceBlocks\Settings\Global_Style_Item;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class to generate CSS variables for Global Styles.
 */
class Global_Style_Variables {

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
    // Note: device options were unused and removed for simplicity

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
     * @param mixed      $device_options Optional, ignored (kept for compatibility).
     */
    public function __construct( CSS_Engine $css_engine, $device_options = null ) {
        $this->css = $css_engine;
    }

	/**
	 * Fetches global styles from the database.
	 *
	 * @return array Array of global styles
	 */
	private function fetch_global_styles() {
		// Collect unique style IDs efficiently using associative array
		$unique_style_ids = [];
		foreach ( $this->global_style_map as $style_ids ) {
			foreach ( $style_ids as $style_id ) {
				$unique_style_ids[ $style_id ] = true;
			}
		}
		
		// Ensure base style is always included
		$unique_style_ids['kbs-base'] = true;
		
		// Get the keys which are the unique style IDs
		return Global_Styles_Manager::get_global_styles_by_ids( array_keys( $unique_style_ids ) );
	}

    /**
     * Create a combined style key from multiple style IDs.
     * If one ID, returns that ID; if none, returns empty string.
     *
     * @param array $style_ids Array of style IDs.
     * @return string Combined key.
     */
    private function create_combined_style_key( array $style_ids ) {
        $style_ids = array_values( array_filter( $style_ids ) );
        if ( empty( $style_ids ) ) {
            return '';
        }
        return count( $style_ids ) > 1 ? implode( '__', $style_ids ) : $style_ids[0];
    }

    public function output_style_usage() {
        if ( empty( $this->all_used_variables ) ) {
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

        // Prepare parsed variables once
        $used_vars   = array_keys( $this->all_used_variables );
        $parsed_vars = [];
        foreach ( $used_vars as $var_name ) {
            $parts = $this->parse_variable_name( $var_name );
            if ( $parts ) {
                $parsed_vars[] = [ 'name' => $var_name, 'parts' => $parts ];
            }
        }

        // Cache style items and base style for palette resolution
        $style_item_cache = [];
        $base_style_item  = isset( $this->global_styles['kbs-base'] )
            ? new Global_Style_Item( 'kbs-base', $this->global_styles['kbs-base'] )
            : null;

        // For each global style class key
        foreach ( $this->global_style_map as $class_name => $global_styles ) {
            $selector = ( 'kbs-base' === $class_name ) ? ':root' : '.kbs-global-style-' . $class_name;
            $this->css->set_selector( $selector );

            foreach ( $global_styles as $style_id ) {
                if ( ! isset( $this->global_styles[ $style_id ] ) ) {
                    continue;
                }
                if ( ! isset( $style_item_cache[ $style_id ] ) ) {
                    $style_item_cache[ $style_id ] = new Global_Style_Item( $style_id, $this->global_styles[ $style_id ] );
                }
                $style_item = $style_item_cache[ $style_id ];

                foreach ( $parsed_vars as $v ) {
                    $value = $style_item->get_mapping_value( $v['parts']['category'], $v['parts']['token'] );
                    if ( $value !== null ) {
                        if ( is_string( $value ) && strpos( $value, 'var(--global-palette' ) !== false ) {
                            $value = $this->resolve_global_palette_references( $value, $base_style_item );
                        }
                        $this->css->add_property( $v['name'], $value );
                    }
                }

                // Emit preset component variables for this style, so var(--kbs-<prop>-<preset>) resolves in this scope
                $components = $style_item->get_components();
                if ( ! empty( $components ) && is_array( $components ) ) {
                    foreach ( $components as $component_name => $component_data ) {
                        if ( empty( $component_data['presets'] ) || ! is_array( $component_data['presets'] ) ) {
                            continue;
                        }
                        
                        // Get component keys dynamically based on component type
                        $component_keys = \KadenceWP\KadenceBlocks\Frontend\Utils\Component_Value_Resolver::get_component_keys( $component_name );
                        
                        foreach ( $component_data['presets'] as $preset_key => $preset_data ) {
                            if ( empty( $preset_data['attributes'] ) || ! is_array( $preset_data['attributes'] ) ) {
                                continue;
                            }
                            
                            // Determine attributes for desktop device as base
                            $attrs = isset( $preset_data['attributes']['desktop'] ) && is_array( $preset_data['attributes']['desktop'] )
                                ? $preset_data['attributes']['desktop'] : ( is_array( $preset_data['attributes'] ) ? $preset_data['attributes'] : array() );
                            
                            $token = strtolower( preg_replace( '/[^a-zA-Z0-9-_]/', '-', $preset_key ) );
                            
                            // Process each component key dynamically
                            foreach ( $component_keys as $attr_key ) {
                                // Skip hover/active states for now (could be enhanced later)
                                if ( strpos( $attr_key, 'Hover' ) !== false || strpos( $attr_key, 'Active' ) !== false ) {
                                    continue;
                                }
                                
                                if ( ! isset( $attrs[ $attr_key ] ) || $attrs[ $attr_key ] === '' ) {
                                    continue;
                                }
                                
                                $val = $attrs[ $attr_key ];
                                
                                // Process value through appropriate CSS engine methods based on property type
                                if ( is_string( $val ) ) {
                                    // Font size processing
                                    if ( $attr_key === 'fontSize' ) {
                                        $converted = $this->css->get_variable_font_size_value( $val );
                                        if ( $converted ) {
                                            $val = $converted;
                                        }
                                    }
                                    // Line height processing
                                    elseif ( $attr_key === 'lineHeight' ) {
                                        $converted = $this->css->get_variable_line_height_value( $val );
                                        if ( $converted ) {
                                            $val = $converted;
                                        }
                                    }
                                    // Letter spacing processing
                                    elseif ( $attr_key === 'letterSpacing' ) {
                                        $converted = $this->css->get_variable_letter_spacing_value( $val );
                                        if ( $converted ) {
                                            $val = $converted;
                                        }
                                    }
                                    // Color processing
                                    elseif ( strpos( $attr_key, 'color' ) !== false || strpos( $attr_key, 'Color' ) !== false ) {
                                        $val = $this->css->sanitize_color( $val );
                                    }
                                    // Spacing values (padding, margin, etc.)
                                    elseif ( preg_match( '/(padding|margin|gap|width|height|size|radius)/i', $attr_key ) ) {
                                        $converted = $this->css->get_variable_spacing_value( $val );
                                        if ( $converted ) {
                                            $val = $converted;
                                        }
                                    }
                                }
                                
                                // Skip non-string values to avoid warnings
                                if ( is_array( $val ) || is_object( $val ) ) {
                                    continue;
                                }
                                
                                // Generate variable name using kebab-case conversion
                                $var_name = sprintf( '--kbs-%s-%s', strtolower( preg_replace( '/([a-z])([A-Z])/', '$1-$2', $attr_key ) ), $token );
                                $this->css->add_property( $var_name, $val );
                            }
                        }
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
    private function resolve_global_palette_references( $value, $base_style = null ) {
        if ( ! is_string( $value ) || strpos( $value, 'var(--global-palette' ) === false ) {
            return $value;
        }

        if ( ! $base_style && isset( $this->global_styles['kbs-base'] ) ) {
            $base_style = new Global_Style_Item( 'kbs-base', $this->global_styles['kbs-base'] );
        }

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

	/**
	 * Track global style usage for a block.
	 * Can be called with either:
	 * - A WP_Block instance (from render_css)
	 * - Raw attributes array and block name (from output_head_data)
	 *
	 * @param WP_Block|array $block_or_attributes Block instance or attributes array
	 * @param string|null    $block_name Block name (only needed if first param is array)
	 * @param object|null    $block_type Block type (only needed if first param is array)
	 */
	public function track_global_style_uses( $block_or_attributes, $block_name = null, $block_type = null ) {
		// Handle WP_Block instance (existing behavior)
		if ( is_object( $block_or_attributes ) ) {
			$block_instance = $block_or_attributes;
			
			// Check if this is a reusable block
			if ( 'core/block' === $block_instance->name && ! empty( $block_instance->attributes['ref'] ) ) {
				$this->process_reusable_block( $block_instance->attributes['ref'] );
			}

			if ( empty( $block_instance->attributes['uniqueID'] ) ) {
				return;
			}

			$attributes = $block_instance->attributes;
			$block_name = $block_instance->name ?? '';
			$inner_blocks = $block_instance->inner_blocks;
		}
		// Handle raw attributes array (new behavior for output_head_data)
		elseif ( is_array( $block_or_attributes ) ) {
			$attributes = $block_or_attributes;
			
			if ( empty( $attributes['uniqueID'] ) ) {
				return;
			}
			
			// Create a minimal block instance for CSS_Variable_Detector
			$block_instance = new \stdClass();
			$block_instance->block_type = $block_type;
			$inner_blocks = [];
		}
		else {
			return;
		}

		$global_style_ids = $attributes['globalStyleIds'] ?? [];
		$global_styles_key = $this->create_combined_style_key( $global_style_ids );
		
		if ( !empty( $global_styles_key ) && ! isset( $this->global_style_map[ $global_styles_key ] ) ) {
			$this->global_style_map[ $global_styles_key ] = $global_style_ids;
		}
		
		// Detect CSS variables used by this block
		$used_variables = CSS_Variable_Detector::detect_variables( $attributes, $block_name, $block_instance );
		
        // Track globally used variables as a set
        if ( ! empty( $used_variables ) ) {
            foreach ( $used_variables as $variable ) {
                $this->all_used_variables[ $variable ] = true;
            }
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
		
		$category = '';
		$token    = '';
		
		// Handle multi-word categories first (e.g., font-size-3xl)
		if ( preg_match( '/^(font-size|line-height|letter-spacing|icon-size)-(.*)$/', $name_part, $matches ) ) {
			$category = $matches[1];
			$token    = $matches[2];
		} else {
			// Fallback: split into category and token
			$parts = explode( '-', $name_part, 2 );
			if ( count( $parts ) < 2 ) {
				return null;
			}
			$category = $parts[0];
			$token    = $parts[1];
		}
		
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