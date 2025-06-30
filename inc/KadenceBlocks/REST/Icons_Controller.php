<?php
/**
 * Icons REST API Controller
 *
 * @package KadenceWP\KadenceBlocks\REST
 */

namespace KadenceWP\KadenceBlocks\REST;

use WP_REST_Controller;
use WP_REST_Server;
use WP_REST_Request;
use WP_REST_Response;
use WP_Error;

/**
 * Icons REST API Controller class
 */
class Icons_Controller extends WP_REST_Controller {

	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->namespace = 'kb-icons/v1';
		$this->rest_base = 'icons';
	}

	/**
	 * Registers the routes for the objects of the controller.
	 *
	 * @see register_rest_route()
	 */
	public function register_routes() {
		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base,
			[
				[
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => [ $this, 'get_icons' ],
					'permission_callback' => '__return_true',
				],
			]
		);
	}

	/**
	 * Get a collection of icons.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function get_icons( $request ) {
		$all_icons = [
			'solidIcons' => $this->get_solid_icons(),
			'lineIcons'  => $this->get_line_icons(),
			'custom'     => $this->get_custom_icons(),
		];

        $all_icons['cache_key'] = md5( json_encode( $all_icons ) );

		return rest_ensure_response( $all_icons );
	}

	/**
	 * Get Solid icons from the data file.
	 *
	 * @return array Solid icons array.
	 */
	private function get_solid_icons() {
		$icons_file = KADENCE_BLOCKS_PATH . 'inc/data/icons/Icons_Array.php';
		if ( file_exists( $icons_file ) ) {
			include $icons_file;
			return isset( $faico ) ? $faico : [];
		}
		return [];
	}

	/**
	 * Get Line icons from the data file.
	 *
	 * @return array Line icons array.
	 */
	private function get_line_icons() {
		$icons_file = KADENCE_BLOCKS_PATH . 'inc/data/icons/Icons_Ico_Array.php';
		if ( file_exists( $icons_file ) ) {
			include $icons_file;
			return isset( $ico ) ? $ico : [];
		}
		return [];
	}

	/**
	 * Get custom icons from kadence_custom_svg post type if user has Pro.
	 *
	 * @return array Custom icons array.
	 */
	private function get_custom_icons() {
		// Check if user has Pro (similar to frontend logic)
		$has_pro = defined( 'KADENCE_BLOCKS_PRO' ) && KADENCE_BLOCKS_PRO;
		
		if ( ! $has_pro ) {
			return [];
		}

		// Fetch custom SVGs from kadence_custom_svg post type
		$custom_svgs = get_posts( [
			'post_type'      => 'kadence_custom_svg',
			'post_status'    => 'publish',
			'posts_per_page' => 100,
			'fields'         => 'ids',
		] );

		$custom_icons = [];

		if ( ! empty( $custom_svgs ) ) {
			foreach ( $custom_svgs as $svg_id ) {
				$post = get_post( $svg_id );
				if ( $post && ! empty( $post->post_content ) ) {
					$svg_content = $post->post_content;
					
					// Clean up the content (remove p tags and decode entities)
					$svg_content = str_replace( '<p>', '', $svg_content );
					$svg_content = str_replace( '</p>', '', $svg_content );
					$svg_content = str_replace( '&#8220;', '"', $svg_content );
					$svg_content = str_replace( '&#8221;', '"', $svg_content );
					$svg_content = str_replace( '&#8222;', '"', $svg_content );
					$svg_content = str_replace( '&#8243;', '"', $svg_content );

					$svg_data = json_decode( $svg_content, true );
					
					if ( $svg_data && is_array( $svg_data ) ) {
						$custom_icons[ 'kb-custom-' . $svg_id ] = $svg_data;
					}
				}
			}
		}

		return $custom_icons;
	}
} 