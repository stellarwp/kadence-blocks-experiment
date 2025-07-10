<?php
/**
 * Class to Build the KBS Text Block.
 *
 * @package Kadence Blocks
 */

namespace KadenceWP\KadenceBlocks\Blocks\KBS;

use KadenceWP\KadenceBlocks\Blocks\Abstract_Block;
use KadenceWP\KadenceBlocks\Frontend\Svg_Render;
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
	 * Block determines in scripts need to be loaded for block.
	 * Note: this block can have scripts, such as typed text, but because we don't know in attributes if this block needs scripts, we need to check the content during build_html instead.
	 * This prevents the scripts for some features for loading for blocks that don't need them.
	 *
	 * @var string
	 */
	protected $has_script = false;

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

		// Add text alignment if set.
		if ( ! empty( $attributes['align'] ) ) {
			$css->set_selector( $root_selector );
			$css->add_property( 'text-align', $attributes['align'] );
		}

		$css = $this->add_custom_css( $css, $attributes, $root_selector );

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
		//Since we don't know in attributes if this block needs scripts, we need to check the content here
		if ( strpos( $content, 'kt-typed-text') !== false ) {
			$this->enqueue_script( 'kbs-' . $this->block_name );
		}
		if ( strpos( $content, 'kb-tooltips') !== false || ( ! empty( $attributes['icon'] ) && ! empty( $attributes['iconTooltip'] ) ) ) {
			$this->enqueue_script( 'kadence-blocks-tippy' );
		}

		$initial_tag  = $this->get_initial_attribute( $block_instance, 'htmlTag', 'div' );
		$html_tag     = $this->get_html_tag( $attributes, 'htmlTag', $initial_tag, $this->allowed_html_tags );
		$classes      = [ $this->root_selector_class, $this->root_selector_class . $unique_id ];
		$classes = array_merge( $classes, $this->get_global_style_classes( $attributes ) );

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

		$icon_html = Svg_Render::render_icon( $attributes, 'icon', 'kbs-text-' );
		$content = $icon_html . $content;

		return sprintf( '<%1$s %2$s>%3$s</%1$s>', $html_tag, $wrapper_attributes, $content );
	}

	/**
	 * Registers scripts and styles.
	 *
	 * @param string $handle the handle for the script.
	 */
	public function register_scripts( $handle ) {
		parent::register_scripts( $handle );

		wp_register_script( 'kadence-blocks-typed-js', KADENCE_BLOCKS_URL . 'includes/assets/js/typed.min.js', [], KADENCE_BLOCKS_VERSION, true );
		wp_register_script( 'kbs-' . $this->block_name, KADENCE_BLOCKS_URL . 'includes/assets/js/kbs-text.min.js', [ 'kadence-blocks-typed-js' ], KADENCE_BLOCKS_VERSION, true );

		wp_register_script( 'kadence-blocks-popper', KADENCE_BLOCKS_URL . 'includes/assets/js/popper.min.js', [], KADENCE_BLOCKS_VERSION, true );
		wp_register_script( 'kadence-blocks-tippy', KADENCE_BLOCKS_URL . 'includes/assets/js/kb-tippy.min.js', [ 'kadence-blocks-popper' ], KADENCE_BLOCKS_VERSION, true );
	}
}
