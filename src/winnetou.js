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

  setMutable(mutable, value, localStorage) {
    if (locaStorage !== false && localStorage !== "notPersistent") {
      // it must save in localstorage
      window.localStorage.setItem(`mutable_${mutable}`, value);
    }

    if (localStorage === false || localStorage === "notPersistent") {
      // it must save in ephemeral memory
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

  initMutable(value) {
    let name = (new Date().getMilliseconds() * Math.random() * 10000).toFixed(
      0
    );

    this.setMutable(name, value, "notPersistent");

    return name;
  }

  setMutableNotPersistent(mutable, value) {
    this.setMutable(mutable, value, "notPersistent");
  }

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

  replace(new_, old_) {
    if (old_ && old_.parentNode) {
      let ele_ = old_.parentNode;
      ele_.replaceChild(new_, old_);
    }
  }

  fx(function_, ...args) {
    let name =
      "winnetouFx" +
      (new Date().getMilliseconds() * Math.random() * 10000).toFixed(0);
    window[name] = function_;
    return `${name}(${args
      .map(x => (x === "this" ? `this` : `'${x}'`))
      .join(",")})`;
  }
}

export const Winnetou = new Winnetou_();
export const W = Winnetou;
export const Win = Winnetou;
