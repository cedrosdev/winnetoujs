/**
 * WinnetouJs Base Class
 */

// const Config = require("./win.config.json");

import Config from "../../../win.config.js";

export class Winnetou {
  constructor() {
    /**
     * Incrementally id when no specific identifier is given
     * @protected
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
     * @protected
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

    /**
     * POPSTATE NATIVO
     */
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

    /**
     * TEMAS
     */

    let theme = window.localStorage.getItem("theme");
    if (theme) {
      theme = JSON.parse(theme);
      let root = document.documentElement;
      Object.keys(theme).forEach(function (item) {
        root.style.setProperty(item, theme[item]);
      });

      // tema alterado carregado
    } else {
      // tema default carregado
    }
  }

  /**
   * @protected
   *
   */
  _test(identifier, id, pureId, elements) {
    if (elements) {
      let retorno = JSON.parse(JSON.stringify(elements));
      Object.keys(elements).forEach(item => {
        if (typeof elements[item] === "object") {
          // é mutable
          // precisa registrar este constructo para ser alterado
          // pelo setMutable
          // não devo usar variáveis e sim localstorage
          // sabemos que variáveis não são confiáveis

          //atualiza o elements para retornar atualizado
          let mutable = elements[item].mutable;
          let val = this.getMutable(mutable) || "";

          // agora tenho que salvar o constructo
          if (!this.usingMutable[elements[item].mutable])
            this.usingMutable[elements[item].mutable] = [];

          let obj = {
            identifier,
            id,
            pureId,
            elements,
          };

          // apenas faz o push caso o pureId ainda não exista

          if (
            this.usingMutable[elements[item].mutable].filter(
              x => x.pureId == pureId
            ).length > 0
          ) {
            // do nothing
          } else {
            this.usingMutable[elements[item].mutable].push(obj);
          }

          retorno[item] = val;
        }
      });

      return retorno;
    } else {
      return elements;
    }
  }

  /**
   * @protected
   * @param  {string=} identifier
   */
  _getIdentifier(identifier) {
    if (identifier != "notSet") return identifier;
    else return ++this.constructoId;
  }

  /**
   * Create Winnetou Constructo
   * @param  {string} component The component to be inserted
   * @param  {string} output The node or list of nodes where the component will be created
   * @param  {object} [options] Options to control how the construct is inserted. Optional.
   * @param  {boolean} [options.clear] Clean the node before inserting the construct
   * @param  {boolean} [options.reverse] Place the construct in front of other constructs
   */
  create(component, output, options) {
    let frag = document
      .createRange()
      .createContextualFragment(component);

    let el = document.querySelectorAll(output);

    /**
     * Isso para não precisar
     * usar o # quando se tem o id
     */
    if (el.length === 0) {
      el = document.querySelectorAll("#" + output);
    }

    el.forEach(item => {
      // options
      if (options && options.clear) item.innerHTML = "";
      // @ts-ignore
      if (options && options.reverse) item.prependChild(frag);
      else item.appendChild(frag);
    });
  }

  destroy(component) {
    try {
      this.select(component).remove();
    } catch (e) {
      // throw winnetou error
    }
  }

  /**
   * Sets the value of passed winnetou mutable
   * @param {string} mutable string that represents a winnetou mutable
   * @param {string} value string value to be associated to mutable
   * @param {boolean=} localStorage bool to save the state on the machine at the user, true by default
   */
  setMutable(mutable, value, localStorage = true) {
    if (localStorage) {
      window.localStorage.setItem(`mutable_${mutable}`, value);
    } else {
      this.mutable[mutable] = value;
    }

    if (this.usingMutable[mutable]) {
      let tmpArr = this.usingMutable[mutable];

      this.usingMutable[mutable] = [];

      tmpArr.forEach(item => {
        let old_ = document.getElementById(item.pureId);

        let new_ = document.createRange().createContextualFragment(
          this[item.id](item.elements, {
            identifier: item.identifier,
          }).code
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
    let local_mutable =
      window.localStorage.getItem(`mutable_${mutable}`) || null;
    if (!local_mutable) local_mutable = this.mutable[mutable] || null;
    return local_mutable;
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
       * @param {string} selector
       */
      getEl(selector) {
        if (el) return el;
        else {
          //
          if (selector.includes(" ")) {
            return document.querySelectorAll(selector);
          }
          //
          else if (selector.includes("#")) {
            selector = selector.replace("#", "");
            return [document.getElementById(selector)];
          }
          //
          else if (selector.includes(".")) {
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
      remove() {
        el.forEach(item => {
          item.remove();
        });
        return this;
      },
      html(texto) {
        el.forEach(item => {
          item.innerHTML = texto;
        });
        return this;
      },
      getHtml() {
        return el[0].innerHTML;
      },
      getText() {
        return el[0].textContent;
      },
      append(texto) {
        el.forEach(item => {
          item.innerHTML += texto;
        });
        return this;
      },
      prepend(texto) {
        // el.innerHTML = texto + el.innerHTML;
        el.forEach(item => {
          item.innerHTML = texto + item.innerHTML;
        });
        return this;
      },
      /**
       * @param {string | number} property
       * @param {string | number} value
       */
      css(property, value) {
        el.forEach(item => {
          try {
            // @ts-ignore
            if (typeof value == "number") value += "px";
            item.style[property] = value;
          } catch (e) {}
        });
        return this;
      },
      toggleClass(classe) {
        el.forEach(item => {
          item.classList.toggle(classe);
        });
        return this;
      },
      addClass(classe) {
        el.forEach(item => {
          item.classList.add(classe);
        });
        return this;
      },
      removeClass(classe) {
        el.forEach(item => {
          item.classList.remove(classe);
        });
        return this;
      },
      hide() {
        el.forEach(item => {
          item.classList.add("winnetou_display_none");
        });
        return this;
      },
      show() {
        el.forEach(item => {
          item.classList.remove("winnetou_display_none");

          if (getComputedStyle(item).display == "none") {
            item.style.display = "initial";
          }
        });
        return this;
      },
      getWidth() {
        return el[0].getBoundingClientRect().width;
      },
      getHeight() {
        return el[0].getBoundingClientRect().height;
      },
      getLeft() {
        return el[0].offsetLeft;
      },
      getTop() {
        return el[0].offsetTop;
      },
      getGlobalPosition() {
        return el[0].getBoundingClientRect();
      },
      getVal() {
        return el[0].value;
      },
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
      setAttr(attr, value) {
        el.forEach(item => {
          item.setAttribute(attr, value);
        });
        return this;
      },
      getAttr(attr) {
        return el[0].getAttribute(attr);
      },
      isChecked() {
        return el[0].checked;
      },
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

      // vai verificar nas paramRoutes quais tem size == 2 e comparar
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
        for (let j = 1; j < root.length; j++) {
          if (root[j] !== splittedUrl[j]) {
            correctMatch = false;
            if (root[j].includes(":")) {
              correctMatch = true;
              paramStore.push(splittedUrl[j]);
            } else {
              correctMatch = false;
              break;
              // aqui ja deveria interromper o for J
              // pois nao pode ter nenhum correctMatch false
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
      document.write("Not Found");
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
   * @param  {string} eventName
   * @param  {string} elementSelector
   * @param  {function} handler
   */
  on(eventName, elementSelector, handler) {
    // Todo:
    // dá para dar um JSON.stringify aqui e guardar a função

    let test = this.storedEvents.filter(
      data =>
        data.eventName === eventName &&
        data.elementSelector === elementSelector &&
        data.handler === handler.toString()
    );

    if (test.length > 0) {
      // console.log(
      //   `O evento global << ${eventName} >> já foi declarado para o objeto << ${elementSelector} >>, para evitar duplicações use o mesmo bloco de código para implementar novas funções, se for o caso.`,
      //   "\n\n",
      //   "Chamada de função:\n" + handler
      // );
      return;
    }
    this.storedEvents.push({
      eventName,
      elementSelector,
      handler: handler.toString(),
    });

    function eventHandler(e) {
      for (
        var target = e.target;
        target && target != this;
        // @ts-ignore
        target = target.parentNode
      ) {
        // @ts-ignore
        if (target.matches(elementSelector)) {
          handler(target);
          break;
        }
      }
    }

    document.addEventListener(eventName, eventHandler);
  }
  /**
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

  async lang(instance, next_) {
    if (!window.localStorage.getItem("lang")) return next_();

    let This = instance;

    

    /**
     * O problema do fetch é que ele precisa saber o caminho relativo para poder obter as informações do config, porém neste ponto ainda não sabemos o caminho relativo, pois também é uma variável do config.
     * Preciso de uma forma eficiênte de ler a configuração
     * o WBR, winnetouBase e webpack.js irão ler este arquivo
     * na verdade o webpack deve ser um comando dentro do wbr
     * COMO PASSAR PARÂMETROS VIA LINHA DE COMANDO PARA UM SCRIPT NODEJS?
     * Então vão ser o wbr e o _winnetouBase.js que irão ler as configs.
     * É muita incongruência entre o node e o browser
     * isso não era pra acontecer. ¬¬
     * so se eu tivesse dois arquivos de configuração distintos, muita mão
     */

    // let Config = await fetch("./js/win.config.json").then(res =>
    //   res.json()
    // );

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
          "\nO arquivo ",
          `${Config.folderName}/translations/${defaultLang}.xml`,
          "não foi encontrado"
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
            "O arquivo de tradução ",
            `${Config.folderName}/translations/${defaultLang}.xml`,
            " parece estar vazio ou incorreto.",e.message
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
}

export const W = new Winnetou();


