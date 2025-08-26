/**
 * Webpack configuration for Kadence Blocks v4.0
 * This builds only the new KBS (Kadence Blocks System) blocks
 */

// Set environment variable to build only v4
process.env.KADENCE_BUILD_VERSION = 'v4';

// Use the main webpack config with v4 setting
module.exports = require('./webpack.config.js');
