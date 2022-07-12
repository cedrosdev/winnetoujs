//@ts-ignore
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
   * initMutable initiates a mutable with
   * unique name saving it in
   * notPersistent mode and returning it name.
   * @param {string} value The string value of
   * mutable
   * @returns {string} unique name of mutable
   */
  initMutable(value) {
    try {
      let name = (
        new Date().getMilliseconds() *
        Math.random() *
        10000
      ).toFixed(0);

      this.setMutable(name, value, "notPersistent");

      return name;
    } catch (e) {
      console.log("erro ao criar mutable", e);
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
   * Select the indicated element.
   * If selector is a class or tag and user request for
   * a get function (e.g. getScrollTop()) the returned value
   * will be of the first occurrence ([0]) of matches.
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
       * Gets the file of a input type file
       *
       * @typedef {Object} File_
       * @property {number} lastModified
       * @property {Date} lastModifiedDate
       * @property {string} name
       * @property {number} size
       * @property {string} type
       *
       * @returns {File_}
       */
      getFile() {
        return el[0].files[0];
      },
      /**
       * Gets file array of a input type file
       *
       * @returns {Array.<File_>}
       */
      getFiles() {
        return el[0].files;
      },
      /**
       * get scrollTop of a constructo
       */
      getScrollTop() {
        return el[0].scrollTop;
      },

      disable() {
        el[0].disabled = true;
        return this;
      },

      enable() {
        el[0].disabled = false;
        return this;
      },
    };

    el = obj.getEl(selector);

    if (el[0] === null) {
      console.warn(
        `WinnetouJs Warning: The provided element selector (${selector}) does not exists in DOM. Winnetou is skipping this fatal error, but verify.`
      );

      let void_ = this.vdom();
      void_.appendChild(
        document
          .createRange()
          .createContextualFragment("<p class='foo'>")
      );

      el = void_.querySelectorAll(".foo");
    }

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
   * @param {boolean} pushState To use navigate without change URL
   */
  navigate(url, pushState = true) {
    if (window.history && window.history.pushState) {
      this.callRoute(url);
      pushState && this.pushState(url);
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
   * Winnetou function storage method
   * @param  {function} function_ Function to be called when event fires
   * @param  {string} args A list of arguments comma separated
   */
  fx(function_, args = "") {
    let name =
      "winnetouFx" +
      (new Date().getMilliseconds() * Math.random() * 10000).toFixed(
        0
      );
    window[name] = function_;
    return `${name}(${args})`;
  }

  /**
   * Method for handle events.
   * @param  {string} event Event name, eg. 'click' or 'mouseover'
   * @param  {string} elementSelector A valid element selector
   * @param  {function} callback callback function
   */
  listen(event, elementSelector, callback) {
    try {
      document
        .querySelector("#" + elementSelector)
        .addEventListener(event, e => {
          callback(e);
        });
    } catch (e) {
      document.querySelectorAll(elementSelector).forEach(x => {
        x.addEventListener(event, e => {
          callback(e);
        });
      });
    }
  }

  /**
   * @deprecated
   * This method proved to be inefficient
   * in object-oriented environments.
   * It will be removed in the next
   * major version of WinnetouJs.
   * Use listen instead.
   * @description
   * Method for handle events.
   * This method will add an event listener to entire document
   * associating elementSelector to the event.
   * In this way the construct can be created after the creation
   * of the event listener which will still fire correctly.
   *
   *
   * @param  {string} eventName Name of event, eg. "keyup"
   * @param  {string} elementSelector DOM selector, id, class or tag
   * @param  {function} callback function to be called when trigger event, eg. e=>{}
   * @param  {object} [options]
   * @param  {Array.<string>} [options.remove] Array of child elements that will not be activated by the action trigger.
   */
  on(eventName, elementSelector, callback, options) {
    let callbackBck;
    /**
     * This will test event to be not duplicated.
     * this.storedEvents contains all events created by winnetoujs.
     * If it already exists then return, exiting algorithm.
     */
    let test = this.storedEvents.filter(
      data =>
        data.eventName === eventName &&
        data.elementSelector === elementSelector &&
        data.callback === callback.toString()
    );
    // if test filter returned a result, then exit.
    if (test.length > 0) {
      return;
    }
    // else continue and store the event
    this.storedEvents.push({
      eventName,
      elementSelector,
      callback: callback.toString(),
    });

    switch (eventName) {
      /**
       * If the provided event is a scroll event, it must be
       * associated with element and not to document.
       * In this case the returned value is the event
       * which can be accessed by e.target.scrollTop
       * or Winnetou.select(e.target)
       */
      case "scroll":
        try {
          document
            .querySelector("#" + elementSelector)
            .addEventListener("scroll", e => {
              callback(e);
            });
        } catch (e) {
          document
            .querySelector(elementSelector)
            .addEventListener("scroll", e => {
              callback(e);
            });
        }
        break;

      /**
       * On touch devices sets event handler to touchstart
       * fallbacks to click
       */
      case "click":
        eventName =
          "ontouchstart" in document.documentElement
            ? "touchstart"
            : "click";
        document.addEventListener(eventName, eventHandler);
        break;

      /**
       * if it is not a special event
       * finally add the event listener to document, associating 'eventHandler'.
       */
      default:
        document.addEventListener(eventName, eventHandler);
        break;
    }

    /**
     * This function will be stored in EventListener with
     * provided elementSelector
     * @param {any} e EventListener
     */
    function eventHandler(e) {
      // if elementSelector is an id but without #
      let elementSelectorId = "#" + elementSelector;

      /**
       * https://developer.mozilla.org/pt-BR/docs/Web/API/Element/closest
       *
       * First the algorithm will search if the clicked element (e.target)
       * owns an element that matches elementSelector
       * if not, exits.
       */
      if (!e.target.closest(elementSelector)) {
        try {
          if (!e.target.closest(elementSelectorId)) {
            return;
          }
        } catch (e) {
          return;
        }
      }

      // boolean that controls if callback function
      // can be fired
      let shouldContinue = true;

      /**
       * e.path contains all child elements of trigger
       * element, so it will be scanned.
       */
      let path = e.path || (e.composedPath && e.composedPath());
      for (let c = 0; c < path.length; c++) {
        // item now is the deepest element
        let item = path[c];

        /**
         * if options.remove was provided
         * needs to check if a child element
         * must be excluded
         */
        if (options && options.remove) {
          // remove scan
          for (let w = 0; w < options.remove.length; w++) {
            try {
              // if match, switch control to false
              if (item.matches(options.remove[w])) {
                shouldContinue = false;
              }

              // if not match, try an selector id (#id)
              if (item.matches("#" + options.remove[w])) {
                shouldContinue = false;
              }
            } catch (e) {}
          }
        }

        /**
         * check if item matches elementSelector
         */
        try {
          if (item.matches(elementSelector)) {
            /**
             * if match, trigger the stored callback
             * providing the element as parameter (item)
             * if shouldContinue is true
             */
            shouldContinue && callback(item);
          } else if (item.matches(elementSelectorId)) {
            /**
             * if not match, try forcing id selector (#id)
             */
            shouldContinue && callback(item);
          }
        } catch (e) {}
      }
    }
  }

  /**
   * @deprecated This method will be removed in the next major version
   * due to its inefficiency when handling multiple callbacks.
   * Use listen instead.
   * @description
   * On touch devices sets event handler to touchstart
   * fallbacks to click
   * @param  {string} selector DOM selector, id, class or tag
   * @param  {function} callback function to be called when trigger event, eg. e=>{}
   * @param  {object} [options]
   * @param  {Array.<string>} [options.remove]
   */
  click(selector, callback, options) {
    var clickHandler =
      "ontouchstart" in document.documentElement
        ? "touchstart"
        : "click";

    this.on(
      clickHandler,
      selector,
      el => {
        callback(el);
      },
      options
    );
  }

  /**
   * Activate translations, Must be called when application starts.
   * @param {function} next_ callback to app start.
   * @param {object} class_ the Strings class
   * @example
   * Winnetou.lang(Strings, render);
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
          let xml = this.responseXML;
          let el = xml.getElementsByTagName("winnetou");
          let lines = el[0].childNodes;
          lines.forEach(item => {
            if (item.nodeName != "#text") {
              This[item.nodeName] = item.textContent;
            }
          });
        } catch (e) {
          console.log(
            "The translation file ",
            `${Config.folderName}/translations/${defaultLang}.xml`,
            " seems to be empty or incorrect.",
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

  async updateTranslations(class_) {
    /**
     * Function to get json from API
     * @param {string} url API Endpoint
     */
    const get = url => {
      return new Promise((resolve, reject) => {
        fetch(url, {
          method: "GET",
        })
          .then(function (response) {
            if (response.ok) {
              return response.json();
            } else {
              return reject(response);
            }
          })
          .then(function (data) {
            return resolve(data);
          })
          .catch(function (error) {
            return reject(error);
          });
      });
    };
    return new Promise(async (resolve, reject) => {
      if (!window.localStorage.getItem("lang")) return resolve();

      let This = class_;

      if (!Config?.folderName) {
        console.error(
          "WinnetouJs updateTranslations Miss Configuration Error:You have to specify the name of winnetou folder in order to use the translations;"
        );

        return resolve();
      }

      if (Config.folderName === "/") Config.folderName = "";

      let defaultLang = Config?.defaultLang;
      let localLang = window.localStorage.getItem("lang");
      if (localLang) defaultLang = localLang;

      let data = await get(
        `${Config.folderName}/translations/${defaultLang}.json`
      );

      // let file = JSON.parse(data);

      Object.keys(data).map(key => {
        let value = data[key];
        This[key] = value;
      });

      return resolve();
    });
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
