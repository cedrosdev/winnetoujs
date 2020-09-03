import {
  Winnetou
} from "../../node_modules/winnetoujs/src/winnetou.js";

/**@private */
class welcome_ extends Winnetou {

  // ========================================




  /**
   * 
   * @param {object} elements
   * @param {any} elements.title 
   * @param {object} [options]
   * @param {any=} options.identifier
   */
  constructo = (elements, options) => {

    let identifier = this._getIdentifier(options ? options.identifier || 'notSet' : 'notSet');

    elements = this._test(identifier, 'welcome', `welcome-win-${identifier}`, elements);
    let component;
    let obj = {
      code(elements) {
        return `
  <div id="welcome-win-${identifier}">
    <h1>WinnetouJs</h1>
    <h2>${(elements?.title)}</h2>
    <p>
      <a href="https://winnetoujs.org">https://winnetoujs.org</a>
    </p>
  </div>
`
      },

      /**
       * Create Winnetou Constructo        
       * @param  {string} output The node or list of nodes where the component will be created
       * @param  {object} [options] Options to control how the construct is inserted. Optional.
       * @param  {boolean} [options.clear] Clean the node before inserting the construct
       * @param  {boolean} [options.reverse] Place the construct in front of other constructs
       */

      "create": (output, options) => {
        this.create(component, output, options);
        return {
          ids: {
            welcome: `welcome-win-${identifier}`,
          },
        }
      }
    }
    component = obj.code(elements);
    return obj;
  }
}

export const welcome = new welcome_().constructo;