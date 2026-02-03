---
applyTo: "**"
---

## Winnetou.js Instructions

Winnetou.js is a JavaScript library for building user interfaces.
WinnetouJs transforms html files into reusable javascript components. It ensure you will not mix html and javascript code in the same file.
The following instructions provide guidelines for using Winnetou.js effectively in your projects.

### 1. Concepts

- **Constructos**: The building blocks of a Winnetou.js application. Each component represents a part of the user interface.
- **Mutables**: Variables that can change over time and trigger UI updates when modified.
- **WinnetouFx**: The proper way to define functions with constructos and mutables.
- **Modules**: Imports that increase winnetoujs capabilities.

### 2. Project Configuration

- A typical Winnetou.js project structure includes:
- `./win.config.js` - Configuration file for Winnetou.js settings.

```
{
  "apps": ["./src/app.ts"],
  "outputDir": "./dist",
  "constructosSourceFolder": "./src"
}
```

- User will always run compiler (wbr and sass) in background. Never ask to run it manually.

### 3. File Structure

- Source files should be placed in the `constructosSourceFolder` directory.
- Each part of the UI should be defined in its own folder for better modularity.
- A single wcto.html constructo file can contain multiple constructos relative to its folder.
- The sass file must be placed in the same folder as the constructo file.
