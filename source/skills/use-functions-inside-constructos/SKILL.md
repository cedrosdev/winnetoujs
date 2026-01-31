---
name: winnetou-fx
description: Guide for using WinnetouFx (`W.fx`) to handle events in constructos. Use this skill when you need to add event handlers to your Winnetou.js UI components.
---

RULES:

- wrap event handlers with `W.fx(handler, ...args)`
- no default DOM event object
- pass "this" to receive the triggering element
- args order = handler params order
- use ids (strings) instead of DOM refs
- for forms, return `false` to prevent submit
- when use fx, the type must be `string` not `Function`

BASIC:

```html
<winnetou>
  <button id="[[btn]]" onclick="{{onClick:string}}">Click</button>
</winnetou>
```

```ts
import { W } from "winnetoujs";
import { $btn } from "./btn.wcto";

new $btn({
  onClick: W.fx(() => console.log("clicked")),
}).create("#app");
```

USE "this":

```ts
new $btn({
  onClick: W.fx((self) => {
    self.disabled = true;
  }, "this"),
}).create("#app");
```

PASS ARGS:

```ts
new $btn({
  onClick: W.fx(
    (self, targetId, msg) => {
      document.getElementById(targetId).textContent = msg;
    },
    "this",
    "result",
    "OK",
  ),
}).create("#app");
```

COMMON EVENTS:

- click: `onclick`
- change: `onchange`
- input: `oninput`
- submit: `onsubmit`

FORM SUBMIT:

```ts
new $loginForm({
  onSubmit: W.fx((form) => {
    // handle submit
    return false;
  }, "this"),
}).create("#app");
```

WITH MUTABLES:

```ts
W.setMutable("count", "0");
new $btn({
  onClick: W.fx(() => {
    const n = parseInt(W.getMutable("count"));
    W.setMutable("count", (n + 1).toString());
  }),
}).create("#app");
```

TROUBLESHOOT:

- event not firing: prop name must match HTML attribute (e.g. `onclick`)
- wrong element: ensure "this" is first arg after handler
- need ids: store constructo instance and use `instance.ids`

PERF:

- avoid creating new handlers inside loops; pass data as args
- debounce frequent events (input/mousemove)
