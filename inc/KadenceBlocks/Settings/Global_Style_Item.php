<?php
/**
 * Global Style Item
 *
 * Represents a single global style with helper methods for accessing its data.
 *
 * @since 4.0.0
 * @package KadenceWP\KadenceBlocks\Settings
 */

declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Settings;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Represents a single global style item.
 *
 * @since 4.0.0
 */
class Global_Style_Item {
	/**
	 * The global style ID.
	 *
	 * @var string
	 */
	private $style_id;

	/**
	 * The global style data.
	 *
	 * @var array
	 */
	private $data;

	/**
	 * Constructor.
	 *
	 * @param string $style_id The global style ID.
	 * @param array  $data The global style data.
	 */
	public function __construct( string $style_id, array $data ) {
		$this->style_id = $style_id;
		$this->data = $data;
	}

	/**
	 * Get the style ID.
	 *
	 * @return string
	 */
	public function get_id() {
		return $this->style_id;
	}

	/**
	 * Get the style label.
	 *
	 * @return string
	 */
	public function get_label() {
		return $this->data['label'] ?? '';
	}

	/**
	 * Get the style version.
	 *
	 * @return string
	 */
	public function get_version() {
		return $this->data['version'] ?? '';
	}

	/**
	 * Get all mappings.
	 *
	 * @return array
	 */
	public function get_mappings() {
		return $this->data['mappings'] ?? [];
	}
	
	/**
	 * Get a specific mapping value.
	 *
	 * @param string $category The mapping category.
	 * @param string $token The token within the category.
	 * @return array|null
	 */
	public function get_mapping( string $category, string $token ) {
		return $this->data['mappings'][ $category ][ $token ] ?? null;
	}

	/**
	 * Check if a mapping exists.
	 *
	 * @param string $category The mapping category.
	 * @param string $token The token within the category.
	 * @return bool
	 */
	public function has_mapping( string $category, string $token ) {
		return isset( $this->data['mappings'][ $category ][ $token ] );
	}

	/**
	 * Get the mapping value.
	 *
	 * @param string $category The mapping category.
	 * @param string $token The token within the category.
	 * @return string|null
	 */
	public function get_mapping_value( string $category, string $token ) {
		$mapping = $this->get_mapping( $category, $token );
		return $mapping['value'] ?? null;
	}

	/**
	 * Get all components.
	 *
	 * @return array
	 */
	public function get_components() {
		return $this->data['components'] ?? [];
	}

	/**
	 * Get a specific component.
	 *
	 * @param string $component The component name.
	 * @return array
	 */
	public function get_component( string $component ) {
		return $this->data['components'][ $component ] ?? [];
	}

	/**
	 * Get component presets.
	 *
	 * @param string $component The component name.
	 * @return array
	 */
	public function get_component_presets( string $component ) {
		return $this->data['components'][ $component ]['presets'] ?? [];
	}

	/**
	 * Get a specific component preset.
	 *
	 * @param string $component The component name.
	 * @param string $preset_key The preset key.
	 * @return array|null
	 */
	public function get_component_preset( string $component, string $preset_key ) {
		return $this->data['components'][ $component ]['presets'][ $preset_key ] ?? null;
	}

	/**
	 * Get the raw data array.
	 *
	 * @return array
	 */
	public function get_data() {
		return $this->data;
	}
}