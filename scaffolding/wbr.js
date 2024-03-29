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
  console.log("> [html minified] " + text);
};

const drawEnd = text => {
  console.log("> [Bundle Release Finished] " + text);
};

const drawFinal = () => {
  drawLine();
  drawBlankLine();
  drawText("All tasks completed.");
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

async function webpackBundleRelease() {
  await config();
  configTest();

  let entry = Config.entry;
  let out = Config.out;

  if (typeof entry === "object") {
    let keys = Object.keys(entry);
    keys.map(key => {
      Config.entry = entry[key];
      Config.out = out[key];
      run(entry[key], out[key]);
    });
  } else {
    run(Config.entry, Config.out);
  }

  function run(entry, out) {
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

    drawTextBlock(
      `Initializing webpack winnetou bundle, please wait. ${entry} => ${out}`
    );
    drawBlankLine();

    compiler.run((e, s) => {
      if (e) {
        drawError(e.message);
      }
      if (s.compilation.errors.length > 0) {
        drawError(s.compilation.errors.toString());
      }
      if (s.compilation.warnings.length > 0) {
        drawWarning(s.compilation.warnings.toString());
      }
      drawAdd(`'${entry} => ${out}`);
      drawFinal();
    });
  }
}

// WBR METHODS ================================================
/**
 * Read file from cache with fallback to filesystem
 * @param  {string} filePath path of the file
 * @returns promise with data
 */
function readFileCache(filePath) {
  return new Promise((resolve, reject) => {
    let lastMod;
    try {
      lastMod = fs.statSync(filePath).mtime.toString();
    } catch (e) {
      return reject(e);
    }

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
    process.stderr.write("\007");
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
    process.stderr.write("\007");
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
    process.stderr.write("\007");
  },
  e004() {
    drawError(
      "Error Code: 004\n" + `Fatal error when creating the css bundle`
    );
    process.stderr.write("\007");
  },
  e005() {
    drawError(
      "Error Code: 005\n" + `The constructos folder does not exists`
    );
    process.stderr.write("\007");
  },
  e006(file) {
    drawError(
      "Error Code: 006\n" +
        `There are a constructo without [[id]] in a file "${file}"`
    );
    process.stderr.write("\007");
  },
};

function configTest() {
  if (!Config.out) {
    drawWarning(
      "win.config.js misconfigured. Not found 'out' parameter. Using default './release'"
    );
    Config.out = "./release";
  }

  if (!Config.constructosPath) {
    drawWarning(
      "win.config.js misconfigured. Not found 'constructosPath' parameter. Using default './constructos'"
    );
    Config.constructosPath = "./constructos";
  }

  if (!Config.constructosOut) {
    drawWarning(
      "win.config.js misconfigured. Not found 'constructosOut' parameter. Using default './js/constructos'"
    );
    Config.constructosOut = "./js/constructos";
  }

  if (!Config.folderName) {
    // drawWarning(
    //   "win.config.js misconfigured. Not found 'folderName' parameter. Using default '/'"
    // );
    Config.folderName = "/";
  }

  if (!Config.entry) {
    drawWarning(
      "win.config.js misconfigured. Not found 'entry' parameter. Using default './js/app.js'"
    );
    Config.entry = "./js/app.js";
  }

  if (!Config.cssOut) {
    drawWarning(
      "win.config.js misconfigured. Not found 'cssOut' parameter. Using default './release'"
    );
    Config.cssOut = "./release";
  }

  if (!fs.existsSync(Config.constructosPath)) {
    Err.e005();
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
        constructosOut: "./js/constructos",
        entry: "./js/app.js",
        out: "./release",
        folderName: "/",
      };
      Err.e003();
      console.log(e);
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

  // check constructos integrity in background
  constructosIntegrity();
}

async function constructos(name) {
  return new Promise(async (resolve, reject) => {
    if (name) {
      // test if file name exists
      if (!fs.existsSync(name)) {
        drawWarning(`File ${name} deleted.`);
        drawFinal();
        // check constructos integrity in background
        constructosIntegrity();
        return;
      }
      promisesConstructos.push(transpileConstructo(name));
      drawAdd(name);
      return resolve(await execPromisesConstructos());
    }

    const constructosPath = Config.constructosPath;

    recursive(constructosPath, async (err, files) => {
      if (err) {
        drawError(err.message);
      }
      recursive("./node_modules", async (err2, files2) => {
        if (err2) {
          drawError(err2.message);
          return resolve();
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

function constructosIntegrity() {
  /**
   * Will read all constructos in folder and node_modules
   * and compares with output js to delete obsoletes.
   */

  const constructosPath = Config.constructosPath;
  const constructosOut = Config.constructosOut;

  recursive(constructosPath, async (err, files) => {
    if (err) {
      drawError(err.message);
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

        let diff = diffArray(files, jsFiles);

        diff = diff.map(x =>
          path.join("./", constructosOut, x + ".js")
        );

        diff.forEach(item => {
          fs.unlink(item, e => {});
        });
      });
    });
  });
}

function diffArray(arr1, arr2) {
  return arr1
    .concat(arr2)
    .filter(val => !(arr1.includes(val) && arr2.includes(val)));
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

    try {
      // @ts-ignore
      watch(
        `./translations`,
        { recursive: true },
        async function (evt, name) {
          refresh(name);
          await translate();
          time();
          drawFinal();
        }
      );
    } catch (e) {}
  }

  if (Config.constructosPath) {
    // constructors watcher

    try {
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
    } catch (e) {}
  }

  if (Config.icons || Config.coloredIcons) {
    // icons watcher

    let folders = [];
    if (Config.icons) folders.push(Config.icons);
    if (Config.coloredIcons) folders.push(Config.coloredIcons);

    try {
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
    } catch (e) {}
  }

  if (Config.sass || Config.css) {
    // css watcher

    let folders = [];
    if (Config.sass) folders.push(Config.sass);
    if (Config.css) folders.push(Config.css);

    try {
      // @ts-ignore
      watch(folders, { recursive: true }, async function (evt, name) {
        refresh(name);
        await css();
        time();
        drawFinal();
      });
    } catch (e) {}
  }
}

function fixedJson(badJSON) {
  //

  let a = badJSON.replace("export default", "").replace(";", "");

  return eval(`(${a})`);
}

async function icons() {
  return new Promise(async (resolve, reject) => {
    let constructoIcons = "";

    const iconsPath = Config.icons;
    let files;

    if (iconsPath) {
      try {
        files = await recursive(iconsPath);
      } catch (e) {
        drawError(e.message);
        return resolve();
      }

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
    // if (!Config?.folderName) {
    //   console.error(
    //     "WinnetouJs Translation Miss Configuration Error:You have to specify the name of winnetou folder in order to use the translations;"
    //   );

    //   return reject({ err: "erro" });
    // }

    // if (Config.folderName === "/") Config.folderName = "";
    let translationsPath = path.join(__dirname, "/translations");

    let strings = "";
    let jsdoc = "";

    fs.readFile(
      `${translationsPath}/${Config.defaultLang}.xml`,
      "utf-8",
      function (err, data) {
        if (err) {
          // first search for legacy xml translation
          // if not located, run new json format
          return json();
        }
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
        
        export default Winnetou.strings = {
            ${strings}
          }
        
        `;

        let resFinal = `
        import { Winnetou } from "../node_modules/winnetoujs/src/winnetou.js";       
        ${res}
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

    function json() {
      fs.readFile(
        `${translationsPath}/${Config.defaultLang}.json`,
        "utf-8",
        function (err, data) {
          if (err) {
            drawError(err.message);
            return resolve();
          }

          let file = JSON.parse(data);

          Object.keys(file).map(key => {
            let value = file[key];

            strings += `/** @property ${value} */           
            ${key}: "${value}",
            `;
          });

          let res = `
        
          export default Winnetou.strings = {
              ${strings}
            }
          
          `;

          let resFinal = `
          import { Winnetou } from "../node_modules/winnetoujs/src/winnetou.js";       
          ${res}
          `;

          fs.outputFile(
            "./js/_strings.js",
            beautify(resFinal, {
              indent_size: 2,
              space_in_empty_paren: true,
            }),
            function (err) {
              drawAdd("Strings");
              return resolve({ res });
            }
          );
        }
      );
    }
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
            "\n\n// ========================================";
          jsdoc += "\n/**\n";
          jsdoc += `\t* ${descri || ""}\n`;
          let requiredElement = false;
          let jsdoc2 = "";

          let id;

          try {
            id = constructo.match(/\[\[\s?(.*?)\s?\]\]/)[1];
          } catch (e) {
            Err.e006(filePath);
            return;
          }

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
                "${(elements_?." +
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
        if (err) {
          drawError(err.message);
          css_();
          return;
        }
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
          if (err) {
            drawError(err.message);
            return resolve();
          }
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
          Config.cssOut + "/winnetouBundle.min.css",
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
