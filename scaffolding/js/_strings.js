import {
  Winnetou
} from "../node_modules/winnetoujs/src/winnetou.js";
class Strings_ extends Winnetou {
  constructor() {
    super();


    this.strings = {
      /** @property Congratulations! Your winnetoujs app is health and running. */
      welcome: "Congratulations! Your winnetoujs app is health and running.",

    }


  }
}
const S = new Strings_();

/**
 * Object containing the strings taken from the translation file
 * @param {string} welcome Congratulations! Your winnetoujs app is health and running.
 */
// @ts-ignore
export const Strings = S.strings;