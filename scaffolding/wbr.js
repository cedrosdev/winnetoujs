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

/**
 * Todo:
 *
 * ==> quando define algo no win.config.js e
 *      a pasta não existe
 *      acontece um erro, tem que tratar
 *      esses error
 * ==> [ok] icons ainda não é promise.all
 * ==> [ok] webpack option, usar webpack na chamada?
 * ==> Configuração de saída
 *    --> targets
 * ==> Poder importar do win.config.js as configs
 *      para o webpack
 * ==> map
 * ==> script loads if necessary
 * https://webpack.js.org/guides/lazy-loading/
 * vou usar isso, importantíssimo
 * https://dzone.com/articles/lazy-loading-es2015-modules-in-the-browser
 * https://webpack.js.org/guides/code-splitting/
 */

// REQUIRES ====================================================

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
const package = require("winnetoujs/package.json");
const watch = require("node-watch");
const webpack = require("webpack");

// ARGUMENTS ===================================================

if (process.argv.length === 2) initializer();
else {
  process.argv.forEach(function (val, index, array) {
    if (index === 2) {
      switch (val) {
        case "--version":
          console.log(package.version);
          exit();
          break;

        case "--v":
          console.log(package.version);
          exit();
          break;

        case "-version":
          console.log(package.version);
          exit();
          break;

        case "-v":
          console.log(package.version);
          exit();
          break;

        case "--webpack":
          webpackBundleRelease();
          break;

        case "-webpack":
          webpackBundleRelease();
          break;

        case "":
          initializer();
          break;
      }
    }
  });
}

// GLOBAL VARIABLES =============================================

let idList = [],
  promisesCss = [],
  Config,
  promisesConstructos = [],
  promisesIcons = [],
  errorsCount = 0,
  warningCount = 0,
  fileCache = [],
  fileLastMod = [],
  init = new Date().getTime(),
  finish,
  res,
  transpileComplete = false,
  transpileIconsComplete = false;

// DRAW METHODS ===============================================

// #region

const drawLine = (size = 80) => {
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
const drawText = (text = "", params) => {
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
    line =
      "= \x1b[42m\x1b[37m success \x1b[0m " +
      color +
      text +
      "\x1b[0m";
    text = " success  " + text;
  }

  if (params?.type === "change") {
    line =
      "= \x1b[45m\x1b[37m changed \x1b[0m " +
      color +
      text +
      "\x1b[0m";
    text = " changed  " + text;
  }

  if (params?.type === "addError") {
    line =
      "= \x1b[5m\x1b[43m\x1b[37m fail \x1b[0m " +
      color +
      text +
      "\x1b[0m";
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

const drawTextBlock = (text, params) => {
  let arr = text.match(/.{1,74}/g);
  arr.forEach(item => {
    drawText(item, params);
  });
};

const drawBlankLine = () => {
  drawText();
};

const drawSpace = () => {
  console.log("\n");
};

/**
 * Draw error
 * @param {string} text error string
 */
const drawError = text => {
  errorsCount++;
  drawLine();
  drawBlankLine();
  drawText(" Bundle Error ", { color: "error" });
  drawBlankLine();
  drawTextBlock(text);
  drawBlankLine();
  drawLine();
  drawBlankLine();
};

const drawWarning = text => {
  warningCount++;
  drawLine();
  drawBlankLine();
  drawText("Warning", { color: "warning" });
  drawBlankLine();
  drawTextBlock(text);
  drawBlankLine();
  drawLine();
};

const drawWelcome = () => {
  // console.clear();
  drawLine();
  drawBlankLine();
  drawBlankLine();
  drawText("W I N N E T O U J S ", { color: "bright" });
  drawBlankLine();
  drawText(
    "T h e  i n d i e  j a v a s c r i p t  c o n s t r u c t o r",
    { color: "dim" }
  );
  drawBlankLine();
  drawText("WinnetouJs.org", { color: "yellow" });

  drawBlankLine();
  drawBlankLine();
  drawLine();
  drawBlankLine();
  drawText("Find online help and docs", { color: "dim" });
  drawText("https://winnetoujs.org/docs");
  drawBlankLine();
  drawText("Fork on GitHub", { color: "dim" });
  drawText("https://github.com/cedrosdev/WinnetouJs.git");
  drawBlankLine();
  drawText("(c) 2020 Cedros Development (https://cedrosdev.com)", {
    color: "dim",
  });

  drawBlankLine();
  drawLine();
  drawBlankLine();
};

/**
 * Draw add
 * @param {string} text add string
 */
const drawAdd = text => {
  drawText(text, { type: "add", color: "green" });
  drawBlankLine();
};

const drawChange = text => {
  drawText(text, { type: "change", color: "green" });
  drawBlankLine();
};

const drawAddError = text => {
  errorsCount++;

  drawText(text, { type: "addError", color: "cyan" });
  drawBlankLine();
};

const drawHtmlMin = text => {
  console.log("> [html minifield] " + text);
};

const drawEnd = text => {
  console.log("> [Bundle Release Finished] " + text);
};

const drawFinal = () => {
  drawLine();
  drawBlankLine();
  drawText("All tasks completed");
  drawBlankLine();
  if (errorsCount > 0) {
    drawText("... with " + errorsCount + " errors");
    drawBlankLine();
  }
  if (warningCount > 0) {
    drawText("... with " + warningCount + " warnings");
    drawBlankLine();
  }

  drawLine();
  drawSpace();
};

drawWelcome();

// #endregion

// WEBPACK METHODS ============================================

/**
 * TODO:
 * browser compatibility lazy load
 */

async function webpackBundleRelease() {
  await config();
  configTest();

  const compiler = webpack({
    entry: Config.entry,
    output: {
      chunkFilename: "[name].bundle.js",
      filename: "winnetouBundle.min.js",
      path: path.resolve(__dirname, Config.out),
      publicPath: path.join(Config.out, "/"),
    },
    mode: "production",
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
                "@babel/plugin-proposal-optional-chaining",
                "@babel/plugin-proposal-nullish-coalescing-operator",
                [
                  "@babel/plugin-transform-runtime",
                  {
                    regenerator: true,
                  },
                ],
                "@babel/plugin-proposal-class-properties",
              ],
            },
          },
        },
      ],
    },
  });

  compiler.run((e, s) => {
    console.log(e, s.compilation.errors, s.compilation.warnings);
  });
}

// WBR METHODS ================================================
/**
 * Read file from cache with fallback to filesystem
 * @param  {string} filePath path of the file
 * @returns promise with data
 */
function readFileCache(filePath) {
  return new Promise((resolve, reject) => {
    let lastMod = fs.statSync(filePath).mtime.toString();

    if (fileCache[filePath]) {
      // exists
      // verify last mod

      if (lastMod == fileLastMod[filePath]) {
        // same last modification
        // there is no alterations

        return resolve(fileCache[filePath]);
      }
    }

    // don't exists

    fs.readFile(filePath, "utf-8", function (err, data) {
      fileCache[filePath] = data;
      fileLastMod[filePath] = lastMod;
      return resolve(data);
    });
  });
}

/**
 * List of errors
 * @param {object} Err
 */
const Err = {
  /**
   * Cod e001
   * Duplicated constructo error
   * @param  {string} id
   * @param  {string} filePath
   * @param  {string} originalFile
   */
  e001(id, filePath, originalFile) {
    drawWarning(
      "Error code: e001\n" +
        `The constructo [[${id}]] of file "${filePath}" is duplicated. The original file is "${originalFile}".`
    );
  },
  /**
   * Cod e002
   * Transpile constructo error
   * @param  {string} e
   */
  e002(e) {
    drawError(
      "Error Code: e002\n" +
        "Transpile constructo error. Original Message: " +
        e
    );
  },
  /**
   * Cod 003
   * win.config.js
   */
  e003() {
    drawError(
      "Error Code: 003\n" +
        `"./win.config.js" not found or misconfigured. Default config will be used.`
    );
  },
  e004() {
    drawError(
      "Error Code: 004\n" + `Fatal error when creating the css bundle`
    );
  },
};

function configTest() {
  if (!Config.out) {
    drawWarning(
      "win.config.js misconfigured. Not found 'out' parameter. Using default './release'"
    );
    Config.out = "./release";
  }
}

function time() {
  finish = new Date().getTime();

  res = finish - init;

  drawText("in " + res + "ms", { color: "dim" });
}

async function config() {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await fs.readFile("./win.config.js", "utf-8");
      Config = fixedJson(data);
      return resolve();
    } catch (e) {
      Config = {
        constructosPath: "./constructos",
        entry: "./js/app.js",
        out: "./release",
        folderName: "/",
      };
      Err.e003();
      return resolve();
    }
  });
}

async function initializer() {
  await config();

  configTest();

  if (Config?.css || Config?.sass) await css();

  if (Config?.icons || Config?.coloredIcons) await icons();
  else transpileIconsComplete = true;

  if (Config?.defaultLang) translate();

  await constructos();

  time();

  drawFinal();

  watchFiles();
}

async function constructos(name) {
  return new Promise(async (resolve, reject) => {
    if (name) {
      promisesConstructos.push(transpileConstructo(name));
      drawAdd(name);
      return resolve(await execPromisesConstructos());
    }

    const constructosPath = Config.constructosPath;

    recursive(constructosPath, async (err, files) => {
      recursive("./node_modules", async (err2, files2) => {
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
                promisesConstructos.push(transpileConstructo(file));
                drawAdd(file);
              }
            }
          } catch (e) {
            Err.e002(e.message);
          }
        }

        return resolve(await execPromisesConstructos());
      });
    });
  });
}

function execPromisesConstructos() {
  return new Promise((resolve, reject) => {
    Promise.all(promisesConstructos).then(async data => {
      /**
       * data[0].method
       * data[0].constructosList
       * data [0].filePath
       */

      for (let c = 0; c < data.length; c++) {
        let item = data[c];

        let out = `import { Winnetou } from "../../node_modules/winnetoujs/src/winnetou.js";\n\n`;
        out += item.class;
        out += "\n\n";
        out += item.exports.join("\n");

        let resultadoFinal = beautify(out, {
          indent_size: 2,
          space_in_empty_paren: true,
        });

        let fileName = path.parse(item.filePath).name;

        let pathOut = path.join(
          Config.constructosOut,
          `${fileName}.js`
        );

        await fs.outputFile(pathOut, resultadoFinal);
      }

      transpileComplete = true;

      return resolve();
    });
  });
}

function watchFiles() {
  let refresh = name => {
    drawChange(name);
    idList = [];
    promisesConstructos = [];
    promisesCss = [];
    promisesIcons = [];
    errorsCount = 0;
    warningCount = 0;
    init = new Date().getTime();
  };

  if (Config.defaultLang) {
    // lang watcher

    // @ts-ignore
    watch(`./translations`, { recursive: true }, async function (
      evt,
      name
    ) {
      refresh(name);
      await translate();
      time();
      drawFinal();
    });
  }

  if (Config.constructosPath) {
    // constructors watcher

    // @ts-ignore
    watch(
      Config.constructosPath,
      { recursive: true },
      async function (evt, name) {
        if (transpileComplete && transpileIconsComplete) {
          transpileComplete = false;

          refresh(name);
          await constructos(name);
          time();
          drawFinal();
        }
      }
    );
  }

  if (Config.icons || Config.coloredIcons) {
    // icons watcher

    let folders = [];
    if (Config.icons) folders.push(Config.icons);
    if (Config.coloredIcons) folders.push(Config.coloredIcons);

    // @ts-ignore
    watch(folders, { recursive: true }, async function (evt, name) {
      refresh(name);
      transpileComplete = false;
      transpileIconsComplete = false;
      await icons();
      await constructos();
      time();
      drawFinal();
    });
  }

  if (Config.sass || Config.css) {
    // css watcher

    let folders = [];
    if (Config.sass) folders.push(Config.sass);
    if (Config.css) folders.push(Config.css);

    // @ts-ignore
    watch(folders, { recursive: true }, async function (evt, name) {
      refresh(name);
      await css();
      time();
      drawFinal();
    });
  }
}

function fixedJson(badJSON) {
  let a = badJSON

    .replace("{", "")
    .replace("}", "")
    .replace("export default", "")
    .replace(";", "")

    .split(",")

    .filter(x => typeof x === "string" && x.trim().length > 0)

    .join(",")

    // Replace ":" with "@colon@" if it's between double-quotes
    .replace(/:\s*"([^"]*)"/g, function (match, p1) {
      return ': "' + p1.replace(/:/g, "@colon@") + '"';
    })

    // Replace ":" with "@colon@" if it's between single-quotes
    .replace(/:\s*'([^']*)'/g, function (match, p1) {
      return ': "' + p1.replace(/:/g, "@colon@") + '"';
    })

    // Add double-quotes around any tokens before the remaining ":"
    .replace(/(['"])?([a-z0-9A-Z_]+)(['"])?\s*:/g, '"$2": ')

    // Turn "@colon@" back into ":"
    .replace(/@colon@/g, ":");

  return JSON.parse(`{${a}}`);
}

async function icons() {
  return new Promise(async (resolve, reject) => {
    let constructoIcons = "";

    const iconsPath = Config.icons;

    if (iconsPath) {
      let files = await recursive(iconsPath);

      // aqui tenho o path do icone
      // preciso saber das subpastas

      for (let c = 0; c < files.length; c++) {
        promisesIcons.push(transpileIcon(files[c]));
      }
    }

    const coloredIconsPath = Config.coloredIcons;

    if (coloredIconsPath) {
      let files = await recursive(coloredIconsPath);
      for (let c = 0; c < files.length; c++) {
        promisesIcons.push(transpileColoredIcon(files[c]));
      }
    }

    Promise.all(promisesIcons).then(async res => {
      // console.log("res :>> ", res);

      // tenho que trabalhar o res
      // e separar por arquivos

      let splitter = [];
      splitter["icons"] = [];

      res.forEach(item => {
        if (typeof item == "object") {
          // do stuff

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
              Config.constructosPath,
              `_icons${key != "icons" ? "_" + key : ""}.html`
            ),
            prettify(splitter[key].join("\n"))
          )
        );
      });

      // await fs.outputFile(
      //   path.join(Config.constructosPath, "_icons.html"),
      //   prettify(res.join("\n"))
      // );
      Promise.all(finalPromise).then(res => {
        transpileIconsComplete = true;
        return resolve();
      });
    });
  });
}

async function transpileIcon(iconPath) {
  return new Promise(async (resolve, reject) => {
    try {
      // let xmlString = fs.readFileSync(iconPath, "utf8");

      let xmlString = await readFileCache(iconPath);

      let regPath = /[a-zA-Z]+/g;

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
      <svg ${viewBox} id="[[${id}]]" class="winIcons {{?class%Class for the icon}}">`;

        let cleanFill = arr[2].replace("fill", "data-fill");

        symbol += cleanFill;

        symbol += `</svg></winnetou>`;

        drawAdd(iconPath);
        return resolve({ symbol, iconPath });
      } else {
        return reject();
      }
    } catch (e) {
      drawAddError(iconPath);
      return resolve("");
    }
  });
}

async function transpileColoredIcon(iconPath) {
  return new Promise(async (resolve, reject) => {
    try {
      let xmlString = await readFileCache(iconPath);

      let regPath = /[a-zA-Z]+/g;

      let id = iconPath.match(regPath);

      id = id.filter(x => x != "svg");

      id = id.join("_");

      let regVb = new RegExp('viewBox="(.*?)"', "gis");

      let reg = new RegExp("<svg(.*?)>(.*?)</svg>", "is");

      if (xmlString) {
        let viewBox = xmlString.match(regVb);

        let arr = xmlString.match(reg);

        let symbol = `
      <winnetou description="Create an colored icon **${id}**">
      <svg ${viewBox} id="[[${id}]]" class="winColoredIcons {{?class%Class for the colored icon}}">`;

        let cleanFill = arr[2];

        symbol += cleanFill;

        symbol += `</svg></winnetou>`;

        drawAdd(iconPath);
        return resolve({ symbol, iconPath });
      } else {
        return reject();
      }
    } catch (e) {
      drawAddError(iconPath);
      return resolve("");
    }
  });
}

async function translate() {
  return new Promise((resolve, reject) => {
    if (!Config?.folderName) {
      console.error(
        "WinnetouJs Translation Miss Configuration Error:You have to specify the name of winnetou folder in order to use the translations;"
      );

      return reject({ err: "erro" });
    }

    // if (Config.folderName === "/") Config.folderName = "";
    let folderName = path.join(
      __dirname,
      Config.folderName,
      "/translations"
    );

    let strings = "";
    let jsdoc = "";

    fs.readFile(
      `${folderName}/${Config.defaultLang}.xml`,
      "utf-8",
      function (err, data) {
        let trad = xml.parse(data)[0].childNodes;

        trad.forEach(item => {
          if (item.tagName && item.childNodes[0]?.text) {
            strings += `/** @property ${item.childNodes[0].text.trim()} */           
            ${item.tagName}: "${item.childNodes[0].text.trim()}",
            `;

            jsdoc += `
          * @param {string} ${
            item.tagName
          } ${item.childNodes[0].text.trim()}`;
          }
        });

        let res = `
        
          this.strings = {
            ${strings}
          }
        
        `;

        let resFinal = `
        import { Winnetou } from "../node_modules/winnetoujs/src/winnetou.js";
        class Strings_ extends Winnetou{
          constructor(){
            super();
            ${res}
          }
        }
        const S=new Strings_();

        /**
         * Object containing the strings taken from the translation file${jsdoc}
        */
        // @ts-ignore
        export const Strings = S.strings;

        `;

        fs.outputFile(
          "./js/_strings.js",
          beautify(resFinal, {
            indent_size: 2,
            space_in_empty_paren: true,
          }),
          function (err) {
            drawAdd("Strings");
            return resolve({ res, jsdoc });
          }
        );
      }
    );
  });
}
/**
 * Transpile constructo html to WinnetouJs Class
 * @param  {string} filePath
 */
async function transpileConstructo(filePath) {
  return new Promise((resolve, reject) => {
    try {
      readFileCache(filePath).then(data => {
        // transforma o html em método
        let dom = htmlParser.parse(data);
        let components = dom.querySelectorAll("winnetou");
        let finalReturn = "";
        let constructos = [];

        Array.from(components).forEach(component => {
          let descri = component.getAttribute("description");
          let constructo = component.innerHTML;
          let jsdoc =
            "\n\n// ========================================\n\n\n";
          jsdoc += "\n\n/**\n";
          jsdoc += `\t* ${descri || ""}\n`;
          let requiredElement = false;
          let jsdoc2 = "";

          let id = constructo.match(/\[\[\s?(.*?)\s?\]\]/)[1];
          let pureId = id + "-win-${identifier}";

          let verify = idList.filter(data => data.id === id);

          //duplicated constructo
          if (verify.length > 0) {
            Err.e001(id, filePath, verify[0].file);
          }

          idList.push({
            file: filePath,
            id,
          });

          // ===========================================
          // ids replace ===============================
          // ===========================================

          var regId = /\[\[\s*?(.*?)\s*?\]\]/g;
          var matchIds = constructo.match(regId);
          var ids = "ids:{";
          matchIds = matchIds.map(item =>
            item.replace("[[", "").replace("]]", "")
          );
          matchIds = matchIds.map(
            item => item + "-win-${identifier}"
          );

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
                "${(elements?." +
                  el +
                  (required ? "" : ' || ""') +
                  ")}"
              );
            });
          }

          if (requiredElement)
            jsdoc += "\t* @param {object} elements\n";
          else jsdoc += "\t* @param {object} [elements]\n";

          jsdoc += jsdoc2;

          jsdoc += "\t* @param {object} [options]\n";
          jsdoc += "\t* @param {any=} options.identifier\n";

          jsdoc += "\t*/\n";

          let _return =
            `/**@private */
          class ${id}_ extends Winnetou {` +
            jsdoc +
            " constructo = (elements, options) => {" +
            "\n\nlet identifier = this._getIdentifier(options?options.identifier || 'notSet':'notSet');" +
            "\n\nelements = this._test(identifier,'" +
            id +
            "',`" +
            pureId +
            "`,elements);" +
            "let component;" +
            "let obj = {" +
            "code(elements) {" +
            "return `" +
            constructo +
            "`" +
            "}," +
            `
            
          /**
           * Create Winnetou Constructo        
           * @param  {string} output The node or list of nodes where the component will be created
           * @param  {object} [options] Options to control how the construct is inserted. Optional.
           * @param  {boolean} [options.clear] Clean the node before inserting the construct
           * @param  {boolean} [options.reverse] Place the construct in front of other constructs
           */
            
            ` +
            '"create":(output,options) => {' +
            "this.create(component,output, options);" +
            "return {" +
            ids +
            "}" +
            "}" + // create close
            "}" + // closes let obj
            "component = obj.code(elements);" +
            "return obj;" +
            // -------------------------
            "}" + // constructo close
            // ---------------------------
            "}"; // class close
          // ---------------------------

          finalReturn += _return;
          constructos.push(
            `export const ${id} = new ${id}_().constructo;`
          );
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

async function css() {
  return new Promise((resolve, reject) => {
    if (Config.sass) {
      recursive(Config.sass, async (err, files) => {
        for (let c = 0; c < files.length; c++) {
          try {
            promisesCss.push(await transpileSass(files[c]));
            drawAdd(files[c]);
          } catch (e) {
            drawAddError(files[c]);
            drawText("Sass transpile error.");
            drawTextBlock(e.message);
            drawBlankLine();
          }
        }

        css_();
      });
    }

    async function css_() {
      if (Config.css) {
        recursive(Config.css, async (err, files) => {
          for (let c = 0; c < files.length; c++) {
            promisesCss.push(transpileCss(files[c]));
            drawAdd(files[c]);
          }

          return resolve(await execPromisesCss());
        });
      } else {
        return resolve(await execPromisesCss());
      }
    }
  });
}

function execPromisesCss() {
  return new Promise((resolve, reject) => {
    Promise.all(promisesCss)
      .then(data => {
        // data contem um array com todo o meu css
        data.push(`    
    * {
    -webkit-overflow-scrolling: touch;
      }   
      .winnetou_display_none {
          display: none !important;
      }                
    `);

        let result = UglifyCss.processString(data.join("\n"));

        fs.outputFile(
          Config.out + "/winnetouBundle.min.css",
          result,
          function (err) {
            if (err) {
              Err.e004();
            }
            return resolve();
          }
        );
      })
      .catch(e => {
        Err.e004();
        return resolve();
      });
  });
}

async function transpileSass(file) {
  return new Promise((resolve, reject) => {
    sass.render(
      {
        file,
      },
      function (err, result) {
        if (err) return reject(err);
        return resolve(result.css.toString());
      }
    );
  });
}

async function transpileCss(file) {
  return new Promise((resolve, reject) => {
    fs.readFile(file, function (err, data) {
      if (err) return reject(err);
      return resolve(data.toString());
    });
  });
}
