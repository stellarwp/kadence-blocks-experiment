# E2E Testing

## Overview

This document explains how to organize end-to-end tests for this plugin. The structure is designed to test blocks individually, in combination, and verify they work correctly in both the block editor (backend) and the published page (frontend).

## Directory Structure

```
tests/e2e/
├── specs/                          # All test files
│   ├── setup/                      # Generic WordPress/theme tests
│   │   ├── theme-activation.spec.js
│   │   ├── plugin-compatibility.spec.js
│   │   └── editor-access.spec.js
│   ├── blocks/                     # Block-specific tests
│   │   ├── individual/             # Single block tests (your custom blocks)
│   │   │   ├── hero.spec.js
│   │   │   ├── testimonial.spec.js
│   │   │   ├── card.spec.js
│   │   │   ├── cta.spec.js
│   │   │   └── pricing-table.spec.js
│   │   └── combinations/           # Testing blocks together
│   │       ├── hero-with-buttons.spec.js
│   │       ├── columns-with-cards.spec.js
│   │       └── nested-containers.spec.js
│   ├── templates/                  # Full template tests
│   │   ├── front-page.spec.js
│   │   ├── single-post.spec.js
│   │   └── archive.spec.js
│   └── patterns/                   # Block pattern tests
│       ├── header-pattern.spec.js
│       └── footer-pattern.spec.js
├── fixtures/                       # Test data and assets
│   ├── blocks/
│   │   ├── hero-variations.json
│   │   └── combination-setups.json
│   └── media/
│       ├── test-image.jpg
│       └── test-video.mp4
├── utils/                          # Helper functions
│   ├── editor.js                   # Editor-specific actions
│   ├── frontend.js                 # Frontend-specific actions
│   ├── block-actions.js            # Common block operations
│   └── assertions.js               # Reusable test assertions
└── playwright.config.js            # Playwright configuration
```

## Running Tests

Prior to running tests, ensure the WordPress test environment is up and running.
Use the following command to start the environment:

```bash
# Start the test environment
npm run e2e:start
```

> [!TIP]
> Desktop docker environment should be running.


Use following commands to run the tests, view reports, and generate code snippets:

```bash
# Run all tests
npm run test:e2e

# Run with UI mode (helpful for debugging)
npm run test:e2e-debug

# Generate code snippets
npm run test:e2e-codegen

# View test reports
npm run test:e2e-report
```

## Conclusion

This structure keeps your tests organized, maintainable, and comprehensive. By separating individual blocks from combinations, and always testing both editor and frontend, you ensure your block theme works perfectly for both content creators and website visitors.