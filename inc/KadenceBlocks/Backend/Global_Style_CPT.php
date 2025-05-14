<?php
/**
 * Creates minified css via PHP.
 */

namespace KadenceWP\KadenceBlocks\Backend;


if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class to create a minified css output.
 */
class Global_Style_CPT {
    const SLUG = 'kadence_global_style';
	/**
	 * Instance Control
	 *
	 * @var null
	 */
	private static $instance = null;
	/**
	 * Instance Control.
	 */
	public static function get_instance() {
		if ( is_null( self::$instance ) ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * Constructor function.
	 */
	public function __construct() {
		// Register the post type.
		add_action( 'init', array( $this, 'register_post_type' ), 2 );
		// Register the meta settings for from post.
		add_action( 'init', array( $this, 'register_meta' ), 20 );
		if ( is_admin() ) {
			if( class_exists( 'Kadence_Blocks_Cpt_Import_Export' ) ) {
				new Kadence_Blocks_Cpt_Import_Export( self::SLUG );
			}
		}
	}

	/**
	 * Registers the Global Style post type.
	 */
	public function register_post_type() {
        die();
		$labels  = array(
			'name'               => _x( 'Global Style', 'Post Type General Name', 'kadence-blocks' ),
			'singular_name'      => _x( 'Global Style', 'Post Type Singular Name', 'kadence-blocks' ),
			'menu_name'          => _x( 'Global Style', 'Admin Menu text', 'kadence-blocks' ),
			'archives'           => __( 'Global Style Archives', 'kadence-blocks' ),
			'attributes'         => __( 'Global Style Attributes', 'kadence-blocks' ),
			'parent_item_colon'  => __( 'Parent Global Styles:', 'kadence-blocks' ),
			'all_items'          => __( 'Global Styles', 'kadence-blocks' ),
			'add_new_item'       => __( 'Add New Global Style', 'kadence-blocks' ),
			'new_item'           => __( 'New Global Style', 'kadence-blocks' ),
			'edit_item'          => __( 'Edit Global Style', 'kadence-blocks' ),
			'update_item'        => __( 'Update Global Style', 'kadence-blocks' ),
			'view_item'          => __( 'View Global Style', 'kadence-blocks' ),
			'view_items'         => __( 'View Global Styles', 'kadence-blocks' ),
			'search_items'       => __( 'Search Global Styles', 'kadence-blocks' ),
			'not_found'          => __( 'Not found', 'kadence-blocks' ),
			'not_found_in_trash' => __( 'Not found in Trash', 'kadence-blocks' ),
			'filter_items_list'  => __( 'Filter items list', 'kadence-blocks' ),
		);
		$args    = array(
			'labels'                => $labels,
			'description'           => __( 'Global Styles for Kadence.', 'kadence-blocks' ),
			'public'                => false,
			'publicly_queryable'    => false,
			'has_archive'           => false,
			'exclude_from_search'   => true,
			'show_ui'               => false,
			'show_in_menu'          => false,
			'show_in_nav_menus'     => false,
			'show_in_admin_bar'     => false,
			'can_export'            => true,
			'show_in_rest'          => true,
			'rest_controller_class' => \KadenceWP\KadenceBlocks\REST\Global_Styles_Controller::class,
			'rest_base'             => 'kadence_global_style',
			'capability_type'       => array( 'kadence_global_style', 'kadence_global_styles' ),
			'map_meta_cap'          => true,
		);
		register_post_type( self::SLUG, $args );
	}

	/**
	 * Check that user can edit these.
	 */
	public function meta_auth_callback() {
		return current_user_can( 'edit_edit_posts' );
	}
	/**
	 * Register Post Meta options
	 */
	public function register_meta() {
		$register_meta = array(
			array(
				'key'     => '_kbs_global_style_preview_post_type',
				'default' => 'post',
				'type'    => 'string'
			),
		);

		foreach ( $register_meta as $meta ) {

			if ( $meta['type'] === 'string' ) {
				$show_in_rest = true;
			} elseif ( $meta['type'] === 'array' ) {
				$show_in_rest = array(
					'schema' => array(
						'type'  => $meta['type'],
						'items' => array(
							'type' => $meta['children_type']
						),
					),
				);

				if( !empty( $meta['properties']) ) {
					$show_in_rest = array_merge_recursive( $show_in_rest, array(
						'schema' => array(
							'items' => array(
								'properties' => $meta['properties']
							)
						)
					) );
				}
			} elseif ( $meta['type'] === 'object' ) {
				$show_in_rest = array(
					'schema' => array(
						'type'       => $meta['type'],
						'properties' => $meta['properties']
					),
				);
			}

			register_post_meta(
				'kadence_global_style',
				$meta['key'],
				array(
					'single'        => true,
					'auth_callback' => array( $this, 'meta_auth_callback' ),
					'type'          => $meta['type'],
					'default'       => $meta['default'],
					'show_in_rest'  => $show_in_rest,
				)
			);
		}
	}
}