---
name: color-themes
description: Guide for using WinnetouJs ColorThemes for dynamic theme switching. Use this skill when you need to implement light/dark mode or custom themes in your Winnetou.js applications.
---

RULES:

- import: `import { ColorThemes } from "winnetoujs/modules/colorThemes"`
- define CSS variables in `:root`
- call `ColorThemes.applySavedTheme()` before render
- switch theme via `ColorThemes.newTheme({ "--var": value })`
- values are strings; include `--` in keys

CSS VARS:

```css
:root {
  --primary: #3498db;
  --background: #ffffff;
  --text: #333333;
}
body {
  background: var(--background);
  color: var(--text);
}
```

STARTUP:

```ts
import { ColorThemes } from "winnetoujs/modules/colorThemes";

ColorThemes.applySavedTheme();
startApp();
```

SWITCH THEME:

```ts
ColorThemes.newTheme({
  "--primary": "#2980b9",
  "--background": "#1a1a1a",
  "--text": "#ffffff",
});
```

TOGGLE (simple):

```ts
const bg = getComputedStyle(document.documentElement)
  .getPropertyValue("--background")
  .trim();

const isLight = bg === "#ffffff";
ColorThemes.newTheme(
  isLight
    ? { "--background": "#1a1a1a", "--text": "#ffffff" }
    : { "--background": "#ffffff", "--text": "#333333" },
);
```

BEST PRACTICES:

- use semantic var names (`--text`, `--surface`)
- update all theme-dependent colors with vars
- keep contrast accessible
- use CSS transitions for smooth change

TROUBLESHOOT:

- not persisting: ensure `applySavedTheme()` called before render
- not applying: vars must be in `:root`, and CSS must use `var(--x)`
- partial update: remove hard-coded colors
