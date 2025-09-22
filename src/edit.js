/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

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
			console.error( 'Error getting inner blocks:', error );
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
	 * FINAL FIX: Completely rewritten Mega Zap logic for proper media preservation
	 */
	const getCategorizedAttributes = ( attributes, isMegaZap = false, keepMedia = true ) => {
		// Define attribute categories
		const categories = {
			essential: [
				// Core content that should ALWAYS be preserved
				'content', 'url', 'alt', 'caption', 'href', 'text', 'level', 'tagName', 'value',
				'label', 'placeholder', 'title', 'type', 'checked', 'selected', 'disabled',
				'required', 'multiple', 'name', 'id', 'headers', 'scope'
			],
			media: [
				// Media-related attributes - ABSOLUTE PRIORITY when keepMedia is true
				'src', 'poster', 'preload', 'autoplay', 'controls', 'loop', 'muted',
				'playsInline', 'crossOrigin', 'sizeSlug', 'blob', 'mediaId', 'mediaType',
				'focalPoint', 'hasParallax', 'isRepeated', 'minHeight', 'minHeightUnit',
				// Additional media attributes that might be categorized elsewhere
				'aspectRatio', 'width', 'height', 'scale'
			],
			blockSettings: [
				// Core block functionality
				'orientation', 'verticalAlignment', 'templateLock', 'allowedBlocks',
				'layout', 'templateInsertUpdatesSelection'
			],
			blockStyles: [
				// Visual styling (excluding media attributes)
				'backgroundColor', 'textColor', 'customBackgroundColor', 'customTextColor',
				'gradient', 'customGradient', 'overlayColor', 'customOverlayColor'
			],
			customProperties: [
				// Typography, spacing, borders, effects (excluding media dimensions)
				'fontSize', 'customFontSize', 'fontFamily', 'fontStyle', 'fontWeight',
				'letterSpacing', 'textDecoration', 'textTransform', 'lineHeight',
				'style', 'margin', 'padding', 'blockGap', 'borderColor', 'customBorderColor',
				'borderRadius', 'borderWidth', 'borderStyle', 'shadow', 'filter',
				'position', 'zIndex', 'top', 'right', 'bottom', 'left'
			],
			customClasses: [
				'className'
			],
			customAnchors: [
				'anchor'
			],
			htmlElements: [
				// HTML element selection and alignment
				'align', 'nodeName'
			]
		};

		// COMPLETELY REWRITTEN MEGA ZAP LOGIC
		if ( isMegaZap ) {
			console.log( 'MEGA ZAP MODE - Starting with keepMedia:', keepMedia );
			
			// In Mega Zap, start with empty sets
			const toKeep = new Set();
			const toRemove = new Set();

			// STEP 1: Always preserve essential attributes
			categories.essential.forEach( attr => {
				if ( attributes.hasOwnProperty( attr ) ) {
					toKeep.add( attr );
				}
			} );

			// STEP 2: Handle media preservation FIRST
			if ( keepMedia ) {
				categories.media.forEach( attr => {
					if ( attributes.hasOwnProperty( attr ) ) {
						toKeep.add( attr );
						console.log( `MEGA ZAP: Preserving media attribute: ${attr}` );
					}
				} );
			}

			// STEP 3: Everything else gets removed (unless already marked to keep)
			Object.keys( attributes ).forEach( attr => {
				if ( ! toKeep.has( attr ) ) {
					toRemove.add( attr );
					console.log( `MEGA ZAP: Will remove attribute: ${attr}` );
				}
			} );

			// Build final result for Mega Zap
			const cleanedAttributes = {};
			const removedAttributes = [];

			Object.keys( attributes ).forEach( attr => {
				if ( toKeep.has( attr ) ) {
					cleanedAttributes[ attr ] = attributes[ attr ];
				} else {
					removedAttributes.push( attr );
				}
			} );

			console.log( 'MEGA ZAP FINAL RESULT:', {
				keepMedia,
				originalCount: Object.keys( attributes ).length,
				keptCount: Object.keys( cleanedAttributes ).length,
				removedCount: removedAttributes.length,
				keptAttributes: Object.keys( cleanedAttributes ),
				removedAttributes,
				mediaAttributesFound: categories.media.filter( attr => attributes.hasOwnProperty( attr ) ),
				mediaAttributesKept: categories.media.filter( attr => cleanedAttributes.hasOwnProperty( attr ) ),
				mediaAttributesRemoved: categories.media.filter( attr => removedAttributes.includes( attr ) )
			} );

			return { cleanedAttributes, removedAttributes };
		}

		// SELECTIVE ZAP MODE (unchanged - this was working correctly)
		// STEP 1: Always preserve essential content
		const toKeep = new Set( categories.essential );

		// STEP 2: ABSOLUTE PRIORITY for media - this overrides everything else
		if ( keepMedia ) {
			categories.media.forEach( attr => toKeep.add( attr ) );
		}

		// STEP 3: Build the "to remove" set based on zap options
		const toRemove = new Set();

		// Selective zap: only add attributes from selected categories
		if ( zapOptions.blockSettings ) {
			categories.blockSettings.forEach( attr => {
				// Respect keepMedia even in selective mode
				if ( ! ( keepMedia && categories.media.includes( attr ) ) ) {
					toRemove.add( attr );
				}
			} );
		}
		if ( zapOptions.blockStyles ) {
			categories.blockStyles.forEach( attr => {
				if ( ! ( keepMedia && categories.media.includes( attr ) ) ) {
					toRemove.add( attr );
				}
			} );
		}
		if ( zapOptions.customProperties ) {
			categories.customProperties.forEach( attr => {
				if ( ! ( keepMedia && categories.media.includes( attr ) ) ) {
					toRemove.add( attr );
				}
			} );
		}
		if ( zapOptions.customClasses ) {
			categories.customClasses.forEach( attr => toRemove.add( attr ) );
		}
		if ( zapOptions.customAnchors ) {
			categories.customAnchors.forEach( attr => toRemove.add( attr ) );
		}
		if ( zapOptions.htmlElements ) {
			categories.htmlElements.forEach( attr => toRemove.add( attr ) );
		}

		// STEP 4: Build final result
		const cleanedAttributes = {};
		const removedAttributes = [];

		Object.keys( attributes ).forEach( key => {
			if ( toRemove.has( key ) && ! toKeep.has( key ) ) {
				removedAttributes.push( key );
			} else {
				cleanedAttributes[ key ] = attributes[ key ];
			}
		} );

		// Debug logging for selective mode
		console.log( 'SELECTIVE ZAP debug:', {
			isMegaZap,
			keepMedia,
			zapOptions,
			originalAttributeCount: Object.keys( attributes ).length,
			toKeepCount: toKeep.size,
			toRemoveCount: toRemove.size,
			cleanedAttributeCount: Object.keys( cleanedAttributes ).length,
			removedAttributeCount: removedAttributes.length,
			mediaAttributesKept: categories.media.filter( attr => attributes.hasOwnProperty( attr ) && ! toRemove.has( attr ) ),
			mediaAttributesRemoved: categories.media.filter( attr => attributes.hasOwnProperty( attr ) && toRemove.has( attr ) )
		} );

		return { cleanedAttributes, removedAttributes };
	};

	/**
	 * Create a clean version of a block based on zap mode and options
	 */
	const createCleanBlock = ( block, isMegaZap = false, keepMedia = true ) => {
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
			console.error( `Error creating clean block for ${block.name}:`, error );
			return null;
		}
	};

	/**
	 * Replace blocks with clean versions
	 * FIXED: Now properly passes keepMedia parameter to createCleanBlock
	 */
	const zapBlocks = ( blocks, isMegaZap = false, keepMedia = true ) => {
		if ( ! Array.isArray( blocks ) || blocks.length === 0 ) {
			return { totalZapped: 0, zapDetails: [], totalAttributesRemoved: 0 };
		}

		console.log( 'zapBlocks called with:', { isMegaZap, keepMedia, blockCount: blocks.length } );

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
				console.error( 'Error replacing block:', error );
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

			console.log( 'handleZap starting with:', { 
				zapMode, 
				isMegaZap, 
				keepMedia, 
				zapOptions 
			} );

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

			// Log detailed results to console for debugging
			console.log( 'Block Zapper Results (MEGA ZAP ULTIMATE FIX):', {
				mode: zapMode,
				isMegaZap,
				keepMediaUsed: keepMedia,
				options: zapOptions,
				totalBlocks: innerBlocks.length,
				blocksZapped: results.totalZapped,
				totalAttributesRemoved: results.totalAttributesRemoved,
				details: results.zapDetails
			} );

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
			console.error( 'Zap error:', error );
			setZapMessage( __( '❌ Zap failed! Check the console for details: ' + ( error.message || 'Unknown error' ), 'block-zapper-block-wp' ) );
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
				color: '#dd0000',
				hoverColor: '#bb0000',
				activeColor: '#990000',
				disabled: isZapping || blockCount === 0
			};
		} else {
			return {
				label: isZapping ? __( '⚡ SELECTIVE ZAPPING...', 'block-zapper-block-wp' ) : __( '⚡ SELECTIVE ZAP!', 'block-zapper-block-wp' ),
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
						/>
					</div>

					{ zapMode === 'selective' && (
						<>
							<div className="zapper-media-option" style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#f8f9fa', border: '1px solid #e2e4e7', borderRadius: '4px' }}>
								<CheckboxControl
									label="📸 Keep images and videos (recommended)"
									checked={ zapOptions.keepMedia }
									onChange={ (value) => handleOptionChange('keepMedia', value) }
									help="Preserves media sources and related attributes"
								/>
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