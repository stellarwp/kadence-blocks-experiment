# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Kadence Blocks is a WordPress Gutenberg block plugin that extends the block editor with 20+ custom blocks and advanced page builder features. The codebase contains both the original block system and a new KBS (Kadence Blocks System) for Kadence Blocks 4.0 that will eventually replace the old code once it's complete.

## Important Context

This plugin is currently being rebuilt from the ground up with more fixed standards for attributes and output. Also all new components and designs in the editor. The goal is to align closely with WordPress Gutenberg core architecture when possible but extend well beyond core in features and options in components. When working on this codebase:

1. **Follow Gutenberg Core Patterns**: All new code should follow WordPress Gutenberg core patterns and conventions when possible
2. **New Code Locations**:
    - New PHP code: `/inc/` folder (follows WordPress core structure)
    - New JavaScript blocks: `/src/kbs-blocks/` folder
    - New JavaScript packages: `/src/kbs-packages/` folder
    - New JavaScript plugins: `/src/kbs-plugins/` folder
3. **Legacy vs New**: The `/src/blocks/` folder contains the legacy implementation. Focus development efforts on the KBS system unless specifically working on legacy block compatibility

## Standard Workflow
1. First think through the problem, read the codebase for relevant files, and write a plan to tasks/todo.md.
2. The plan should have a list of todo items that you can check off as you complete them
3. Before you begin working, check in with me and I will verify the plan.
4. Then, begin working on the todo items, marking them as complete as you go.
5. Please every step of the way just give me a high level explanation of what changes you made
6. Make every task and code change you do as simple as possible. We want to avoid making any massive or complex changes. Every change should impact as little code as possible. Everything is about simplicity.
7. Finally, add a review section to the [todo.md](http://todo.md/) file with a summary of the changes you made and any other relevant information.

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

1. **Block Registration**: Blocks are registered via PHP in `/inc/KadenceBlocks/Blocks/` with corresponding JavaScript in `/src/kbs-blocks/`

2. **Global Styles System**: KBS blocks implement a sophisticated inheritance system where styles cascade from global → block type → individual block. See `/inc/KadenceBlocks/Blocks/KBS/README-global-styles.md` for details.

3. **Service Provider Pattern**: Core functionality is organized into service providers registered in `/inc/Core.php`

4. **Asset Loading**: Intelligent loading system only enqueues CSS/JS when blocks are actually used on a page

5. **Build System**:
    - Webpack (@wordpress/scripts) handles JavaScript bundling
    - Gulp processes additional CSS/JS tasks
    - Both run concurrently via `npm start`

### Important Considerations

1. **WordPress Compatibility**: Minimum WordPress 6.7, PHP 8.0+
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

### Current Development Focus

The KBS system (`/src/kbs-blocks/`) is being developed to replace the old system and will support new features like:

- Global styles inheritance
- Advanced controls
- Preset system for consistent design
- Style book for managing global design settings

When working on KBS blocks, ensure compatibility with the global styles inheritance system and follow the patterns established in existing KBS blocks.
