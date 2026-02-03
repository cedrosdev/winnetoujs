---
name: sass-with-winnetoujs
description: Guide for using Sass with WinnetouJs constructos. Use this skill to write modular, maintainable styles in your Winnetou.js projects.
---

RULES:

- compiler runs in background; do not ask user to run it
- `@use` is preferred over `@import` and must be above all other statements
- .scss files of constructos must be in the same directory as the constructo file
- each constructo file (wcto.html) should have its own .scss file named after the constructo
- refer to package.json scripts to understand how sass is compiled and it entry point
- When create sass file, add it to entry point sass file (e.g., main.scss) with `@use` in order to include it in the build
