const path = require("path");
const fs = require("fs-extra");
const xml = require("xml-parse");
const Drawer = require("./drawer.js");
const Err = require("./err.js");
const Extension = require("./extension.js");
const beautify = require("js-beautify").js;
const { Socket } = require("socket.io");

class Translator {
  /**
   *
   * @param {object} args
   * @param {string} args.dirName
   * @param {string} args.defaultLang
   * @param {Socket<import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, any>} args.globalSocket
   */
  constructor(args) {
    this.dirName = args.dirName;
    this.translationsPath = path.join(args.dirName, "/translations");
    this.defaultLang = args.defaultLang;
    this.globalSocket = args.globalSocket;
  }

  async translate() {
    return await this.xml();
  }

  async xml() {
    return new Promise((resolve, reject) => {
      let strings = "";
      fs.readFile(
        `${this.translationsPath}/${this.defaultLang}.xml`,
        "utf-8",
        async (err, data) => {
          if (err) {
            // first search for legacy xml translation
            // if not located, run new json format
            await this.json();
            return resolve(true);
          }
          let trad = xml.parse(data)[0].childNodes;

          trad.forEach(item => {
            if (item.tagName && item.childNodes[0]?.text) {
              strings += `
                  /** @property ${item.childNodes[0].text.trim()} */           
                  ${item.tagName}: "${item.childNodes[0].text.trim()}",
              `;
            }
          });

          let res = `        
              export default Winnetou.strings = {
                ${strings}
              }
          `;

          let resFinal = `
                  import { 
                    Winnetou 
                  } from "../node_modules/winnetoujs/src/winnetou.js";       
                  ${res}
              `;

          fs.outputFile(
            path.join(this.dirName, "./js/_strings.js"),
            beautify(resFinal, {
              indent_size: 2,
              space_in_empty_paren: true,
            }),
            err => {
              new Drawer().drawAdd("Strings");
              return resolve(true);
            }
          );
        }
      );
    });
  }

  async json() {
    return new Promise((resolve, reject) => {
      let strings = "";

      fs.readFile(
        `${this.translationsPath}/${this.defaultLang}.json`,
        "utf-8",
        async (err, data) => {
          if (err) {
            new Drawer().drawError(err.message);
            return resolve(true);
          }
          let file;
          try {
            if (typeof data === "string") file = JSON.parse(data);
            else throw new Error("data is not a string");
          } catch (e) {
            new Err().e007(
              e,
              `${this.translationsPath}/${this.defaultLang}.json`
            );
            return resolve(true);
          }

          Object.keys(file).map(key => {
            let value = file[key];
            strings += `
                /** @property ${value} */           
                ${key}: "${value}",
            `;
          });
          let res = `        
                      export default Winnetou.strings = {
                        ${strings}
                      }
                    `;
          let resFinal = `
              import { 
                Winnetou 
              } from "../node_modules/winnetoujs/src/winnetou.js";       
              ${res}
          `;
          fs.outputFile(
            path.join(this.dirName, "./js/_strings.js"),
            beautify(resFinal, {
              indent_size: 2,
              space_in_empty_paren: true,
            }),
            err => {
              new Drawer().drawAdd("Strings");
              return resolve(true);
            }
          );
          new Extension().sendToExtension({
            socket: this.globalSocket,
            type: "file",
            payload: path.basename("_strings.js"),
          });
        }
      );
    });
  }
}

module.exports = Translator;
