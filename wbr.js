/**
 * ==========================
 * W B R                    =
 * Winnetou Bundle Release  =
 * ==========================
 *
 * MIT License
 *
 * Copyright 2020 Cedros Development https://winnetoujs.org
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 */

const fs = require("fs-extra");
const path = require("path");
const recursive = require("recursive-readdir");
const htmlParser = require("node-html-parser");
const beautify = require("js-beautify").js;
const prettify = require("html-prettify");
const escapeStringRegexp = require("escape-string-regexp");
const xml = require("xml-parse");
const sass = require("sass");
const UglifyCss = require("uglifycss");
const { exit } = require("process");
const winnetouPackage = require("winnetoujs/package.json");
const watch = require("node-watch");
const webpack = require("webpack");
const ncp = require("ncp").ncp;

let global = {
  errorsCount: 0,
  warningCount: 0,
  /**@type {import("./interfaces.js").IWinConfig} */
  config: {
    constructosPath: "",
    constructosOut: "",
    entry: undefined,
    out: undefined,
    sass: "",
    cssOut: "",
    defaultLang: "",
    publicPath: "",
    icons: "",
  },
  promisesCss: new Array(),
  idList: new Array(),
  promisesConstructos: new Array(),
  promisesIcons: new Array(),
  fileCache: new Array(),
  fileLastMod: new Array(),
  init: new Date().getTime(),
  finish: null,
  res: null,
  transpileComplete: false,
  transpileIconsComplete: false,
};

class WBR {
  constructor() {
    new Drawer().drawWelcome();
    this.readArgs();
  }

  readArgs() {
    if (process.argv.length === 2) this.transpileAll();
    else {
      const arg1 = process.argv[2];
      const arg2 = process.argv[3];

      switch (arg1) {
        case "--version":
          console.log(winnetouPackage.version);
          exit();
          break;

        case "--v":
          console.log(winnetouPackage.version);
          exit();
          break;

        case "-version":
          console.log(winnetouPackage.version);
          exit();
          break;

        case "-v":
          console.log(winnetouPackage.version);
          exit();
          break;

        case "--webpack":
          this.bundleRelease();
          break;

        case "-webpack":
          this.bundleRelease();
          break;

        case "--bundleRelease":
          arg2 === "--standalone" || arg2 === "-standalone"
            ? this.bundleRelease(false)
            : this.bundleRelease();
          break;

        case "-bundleRelease":
          arg2 === "--standalone" || arg2 === "-standalone"
            ? this.bundleRelease(false)
            : this.bundleRelease();
          break;

        case "":
          this.transpileAll();
          break;

        default:
          new Drawer().drawError(
            `Unknown command ${arg1}. ${
              arg1 === "--buildRelease" || arg1 === "-buildRelease"
                ? "Did you mean --bundleRelease?"
                : ""
            }`
          );
          break;
      }
    }
  }

  fixedJson(badJSON) {
    let a = badJSON.replace("export default", "").replace(";", "");
    return eval(`(${a})`);
  }

  async config() {
    return new Promise(async (resolve, reject) => {
      try {
        let data = await fs.readFile("./win.config.js", "utf-8");
        global.config = this.fixedJson(data);
        return resolve(true);
      } catch (e) {
        global.config = {
          constructosPath: "./constructos",
          constructosOut: "./js/constructos",
          entry: "./js/app.js",
          out: "./release",
          sass: "./sass",
          cssOut: "./release",
          defaultLang: "en-us",
          publicPath: "/",
        };
        new Err().e003();
        console.log(e);
        return resolve(true);
      }
    });
  }

  async testConfig() {
    if (!global.config.out) {
      new Drawer().drawWarning(
        "win.config.js misconfigured. Not found 'out' parameter. Using default './release'"
      );
      global.config.out = "./release";
    }

    if (!global.config.constructosPath) {
      new Drawer().drawWarning(
        "win.config.js misconfigured. Not found 'constructosPath' parameter. Using default './constructos'"
      );
      global.config.constructosPath = "./constructos";
    }

    if (!global.config.constructosOut) {
      new Drawer().drawWarning(
        "win.config.js misconfigured. Not found 'constructosOut' parameter. Using default './js/constructos'"
      );
      global.config.constructosOut = "./js/constructos";
    }

    if (!global.config.entry) {
      new Drawer().drawWarning(
        "win.config.js misconfigured. Not found 'entry' parameter. Using default './js/app.js'"
      );
      global.config.entry = "./js/app.js";
    }

    if (!global.config.cssOut) {
      new Drawer().drawWarning(
        "win.config.js misconfigured. Not found 'cssOut' parameter. Using default './release'"
      );
      global.config.cssOut = "./release";
    }

    if (!fs.existsSync(global.config.constructosPath)) {
      new Err().e005();
    }

    return true;
  }

  getTimeElapsed() {
    const finish = new Date().getTime();
    const res = finish - global.init;
    new Drawer().drawText("in " + res + "ms", { color: "dim" });
  }

  watchFiles() {
    const refresh = name => {
      new Drawer().drawChange(name);
      global.idList = [];
      global.promisesConstructos = [];
      global.promisesCss = [];
      global.promisesIcons = [];
      global.errorsCount = 0;
      global.warningCount = 0;
      global.init = new Date().getTime();
    };

    if (global.config.defaultLang) {
      try {
        watch.default(
          `./translations`,
          { recursive: true },
          async (evt, name) => {
            refresh(name);
            await new Translator().translate();
            this.getTimeElapsed();
            new Drawer().drawFinal();
          }
        );
      } catch (e) {}
    }

    if (global.config.constructosPath) {
      try {
        watch.default(
          global.config.constructosPath,
          { recursive: true },
          async (evt, name) => {
            if (global.transpileComplete && global.transpileIconsComplete) {
              global.transpileComplete = false;
              refresh(name);
              await new Constructos().transpile(name);
              this.getTimeElapsed();
              new Drawer().drawFinal();
            }
          }
        );
      } catch (e) {}
    }

    if (global.config.icons) {
      let folders = [];
      if (global.config.icons) folders.push(global.config.icons);
      try {
        watch.default(folders, { recursive: true }, async (evt, name) => {
          refresh(name);
          global.transpileComplete = false;
          global.transpileIconsComplete = false;
          await new Icons().transpile();
          await new Constructos().transpile();
          this.getTimeElapsed();
          new Drawer().drawFinal();
        });
      } catch (e) {}
    }

    if (global.config.sass) {
      let folders = [];
      if (global.config.sass) folders.push(global.config.sass);
      try {
        watch.default(folders, { recursive: true }, async (evt, name) => {
          refresh(name);
          await new Sass().transpile();
          this.getTimeElapsed();
          new Drawer().drawFinal();
        });
      } catch (e) {}
    }
  }

  // node wbr
  async transpileAll(watch = true) {
    await this.config();
    await this.testConfig();
    if (global.config?.sass) await new Sass().transpile();
    if (global.config?.icons) await new Icons().transpile();
    if (global.config?.defaultLang) await new Translator().translate();
    await new Constructos().transpile();
    if (watch) this.getTimeElapsed();
    if (watch) new Drawer().drawFinal();
    if (watch) this.watchFiles();
  }

  // node wbr --webpack
  async bundleRelease(transpileAll = true) {
    transpileAll
      ? await this.transpileAll(false)
      : (await this.config(), await this.testConfig());
    let entry = global.config.entry;
    let out = global.config.out;
    if (typeof entry === "object") {
      let keys = Object.keys(entry);
      keys.map(key => {
        global.config.entry = entry[key];
        global.config.out = out[key];
        return this.__bundle(entry[key], out[key]);
      });
    } else {
      return this.__bundle(global.config.entry, global.config.out);
    }
  }

  __bundle(entry, out) {
    const compiler = webpack({
      entry: entry,
      output: {
        chunkFilename: "[name].bundle.js",
        filename: "winnetouBundle.min.js",
        path: path.resolve(__dirname, out),
        publicPath: path.join(/*Config.folderName,*/ out, "/"),
      },
      mode: "production",
      devtool: "source-map",
      module: {
        rules: [
          {
            test: /\.js$/,
            use: {
              loader: "babel-loader",
              options: {
                presets: [
                  [
                    "@babel/preset-env",
                    {
                      targets:
                        "last 2 Chrome versions, last 2 Firefox versions",
                    },
                  ],
                ],
                plugins: [
                  "@babel/plugin-transform-optional-chaining",
                  "@babel/plugin-transform-nullish-coalescing-operator",
                  [
                    "@babel/plugin-transform-runtime",
                    {
                      regenerator: true,
                    },
                  ],
                  /* "@babel/plugin-proposal-class-properties",*/
                ],
              },
            },
          },
        ],
      },
    });
    new Drawer().drawTextBlock(
      `Initializing webpack winnetou bundle, please wait. \n\n${entry} => ${out}`
    );
    new Drawer().drawBlankLine();
    return compiler.run((e, s) => {
      if (e) {
        new Drawer().drawError(e.message);
      }
      if (s && s.compilation.errors.length > 0) {
        new Drawer().drawError(s.compilation.errors.toString());
      }
      if (s && s.compilation.warnings.length > 0) {
        new Drawer().drawWarning(s.compilation.warnings.toString());
      }
      new Drawer().drawAdd(`'${entry} => ${out}`);
      this.getTimeElapsed();
      new Drawer().drawFinal();
      return true;
    });
  }
}

class Icons {
  transpile() {
    return new Promise(async (resolve, reject) => {
      let constructoIcons = "";

      const iconsPath = global.config.icons;
      let files;

      if (iconsPath) {
        try {
          files = await recursive(iconsPath);
        } catch (e) {
          new Drawer().drawError(e.message);
          return resolve(true);
        }

        for (let c = 0; c < files.length; c++) {
          global.promisesIcons.push(this.transpileIcon(files[c]));
        }
      }

      Promise.all(global.promisesIcons).then(async res => {
        let splitter = new Array();
        splitter["icons"] = [];

        res.forEach(item => {
          if (typeof item == "object") {
            let s = item.iconPath.split("/");
            if (s.length > 2) {
              if (!splitter[s[1]]) splitter[s[1]] = [];
              splitter[s[1]].push(item.symbol);
            } else {
              splitter["icons"].push(item.symbol);
            }
          }
        });

        let finalPromise = [];

        Object.keys(splitter).forEach(key => {
          finalPromise.push(
            fs.outputFile(
              path.join(
                global.config.constructosPath,
                `_icons${key != "icons" ? "_" + key : ""}.html`
              ),
              prettify(splitter[key].join("\n"))
            )
          );
        });

        Promise.all(finalPromise).then(res => {
          global.transpileIconsComplete = true;
          return resolve(true);
        });
      });
    });
  }

  async transpileIcon(iconPath) {
    return new Promise(async (resolve, reject) => {
      try {
        let xmlString = await new Files().getFileFromCacheAsync(iconPath);

        let regPath = /[a-zA-Z0-9_]+/g;

        let id = iconPath.match(regPath);

        id = id.filter(x => x != "svg");

        id = id.join("_");

        let regVb = new RegExp('viewBox="(.*?)"', "gis");

        let reg = new RegExp("<svg(.*?)>(.*?)</svg>", "is");

        if (xmlString) {
          let viewBox = xmlString.match(regVb);

          let arr = xmlString.match(reg);

          let symbol = `
                <winnetou description="Create an icon **${id}**">
                <svg ${viewBox} 
                  id="[[${id}]]" 
                  class="winIcons {{?class%Class for the icon}}">
          `;

          let cleanFill = arr[2].replace("fill", "data-fill");

          symbol += cleanFill;

          symbol += `</svg></winnetou>`;

          new Drawer().drawAdd(iconPath);
          return resolve({ symbol, iconPath });
        } else {
          return reject();
        }
      } catch (e) {
        new Drawer().drawAddError(iconPath);
        return resolve("");
      }
    });
  }
}

class Constructos {
  async transpile(constructoName) {
    return new Promise(async (resolve, reject) => {
      if (constructoName) {
        // test if file name exists
        if (!fs.existsSync(constructoName)) {
          new Drawer().drawWarning(`File ${constructoName} deleted.`);
          new Drawer().drawFinal();
          // check constructos integrity in background
          this.removeDeletedConstructosFiles();
          return;
        }
        global.promisesConstructos.push(
          this.transpileConstructo(constructoName)
        );
        new Drawer().drawAdd(constructoName);
        return resolve(await this.execPromisesConstructos());
      }

      const constructosPath = global.config.constructosPath;

      recursive(constructosPath, async (err, files) => {
        if (err) {
          new Drawer().drawError(err.message);
        }
        recursive("./node_modules", async (err2, files2) => {
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
                let ext = path.parse(path.join(__dirname, file)).ext;
                // apenas se for html ou htm
                if (ext == ".html" || ext == ".htm") {
                  global.promisesConstructos.push(
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
        });
      });
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

            let verify = global.idList.filter(data => data.id === id);

            //duplicated constructo
            if (verify.length > 0) {
              new Err().e001(id, filePath, verify[0].file);
            }

            global.idList.push({
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

                jsdoc2 += `\t* @param {any${
                  required ? "" : "="
                }} elements.${el} ${commentary.trim()}\n`;

                let escapedString = escapeStringRegexp(match);

                constructo = constructo.replace(
                  new RegExp(escapedString, "g"),
                  "${(elements_?." + el + (required ? "" : ' || ""') + ")}"
                );
              });
            }

            if (requiredElement) jsdoc += "\t* @param {object} elements\n";
            else jsdoc += "\t* @param {object} [elements]\n";

            jsdoc += jsdoc2;

            jsdoc += "\t* @param {object} [options]\n";
            jsdoc += "\t* @param {any=} options.identifier\n";

            jsdoc += "\t*/\n";

            let _return =
              `/**@private */
            class ${id}_ extends Constructos {` +
              jsdoc +
              " constructo = (elements, options) => {" +
              "\n\nlet identifier = this._mutableToString(options);" +
              "\nidentifier = this._getIdentifier(options?identifier.identifier || 'notSet':'notSet');" +
              "\n\nlet elementsToString = this._mutableToString(elements);" +
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
              "code: obj.code(elementsToString)," +
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
      Promise.all(global.promisesConstructos).then(async data => {
        /**
         * data[0].method
         * data[0].constructosList
         * data [0].filePath
         */

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
            global.config.constructosOut,
            `${fileName}.js`
          );

          await fs.outputFile(pathOut, resultadoFinal);
        }

        global.transpileComplete = true;

        return resolve(true);
      });
    });
  }

  removeDeletedConstructosFiles() {
    /**
     * Will read all constructos in folder and node_modules
     * and compares with output js to delete obsoletes.
     */

    const constructosPath = global.config.constructosPath;
    const constructosOut = global.config.constructosOut;

    recursive(constructosPath, async (err, files) => {
      if (err) {
        new Drawer().drawError(err.message);
      }
      recursive("./node_modules", async (err2, files2) => {
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
      });
    });
  }

  diffArray(arr1, arr2) {
    return arr1
      .concat(arr2)
      .filter(val => !(arr1.includes(val) && arr2.includes(val)));
  }
}

class Translator {
  constructor() {
    this.translationsPath = path.join(__dirname, "/translations");
  }

  async translate() {
    return await this.xml();
  }

  async xml() {
    return new Promise((resolve, reject) => {
      let strings = "";
      fs.readFile(
        `${this.translationsPath}/${global.config.defaultLang}.xml`,
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
            "./js/_strings.js",
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
        `${this.translationsPath}/${global.config.defaultLang}.json`,
        "utf-8",
        async (err, data) => {
          if (err) {
            new Drawer().drawError(err.message);
            return resolve(true);
          }
          let file;
          try {
            file = JSON.parse(data);
          } catch (e) {
            new Err().e007(
              e,
              `${this.translationsPath}/${global.config.defaultLang}.json`
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
            "./js/_strings.js",
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
}

class Sass {
  async transpile() {
    return new Promise((resolve, reject) => {
      if (global.config.sass) {
        // recursive read dir
        recursive(global.config.sass, async (err, files) => {
          if (err) {
            new Drawer().drawError(err.message);
            this.execSassPromises();
            return;
          }
          for (let c = 0; c < files.length; c++) {
            try {
              // add to promisesCss array
              global.promisesCss.push(this.transpileSass(files[c]));
              new Drawer().drawAdd(files[c]);
            } catch (e) {
              new Drawer().drawAddError(files[c]);
              new Drawer().drawText("Sass transpile error.");
              new Drawer().drawTextBlock(e.message);
              new Drawer().drawBlankLine();
            }
          }

          await this.execSassPromises();
          return resolve(true);
        });
      }
    });
  }

  async transpileSass(file) {
    return new Promise(async (resolve, reject) => {
      sass
        .compileAsync(file)
        .then(res => {
          return resolve(res.css.toString());
        })
        .catch(e => {
          return reject(e);
        });
    });
  }

  async execSassPromises() {
    return new Promise((resolve, reject) => {
      Promise.all(global.promisesCss)
        .then(data => {
          // data has all css files
          data.push(
            `    
                * {
                    -webkit-overflow-scrolling: touch;
                  }   
                .winnetou_display_none {
                    display: none !important;
                  }                
            `
          );

          let result = UglifyCss.processString(data.join("\n"));

          fs.outputFile(
            global.config.cssOut + "/winnetouBundle.min.css",
            result,
            function (err) {
              if (err) {
                new Err().e004();
              }
              return resolve(true);
            }
          );
        })
        .catch(e => {
          new Err().e004();
          return resolve(true);
        });
    });
  }
}

class Drawer {
  drawLine = (size = 80) => {
    let line = "";
    for (let i = 0; i < size; i++) {
      if (i == 1) line += " ";
      else if (i == size - 2) line += " ";
      else line += "=";
    }
    console.log(line);
  };
  /**
   * Draw string line
   * @param  {string} [text] string to be printed
   * @param  {object} [params]
   * @param {('cyan'|'yellow'|'green'|'red'|'error'|'bright'|'dim'|'warning')} [params.color] string color
   * @param {number} [params.size] line size, default 80
   * @param {('add'|'addError'|'change')} [params.type] string style type
   */
  drawText = (text = "", params) => {
    let color = "";

    if (params?.color) {
      switch (params.color) {
        case "cyan":
          color = "\x1b[36m";
          break;

        case "yellow":
          color = "\x1b[33m";
          break;

        case "green":
          color = "\x1b[32m";
          break;

        case "red":
          color = "\x1b[31m";
          break;

        case "error":
          color = "\x1b[1m\x1b[5m\x1b[41m\x1b[37m";
          break;

        case "warning":
          color = "\x1b[1m\x1b[33m";
          break;

        case "bright":
          color = "\x1b[1m";
          break;

        case "dim":
          color = "\x1b[2m";
          break;
      }
    }

    let line = "= " + color + text + "\x1b[0m";

    if (params?.type === "add") {
      line = "= \x1b[42m\x1b[37m success \x1b[0m " + color + text + "\x1b[0m";
      text = " success  " + text;
    }

    if (params?.type === "change") {
      line = "= \x1b[45m\x1b[37m changed \x1b[0m " + color + text + "\x1b[0m";
      text = " changed  " + text;
    }

    if (params?.type === "addError") {
      line =
        "= \x1b[5m\x1b[43m\x1b[37m fail \x1b[0m " + color + text + "\x1b[0m";
      text = " fail  " + text;
    }

    let tamanho = text.length + 2;

    let size = params?.size || 80;

    for (let i = 0; i < size - tamanho; i++) {
      if (i == size - tamanho - 1) line += "=";
      else line += " ";
    }

    console.log(line);
  };

  drawTextBlock = (text, params) => {
    let arr = text.match(/.{1,74}/g);
    arr.forEach(item => {
      this.drawText(item, params);
    });
  };

  drawBlankLine = () => {
    this.drawText();
  };

  drawSpace = () => {
    console.log("\n");
  };

  /**
   * Draw error
   * @param {string} text error string
   */
  drawError = text => {
    global.errorsCount++;
    this.drawLine();
    this.drawBlankLine();
    this.drawText(" Bundle Error ", { color: "error" });
    this.drawBlankLine();
    this.drawTextBlock(text);
    this.drawBlankLine();
    this.drawLine();
    this.drawBlankLine();
  };

  drawWarning = text => {
    global.warningCount++;
    this.drawLine();
    this.drawBlankLine();
    this.drawText("Warning", { color: "warning" });
    this.drawBlankLine();
    this.drawTextBlock(text);
    this.drawBlankLine();
    this.drawLine();
  };

  drawWelcome = () => {
    // console.clear();
    this.drawLine();
    this.drawBlankLine();
    this.drawBlankLine();
    // this.drawText("WINNETOUJS ", { color: "dim" });
    // this.drawBlankLine();
    this.drawText("WinnetouJs Bundle Releaser (WBR)", {
      color: "yellow",
    });
    // this.drawBlankLine();
    this.drawText("Version " + winnetouPackage.version, { color: "yellow" });

    this.drawBlankLine();
    this.drawBlankLine();
    this.drawLine();
    this.drawBlankLine();
    this.drawText("Find online help and docs", { color: "dim" });
    this.drawText("https://winnetoujs.org");
    this.drawBlankLine();
    this.drawText("Fork on GitHub", { color: "dim" });
    this.drawText("https://github.com/cedrosdev/WinnetouJs.git");
    this.drawBlankLine();
    // don't use new Date here, it needs to be manually updated
    // to the last year of the project in order to
    // ensure updates are being made
    this.drawText(
      `(c) 2020 - 2024 Cedros Development (https://cedrosdev.com)`,
      {
        color: "dim",
      }
    );

    this.drawBlankLine();
    this.drawLine();
    this.drawBlankLine();
  };

  /**
   * Draw add
   * @param {string} text add string
   */
  drawAdd = text => {
    this.drawText(text, { type: "add", color: "green" });
    this.drawBlankLine();
  };

  drawChange = text => {
    this.drawText(text, { type: "change", color: "green" });
    this.drawBlankLine();
  };

  drawAddError = text => {
    global.errorsCount++;

    this.drawText(text, { type: "addError", color: "cyan" });
    this.drawBlankLine();
  };

  drawHtmlMin = text => {
    console.log("> [html minified] " + text);
  };

  drawEnd = text => {
    console.log("> [Bundle Release Finished] " + text);
  };

  drawFinal = () => {
    this.drawLine();
    this.drawBlankLine();
    this.drawText("All tasks completed.");
    this.drawBlankLine();
    if (global.errorsCount > 0) {
      this.drawText("... with " + global.errorsCount + " errors");
      this.drawBlankLine();
    }
    if (global.warningCount > 0) {
      this.drawText("... with " + global.warningCount + " warnings");
      this.drawBlankLine();
    }

    this.drawLine();
    this.drawSpace();
  };
}

class Err {
  /**
   * Cod e001
   * Duplicated constructo error
   * @param  {string} id
   * @param  {string} filePath
   * @param  {string} originalFile
   */
  e001(id, filePath, originalFile) {
    new Drawer().drawWarning(
      "Error code: e001\n" +
        `The constructo [[${id}]] of file "${filePath}" is duplicated. The original file is "${originalFile}".`
    );
    process.stderr.write("\x07");
  }

  /**
   * Cod e002
   * Transpile constructo error
   * @param  {string} e
   */
  e002(e) {
    new Drawer().drawError(
      "Error Code: e002\n" +
        "Transpile constructo error. Original Message: " +
        e
    );
    process.stderr.write("\x07");
  }

  /**
   * Cod 003
   * win.config.js
   */
  e003() {
    new Drawer().drawError(
      "Error Code: 003\n" +
        `"./win.config.js" not found or misconfigured. Default config will be used.`
    );
    process.stderr.write("\x07");
  }

  e004() {
    new Drawer().drawError(
      "Error Code: 004\n" + `Fatal error when creating the css bundle`
    );
    process.stderr.write("\x07");
  }

  e005() {
    new Drawer().drawError(
      "Error Code: 005\n" + `The constructos folder does not exists`
    );
    process.stderr.write("\x07");
  }

  e006(file) {
    new Drawer().drawError(
      "Error Code: 006\n" +
        `There are a constructo without [[id]] in a file "${file}"`
    );
    process.stderr.write("\x07");
  }

  e007(error, file) {
    new Drawer().drawError(
      "Error Code: 007\n" +
        `Error while reading translation file. Check if it is a valid json file. \nOriginal error:  ${error}\nFile: ${file}`
    );
    process.stderr.write("\x07");
  }
}

class Files {
  /**
   * Read file from cache with fallback to filesystem
   * @param  {string} filePath path of the file
   * @returns promise with data
   */
  getFileFromCacheAsync(filePath) {
    return new Promise((resolve, reject) => {
      let lastMod;
      try {
        lastMod = fs.statSync(filePath).mtime.toString();
      } catch (e) {
        return reject(e);
      }
      if (global.fileCache[filePath]) {
        // exists
        // verify last mod
        if (lastMod == global.fileLastMod[filePath]) {
          // same last modification
          // there is no alterations
          return resolve(global.fileCache[filePath]);
        }
      }

      // don't exists
      fs.readFile(filePath, "utf-8", function (err, data) {
        global.fileCache[filePath] = data;
        global.fileLastMod[filePath] = lastMod;
        return resolve(data);
      });
    });
  }
}

new WBR();
