<?php
/**
 * @see https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/block-api/block-metadata.md#render
 */

// Security: Ensure we have valid content before output
if ( ! isset( $content ) || empty( $content ) ) {
	return;
}

// Security: Sanitize and validate content
$sanitized_content = wp_kses_post( $content );
?>
<div <?php echo get_block_wrapper_attributes(); ?>>
	<?php echo $sanitized_content; ?>
</div>
