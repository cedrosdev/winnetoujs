import { Winnetou } from "./winnetou.js";

export class Constructos {
  _mutableToString(elements) {
    if (elements) {
      let jsonElements = JSON.parse(JSON.stringify(elements));

      Object.keys(elements).forEach(item => {
        if (typeof elements[item] === "object" && elements[item] !== null) {
          let mutable = elements[item].mutable;

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
      return elements;
    }
  }

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
   * @protected
   * @param  {string=} identifier
   */
  _getIdentifier(identifier) {
    if (identifier != "notSet") return identifier;
    else return ++Winnetou.constructoId;
  }

  /**
   * Create Winnetou Constructo
   * @param  {string} component The component to be inserted
   * @param  {string | object} output The node or list of nodes where the component will be created
   * @param  {object} [options] Options to control how the construct is inserted. Optional.
   * @param  {boolean} [options.clear] Clean the node before inserting the construct
   * @param  {boolean} [options.reverse] Place the construct in front of other constructs
   * @param {object} [options.vdom] Winnetou.vdom() fragment
   * @param {boolean} [options.replace] Replace a constructo
   */

  create(component, output, options) {
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
