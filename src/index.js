
/**
 * Registers a new block provided a unique name and an object defining its behavior.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
import { registerBlockType } from '@wordpress/blocks';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * All files containing `style` keyword are bundled together. The code used
 * gets applied both to the front of your site and to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './style.scss';

/**
 * Internal dependencies
 */
import Edit from './edit';
import metadata from './block.json';

/**
 * Every block starts by registering a new block type definition.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
registerBlockType( metadata.name, {
	/**
	 * @see ./edit.js
	 */
	icon: {
		src: <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 914.61 846.29'>
			<path d='M101.91,754.06C48.37,749.16,4.83,705.87,0,652.08V106.15C4.52,48.8,46.56,4.31,104.6.01h578.95c43.64,3.36,70.39,32.99,71.83,76.04l-52.05,251.06h188.16c4.71,0,18.2,13.44,20.38,17.93,4.26,8.78,2.88,13.8.4,22.71l-319.15,472.45c-12.49,9.19-35.13,8.72-42.38-6.78-7.8-16.65,9.69-60.53,11.65-79.38H101.91ZM614.38,513.22h-175.84c-16.38,0-28.22-30.55-17.35-43.35,81.72-125.74,174.5-245.93,255.67-371.65,13.33-20.64,28.06-37.68-9.73-40.75H116.9c-34.08.7-55.14,18.57-58.06,52.78l-.07,535.06c2.56,28.24,19.42,46.4,47.18,51.35l468.69-.15,39.76-183.29ZM483.02,465.33h162.16c11.86,0,23.61,16.39,21.19,28l-47.2,223.78,229.22-340.73h-175.84c-11.59,0-24.15-13.34-23.97-25.23l39.73-183.43-2.73-.69-202.55,298.3Z' style={{fill:'#2b2d2d'}}/>
			<path d='M483.02,465.33l202.55-298.3,2.73.69-39.73,183.43c-.18,11.89,12.39,25.23,23.97,25.23h175.84l-229.22,340.73,47.2-223.78c2.42-11.61-9.33-28-21.19-28h-162.16Z' style={{fill:'#fdce45'}}/>
		</svg>
	},
	edit: Edit,
} );
	