<?php
/**
 * Sticky component CSS generator
 *
 * @package Kadence Blocks
 */

namespace KadenceWP\KadenceBlocks\Frontend\Generators;

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Sticky component CSS generator
 */
class Sticky_Generator extends Base_Generator {

    /**
     * Component type identifier
     *
     * @var string
     */
    protected $component_type = 'sticky';

    /**
     * Generate CSS for sticky component
     *
     * @param string   $attribute_name The attribute name.
     * @param array    $meta Component metadata.
     * @param array    $resolved_values Pre-resolved component values.
     * @param \WP_Block $block_instance The block instance.
     * @return void
     */
    public function generate( $attribute_name, $meta, $resolved_values, $block_instance ) {        
        $position = isset( $resolved_values['position']['value'] ) ? $resolved_values['position']['value'] : '';
        
        if ( $position === 'top' ) {
            $this->add_property( 'position', 'sticky' );
        }

        if(isset($resolved_values['offset']['value']) && $resolved_values['offset']['value'] !== '') {
            $offset_value = $resolved_values['offset']['value'];
            $offset_css   = $this->add_unit( $offset_value );
            $this->add_property( 'top', $offset_css );
        }        
    }

    /**
     * Get component keys for sticky
     *
     * @return array List of component property keys.
     */
    protected function get_component_keys() {
        return array( 'position', 'offset' );
    }
}
