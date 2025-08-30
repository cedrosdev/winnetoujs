interface MutableSubscriber {
  pureId: string;
  method: any;
  elements: any;
  options: any;
}

class Winnetou_ {
  public constructoId: number = 0;
  protected mutable: Record<string, any> = {};
  public usingMutable: Record<string, MutableSubscriber[]> = {};
  private storedEvents: any[] = [];
  public strings: Record<string, any> = {};
  private observer: MutationObserver | null = null;

  constructor() {}

  setMutable(
    mutable: string,
    value: any,
    localStorage?: boolean | "notPersistent"
  ): void {
    if (localStorage !== false && localStorage !== "notPersistent") {
      window.localStorage.setItem(`mutable_${mutable}`, value);
    }

    if (localStorage === false || localStorage === "notPersistent") {
      this.mutable[mutable] = value;
    }

    if (this.usingMutable[mutable]) {
      const tmpArr = this.usingMutable[mutable];
      this.usingMutable[mutable] = [];

      tmpArr.forEach(item => {
        const old_ = document.getElementById(item.pureId);
        if (old_ == null) return;

        const new_ = document
          .createRange()
          .createContextualFragment(
            new item.method(item.elements, item.options).constructoString()
          );

        this.replace(new_, old_);
      });
    }
  }

  initMutable(value: any): string {
    const name = (new Date().getMilliseconds() * Math.random() * 10000).toFixed(
      0
    );
    this.setMutable(name, value, "notPersistent");
    return name;
  }

  setMutableNotPersistent(mutable: string, value: any): void {
    this.setMutable(mutable, value, "notPersistent");
  }

  getMutable(mutable: string): string | null {
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
    start: (): boolean => {
      if (this.observer) return false;
      this.observer = new MutationObserver(
        (mutationsArray: MutationRecord[]) => {
          try {
            mutationsArray.forEach((mutationRecord: MutationRecord) => {
              mutationRecord.removedNodes.forEach((removedNode: Node) => {
                const removedId =
                  removedNode instanceof Element ? removedNode.id : null;
                const appElement = document.getElementById("app");
                if (appElement) {
                  appElement.dispatchEvent(
                    new CustomEvent("constructoRemoved", {
                      detail: { removedId },
                    })
                  );
                }
              });
            });
          } catch (e) {}
        }
      );
      this.observer.disconnect();
      const appElement = document.getElementById("app");
      if (appElement) {
        this.observer.observe(appElement, {
          childList: true,
          subtree: true,
        });
      }
      return true;
    },

    onRemove: (id: string, callback: () => void): boolean => {
      const controller = new AbortController();
      const signal = controller.signal;
      const appElement = document.getElementById("app");
      if (appElement) {
        appElement.addEventListener(
          "constructoRemoved",
          (data: Event) => {
            const customEvent = data as CustomEvent<{ removedId: string }>;
            if (id === customEvent.detail.removedId) {
              callback();
              controller.abort();
            }
          },
          {
            signal,
          }
        );
      }
      return true;
    },

    destroy: (): void => {
      setTimeout(() => {
        if (this.observer) {
          this.observer.disconnect();
          this.observer = null;
        }
      }, 100);
    },
  };

  replace(new_: DocumentFragment, old_: HTMLElement): void {
    if (old_ && old_.parentNode) {
      const ele_ = old_.parentNode;
      ele_.replaceChild(new_, old_);
    }
  }

  fx(function_: Function, ...args: any[]): string {
    const name =
      "winnetouFx" +
      (new Date().getMilliseconds() * Math.random() * 10000).toFixed(0);
    (window as any)[name] = function_;
    return `${name}(${args
      .map(x => (x === "this" ? `this` : `'${x}'`))
      .join(",")})`;
  }
}

export const Winnetou = new Winnetou_();
export const W = Winnetou;
export const Win = Winnetou;
