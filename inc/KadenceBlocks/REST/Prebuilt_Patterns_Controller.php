<?php
/**
 * REST API: Prebuilt_Patterns_Controller class
 *
 * @package KadenceBlocks
 */

namespace KadenceWP\KadenceBlocks\REST;

use WP_REST_Controller;
use WP_REST_Server;
use WP_REST_Response;
use WP_Error;

/**
 * Controller for prebuilt patterns REST endpoints
 */
class Prebuilt_Patterns_Controller extends WP_REST_Controller {

	/**
	 * Constructor
	 */
	public function __construct() {
		$this->namespace = 'kadence-blocks/v1';
		$this->rest_base = 'patterns';
	}

	/**
	 * Registers the routes for the objects of the controller.
	 */
	public function register_routes() {
		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base,
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_patterns' ),
					'permission_callback' => array( $this, 'get_patterns_permission_check' ),
				),
			)
		);

		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base . '-categories',
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_pattern_categories' ),
					'permission_callback' => array( $this, 'get_patterns_permission_check' ),
				),
			)
		);

		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base . '/import',
			array(
				array(
					'methods'             => WP_REST_Server::EDITABLE,
					'callback'            => array( $this, 'import_pattern' ),
					'permission_callback' => array( $this, 'import_pattern_permission_check' ),
					'args'                => array(
						'pattern_id' => array(
							'required'          => true,
							'type'              => 'string',
							'sanitize_callback' => 'sanitize_text_field',
						),
						'ai_context' => array(
							'required' => false,
							'type'     => 'object',
						),
					),
				),
			)
		);
	}

	/**
	 * Checks if a given request has access to read patterns.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return true|WP_Error True if the request has read access, WP_Error object otherwise.
	 */
	public function get_patterns_permission_check( $request ) {
		return current_user_can( 'edit_posts' );
	}

	/**
	 * Checks if a given request has access to import patterns.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return true|WP_Error True if the request has read access, WP_Error object otherwise.
	 */
	public function import_pattern_permission_check( $request ) {
		return current_user_can( 'edit_posts' );
	}

	/**
	 * Retrieves patterns.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function get_patterns( $request ) {
		// For now, return mock data. In production, this would fetch from a remote API or local storage
		$patterns = array(
			array(
				'id'         => 'hero-001',
				'title'      => 'Hero Section with CTA',
				'thumbnail'  => 'https://patterns.startertemplatecloud.com/wp-content/uploads/2023/hero-001-thumb.jpg',
				'categories' => array( 'hero', 'landing' ),
				'keywords'   => array( 'hero', 'cta', 'header' ),
				'content'    => '<!-- wp:kadence/rowlayout --><div class="wp-block-kadence-rowlayout">Hero content here</div><!-- /wp:kadence/rowlayout -->',
			),
			array(
				'id'         => 'features-001',
				'title'      => 'Feature Grid',
				'thumbnail'  => 'https://patterns.startertemplatecloud.com/wp-content/uploads/2023/features-001-thumb.jpg',
				'categories' => array( 'features', 'services' ),
				'keywords'   => array( 'features', 'grid', 'services' ),
				'content'    => '<!-- wp:kadence/rowlayout --><div class="wp-block-kadence-rowlayout">Features content here</div><!-- /wp:kadence/rowlayout -->',
			),
		);

		return rest_ensure_response( $patterns );
	}

	/**
	 * Retrieves pattern categories.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function get_pattern_categories( $request ) {
		$categories = array(
			array(
				'slug'  => 'hero',
				'label' => __( 'Hero Sections', 'kadence-blocks' ),
			),
			array(
				'slug'  => 'features',
				'label' => __( 'Features', 'kadence-blocks' ),
			),
			array(
				'slug'  => 'testimonials',
				'label' => __( 'Testimonials', 'kadence-blocks' ),
			),
			array(
				'slug'  => 'cta',
				'label' => __( 'Call to Action', 'kadence-blocks' ),
			),
			array(
				'slug'  => 'pricing',
				'label' => __( 'Pricing', 'kadence-blocks' ),
			),
			array(
				'slug'  => 'landing',
				'label' => __( 'Landing Pages', 'kadence-blocks' ),
			),
		);

		return rest_ensure_response( $categories );
	}

	/**
	 * Imports a pattern.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function import_pattern( $request ) {
		$pattern_id = $request->get_param( 'pattern_id' );
		$ai_context = $request->get_param( 'ai_context' );

		// In production, this would:
		// 1. Fetch the pattern content
		// 2. Process AI replacements if ai_context is provided
		// 3. Handle image replacements
		// 4. Return the processed content

		$response = array(
			'success' => true,
			'content' => '<!-- wp:kadence/rowlayout --><div class="wp-block-kadence-rowlayout">Imported pattern content</div><!-- /wp:kadence/rowlayout -->',
		);

		return new WP_REST_Response( $response, 200 );
	}
}