var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
class WinnetouRouter_ {
  constructor() {
    __publicField(this, "routes", {});
    __publicField(this, "paramRoutes", []);
    __publicField(this, "routesOptions", {});
    this.addListeners();
  }
  addListeners() {
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" || event.which === 27) {
        history.go(-1);
      }
    });
    if (window.history) {
      window.onpopstate = (event) => {
        event.preventDefault();
        if (event.state == null) {
          if (this.routes["/"]) {
            this.routes["/"]();
          } else {
            console.error(
              `WinnetouJs Error, id: CR00a67
Default route "/" is not defined. Please define a default route.`
            );
          }
        } else {
          try {
            this.callRoute(event.state);
          } catch (e) {
            console.error(
              `WinnetouJs Error, id: CR002
Given route is not available "${event.state}". Please verify given route. Original Error: ${e}`
            );
          }
        }
        if (this.routesOptions?.onBack) {
          try {
            this.routesOptions.onBack(event.state || "/");
          } catch (e) {
            console.error(
              `Winnetou Error, id: CR001
The onBack option in createRoutes() is not valid. Please use a function. 

Original Error: `,
              e
            );
          }
        }
      };
    }
  }
  createRoutes(obj, options) {
    this.routes = obj;
    this.routesOptions = options || {};
    Object.keys(this.routes).forEach((route) => {
      const segment = route.split("/");
      const size = segment.length;
      this.paramRoutes.push({
        root: route,
        size
      });
    });
  }
  navigate(url, pushState = true) {
    if (window.history) {
      this.callRoute(url);
      pushState && this.pushState(url);
      if (this.routesOptions?.onGo) {
        try {
          this.routesOptions.onGo(url || "/");
        } catch (e) {
          console.error(
            `Winnetou Error, id: CR001
The onGo option in createRoutes() is not valid. Please use a function. 

Original Error: `,
            e
          );
        }
      }
    }
  }
  pass(route) {
    if (window.history) {
      this.callRoute(route);
      this.pushStateInteraction(route);
      if (this.routesOptions?.onGo) {
        try {
          this.routesOptions.onGo(route || "/");
        } catch (e) {
          console.error(
            `Winnetou Error, id: CR001
The onGo option in createRoutes() is not valid. Please use a function. 

Original Error: `,
            e
          );
        }
      }
    }
  }
  pushStateInteraction(func) {
    history.pushState(func, "");
  }
  callRoute(url) {
    try {
      const splittedUrl = url.split("/");
      const size = splittedUrl.length;
      const filter = this.paramRoutes.filter((data) => data.size === size);
      if (filter.length === 0) {
        this.notFound();
      }
      for (let i = 0; i < filter.length; i++) {
        const root = filter[i].root.split("/");
        let correctMatch = true;
        const paramStore = [];
        for (let j = 0; j < root.length; j++) {
          if (root[j] !== splittedUrl[j]) {
            correctMatch = false;
            if (root[j].includes(":")) {
              correctMatch = true;
              paramStore.push(splittedUrl[j]);
            } else {
              correctMatch = false;
              break;
            }
          }
        }
        if (correctMatch) {
          this.routes[filter[i].root](...paramStore);
          return;
        } else if (i === filter.length - 1) {
          this.notFound();
        }
      }
    } catch (e) {
      console.log(e);
      this.notFound();
    }
  }
  notFound() {
    try {
      this.routes["/404"]();
    } catch (e) {
      document.body.innerHTML = `<p onclick="Winnetou.select('.winnetouNotFoundDefault').hide()" style="width:100%;padding:15px;color:white;background-color:red;cursor:pointer;" class='winnetouNotFoundDefault'>Page not found. Click to close.</p>` + document.body.innerHTML;
    }
  }
  pushState(url) {
    try {
      history.pushState(url, "", url);
    } catch (e) {
      history.pushState(url, "");
    }
  }
}
const Router = new WinnetouRouter_();
export {
  Router
};
//# sourceMappingURL=router.js.map
