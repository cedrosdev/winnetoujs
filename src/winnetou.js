import Config from "../../../win.config.js";

class Winnetou_ {
  constructor() {
    /**
     * Incrementally id when no specific identifier is given
     *
     * @type {number}
     */
    this.constructoId = 0;

    /**
     * Variable that stores mutables who should not have been
     * persistent when updating the application
     * @protected
     * @type {array}
     */
    this.mutable = [];

    /**
     * List of constructos that are subscribed to the mutable listener
     *
     * @type {array}
     */
    this.usingMutable = [];

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

    /**@private */
    this.storedEvents = [];

    /**@type {object} */
    this.strings = {};

    document.addEventListener("keydown", event => {
      if (event.which === 27) {
        history.go(-1);
      }
    });

    if (window.history && window.history.pushState) {
      window.onpopstate = event => {
        event.preventDefault();

        if (this.routesOptions?.onBack) {
          try {
            this.routesOptions.onBack();
          } catch (e) {
            console.error(
              `Winnetou Error, id: CR001\nThe onBack option in createRoutes() is not valid. Please use a function. \n\nOriginal Error: `,
              e
            );
          }
        }

        if (event.state == null) {
          this.routes["/"]();
        } else {
          try {
            this.callRoute(event.state);
          } catch (e) {
            console.error(
              `WinnetouJs Error, id: CR002\nGiven route is not available "${event.state}". Please verify given route. Original Error: ${e}`
            );
          }
        }
      };
    } else {
      // $debug === "debug"
      //   ? console.log("History Api not allowed in this browser.")
      //   : null;
    }

    let theme = window.localStorage.getItem("theme");
    if (theme) {
      theme = JSON.parse(theme);
      let root = document.documentElement;
      Object.keys(theme).forEach(function (item) {
        root.style.setProperty(item, theme[item]);
      });
    } else {
    }
  }

  /**
   * Sets the value of passed winnetou mutable
   * @param {string} mutable string that represents a winnetou mutable
   * @param {string} value string value to be associated to mutable
   * @param {"notPersistent"|boolean} [localStorage] bool to save the state on the machine at the user, true by default. Use 'notPersistent' to be clear (and verbose).
   */
  setMutable(mutable, value, localStorage = true) {
    if (localStorage && localStorage !== "notPersistent") {
      window.localStorage.setItem(`mutable_${mutable}`, value);
    } else {
      this.mutable[mutable] = value;
    }

    if (this.usingMutable[mutable]) {
      /**
       * if the mutable has constructos
       * copy array to tmpArr
       */
      let tmpArr = this.usingMutable[mutable];

      this.usingMutable[mutable] = [];

      tmpArr.forEach(item => {
        /**
         * go through the tmpArr to handle constructos
         */
        let old_ = document.getElementById(item.pureId);

        if (old_ == null) return;

        let a = new item.method().constructo;

        let new_ = document
          .createRange()
          .createContextualFragment(
            a(item.elements, item.options).constructoString()
          );

        this.replace(new_, old_);
      });
    }
  }

  /**
   * Gets the value of passed winnetou mutable
   * @param {string} mutable string that represents a winnetou mutable
   * @returns {string} value or null if not exists
   */
  getMutable(mutable) {
    if (
      window.localStorage.getItem(`mutable_${mutable}`) ||
      window.localStorage.getItem(`mutable_${mutable}`) === ""
    ) {
      return window.localStorage.getItem(`mutable_${mutable}`);
    } else if (
      this.mutable[mutable] ||
      this.mutable[mutable] === ""
    ) {
      return this.mutable[mutable];
    } else {
      return null;
    }
  }

  /**
   * Method to replace a constructo
   * @param {Element|DocumentFragment} new_ DOM Element
   * @param {Element|DocumentFragment} old_ DOM Element
   */
  replace(new_, old_) {
    if (old_ && old_.parentNode) {
      let ele_ = old_.parentNode;
      ele_.replaceChild(new_, old_);
    }
  }

  /**
   * Select the indicated element
   * @param {string} selector html element. A tag, id ou class.
   */
  select(selector = "") {
    var el;

    const obj = {
      /**
       * @param {any} selector
       */
      getEl(selector) {
        if (el) return el;
        if (typeof selector == "object") {
          return [selector];
        } else {
          //
          if (selector.includes(" ")) {
            return document.querySelectorAll(selector);
          }
          //
          else if (selector.match(/^\#/)) {
            selector = selector.replace("#", "");
            return [document.getElementById(selector)];
          }
          //
          else if (selector.match(/^\./)) {
            selector = selector.replace(".", "");
            return Array.from(
              document.getElementsByClassName(selector)
            );
          }
          //
          else {
            if (selector.includes("-win-")) {
              selector = selector.replace("#", "");
              return [document.getElementById(selector)];
            }

            let arr = Array.from(
              document.getElementsByTagName(selector)
            );

            if (arr.length === 0) {
              return [document.getElementById(selector)];
            } else {
              return arr;
            }
          }
        }
      },
      /**
       * remove constructo from the DOM
       */
      remove() {
        el.forEach(item => {
          item.remove();
        });

        return this;
      },
      /**
       * set inner html of constructo
       * @param {string} htmlContentString the html string to be inserted
       */
      html(htmlContentString) {
        el.forEach(item => {
          item.innerHTML = htmlContentString;
        });
        return this;
      },
      /**
       * get the inner html of constructo
       */
      getHtml() {
        return el[0].innerHTML;
      },
      /**
       * get inner text of constructo
       */
      getText() {
        return el[0].textContent;
      },
      /**
       * append html to the end of constructo's html
       * @param {string} htmlContentString the html string to be inserted
       */
      append(htmlContentString) {
        el.forEach(item => {
          item.innerHTML += htmlContentString;
        });
        return this;
      },
      /**
       * prepend html to the start of constructo's html
       * @param {string} htmlContentString the html string to be inserted
       */
      prepend(htmlContentString) {
        // el.innerHTML = texto + el.innerHTML;
        el.forEach(item => {
          item.innerHTML = htmlContentString + item.innerHTML;
        });
        return this;
      },
      /**
       * Changes the css of constructo or DOM component
       * @tutorial https://www.w3schools.com/JSREF/dom_obj_style.asp
       * @param {string | number} property The Style object represents an individual style statement.
       * @param {string | number} value The value. If it is a number, winnetou will assume that it's a short hand to 'px'.
       */
      css(property, value) {
        let valueString = value;
        el.forEach(item => {
          if (typeof value == "number") valueString = value + "px";
          item.style[property] = valueString;
        });
        return this;
      },
      /**
       * Add the class if not added yet, remove the class if already added.
       * @param {string} className name of class
       */
      toggleClass(className) {
        el.forEach(item => {
          item.classList.toggle(className);
        });
        return this;
      },
      /**
       * Add a class
       * @param {string} className name of class
       */
      addClass(className) {
        el.forEach(item => {
          item.classList.add(className);
        });
        return this;
      },
      /**
       * Removes a class
       * @param {string} className name of class
       */
      removeClass(className) {
        el.forEach(item => {
          item.classList.remove(className);
        });
        return this;
      },
      /**
       * Hide a constructo
       */
      hide() {
        el.forEach(item => {
          item.classList.add("winnetou_display_none");
        });
        return this;
      },
      /**
       * Show a constructo
       */
      show() {
        el.forEach(item => {
          item.classList.remove("winnetou_display_none");

          if (getComputedStyle(item).display == "none") {
            item.style.display = "initial";
          }
        });
        return this;
      },
      /**
       * Get width of a constructo
       */
      getWidth() {
        return el[0].getBoundingClientRect().width;
      },
      /**
       * Get height of a constructo
       */
      getHeight() {
        return el[0].getBoundingClientRect().height;
      },
      /**
       * Get left of a constructo
       */
      getLeft() {
        return el[0].offsetLeft;
      },
      /**
       * Get top of a constructo
       */
      getTop() {
        return el[0].offsetTop;
      },
      /**
       * Get global position of a constructo
       */
      getGlobalPosition() {
        return el[0].getBoundingClientRect();
      },
      /**
       * Get value of a constructo
       */
      getVal() {
        return el[0].value;
      },
      /**
       * Sets a value to a constructo, also fire a change event
       * @param {string} value The value.
       */
      setVal(value) {
        el.forEach(item => {
          item.value = value;
          if ("createEvent" in document) {
            var evt = document.createEvent("HTMLEvents");
            evt.initEvent("change", false, true);
            item.dispatchEvent(evt);
          } else item.fireEvent("onchange");
        });
        return this;
      },
      /**
       * Sets an attr to a constructo
       * @param  {string} attr name of attribute
       * @param  {string} value the values
       */
      setAttr(attr, value) {
        el.forEach(item => {
          item.setAttribute(attr, value);
        });
        return this;
      },
      /**
       * Gets the attr
       * @param  {string} attr attribute name
       */
      getAttr(attr) {
        return el[0].getAttribute(attr);
      },
      /**
       * Returns checked property of a constructo
       */
      isChecked() {
        return el[0].checked;
      },
      /**
       * Gets the file of a constructo
       */
      getFile() {
        return el[0].files[0];
      },
    };

    el = obj.getEl(selector);

    return obj;
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
   */
  navigate(url) {
    if (window.history && window.history.pushState) {
      this.callRoute(url);
      this.pushState(url);
      if (this.routesOptions?.onGo) {
        try {
          this.routesOptions.onGo();
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
    if (window.history && window.history.pushState) {
      this.callRoute(route);
      this.pushStateInteraction(route);
      if (this.routesOptions?.onGo) {
        try {
          this.routesOptions.onGo();
        } catch (e) {
          console.error(
            `Winnetou Error, id: CR001\nThe onGo option in createRoutes() is not valid. Please use a function. \n\nOriginal Error: `,
            e
          );
        }
      }
    } else {
      // this.debug === "debug"
      //   ? console.log("History Api not allowed in this browser.")
      //   : null;
    }
  }

  /** @private */
  pushStateInteraction(func) {
    // history.replaceState(func, null);
    history.pushState(func, null);
  }
  /** @private
   * W.navigate('/profile/azul')
   */
  callRoute(url) {
    try {
      let splittedUrl = url.split("/");
      let size = splittedUrl.length;

      let filter = this.paramRoutes.filter(
        data => data.size === size
      );

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
      this.select("body").prepend(`
      
      <p onclick="Winnetou.select('.winnetouNotFoundDefault').hide()" style="width:100%;padding:15px;color:white;background-color:red;cursor:pointer;" class='winnetouNotFoundDefault'>
        Page not found. Click to close.
      </p>
      `);
    }
  }

  /** @private */
  pushState(url) {
    try {
      history.pushState(url, "", url);
    } catch (e) {
      history.pushState(url, null);
    }
  }

  /**
   * Method for handle events
   * @param  {string} eventName Name of event, eg. "keyup"
   * @param  {string} elementSelector DOM selector, id, class or tag
   * @param  {object} handler, function to be called when trigger event, eg. e=>{}
   */
  on(eventName, elementSelector, handler) {
    let test = this.storedEvents.filter(
      data =>
        data.eventName === eventName &&
        data.elementSelector === elementSelector &&
        data.handler === handler.toString()
    );

    if (test.length > 0) {
      return;
    }
    this.storedEvents.push({
      eventName,
      elementSelector,
      handler: handler.toString(),
    });

    function eventHandler(e) {
      let elementSelectorId = "#" + elementSelector;
      // @ts-ignore
      if (!e.target.closest(elementSelector)) {
        try {
          if (!e.target.closest(elementSelectorId)) {
            return;
          }
        } catch (e) {
          return;
        }
      }

      e.path.forEach(item => {
        try {
          if (item.matches(elementSelector)) {
            handler(item);
          } else if (item.matches(elementSelectorId)) {
            handler(item);
          }
        } catch (e) {}
      });
    }

    document.addEventListener(eventName, eventHandler);
  }
  /**
   * On touch devices sets event handler to touchstart
   * fallbacks to click
   * @param  {string} selector
   * @param  {function} callback
   */
  click(selector, callback) {
    var clickHandler =
      "ontouchstart" in document.documentElement
        ? "touchstart"
        : "click";

    this.on(clickHandler, selector, el => {
      callback(el);
    });
  }

  /**
   * Activate translations, Must be called when application starts.
   * @param next_ callback to app start.
   */

  async lang(class_, next_) {
    if (!window.localStorage.getItem("lang")) return next_();

    let This = class_;

    if (!Config?.folderName) {
      console.error(
        "WinnetouJs Translation Miss Configuration Error:You have to specify the name of winnetou folder in order to use the translations;"
      );

      return next_();
    }

    if (Config.folderName === "/") Config.folderName = "";

    let defaultLang = Config?.defaultLang;
    let localLang = window.localStorage.getItem("lang");
    if (localLang) defaultLang = localLang;

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 404) {
        console.log(
          "\nThe file ",
          `${Config.folderName}/translations/${defaultLang}.xml`,
          "are not found"
        );
      }

      if (this.readyState == 4 && this.status == 200) {
        try {
          let trad = this.responseXML;
          let el = trad.getElementsByTagName("winnetou");
          let frases = el[0].childNodes;
          frases.forEach(item => {
            if (item.nodeName != "#text") {
              This[item.nodeName] = item.textContent;
            }
          });
        } catch (e) {
          console.log(
            "The translation file ",
            `${Config.folderName}/translations/${defaultLang}.xml`,
            " seens to be empty or incorrect.",
            e.message
          );
        }

        return next_();
      }
    };
    xhttp.open(
      "GET",
      `${Config.folderName}/translations/${defaultLang}.xml`,
      true
    );
    xhttp.send();
  }

  /**
   * Change language
   * @param lang string language
   */
  changeLang(lang) {
    window.localStorage.setItem("lang", lang);
    location.reload();
  }
  /**
   * Change application css
   * @param  {object} theme New theme
   */
  newTheme(theme) {
    let root = document.documentElement;

    Object.keys(theme).forEach(function (item) {
      root.style.setProperty(item, theme[item]);
    });

    window.localStorage.setItem("theme", JSON.stringify(theme));
  }

  vdom() {
    return document.createDocumentFragment();
  }

  create(frag, output, options) {
    let el = document.querySelectorAll(output);

    if (el.length === 0) {
      el = document.querySelectorAll("#" + output);
    }

    el.forEach(item => {
      // options
      if (options && options.clear) item.innerHTML = "";
      // @ts-ignore
      if (options && options.reverse) item.prepend(frag);
      else {
        item.appendChild(frag);
      }
    });
  }
}

export const Winnetou = new Winnetou_();
