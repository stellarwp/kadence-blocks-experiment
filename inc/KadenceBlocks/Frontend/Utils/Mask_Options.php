<?php
/**
 * Mask options utility
 * 
 * @package Kadence Blocks
 */

namespace KadenceWP\KadenceBlocks\Frontend\Utils;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Mask options utility class
 */
class Mask_Options {
	
	/**
	 * Get mask options array
	 *
	 * @return array Mask options with normal and inverted arrays
	 */
	public static function get_mask_options() {
		return array(
			'normal' => array(
				'kbs-mask-panels-1' => array(
					'label' => __( 'Panels 1', 'kadence-blocks' ),
					'value' => 'kbs-mask-panels-1',
					'path'  => 'M1661.42,0l-1661.42,0l0,1200l461.418,0l1200,-1200Zm258.582,337.987l-862.013,862.013l-172.305,0l1034.32,-1034.32l0,172.305Zm0,600.056l-261.957,261.957l-175.792,0l437.749,-437.749l0,175.792Z',
				),
				'kbs-mask-panels-2' => array(
					'label' => __( 'Panels 2', 'kadence-blocks' ),
					'value' => 'kbs-mask-panels-2',
					'path'  => 'M1920,68.988l0,-68.988l-1920,0l0,1200l788.988,0l1131.01,-1131.01Zm0,869.055l-261.957,261.957l-152.737,0l414.694,-414.694l0,152.737Zm0,-435.58l-697.537,697.537l-150.632,0l848.169,-848.169l0,150.632Z',
				),
				'kbs-mask-panels-3' => array(
					'label' => __( 'Panels 3', 'kadence-blocks' ),
					'value' => 'kbs-mask-panels-3',
					'path'  => 'M1072.83,0l-1072.83,0l0,1200l751.286,0l321.539,-1200Zm314.653,1200l-111.811,0l321.539,-1200l111.811,0l-321.539,1200Zm-318.866,0l-110.27,0l321.539,-1200l110.27,0l-321.539,1200Zm847.461,-1200l-321.539,1200l325.466,0l0,-1200l-3.927,0Z',
				),
				'kbs-mask-panels-4' => array(
					'label' => __( 'Panels 4', 'kadence-blocks' ),
					'value' => 'kbs-mask-panels-4',
					'path'  => 'M1122.29,0l-1122.29,0l0,1200l800.754,0l321.539,-1200Zm-218.921,1200l-50.855,0l321.539,-1200l50.855,0l-321.539,1200Zm196.562,0l-93.034,0l321.539,-1200l93.034,0l-321.539,1200Zm412.398,0l-205.343,0l321.539,-1200l205.343,0l-321.539,1200Z',
				),
				'kbs-mask-shape-1' => array(
					'label' => __( 'Shape 1', 'kadence-blocks' ),
					'value' => 'kbs-mask-shape-1',
					'path'  => 'M872.129,0l-872.129,0l0,1200l1920,0l0,-198.91l-275.551,116.977c-139.204,59.096 -300.198,-5.942 -359.293,-145.146l-413.027,-972.921Z',
				),
				'kbs-mask-shape-2' => array(
					'label' => __( 'Shape 2', 'kadence-blocks' ),
					'value' => 'kbs-mask-shape-2',
					'path'  => 'M1438.9,0l-1438.9,0l0,1200l900.699,0l-137.148,-137.148c-106.935,-106.934 -106.935,-280.569 -0,-387.503l675.349,-675.349Z',
				),
			),
			'inverted' => array(
				'kbs-mask-panels-1' => array(
					'label' => __( 'Panels 1', 'kadence-blocks' ),
					'value' => 'kbs-mask-panels-1',
					'path'  => 'M1920,165.684l0,-165.684l-258.582,0l-1200,1200l424.266,0l1034.32,-1034.32Zm0,172.305l0,424.264l-437.747,437.747l-424.264,0l862.011,-862.011Zm0,862.011l-261.955,0l261.955,-261.955l0,261.955Z',
				),
				'kbs-mask-panels-2' => array(
					'label' => __( 'Panels 2', 'kadence-blocks' ),
					'value' => 'kbs-mask-panels-2',
					'path'  => 'M1920,0l0,1200l-261.957,0l261.957,-261.957l0,-152.737l-414.694,414.694l-282.843,0l697.537,-697.537l0,-150.632l-848.169,848.169l-282.843,0l1131.01,-1131.01l0,-68.988Z',
				),
				'kbs-mask-panels-3' => array(
					'label' => __( 'Panels 3', 'kadence-blocks' ),
					'value' => 'kbs-mask-panels-3',
					'path'  => 'M1594.54,1200l-207.056,0l321.539,-1200l207.056,0l-321.539,1200Zm-318.867,0l-207.055,0l321.539,-1200l207.055,0l-321.539,1200Zm-317.325,0l321.539,-1200l-207.061,0l-321.539,1200l207.061,0Z',
				),
				'kbs-mask-panels-4' => array(
					'label' => __( 'Panels 4', 'kadence-blocks' ),
					'value' => 'kbs-mask-panels-4',
					'path'  => 'M1920,0l0,1200l-407.671,0l321.539,-1200l86.132,0Zm-613.014,1200l-207.055,0l321.539,-1200l207.055,0l-321.539,1200Zm-300.089,0l-103.528,0l321.539,-1200l103.528,0l-321.539,1200Zm-154.383,0l321.539,-1200l-51.76,0l-321.539,1200l51.76,0Z',
				),
				'kbs-mask-shape-1' => array(
					'label' => __( 'Shape 1', 'kadence-blocks' ),
					'value' => 'kbs-mask-shape-1',
					'path'  => 'M872.129,0l413.027,972.921c59.095,139.204 220.089,204.242 359.293,145.146l275.551,-116.977l0,198.91l0,-1200l-1047.87,0Z',
				),
				'kbs-mask-shape-2' => array(
					'label' => __( 'Shape 2', 'kadence-blocks' ),
					'value' => 'kbs-mask-shape-2',
					'path'  => 'M1438.9,0l-675.349,675.349c-106.935,106.934 -106.935,280.569 -0,387.503l137.148,137.148l1019.3,0l0,-1200l-481.1,0Z',
				),
			),
		);
	}
	
	/**
	 * Get a specific mask by slug and subset
	 *
	 * @param string $mask_slug The mask slug
	 * @param string $mask_subset The mask subset ('normal' or 'inverted')
	 * @return array Mask data or empty array if not found
	 */
	public static function get_mask( $mask_slug, $mask_subset = 'normal' ) {
		$masks = self::get_mask_options();
		
		if ( isset( $masks[ $mask_subset ][ $mask_slug ] ) ) {
			return $masks[ $mask_subset ][ $mask_slug ];
		}
		
		return array();
	}
}