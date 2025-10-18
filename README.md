## Installation

### 1. Install dependencies

Navigate to the project folder and run:

```bash
npm install
```

### 2. Build the project

Compile the widget into production-ready files:

```
npm run build
```

This will generate a dist folder containing:

- chat-widget.iife.js
- chat-widget.css

### 3. Transfer built files to WordPress

Copy the dist folder into your WordPress theme directory. Example:

wp-content/themes/your-theme/path/to/chat/files

### 4. Enqueue widget assets in WordPress

```php
function enqueue_chat_widget() {
    // Chat widget CSS
    wp_enqueue_style(
        'chat-widget-css',
        get_template_directory_uri() . '/path/to/chat-widget.css',
        [],
        filemtime(get_template_directory() . '/path/to/chat-widget.css')
    );

    // Chat widget JS
    wp_enqueue_script(
        'chat-widget-js',
        get_template_directory_uri() . '/path/to/chat-widget.iife.js',
        [], // no dependencies
        filemtime(get_template_directory() . '/path/to/chat-widget.iife.js'),
        true // load in footer
    );

    // Inline script to initialize widget
    $init_script = <<<JS
    if (window.ChatWidget) {
        window.ChatWidget.init({
            webhookUrl: 'https://yourwebsite.com/your-webhook'
        });
    }
    JS;

    wp_add_inline_script('chat-widget-js', $init_script);
}
add_action('wp_enqueue_scripts', 'enqueue_chat_widget');
```

Note: Replace 'https://yourwebsite.com/your-webhook' with your actual backend webhook URL.

### 5. Add the chat widget root container

Inside your theme’s footer.php, add:

```
<div id="chat-widget-root"></div>
```

### 6. Verify the results
