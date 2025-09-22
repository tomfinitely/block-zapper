<?php
/**
 * Plugin Name:       Block Zapper
 * Description:       A container block that allows you to group other blocks and reset their custom properties with a single click.
 * Version:           0.1.0
 * Requires at least: 6.0
 * Requires PHP:      7.4
 * Author:            WordPress Telex
 * License:           GPLv2 or later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       block-zapper-block-wp
 *
 * @package BlockZapper
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function telex_block_zapper_block_init() {
	register_block_type( __DIR__ . '/build/' );
}
add_action( 'init', 'telex_block_zapper_block_init' );
