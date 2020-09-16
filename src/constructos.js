import { Winnetou } from "./winnetou.js";

export class Constructos {
  _mutableToString(elements) {
    if (elements) {
      let retorno = JSON.parse(JSON.stringify(elements));
      Object.keys(elements).forEach(item => {
        if (typeof elements[item] === "object") {
          let mutable = elements[item].mutable;
          let val =
            Winnetou.getMutable(mutable) ||
            `Mutable "${mutable}" not initialized yet.`;

          /**
           * change mutable to string
           */
          retorno[item] = val;
        }
      });

      return retorno;
    } else {
      return elements;
    }
  }

  _saveUsingMutable(pureId, elements, method) {
    if (elements) {
      Object.keys(elements).forEach(item => {
        if (typeof elements[item] === "object") {
          if (!Winnetou.usingMutable[elements[item].mutable])
            Winnetou.usingMutable[elements[item].mutable] = [];

          let obj = {
            pureId,
            elements,
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
   * @param  {string} output The node or list of nodes where the component will be created
   * @param  {object} [options] Options to control how the construct is inserted. Optional.
   * @param  {boolean} [options.clear] Clean the node before inserting the construct
   * @param  {boolean} [options.reverse] Place the construct in front of other constructs
   */

  create(component, output, options) {
    let frag;

    if (component.match(/\<tr|\<td/)) {
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
      frag = document
        .createRange()
        .createContextualFragment(component);

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
}
