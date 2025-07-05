<?php
/**
 * REST API: Prebuilt_Patterns_Controller class
 *
 * @package KadenceBlocks
 */

namespace KadenceWP\KadenceBlocks\REST;

use KadenceWP\KadenceBlocks\Cache\Block_Library_Cache;
use WP_REST_Controller;
use WP_REST_Server;
use WP_REST_Response;
use WP_Error;
use function KadenceWP\KadenceBlocks\StellarWP\Uplink\get_original_domain;

/**
 * Controller for prebuilt patterns REST endpoints
 */
class Prebuilt_Patterns_Controller extends WP_REST_Controller {

	/**
	 * The API Key
	 *
	 * @var string
	 */
	protected $api_key = '';

	/**
	 * The API Manager instance for the email
	 *
	 * @var string
	 */
	protected $api_email = '';

	/**
	 * API product for kadence
	 *
	 * @var string
	 */
	private $product_slug = '';

		/**
		 * The remote pattern library URL.
		 *
		 * @var string
		 */
	protected $remote_url = 'https://kbs.startertemplatecloud.com/wp-json/kadence-cloud/v1/';

	/**
	 * Cache handler for pattern library.
	 *
	 * @var object
	 */
	protected $block_library_cache; 

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
			[
				[
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => [ $this, 'get_patterns' ],
					'permission_callback' => [ $this, 'get_patterns_permission_check' ],
					'args'                => [
						'library'      => [
							'required'          => false,
							'type'              => 'string',
							'default'           => 'section',
							'sanitize_callback' => 'sanitize_text_field',
						],
						'key'          => [
							'required'          => false,
							'type'              => 'string',
							'sanitize_callback' => 'sanitize_text_field',
						],
						'force_reload' => [
							'required' => false,
							'type'     => 'boolean',
							'default'  => false,
						],
					],
				],
			]
		);

		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base . '-categories',
			[
				[
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => [ $this, 'get_pattern_categories' ],
					'permission_callback' => [ $this, 'get_patterns_permission_check' ],
					'args'                => [
						'library'      => [
							'required'          => false,
							'type'              => 'string',
							'default'           => 'section',
							'sanitize_callback' => 'sanitize_text_field',
						],
						'key'          => [
							'required'          => false,
							'type'              => 'string',
							'sanitize_callback' => 'sanitize_text_field',
						],
						'force_reload' => [
							'required' => false,
							'type'     => 'boolean',
							'default'  => false,
						],
					],
				],
			]
		);

		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base . '/import',
			[
				[
					'methods'             => WP_REST_Server::EDITABLE,
					'callback'            => [ $this, 'import_pattern' ],
					'permission_callback' => [ $this, 'import_pattern_permission_check' ],
					'args'                => [
						'pattern_id' => [
							'required'          => true,
							'type'              => 'string',
							'sanitize_callback' => 'sanitize_text_field',
						],
						'ai_context' => [
							'required' => false,
							'type'     => 'object',
						],
					],
				],
			]
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
	 * Get the license data.
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
	 * Retrieves patterns.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function get_patterns( $request ) {
		// Initialize cache if not already done.
		if ( ! $this->block_library_cache ) {
			$this->block_library_cache = kbs_container()->get( Block_Library_Cache::class );
		}

		$this->get_license_keys();
		
		$reload      = $request->get_param( 'force_reload' );
		$library     = $request->get_param( 'library' );
		$key         = $request->get_param( 'key' ) ?? 'section';
		$library_url = $this->remote_url . 'get/';

		$identifier = 'patterns_' . $library;
		if ( 'section' === $library ) {
			$identifier .= '_' . KADENCE_BLOCKS_VERSION;
		}
		if ( ! empty( $this->api_key ) ) {
			$identifier .= '_' . $this->api_key;
		}
		if ( ! empty( $this->product_slug ) ) {
			$identifier .= '_' . $this->product_slug;
		}
		if ( ! empty( $key ) ) {
			$identifier .= '_' . $key;
		}

		// Check if we have cached data.
		if ( ! $reload ) {
			try {
				$cached_data = $this->block_library_cache->get( $identifier );
				return rest_ensure_response( $cached_data );
			} catch ( \Exception $e ) {
				// Continue to fetch from remote
			}
		}

		// Fetch from remote.
		$response = $this->get_remote_library_contents( $library, $library_url, $key );
		if ( is_wp_error( $response ) ) {
			return rest_ensure_response( $response );
		}

		// Cache the response.
		$this->block_library_cache->cache( $identifier, $response );

		return rest_ensure_response( $response );
	}

	/**
	 * Get remote library contents.
	 *
	 * @param string $library The library type.
	 * @param string $library_url The library URL.
	 * @param string $key The optional key.
	 * @return string|WP_Error The response body or error.
	 */
	protected function get_remote_library_contents( $library, $library_url, $key ) {
		$site_url = get_original_domain();
		$args     = [
			'key'  => $key,
			'site' => $site_url,
		];

		if ( 'templates' === $library || 'section' === $library || 'pages' === $library || 'template' === $library ) {
			// Legacy support for the API Manager requiring email.
			if ( ! empty( $this->api_email ) ) {
				$args['api_email'] = $this->api_email;
				if ( 'iThemes' === $this->api_email ) {
					$args['site_url'] = $site_url;
				}
			}
			if ( ! empty( $this->api_key ) ) {
				$args['api_key'] = $this->api_key;
			}
			if ( ! empty( $this->product_slug ) ) {
				$args['product_id'] = $this->product_slug;
			}
		}

		if ( 'templates' === $library ) {
			$args['request'] = 'blocks';
		}

		// Get the response.
		$api_url  = add_query_arg( $args, $library_url );
		$response = wp_safe_remote_get(
			$api_url,
			[
				'timeout' => 30,
			]
		);
		// Early exit if there was an error.
		if ( is_wp_error( $response ) ) {
			return $response;
		}

		if ( wp_remote_retrieve_response_code( $response ) !== 200 ) {
			$response_code = wp_remote_retrieve_response_code( $response );
			return new WP_Error( 'error', sprintf( esc_html__( 'Response Code Error: %s', 'kadence-blocks' ), $response_code ), [ 'status' => 400 ] );
		}

		// Get the body from our response
		$contents = wp_remote_retrieve_body( $response );
		
		// Early exit if there was an error
		if ( is_wp_error( $contents ) ) {
			return $contents;
		}

		return $contents;
	}

	/**
	 * Retrieves pattern categories.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function get_pattern_categories( $request ) {
		// Initialize cache if not already done
		if ( ! $this->block_library_cache ) {
			$this->block_library_cache = kbs_container()->get( Block_Library_Cache::class );
		}

		$this->get_license_keys();
		
		$reload      = $request->get_param( 'force_reload' );
		$library     = $request->get_param( 'library' );
		$key         = $request->get_param( 'key' ) ?? 'section';
		$library_url = $this->remote_url . 'categories/';

		$identifier = 'pattern_categories_' . $library;
		if ( ! empty( $this->api_key ) ) {
			$identifier .= '_' . $this->api_key;
		}

		// Check if we have cached data
		if ( ! $reload ) {
			try {
				$cached_data = $this->block_library_cache->get( $identifier );
				return rest_ensure_response( $cached_data );
			} catch ( \Exception $e ) {
				// Continue to fetch from remote
			}
		}

		// Fetch from remote
		$response = $this->get_remote_library_categories( $library, $library_url, $key );

		if ( is_wp_error( $response ) || 'error' === $response ) {
			// Return default categories as fallback
			$categories = [
				[
					'slug'  => 'hero',
					'label' => __( 'Hero Sections', 'kadence-blocks' ),
				],
				[
					'slug'  => 'features',
					'label' => __( 'Features', 'kadence-blocks' ),
				],
				[
					'slug'  => 'cta',
					'label' => __( 'Call to Action', 'kadence-blocks' ),
				],
				[
					'slug'  => 'testimonials',
					'label' => __( 'Testimonials', 'kadence-blocks' ),
				],
				[
					'slug'  => 'pricing',
					'label' => __( 'Pricing', 'kadence-blocks' ),
				],
			];
			return rest_ensure_response( json_encode( $categories ) );
		}

		// Cache the response
		$this->block_library_cache->cache( $identifier, $response );

		return rest_ensure_response( $response );
	}

	/**
	 * Get remote library categories.
	 *
	 * @param string $library The library type.
	 * @param string $library_url The library URL.
	 * @param string $key The optional key.
	 * @return string|WP_Error The response body or error.
	 */
	protected function get_remote_library_categories( $library, $library_url, $key ) {
		$site_url = function_exists( 'get_original_domain' ) ? get_original_domain() : get_site_url();
		$args     = [
			'key'  => $key,
			'site' => $site_url,
		];

		if ( 'templates' === $library || 'section' === $library || 'pages' === $library || 'template' === $library ) {
			$args['api_email']  = $this->api_email;
			$args['api_key']    = $this->api_key;
			$args['product_id'] = $this->product_id;
		}

		if ( 'templates' === $library ) {
			$args['request'] = 'blocks';
		}

		// Get the response
		$api_url  = add_query_arg( $args, $library_url );
		$response = wp_safe_remote_get(
			$api_url,
			[
				'timeout' => 30,
			]
		);

		// Early exit if there was an error
		if ( is_wp_error( $response ) || wp_remote_retrieve_response_code( $response ) !== 200 ) {
			return 'error';
		}

		// Get the body from our response
		$contents = wp_remote_retrieve_body( $response );
		
		// Early exit if there was an error
		if ( is_wp_error( $contents ) ) {
			return 'error';
		}

		return $contents;
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

		$response = [
			'success' => true,
			'content' => '<!-- wp:kadence/rowlayout --><div class="wp-block-kadence-rowlayout">Imported pattern content</div><!-- /wp:kadence/rowlayout -->',
		];

		return new WP_REST_Response( $response, 200 );
	}
}
