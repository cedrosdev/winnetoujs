var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
class Winnetou_ {
  constructor() {
    __publicField(this, "constructoId", 0);
    __publicField(this, "mutable", {});
    __publicField(this, "usingMutable", {});
    __publicField(this, "storedEvents", []);
    __publicField(this, "strings", {});
    __publicField(this, "observer", null);
    __publicField(this, "mutations", {
      start: () => {
        if (this.observer) return false;
        this.observer = new MutationObserver(
          (mutationsArray) => {
            try {
              mutationsArray.forEach((mutationRecord) => {
                mutationRecord.removedNodes.forEach((removedNode) => {
                  const removedId = removedNode instanceof Element ? removedNode.id : null;
                  const appElement2 = document.getElementById("app");
                  if (appElement2) {
                    appElement2.dispatchEvent(
                      new CustomEvent("constructoRemoved", {
                        detail: { removedId }
                      })
                    );
                  }
                });
              });
            } catch (e) {
            }
          }
        );
        this.observer.disconnect();
        const appElement = document.getElementById("app");
        if (appElement) {
          this.observer.observe(appElement, {
            childList: true,
            subtree: true
          });
        }
        return true;
      },
      onRemove: (id, callback) => {
        const controller = new AbortController();
        const signal = controller.signal;
        const appElement = document.getElementById("app");
        if (appElement) {
          appElement.addEventListener(
            "constructoRemoved",
            (data) => {
              const customEvent = data;
              if (id === customEvent.detail.removedId) {
                callback();
                controller.abort();
              }
            },
            {
              signal
            }
          );
        }
        return true;
      },
      destroy: () => {
        setTimeout(() => {
          if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
          }
        }, 100);
      }
    });
  }
  setMutable(mutable, value, localStorage) {
    if (localStorage !== false && localStorage !== "notPersistent") {
      window.localStorage.setItem(`mutable_${mutable}`, value);
    }
    if (localStorage === false || localStorage === "notPersistent") {
      this.mutable[mutable] = value;
    }
    if (this.usingMutable[mutable]) {
      const tmpArr = this.usingMutable[mutable];
      this.usingMutable[mutable] = [];
      tmpArr.forEach((item) => {
        const old_ = document.getElementById(item.pureId);
        if (old_ == null) return;
        const new_ = document.createRange().createContextualFragment(
          new item.method(item.elements, item.options).constructoString()
        );
        this.replace(new_, old_);
      });
    }
  }
  initMutable(value) {
    const name = ((/* @__PURE__ */ new Date()).getMilliseconds() * Math.random() * 1e4).toFixed(
      0
    );
    this.setMutable(name, value, "notPersistent");
    return name;
  }
  setMutableNotPersistent(mutable, value) {
    this.setMutable(mutable, value, "notPersistent");
  }
  getMutable(mutable) {
    if (window.localStorage.getItem(`mutable_${mutable}`) || window.localStorage.getItem(`mutable_${mutable}`) === "") {
      return window.localStorage.getItem(`mutable_${mutable}`);
    } else if (this.mutable[mutable] || this.mutable[mutable] === "") {
      return this.mutable[mutable];
    } else {
      return null;
    }
  }
  replace(new_, old_) {
    if (old_ && old_.parentNode) {
      const ele_ = old_.parentNode;
      ele_.replaceChild(new_, old_);
    }
  }
  fx(function_, ...args) {
    const name = "winnetouFx" + ((/* @__PURE__ */ new Date()).getMilliseconds() * Math.random() * 1e4).toFixed(0);
    window[name] = function_;
    return `${name}(${args.map((x) => x === "this" ? `this` : `'${x}'`).join(",")})`;
  }
}
const Winnetou = new Winnetou_();
const W = Winnetou;
const Win = Winnetou;
export {
  W,
  Win,
  Winnetou
};
//# sourceMappingURL=winnetou.js.map
