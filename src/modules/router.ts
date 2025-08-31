interface RouteOptions {
  onBack?: (route: string) => void;
  onGo?: (route: string) => void;
}

interface RouteInfo {
  root: string;
  size: number;
}

type RouteFunction = (...params: string[]) => void;

class WinnetouRouter_ {
  protected routes: Record<string, RouteFunction> = {};
  protected paramRoutes: RouteInfo[] = [];
  protected routesOptions: RouteOptions = {};

  constructor() {
    this.addListeners();
  }

  addListeners(): void {
    document.addEventListener("keydown", (event: KeyboardEvent) => {
      if (event.key === "Escape" || event.which === 27) {
        history.go(-1);
      }
    });

    if (window.history) {
      window.onpopstate = (event: PopStateEvent) => {
        event.preventDefault();

        if (event.state == null) {
          if (this.routes["/"]) {
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

  createRoutes(
    obj: Record<string, RouteFunction>,
    options?: RouteOptions
  ): void {
    this.routes = obj;
    this.routesOptions = options || {};

    Object.keys(this.routes).forEach((route: string) => {
      const segment = route.split("/");
      const size = segment.length;
      this.paramRoutes.push({
        root: route,
        size,
      });
    });
  }

  navigate(url: string, pushState: boolean = true): void {
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

  pass(route: string): void {
    if (window.history) {
      this.callRoute(route);
      this.pushStateInteraction(route);
      if (this.routesOptions?.onGo) {
        try {
          this.routesOptions.onGo(route || "/");
        } catch (e) {
          console.error(
            `Winnetou Error, id: CR001\nThe onGo option in createRoutes() is not valid. Please use a function. \n\nOriginal Error: `,
            e
          );
        }
      }
    }
  }

  private pushStateInteraction(func: string): void {
    history.pushState(func, "");
  }

  private callRoute(url: string): void {
    try {
      const splittedUrl = url.split("/");
      const size = splittedUrl.length;

      const filter = this.paramRoutes.filter(data => data.size === size);

      if (filter.length === 0) {
        this.notFound();
      }

      for (let i = 0; i < filter.length; i++) {
        const root = filter[i].root.split("/");

        let correctMatch = true;
        const paramStore: string[] = [];
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

  private notFound(): void {
    try {
      this.routes["/404"]();
    } catch (e) {
      document.body.innerHTML =
        "<p onclick=\"Winnetou.select('.winnetouNotFoundDefault').hide()\" style=\"width:100%;padding:15px;color:white;background-color:red;cursor:pointer;\" class='winnetouNotFoundDefault'>Page not found. Click to close.</p>" +
        document.body.innerHTML;
    }
  }

  private pushState(url: string): void {
    try {
      history.pushState(url, "", url);
    } catch (e) {
      history.pushState(url, "");
    }
  }
}

export const Router = new WinnetouRouter_();
