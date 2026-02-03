/**
 * WordPress dependencies
 */
const { test, expect } = require( '@playwright/test' );

/**
 * activatePlugin( slug ) - Activates an installed plugin.
 *
 * @param {string} slug Plugin slug.
 */
test.describe( 'Admin can login and make sure stellarpay extension is activated', async () => {
    // Set admin as logged-in user.
    test.use( { storageState: process.env.ADMINSTATE } );

    test( 'Can activate gateway stellarpay extension if it is deactivated', async ( { page } ) => {
        await page.goto( '/wp-admin/plugins.php' );

        // Addon is active by default in the test environment, so we need to validate that it is activated.
        await expect(
            page.getByRole( 'link', {
                name: 'Deactivate StellarPay - Stripe Payment Gateway for WooCommerce',
                exact: true,
            } )
        ).toBeVisible();
    } );

    test( 'Should display the Deactivate link element with the expected ID attribute', async ( { page } ) => {
        await page.goto( '/wp-admin/plugins.php' );

        // StellarPay plugin relies on an expected ID attribute to show the Deactivation modal.
        await expect( page.locator( '#deactivate-stellarpay' ) ).toHaveCount( 1 );
    } );

    test( 'Should display the Deactivation modal when the button Deactivate is clicked', async ( { page } ) => {
        await page.goto( '/wp-admin/plugins.php' );

        await page.locator( '#deactivate-stellarpay' ).click();

        await expect( page.locator( '#stellarpay-deactivation-modal > div' ) ).toBeVisible();
    } );
} );
