<?php
/**
 * Handles all functionality related to the A/B Testing Block
 *
 * @since 0.1.1
 *
 * @package KadenceWP\KadenceBlocks
 */

declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Blocks;

use KadenceWP\KadenceBlocks\Settings\Global_Style;
use function KadenceWP\KadenceBlocks\StellarWP\Uplink\is_authorized;
use function KadenceWP\KadenceBlocks\StellarWP\Uplink\get_license_domain;
use function KadenceWP\KadenceBlocks\StellarWP\Uplink\get_authorization_token;
use function kbs_is_ai_disabled;
use function kbs_get_asset_file;
/**
 * Handles all functionality related to the A/B Testing Block.
 *
 * @since 0.1.1
 *
 * @package KadenceWP\KadenceBlocks
 */
class Editor_Assets {
	/**
	 * Google fonts array.
	 *
	 * @var array
	 */
	public static $google_fonts = null;

	/**
	 * Enqueue block assets for backend editor.
	 *
	 * @since 1.0.0
	 */
	public function on_init_editor_assets() {
		// If in the frontend, bail out.
		if ( ! is_admin() ) {
			return;
		}
		// Icons Scripts & Styles.
		$kadence_icons_meta = kbs_get_asset_file( 'dist/icons' );
		wp_register_script( 'kadence-icons', KADENCE_BLOCKS_URL . 'dist/icons.js', array_merge( $kadence_icons_meta['dependencies'], [ 'wp-api' ] ), $kadence_icons_meta['version'], true );
		wp_set_script_translations( 'kadence-icons', 'kadence-blocks' );

		// Helpers Scripts & Styles.
		$kadence_helpers_meta = kbs_get_asset_file( 'dist/helpers' );
		wp_register_script( 'kadence-helpers', KADENCE_BLOCKS_URL . 'dist/helpers.js', array_merge( $kadence_helpers_meta['dependencies'], [ 'wp-api' ] ), $kadence_helpers_meta['version'], true );
		wp_set_script_translations( 'kadence-helpers', 'kadence-blocks' );

		$kadence_base = kbs_get_asset_file( 'dist/extension-kadence-base' );
		wp_register_script( 'kadence-blocks-js', KADENCE_BLOCKS_URL . 'dist/extension-kadence-base.js', array_merge( $kadence_base['dependencies'], [ 'wp-api' ] ), $kadence_base['version'], true );
		// // Block CSS Scripts & Styles.
		$kadence_stores_meta = kbs_get_asset_file( 'dist/extension-stores' );
		wp_register_script( 'kadence-extension-stores', KADENCE_BLOCKS_URL . 'dist/extension-stores.js', array_merge( $kadence_stores_meta['dependencies'], [ 'wp-api', 'kadence-blocks-js' ] ), $kadence_stores_meta['version'], true );
		wp_register_style( 'kadence-extension-stores', KADENCE_BLOCKS_URL . 'dist/extension/stores.css', [ 'wp-edit-blocks' ], $kadence_stores_meta['version'] );
		wp_set_script_translations( 'kadence-extension-stores', 'kadence-blocks' );

		// Global Styles Store.
		$kadence_global_styles_meta = kbs_get_asset_file( 'dist/extension-global-styles-store' );
		wp_register_script( 'kadence-extension-global-styles-store', KADENCE_BLOCKS_URL . 'dist/extension-global-styles-store.js', array_merge( $kadence_global_styles_meta['dependencies'], [ 'wp-api', 'kadence-blocks-js', 'kadence-extension-stores' ] ), $kadence_global_styles_meta['version'], true );
		wp_set_script_translations( 'kadence-extension-global-styles-store', 'kadence-blocks' );

		// Components Scripts & Styles.
		$kadence_components_meta = kbs_get_asset_file( 'dist/components' );
		wp_register_script( 'kadence-components', KADENCE_BLOCKS_URL . 'dist/components.js', array_merge( $kadence_components_meta['dependencies'], [ 'wp-api', 'kadence-extension-stores', 'kadence-blocks-js', 'kadence-extension-global-styles-store' ] ), $kadence_components_meta['version'], true );
		wp_register_style( 'kadence-components', KADENCE_BLOCKS_URL . 'dist/components.css', [ 'wp-edit-blocks' ], $kadence_components_meta['version'] );
		wp_set_script_translations( 'kadence-components', 'kadence-blocks' );

		// Block CSS Scripts & Styles.
		$kadence_block_css_meta = kbs_get_asset_file( 'dist/extension-block-css' );
		wp_register_script( 'kadence-extension-block-css', KADENCE_BLOCKS_URL . 'dist/extension-block-css.js', array_merge( $kadence_block_css_meta['dependencies'], [ 'wp-api', 'kadence-blocks-js' ] ), $kadence_block_css_meta['version'], true );
		wp_set_script_translations( 'kadence-extension-block-css', 'kadence-blocks' );

		// Helpers Scripts & Styles.
		$kadence_helpers_meta = kbs_get_asset_file( 'dist/kbsHelpers' );
		wp_register_script( 'kadence-kbsHelpers', KADENCE_BLOCKS_URL . 'dist/kbsHelpers.js', array_merge( $kadence_helpers_meta['dependencies'], [ 'wp-api' ] ), $kadence_helpers_meta['version'], true );
		wp_set_script_translations( 'kadence-kbsHelpers', 'kadence-blocks' );

		// Components Scripts & Styles.
		$kadence_components_meta = kbs_get_asset_file( 'dist/kbsComponents' );
		wp_register_script( 'kadence-kbsComponents', KADENCE_BLOCKS_URL . 'dist/kbsComponents.js', array_merge( $kadence_components_meta['dependencies'], [ 'wp-api', 'kadence-extension-stores', 'kadence-blocks-js', 'kadence-extension-global-styles-store' ] ), $kadence_components_meta['version'], true );
		wp_register_style( 'kadence-kbsComponents', KADENCE_BLOCKS_URL . 'dist/kbsComponents.css', [ 'wp-edit-blocks' ], $kadence_components_meta['version'] );
		wp_set_script_translations( 'kadence-kbsComponents', 'kadence-blocks' );

		// Icons Scripts & Styles.
		$kadence_icons_meta = kbs_get_asset_file( 'dist/kbsIcons' );
		wp_register_script( 'kadence-kbsIcons', KADENCE_BLOCKS_URL . 'dist/kbsIcons.js', array_merge( $kadence_icons_meta['dependencies'], [ 'wp-api' ] ), $kadence_icons_meta['version'], true );
		wp_set_script_translations( 'kadence-kbsIcons', 'kadence-blocks' );

		// Plugin Scripts & Styles.
		$kadence_control_meta = kbs_get_asset_file( 'dist/plugin-kbs-control' );
		wp_register_script( 'plugin-kbs-control-js', KADENCE_BLOCKS_URL . 'dist/plugin-kbs-control.js', array_merge( $kadence_control_meta['dependencies'], [ 'wp-api', 'kadence-blocks-js' ] ), $kadence_control_meta['version'], true );
		wp_register_style( 'plugin-kbs-control-css', KADENCE_BLOCKS_URL . 'dist/plugin-kbs-control.css', [ 'wp-edit-blocks', 'kadence-components' ], $kadence_control_meta['version'] );
		wp_set_script_translations( 'kbs-plugin-js', 'kadence-blocks' );

		$kadence_prebuilt_library_meta = kbs_get_asset_file( 'dist/kbs-prebuilt-library' );
		wp_register_script( 'kadence-kbs-prebuilt-library', KADENCE_BLOCKS_URL . 'dist/kbs-prebuilt-library.js', array_merge( $kadence_prebuilt_library_meta['dependencies'], [ 'wp-api', 'kadence-blocks-js' ] ), $kadence_prebuilt_library_meta['version'], true );
		wp_register_style( 'kadence-kbs-prebuilt-library', KADENCE_BLOCKS_URL . 'dist/kbs-prebuilt-library.css', [ 'wp-edit-blocks', 'kadence-components' ], $kadence_prebuilt_library_meta['version'] );
		wp_set_script_translations( 'kadence-kbs-prebuilt-library', 'kadence-blocks' );

		$blocks = [
			'container',
			'row',
			'text',
			'buttons',
		];
		foreach ( $blocks as $block ) {
			$meta   = kbs_get_asset_file( sprintf( 'dist/kbs-%s', $block ) );
			$handle = sprintf( 'kbs-%s', $block );

			wp_register_style( $handle, sprintf( '%sdist/kbs-%s.css', KADENCE_BLOCKS_URL, $block ), [ 'wp-edit-blocks', 'kadence-components', 'kadence-kbsComponents' ], $meta['version'] );
			wp_set_script_translations( $handle, 'kadence-blocks' );
		}

		$gfont_names_path = KADENCE_BLOCKS_PATH . 'includes/gfonts-names-array.php';

		$pro_data = kbs_get_current_license_data();
		if ( ! empty( $pro_data['key'] ) ) {
			$pro_data['api_key'] = $pro_data['key'];
		}
		if ( ! empty( $pro_data['email'] ) ) {
			$pro_data['api_email'] = $pro_data['email'];
		}
		$token         = ! kbs_is_ai_disabled() ? get_authorization_token( 'kadence-blocks' ) : '';
		$is_authorized = false;
		if ( ! empty( $pro_data['key'] ) && ! kbs_is_ai_disabled() ) {
			$is_authorized = is_authorized( $pro_data['key'], 'kadence-blocks', ( ! empty( $token ) ? $token : '' ), get_license_domain() );
		}
		if ( empty( $pro_data['domain'] ) ) {
			$pro_data['domain'] = get_license_domain();
		}

		wp_localize_script(
			'kadence-blocks-js',
			'kbs_params',
			[
				'responsive_device_options' => $this->get_responsive_device_options(),
				'global_styles'             => Global_Style::get_global_styles(),
				'cloud_enabled'             => apply_filters( 'kadence_blocks_cloud_enabled', true ),
				'cloud_settings'            => get_option( 'kadence_blocks_cloud' ),
				'prebuilt_libraries'        => apply_filters( 'kadence_blocks_custom_prebuilt_libraries', [] ),
				'showDesignLibrary'         => apply_filters( 'kadence_blocks_design_library_enabled', true ),
				'isKadenceTheme'            => class_exists( 'Kadence\Theme' ),
				'userrole'                  => wp_get_current_user()->roles[0],
				'svgMaskPath'               => KADENCE_BLOCKS_URL . 'includes/assets/images/masks/',
				'settings'                  => get_option( 'kadence_blocks_settings' ),
				'dynamic_enabled'           => apply_filters( 'kadence_blocks_dynamic_enabled', true ),
				'isAuthorized'              => $is_authorized,
				'isAIDisabled'              => kbs_is_ai_disabled(),
				'proData'                   => $pro_data,
				'homeLink'                  => admin_url( 'admin.php?page=kadence-blocks-home' ),
				'site_name'                 => sanitize_title( get_bloginfo( 'name' ) ),
				'pSlug'                     => apply_filters( 'kadence-blocks-auth-slug', 'kadence-blocks' ),
				'pVersion'                  => KADENCE_BLOCKS_VERSION,
				'aiLang'                    => apply_filters( 'kadence_blocks_ai_lang', 'en-US' ),
			]
		);
	}

	/**
	 * Enqueue block plugin for backend editor.
	 */
	public function editor_plugin_enqueue() {
		global $pagenow;
		if ( $pagenow !== 'widgets.php' ) {
			wp_enqueue_script( 'plugin-kbs-control-js' );
			wp_enqueue_style( 'plugin-kbs-control-css' );
			wp_enqueue_script( 'kadence-kbs-prebuilt-library' );
			wp_enqueue_style( 'kadence-kbs-prebuilt-library' );
		}
	}

	/**
	 * Get the responsive device options.
	 *
	 * @return array
	 */
	public static function get_responsive_device_options() {
		$responsive_device_options = apply_filters(
			'kadence_blocks_responsive_device_options',
			[
				[
					'name'          => 'Desktop',
					'key'           => 'desktop',
					'icon'          => 'desktop',
					'itemClass'     => 'kbs-desk-size',
					'attributeSlug' => 'desktop',
					'mediaQuery'    => apply_filters( 'kadence_desktop_media_query', '(min-width: 1025px)' ),
				],
				[
					'name'          => 'Tablet',
					'key'           => 'tablet',
					'icon'          => 'tablet',
					'itemClass'     => 'kbs-tablet-size',
					'attributeSlug' => 'tablet',
					'mediaQuery'    => apply_filters( 'kadence_tablet_media_query', '(max-width: 1024px)' ),
				],
				[
					'name'          => 'Mobile',
					'key'           => 'mobile',
					'icon'          => 'mobile',
					'itemClass'     => 'kbs-mobile-size',
					'attributeSlug' => 'mobile',
					'mediaQuery'    => apply_filters( 'kadence_mobile_media_query', '(max-width: 767px)' ),
				],
			] 
		);

		/*
		 * The editor is dependent on these keys to set values.
		 * If any device is missing an attribute slug, name, or key, remove it.
		 */
		foreach ( $responsive_device_options as $key => $device ) {
			if ( ! isset( $device['attributeSlug'] ) || ! isset( $device['name'] ) || ! isset( $device['key'] ) ) {
				unset( $responsive_device_options[ $key ] );
			}
		}

		return $responsive_device_options;
	}
}
