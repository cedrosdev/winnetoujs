import { Winnetou } from "./winnetou";

export class Constructos {
  protected _mutableToString(constructoProps: any): any {
    if (constructoProps) {
      let jsonElements = JSON.parse(JSON.stringify(constructoProps));

      Object.keys(constructoProps).forEach(item => {
        if (
          typeof constructoProps[item] === "object" &&
          constructoProps[item] !== null
        ) {
          let mutable = constructoProps[item].mutable;

          let val: any;

          Winnetou.getMutable(mutable) || Winnetou.getMutable(mutable) === ""
            ? (val = Winnetou.getMutable(mutable))
            : (val = `Mutable "${mutable}" not initialized yet.`);

          jsonElements[item] = val;
        }
      });

      return jsonElements;
    } else {
      return constructoProps;
    }
  }

  protected _saveUsingMutable(
    pureId: any,
    elements: any,
    options: any,
    method: any
  ): void {
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
              (x: any) => x.pureId == pureId
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
              (x: any) => x.pureId == pureId
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

  protected _getIdentifier(identifier: string): string | number {
    if (identifier != "notSet") return identifier;
    else
      return (
        Math.floor(Math.random() * 1e4) + "-" + Math.floor(Math.random() * 1e4)
      );
  }

  /**
   * Attach a component to the DOM
   * @param component The component HTML string
   * @param output Id of element. It is query selector one.
   * @param options Options to control how the construct is inserted. Optional.
   * @protected
   */
  protected attachToDOM(
    component: string,
    output: string,
    options: { clear?: boolean; reverse?: boolean } = {}
  ): void {
    // Check if the component is a table-related element (tr, td, table, etc.)
    const isTableElement = component.match(
      /^\s*?<tr|^\s*?<td|^\s*?<table|^\s*?<th|^\s*?<tbody|^\s*?<thead|^\s*?<tfoot/
    );

    function handleTableElements(): void {
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

    function handleNormalElements(): void {
      // Create a document fragment from the HTML string
      const frag = document.createRange().createContextualFragment(component);

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
    }

    // Run correct handler depending on the type of HTML element
    if (isTableElement) {
      handleTableElements();
    } else {
      handleNormalElements();
    }
  }
}
