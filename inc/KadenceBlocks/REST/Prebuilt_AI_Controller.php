<?php
/**
 * REST API: Prebuilt_AI_Controller class
 *
 * @package KadenceBlocks
 */

namespace KadenceWP\KadenceBlocks\REST;

use WP_REST_Controller;
use WP_REST_Server;
use WP_REST_Response;
use WP_Error;

/**
 * Controller for prebuilt library AI features REST endpoints
 */
class Prebuilt_AI_Controller extends WP_REST_Controller {

	/**
	 * Constructor
	 */
	public function __construct() {
		$this->namespace = 'kadence-blocks/v1';
		$this->rest_base = 'ai';
	}

	/**
	 * Registers the routes for the objects of the controller.
	 */
	public function register_routes() {
		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base . '/generate-content',
			array(
				array(
					'methods'             => WP_REST_Server::EDITABLE,
					'callback'            => array( $this, 'generate_content' ),
					'permission_callback' => array( $this, 'ai_permission_check' ),
					'args'                => array(
						'context' => array(
							'required' => true,
							'type'     => 'object',
							'properties' => array(
								'businessName'        => array( 'type' => 'string' ),
								'businessType'        => array( 'type' => 'string' ),
								'businessDescription' => array( 'type' => 'string' ),
								'keywords'            => array( 'type' => 'string' ),
								'location'            => array( 'type' => 'string' ),
								'tone'                => array( 'type' => 'string' ),
							),
						),
						'content_type' => array(
							'required' => true,
							'type'     => 'string',
							'enum'     => array( 'value-prop', 'about', 'testimonial', 'feature', 'cta' ),
						),
						'pattern_id' => array(
							'required' => false,
							'type'     => 'string',
						),
					),
				),
			)
		);

		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base . '/credits',
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_credits' ),
					'permission_callback' => array( $this, 'ai_permission_check' ),
				),
			)
		);

		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base . '/image-collections',
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_image_collections' ),
					'permission_callback' => array( $this, 'ai_permission_check' ),
				),
			)
		);
	}

	/**
	 * Checks if a given request has access to AI features.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return true|WP_Error True if the request has read access, WP_Error object otherwise.
	 */
	public function ai_permission_check( $request ) {
		return current_user_can( 'edit_posts' );
	}

	/**
	 * Generate AI content.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function generate_content( $request ) {
		$context      = $request->get_param( 'context' );
		$content_type = $request->get_param( 'content_type' );
		$pattern_id   = $request->get_param( 'pattern_id' );

		// Check credits
		$credits = get_user_meta( get_current_user_id(), '_kadence_ai_credits', true );
		if ( empty( $credits ) || $credits < 1 ) {
			return new WP_Error(
				'insufficient_credits',
				__( 'Insufficient AI credits', 'kadence-blocks' ),
				array( 'status' => 402 )
			);
		}

		// Generate content based on type
		$generated_content = $this->generate_content_by_type( $content_type, $context );

		// Deduct credit
		update_user_meta( get_current_user_id(), '_kadence_ai_credits', $credits - 1 );

		$response = array(
			'success' => true,
			'content' => $generated_content,
			'credits_remaining' => $credits - 1,
		);

		return new WP_REST_Response( $response, 200 );
	}

	/**
	 * Get AI credits.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function get_credits( $request ) {
		$credits = get_user_meta( get_current_user_id(), '_kadence_ai_credits', true );
		
		// Default to 10 credits for new users
		if ( empty( $credits ) ) {
			$credits = 10;
			update_user_meta( get_current_user_id(), '_kadence_ai_credits', $credits );
		}

		$response = array(
			'credits' => intval( $credits ),
		);

		return rest_ensure_response( $response );
	}

	/**
	 * Get available image collections.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function get_image_collections( $request ) {
		$collections = array(
			array(
				'id'          => 'business',
				'name'        => __( 'Business & Corporate', 'kadence-blocks' ),
				'description' => __( 'Professional images for business websites', 'kadence-blocks' ),
				'thumbnail'   => 'https://patterns.startertemplatecloud.com/images/business-thumb.jpg',
			),
			array(
				'id'          => 'medical',
				'name'        => __( 'Medical & Healthcare', 'kadence-blocks' ),
				'description' => __( 'Healthcare and medical themed images', 'kadence-blocks' ),
				'thumbnail'   => 'https://patterns.startertemplatecloud.com/images/medical-thumb.jpg',
			),
			array(
				'id'          => 'food',
				'name'        => __( 'Food & Restaurant', 'kadence-blocks' ),
				'description' => __( 'Food and restaurant imagery', 'kadence-blocks' ),
				'thumbnail'   => 'https://patterns.startertemplatecloud.com/images/food-thumb.jpg',
			),
			array(
				'id'          => 'fitness',
				'name'        => __( 'Fitness & Wellness', 'kadence-blocks' ),
				'description' => __( 'Fitness and wellness related images', 'kadence-blocks' ),
				'thumbnail'   => 'https://patterns.startertemplatecloud.com/images/fitness-thumb.jpg',
			),
		);

		return rest_ensure_response( $collections );
	}

	/**
	 * Generate content by type.
	 *
	 * @param string $type Content type.
	 * @param array  $context Business context.
	 * @return array Generated content.
	 */
	private function generate_content_by_type( $type, $context ) {
		// In production, this would call the actual AI service
		// For now, return mock content based on type
		
		$business_name = ! empty( $context['businessName'] ) ? $context['businessName'] : 'Your Business';
		$business_type = ! empty( $context['businessType'] ) ? $context['businessType'] : 'company';

		switch ( $type ) {
			case 'value-prop':
				return array(
					'headline' => sprintf( 'Welcome to %s', $business_name ),
					'subheadline' => sprintf( 'The leading %s dedicated to your success', $business_type ),
					'description' => 'We provide exceptional services tailored to meet your unique needs and exceed your expectations.',
				);

			case 'about':
				return array(
					'headline' => sprintf( 'About %s', $business_name ),
					'content' => sprintf( 'As a trusted %s, we have been serving our community with dedication and excellence. Our commitment to quality and customer satisfaction sets us apart.', $business_type ),
				);

			case 'testimonial':
				return array(
					'quote' => sprintf( 'Working with %s has been an incredible experience. Their professionalism and attention to detail are unmatched.', $business_name ),
					'author' => 'Jane Smith',
					'role' => 'Satisfied Customer',
				);

			case 'feature':
				return array(
					'title' => 'Our Key Features',
					'features' => array(
						array(
							'title' => 'Professional Service',
							'description' => 'Expert team dedicated to delivering exceptional results',
						),
						array(
							'title' => 'Customer Focus',
							'description' => 'Your satisfaction is our top priority',
						),
						array(
							'title' => 'Innovation',
							'description' => 'Cutting-edge solutions for modern challenges',
						),
					),
				);

			case 'cta':
				return array(
					'headline' => 'Ready to Get Started?',
					'description' => sprintf( 'Contact %s today and discover how we can help you achieve your goals.', $business_name ),
					'button_text' => 'Get Started Now',
				);

			default:
				return array();
		}
	}
}