<?php
/**
 * Global Styles REST Controller
 *
 * @package KadenceWP\KadenceBlocks\REST
 */

namespace KadenceWP\KadenceBlocks\REST;

use WP_REST_Controller;
use WP_REST_Server;
use WP_REST_Response;

/**
 * Global Styles Controller class
 */
class GlobalStylesController extends WP_REST_Controller {
    private static $slug = 'kadence_global_style';

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
        return true;
    }

    /**
     * Check if a given request has access to get items.
     *
     * @param \WP_REST_Request $request Full data about the request.
     * @return bool|\WP_Error
     */
    public function save_items_permissions_check( $request ) {
        // return current_user_can( 'edit_posts' );
        return true;
    }

    /**
     * Get a collection of global styles.
     *
     * @param \WP_REST_Request $request Full data about the request.
     * @return WP_REST_Response
     */
    public function get_items( $request ) {
        $post_contents = array();

        $all_posts = get_posts( 
            array(
                'post_type' => self::$slug,
                'numberposts' => -1,
                'post_status' => array( 'publish' )
            ) 
        );

        if( $all_posts ) {
            foreach ( $all_posts as $_post ) {
                $post_contents[] = json_decode( $_post->post_content, true );
            }
        }

        $test = json_decode( $all_posts[0]->post_content, true );

        if ( ! $post_contents ) {
            $response = array( 'success' => false, 'error' => $all_posts );
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
        $styles = array();
                
        // Path to the global styles directory
        $styles_dir = plugin_dir_path( KADENCE_BLOCKS_PATH ) . 'kadence-blocks-experiment/inc/data/global-styles-test/';
        
        // Load base.json
        $base_file = $styles_dir . 'base.json';
        if ( file_exists( $base_file ) ) {
            $base_content = json_decode( file_get_contents( $base_file ), true );
            if ( $base_content ) {
                $styles['baseID'] = $base_content;
            }
        }
        
        // Load test.json
        $test_file = $styles_dir . 'test.json';
        if ( file_exists( $test_file ) ) {
            $test_content = json_decode( file_get_contents( $test_file ), true );
            if ( $test_content ) {
                $styles['testID'] = $test_content;
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
        $post_arr = array(
            'post_type' => self::$slug,
            'post_title' => '',
            'post_content' => '',
            'post_status' => 'publish'
        );
        $result = '';

        // Path to the global styles directory
        $styles_dir = plugin_dir_path( KADENCE_BLOCKS_PATH ) . 'kadence-blocks-experiment/inc/data/global-styles-test/';

        // Load base.json
        $base_file = $styles_dir . 'base.json';
        if ( file_exists( $base_file ) ) {
            $base_content = json_encode( json_decode( file_get_contents( $base_file ), true ) );
            if ( $base_content ) {
                $post_arr['post_title'] = 'base global style';
                $post_arr['post_content'] = $base_content;
                $result = wp_insert_post( $post_arr );
            }
        }

        // Load test.json
        $test_file = $styles_dir . 'test.json';
        if ( file_exists( $test_file ) ) {
            $test_content = json_encode( json_decode( file_get_contents( $test_file ), true ) );
            if ( $test_content ) {
                $post_arr['post_title'] = 'test global style';
                $post_arr['post_content'] = $test_content;
                $result = wp_insert_post( $post_arr );
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
    public function save_items( $request ) {
		$data = $request->get_param( self::PROP_DATA );
		$title = $request->get_param( self::PROP_TITLE );
        $result = '';

        if ( $data ) {
            $post_arr = array(
                'post_type' => self::$slug,
                'post_title' => $title,
                'post_content' => $data,
                'post_status' => 'publish'
            );
    
            $result = wp_insert_post( $post_arr );
        }

        if ( ! $result || gettype( $result ) == 'WP_Error' ) {
            $response = array( 'success' => false, 'error' => $result );
        } else {
            $response = array( 'success' => true, 'id' => $result );
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
            array(
                'post_type' => self::$slug,
                'numberposts' => -1,
                'post_status' => array( 'draft', 'publish' )
            ) 
        );

        foreach ( $all_posts as $_post ) {
            $result = wp_delete_post( $_post->ID, true );
        }

        if ( ! $result ) {
            $response = array( 'success' => false, 'error' => $all_posts );
        } else {
            $response = array( 'success' => true, 'id' => $result );
        }

        return new WP_REST_Response( $response, 200 );
    }

	/**
	 * Retrieves the query params for the search results collection.
	 *
	 * @return array Collection parameters.
	 */
	public function get_collection_params() {
		$query_params  = parent::get_collection_params();

		$query_params[ self::PROP_DATA ] = array(
			'description' => __( 'Data to be save as a global style.', 'kadence-blocks' ),
			'type'        => 'string',
		);

		$query_params[ self::PROP_TITLE ] = array(
			'description' => __( 'Title to be save as a global style.', 'kadence-blocks' ),
			'type'        => 'string',
		);

		return $query_params;
	}
} 