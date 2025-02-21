<?php
/**
 * Helper functions.
 *
 * @package KadenceWP\KadenceBlocks
 */

declare( strict_types=1 );

/**
 * Get the asset file produced by wp scripts.
 *
 * @param string $filepath the file path.
 * @return array
 */
function kbs_get_asset_file( $filepath ) {
	$asset_path = KADENCE_BLOCKS_PATH . $filepath . '.asset.php';
	return file_exists( $asset_path )
		? include $asset_path
		: [
			'dependencies' => [ 'lodash', 'react', 'react-dom', 'wp-block-editor', 'wp-blocks', 'wp-data', 'wp-element', 'wp-i18n', 'wp-polyfill', 'wp-primitives', 'wp-api' ],
			'version'      => KADENCE_BLOCKS_VERSION,
		];
}

/**
 * Get the stored Google Fonts data
 *
 * @return array Array of Google Fonts data
 */
function kbs_get_google_fonts() {
    $fonts_file = dirname(__FILE__) . '/../data/google-fonts.php';
    if (!file_exists($fonts_file)) {
        return array();
    }
    
    return include $fonts_file;
}

/**
 * Update Google Fonts data using the Google Fonts API
 *
 * @param string $api_key Google Fonts API key
 * @return bool|WP_Error True on success, WP_Error on failure
 */
function kbs_update_google_fonts($api_key) {
    if (empty($api_key)) {
        return new \WP_Error('missing_api_key', 'Google Fonts API key is required');
    }

    // Fetch variable fonts
    $fonts_url = add_query_arg(array(
        'key' => $api_key,
        'sort' => 'alpha',
        'capability' => 'VF'
    ), 'https://www.googleapis.com/webfonts/v1/webfonts');

    $response = wp_remote_get($fonts_url);
    if (is_wp_error($response)) {
        return $response;
    }

    $body = wp_remote_retrieve_body($response);
    $data = json_decode($body, true);
    
    if (!isset($data['items']) || !is_array($data['items'])) {
        return new \WP_Error('invalid_response', 'Invalid response from Google Fonts API');
    }

    // Process fonts
    $processed_fonts = array();
    foreach ($data['items'] as $font) {
        $font_key = strtolower($font['family']);
        
        $processed_fonts[$font_key] = array(
            'family' => $font['family'],
            'variants' => $font['variants'],
            'subsets' => $font['subsets'],
            'category' => $font['category'],
            'is_variable' => true,
            'axes' => isset($font['axes']) ? $font['axes'] : array()
        );
    }

    // Ensure data directory exists
    $data_dir = dirname(__FILE__) . '/../data';
    if (!file_exists($data_dir)) {
        wp_mkdir_p($data_dir);
    }

    // Generate PHP file content
    $php_content = "<?php\n\n// This file is auto-generated. Do not edit manually.\nreturn " . var_export($processed_fonts, true) . ";\n";

    // Save to file
    $fonts_file = $data_dir . '/google-fonts.php';
    $save_result = file_put_contents($fonts_file, $php_content);

    if ($save_result === false) {
        return new \WP_Error('save_failed', 'Failed to save Google Fonts data');
    }

    return true;
}