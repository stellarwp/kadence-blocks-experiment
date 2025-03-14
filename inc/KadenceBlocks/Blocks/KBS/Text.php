<?php
/**
 * Class to Build the KBS Text Block.
 *
 * @package Kadence Blocks
 */

namespace KadenceWP\KadenceBlocks\Blocks\KBS;

use KadenceWP\KadenceBlocks\Blocks\Abstract_Block;
use function get_block_wrapper_attributes;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class to Build the Text Block.
 *
 * @category class
 */
class Text extends Abstract_Block {

	/**
	 * Block name within this namespace.
	 *
	 * @var string
	 */
	protected $block_name = 'text';

	/**
	 * Block name within this namespace.
	 *
	 * @var string
	 */
	protected $root_selector_class = 'kbs-text';

	/**
	 * Allowed HTML tags for front end output
	 *
	 * @var string[]
	 */
	protected $allowed_html_tags = [ 'div', 'p', 'span' ];

	/**
	 * Builds CSS for block.
	 *
	 * @param array      $attributes the blocks attributes.
	 * @param CSS_Engine $css the css class for blocks.
	 * @param string     $unique_id the blocks attr ID.
	 * @param string     $unique_style_id the blocks alternate ID for queries.
	 * @param WP_Block   $block_instance The instance of the WP_Block class that represents the block being rendered.
	 */
	public function build_css( $attributes, $css, $unique_id, $unique_style_id, $block_instance ) {
		$css->set_style_id( 'kbs-' . $this->block_name . $unique_style_id );
		$root_selector = '.' . $this->root_selector_class . $unique_id;

		$css->set_selector( $root_selector );

		$css->add_attributes( $attributes, $block_instance );

		// Add text alignment if set
		if ( ! empty( $attributes['align'] ) ) {
			$css->set_selector( $root_selector );
			$css->add_property( 'text-align', $attributes['align'] );
		}

		$css = $this->add_custom_css( $attributes, $css, $root_selector );

		return $css->css_output();
	}

	/**
	 * Build HTML for dynamic blocks
	 *
	 * @param array    $attributes the block attributes.
	 * @param string   $unique_id the blocks unique id.
	 * @param string   $content the blocks inner content.
	 * @param WP_Block $block_instance The instance of the WP_Block class that represents the block being rendered.
	 *
	 * @return string
	 */
	public function build_html( $attributes, $unique_id, $content, $block_instance ) {
		$initial_tag  = $this->get_initial_attribute( $block_instance, 'htmlTag', 'div' );
		$html_tag     = $this->get_html_tag( $attributes, 'htmlTag', $initial_tag, $this->allowed_html_tags );
		$classes      = [ $this->root_selector_class, $this->root_selector_class . $unique_id ];
		
		if ( ! empty( $attributes['align'] ) ) {
			$classes[] = 'has-text-align-' . $attributes['align'];
		}
		
		$wrapper_args = [
			'class' => implode( ' ', $classes ),
		];
		
		if ( ! empty( $attributes['anchor'] ) ) {
			$wrapper_args['id'] = $attributes['anchor'];
		}
		
		$wrapper_args       = apply_filters( 'kbs_wrapper_args', $wrapper_args, $attributes, $this->block_name, $unique_id, $block_instance );
		$wrapper_attributes = get_block_wrapper_attributes( $wrapper_args );

		return sprintf( '<%1$s %2$s>%3$s</%1$s>', $html_tag, $wrapper_attributes, $content );
	}
} 