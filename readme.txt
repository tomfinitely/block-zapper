=== Block Zapper ===

Contributors:      WordPress Telex
Tags:              block, container, group, cleanup, selective
Tested up to:      6.8
Stable tag:        0.3.2
License:           GPLv2 or later
License URI:       https://www.gnu.org/licenses/gpl-2.0.html
A powerful container block with granular control to selectively remove custom properties from child blocks.

== Description ==

Block Zapper is a container block similar to the WordPress Group block, but with selective superpowers: the ability to remove specific types of custom properties from child blocks contained within it using granular checkbox controls.

⚠️ **CRITICAL WARNING**: Block Zapper CANNOT save data! ANY data left in Block Zapper will be LOST when you close the browser window/tab. It is a styling cleanup tool only. Do NOT use it to store important content, data, or information that needs to be preserved. The zap functionality will remove custom properties and styling - this is NOT a data storage solution!

This block is perfect for:

* Creating clean sections on your website with precise control
* Grouping related content blocks together
* Selectively resetting specific customizations while keeping others
* Managing complex layouts with fine-tuned cleanup options
* Preserving important content like media while removing styling

The selective "ZAP!" functionality in the block inspector allows you to choose exactly what to remove from any blocks placed inside the Block Zapper container.

== Key Features ==

* **Two Zap Modes**: 
  * ⚡ **Selective Zap**: Choose exactly what to remove with 7 granular categories
  * 💥 **Mega Zap**: Nuclear option that removes ALL styling while preserving content
  
* **Granular Control Categories**:
  * ⚙️ Block settings (layout, alignment, etc.)
  * 🎨 Block styles (colors, gradients, backgrounds) 
  * 🔧 Custom properties (fonts, spacing, borders, effects)
  * 📸 Keep images and videos (recommended for both modes)
  * 📝 Custom classes (Additional CSS class(es))
  * ⚓ Custom anchors (HTML anchor)
  * 🏷️ HTML element selections (alignment, tags)

* **Smart Preservation**: Essential content like text, images, and URLs are always preserved
* **Media Protection**: Robust option to keep all media-related attributes intact in both modes
* **Icon Block Support**: Full protection for Nick Diego's Icon Block plugin attributes
* **Accessibility**: Full ARIA support, screen reader compatibility, and contextual descriptions
* **Security**: Secure error handling, content sanitization, and production-safe logging
* **Visual Feedback**: Clear status display showing blocks and properties count
* **Undo Support**: All changes can be undone with standard WordPress undo
* **Real-time Updates**: See changes immediately in the editor

== Installation ==

1. Upload the plugin files to the `/wp-content/plugins/block-zapper` directory, or install the plugin through the WordPress plugins screen directly.
2. Activate the plugin through the 'Plugins' screen in WordPress
3. The Block Zapper block will be available in the block inserter under the "Design" category

== Usage ==

⚠️ **CRITICAL WARNING**: Block Zapper CANNOT save data! ANY data left in Block Zapper will be LOST when you close the browser window/tab. It is a styling cleanup tool only. Do NOT use it to store important content, data, or information that needs to be preserved. The zap functionality will remove custom properties and styling - this is NOT a data storage solution!

1. Add a Block Zapper block to your post or page
2. Insert any blocks you want inside the Block Zapper container
3. Customize the child blocks as needed (colors, spacing, fonts, etc.)
4. Select the Block Zapper block to see the inspector controls
5. Choose your zap mode:
   - **Selective Zap**: Check specific categories you want to remove
   - **Mega Zap**: Nuclear option for complete styling cleanup
6. Make sure "Keep images and videos" is checked (recommended for both modes)
7. Click the appropriate ZAP button to apply your choices
8. All matching properties will be removed from child blocks instantly

== Granular Zapping Categories ==

**⚙️ Block Settings**: Removes core block functionality like layout, vertical alignment, and template settings.

**🎨 Block Styles**: Removes visual styling including background colors, text colors, gradients, and overlay colors.

**🔧 Custom Properties**: Removes typography (fonts, sizes, weights), spacing (margin, padding), borders, shadows, effects, dimensions, and positioning.

**📸 Keep Media**: When checked, preserves all media-related attributes including:
* Image sources, alt text, captions, and video settings
* Cover block background images and positioning
* Icon Block plugin attributes (Nick Diego's Icon Block)
* All media controls and accessibility features

**📝 Custom Classes**: Removes the "Additional CSS class(es)" field content from the Advanced panel.

**⚓ Custom Anchors**: Removes the "HTML anchor" field content from the Advanced panel.

**🏷️ HTML Element Selections**: Removes alignment settings and HTML element tag choices.

== Frequently Asked Questions ==

= Does the zap button delete my content? =

No! The zap functionality only removes the specific types of properties you select. Your actual text content, images, links, and core block structure remain completely intact. Essential content attributes are always preserved regardless of your selections.

= Can I undo the zap action? =

Yes, you can use the standard WordPress undo functionality (Ctrl+Z or Cmd+Z) to restore the properties if you zap them by mistake.

= What's the difference between Selective Zap and Mega Zap? =

Selective Zap lets you choose specific categories to remove with granular control. Mega Zap is the nuclear option that removes ALL styling properties while keeping only essential content and media (if selected).

= Why should I keep "Keep images and videos" checked? =

This option preserves important media attributes including image sources, alt text, video controls, cover block backgrounds, and Icon Block plugin attributes. Unchecking it will remove these essential media properties and could break your media blocks.

= Does "Keep images and videos" work in Mega Zap mode? =

Yes! As of version 0.3.0, the media preservation feature works correctly in both Selective Zap and Mega Zap modes, with identical protection for all media types including Icon Block plugin attributes.

= Can I zap blocks multiple times with different settings? =

Yes! You can run multiple zap operations with different checkbox combinations and modes. The block remembers your last settings for convenience.

= Will this affect blocks outside the Block Zapper? =

No, the zap action only affects blocks that are direct children of the Block Zapper container. Other blocks on your page remain untouched.

= Can I store important data inside Block Zapper blocks? =

ABSOLUTELY NOT! Block Zapper CANNOT save or store data. ANY data left in Block Zapper will be LOST when you close the browser window/tab. It is a styling cleanup tool only. Do NOT use it for storing important content, data, or information. The zap functionality will remove custom properties and styling - this is NOT a data storage solution! Use it only for cleaning up styling on blocks where you want to reset or remove customizations.

== Screenshots ==

1. Block Zapper in the block inserter with lightning bolt icon
2. Container with child blocks showing various custom styling applied
3. Inspector controls showing selective zap mode with granular options
4. Inspector controls showing mega zap mode with media preservation
5. Status display showing block count and properties before zapping
6. Success message after zapping with detailed results
7. Clean blocks with only selected properties removed

== Changelog ==

= 0.3.2 =
* WARNING: Added clear warnings about not storing important data in Block Zapper blocks
* DOCUMENTATION: Enhanced usage instructions with data storage warnings
* FAQ: Added specific FAQ about data storage limitations
* TIPS: Added reminder about styling cleanup purpose only
* ICON: Updated block icon to custom SVG with container and lightning bolt design for better visual representation
* UPDATED: Documentation to clarify Block Zapper's intended use case
* ENHANCED: Moved warning to top of description and usage sections for better visibility

= 0.3.1 =
* ENHANCED: Full accessibility support with ARIA labels and screen reader compatibility
* SECURITY: Implemented secure error handling and content sanitization
* SECURITY: Added production-safe logging that doesn't expose sensitive information
* ACCESSIBILITY: Added contextual descriptions for all interactive elements
* ACCESSIBILITY: Improved button states and mode descriptions for better user experience
* SECURITY: Content sanitization using WordPress wp_kses_post() function
* UPDATED: Documentation with security and accessibility improvements

= 0.3.0 =
* FIXED: Media protection now works correctly in both Selective Zap and Mega Zap modes
* ADDED: Full support for Nick Diego's Icon Block plugin attributes
* ENHANCED: Cover block background image protection with comprehensive attribute coverage
* IMPROVED: Media attribute handling with explicit allow list approach
* FIXED: Core image attributes now properly respect "Keep images and videos" checkbox state
* CLEANED: Removed all debugging console.log statements for production-ready code
* UPDATED: Documentation with Icon Block support and enhanced media protection details

= 0.2.0 =
* FIXED: "Keep images and videos" now works correctly in Mega Zap mode
* Enhanced media preservation logic with absolute priority
* Improved debugging and console logging
* Better error handling and validation
* Updated documentation with new features and fixes

= 0.1.0 =
* Initial release with granular zapping controls
* Seven selective zap categories with checkboxes
* Container functionality with inner blocks support
* Smart media preservation options
* Real-time status display and feedback
* Integration with WordPress block editor
* Comprehensive error handling and validation

== Advanced Usage Tips ==

* Use Selective Zap when you want precise control over what gets removed
* Use Mega Zap when you want to completely reset all styling back to defaults
* Always keep "Keep images and videos" checked unless you specifically want to reset media attributes
* The status display shows total properties to help you understand what's being modified
* Check the browser console for detailed debugging information about what was zapped
* Use "Block styles" alone to remove only colors while keeping spacing
* Combine "Custom classes" and "Custom anchors" to clean up Advanced panel settings

⚠️ **CRITICAL REMINDER**: Block Zapper CANNOT save data! ANY data left in Block Zapper will be LOST when you close the browser window/tab. It is a styling cleanup tool only. Do NOT use it to store important content, data, or information. The zap functionality will remove custom properties and styling - this is NOT a data storage solution!

== Support ==

For support and feature requests, please contact WordPress Telex. Check the browser console for detailed debugging information if needed.