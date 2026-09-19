1.1.0
    - Refactored Lucide icon generation to collect SVG child tags in a `Set`.
    - Destructure only the tags used by each generated icon.
    - Removed repeated `tags.*` references from generated icon children.
    - Use `currentColor` as default color value instead of `darkblue`
1.0.0
    - Initial release