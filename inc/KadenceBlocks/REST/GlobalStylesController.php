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
     * Get a collection of global styles.
     *
     * @param \WP_REST_Request $request Full data about the request.
     * @return WP_REST_Response
     */
    public function get_items( $request ) {
        $styles = [];
                
        // Path to the global styles directory
        $styles_dir = plugin_dir_path( KADENCE_BLOCKS_PATH ) . 'kadence-blocks/inc/data/global-styles-test/';
        
        // Load base.json
        $base_file = $styles_dir . 'base.json';
        if ( file_exists( $base_file ) ) {
            $base_content = json_decode( file_get_contents( $base_file ), true );
            if ( $base_content ) {
                $styles[] = $base_content;
            }
        }
        
        // Load test.json
        $test_file = $styles_dir . 'test.json';
        if ( file_exists( $test_file ) ) {
            $test_content = json_decode( file_get_contents( $test_file ), true );
            if ( $test_content ) {
                $styles[] = $test_content;
            }
        }

        return new WP_REST_Response( $styles, 200 );
    }
} 