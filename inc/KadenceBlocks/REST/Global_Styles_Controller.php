<?php
/**
 * Global Styles REST Controller
 *
 * @package KadenceWP\KadenceBlocks\REST
 */

namespace KadenceWP\KadenceBlocks\REST;

use KadenceWP\KadenceBlocks\Settings\Global_Style;
use WP_REST_Controller;
use WP_REST_Server;
use WP_REST_Response;

/**
 * Global Styles Controller class
 */
class Global_Styles_Controller extends WP_REST_Controller {
	private static $slug               = 'kadence_global_style';
	private static $meta_style_id_slug = 'kadence_global_style_id';

	/**
	 * Include property name.
	 */
	const PROP_DATA = 'data';

	/**
	 * Include property name.
	 */
	const PROP_TITLE = 'title';
	
	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->namespace = 'kadence-blocks/v1';
		$this->rest_base = 'global-styles';
	}

	/**
	 * Register the routes for the objects of the controller.
	 */
	public function register_routes() {
		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base,
			[
				[
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => [ $this, 'get_items' ],
					'permission_callback' => [ $this, 'get_items_permissions_check' ],
				],
			]
		);
		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base . '/get-demo',
			[
				[
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => [ $this, 'get_demo_items' ],
					'permission_callback' => [ $this, 'get_items_permissions_check' ],
				],
			]
		);
		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base . '/save',
			[
				[
					'methods'             => WP_REST_Server::EDITABLE,
					'callback'            => [ $this, 'save_items' ],
					'permission_callback' => [ $this, 'save_items_permissions_check' ],
					'args'                => $this->get_collection_params(),
				],
			]
		);
		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base . '/save-single',
			[
				[
					'methods'             => WP_REST_Server::EDITABLE,
					'callback'            => [ $this, 'save_single_item' ],
					'permission_callback' => [ $this, 'save_items_permissions_check' ],
					'args'                => $this->get_collection_params(),
				],
			]
		);
		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base . '/save-demo',
			[
				[
					'methods'             => WP_REST_Server::EDITABLE,
					'callback'            => [ $this, 'save_demo_items' ],
					'permission_callback' => [ $this, 'save_items_permissions_check' ],
				],
			]
		);
		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base . '/clear',
			[
				[
					'methods'             => WP_REST_Server::EDITABLE,
					'callback'            => [ $this, 'clear_items' ],
					'permission_callback' => [ $this, 'save_items_permissions_check' ],
				],
			]
		);
	}

	/**
	 * Check if a given request has access to get items.
	 *
	 * @param \WP_REST_Request $request Full data about the request.
	 * @return bool|\WP_Error
	 */
	public function get_items_permissions_check( $request ) {
		return current_user_can( 'edit_posts' );
	}

	/**
	 * Check if a given request has access to get items.
	 *
	 * @param \WP_REST_Request $request Full data about the request.
	 * @return bool|\WP_Error
	 */
	public function save_items_permissions_check( $request ) {
		return current_user_can( 'manage_options' );
	}

	/**
	 * Get a collection of global styles.
	 *
	 * @param \WP_REST_Request $request Full data about the request.
	 * @return WP_REST_Response
	 */
	public function get_items( $request ) {
		$post_contents = Global_Style::get_global_styles();

		if ( ! $post_contents ) {
			$response = [
				'success' => false,
				'error'   => $all_posts,
			];
		} else {
			$response = $post_contents;
		}

		return new WP_REST_Response( $response, 200 );
	}

	/**
	 * Get a collection of demo global styles.
	 *
	 * @param \WP_REST_Request $request Full data about the request.
	 * @return WP_REST_Response
	 */
	public function get_demo_items( $request ) {
		$styles = [];
				
		// Path to the global styles directory
		$styles_dir = plugin_dir_path( __FILE__ ) . '../../data/global-styles-test/';
		
		// Load base.json
		$base_file = $styles_dir . 'base.json';
		if ( file_exists( $base_file ) ) {
			$base_content = json_decode( file_get_contents( $base_file ), true );
			if ( $base_content ) {
				$styles['kbs-base'] = $base_content;
			}
		}
		
		// Load test.json
		$test_file = $styles_dir . 'test.json';
		if ( file_exists( $test_file ) ) {
			$test_content = json_decode( file_get_contents( $test_file ), true );
			if ( $test_content ) {
				$styles['testId'] = $test_content;
			}
		}

		return new WP_REST_Response( $styles, 200 );
	}

	/**
	 * Saves a collection of demo global styles.
	 *
	 * @param \WP_REST_Request $request Full data about the request.
	 * @return WP_REST_Response
	 */
	public function save_demo_items( $request ) {
		$post_arr = [
			'post_type'    => self::$slug,
			'post_title'   => '',
			'post_content' => '',
			'post_status'  => 'publish',
		];
		$result   = '';

		// Path to the global styles directory
		$styles_dir = plugin_dir_path( KADENCE_BLOCKS_PATH ) . 'kadence-blocks-experiment/inc/data/global-styles-test/';

		// Load base.json
		$base_file = $styles_dir . 'base.json';
		if ( file_exists( $base_file ) ) {
			$base_content = json_encode( json_decode( file_get_contents( $base_file ), true ) );
			if ( $base_content ) {
				$post_arr['post_title']   = 'base global style';
				$post_arr['post_content'] = $base_content;
				$result                   = wp_insert_post( $post_arr );
			}
		}

		// Load test.json
		$test_file = $styles_dir . 'test.json';
		if ( file_exists( $test_file ) ) {
			$test_content = json_encode( json_decode( file_get_contents( $test_file ), true ) );
			if ( $test_content ) {
				$post_arr['post_title']   = 'test global style';
				$post_arr['post_content'] = $test_content;
				$result                   = wp_insert_post( $post_arr );
			}
		}

		return new WP_REST_Response( $result, 200 );
	}
	/**
	 * Saves a collection of global styles.
	 *
	 * @param \WP_REST_Request $request Full data about the request.
	 * @return WP_REST_Response
	 */
	public function save_single_item( $request ) {
		$parameters = $request->get_json_params();
		$data       = ( isset( $parameters['data'] ) && is_array( $parameters['data'] ) ? $parameters['data'] : [] );
		if ( empty( $data ) ) {
			return new WP_REST_Response(
				[
					'success' => false,
					'error'   => 'No data provided',
				],
				400 
			);
		}
		$result                 = '';
		$style_id               = $data['styleId'] ?? '';
		$sanitized_global_style = $this->sanitize_global_style( $data );
		if ( $style_id == 'kbs-base' || $style_id == 'kbs-dark' || $style_id == 'kbs-accent' ) {
			$core_style = str_replace( 'kbs-', '', $style_id );
			if ( $core_style == 'base' ) {
				$sanitized_global_style = Global_Style::save_base_palette( $sanitized_global_style );
			}
			$result = Global_Style::save_options( wp_json_encode( $sanitized_global_style ), $core_style );
		} else {
			$post_arr = [
				'ID'           => ! empty( $sanitized_global_style['postId'] ) ? $sanitized_global_style['postId'] : 0,
				'post_type'    => self::$slug,
				'post_title'   => ! empty( $sanitized_global_style['name'] ) ? $sanitized_global_style['name'] : __( 'Global Style', 'kadence-blocks' ),
				'post_content' => wp_json_encode( $sanitized_global_style ),                    
				'post_status'  => 'publish',
				'meta_input'   => [
					self::$meta_style_id_slug => $style_id,
				],
			];
			$result   = wp_insert_post( $post_arr );

			// set the postId if it's not already set
			if ( $result && gettype( $result ) != 'WP_Error' && ! isset( $sanitized_global_style['postId'] ) ) {
				$sanitized_global_style['postId'] = $result;
			}
		}
		if ( ! $result || gettype( $result ) == 'WP_Error' ) {
			$response = [
				'success' => false,
				'error'   => $result,
			];
		} else {
			$response = [
				'success' => true,
				'data'    => $sanitized_global_style,
			];
		}

		return new WP_REST_Response( $response, 200 );
	}
	/**
	 * Sanitizes a global style.
	 *
	 * @param array $global_style The global style to sanitize.
	 * @return array The sanitized global style.
	 */
	public function sanitize_global_style( $global_style ) {
		$sanitized_global_style = [];
		foreach ( $global_style as $key => $value ) {
			if ( is_array( $value ) ) {
				// If the type is locked, remove all the other keys except value
				if ( isset( $value['locked'] ) && $value['locked'] ) {
					foreach ( $value as $sub_key => $sub_value ) {
						if ( 'value' !== $sub_key && 'attributes' !== $sub_key ) {
							unset( $value[ $sub_key ] );
						}
					}
				}
				$sanitized_global_style[ $key ] = $this->sanitize_global_style( $value );
			} else {
				$sanitized_global_style[ $key ] = sanitize_text_field( $value );
			}
		}
		return $sanitized_global_style;
	}
	/**
	 * Saves a collection of global styles.
	 *
	 * @param \WP_REST_Request $request Full data about the request.
	 * @return WP_REST_Response
	 */
	public function save_items( $request ) {
		$data = $request->get_param( self::PROP_DATA );
		// $title = $request->get_param( self::PROP_TITLE );
		$result = '';

		if ( $data && gettype( $data ) == 'array' ) {
			foreach ( $data as $style_id => $global_style ) {
				$sanitized_global_style = $this->sanitize_global_style( $global_style );
				if ( $style_id == 'kbs-base' || $style_id == 'kbs-dark' || $style_id == 'kbs-accent' ) {
					$core_style   = str_replace( 'kbs-', '', $style_id );
					$global_style = Global_Style::save_options( wp_json_encode( $sanitized_global_style ), $core_style );
				} else {
					$post_arr = [
						'ID'           => $sanitized_global_style['postId'] ?? 0,
						'post_type'    => self::$slug,
						'post_title'   => $sanitized_global_style['name'] ?? __( 'Global Style', 'kadence-blocks' ),
						'post_content' => wp_json_encode( $sanitized_global_style ),                    
						'post_status'  => 'publish',
						'meta_input'   => [
							self::$meta_style_id_slug => $style_id,
						],
					];
					$result   = wp_insert_post( $post_arr );

					// set the postId if it's not already set
					if ( $result && gettype( $result ) != 'WP_Error' && ! isset( $sanitized_global_style['postId'] ) ) {
						$sanitized_global_style['postId'] = $result;
					}
				}
			}
		}

		if ( ! $result || gettype( $result ) == 'WP_Error' ) {
			$response = [
				'success' => false,
				'error'   => $result,
			];
		} else {
			$response = [
				'success' => true,
				'data'    => $sanitized_global_style,
			];
		}

		return new WP_REST_Response( $response, 200 );
	}

	/**
	 * Clears all global styles posts
	 *
	 * @param \WP_REST_Request $request Full data about the request.
	 * @return WP_REST_Response
	 */
	public function clear_items( $request ) {
		$result = '';

		$all_posts = get_posts( 
			[
				'post_type'   => self::$slug,
				'numberposts' => -1,
				'post_status' => [ 'draft', 'publish' ],
			] 
		);

		foreach ( $all_posts as $_post ) {
			$result = wp_delete_post( $_post->ID, true );
		}

		if ( ! $result ) {
			$response = [
				'success' => false,
				'error'   => $all_posts,
			];
		} else {
			$response = [
				'success' => true,
				'id'      => $result,
			];
		}

		return new WP_REST_Response( $response, 200 );
	}

	/**
	 * Retrieves the query params for the search results collection.
	 *
	 * @return array Collection parameters.
	 */
	public function get_collection_params() {
		$query_params = parent::get_collection_params();

		$query_params[ self::PROP_DATA ] = [
			'description' => __( 'Data to be save as a global style.', 'kadence-blocks' ),
			'type'        => 'object',
		];

		$query_params[ self::PROP_TITLE ] = [
			'description' => __( 'Title to be save as a global style.', 'kadence-blocks' ),
			'type'        => 'string',
		];

		return $query_params;
	}
}
