import {
  Winnetou
} from "../../node_modules/winnetoujs/src/winnetou.js";
import {
  Constructos
} from "../../node_modules/winnetoujs/src/constructos.js";



/**@private */
class welcome_ extends Constructos {

  // ========================================
  /**
   * 
   * @param {object} elements
   * @param {any} elements.title 
   * @param {any} elements.text 
   * @param {object} [options]
   * @param {any=} options.identifier
   */
  constructo = (elements, options) => {

    let identifier = this._mutableToString(options);
    identifier = this._getIdentifier(options ? identifier.identifier || 'notSet' : 'notSet');

    let elementsToString = this._mutableToString(elements);
    let component;
    let obj = {
      code(elements_) {
        return `
  <div id="welcome-win-${identifier}" class="welcome">
    <img src="https://raw.githubusercontent.com/cedrosdev/winnetoujs_assets/master/logo_v1_2020/logo_transparent.png"
      class="logo"
    >
    <h1>WinnetouJs</h1>
    <h2>${(elements_?.title)}</h2>
    <span class="text">${(elements_?.text)}</span>
    <p class="main_link">
      <a href="https://winnetoujs.org" target="_blank">winnetoujs.org</a>
    </p>
  </div>
`
      },

      /**
       * Create Winnetou Constructo        
       * @param  {object|string} output The node or list of nodes where the component will be created
       * @param  {object} [options] Options to control how the construct is inserted. Optional.
       * @param  {boolean} [options.clear] Clean the node before inserting the construct
       * @param  {boolean} [options.reverse] Place the construct in front of other constructs
       * @param {object} [options.vdom] Winnetou.vdom() fragment
       * @param {boolean} [options.replace] Replace a constructo
       */

      "create": (output, options) => {
        this.create(component, output, options);
        return {
          ids: {
            welcome: `welcome-win-${identifier}`,
          },
          code: obj.code(elementsToString),
        }
      },
      constructoString: () => obj.code(elementsToString)
    }
    component = obj.code(elementsToString);
    this._saveUsingMutable(`welcome-win-${identifier}`, elements, options, welcome_);
    return obj;
  }
}

export const welcome = new welcome_().constructo;