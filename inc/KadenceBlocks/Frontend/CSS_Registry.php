<?php
/**
 * CSS Registry for collecting and managing CSS rules
 *
 * @package KadenceWP\KadenceBlocks
 */

namespace KadenceWP\KadenceBlocks\Frontend;

/**
 * CSS Registry class
 * 
 * Collects CSS rules from various sources and outputs them in an optimized way
 */
class CSS_Registry {
	/**
	 * Instance Control.
	 *
	 * @var CSS_Registry
	 */
	private static $instance = null;

	/**
	 * Registered CSS rules organized by category
	 *
	 * @var array
	 */
	private $css_rules = array(
		'global_styles' => array(),
		'presets' => array(),
		'blocks' => array(),
		'components' => array(),
		'media_queries' => array(),
	);

	/**
	 * Tracks which global style slugs are used
	 *
	 * @var array
	 */
	private $used_global_styles = array();

	/**
	 * Tracks which preset slugs are used
	 *
	 * @var array
	 */
	private $used_presets = array();

	/**
	 * Get instance
	 *
	 * @return CSS_Registry
	 */
	public static function get_instance() {
		if ( is_null( self::$instance ) ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * Register a global style mapping
	 *
	 * @param string $slug The global style slug
	 * @param array  $mapping The style mapping data
	 */
	public function register_global_style( $slug, $mapping = array() ) {
		if ( ! empty( $slug ) ) {
			$this->used_global_styles[ $slug ] = $mapping;
		}
	}

	/**
	 * Register a preset
	 *
	 * @param string $type The preset type (e.g., 'typography', 'color')
	 * @param string $slug The preset slug
	 * @param array  $data The preset data
	 */
	public function register_preset( $type, $slug, $data = array() ) {
		if ( ! empty( $type ) && ! empty( $slug ) ) {
			if ( ! isset( $this->used_presets[ $type ] ) ) {
				$this->used_presets[ $type ] = array();
			}
			$this->used_presets[ $type ][ $slug ] = $data;
		}
	}

	/**
	 * Register CSS rules
	 *
	 * @param string $css The CSS rules
	 * @param string $category The category (global_styles, presets, blocks, components)
	 * @param string $identifier Optional identifier for deduplication
	 */
	public function register_css( $css, $category = 'blocks', $identifier = '' ) {
		if ( empty( $css ) ) {
			return;
		}

		if ( ! isset( $this->css_rules[ $category ] ) ) {
			$this->css_rules[ $category ] = array();
		}

		if ( ! empty( $identifier ) ) {
			$this->css_rules[ $category ][ $identifier ] = $css;
		} else {
			$this->css_rules[ $category ][] = $css;
		}
	}

	/**
	 * Register media query CSS
	 *
	 * @param string $css The CSS rules
	 * @param string $media_query The media query
	 * @param string $identifier Optional identifier for deduplication
	 */
	public function register_media_query_css( $css, $media_query, $identifier = '' ) {
		if ( empty( $css ) || empty( $media_query ) ) {
			return;
		}

		if ( ! isset( $this->css_rules['media_queries'][ $media_query ] ) ) {
			$this->css_rules['media_queries'][ $media_query ] = array();
		}

		if ( ! empty( $identifier ) ) {
			$this->css_rules['media_queries'][ $media_query ][ $identifier ] = $css;
		} else {
			$this->css_rules['media_queries'][ $media_query ][] = $css;
		}
	}

	/**
	 * Get all registered CSS organized by category
	 *
	 * @return string
	 */
	public function get_css() {
		$output = '';

		// Generate optimized CSS for used global styles and presets
		$optimized_css = $this->generate_optimized_css();
		if ( ! empty( $optimized_css ) ) {
			$output .= $optimized_css;
		}

		// Output global styles first
		if ( ! empty( $this->css_rules['global_styles'] ) ) {
			$output .= $this->compile_css_category( $this->css_rules['global_styles'] );
		}

		// Output presets
		if ( ! empty( $this->css_rules['presets'] ) ) {
			$output .= $this->compile_css_category( $this->css_rules['presets'] );
		}

		// Output components
		if ( ! empty( $this->css_rules['components'] ) ) {
			$output .= $this->compile_css_category( $this->css_rules['components'] );
		}

		// Output blocks
		if ( ! empty( $this->css_rules['blocks'] ) ) {
			$output .= $this->compile_css_category( $this->css_rules['blocks'] );
		}

		// Output media queries
		if ( ! empty( $this->css_rules['media_queries'] ) ) {
			foreach ( $this->css_rules['media_queries'] as $media_query => $rules ) {
				$media_css = $this->compile_css_category( $rules );
				if ( ! empty( $media_css ) ) {
					$output .= "@media {$media_query} { {$media_css} }";
				}
			}
		}

		return $output;
	}

	/**
	 * Compile CSS rules from a category
	 *
	 * @param array $rules The CSS rules
	 * @return string
	 */
	private function compile_css_category( $rules ) {
		if ( empty( $rules ) ) {
			return '';
		}

		$css_parts = array();
		foreach ( $rules as $rule ) {
			if ( ! empty( $rule ) ) {
				$css_parts[] = trim( $rule );
			}
		}

		return implode( '', array_unique( $css_parts ) );
	}

	/**
	 * Get used global styles
	 *
	 * @return array
	 */
	public function get_used_global_styles() {
		return $this->used_global_styles;
	}

	/**
	 * Get used presets
	 *
	 * @return array
	 */
	public function get_used_presets() {
		return $this->used_presets;
	}

	/**
	 * Clear all registered CSS
	 */
	public function clear() {
		$this->css_rules = array(
			'global_styles' => array(),
			'presets' => array(),
			'blocks' => array(),
			'components' => array(),
			'media_queries' => array(),
		);
		$this->used_global_styles = array();
		$this->used_presets = array();
	}

	/**
	 * Generate optimized CSS based on used global styles and presets
	 *
	 * @return string
	 */
	private function generate_optimized_css() {
		$css_engine = new \KadenceWP\KadenceBlocks\Frontend\CSS_Engine();
		$css_engine->set_style_id( 'kbs-optimized-global-styles' );
		
		// Get global styles data
		$global_styles = \KadenceWP\KadenceBlocks\Settings\Global_Style::get_global_styles();
		if ( empty( $global_styles ) ) {
			return '';
		}
		
		// Process only the used global styles
		foreach ( $this->used_global_styles as $style_id => $mapping_data ) {
			if ( empty( $global_styles[ $style_id ] ) ) {
				continue;
			}
			
			$style_data = $global_styles[ $style_id ];
			
			// Process mappings for this global style
			if ( ! empty( $style_data['mappings'] ) && is_array( $style_data['mappings'] ) ) {
				foreach ( $style_data['mappings'] as $category => $tokens ) {
					if ( ! empty( $tokens ) && is_array( $tokens ) ) {
						foreach ( $tokens as $token => $token_data ) {
							if ( isset( $token_data['value'] ) && $token_data['value'] !== '' ) {
								$variable_name = $this->get_mapping_variable_name( $category, $token );
								
								if ( 'kbs-base' === $style_id ) {
									$css_engine->set_selector( ':root' );
									if ( 'colors' === $category ) {
										$css_engine->add_property( '--global-' . strtolower( preg_replace( '/[^a-zA-Z0-9-_]/', '-', (string) $token ) ), $token_data['value'] );
									}
									$css_engine->add_property( $variable_name, $token_data['value'] );
								} else {
									$selector = $this->get_style_selector( $style_id );
									$css_engine->set_selector( $selector );
									$css_engine->add_property( $variable_name, $token_data['value'] );
								}
							}
						}
					}
				}
			}
		}
		
		// Process only the used presets
		foreach ( $this->used_presets as $component => $presets ) {
			foreach ( $presets as $preset_slug => $preset_data ) {
				if ( ! empty( $preset_data['attributes'] ) ) {
					$component_attributes = $preset_data['attributes'];
					$component_meta = [
						'component' => $component,
						'nonInheritable' => $this->get_non_inheritable_attribute( $component ),
						'selector' => $this->get_component_selector( $component ),
					];
					$css_engine->set_selector( '.' . $preset_slug );
					$css_engine->add_component( $component, [$component => $component_attributes], $component_meta );
				}
			}
		}
		
		return $css_engine->css_output();
	}
	
	/**
	 * Get the CSS selector for a given style ID.
	 *
	 * @param string $style_id The style ID.
	 * @return string The CSS selector.
	 */
	private function get_style_selector( $style_id ) {
		$style_slug = preg_replace( '/[^a-zA-Z0-9-_]/', '-', $style_id );
		$style_slug = trim( $style_slug, '-' );
		return '.kbs-global-style-' . $style_slug;
	}
	
	/**
	 * Get the non inheritable attribute for a component.
	 *
	 * @param string $component The component name.
	 * @return bool
	 */
	private function get_non_inheritable_attribute( $component ) {
		switch ( $component ) {
			case 'typography':
				return false;
			default:
				return true;
		}
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
	 * Gets variable name from category and type.
	 *
	 * @param string $category The style category.
	 * @param string $type The style type or token name.
	 * @return string The CSS variable name.
	 */
	private function get_mapping_variable_name( $category, $type ) {
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
	 * Output the collected CSS
	 *
	 * @param bool $echo Whether to echo or return
	 * @return string|void
	 */
	public function output_css( $echo = true ) {
		$css = $this->get_css();
		
		if ( ! empty( $css ) ) {
			$css = '<style id="kadence-blocks-dynamic-css">' . $css . '</style>';
			
			if ( $echo ) {
				echo $css;
			} else {
				return $css;
			}
		}
	}
}