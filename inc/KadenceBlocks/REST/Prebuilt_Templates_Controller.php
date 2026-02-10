<?php
/**
 * REST API: Prebuilt_Templates_Controller class
 *
 * @package KadenceBlocks
 */

namespace KadenceWP\KadenceBlocks\REST;

use WP_REST_Controller;
use WP_REST_Server;
use WP_REST_Response;
use WP_Error;

/**
 * Controller for prebuilt templates REST endpoints
 */
class Prebuilt_Templates_Controller extends WP_REST_Controller {

	/**
	 * Constructor
	 */
	public function __construct() {
		$this->namespace = 'kadence-blocks/v1';
		$this->rest_base = 'templates';
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
					'callback'            => array( $this, 'get_templates' ),
					'permission_callback' => array( $this, 'get_templates_permission_check' ),
				),
			)
		);

		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base . '-types',
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_template_types' ),
					'permission_callback' => array( $this, 'get_templates_permission_check' ),
				),
			)
		);

		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base . '/import',
			array(
				array(
					'methods'             => WP_REST_Server::EDITABLE,
					'callback'            => array( $this, 'import_template' ),
					'permission_callback' => array( $this, 'import_template_permission_check' ),
					'args'                => array(
						'template_id' => array(
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
	 * Checks if a given request has access to read templates.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return true|WP_Error True if the request has read access, WP_Error object otherwise.
	 */
	public function get_templates_permission_check( $request ) {
		return current_user_can( 'edit_posts' );
	}

	/**
	 * Checks if a given request has access to import templates.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return true|WP_Error True if the request has read access, WP_Error object otherwise.
	 */
	public function import_template_permission_check( $request ) {
		return current_user_can( 'edit_posts' );
	}

	/**
	 * Retrieves templates.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function get_templates( $request ) {
		// Mock data for development
		$templates = array(
			array(
				'id'          => 'landing-001',
				'title'       => 'Professional Landing Page',
				'description' => 'A clean and modern landing page template perfect for businesses',
				'thumbnail'   => 'https://patterns.startertemplatecloud.com/wp-content/uploads/2023/landing-001-thumb.jpg',
				'type'        => 'landing',
				'content'     => '<!-- wp:kadence/rowlayout --><div class="wp-block-kadence-rowlayout">Full page template content</div><!-- /wp:kadence/rowlayout -->',
			),
			array(
				'id'          => 'home-001',
				'title'       => 'Corporate Home Page',
				'description' => 'Professional home page layout for corporate websites',
				'thumbnail'   => 'https://patterns.startertemplatecloud.com/wp-content/uploads/2023/home-001-thumb.jpg',
				'type'        => 'home',
				'content'     => '<!-- wp:kadence/rowlayout --><div class="wp-block-kadence-rowlayout">Home page template content</div><!-- /wp:kadence/rowlayout -->',
			),
		);

		return rest_ensure_response( $templates );
	}

	/**
	 * Retrieves template types.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function get_template_types( $request ) {
		$types = array(
			array(
				'slug'  => 'home',
				'label' => __( 'Home Pages', 'kadence-blocks' ),
			),
			array(
				'slug'  => 'landing',
				'label' => __( 'Landing Pages', 'kadence-blocks' ),
			),
			array(
				'slug'  => 'about',
				'label' => __( 'About Pages', 'kadence-blocks' ),
			),
			array(
				'slug'  => 'contact',
				'label' => __( 'Contact Pages', 'kadence-blocks' ),
			),
			array(
				'slug'  => 'services',
				'label' => __( 'Services Pages', 'kadence-blocks' ),
			),
		);

		return rest_ensure_response( $types );
	}

	/**
	 * Imports a template.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function import_template( $request ) {
		$template_id = $request->get_param( 'template_id' );
		$ai_context  = $request->get_param( 'ai_context' );

		// In production, this would:
		// 1. Fetch the template content
		// 2. Process AI replacements if ai_context is provided
		// 3. Handle image replacements
		// 4. Return the processed content

		$response = array(
			'success' => true,
			'content' => '<!-- wp:kadence/rowlayout --><div class="wp-block-kadence-rowlayout">Imported template content</div><!-- /wp:kadence/rowlayout -->',
		);

		return new WP_REST_Response( $response, 200 );
	}
}