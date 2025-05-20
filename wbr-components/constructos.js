const fs = require("fs-extra");
const path = require("path");
const Drawer = require("./drawer.js");
const Err = require("./err.js");
const Extension = require("./extension.js");
const Files = require("./files.js");
const recursive = require("recursive-readdir");
const htmlParser = require("node-html-parser");
const escapeStringRegexp = require("escape-string-regexp");
const beautify = require("js-beautify").js;
const { Socket } = require("socket.io");

class Constructos {
  /**
   *
   * @param {object} args
   * @param {Socket<import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, any>} args.globalSocket
   * @param {string} args.constructosPath
   * @param {string} args.constructosOut
   * @param {string} args.dirName
   * @param {boolean} args.watch
   */
  constructor(args) {
    this.globalSocket = args.globalSocket;
    this.constructosPath = args.constructosPath;
    this.constructosOut = args.constructosOut;
    this.dirName = args.dirName;
    this.watch = args.watch;
    this.promisesConstructos = new Array();
    this.idList = new Array();
  }

  /**
   *
   * @param {string} [constructoName]
   * @returns
   */
  async transpile(constructoName) {
    return new Promise(async (resolve, reject) => {
      if (constructoName) {
        // test if file name exists
        if (!fs.existsSync(constructoName)) {
          new Drawer().drawWarning(`File ${constructoName} deleted.`);
          new Drawer().drawFinal(this.watch);
          // check constructos integrity in background
          this.removeDeletedConstructosFiles();
          return;
        }
        this.promisesConstructos.push(this.transpileConstructo(constructoName));
        new Drawer().drawAdd(constructoName);
        return resolve(await this.execPromisesConstructos());
      }

      const constructosPath = this.constructosPath;

      recursive(
        path.join(this.dirName, constructosPath),
        async (err, files) => {
          if (err) {
            new Drawer().drawError(err.message);
          }
          recursive(
            path.join(this.dirName, "./node_modules"),
            async (err2, files2) => {
              if (err2) {
                new Drawer().drawError(err2.message);
                return resolve(true);
              }
              files2 = files2
                .filter(x => x.includes("win-"))
                .filter(x => x.includes(".htm") || x.includes(".html"));

              if (files2.length > 0) {
                try {
                  files = files.concat(files2);
                } catch (e) {
                  console.log("e :>> ", e);
                }
              }

              for (let index in files) {
                try {
                  let file = files[index];

                  if (typeof file === "string") {
                    let ext = path.parse(path.join(this.dirName, file)).ext;
                    if (ext == ".html" || ext == ".htm") {
                      this.promisesConstructos.push(
                        this.transpileConstructo(file)
                      );
                      new Drawer().drawAdd(file);
                    }
                  }
                } catch (e) {
                  new Err().e002(e.message);
                }
              }

              await this.execPromisesConstructos();
              return resolve(true);
            }
          );
        }
      );
    });
  }

  async transpileConstructo(filePath) {
    return new Promise((resolve, reject) => {
      try {
        new Files().getFileFromCacheAsync(filePath).then(data => {
          // transforma o html em método
          let dom = htmlParser.parse(data);
          let components = dom.querySelectorAll("winnetou");
          let finalReturn = "";
          let constructos = [];

          Array.from(components).forEach(component => {
            let descri = component.getAttribute("description");
            let constructo = component.innerHTML;
            let jsdoc = "\n\n// ========================================";
            jsdoc += "\n/**\n";
            jsdoc += `\t* ${descri || ""}\n`;
            let requiredElement = false;
            let hasPropElements = false;
            let jsdoc2 = "";

            let id;

            try {
              const match = constructo.match(/\[\[\s?(.*?)\s?\]\]/);
              if (match) id = match[1];
              else {
                new Err().e006(filePath);
                return;
              }
            } catch (e) {
              new Err().e006(filePath);
              return;
            }

            let pureId = id + "-win-${identifier}";

            let verify = this.idList.filter(data => data.id === id);

            //duplicated constructo
            if (verify.length > 0) {
              new Err().e001(id, filePath, verify[0].file);
            }

            this.idList.push({
              file: filePath,
              id,
            });

            // ===========================================
            // ids replace ===============================
            // ===========================================

            let regId = /\[\[\s*?(.*?)\s*?\]\]/g;
            let matchIds = new Array();

            matchIds = constructo.match(regId) || [];

            let ids = "ids:{";

            matchIds = matchIds.map(item =>
              item.replace("[[", "").replace("]]", "")
            );
            matchIds = matchIds.map(item => item + "-win-${identifier}");

            matchIds.forEach(item => {
              let nome = item.split("-win-")[0];
              ids += nome + ":`" + item + "`,";
            });

            ids += "},";

            constructo = constructo.replace(
              /\[\[\s*?(.*?)\s*?\]\]/g,
              "$1-win-${identifier}"
            );

            // ===========================================
            // elements replace ==========================
            // ===========================================

            let regex = new RegExp("{{\\s*?(.*?)\\s*?}}", "g");

            let matches = constructo.match(regex);

            if (matches) {
              hasPropElements = true;
              matches.forEach(match => {
                let el = match.replace("{{", "");
                el = el.replace("}}", "");

                let elArr = el.split("%");

                let required = false;
                if (elArr[0].indexOf("?") != -1) {
                  required = false;
                } else {
                  required = true;
                  requiredElement = true;
                }

                el = elArr[0].replace("?", "").trim();
                let commentary = elArr[1] || "";

                jsdoc2 += `\t* @param {any} ${
                  required ? `elements.${el}` : `[elements.${el}]`
                }  ${commentary.trim()}\n`;

                let escapedString = escapeStringRegexp(match);

                constructo = constructo.replace(
                  new RegExp(escapedString, "g"),
                  "${(elements_?." + el + (required ? "" : ' || ""') + ")}"
                );
              });
            }

            if (hasPropElements && requiredElement)
              jsdoc += "\t* @param {object} elements\n";

            if (hasPropElements && !requiredElement)
              jsdoc += "\t* @param {object} [elements]\n";

            jsdoc += jsdoc2;

            jsdoc += "\t* @param {object} [options]\n";
            jsdoc += "\t* @param {string} [options.identifier]\n";

            if (!hasPropElements) {
              jsdoc += "\t* @param {object} [oldOptions]\n";
              jsdoc += "\t* @param {string} [oldOptions.identifier]\n";
            }

            jsdoc += "\t*/\n";

            let _return =
              `/**@private */
            class ${id}_ extends Constructos {` +
              jsdoc +
              ` constructo = (${hasPropElements ? "elements," : ""} options${
                hasPropElements ? "" : ", oldOptions"
              }) => {` +
              `${
                hasPropElements
                  ? ""
                  : `
              if (!options?.identifier && oldOptions?.identifier) {
                options = oldOptions;
              }
              ` + "\n\nlet elements = {};"
              }` +
              "\n\nlet identifier = this._mutableToString(options);" +
              "\nidentifier = this._getIdentifier(options?identifier.identifier || 'notSet':'notSet');" +
              "let elementsToString = this._mutableToString(elements);" +
              "let component;" +
              "let obj = {" +
              "code(elements_) {" +
              "return `" +
              constructo +
              "`" +
              "}," +
              `
              
            /**
             * Create Winnetou Constructo        
             * @param  {object|string} output The node or list of nodes where the component will be created
             * @param  {object} [options] Options to control how the construct is inserted. Optional.
             * @param  {boolean} [options.clear] Clean the node before inserting the construct
             * @param  {boolean} [options.reverse] Place the construct in front of other constructs
             * @param {object} [options.vdom] Winnetou.vdom() fragment
             * @param {boolean} [options.replace] Replace a constructo
             */
              
              ` +
              '"create":(output,options) => {' +
              "this.create(component,output, options);" +
              "return {" +
              ids +
              "}" +
              "}" + // create close
              ",constructoString: () => obj.code(elementsToString)" +
              "}" + // closes let obj
              "component = obj.code(elementsToString);" +
              " this._saveUsingMutable(\
                `" +
              pureId +
              "`,\
                elements,options,\
                " +
              id +
              "_\
              );" +
              "return obj;" +
              // -------------------------
              "}" + // constructo close
              // ---------------------------
              "}"; // class close
            // ---------------------------

            finalReturn += _return;
            constructos.push(`export const ${id} = new ${id}_().constructo;`);
          });

          new Extension().sendToExtension({
            socket: this.globalSocket,
            type: "file",
            payload: path.basename(filePath),
          });
          return resolve({
            class: beautify(finalReturn, {
              indent_size: 2,
              space_in_empty_paren: true,
            }),
            exports: constructos,
            filePath,
          });
        });
      } catch (e) {
        return reject(e.message);
      }
    });
  }

  async execPromisesConstructos() {
    return new Promise((resolve, reject) => {
      Promise.all(this.promisesConstructos).then(async data => {
        for (let c = 0; c < data.length; c++) {
          let item = data[c];

          let out = `
          import { Winnetou } from "../../node_modules/winnetoujs/src/winnetou.js";
          import { Constructos } from "../../node_modules/winnetoujs/src/constructos.js";
  
          \n\n`;
          out += item.class;
          out += "\n\n";
          out += item.exports.join("\n");

          let resultadoFinal = beautify(out, {
            indent_size: 2,
            space_in_empty_paren: true,
          });

          let fileName = path.parse(item.filePath).name;

          let pathOut = path.join(
            this.dirName,
            this.constructosOut,
            `${fileName}.js`
          );

          await fs.outputFile(pathOut, resultadoFinal);
        }

        return resolve(true);
      });
    });
  }

  removeDeletedConstructosFiles() {
    /**
     * Will read all constructos in folder and node_modules
     * and compares with output js to delete obsoletes.
     */

    const constructosPath = path.join(this.dirName, this.constructosPath);
    const constructosOut = path.join(this.dirName, this.constructosOut);

    recursive(constructosPath, async (err, files) => {
      if (err) {
        new Drawer().drawError(err.message);
      }
      recursive(
        path.join(this.dirName, "./node_modules"),
        async (err2, files2) => {
          if (err2) files2 = [];
          files2 = files2
            .filter(x => x.includes("win-"))
            .filter(x => x.includes(".htm") || x.includes(".html"));

          if (files2.length > 0) {
            try {
              files = files.concat(files2);
            } catch (e) {
              console.log("e :>> ", e);
            }
          }

          files = files.map(x => path.parse(x).name);

          recursive(constructosOut, async (err3, jsFiles) => {
            jsFiles = jsFiles.map(x => path.parse(x).name);

            let diff = this.diffArray(files, jsFiles);

            diff = diff.map(x => path.join("./", constructosOut, x + ".js"));

            diff.forEach(item => {
              fs.unlink(item, e => {});
            });
          });
        }
      );
    });
  }

  diffArray(arr1, arr2) {
    return arr1
      .concat(arr2)
      .filter(val => !(arr1.includes(val) && arr2.includes(val)));
  }
}

module.exports = Constructos;
