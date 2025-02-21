<?php
/**
 * Fonts REST API Controller
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
 * Fonts REST API Controller class
 */
class FontsController extends WP_REST_Controller {

	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->namespace = 'kb-fonts/v1';
		$this->rest_base = 'fonts';
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
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_fonts' ),
					'permission_callback' => '__return_true',
				),
			)
		);
	}

	/**
	 * Get a collection of fonts.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function get_fonts( $request ) {
		$all_fonts = array(
			'google' => kbs_get_google_fonts(),
			'theme_json'  => $this->get_theme_json_fonts(),
			'kadence_custom' => apply_filters( 'kadence_blocks_custom_fonts', array() ),
		);

		return rest_ensure_response( $all_fonts );
	}

	private function get_theme_json_fonts() {
		if ( !wp_is_block_theme() || ! class_exists( '\WP_Font_Face_Resolver' ) ) {
			return array();
		}

		$theme_fonts = \WP_Font_Face_Resolver::get_fonts_from_theme_json();
		$formatted_fonts = array();
		if ( !empty( $theme_fonts ) ) {
			foreach ( $theme_fonts as $font_group ) {
				foreach ( $font_group as $font ) {
					if( isset( $font['font-family'] ) ) {
						// Initialize font family if it doesn't exist
						if ( ! isset( $formatted_fonts[ $font['font-family'] ] ) ) {
							$formatted_fonts[ $font['font-family'] ] = array(
								'family' => $font['font-family'],
								'styles' => array(),
								'is_variable' => false,
							);
						}

						// Initialize font style as array if it doesn't exist
						if ( ! isset( $formatted_fonts[ $font['font-family'] ]['styles'][ $font['font-style'] ] ) ) {
							$formatted_fonts[ $font['font-family'] ]['styles'][ $font['font-style'] ] = array();
						}

						// Add weight to the style array if not already present
						if ( ! in_array( $font['font-weight'], (array) $formatted_fonts[ $font['font-family'] ]['styles'][ $font['font-style'] ] ) ) {
							$formatted_fonts[ $font['font-family'] ]['styles'][ $font['font-style'] ][] = $font['font-weight'];

							// Check if the font is a variable font
							if( isset( $font['src'][0] ) && strpos( $font['src'][0], 'VariableFont' ) !== false) {
								$formatted_fonts[ $font['font-family'] ]['is_variable'] = true;
							}
						}
					}
				}
			}
		}

		return $formatted_fonts;
	}
}