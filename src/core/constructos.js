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
   * Utility to attach an HTML string into the DOM.
   * Supports special cases for table elements, replacement, clearing, and reverse insertion.
   * @protected
   */
  attachToDOM(component, output, options = {}) {
    // Check if the component is a table-related element (tr, td, table, etc.)
    const isTableElement = component.match(
      /^\s*?<tr|^\s*?<td|^\s*?<table|^\s*?<th|^\s*?<tbody|^\s*?<thead|^\s*?<tfoot/
    );

    /**
     * Handle insertion when dealing with table-related elements
     */
    function handleTableElements() {
      // Try to query DOM nodes by selector
      let el = document.querySelectorAll(output);

      // If nothing found, try again using #id
      if (el.length === 0) {
        el = document.querySelectorAll("#" + output);
      }

      // For each matched element in the DOM
      el.forEach(item => {
        // Clear content if option is set
        if (options.clear) item.innerHTML = "";

        // If reverse, put component before existing content
        if (options.reverse) {
          item.innerHTML = component + item.innerHTML;
        } else {
          // Otherwise, append to the end
          item.innerHTML += component;
        }
      });
    }

    /**
     * Handle insertion when dealing with non-table elements
     */
    function handleNormalElements() {
      // Create a document fragment from the HTML string
      const frag = document.createRange().createContextualFragment(component);

      // If output is a selector (string)
      if (typeof output !== "object") {
        let el = document.querySelectorAll(output);

        // If nothing found, try again using #id
        if (el.length === 0) el = document.querySelectorAll("#" + output);

        // For each element found
        el.forEach(item => {
          // Clear existing content if option is set
          if (options.clear) item.innerHTML = "";

          // Insert at the beginning if reverse option is set
          if (options.reverse) {
            item.prepend(frag);
          } else {
            // Otherwise, append at the end
            item.appendChild(frag);
          }
        });
      } else {
        // If output is already a DOM element (object)
        if (options.clear) output.innerHTML = "";

        if (options.reverse) {
          output.prepend(frag);
        } else {
          output.appendChild(frag);
        }
      }
    }

    // Run correct handler depending on the type of HTML element
    if (isTableElement) {
      handleTableElements();
    } else {
      handleNormalElements();
    }
  }
}
