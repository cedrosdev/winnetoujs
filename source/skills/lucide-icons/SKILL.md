---
name: lucide-icons
description: Guide for using Lucide icons in WinnetouJs constructos. Use this skill when you need to add icons to your UI components.
---

RULES:

- install: `lucide`
- import only needed icons (tree-shake)
- create icon HTML via `createElement(Icon).outerHTML`
- pass icon HTML string to constructo prop
- use CSS for color (icons inherit text color)
- for SSR use `lucide-static`

BASIC:

```ts
import { createElement, Home } from "lucide";

const homeIcon = createElement(Home, { size: 20 }).outerHTML;
```

```html
<winnetou>
  <span class="icon">{{icon}}</span>
</winnetou>
```

```ts
new $navItem({ icon: homeIcon, text: "Home" }).create("#menu");
```

ICON CUSTOM:

```ts
const alertIcon = createElement(AlertCircle, {
  size: 18,
  strokeWidth: 2,
  color: "#e74c3c",
}).outerHTML;
```

CSS COLOR:

```css
.icon svg {
  width: 1em;
  height: 1em;
}
.icon-danger {
  color: #e74c3c;
}
```

LIBRARY PATTERN:

```ts
import { createElement, Home, Settings } from "lucide";

export const icons = {
  home: (s = 20) => createElement(Home, { size: s }).outerHTML,
  settings: (s = 20) => createElement(Settings, { size: s }).outerHTML,
};
```

SSR:

```ts
// Node
const { Home } = require("lucide-static");
const icon = Home; // raw SVG string
```

BEST PRACTICES:

- cache icon HTML if reused
- keep sizes consistent
- provide labels for icon-only buttons

TROUBLESHOOT:

- icon missing: use `.outerHTML`
- wrong prop: ensure `{{icon}}` matches prop name
- color wrong: set parent `color` or `.icon svg`
