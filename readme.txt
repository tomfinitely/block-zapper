=== Block Zapper ===

Contributors:      WordPress Telex
Tags:              block, container, group, cleanup, selective
Tested up to:      6.8
Stable tag:        0.1.0
License:           GPLv2 or later
License URI:       https://www.gnu.org/licenses/gpl-2.0.html
A powerful container block with granular control to selectively remove custom properties from child blocks.

== Description ==

Block Zapper is a container block similar to the WordPress Group block, but with selective superpowers: the ability to remove specific types of custom properties from child blocks contained within it using granular checkbox controls.

This block is perfect for:

* Creating clean sections on your website with precise control
* Grouping related content blocks together
* Selectively resetting specific customizations while keeping others
* Managing complex layouts with fine-tuned cleanup options
* Preserving important content like media while removing styling

The selective "ZAP!" functionality in the block inspector allows you to choose exactly what to remove from any blocks placed inside the Block Zapper container.

== Key Features ==

* **Granular Control**: Choose exactly what to zap with 7 different categories:
  * ⚙️ Block settings (layout, alignment, etc.)
  * 🎨 Block styles (colors, gradients, backgrounds) 
  * 🔧 Custom properties (fonts, spacing, borders, effects)
  * 📸 Keep images and videos (recommended)
  * 📝 Custom classes (Additional CSS class(es))
  * ⚓ Custom anchors (HTML anchor)
  * 🏷️ HTML element selections (alignment, tags)

* **Smart Preservation**: Essential content like text, images, and URLs are always preserved
* **Media Protection**: Option to keep all media-related attributes intact
* **Visual Feedback**: Clear status display showing blocks and properties count
* **Undo Support**: All changes can be undone with standard WordPress undo
* **Real-time Updates**: See changes immediately in the editor

== Installation ==

1. Upload the plugin files to the `/wp-content/plugins/block-zapper` directory, or install the plugin through the WordPress plugins screen directly.
2. Activate the plugin through the 'Plugins' screen in WordPress
3. The Block Zapper block will be available in the block inserter under the "Design" category

== Usage ==

1. Add a Block Zapper block to your post or page
2. Insert any blocks you want inside the Block Zapper container
3. Customize the child blocks as needed (colors, spacing, fonts, etc.)
4. Select the Block Zapper block to see the inspector controls
5. Choose which types of properties you want to zap using the checkboxes:
   - Check "Block settings" to remove layout and alignment
   - Check "Block styles" to remove colors and backgrounds
   - Check "Custom properties" to remove fonts, spacing, and borders
   - Keep "Keep images and videos" checked to preserve media
   - Check "Custom classes" to remove additional CSS classes
   - Check "Custom anchors" to remove HTML anchor IDs
   - Check "HTML element selections" to remove alignment and tag choices
6. Click the "SELECTIVE ZAP!" button to apply your choices
7. All matching properties will be removed from child blocks instantly

== Granular Zapping Categories ==

**⚙️ Block Settings**: Removes core block functionality like layout, vertical alignment, and template settings.

**🎨 Block Styles**: Removes visual styling including background colors, text colors, gradients, and overlay colors.

**🔧 Custom Properties**: Removes typography (fonts, sizes, weights), spacing (margin, padding), borders, shadows, effects, dimensions, and positioning.

**📸 Keep Media**: When checked, preserves all media-related attributes like image sources, video settings, and media controls.

**📝 Custom Classes**: Removes the "Additional CSS class(es)" field content from the Advanced panel.

**⚓ Custom Anchors**: Removes the "HTML anchor" field content from the Advanced panel.

**🏷️ HTML Element Selections**: Removes alignment settings and HTML element tag choices.

== Frequently Asked Questions ==

= Does the zap button delete my content? =

No! The zap functionality only removes the specific types of properties you select. Your actual text content, images, links, and core block structure remain completely intact. Essential content attributes are always preserved regardless of your selections.

= Can I undo the zap action? =

Yes, you can use the standard WordPress undo functionality (Ctrl+Z or Cmd+Z) to restore the properties if you zap them by mistake.

= What happens if I don't select any zap options? =

The "SELECTIVE ZAP!" button will be disabled until you select at least one zapping option. This prevents accidental clicks when no changes would be made.

= Why should I keep "Keep images and videos" checked? =

This option preserves important media attributes like image sources, alt text, video controls, and accessibility features. Unchecking it could remove these essential media properties and break your media blocks.

= Can I zap blocks multiple times with different settings? =

Yes! You can run multiple zap operations with different checkbox combinations. The block remembers your last settings for convenience.

= Will this affect blocks outside the Block Zapper? =

No, the zap action only affects blocks that are direct children of the Block Zapper container. Other blocks on your page remain untouched.

== Screenshots ==

1. Block Zapper in the block inserter with database-remove icon
2. Container with child blocks showing various custom styling applied
3. Inspector controls showing all seven granular zap options with checkboxes
4. Status display showing block count and properties before zapping
5. Success message after selective zapping with detailed results
6. Clean blocks with only selected properties removed

== Changelog ==

= 0.1.0 =
* Initial release with granular zapping controls
* Seven selective zap categories with checkboxes
* Container functionality with inner blocks support
* Smart media preservation options
* Real-time status display and feedback
* Integration with WordPress block editor
* Comprehensive error handling and validation

== Advanced Usage Tips ==

* Use "Block styles" alone to remove only colors while keeping spacing
* Combine "Custom classes" and "Custom anchors" to clean up Advanced panel settings
* Keep "Keep images and videos" checked unless you specifically want to reset media attributes
* Use "HTML element selections" to reset alignment without affecting other styling
* The status display shows total properties to help you understand what's being modified

== Support ==

For support and feature requests, please contact WordPress Telex. Check the browser console for detailed debugging information if needed.