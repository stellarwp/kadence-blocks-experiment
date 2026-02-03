/**
 * WordPress dependencies
 */
const { test, expect } = require( '@playwright/test' );

/**
 * activatePlugin( slug ) - Activates an installed plugin.
 *
 * @param {string} slug Plugin slug.
 */
test.describe( 'Admin can login and make sure kadence blocks extension is activated', async () => {
    // Set admin as logged-in user.
    test.use( { storageState: process.env.ADMINSTATE } );

    test( 'Can activate gateway kadence blocks extension if it is deactivated', async ( { page } ) => {
        await page.goto( '/wp-admin/plugins.php' );

        // Addon is active by default in the test environment, so we need to validate that it is activated.
        await expect(
            page.getByRole( 'link', {
                name: 'Deactivate Kadence Blocks – Gutenberg Blocks for Page Builder Features',
                exact: true,
            } )
        ).toBeVisible();
    } );

    test( 'Should display the Deactivate link element with the expected ID attribute', async ( { page } ) => {
        await page.goto( '/wp-admin/plugins.php' );

        // Kadence Blocks plugin relies on an expected ID attribute to show the Deactivation modal.
        await expect( page.locator( '#deactivate-kadence-blocks' ) ).toHaveCount( 1 );
    } );
} );
