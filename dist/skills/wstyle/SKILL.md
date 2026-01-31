---
name: wstyle
description: Guide for using WStyle (`wstyle`) for inline styles in WinnetouJs. Use this skill to create and manage component-specific styles programmatically. Just use it when use ask for WStyle.
---

RULES:

- import: `import { wstyle } from "winnetoujs/modules/wstyle"`
- use kebab-case CSS keys in quotes
- apply via constructo prop `style`
- WStyle increases bundle size; use for small/dynamic styles
- no nesting, no pseudo-classes in WStyle

BASIC:

```ts
import { wstyle } from "winnetoujs/modules/wstyle";

export const btn = wstyle({
  "background-color": "#3498db",
  color: "white",
  padding: "10px 16px",
});
```

```html
<winnetou>
  <button id="[[btn]]" style="{{style}}">{{text}}</button>
</winnetou>
```

```ts
new $btn({ text: "Save", style: btn }).create("#app");
```

DYNAMIC STYLE:

```ts
const makeBadge = (bg) =>
  wstyle({
    "background-color": bg,
    color: "white",
    padding: "4px 8px",
  });
```

CSS VARS:

```ts
export const themed = wstyle({
  "background-color": "var(--primary-color)",
  color: "var(--text-color)",
});
```

WITH MUTABLES (re-render):

```ts
const normal = wstyle({ "background-color": "#eee" });
const active = wstyle({ "background-color": "#3498db" });
const isActive = W.initMutable("false");

function render() {
  new $box({
    style: W.getMutable(isActive) === "true" ? active : normal,
    onclick: W.fx(() => {
      const v = W.getMutable(isActive) === "true" ? "false" : "true";
      W.setMutableNotPersistent(isActive, v);
      render();
    }),
  }).create("#app", { clear: true });
}
```

BEST PRACTICES:

- keep style objects small and focused
- use CSS/Sass for global or static styles
- use WStyle for dynamic or per-component overrides
- document complex styles

TROUBLESHOOT:

- styles not applying: pass object, not string
- bad property: use "font-size", not `fontSize`
- ensure constructo prop `style` exists
