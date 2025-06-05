<?php
/**
 * REST API for Kadence AI.
 */

namespace KadenceWP\KadenceBlocks\REST;

use function KadenceWP\KadenceBlocks\StellarWP\Uplink\get_license_domain;
use WP_REST_Controller;
use WP_REST_Server;
use WP_REST_Response;
use WP_REST_Request;

/**
 * REST API AI.
 */
class Ai_Admin_Controller extends WP_REST_Controller {
	/**
	 * Base URL.
	 *
	 * @access protected
	 * @var string
	 */
	protected $namespace;

	/**
	 * Base URL.
	 *
	 * @access protected
	 * @var string
	 */
	protected $rest_base;

	/**
	 * API key for kadence
	 *
	 * @var null
	 */
	private $api_key = '';

	/**
	 * API email for kadence
	 *
	 * @var string
	 */
	private $api_email = '';

	/**
	 * API product for kadence
	 *
	 * @var string
	 */
	private $product_slug = '';

	/**
	 * The remote URL.
	 *
	 * @access protected
	 * @var string
	 */
	protected $remote_credits_url = 'https://content.startertemplatecloud.com/wp-json/kadence-credits/v1/';

	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->namespace           = 'kbs-ai-admin/v1';
		$this->rest_base           = 'get';
	}

	/**
	 * Registers the routes for the objects of the controller.
	 *
	 * @see register_rest_route()
	 */
	public function register_routes() {
		register_rest_route(
			$this->namespace,
			'/get_remaining_credits',
			[
				[
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => [ $this, 'get_remaining_credits' ],
					'permission_callback' => [ $this, 'get_items_permission_check' ],
					'args'                => $this->get_collection_params(),
				],
			]
		);
	}
	/**
	 * Checks if a given request has access to search content.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return true|WP_Error True if the request has search access, WP_Error object otherwise.
	 */
	public function get_items_permission_check( $request ) {
		return current_user_can( 'edit_posts' );
	}


	/**
	 * Retrieves remaining credits.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function get_remaining_credits( WP_REST_Request $request ) {
		$this->get_license_keys();
		// Check if we have a remote file.
		$response = $this->get_remote_remaining_credits();

		if ( $response === 'error' ) {
			return rest_ensure_response( 'error' );
		}

		return rest_ensure_response( $response );
	}
	/**
	 * Get the license data for submitting Ai calls.
	 */
	public function get_license_keys() {
		$data = kbs_get_current_license_data();
		if ( ! empty( $data['key'] ) ) {
			$this->api_key = $data['key'];
		}
		if ( ! empty( $data['email'] ) ) {
			$this->api_email = $data['email'];
		}
		if ( ! empty( $data['product'] ) ) {
			$this->product_slug = $data['product'];
		}
	}

	/**
	 * Get remote file contents.
	 *
	 * @access public
	 * @return string Returns the remote URL contents.
	 */
	public function get_remote_remaining_credits() {
		$product_slug = ( ! empty( $this->product_slug ) && $this->product_slug === 'kadence-blocks-pro' ? 'kadence-blocks-pro' : 'kadence-blocks' );
		$args = [
			'site'        => get_license_domain(),
			'key'         => $this->api_key,
			'plugin_slug' => apply_filters( 'kadence-blocks-auth-slug', $product_slug ),
		];
		if ( ! empty( $this->api_email ) ) {
			// Send in case we need to verify with old api.
			$args['email'] = $this->api_email;
		}
		$api_url  = add_query_arg( $args, $this->remote_credits_url . 'get-remaining' );
		$response = wp_safe_remote_get(
			$api_url,
			[
				'timeout' => 20,
			]
		);
		// Early exit if there was an error.
		if ( is_wp_error( $response ) || $this->is_response_code_error( $response ) ) {
			return 'error';
		}

		// Get the CSS from our response.
		$contents = wp_remote_retrieve_body( $response );
		// Early exit if there was an error.
		if ( is_wp_error( $contents ) ) {
			return 'error';
		}

		return $contents;
	}

	/**
	 * Retrieves the query params for the search results collection.
	 *
	 * @return array Collection parameters.
	 */
	public function get_collection_params() {
		$query_params = parent::get_collection_params();
		return $query_params;
	}

	/**
	 * Check if a response code is an error.
	 *
	 * @param array $response
	 *
	 * @return bool
	 */
	public function is_response_code_error( $response ) {
		$response_code = (int) wp_remote_retrieve_response_code( $response );

		return $response_code >= 400;
	}
}
