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

## Key Concepts

### 1. Separation by Test Type

**Setup Tests** (`specs/setup/`)
- Generic WordPress plugin tests
- Plugin activation/deactivation
- Plugin compatibility checks
- Editor availability and access
- Global settings verification
- Example: Testing that your plugin activates without errors, or that it works with common plugins like WooCommerce

**Individual Block Tests** (`specs/blocks/individual/`)
- Test one block at a time
- Verify all block settings and variations
- Check both editor appearance and frontend output
- Example: Testing that a hero block displays the correct title, background image, and alignment

**Combination Tests** (`specs/blocks/combinations/`)
- Test how blocks work together
- Verify nested blocks (InnerBlocks)
- Check complex layouts
- Example: Testing a hero block that contains button blocks inside it

**Template Tests** (`specs/templates/`)
- Test complete page templates
- Verify full page layouts
- Example: Testing that your homepage template displays correctly with all blocks

### 2. Focus on Your Custom Blocks

**Individual Block Tests** (`specs/blocks/individual/`)
- Test only YOUR custom blocks (the ones you built for your theme)
- Don't test WordPress core blocks (paragraph, heading, image, etc.) - WordPress already tests those
- Focus on your block's unique functionality and styling
- Example: If you built a custom hero block, test all its features (background options, text alignment, overlay settings, etc.)

**When You Use Core Blocks:**
- You don't need to test core blocks themselves
- You only test them when they're part of a combination with your custom blocks
- Example: Testing a hero block that contains core button blocks inside it

### 3. Editor vs Frontend Testing

Every block test should verify **two contexts**:

**Editor (Backend)**
- How the block appears in the WordPress block editor
- Block controls and settings work correctly
- Preview matches expectations

**Frontend (Published Page)**
- How the block appears on the actual website
- Styling is correct
- Interactive features work
- Responsive behavior

## Utility Files Explained

### `utils/editor.js`
Functions for interacting with the block editor:
```javascript
- insertBlock()        // Add a block to the editor
- selectBlock()        // Click and select a block
- updateBlockSetting() // Change block settings in sidebar
- getEditorBlockHTML() // Get block markup in editor
```

### `utils/frontend.js`
Functions for testing the published website:
```javascript
- viewPublishedPost()     // Navigate to published page
- getRenderedBlockHTML()  // Get block markup on frontend
- waitForPageLoad()       // Ensure page is fully loaded
```

### `utils/block-actions.js`
Common operations used in both contexts:
```javascript
- publishPost()      // Publish the current post/page
- getPostId()        // Get WordPress post ID
- createTestPost()   // Set up a fresh test post
- deleteTestPost()   // Clean up after tests
```

### `utils/assertions.js`
Reusable test checks:
```javascript
- assertBlockInBothContexts()  // Test editor AND frontend
- assertResponsive()           // Check mobile/tablet/desktop
- assertAccessibility()        // Verify ARIA labels, etc.
```

## Test Flow Example

Here's what a typical test does:

1. **Setup**: Create a new post in the WordPress editor
2. **Insert Block**: Add the block you want to test
3. **Configure**: Set block options (text, images, colors, etc.)
4. **Verify Editor**: Check the block looks correct in the editor
5. **Publish**: Save and publish the post
6. **Navigate**: Go to the published page on the frontend
7. **Verify Frontend**: Check the block looks correct on the website
8. **Cleanup**: Delete the test post

## Sample Test Walkthrough

```javascript
// specs/blocks/individual/hero.spec.js

test('Hero block displays correctly', async ({ page }) => {
  // 1. Go to WordPress editor
  await page.goto('/wp-admin/post-new.php');
  
  // 2. Insert hero block
  await insertBlock(page, 'my-theme/hero');
  
  // 3. Configure block settings
  await updateBlockSetting(page, 'Title', 'Welcome');
  await updateBlockSetting(page, 'Background Color', 'blue');
  
  // 4. Verify in EDITOR
  const editorBlock = page.locator('.wp-block-my-theme-hero');
  await expect(editorBlock).toBeVisible();
  await expect(editorBlock).toHaveText('Welcome');
  
  // 5. Publish the post
  await publishPost(page);
  const postId = await getPostId(page);
  
  // 6. Go to published page
  await viewPublishedPost(page, postId);
  
  // 7. Verify on FRONTEND
  const frontendBlock = page.locator('.wp-block-my-theme-hero');
  await expect(frontendBlock).toBeVisible();
  await expect(frontendBlock).toHaveText('Welcome');
  await expect(frontendBlock).toHaveCSS('background-color', 'rgb(0, 0, 255)');
});
```

## Combination Test Example

```javascript
// specs/blocks/combinations/hero-with-buttons.spec.js

test('Hero with buttons combination', async ({ page }) => {
  await page.goto('/wp-admin/post-new.php');
  
  // Insert hero block
  await insertBlock(page, 'my-theme/hero');
  
  // Insert buttons INSIDE the hero block
  await page.click('.wp-block-my-theme-hero .block-list-appender');
  await insertBlock(page, 'core/buttons');
  
  // Verify structure in EDITOR
  const editorHero = page.locator('.wp-block-my-theme-hero');
  await expect(editorHero.locator('.wp-block-buttons')).toBeVisible();
  
  // Publish and check FRONTEND
  await publishPost(page);
  await viewPublishedPost(page, await getPostId(page));
  
  const frontendHero = page.locator('.wp-block-my-theme-hero');
  await expect(frontendHero.locator('.wp-block-buttons')).toBeVisible();
});
```

## Fixtures Folder

The `fixtures/` directory stores reusable test data:

**Block Configurations** (`fixtures/blocks/`)
- JSON files with pre-configured block attributes
- Useful for testing complex setups without repeating code

**Media Files** (`fixtures/media/`)
- Test images, videos, PDFs
- Use these instead of random internet files
- Consistent testing with known file sizes and dimensions

## Running Tests

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