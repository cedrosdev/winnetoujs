---
applyTo: "**"
---

## Project Instructions

This is a WinnetouJs project. Below are the instructions and guidelines for working with this project.

### 1. Concepts

- **Constructos**: The building blocks of a WinnetouJs application. Each component represents a part of the user interface.
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

### 4. Skills

- **ALWAYS** use skills to work in this project.
- Use more than one skill if needed.
- Follow the instructions in each skill carefully.
- **ALWAYS** use `create-winnetoujs-constructos` skill when creating or modifying constructos (UI Components).
- **ALWAYS** use `sass-with-winnetoujs` skill when creating or modifying sass files.
- **ALWAYS** use `color-themes` skill when creating or modifying color themes.
- **ALWAYS** use `lucide-icons` skill when adding or modifying icons.
- **ALWAYS** use `native-translations` skill when creating or modifying translations.
- **ALWAYS** use `state-management-and-ui-updates` skill when working with mutables, state management and reactive UI updates.
- **ALWAYS** use `use-functions-inside-constructos` skill when working with functions inside constructos and event handlers.
- **ALWAYS** use `winnetou-router` skill when working with routing and navigation.
- **ALWAYS** use `wstyle` skill when working with wstyle for styling constructos.

### 5. Best Practices

- **ALWAYS** re-check generated/modified code to fix js/ts errors or typos.
- Write clean and maintainable code.
- Comment your code where necessary to explain complex logic.
