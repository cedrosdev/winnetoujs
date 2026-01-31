---
name: state-management-and-ui-updates
description: Guide for Winnetou.js mutables and UI updates. Use this skill for reactive state and live constructo updates.
---

RULES:

- state = Mutables
- persistent: `W.setMutable(key, value)` (localStorage)
- non-persistent: `W.initMutable(initialValue)` -> key
- update non-persistent: `W.setMutableNotPersistent(key, value)`
- read: `W.getMutable(key)`
- connect to constructo prop: `{ mutable: key }`
- mutables are strings; convert numbers/booleans

CREATE MUTABLES:

```ts
import { W } from "winnetoujs";

W.setMutable("theme", "dark");
const loading = W.initMutable("true");
```

READ + UPDATE:

```ts
const count = W.initMutable("0");
const current = parseInt(W.getMutable(count));
W.setMutableNotPersistent(count, (current + 1).toString());
```

CONNECT MUTABLE TO UI:

```html
<winnetou>
  <h1 id="[[title]]">{{text}}</h1>
</winnetou>
```

```ts
import { W } from "winnetoujs";
import { $title } from "./title.wcto";

W.setMutable("pageTitle", "Home");
new $title({ text: { mutable: "pageTitle" } }).create("#app");

W.setMutable("pageTitle", "Dashboard");
```

setMutable triggers UI update.

PERSISTENT VS NON-PERSISTENT:

- persistent: settings, auth, cart
- non-persistent: loading, errors, temp UI

```ts
W.setMutable("language", "pt-BR");
const error = W.initMutable("");
```

PATTERNS:

TOGGLE:

```ts
W.setMutable("darkMode", "false");
const next = W.getMutable("darkMode") === "true" ? "false" : "true";
W.setMutable("darkMode", next);
```

LOADING STATE:

```ts
const loadingMsg = W.initMutable("Loading...");
W.setMutableNotPersistent(loadingMsg, "");
```

TROUBLESHOOT:

- if UI not updating, ensure `{ mutable: key }` (do not pass `W.getMutable` value)
- if not persisted, use `W.setMutable()`

```ts
// ✅ correct
new $title({ text: { mutable: "pageTitle" } }).create("#app");
```

BEST PRACTICES:

- init mutables early
- use descriptive keys
- reuse same key across constructos to sync
- prefer non-persistent for fast UI-only state
