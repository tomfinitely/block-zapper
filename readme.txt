
=== Block Zapper ===

Contributors:      WordPress Telex
Tags:              block, container, group, cleanup
Tested up to:      6.8
Stable tag:        0.1.0
License:           GPLv2 or later
License URI:       https://www.gnu.org/licenses/gpl-2.0.html
A powerful container block that allows you to group other blocks and reset their custom properties with a single click.

== Description ==

Block Zapper is a container block similar to the WordPress Group block, but with a special superpower: the ability to remove all custom properties from child blocks contained within it.

This block is perfect for:

* Creating clean sections on your website
* Grouping related content blocks together
* Quickly resetting block customizations when you want to start fresh
* Managing complex layouts with multiple nested blocks

The "zap!" button in the block inspector allows you to instantly remove all custom styling, spacing, colors, and other modifications from any blocks placed inside the Block Zapper container.

== Key Features ==

* **Container Functionality**: Works like a standard group block - add any blocks inside
* **One-Click Reset**: Remove all custom properties from child blocks with the "zap!" button
* **Non-Destructive**: Only removes custom styling and properties, keeps the actual content intact
* **Flexible Layout**: Supports all standard WordPress blocks as children
* **Easy to Use**: Simple interface with clear labeling

== Installation ==

1. Upload the plugin files to the `/wp-content/plugins/block-zapper` directory, or install the plugin through the WordPress plugins screen directly.
2. Activate the plugin through the 'Plugins' screen in WordPress
3. The Block Zapper block will be available in the block inserter under the "Design" category

== Usage ==

1. Add a Block Zapper block to your post or page
2. Insert any blocks you want inside the Block Zapper container
3. Customize the child blocks as needed (colors, spacing, fonts, etc.)
4. When you want to reset all customizations, select the Block Zapper block
5. Click the "zap!" button in the block inspector sidebar
6. All custom properties will be removed from the child blocks instantly

== Frequently Asked Questions ==

= Does the "zap!" button delete my content? =

No! The zap button only removes custom styling and properties like colors, spacing, fonts, and other visual customizations. Your actual text content, images, and block structure remain completely intact.

= Can I undo the zap action? =

Yes, you can use the standard WordPress undo functionality (Ctrl+Z or Cmd+Z) to restore the custom properties if you zap them by mistake.

= What types of blocks can I put inside Block Zapper? =

You can insert any WordPress block inside the Block Zapper container - paragraphs, images, headings, columns, and even other container blocks.

= Will this affect blocks outside the Block Zapper? =

No, the zap action only affects blocks that are direct children of the Block Zapper container. Other blocks on your page remain untouched.

== Screenshots ==

1. Block Zapper in the block inserter
2. Container with child blocks and custom styling applied
3. The "zap!" button in the block inspector sidebar
4. Result after clicking zap - clean blocks with no custom properties

== Changelog ==

= 0.1.0 =
* Initial release
* Container functionality with inner blocks support
* "zap!" button to remove custom properties from child blocks
* Integration with WordPress block editor

== Support ==

For support and feature requests, please contact WordPress Telex.
