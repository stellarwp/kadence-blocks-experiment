/* eslint-disable no-console */
/**
 * External dependencies
 */
const { chromium, expect } = require('@playwright/test');

/**
 * Internal dependencies
 */
const fs = require('fs');
const { admin } = require('./config/users');

module.exports = async (config) => {
	const { stateDir, baseURL, userAgent } = config.projects[0].use;

	console.log(`State Dir: ${stateDir}`);
	console.log(`Base URL: ${baseURL}`);

	// used throughout tests for authentication
	process.env.ADMINSTATE = `${stateDir}adminState.json`;
	process.env.baseURL = baseURL;

	// Clear out the previous save states
	try {
		fs.unlinkSync(process.env.ADMINSTATE);
		console.log('Admin state file deleted successfully.');
	} catch (err) {
		if (err.code === 'ENOENT') {
			console.log('Admin state file does not exist.');
		} else {
			console.log('Admin state file could not be deleted: ' + err);
		}
	}

	// Pre-requisites
	let adminLoggedIn = false;

	// Specify user agent when running against an external test site to avoid getting HTTP 406 NOT ACCEPTABLE errors.
	const contextOptions = { baseURL, userAgent };

	// Create browser, browserContext, and page for customer and admin users
	const browser = await chromium.launch();
	const adminContext = await browser.newContext(contextOptions);
	const adminPage = await adminContext.newPage();

	// Sign in as admin user and save state
	const adminRetries = 5;
	for (let i = 0; i < adminRetries; i++) {
		try {
			console.log('Trying to log-in as admin...');

			// Login to admin.
			const waitForNavigationPromise = adminPage.waitForURL('**/wp-admin/');
			await adminPage.goto('/wp-login.php', {
				waitUntil: 'networkidle',
			});
			const usernameLocator = await adminPage.locator('input[name="log"]');
			await usernameLocator.fill(admin.username);
			const passwordLocator = await adminPage.locator('input[name="pwd"]');
			await passwordLocator.fill(admin.password);
			const submitButtonLocator = await adminPage.getByRole('button', { name: 'Log In' });
			await submitButtonLocator.click();
			await waitForNavigationPromise;

			// Check if logged in successfully.
			const mainHeadingLocator = await adminPage.locator('.wrap > h1');
			await expect(await mainHeadingLocator.evaluate((el) => el.textContent)).toBe('Dashboard');

			// Save state.
			await adminPage.context().storageState({ path: process.env.ADMINSTATE });

			console.log('Logged-in as admin successfully.');
			adminLoggedIn = true;

			break;
		} catch (e) {
			console.log(`Admin log-in failed, Retrying... ${i}/${adminRetries}`);
			console.log(e);
		}
	}

	if (!adminLoggedIn) {
		console.error(
			'Cannot proceed e2e test, as admin login failed. Please check if the test site has been setup correctly.'
		);
		process.exit(1);
	}

	await adminContext.close();
	await browser.close();
};
