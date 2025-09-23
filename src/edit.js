/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * Custom Block Zapper Icon Component
 */
const BlockZapperIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" role="img">
		<rect x="1.5" y="2.5" width="13.5" height="19" rx="2.2" ry="2.2"
			fill="#F3F4F6" stroke="#111217" strokeWidth="1.4" />
		<rect x="3.1" y="4.1" width="10.8" height="15" rx="1.6" ry="1.6"
			fill="none" stroke="#000000" strokeOpacity="0.06" strokeWidth="0.6"/>
		<path d="M15.8 5.0 L11.6 11.0 H14.3 L9.8 19.0 L13.9 12.0 H11.6 L15.8 5.0 Z"
			fill="#FFD24A" stroke="#111217" strokeWidth="0.9" strokeLinejoin="round" />
	</svg>
);

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps, InnerBlocks, InspectorControls } from '@wordpress/block-editor';

/**
 * WordPress dependencies
 */
import { PanelBody, Button, Notice, CheckboxControl, Card, CardBody, RadioControl } from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import { useState, useEffect } from '@wordpress/element';
import { createBlock } from '@wordpress/blocks';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @param {Object} props Block properties.
 * @return {Element} Element to render.
 */
export default function Edit( props ) {
	const { clientId, attributes, setAttributes } = props;
	const blockProps = useBlockProps();
	const [ isZapping, setIsZapping ] = useState( false );
	const [ zapMessage, setZapMessage ] = useState( '' );
	const [ lastZapTime, setLastZapTime ] = useState( null );

	// Zap mode state
	const [ zapMode, setZapMode ] = useState( 'selective' );

	// Zapping options state
	const [ zapOptions, setZapOptions ] = useState( {
		blockSettings: attributes.zapBlockSettings ?? true,
		blockStyles: attributes.zapBlockStyles ?? true,
		customProperties: attributes.zapCustomProperties ?? true,
		keepMedia: attributes.zapKeepMedia ?? true,
		customClasses: attributes.zapCustomClasses ?? true,
		customAnchors: attributes.zapCustomAnchors ?? true,
		htmlElements: attributes.zapHtmlElements ?? true
	} );

	const { updateBlockAttributes, replaceBlock } = useDispatch( 'core/block-editor' );

	// Get inner blocks with more detailed information
	const innerBlocks = useSelect( ( select ) => {
		try {
			const blocks = select( 'core/block-editor' ).getBlocks( clientId );
			return Array.isArray( blocks ) ? blocks : [];
		} catch ( error ) {
			// Log error securely without exposing sensitive information
			if ( process.env.NODE_ENV === 'development' ) {
				console.error( 'Error getting inner blocks:', error );
			}
			return [];
		}
	}, [ clientId ] );

	// Clear message after timeout
	useEffect( () => {
		if ( zapMessage ) {
			const timeout = setTimeout( () => {
				setZapMessage( '' );
			}, 10000 );
			return () => clearTimeout( timeout );
		}
	}, [ zapMessage ] );

	// Save zap options to block attributes
	useEffect( () => {
		setAttributes( {
			zapBlockSettings: zapOptions.blockSettings,
			zapBlockStyles: zapOptions.blockStyles,
			zapCustomProperties: zapOptions.customProperties,
			zapKeepMedia: zapOptions.keepMedia,
			zapCustomClasses: zapOptions.customClasses,
			zapCustomAnchors: zapOptions.customAnchors,
			zapHtmlElements: zapOptions.htmlElements
		} );
	}, [ zapOptions, setAttributes ] );

	/**
	 * Safely get attributes from block, handling undefined cases
	 */
	const getBlockAttributes = ( block ) => {
		if ( ! block || typeof block !== 'object' ) {
			return {};
		}
		return block.attributes || {};
	};

	/**
	 * Get categorized attributes based on zap options
	 * REWRITTEN: Using explicit allow list approach for reliability
	 */
	const getCategorizedAttributes = ( attributes, isMegaZap = false, keepMedia = false ) => {
		// Define explicit allow lists - only these attributes will be preserved
		const getAllowList = ( isMegaZap, keepMedia, zapOptions ) => {
			const allowList = new Set();

			// ALWAYS preserve these core content attributes (NON-MEDIA)
			const essentialContent = [
				'content', 'href', 'text', 'level', 'tagName', 'value',
				'label', 'placeholder', 'title', 'type', 'checked', 'selected', 'disabled',
				'required', 'multiple', 'name', 'headers', 'scope'
			];
			essentialContent.forEach( attr => allowList.add( attr ) );

			// SHARED MEDIA ATTRIBUTES - IDENTICAL FOR BOTH MODES
			// FOCUSED ON BACKGROUND IMAGES AND ICONS ONLY
			const getMediaAttributes = () => [
				// Core image/video attributes (moved from essentialContent)
				'src', 'srcset', 'sizes', 'alt', 'caption', 'id', 'url', 'linkDestination', 'linkTarget', 'rel',
				'poster', 'preload', 'autoplay', 'controls', 'loop', 'muted', 'playsInline',
				'crossOrigin', 'sizeSlug', 'blob', 'mediaId', 'mediaType', 'mediaUrl',
				'aspectRatio', 'width', 'height', 'scale',
				'linkClass', 'linkText', 'showDownloadButton', 'downloadButtonText',
				'style', // Preserve ALL style attributes for media
				'mediaPosition', 'mediaType', 'mediaUrl', 'mediaId', 'mediaAlt',
				'mediaWidth', 'mediaHeight', 'mediaSize', 'mediaSizes', 'mediaSrcset',
				'videoId', 'videoUrl', 'videoAlt', 'videoPoster', 'videoAutoplay',
				'videoLoop', 'videoMuted', 'videoControls', 'videoPreload',
				'imageId', 'imageUrl', 'imageAlt', 'imageCaption', 'imageWidth', 'imageHeight',
				'imageSize', 'imageSizes', 'imageSrcset', 'imageFocalPoint',
				// Background image attributes (Cover block background images)
				'backgroundImage', 'backgroundPosition', 'backgroundSize', 'backgroundRepeat',
				'backgroundAttachment', 'backgroundClip', 'backgroundOrigin',
				// Cover block background image specific attributes
				'focalPoint', 'hasParallax', 'isRepeated', 'useFeaturedImage', 'backgroundType',
				'overlayColor', 'customOverlayColor', 'dimRatio', 'gradient', 'customGradient',
				'metadata', 'layout', 'minHeight', 'minHeightUnit',
				// Icon Block specific attributes (Nick Diego's Icon Block)
				'icon', 'iconName', 'iconLibrary', 'iconSet', 'iconSize', 'iconColor', 'iconBackgroundColor',
				'iconBorderColor', 'iconBorderRadius', 'iconBorderWidth', 'iconPadding', 'iconMargin',
				'iconRotation', 'iconFlip', 'iconAlign', 'iconLink', 'iconLinkTarget', 'iconLinkRel',
				'iconCustomSvg', 'iconCustomPath', 'iconCustomViewBox', 'iconCustomWidth', 'iconCustomHeight'
			];

			if ( isMegaZap ) {
				// MEGA ZAP: Only preserve essential content + media (if enabled)
				if ( keepMedia ) {
					// Use SHARED media attributes list
					getMediaAttributes().forEach( attr => allowList.add( attr ) );
				}
			} else {
				// SELECTIVE ZAP: Preserve based on selected options
				if ( keepMedia ) {
					// Use SAME SHARED media attributes list
					getMediaAttributes().forEach( attr => allowList.add( attr ) );
				}
				
				// Add attributes based on what's NOT selected for removal
				if ( ! zapOptions.blockSettings ) {
					['orientation', 'verticalAlignment', 'templateLock', 'allowedBlocks', 'layout', 'templateInsertUpdatesSelection'].forEach( attr => allowList.add( attr ) );
				}
				if ( ! zapOptions.blockStyles ) {
					['backgroundColor', 'textColor', 'customBackgroundColor', 'customTextColor', 'gradient', 'customGradient', 'overlayColor', 'customOverlayColor'].forEach( attr => allowList.add( attr ) );
				}
				if ( ! zapOptions.customProperties ) {
					['fontSize', 'customFontSize', 'fontFamily', 'fontStyle', 'fontWeight', 'letterSpacing', 'textDecoration', 'textTransform', 'lineHeight', 'margin', 'padding', 'blockGap', 'borderColor', 'customBorderColor', 'borderRadius', 'borderWidth', 'borderStyle', 'shadow', 'filter', 'position', 'zIndex', 'top', 'right', 'bottom', 'left'].forEach( attr => allowList.add( attr ) );
				}
				if ( ! zapOptions.customClasses ) {
					['className'].forEach( attr => allowList.add( attr ) );
				}
				if ( ! zapOptions.customAnchors ) {
					['anchor'].forEach( attr => allowList.add( attr ) );
				}
				if ( ! zapOptions.htmlElements ) {
					['align', 'nodeName'].forEach( attr => allowList.add( attr ) );
				}
			}
			
			return allowList;
		};

		// Get the allow list for this configuration
		const allowList = getAllowList( isMegaZap, keepMedia, zapOptions );
		
		
		// Build final result using allow list
		const cleanedAttributes = {};
		const removedAttributes = [];

		Object.keys( attributes ).forEach( attr => {
			if ( allowList.has( attr ) ) {
				cleanedAttributes[ attr ] = attributes[ attr ];
			} else {
				removedAttributes.push( attr );
			}
		} );

		return { cleanedAttributes, removedAttributes };
	};

	/**
	 * Create a clean version of a block based on zap mode and options
	 */
	const createCleanBlock = ( block, isMegaZap = false, keepMedia = false ) => {
		if ( ! block || ! block.name ) {
			console.warn( 'Invalid block passed to createCleanBlock:', block );
			return null;
		}

		const attributes = getBlockAttributes( block );
		
		
		const { cleanedAttributes, removedAttributes } = getCategorizedAttributes( attributes, isMegaZap, keepMedia );

		// Recursively clean inner blocks if they exist
		const cleanedInnerBlocks = [];
		if ( Array.isArray( block.innerBlocks ) ) {
			block.innerBlocks.forEach( innerBlock => {
				const cleanedInner = createCleanBlock( innerBlock, isMegaZap, keepMedia );
				if ( cleanedInner && cleanedInner.cleanBlock ) {
					cleanedInnerBlocks.push( cleanedInner.cleanBlock );
				}
			} );
		}

		// Create new block with cleaned attributes
		try {
			const newBlock = createBlock( block.name, cleanedAttributes, cleanedInnerBlocks );
			return {
				cleanBlock: newBlock,
				removedAttributes
			};
		} catch ( error ) {
			// Log error securely without exposing sensitive information
			if ( process.env.NODE_ENV === 'development' ) {
				console.error( `Error creating clean block for ${block.name}:`, error );
			}
			return null;
		}
	};

	/**
	 * Replace blocks with clean versions
	 * FIXED: Now properly passes keepMedia parameter to createCleanBlock
	 */
	const zapBlocks = ( blocks, isMegaZap = false, keepMedia = false ) => {
		if ( ! Array.isArray( blocks ) || blocks.length === 0 ) {
			return { totalZapped: 0, zapDetails: [], totalAttributesRemoved: 0 };
		}


		let totalZapped = 0;
		const zapDetails = [];
		let totalAttributesRemoved = 0;
		const replacements = [];

		blocks.forEach( ( block ) => {
			if ( ! block || ! block.clientId ) {
				console.warn( 'Invalid block in zapBlocks:', block );
				return;
			}

			const blockName = block.name ? block.name.replace('core/', '') : 'unknown';
			const attributes = getBlockAttributes( block );
			const beforeCount = Object.keys( attributes ).length;
			
			// Create a clean version of the block - CRITICAL: Pass keepMedia parameter!
			const result = createCleanBlock( block, isMegaZap, keepMedia );
			
			if ( ! result || ! result.cleanBlock ) {
				console.warn( `Could not create clean block for ${blockName}` );
				return;
			}

			const cleanBlock = result.cleanBlock;
			const removedAttrs = result.removedAttributes || [];
			const afterCount = Object.keys( cleanBlock.attributes || {} ).length;
			const removedCount = beforeCount - afterCount;

			if ( removedCount > 0 || removedAttrs.length > 0 ) {
				replacements.push({ 
					originalId: block.clientId, 
					newBlock: cleanBlock 
				});
				
				totalZapped++;
				totalAttributesRemoved += removedCount;
				
				zapDetails.push({
					name: blockName,
					before: beforeCount,
					after: afterCount,
					removed: removedCount,
					removedAttributes: removedAttrs
				});
			}
		} );

		// Perform all replacements
		replacements.forEach( ({ originalId, newBlock }) => {
			try {
				replaceBlock( originalId, newBlock );
			} catch ( error ) {
				// Log error securely without exposing sensitive information
				if ( process.env.NODE_ENV === 'development' ) {
					console.error( 'Error replacing block:', error );
				}
			}
		} );

		return { totalZapped, zapDetails, totalAttributesRemoved };
	};

	/**
	 * Handle the zap action based on selected mode
	 * FIXED: Now properly passes keepMedia to zapBlocks for both modes
	 */
	const handleZap = () => {
		setIsZapping( true );
		
		try {
			if ( ! Array.isArray( innerBlocks ) || innerBlocks.length === 0 ) {
				setZapMessage( __( '⚡ No blocks to zap! Add some blocks inside this container first.', 'block-zapper-block-wp' ) );
				return;
			}

			const isMegaZap = zapMode === 'mega';
			// CRITICAL FIX: Always use the current keepMedia setting from zapOptions
			const keepMedia = zapOptions.keepMedia;
			


			// For selective zap, check if any options are selected
			if ( ! isMegaZap ) {
				const hasAnyOption = Object.entries( zapOptions ).some( ([ key, value ]) => {
					// Skip keepMedia as it's not a destructive option
					if ( key === 'keepMedia' ) return false;
					return value === true;
				});
				
				if ( ! hasAnyOption ) {
					setZapMessage( __( '⚠️ Please select at least one zap option to continue!', 'block-zapper-block-wp' ) );
					return;
				}
			}

			// CRITICAL FIX: Pass keepMedia parameter to zapBlocks!
			const results = zapBlocks( innerBlocks, isMegaZap, keepMedia );
			setLastZapTime( new Date().toLocaleTimeString() );


			if ( results.totalZapped > 0 ) {
				let message;
				
				if ( isMegaZap ) {
					message = `💥 MEGA ZAP COMPLETE! Nuked ${results.totalAttributesRemoved} properties from ${results.totalZapped} block(s). `;
					message += 'Only essential content preserved';
					if ( keepMedia ) message += ' + media';
					message += '! 🚀';
				} else {
					// Create detailed message showing what was removed
					const activeOptions = [];
					if ( zapOptions.blockSettings ) activeOptions.push('⚙️ settings');
					if ( zapOptions.blockStyles ) activeOptions.push('🎨 styles');
					if ( zapOptions.customProperties ) activeOptions.push('🔧 properties');
					if ( zapOptions.customClasses ) activeOptions.push('📝 classes');
					if ( zapOptions.customAnchors ) activeOptions.push('⚓ anchors');
					if ( zapOptions.htmlElements ) activeOptions.push('🏷️ elements');
					
					message = `⚡ SELECTIVE ZAP COMPLETE! Removed ${results.totalAttributesRemoved} properties from ${results.totalZapped} block(s). `;
					message += `Zapped: ${activeOptions.join(', ')}.`;
					if ( keepMedia ) message += ' 📸 Media preserved.';
				}
				
				setZapMessage( __( message, 'block-zapper-block-wp' ) );
			} else {
				const noChangeMessage = isMegaZap ? 
					'✨ No properties found to mega zap! Blocks are already clean.' :
					'✨ No matching properties found to zap with your current settings!';
				setZapMessage( __( noChangeMessage, 'block-zapper-block-wp' ) );
			}
		} catch ( error ) {
			// Log error securely without exposing sensitive information
			if ( process.env.NODE_ENV === 'development' ) {
				console.error( 'Zap error:', error );
			}
			setZapMessage( __( '❌ Zap failed! Please try again or contact support if the issue persists.', 'block-zapper-block-wp' ) );
		}

		setIsZapping( false );
	};

	/**
	 * Handle zap option changes
	 */
	const handleOptionChange = ( option, value ) => {
		setZapOptions( prev => ({ ...prev, [option]: value }) );
	};

	// Count current total properties for display
	const totalProps = Array.isArray( innerBlocks ) ? innerBlocks.reduce( ( total, block ) => {
		const attributes = getBlockAttributes( block );
		return total + Object.keys( attributes ).length;
	}, 0 ) : 0;

	const blockCount = Array.isArray( innerBlocks ) ? innerBlocks.length : 0;

	// Check if any destructive options are selected (only for selective mode)
	const hasDestructiveOptions = zapOptions.blockSettings || zapOptions.blockStyles || 
									zapOptions.customProperties || zapOptions.customClasses || 
									zapOptions.customAnchors || zapOptions.htmlElements;

	// Button properties based on mode
	const getZapButtonProps = () => {
		if ( zapMode === 'mega' ) {
			return {
				label: isZapping ? __( '💥 MEGA ZAPPING...', 'block-zapper-block-wp' ) : __( '💥 MEGA ZAP!', 'block-zapper-block-wp' ),
				ariaLabel: __( 'Mega Zap: Remove all styling properties while preserving content and media', 'block-zapper-block-wp' ),
				color: '#dd0000',
				hoverColor: '#bb0000',
				activeColor: '#990000',
				disabled: isZapping || blockCount === 0
			};
		} else {
			return {
				label: isZapping ? __( '⚡ SELECTIVE ZAPPING...', 'block-zapper-block-wp' ) : __( '⚡ SELECTIVE ZAP!', 'block-zapper-block-wp' ),
				ariaLabel: hasDestructiveOptions 
					? __( 'Selective Zap: Remove selected property categories', 'block-zapper-block-wp' )
					: __( 'Select at least one zap option to enable', 'block-zapper-block-wp' ),
				color: hasDestructiveOptions ? '#ff4444' : '#ccc',
				hoverColor: '#cc3333',
				activeColor: '#aa2222',
				disabled: isZapping || blockCount === 0 || !hasDestructiveOptions
			};
		}
	};

	const buttonProps = getZapButtonProps();

	return (
		<>
			<InspectorControls>
				<PanelBody 
					title={ __( '⚡ Block Zapper Controls', 'block-zapper-block-wp' ) }
					initialOpen={ true }
				>
					<Card>
						<CardBody>
							<div style={{ marginBottom: '16px', fontSize: '14px' }}>
								<strong>📦 Container Status:</strong>
								<br />
								🧱 { blockCount } block(s) inside
								<br />
								🔢 { totalProps } total properties
								{ lastZapTime && (
									<>
										<br />
										🕐 Last zap: { lastZapTime }
									</>
								) }
							</div>
						</CardBody>
					</Card>

					<div style={{ margin: '16px 0' }}>
						<RadioControl
							label={ __( '🎯 Zap Mode', 'block-zapper-block-wp' ) }
							help={ zapMode === 'mega' ? 
								__( 'Nuclear option: removes ALL styling, keeps only content + media (if selected)', 'block-zapper-block-wp' ) :
								__( 'Choose specific types of properties to remove with granular control', 'block-zapper-block-wp' )
							}
							selected={ zapMode }
							options={ [
								{ label: '⚡ Selective Zap (choose what to remove)', value: 'selective' },
								{ label: '💥 Mega Zap (nuclear option)', value: 'mega' }
							] }
							onChange={ setZapMode }
							aria-describedby="zap-mode-description"
						/>
						<div id="zap-mode-description" className="screen-reader-text">
							{ zapMode === 'selective' 
								? __( 'Selective Zap allows you to choose specific categories to remove with granular control.', 'block-zapper-block-wp' )
								: __( 'Mega Zap is the nuclear option that removes ALL styling properties while keeping only essential content and media.', 'block-zapper-block-wp' )
							}
						</div>
					</div>

					{ zapMode === 'selective' && (
						<>
							<div className="zapper-media-option" style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#f8f9fa', border: '1px solid #e2e4e7', borderRadius: '4px' }}>
								<CheckboxControl
									label="📸 Keep images and videos (recommended)"
									checked={ zapOptions.keepMedia }
									onChange={ (value) => handleOptionChange('keepMedia', value) }
									help="Preserves media sources and related attributes"
									aria-describedby="keep-media-description"
								/>
								<div id="keep-media-description" className="screen-reader-text">
									{ __( 'When checked, preserves all media-related attributes including image sources, video settings, cover block backgrounds, and Icon Block plugin attributes.', 'block-zapper-block-wp' ) }
								</div>
							</div>

							<h4 style={{ margin: '16px 0 8px 0', fontSize: '14px', fontWeight: '600' }}>Choose What to Zap:</h4>
							
							<CheckboxControl
								label="⚙️ Block settings (layout, alignment, etc.)"
								checked={ zapOptions.blockSettings }
								onChange={ (value) => handleOptionChange('blockSettings', value) }
								help="Removes core block functionality settings"
							/>
							
							<CheckboxControl
								label="🎨 Block styles (colors, gradients, backgrounds)"
								checked={ zapOptions.blockStyles }
								onChange={ (value) => handleOptionChange('blockStyles', value) }
								help="Removes color and gradient styling"
							/>
							
							<CheckboxControl
								label="🔧 Custom properties (fonts, spacing, borders, effects)"
								checked={ zapOptions.customProperties }
								onChange={ (value) => handleOptionChange('customProperties', value) }
								help="Removes typography, margin, padding, borders, shadows"
							/>
							
							<CheckboxControl
								label="📝 Custom classes (Additional CSS class(es))"
								checked={ zapOptions.customClasses }
								onChange={ (value) => handleOptionChange('customClasses', value) }
								help="Removes custom CSS classes from Advanced panel"
							/>
							
							<CheckboxControl
								label="⚓ Custom anchors (HTML anchor)"
								checked={ zapOptions.customAnchors }
								onChange={ (value) => handleOptionChange('customAnchors', value) }
								help="Removes HTML anchor IDs from Advanced panel"
							/>
							
							<CheckboxControl
								label="🏷️ HTML element selections (alignment, tags)"
								checked={ zapOptions.htmlElements }
								onChange={ (value) => handleOptionChange('htmlElements', value) }
								help="Removes alignment and HTML element choices"
							/>
						</>
					) }

					{ zapMode === 'mega' && (
						<>
							<div style={{ padding: '16px', backgroundColor: '#fff3cd', border: '1px solid #ffeaa7', borderRadius: '4px', margin: '16px 0' }}>
								<h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600', color: '#856404' }}>💥 Mega Zap Mode</h4>
								<p style={{ margin: '0', fontSize: '13px', color: '#856404' }}>
									<strong>Warning:</strong> This will remove ALL styling properties and customizations from blocks, keeping only essential content.
								</p>
							</div>

							<div className="zapper-media-option zapper-mega-media-option" style={{ padding: '12px', backgroundColor: '#f8f9fa', border: '1px solid #e2e4e7', borderRadius: '4px', marginTop: '16px' }}>
								<CheckboxControl
									label="📸 Keep images and videos (recommended)"
									checked={ zapOptions.keepMedia }
									onChange={ (value) => handleOptionChange('keepMedia', value) }
									help="Preserves media sources and related attributes during mega zap"
								/>
							</div>
						</>
					) }

					<div style={{ marginTop: '16px', marginBottom: '8px' }}>
						<Button
							variant="secondary"
							onClick={ handleZap }
							isBusy={ isZapping }
							disabled={ buttonProps.disabled }
							aria-label={ buttonProps.ariaLabel }
							aria-describedby="zap-button-description"
							style={ {
								backgroundColor: isZapping ? '#999' : buttonProps.color,
								color: '#fff',
								border: 'none',
								borderRadius: '4px',
								padding: '12px 24px',
								fontWeight: 'bold',
								textTransform: 'uppercase',
								fontSize: '16px',
								width: '100%'
							} }
						>
							{ buttonProps.label }
						</Button>
						<div id="zap-button-description" className="screen-reader-text">
							{ zapMode === 'mega' 
								? __( 'Mega Zap will remove all styling properties while preserving content and media if selected.', 'block-zapper-block-wp' )
								: __( 'Selective Zap will remove only the selected property categories.', 'block-zapper-block-wp' )
							}
						</div>
						{ zapMode === 'selective' && !hasDestructiveOptions && (
							<p style={{ fontSize: '12px', color: '#666', marginTop: '8px', textAlign: 'center' }}>
								Select at least one zap option to enable
							</p>
						) }
						{ zapMode === 'mega' && blockCount === 0 && (
							<p style={{ fontSize: '12px', color: '#666', marginTop: '8px', textAlign: 'center' }}>
								Add blocks to the container to enable mega zap
							</p>
						) }
					</div>
					
					{ zapMessage && (
						<Notice 
							status={ zapMessage.includes('COMPLETE') ? 'success' : zapMessage.includes('failed') ? 'error' : 'info' }
							isDismissible={ true }
							onRemove={ () => setZapMessage('') }
							style={ { marginTop: '12px', fontSize: '13px' } }
						>
							{ zapMessage }
						</Notice>
					) }
				</PanelBody>
			</InspectorControls>
			<div { ...blockProps }>
				<InnerBlocks
					tmplateLock={ false }
					renderAppender={ InnerBlocks.DefaultAppender }
				/>
			</div>
		</>
	);
}