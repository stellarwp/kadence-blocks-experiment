# Global Styles Inheritance System

This document explains how to use the global styles inheritance system in Kadence Blocks. This system allows blocks to access and use global styles from their parent blocks.

## Overview

The global styles inheritance system works by:

1. Storing each block's global styles in a static registry
2. Traversing the parent chain to collect all parent global styles
3. Making these styles available to child blocks through attributes

## How It Works

When a block is rendered:

1. The block's global styles are stored in a static registry using the block's uniqueID as the key
2. The block's parent chain is traversed to collect all parent global styles
3. The parent global styles are added to the block's attributes as `_parentGlobalStyles` in order from top-most parent down
4. All global styles (parent + current) are added to the block's attributes as `_myGlobalStyles` as a flattened array, also in order from top-most parent down to the current block
5. These attributes are available in the `build_css` and `build_html` methods

## Using Parent Global Styles in Your Block

### In Block Registration

Your block doesn't need any special registration to use parent global styles. The system works automatically for any block that extends the Abstract_Block class.

### In CSS Generation

In your block's `build_css` method, you can access parent global styles:

```php
public function build_css($attributes, $css, $unique_id, $unique_style_id, $block_instance) {
    $css->set_style_id('my-block-' . $unique_style_id);
    $css->set_selector('.my-block-' . $unique_id);
    
    // Apply regular block attributes
    $css->add_attributes($attributes, $block_instance);
    
    // Apply parent global styles if available
    if (!empty($attributes['_parentGlobalStyles'])) {
        // Each item in the array is a global style ID from a parent block
        // The array is ordered from top-most parent down
        $parent_styles = $attributes['_parentGlobalStyles'];
        
        // You can access the top-most parent's global style
        if (!empty($parent_styles[0])) {
            $top_parent_style = $parent_styles[0];
            $css->add_property('--top-parent-style', '"' . $top_parent_style . '"');
            
            // Apply specific styling based on the top parent's global style
            if ($top_parent_style === 'main-theme') {
                $css->add_property('background-color', 'var(--kb-main-theme-background, #f5f5f5)');
            }
        }
        
        // You can apply styles based on all parent global styles
        $css->add_property('--parent-global-styles', '"' . implode(',', $parent_styles) . '"');
        
        // Or you can apply specific styles based on each parent global style ID
        foreach ($parent_styles as $index => $style_id) {
            // Apply styling based on the global style ID and its position in the hierarchy
            $css->add_property('--parent-style-' . $index, '"' . $style_id . '"');
            
            if ($style_id === 'red-theme') {
                $css->add_property('background-color', 'var(--kb-red-theme-background, #ffeeee)');
            }
        }
    }
    
    // Apply all global styles (parent + current) if available
    if (!empty($attributes['_myGlobalStyles'])) {
        // This is a flattened array containing all global style IDs from parents and this block
        // The array is ordered from top-most parent down to the current block
        $all_styles = $attributes['_myGlobalStyles'];
        
        // You can apply styles based on all global styles
        $css->add_property('--all-global-styles', '"' . implode(',', $all_styles) . '"');
        
        // Or you can apply specific styles based on each global style ID
        foreach ($all_styles as $index => $style_id) {
            // Apply styling based on the global style ID and its position in the hierarchy
            $css->add_property('--style-' . $index, '"' . $style_id . '"');
            
            if ($style_id === 'blue-theme') {
                $css->add_property('color', 'var(--kb-blue-theme-text, #0000ff)');
            }
        }
        
        // The last item in the array is always the current block's global style
        if (!empty($all_styles)) {
            $current_style = end($all_styles);
            $css->add_property('--current-style', '"' . $current_style . '"');
        }
    }
    
    return $css->css_output();
}
```

### In HTML Generation

In your block's `build_html` method, you can access parent global styles:

```php
public function build_html($attributes, $unique_id, $content, $block_instance) {
    // Add data attributes for global styles
    $data_attributes = [];
    if (!empty($attributes['globalStyleIds'])) {
        $data_attributes['data-global-style-ids'] = esc_attr($attributes['globalStyleIds']);
    }
    if (!empty($attributes['_parentGlobalStyles'])) {
        $data_attributes['data-parent-global-styles'] = esc_attr(implode(',', $attributes['_parentGlobalStyles']));
    }
    if (!empty($attributes['_myGlobalStyles'])) {
        $data_attributes['data-my-global-styles'] = esc_attr(implode(',', $attributes['_myGlobalStyles']));
    }
    
    $wrapper_args = array_merge([
        'class' => 'my-block my-block-' . $unique_id,
    ], $data_attributes);
    
    $wrapper_attributes = get_block_wrapper_attributes($wrapper_args);
    
    return sprintf('<div %s>%s</div>', $wrapper_attributes, $content);
}
```

## Example Implementation

See the `test-global-styles.php` file for a complete example of how to use parent global styles in a block.

## Best Practices

1. Always check if parent global styles are available before using them
2. Use the `_myGlobalStyles` attribute to access all global styles (parent + current) as a flattened array
3. Use the `_parentGlobalStyles` attribute to access only parent global styles
4. Remember that both arrays are ordered from top-most parent down to the current block
5. You can access the top-most parent's global style with `$attributes['_parentGlobalStyles'][0]`
6. Add data attributes to your block's HTML to make the global styles available to JavaScript
7. Use CSS custom properties to apply global styles to your block
8. When applying styles based on global style IDs, use a loop to process each ID individually 