<?php
/**
 * Class responsible for sending events AI Events to Stellar Prophecy WP AI.
 * 
 * @package KadenceWP\KadenceBlocks\Telemetry
 */

namespace KadenceWP\KadenceBlocks\Telemetry;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

use WP_REST_Request;
use WP_REST_Response;
use WP_REST_Server;
use function KadenceWP\KadenceBlocks\StellarWP\Uplink\get_authorization_token;
use function KadenceWP\KadenceBlocks\StellarWP\Uplink\get_license_domain;
use function KadenceWP\KadenceBlocks\StellarWP\Uplink\get_original_domain;
use function KadenceWP\KadenceBlocks\StellarWP\Uplink\is_authorized;

/**
 * Class responsible for sending events AI Events to Stellar Prophecy WP AI.
 */
class AI_Events {

	/**
	 * The label property key for the event request.
	 */
	public const PROP_EVENT_LABEL = 'event_label';

	/**
	 * The data property key for the event request.
	 */
	public const PROP_EVENT_DATA = 'event_data';

	/**
	 * The event endpoint.
	 */
	public const ENDPOINT = '/wp-json/prophecy/v1/analytics/event';

	/**
	 * The API domain.
	 */
	public const DOMAIN = 'https://content.startertemplatecloud.com';

	/**
	 * Registers all necessary hooks.
	 *
	 * @action plugins_loaded
	 *
	 * @return void
	 */
	public function register(): void {
		add_action( 'kadenceblocks/ai/event', [ $this, 'handle_event' ], 10, 2 );
		add_action( 'rest_api_init', [ $this, 'register_route' ], 10, 0 );
	}

	/**
	 * Registers the analytics/event endpoint in the REST API.
	 *
	 * @action rest_api_init
	 *
	 * @return void
	 */
	public function register_route(): void {
		register_rest_route(
			'kb-design-library/v1',
			'/handle_event',
			[
				[
					'methods'             => WP_REST_Server::CREATABLE,
					'callback'            => [ $this, 'handle_event_endpoint' ],
					'permission_callback' => [ $this, 'verify_user_can_edit' ],
					'args'                => [
						self::PROP_EVENT_LABEL => [
							'description'       => __( 'The Event Label', 'kadence-blocks' ),
							'type'              => 'string',
							'sanitize_callback' => 'sanitize_text_field',
						],
						self::PROP_EVENT_DATA  => [
							'description' => __( 'The Event Data', 'kadence-blocks' ),
							'type'        => 'object',
						],
					],
				],
			]
		);
	}

	/**
	 * Checks if the current user has access to edit posts.
	 *
	 * @return bool
	 */
	public function verify_user_can_edit(): bool {
		return current_user_can( 'edit_posts' );
	}

	/**
	 * Sends events to Prophecy WP (if the user has opted in through AI auth).
	 *
	 * @action kadenceblocks/ai/event
	 *
	 * @return void
	 */
	public function handle_event( string $name, array $context ): void {
		// Only pass tracking events if AI has been activated through Opt in.
		$token         = get_authorization_token( 'kadence-blocks' );
		$license_key   = kadence_blocks_get_current_license_key();
		$is_authorized = false;
		if ( ! empty( $license_key ) ) {
			$is_authorized = is_authorized( $license_key, 'kadence-blocks', ( ! empty( $token ) ? $token : '' ), get_license_domain() );
		}
		if ( ! $is_authorized ) {
			return;
		}

		/**
		 * Filters the URL used to send events to.
		 *
		 * @param string The URL to use when sending events.
		 */
		$url = apply_filters( 'kadenceblocks/ai/event_url', self::DOMAIN . self::ENDPOINT );

		wp_remote_post(
			$url,
			[
				'timeout'  => 20,
				'blocking' => false,
				'headers'  => [
					'X-Prophecy-Token' => $this->get_prophecy_token_header(),
					'Content-Type'     => 'application/json',
				],
				'body'     => wp_json_encode(
					[
						'name'    => $name,
						'context' => $context,
					] 
				),
			]
		);
	}

	/**
	 * Constructs a consistent X-Prophecy-Token header.
	 *
	 * @param array $args An array of arguments to include in the encoded header.
	 *
	 * @return string The base64 encoded string.
	 */
	public static function get_prophecy_token_header( $args = [] ) {
		$site_url     = get_original_domain();
		$site_name    = get_bloginfo( 'name' );
		$license_data = kadence_blocks_get_current_license_data();
		$product_slug = ( ! empty( $license_data['product'] ) ? $license_data['product'] : 'kadence-blocks' );
		$defaults     = [
			'domain'          => $site_url,
			'key'             => ! empty( $license_data['key'] ) ? $license_data['key'] : '',
			'site_name'       => sanitize_title( $site_name ),
			'product_slug'    => apply_filters( 'kadence-blocks-auth-slug', $product_slug ),
			'product_version' => KADENCE_BLOCKS_VERSION,
		];
		if ( ! empty( $license_data['env'] ) ) {
			$defaults['env'] = $license_data['env'];
		}
		$parsed_args = wp_parse_args( $args, $defaults );

		return base64_encode( json_encode( $parsed_args ) );
	}

	/**
	 * Configures various event requests to the /analytics/event endpoint
	 * and sends them to ProphecyWP.
	 *
	 * @param WP_REST_Request $request The request to the endpoint.
	 */
	public function handle_event_endpoint( WP_REST_Request $request ): WP_REST_Response {
		$event_label = $request->get_param( self::PROP_EVENT_LABEL );
		$event_data  = $request->get_param( self::PROP_EVENT_DATA );

		$event   = '';
		$context = [];

		switch ( $event_label ) {
			case 'ai_wizard_started':
				$event   = 'kadence_blocks_ai_wizard_started';
				$context = [
					'item' => 'library',
				];
				if ( ! empty( $event_data['item'] ) ) {
					$context['item'] = $event_data['item'];
				}
				break;
			case 'ai_wizard_canceled':
				$event   = 'kadence_blocks_ai_wizard_canceled';
				$context = [];
				break;
			case 'ai_wizard_completed':
				$event   = 'kadence_blocks_ai_wizard_completed';
				$context = [];
				break;
			case 'ai_wizard_prompt_submitted':
				$event   = 'kadence_blocks_ai_wizard_prompt_submitted';
				$context = [
					'item' => 'library',
				];
				if ( ! empty( $event_data['item'] ) ) {
					$context['item'] = $event_data['item'];
				}
				break;
			case 'ai_wizard_result_imported':
				$event   = 'kadence_blocks_ai_wizard_result_imported';
				$context = [
					'item'   => 'library',
					'result' => 'unknown',
				];
				if ( ! empty( $event_data['item'] ) ) {
					$context['item'] = $event_data['item'];
				}
				if ( ! empty( $event_data['pattern_slug'] ) ) {
					$context['result'] = $event_data['pattern_slug'];
				}
				break;
			case 'ai_wizard_regenerate':
				$event   = 'kadence_blocks_ai_wizard_regenerate';
				$context = [
					'item' => 'library',
				];
				if ( ! empty( $event_data['item'] ) ) {
					$context['item'] = $event_data['item'];
				}
				break;
			case 'pattern_library_opened':
				$event   = 'kadence_blocks_pattern_library_opened';
				$context = [];
				break;
			case 'pattern_library_imported':
				$event   = 'kadence_blocks_pattern_library_imported';
				$context = [
					'pattern' => 'unknown',
				];
				if ( ! empty( $event_data['slug'] ) ) {
					$context['pattern'] = $event_data['slug'];
				}
				break;
			case 'section_library_imported':
				$event   = 'kadence_blocks_section_library_imported';
				$context = [
					'section' => 'unknown',
				];
				if ( ! empty( $event_data['slug'] ) ) {
					$context['section'] = $event_data['slug'];
				}
				break;
			case 'ai_inline_assist_opened':
				$event   = 'kadence_blocks_ai_inline_assist_opened';
				$context = [];
				break;
			case 'ai_inline_assist_transform_submitted':
				$event   = 'kadence_blocks_ai_inline_assist_transform_submitted';
				$context = [];
				break;
			case 'ai_inline_assist_transform_accepted':
				$event   = 'kadence_blocks_ai_inline_assist_transform_accepted';
				$context = [];
				break;
			case 'ai_inline_assist_write_submitted':
				$event   = 'kadence_blocks_ai_inline_assist_write_submitted';
				$context = [];
				break;
			case 'ai_inline_assist_write_accepted':
				$event   = 'kadence_blocks_ai_inline_assist_write_accepted';
				$context = [];
				break;
			case 'ai_image_replacement_opened':
				$event   = 'kadence_blocks_ai_image_replacement_opened';
				$context = [];
				break;
			case 'ai_image_replacement_submitted':
				$event   = 'kadence_blocks_ai_image_replacement_submitted';
				$context = [];
				break;
			case 'ai_image_replacement_accepted':
				$event   = 'kadence_blocks_ai_image_replacement_accepted';
				$context = [];
				break;
		}

		if ( empty( $event ) ) {
			return new WP_REST_Response( [], 200 );
		}

		// Fire the action to send telemetry.
		do_action( 'kadenceblocks/ai/event', $event, $context );

		return new WP_REST_Response( [], 200 );
	}
}