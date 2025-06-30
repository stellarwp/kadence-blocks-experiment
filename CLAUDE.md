# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Kadence Blocks is a WordPress Gutenberg block plugin that extends the block editor with 20+ custom blocks and advanced page builder features. The codebase contains both the stable block system and an experimental KBS (Kadence Blocks System) for Full Site Editing.

## Important Context

This plugin is currently being rebuilt from the ground up to align closely with WordPress Gutenberg core architecture. When working on this codebase:

1. **Follow Gutenberg Core Patterns**: All new code should follow WordPress Gutenberg core patterns and conventions as closely as possible
2. **New Code Locations**:
    - New PHP code: `/inc/` folder (follows WordPress core structure)
    - New JavaScript blocks: `/src/kbs-blocks/` folder
    - New JavaScript packages: `/src/kbs-packages/` folder
3. **Legacy vs New**: The `/src/blocks/` folder contains the legacy implementation. Focus development efforts on the KBS system unless specifically working on legacy block compatibility

## Essential Commands

### Development

```bash
# Install dependencies
npm install
composer install

# Start development mode (watches files)
npm start

# Build for production
npm run build

# Lint JavaScript
npm run lint-js

# Format code
npm run format

# Run PHP CodeSniffer
composer phpcs

# Check PHP compatibility (7.4 - 8.3)
composer compatibility
```

### Testing

```bash
# Run all PHP tests
vendor/bin/codecept run

# Run specific test suite
vendor/bin/codecept run wpunit
vendor/bin/codecept run acceptance

# Run tests with coverage
vendor/bin/codecept run wpunit --coverage
```

## Architecture Overview

### Directory Structure

- `/src/blocks/` - Original Gutenberg blocks (accordion, gallery, forms, etc.)
- `/src/kbs-blocks/` - Experimental FSE blocks with global styles inheritance
- `/src/packages/` - Shared JavaScript packages (components, helpers, icons)
- `/src/kbs-packages/` - Experimental packages for the new block system
- `/inc/KadenceBlocks/` - PHP backend (PSR-4 autoloaded, namespace: KadenceWP\KadenceBlocks)
- `/dist/` - Compiled assets (do not edit directly)

### Key Architectural Patterns

1. **Block Registration**: Blocks are registered via PHP in `/inc/KadenceBlocks/Blocks/` with corresponding JavaScript in `/src/blocks/`

2. **Global Styles System**: KBS blocks implement a sophisticated inheritance system where styles cascade from global → block type → individual block. See `/inc/KadenceBlocks/Blocks/KBS/README-global-styles.md` for details.

3. **Service Provider Pattern**: Core functionality is organized into service providers registered in `/inc/class-kadence-blocks-frontend.php`

4. **Asset Loading**: Intelligent loading system only enqueues CSS/JS when blocks are actually used on a page

5. **Build System**:
    - Webpack (@wordpress/scripts) handles JavaScript bundling
    - Gulp processes additional CSS/JS tasks
    - Both run concurrently via `npm start`

### Important Considerations

1. **WordPress Compatibility**: Minimum WordPress 6.6, PHP 7.4+
2. **Vendor Prefixing**: Uses Strauss to prefix vendor dependencies to avoid conflicts
3. **Block Manifest**: Generated during build process for block registration
4. **React Components**: Follow WordPress Gutenberg patterns and use @wordpress packages
5. **CSS Generation**: Dynamic CSS is generated based on block attributes using helper functions in `/src/kbs-packages/helpers/src/css-generator/`

### Gutenberg Core Alignment Guidelines

When developing new features:

1. **Use WordPress Core Components**: Prefer @kadence/kbsComponents over @wordpress/components but relay on Core Components when possible
2. **Follow Block API Patterns**: Use supports API, block.json configuration, and standard attribute structures
3. **Naming Conventions**: Follow WordPress naming patterns (kebab-case for block names, camelCase for attributes)
4. **Data Store**: Use @wordpress/data patterns for state management
5. **Styling**: Follow core block styling patterns with editor.scss and style.scss separation
6. **PHP Structure**: Mirror WordPress core's approach to block registration and rendering

### Current Development Focus

The experimental KBS system (`/src/kbs-blocks/`) is being developed for Full Site Editing support with features like:

- Global styles inheritance
- Advanced spacing and border controls
- Preset system for consistent design
- Style book for managing global design tokens

When working on KBS blocks, ensure compatibility with the global styles inheritance system and follow the patterns established in existing KBS blocks.
