<?php
/**
 * REST API: Prebuilt_Cloud_Controller class
 *
 * @package KadenceBlocks
 */

namespace KadenceWP\KadenceBlocks\REST;

use WP_REST_Controller;
use WP_REST_Server;
use WP_REST_Response;
use WP_Error;

/**
 * Controller for prebuilt cloud library REST endpoints
 */
class Prebuilt_Cloud_Controller extends WP_REST_Controller {

	/**
	 * Constructor
	 */
	public function __construct() {
		$this->namespace = 'kadence-blocks/v1';
		$this->rest_base = 'cloud';
	}

	/**
	 * Registers the routes for the objects of the controller.
	 */
	public function register_routes() {
		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base . '/connect',
			array(
				array(
					'methods'             => WP_REST_Server::EDITABLE,
					'callback'            => array( $this, 'connect_cloud' ),
					'permission_callback' => array( $this, 'cloud_permission_check' ),
					'args'                => array(
						'key' => array(
							'required'          => true,
							'type'              => 'string',
							'sanitize_callback' => 'sanitize_text_field',
						),
					),
				),
			)
		);

		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base . '/items',
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_cloud_items' ),
					'permission_callback' => array( $this, 'cloud_permission_check' ),
				),
			)
		);

		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base . '/disconnect',
			array(
				array(
					'methods'             => WP_REST_Server::EDITABLE,
					'callback'            => array( $this, 'disconnect_cloud' ),
					'permission_callback' => array( $this, 'cloud_permission_check' ),
				),
			)
		);

		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base . '/sync',
			array(
				array(
					'methods'             => WP_REST_Server::EDITABLE,
					'callback'            => array( $this, 'sync_cloud' ),
					'permission_callback' => array( $this, 'cloud_permission_check' ),
				),
			)
		);
	}

	/**
	 * Checks if a given request has access to cloud features.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return true|WP_Error True if the request has read access, WP_Error object otherwise.
	 */
	public function cloud_permission_check( $request ) {
		return current_user_can( 'edit_posts' );
	}

	/**
	 * Connect to Kadence Cloud.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function connect_cloud( $request ) {
		$key = $request->get_param( 'key' );

		// Validate key format
		if ( ! preg_match( '/^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/', $key ) ) {
			return new WP_Error(
				'invalid_key_format',
				__( 'Invalid cloud key format', 'kadence-blocks' ),
				array( 'status' => 400 )
			);
		}

		// In production, this would validate the key with the cloud service
		// For now, we'll simulate a successful connection
		update_user_meta( get_current_user_id(), '_kadence_cloud_key', $key );

		$response = array(
			'success' => true,
			'message' => __( 'Successfully connected to Kadence Cloud', 'kadence-blocks' ),
		);

		return new WP_REST_Response( $response, 200 );
	}

	/**
	 * Get cloud items.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function get_cloud_items( $request ) {
		$cloud_key = get_user_meta( get_current_user_id(), '_kadence_cloud_key', true );

		if ( empty( $cloud_key ) ) {
			return new WP_Error(
				'not_connected',
				__( 'Not connected to Kadence Cloud', 'kadence-blocks' ),
				array( 'status' => 401 )
			);
		}

		// Mock cloud items
		$items = array(
			array(
				'id'        => 'cloud-001',
				'title'     => 'My Custom Hero Section',
				'thumbnail' => 'https://patterns.startertemplatecloud.com/wp-content/uploads/2023/cloud-001-thumb.jpg',
				'type'      => 'pattern',
				'content'   => '<!-- wp:kadence/rowlayout --><div class="wp-block-kadence-rowlayout">Cloud pattern content</div><!-- /wp:kadence/rowlayout -->',
			),
			array(
				'id'        => 'cloud-002',
				'title'     => 'Saved Landing Page',
				'thumbnail' => 'https://patterns.startertemplatecloud.com/wp-content/uploads/2023/cloud-002-thumb.jpg',
				'type'      => 'template',
				'content'   => '<!-- wp:kadence/rowlayout --><div class="wp-block-kadence-rowlayout">Cloud template content</div><!-- /wp:kadence/rowlayout -->',
			),
		);

		return rest_ensure_response( $items );
	}

	/**
	 * Disconnect from Kadence Cloud.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function disconnect_cloud( $request ) {
		delete_user_meta( get_current_user_id(), '_kadence_cloud_key' );

		$response = array(
			'success' => true,
			'message' => __( 'Disconnected from Kadence Cloud', 'kadence-blocks' ),
		);

		return new WP_REST_Response( $response, 200 );
	}

	/**
	 * Sync with Kadence Cloud.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function sync_cloud( $request ) {
		$cloud_key = get_user_meta( get_current_user_id(), '_kadence_cloud_key', true );

		if ( empty( $cloud_key ) ) {
			return new WP_Error(
				'not_connected',
				__( 'Not connected to Kadence Cloud', 'kadence-blocks' ),
				array( 'status' => 401 )
			);
		}

		// In production, this would sync with the cloud service
		$response = array(
			'success' => true,
			'message' => __( 'Cloud library synced successfully', 'kadence-blocks' ),
			'items'   => 2, // Number of items synced
		);

		return new WP_REST_Response( $response, 200 );
	}
}