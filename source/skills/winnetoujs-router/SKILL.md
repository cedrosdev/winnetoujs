---
name: winnetoujs-router
description: Guide for using WinnetouJs Router to build SPA navigation. Use this skill when you need to implement client-side routing in your Winnetou.js applications.
---

RULES:

- import: `import { Router } from "winnetoujs/modules/router"`
- define router class with `methods` and `routes`
- each route: `go()` + `set()`
- `go()` calls `Router.navigate(path)`
- `set()` registers `this.routes[path] = () => { ... }`
- call `Router.createRoutes(routes, { onGo, onBack })`
- create ONE router instance

BASIC ROUTER:

```ts
import { Router } from "winnetoujs/modules/router";

export class AppRouter {
  private routes = {};

  public methods = {
    home: {
      go: () => Router.navigate("/"),
      set: () => {
        this.routes["/"] = () => {
          console.log("home");
        };
      },
    },
  };

  constructor() {
    Object.keys(this.methods).forEach((k) => this.methods[k].set());
    Router.createRoutes(this.routes, {
      onGo: (route) => console.log("go", route),
      onBack: (route) => console.log("back", route),
    });
  }
}
```

USE IN APP:

```ts
import { W } from "winnetoujs";
import { $navBtn } from "./nav.wcto";
import { AppRouter } from "./router";

const router = new AppRouter();

new $navBtn({
  text: "Home",
  onclick: W.fx(() => router.methods.home.go()),
}).create("#nav");
```

RENDER PAGES:

```ts
this.routes["/about"] = () => {
  new $aboutPage().create("#content", { clear: true });
};
```

DYNAMIC ROUTE:

```ts
this.routes["/blog/:id"] = (postId) => {
  loadPost(postId);
};
```

BEST PRACTICES:

- keep route logic inside router
- use `{ clear: true }` when swapping pages
- lazy load heavy pages
- guard routes before `Router.navigate`

TROUBLESHOOT:

- route not firing: call `router.methods.x.go()`
- back button not working: ensure `Router.createRoutes()` called
- route not found: path in `go()` must match `set()`
