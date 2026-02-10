<?php
/**
 * Divider options utility
 * 
 * @package Kadence Blocks
 */

namespace KadenceWP\KadenceBlocks\Frontend\Utils;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Divider options utility class
 */
class Divider_Options {
	
	/**
	 * Get divider options array
	 *
	 * @return array Divider options with horizontal and vertical arrays
	 */
	public static function get_divider_options() {
		return array(
			'horizontal' => self::get_horizontal_dividers(),
			'vertical'   => self::get_vertical_dividers(),
		);
	}
	
	/**
	 * Get horizontal divider options
	 *
	 * @return array Horizontal divider options
	 */
	protected static function get_horizontal_dividers() {
		return array(
			array(
				'label' => __( 'Tilt', 'kadence-blocks' ),
				'value' => 'ct',
				'svg'   => '<svg viewBox="0 0 1000 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><path d="M1000,0l-500,98l-500,-98l0,100l1000,0l0,-100Z"/></svg>',
			),
			array(
				'label' => __( 'Tilt Invert', 'kadence-blocks' ),
				'value' => 'cti',
				'svg'   => '<svg viewBox="0 0 1000 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><path d="M500,2l500,98l-1000,0l500,-98Z"/></svg>',
			),
			array(
				'label' => __( 'Slant Left', 'kadence-blocks' ),
				'value' => 'sltl',
				'svg'   => '<svg viewBox="0 0 1000 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><path d="M1000,0l-1000,100l1000,0l0,-100Z"/></svg>',
			),
			array(
				'label' => __( 'Slant Left Invert', 'kadence-blocks' ),
				'value' => 'sltli',
				'svg'   => '<svg viewBox="0 0 1000 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><path d="M0,100l1000,-100l-1000,0l0,100Z"/></svg>',
			),
			array(
				'label' => __( 'Slant Right', 'kadence-blocks' ),
				'value' => 'sltr',
				'svg'   => '<svg viewBox="0 0 1000 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><path d="M0,0l1000,100l-1000,0l0,-100Z"/></svg>',
			),
			array(
				'label' => __( 'Slant Right Invert', 'kadence-blocks' ),
				'value' => 'sltri',
				'svg'   => '<svg viewBox="0 0 1000 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><path d="M1000,100l-1000,-100l1000,0l0,100Z"/></svg>',
			),
			array(
				'label' => __( 'Curve', 'kadence-blocks' ),
				'value' => 'crv',
				'svg'   => '<svg viewBox="0 0 1000 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><path d="M1000,100c0,0 -270.987,-98 -500,-98c-229.013,0 -500,98 -500,98l1000,0Z"/></svg>',
			),
			array(
				'label' => __( 'Curve Invert', 'kadence-blocks' ),
				'value' => 'crvi',
				'svg'   => '<svg viewBox="0 0 1000 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><path d="M1000,0c0,0 -270.987,98 -500,98c-229.013,0 -500,-98 -500,-98l0,100l1000,0l0,-100Z"/></svg>',
			),
			array(
				'label' => __( 'Wave', 'kadence-blocks' ),
				'value' => 'wav',
				'svg'   => '<svg viewBox="0 0 1000 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><path d="M1000,40c0,0 -120.077,-38.076 -250,-38c-129.923,0.076 -345.105,78 -500,78c-154.895,0 -250,-30 -250,-30l0,50l1000,0l0,-60Z"/></svg>',
			),
			array(
				'label' => __( 'Wave Invert', 'kadence-blocks' ),
				'value' => 'wavi',
				'svg'   => '<svg viewBox="0 0 1000 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><path d="M0,40c0,0 120.077,-38.076 250,-38c129.923,0.076 345.105,78 500,78c154.895,0 250,-30 250,-30l0,50l-1000,0l0,-60Z"/></svg>',
			),
			array(
				'label' => __( 'Mountains', 'kadence-blocks' ),
				'value' => 'mnt',
				'svg'   => '<svg viewBox="0 0 1000 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><path d="M1000,50l-182.69,-45.286l-292.031,61.197l-190.875,-41.075l-143.748,28.794l-190.656,-27.321l0,73.691l1000,0l0,-50Z"/></svg>',
			),
			array(
				'label' => __( 'Mountains Invert', 'kadence-blocks' ),
				'value' => 'mnti',
				'svg'   => '<svg viewBox="0 0 1000 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><path d="M282.69,4.714l292.031,61.197l190.875,-41.075l143.748,28.794l90.656,-27.321l0,73.691l-1000,0l0,-50l182.69,-45.286Z"/></svg>',
			),
		);
	}
	
	/**
	 * Get vertical divider options
	 *
	 * @return array Vertical divider options
	 */
	protected static function get_vertical_dividers() {
		return array(
			array(
				'label' => __( 'Tilt', 'kadence-blocks' ),
				'value' => 'vct',
				'svg'   => '<svg viewBox="0 0 100 1000" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><path d="M0,1000l98,-500l-98,-500l100,0l0,1000l-100,0Z"/></svg>',
			),
			array(
				'label' => __( 'Tilt Invert', 'kadence-blocks' ),
				'value' => 'vcti',
				'svg'   => '<svg viewBox="0 0 100 1000" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><path d="M2,500l98,500l0,-1000l-98,500Z"/></svg>',
			),
			array(
				'label' => __( 'Slant Top', 'kadence-blocks' ),
				'value' => 'vsltt',
				'svg'   => '<svg viewBox="0 0 100 1000" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><path d="M0,1000l100,-1000l0,1000l-100,0Z"/></svg>',
			),
			array(
				'label' => __( 'Slant Top Invert', 'kadence-blocks' ),
				'value' => 'vsltti',
				'svg'   => '<svg viewBox="0 0 100 1000" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><path d="M100,0l-100,1000l0,-1000l100,0Z"/></svg>',
			),
			array(
				'label' => __( 'Slant Bottom', 'kadence-blocks' ),
				'value' => 'vsltb',
				'svg'   => '<svg viewBox="0 0 100 1000" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><path d="M0,0l100,1000l0,-1000l-100,0Z"/></svg>',
			),
			array(
				'label' => __( 'Slant Bottom Invert', 'kadence-blocks' ),
				'value' => 'vsltbi',
				'svg'   => '<svg viewBox="0 0 100 1000" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><path d="M100,1000l-100,-1000l0,1000l100,0Z"/></svg>',
			),
			array(
				'label' => __( 'Curve', 'kadence-blocks' ),
				'value' => 'vcrv',
				'svg'   => '<svg viewBox="0 0 100 1000" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><path d="M100,1000c0,0 -98,-270.987 -98,-500c0,-229.013 98,-500 98,-500l0,1000Z"/></svg>',
			),
			array(
				'label' => __( 'Curve Invert', 'kadence-blocks' ),
				'value' => 'vcrvi',
				'svg'   => '<svg viewBox="0 0 100 1000" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><path d="M0,1000c0,0 98,-270.987 98,-500c0,-229.013 -98,-500 -98,-500l100,0l0,1000l-100,0Z"/></svg>',
			),
			array(
				'label' => __( 'Wave', 'kadence-blocks' ),
				'value' => 'vwav',
				'svg'   => '<svg viewBox="0 0 100 1000" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><path d="M40,1000c0,0 -38.076,-120.077 -38,-250c0.076,-129.923 78,-345.105 78,-500c0,-154.895 -30,-250 -30,-250l50,0l0,1000l-60,0Z"/></svg>',
			),
			array(
				'label' => __( 'Wave Invert', 'kadence-blocks' ),
				'value' => 'vwavi',
				'svg'   => '<svg viewBox="0 0 100 1000" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><path d="M40,0c0,0 -38.076,120.077 -38,250c0.076,129.923 78,345.105 78,500c0,154.895 -30,250 -30,250l50,0l0,-1000l-60,0Z"/></svg>',
			),
		);
	}
	
	/**
	 * Get a specific divider by value and side
	 *
	 * @param string $value The divider value
	 * @param string $side The side ('horizontal' or 'vertical')
	 * @return array|null Divider data or null if not found
	 */
	public static function get_divider( $value, $side = 'horizontal' ) {
		$dividers = self::get_divider_options();
		
		if ( ! isset( $dividers[ $side ] ) ) {
			return null;
		}
		
		foreach ( $dividers[ $side ] as $divider ) {
			if ( isset( $divider['value'] ) && $divider['value'] === $value ) {
				return $divider;
			}
		}
		
		return null;
	}
}