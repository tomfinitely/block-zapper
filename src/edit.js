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
import { PanelBody, Button, Notice } from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import { useState, useEffect } from '@wordpress/element';

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
	const { clientId } = props;
	const blockProps = useBlockProps();
	const [ isZapping, setIsZapping ] = useState( false );
	const [ zapMessage, setZapMessage ] = useState( '' );
	const [ lastZapTime, setLastZapTime ] = useState( null );

	const { updateBlockAttributes, replaceBlock } = useDispatch( 'core/block-editor' );
	const { createBlock } = useDispatch( 'core/blocks' );

	// Get inner blocks with more detailed information
	const innerBlocks = useSelect( ( select ) => {
		return select( 'core/block-editor' ).getBlocks( clientId );
	}, [ clientId ] );

	// Clear message after timeout
	useEffect( () => {
		if ( zapMessage ) {
			const timeout = setTimeout( () => {
				setZapMessage( '' );
			}, 7000 );
			return () => clearTimeout( timeout );
		}
	}, [ zapMessage ] );

	/**
	 * Create a completely clean version of a block with only essential content
	 */
	const createCleanBlock = ( block ) => {
		const essentialAttributes = ['content', 'url', 'alt', 'caption', 'href', 'text', 'level', 'tagName', 'value', 'label', 'placeholder', 'id', 'title', 'src', 'type', 'checked', 'selected', 'disabled', 'required', 'multiple', 'name'];
		
		// Only keep essential content attributes
		const cleanedAttributes = {};
		essentialAttributes.forEach( key => {
			if ( block.attributes[ key ] !== undefined ) {
				cleanedAttributes[ key ] = block.attributes[ key ];
			}
		} );

		// Recursively clean inner blocks
		const cleanedInnerBlocks = block.innerBlocks ? 
			block.innerBlocks.map( innerBlock => createCleanBlock( innerBlock ) ) : 
			[];

		// Create new block with clean attributes
		const { createBlock } = wp.blocks;
		return createBlock( block.name, cleanedAttributes, cleanedInnerBlocks );
	};

	/**
	 * Replace blocks with completely clean versions
	 */
	const zapAllBlocks = ( blocks ) => {
		let totalZapped = 0;
		const zapDetails = [];

		blocks.forEach( ( block ) => {
			const blockName = block.name.replace('core/', '');
			const beforeProps = Object.keys( block.attributes ).length;
			
			// Create a completely clean version of the block
			const cleanBlock = createCleanBlock( block );
			const afterProps = Object.keys( cleanBlock.attributes ).length;
			const removedCount = beforeProps - afterProps;

			if ( removedCount > 0 ) {
				// Replace the block entirely with the clean version
				replaceBlock( block.clientId, cleanBlock );
				totalZapped++;
				
				zapDetails.push({
					name: blockName,
					before: beforeProps,
					after: afterProps,
					removed: removedCount
				});
			}
		} );

		return { totalZapped, zapDetails };
	};

	/**
	 * Handle the zap action with block replacement for immediate visual feedback
	 */
	const handleZap = () => {
		setIsZapping( true );
		
		try {
			if ( innerBlocks.length === 0 ) {
				setZapMessage( __( '⚡ No blocks to zap! Add some blocks inside this container first.', 'block-zapper-block-wp' ) );
			} else {
				const results = zapAllBlocks( innerBlocks );
				setLastZapTime( new Date().toLocaleTimeString() );

				// Log detailed results to console for debugging
				console.log( 'Block Zapper Results:', {
					totalBlocks: innerBlocks.length,
					blocksZapped: results.totalZapped,
					details: results.zapDetails
				} );

				if ( results.totalZapped > 0 ) {
					const totalPropsRemoved = results.zapDetails.reduce( (total, d) => total + d.removed, 0 );
					const detailText = results.zapDetails.map( d => 
						`${d.name}: ${d.removed} props removed`
					).join( ', ' );
					
					setZapMessage( 
						__( `⚡ ZAP COMPLETE! Removed ${totalPropsRemoved} properties from ${results.totalZapped} block(s). Details: ${detailText}`, 'block-zapper-block-wp' )
					);
				} else {
					setZapMessage( __( '✨ All blocks are already clean! No custom properties found to remove.', 'block-zapper-block-wp' ) );
				}
			}
		} catch ( error ) {
			console.error( 'Zap error:', error );
			setZapMessage( __( '❌ Zap failed! Check the console for details: ' + error.message, 'block-zapper-block-wp' ) );
		}

		setIsZapping( false );
	};

	// Count current total properties for display
	const totalProps = innerBlocks.reduce( ( total, block ) => {
		return total + Object.keys( block.attributes ).length;
	}, 0 );

	return (
		<>
			<InspectorControls>
				<PanelBody 
					title={ __( '⚡ Block Zapper Controls', 'block-zapper-block-wp' ) }
					initialOpen={ true }
				>
					<div style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
						<strong>Container Status:</strong>
						<br />
						📦 { innerBlocks.length } block(s) inside
						<br />
						🎨 { totalProps } total properties
						{ lastZapTime && (
							<>
								<br />
								🕐 Last zap: { lastZapTime }
							</>
						) }
					</div>
					<p style={{ fontSize: '14px', marginBottom: '12px' }}>
						{ __( 'This will completely replace all blocks inside with clean versions, removing ALL styling: colors, fonts, spacing, borders, alignments, and custom classes. Only content will be preserved!', 'block-zapper-block-wp' ) }
					</p>
					<Button
						variant="secondary"
						onClick={ handleZap }
						isBusy={ isZapping }
						disabled={ isZapping || innerBlocks.length === 0 }
						style={ {
							backgroundColor: isZapping ? '#999' : '#ff4444',
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
						{ isZapping ? __( '⚡ ZAPPING...', 'block-zapper-block-wp' ) : __( '⚡ ZAP!', 'block-zapper-block-wp' ) }
					</Button>
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
					templateeLock={ false }
					renderAppender={ InnerBlocks.DefaultAppender }
				/>
			</div>
		</>
	);
}