class WinnetouRouter_ {
  constructor() {
    /**
     * Object that will store routes on createRoutes
     * @protected
     * @type {object}
     */
    this.routes = {};

    /**
     * Object that will store the separated routes from createRoutes
     * @protected
     * @type {array}
     */
    this.paramRoutes = [];

    /**
     * Object that provides options when createRoutes, like
     * a standard function to be called when onBack is pressed
     * @protected
     * @type {object}
     */
    this.routesOptions = {};

    this.addListeners();
  }

  addListeners() {
    document.addEventListener("keydown", event => {
      if (event.key === "Escape" || event.which === 27) {
        history.go(-1);
      }
    });

    if (window.history) {
      window.onpopstate = event => {
        event.preventDefault();

        if (event.state == null) {
          if(this.routes["/"]) {
            this.routes["/"]();
          } else {
            console.error(
              `WinnetouJs Error, id: CR00a67\nDefault route "/" is not defined. Please define a default route.`
            );
          }
        } else {
          try {
            this.callRoute(event.state);
          } catch (e) {
            console.error(
              `WinnetouJs Error, id: CR002\nGiven route is not available "${event.state}". Please verify given route. Original Error: ${e}`
            );
          }
        }

        if (this.routesOptions?.onBack) {
          try {
            this.routesOptions.onBack(event.state || "/");
          } catch (e) {
            console.error(
              `Winnetou Error, id: CR001\nThe onBack option in createRoutes() is not valid. Please use a function. \n\nOriginal Error: `,
              e
            );
          }
        }
      };
    }
  }

  /**
   * Method for store dynamic Winnetou Routes
   * @param  {object} obj
   * @param  {object} [options]
   * @param  {function=} options.onBack Function that will be called when user fires back button
   * @param  {function=} options.onGo Function that will be called when user triggers a route
   */
  createRoutes(obj, options) {
    this.routes = obj;
    this.routesOptions = options;

    Object.keys(this.routes).forEach(route => {
      let segment = route.split("/");
      let size = segment.length;
      this.paramRoutes.push({
        root: route,
        size,
      });
    });
  }

  /**
   * Navigate between Winnetou routes
   * @param {string} url Path already defined in createRoutes method
   * @param {boolean} pushState To use navigate without change URL
   */
  navigate(url, pushState = true) {
    if (window.history) {
      this.callRoute(url);
      pushState && this.pushState(url);
      if (this.routesOptions?.onGo) {
        try {
          this.routesOptions.onGo(url || "/"); // if url is undefined, it will be '/'
        } catch (e) {
          console.error(
            `Winnetou Error, id: CR001\nThe onGo option in createRoutes() is not valid. Please use a function. \n\nOriginal Error: `,
            e
          );
        }
      }
    }
  }

  /**
   * Allows WinnetouJs to pass between pages on the app.
   * Needs a valid const routes already set.
   * Do not changes URL.
   * @param {string} route function already set in createRoutes
   */
  pass(route) {
    if (window.history) {
      this.callRoute(route);
      this.pushStateInteraction(route);
      if (this.routesOptions?.onGo) {
        try {
          this.routesOptions.onGo(route || "/"); // if url is undefined, it will be '/'
        } catch (e) {
          console.error(
            `Winnetou Error, id: CR001\nThe onGo option in createRoutes() is not valid. Please use a function. \n\nOriginal Error: `,
            e
          );
        }
      }
    }
  }

  /** @private */
  pushStateInteraction(func) {
    history.pushState(func, "");
  }
  /** @private */
  callRoute(url) {
    try {
      let splittedUrl = url.split("/");
      let size = splittedUrl.length;

      let filter = this.paramRoutes.filter(data => data.size === size);

      if (filter.length === 0) {
        this.notFound();
      }

      for (let i = 0; i < filter.length; i++) {
        let root = filter[i].root.split("/");

        let correctMatch = true;
        let paramStore = [];
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

  /** @private */
  notFound() {
    try {
      this.routes["/404"]();
    } catch (e) {
      document.body.innerHTML =
        "<p onclick=\"Winnetou.select('.winnetouNotFoundDefault').hide()\" style=\"width:100%;padding:15px;color:white;background-color:red;cursor:pointer;\" class='winnetouNotFoundDefault'>Page not found. Click to close.</p>" +
        document.body.innerHTML;
    }
  }

  /** @private */
  pushState(url) {
    try {
      history.pushState(url, "", url);
    } catch (e) {
      history.pushState(url, "");
    }
  }
}

export const Router = new WinnetouRouter_();
