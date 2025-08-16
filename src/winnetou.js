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

    /**@private */
    this.storedEvents = [];

    /**@type {object} */
    this.strings = {};

    /**
     * @type {any}
     * @private
     * */
    this.observer;
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

        let new_ = document
          .createRange()
          .createContextualFragment(
            new item.method(item.elements, item.options).constructoString()
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
    let name = (new Date().getMilliseconds() * Math.random() * 10000).toFixed(
      0
    );

    this.setMutable(name, value, "notPersistent");

    return name;
  }

  /**
   * Decorator for setMutable with notPersistent behavior.
   * Sets the value of passed winnetou mutable
   * Usually used for temporary mutables with initMutable
   * @param {string} mutable string that represents a winnetou mutable
   * @param {string} value string value to be associated to mutable
   */
  setMutableNotPersistent(mutable, value) {
    this.setMutable(mutable, value, "notPersistent");
  }

  /**
   * Gets the value of passed winnetou mutable
   * @param {string} mutable string that represents a winnetou mutable
   * @returns {string|null} value or null if not exists
   */
  getMutable(mutable) {
    if (
      window.localStorage.getItem(`mutable_${mutable}`) ||
      window.localStorage.getItem(`mutable_${mutable}`) === ""
    ) {
      return window.localStorage.getItem(`mutable_${mutable}`);
    } else if (this.mutable[mutable] || this.mutable[mutable] === "") {
      return this.mutable[mutable];
    } else {
      return null;
    }
  }

  mutations = {
    /**
     * Starts the entire app constructos removal watch events. This method is only called once, even if you instantiate it several times. Only works if your main app element is 'app'.
     * @returns {boolean}
     */
    start: () => {
      if (this.observer) return;
      this.observer = new MutationObserver(mutationsArray => {
        try {
          mutationsArray.forEach(MutationRecord => {
            MutationRecord.removedNodes.forEach(removedNode => {
              let removedId =
                removedNode instanceof Element ? removedNode.id : null;
              document.getElementById("app").dispatchEvent(
                new CustomEvent("constructoRemoved", {
                  detail: { removedId },
                })
              );
            });
          });
        } catch (e) {}
      });
      this.observer.disconnect();
      this.observer.observe(document.getElementById("app"), {
        childList: true,
        subtree: true,
      });
      return true;
    },
    /**
     * Add a remove event binding to constructo
     * @param {string} id constructo id that will be watched
     * @param {function} callback the function that will be called when constructo is removed
     * @returns {boolean}
     */
    onRemove: (id, callback) => {
      const controller = new AbortController();
      const signal = controller.signal;
      document.getElementById("app").addEventListener(
        "constructoRemoved",
        /**
         *
         * @param {CustomEvent} data
         */
        data => {
          if (id === data.detail.removedId) {
            callback();
            controller.abort();
          }
        },
        {
          signal,
        }
      );
      return true;
    },
    /**
     * Remove the main listener from app.
     * Using this method is discouraged as
     * it may break your app elsewhere in the code.
     * Use it at your own risk.
     */
    destroy: () => {
      setTimeout(() => {
        this.observer.disconnect();
        this.observer = null;
      }, 100);
    },
  };

  /**
   * @private
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
   * Winnetou function storage method. If you provide this, use quotes.
   * @param  {function} function_ Function to be called when event fires
   * @param  {...string} args A list of arguments comma separated
   * @example
   * ```
   let div3 = myFirstDiv(
    {
      sub_title_txt: "subtitle 3",
      title_txt: "title 3",
      onclick: Winnetou.fx(el => (el.style.color = "white"), "this"),
    },
    { identifier: "2" }
   ).create("#app").ids.myFirstDiv;
  ```
   */
  fx(function_, ...args) {
    let name =
      "winnetouFx" +
      (new Date().getMilliseconds() * Math.random() * 10000).toFixed(0);
    window[name] = function_;
    if (args[0] === "this") return `${name}(this)`;
    if (args.length === 1) return `${name}('${args[0]}')`;
    return `${name}(${args
      .map(x => (x === "this" ? `this` : `'${x}'`))
      .join(",")})`;
  }
}

export const Winnetou = new Winnetou_();
export const W = Winnetou;
export const Win = Winnetou;
