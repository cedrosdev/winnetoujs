import { Winnetou } from "./winnetou.js";

export class Constructos {
  /**
   *
   * Digest all constructo props to find
   * {mutable:"string"} pattern in order to
   * change it to W.getMutable("string") value
   * @param {object} constructoProps
   * @protected
   */
  _mutableToString(constructoProps) {
    if (constructoProps) {
      let jsonElements = JSON.parse(JSON.stringify(constructoProps));

      Object.keys(constructoProps).forEach(item => {
        if (
          typeof constructoProps[item] === "object" &&
          constructoProps[item] !== null
        ) {
          let mutable = constructoProps[item].mutable;

          let val;

          Winnetou.getMutable(mutable) || Winnetou.getMutable(mutable) === ""
            ? (val = Winnetou.getMutable(mutable))
            : (val = `Mutable "${mutable}" not initialized yet.`);

          /**
           * change mutable to string
           */
          jsonElements[item] = val;
        }
      });

      return jsonElements;
    } else {
      return constructoProps;
    }
  }

  /**
   * Store constructos that using mutables
   * in Winnetou.usingMutable var in order to
   * update constructo when W.setMutable
   * if triggered.
   * @param {*} pureId
   * @param {*} elements
   * @param {*} options
   * @param {*} method
   * @protected
   */
  _saveUsingMutable(pureId, elements, options, method) {
    if (elements) {
      Object.keys(elements).forEach(item => {
        if (typeof elements[item] === "object" && elements[item] !== null) {
          if (!Winnetou.usingMutable[elements[item].mutable])
            Winnetou.usingMutable[elements[item].mutable] = [];

          let obj = {
            pureId,
            elements,
            options,
            method,
          };

          if (
            Winnetou.usingMutable[elements[item].mutable].filter(
              x => x.pureId == pureId
            ).length > 0
          ) {
            // do nothing
          } else {
            Winnetou.usingMutable[elements[item].mutable].push(obj);
          }
        }
      });
    }

    if (options) {
      Object.keys(options).forEach(item => {
        if (typeof options[item] === "object" && options[item] !== null) {
          if (!Winnetou.usingMutable[options[item].mutable])
            Winnetou.usingMutable[options[item].mutable] = [];

          let obj = {
            pureId,
            elements,
            options,
            method,
          };

          if (
            Winnetou.usingMutable[options[item].mutable].filter(
              x => x.pureId == pureId
            ).length > 0
          ) {
            // do nothing
          } else {
            Winnetou.usingMutable[options[item].mutable].push(obj);
          }
        }
      });
    }
  }

  /**
   * Generates a random identifier
   * @protected
   * @param  {string=} identifier
   */
  _getIdentifier(identifier) {
    if (identifier != "notSet") return identifier;
    else return ++Winnetou.constructoId;
  }

  /**
   * Insert a constructo into DOM tree
   * @param {*} component
   * @param {*} output
   * @param {*} options
   * @protected
   */
  attachToDOM(component, output, options) {
    let frag;

    if (
      component.match(
        /^\s*?<tr|^\s*?<td|^\s*?<table|^\s*?<th|^\s*?<tbody|^\s*?<thead|^\s*?<tfoot/
      )
    ) {
      let el = document.querySelectorAll(output);
      if (el.length === 0) {
        el = document.querySelectorAll("#" + output);
      }

      el.forEach(item => {
        // options
        if (options && options.clear) item.innerHTML = "";
        // @ts-ignore
        if (options && options.reverse)
          item.innerHTML = component + item.innerHTML;
        else {
          item.innerHTML += component;
        }
      });
    } else {
      frag = document.createRange().createContextualFragment(component);

      if (typeof output !== "object") {
        let el;

        if (options && options.vdom) {
          el = options.vdom.querySelectorAll(output);

          if (el.length === 0) {
            el = options.vdom.querySelectorAll("#" + output);
          }
        } else {
          el = document.querySelectorAll(output);

          if (el.length === 0) {
            el = document.querySelectorAll("#" + output);
          }
        }

        el.forEach(item => {
          if (options && options.replace) {
            Winnetou.replace(frag, item);

            return;
          }

          if (options && options.clear) item.innerHTML = "";
          // @ts-ignore
          if (options && options.reverse) item.prepend(frag);
          else {
            item.appendChild(frag);
          }
        });
      } else {
        if (options && options.clear) output.innerHTML = "";
        // @ts-ignore
        if (options && options.reverse) output.prepend(frag);
        else {
          output.appendChild(frag);
        }
      }
    }
  }
}
