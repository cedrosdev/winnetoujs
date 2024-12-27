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

const ncp = require("ncp").ncp;
const fs = require("fs-extra");
const path = require("path");
const recursive = require("recursive-readdir");
const htmlParser = require("node-html-parser");
const beautify = require("js-beautify").js;
const prettify = require("html-prettify");
const escapeStringRegexp = require("escape-string-regexp");
const xml = require("xml-parse");
const sass = require("sass");
const {
  SourceMapConsumer,
  SourceMapGenerator,
  SourceNode,
} = require("source-map");
const { exit } = require("process");
const winnetouPackage = require("winnetoujs/package.json");
const watch = require("node-watch");
const webpack = require("webpack");
const readline = require("node:readline");
const Piscina = require("piscina");
const postcss = require("postcss");
const minmax = require("postcss-media-minmax");
const express = require("express");
const { createServer } = require("http");
const { Server, Socket } = require("socket.io");
const { send } = require("node:process");

/**@type {Socket<import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, any>} */
let globalSocket;
const sendToExtension = (/** @type {{ type: string; payload: any; }} */ data) =>
  globalSocket?.emit(data.type, data.payload);

let watchers = {
  constructos: null,
  translations: null,
  icons: null,
  sass: null,
  webpack: new Array(),
  isWatchingT: false,
};

let global = {
  args: {
    standalone: false,
    watch: true,
    production: false,
  },
  totalFiles: 0,
  compiledFiles: 0,
  webpackPromises: new Array(),
  watch: true,
  firstWebpackRebuild: true,
  errorsCount: 0,
  warningCount: 0,
  /**@type {import("./interfaces.js").IWinConfig} */
  config: {
    constructosPath: "",
    constructosOut: "",
    entry: undefined,
    out: undefined,
    sass: [],
    defaultLang: "",
    publicPath: "",
    icons: "",
    apps: [],
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
};

let memory = {
  store: structuredClone(global),
  stopWatchers: () => {
    watchers.constructos?.close();
    watchers.icons?.close();
    watchers.sass?.close();
    watchers.translations?.close();
    watchers.webpack.forEach(watcher => watcher.watching.close(() => {}));
    watchers.webpack = [];
    sendToExtension({
      type: `cancelWatchingT`,
      payload: ``,
    });
    watchers.isWatchingT = false;
  },
  reset: () => {
    global = structuredClone(memory.store);
  },
};

class WBR {
  constructor() {
    global.init = new Date().getTime();
  }

  initiator() {
    new Drawer().drawWelcome();
    this.readArgs();
  }

  async readArgs() {
    const args = process.argv.slice(2); // remove 'node' and 'wbr' from argv

    if (
      args.includes("--run-server") ||
      args.includes("-run-server") ||
      args.includes("-rs")
    ) {
      await this.config();
      return new WinnetouJsServer();
    }

    if (args.length === 0) {
      // --no-watch does not work here because length will be 1
      this.transpileAll();
      return;
    }

    let commands = {};

    // don`t forget to use semicolon

    ["--transpile", "-transpile", "-t"].forEach(key => {
      commands[key] = () => {
        this.transpileAll();
      };
    });

    ["--version", "-version", `-v`].forEach(
      key =>
        (commands[key] = () => {
          console.log(winnetouPackage.version);
          process.exit();
        })
    );

    ["--no-transpile", "-no-transpile", `-nt`].forEach(
      key =>
        (commands[key] = () => {
          global.args.standalone = true;
        })
    );

    ["--no-watch", "-no-watch", `-nw`].forEach(
      key =>
        (commands[key] = () => {
          global.args.watch = false;
        })
    );

    ["--production", "-production", `-p`].forEach(
      key =>
        (commands[key] = () => {
          global.args.production = true;
        })
    );

    ["--help", "-help", `-h`].forEach(
      key =>
        (commands[key] = () => {
          new Drawer().drawHelp();
          process.exit();
        })
    );

    ["--scaffolding", "-scaffolding", `-s`].forEach(
      key =>
        (commands[key] = () => {
          this.scaffolding();
        })
    );

    for (const arg of args) {
      if (commands[arg]) {
        commands[arg]();
      } else {
        arg !== `--bundleRelease` &&
          arg !== `-bundleRelease` &&
          arg !== `-b` &&
          new Drawer().drawError(`Unknown command ${arg}.`);
      }
    }

    // bundle Release has to be the last called
    // because options has to be set before it

    if (
      args.includes("--bundleRelease") ||
      args.includes("-bundleRelease") ||
      args.includes("-b")
    ) {
      this.bundleRelease();
    }
  }

  scaffolding() {
    global.args.watch = false;

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    new Drawer().drawText(
      "Are your sure to scaffolding WinnetouJs template project?",
      {
        color: "red",
      }
    );

    new Drawer().drawText("Your current work will be overwrite.", {
      color: "dim",
    });

    rl.question(`[y | n] : `, decision => {
      if (decision === "y") {
        new Drawer().drawBlankLine();

        new Drawer().drawLine();
        new Drawer().drawBlankLine();
        new Drawer().drawText("Starting scaffolding ...");
        new Drawer().drawBlankLine();

        // COPY METHODS ===============================================

        //@ts-ignore
        ncp.limit = 16;

        ncp(
          path.join(__dirname, "./node_modules/winnetoujs/scaffolding"),
          path.join(__dirname, "./"),
          function (err) {
            if (err) {
              return new Drawer().drawError(err.join("\n"));
            }
            new Drawer().drawAdd("Scaffolding complete");
            new Drawer().drawFinal();
          }
        );
      }
      rl.close();
    });
  }

  async config() {
    return new Promise(async (resolve, reject) => {
      try {
        let fileContent = await fs.promises.readFile("./win.config.json", {
          encoding: "utf-8",
        });
        let data = JSON.parse(fileContent);
        global.config = data;
        return resolve(true);
      } catch (e) {
        global.config = {
          apps: [
            {
              entry: `./js/app.js`,
              out: `./release`,
            },
          ],
          constructosPath: "./constructos",
          constructosOut: "./js/constructos",
          sass: [
            {
              entryFolder: "./sass",
              outFolder: "./release",
            },
          ],
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
    if (global.config.out) {
      new Drawer().drawWarning(
        "win.config.json misconfigured, 'out' parameter is deprecated. Use 'apps' instead."
      );
    }

    if (global.config.entry) {
      new Drawer().drawWarning(
        "win.config.json misconfigured, 'entry' parameter is deprecated. Use 'apps' instead."
      );
    }

    if (!global.config.apps[0].entry) {
      new Drawer().drawWarning(
        "win.config.json misconfigured. Not found any entry point in 'apps' parameter. Using default './js/app.js'"
      );
      global.config.apps[0].entry = "./js/app.js";
    }

    if (!global.config.apps[0].out) {
      new Drawer().drawWarning(
        "win.config.json misconfigured. Not found any release 'out' point in 'apps' parameter. Using default './release'"
      );
      global.config.apps[0].out = "./release";
    }

    if (!global.config.constructosPath) {
      new Drawer().drawWarning(
        "win.config.json misconfigured. Not found 'constructosPath' parameter. Using default './constructos'"
      );
      global.config.constructosPath = "./constructos";
    }

    if (!global.config.constructosOut) {
      new Drawer().drawWarning(
        "win.config.json misconfigured. Not found 'constructosOut' parameter. Using default './js/constructos'"
      );
      global.config.constructosOut = "./js/constructos";
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
    return res;
  }

  watchFiles() {
    if (global.args.watch === false) return;

    sendToExtension({
      type: "watchingT",
      payload: "",
    });

    watchers.isWatchingT = true;

    new Drawer().drawBlankLine();
    const refresh = async name => {
      new Drawer().drawChange(name);
      memory.reset();
      await this.config();
      global.init = new Date().getTime();
      return true;
    };

    if (global.config.defaultLang) {
      try {
        watchers.translations = watch.default(
          `./translations`,
          { recursive: true },
          async (evt, name) => {
            await refresh(name);
            await new Translator().translate();
            this.getTimeElapsed();
            new Drawer().drawFinal();
          }
        );
        // w.close();
      } catch (e) {}
    }

    if (global.config.constructosPath) {
      try {
        watchers.constructos = watch.default(
          global.config.constructosPath,
          { recursive: true },
          async (evt, name) => {
            await refresh(name);
            await new Constructos().transpile(name);
            this.getTimeElapsed();
            new Drawer().drawFinal();
          }
        );
      } catch (e) {}
    }

    if (global.config.icons) {
      let folders = [];
      if (global.config.icons) folders.push(global.config.icons);
      try {
        watchers.icons = watch.default(
          folders,
          { recursive: true },
          async (evt, name) => {
            await refresh(name);
            await new Icons().transpile();
            await new Constructos().transpile();
            this.getTimeElapsed();
            new Drawer().drawFinal();
          }
        );
      } catch (e) {}
    }

    if (global.config.sass) {
      let folders = [];
      global.config.sass.forEach(item => {
        folders.push(item.entryFolder);
      });
      try {
        watchers.sass = watch.default(
          folders,
          { recursive: true },
          async (evt, name) => {
            await refresh(name);
            await new Sass().transpile();
            this.getTimeElapsed();
            new Drawer().drawFinal();
          }
        );
      } catch (e) {}
    }
  }

  // node wbr
  async transpileAll(__runWatchFiles = true) {
    await this.config();
    await this.testConfig();
    if (global.config?.sass) await new Sass().transpile();
    if (global.config?.icons) await new Icons().transpile();
    if (global.config?.defaultLang) await new Translator().translate();
    await new Constructos().transpile();
    if (__runWatchFiles) {
      let time = this.getTimeElapsed();
      sendToExtension({
        type: "timeElapsed",
        payload: time,
      });
    }
    if (__runWatchFiles) new Drawer().drawFinal();
    if (__runWatchFiles) this.watchFiles();
  }

  // node wbr --bundleRelease
  async bundleRelease() {
    global.args.standalone
      ? (await this.config(), await this.testConfig())
      : await this.transpileAll(false);

    new Drawer().drawTextBlock(`Building release bundles...`);
    new Drawer().drawBlankLine();

    // verify new version 1.19.0
    if (global.config.apps) {
      if (global.args.production) {
        // apps + production = piscina, no-watch, xwin
        new Drawer().drawTextBlock(` Using XWin `, {
          color: "production",
        });
        sendToExtension({
          type: "xwin",
          payload: "",
        });
        new Drawer().drawBlankLine();
        global.args.watch = false;
        let apps = new Array();
        // @ts-ignore
        const piscina = new Piscina({
          filename: path.resolve(
            __dirname,
            "./node_modules/winnetoujs/src/wbrWorker.js"
          ),
        });
        global.config.apps.forEach(async app => {
          sendToExtension({
            type: "fileName",
            payload: path.basename(app.entry),
          });
          // new Drawer().drawAdd(`'${app.entry} => ${app.out}`);
          new Drawer().drawTextBlock(`'${app.entry} => ${app.out}`, {
            color: "cyan",
          });
          apps.push(
            piscina.run({
              entry: app.entry,
              out: app.out,
              dirname: __dirname,
              publicPath: global.config.publicPath,
              production: global.args.production,
            })
          );
        });
        let res = await Promise.all(apps);
        new Files().history();
        res.forEach(item => {
          sendToExtension({
            type: "file",
            payload: ``,
          });
          item.errors.forEach(error =>
            new Drawer().drawError(JSON.stringify(error, null, 1))
          );
          item.warnings.forEach(warn => {
            new Drawer().drawWarning(JSON.stringify(warn, null, 1));
          });
          sendToExtension({
            type: "compilationErrors",
            payload: { errors: item.errors, warnings: item.warnings },
          });
        });
      } else {
        // apps without production = __bundle, watch can be used
        // within watchFiles are making an watch verification
        // this is for scss and constructos transpilations

        global.totalFiles = global.config.apps.length;
        global.config.apps.forEach(async app => {
          sendToExtension({
            type: "fileName",
            payload: path.basename(app.entry),
          });
          global.webpackPromises.push(this.__bundle(app.entry, app.out));
        });
        let res = await Promise.all(global.webpackPromises);
        // it's send inside __bundle
        // res.forEach(item => {
        //   sendToExtension({
        //     type: "file",
        //     payload: ``,
        //   });
        // });
        this.watchFiles();
      }
    } else {
      // retro-compatibility
      // within watchFiles are making an watch verification

      let entry = global.config.entry;
      let out = global.config.out;
      if (typeof entry === "object") {
        let keys = Object.keys(entry);
        global.totalFiles = keys.length;
        for (let i = 0; i < keys.length; i++) {
          let key = keys[i];
          global.config.entry = entry[key];
          global.config.out = out[key];
          global.webpackPromises.push(this.__bundle(entry[key], out[key]));
        }
        await Promise.all(global.webpackPromises);
      } else {
        global.totalFiles = 1;
        await this.__bundle(global.config.entry, global.config.out);
      }
      this.watchFiles();
    }
    let time = this.getTimeElapsed();
    sendToExtension({
      type: "timeElapsed",
      payload: time,
    });
    new Drawer().drawFinal();
  }

  async __bundle(entry, out) {
    return new Promise((resolve, reject) => {
      sendToExtension({
        type: "fileName",
        payload: path.basename(entry),
      });
      const compiler = webpack(
        {
          watch: global.args.watch,
          watchOptions: {
            aggregateTimeout: 500,
            ignored: ["**/node_modules", out, path.resolve(__dirname, out)],
          },
          entry: entry,
          output: {
            chunkFilename: `[${
              global.args.production ? "contenthash" : "name"
            }].bundle.js`,
            filename: "winnetouBundle.min.js",
            path: path.resolve(__dirname, out),
            publicPath: path.join(global.config.publicPath, out),
            clean: {
              keep(asset) {
                return asset.includes("css");
              },
            },
          },
          mode: global.args.production ? "production" : "development",
          devtool: global.args.production ? false : "source-map",
          stats: "errors-only",
          bail: true,
          cache: true,

          module: {
            rules: [
              {
                test: /\.js$/,

                use: {
                  loader: "babel-loader",

                  options: {
                    compact: false,
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
        },
        (err, stats) => {
          if (err) {
            new Drawer().drawError(err.message);
            new Drawer().drawWarning(
              "Winnetou is exiting with compilation error. Please, fix your code and run wbr again."
            );
            process.exit();
          }
          // console.log({ err, stats });
          const info = stats?.toJson();
          stats?.compilation.errors.forEach(err => {
            new Drawer().drawError(err.message.toString());
          });
          if (stats?.hasErrors()) {
            new Drawer().drawError(info?.errors.toString());
          }

          if (stats?.hasWarnings()) {
            info?.warnings?.forEach(warning => {
              new Drawer().drawWarning(warning.message);
            });
            // new Drawer().drawWarning(JSON.stringify(info?.warnings, null, 2));
          }

          if (global.compiledFiles >= global.totalFiles) {
            let d = new Drawer();

            d.drawBlankLine();
            if (stats)
              d.drawAdd(
                `Bundle rebuild successful in ` +
                  (stats.endTime - stats.startTime) +
                  "ms"
              );
            d.drawLine();
          }
          global.compiledFiles++;
          sendToExtension({
            type: "file",
            payload: path.basename(entry),
          });
          return resolve(true);
        }
      );

      if (global.args.watch) {
        // it creates a watcher for each file given by webpack promises
        compiler.watch({}, (e, s) => {
          if (e)
            if (e?.name !== "ConcurrentCompilationError") {
              console.log(e);
              new Drawer().drawError(e.message);
            }
          if (s && s.compilation.errors.length > 0) {
            new Drawer().drawError(s.compilation.errors.toString());
          }
          if (s && s.compilation.warnings.length > 0) {
            new Drawer().drawWarning(s.compilation.warnings.toString());
          }
          new Drawer().drawTextBlock(`'${entry} => ${out}`, { color: "cyan" });
        });
        watchers.webpack.push(compiler);
        // compiler.watching.close(e => {});
      } else {
        compiler.run((e, s) => {
          if (e)
            if (e.name !== "ConcurrentCompilationError") {
              console.log(e);
              new Drawer().drawError(e.message);
            }
          if (s && s.compilation.errors.length > 0) {
            new Drawer().drawError(s.compilation.errors.toString());
          }
          if (s && s.compilation.warnings.length > 0) {
            new Drawer().drawWarning(s.compilation.warnings.toString());
          }
          new Drawer().drawTextBlock(`'${entry} => ${out}`, { color: "cyan" });

          compiler.close(() => {});
        });
      }
    });
  }
}

class WinnetouJsServer {
  constructor() {
    this.createServer();
    this.routes();
  }

  createServer() {
    const app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    this.app = app;
    const port = global.config.serverPort || 5501;

    try {
      const httpServer = createServer(app);
      this.io = new Server(httpServer, {
        transports: ["websocket", "polling"],
        cors: {
          origin: `http://localhost:${port}`,
        },
      });
      httpServer
        .listen(port)
        .on("listening", ev => {
          new Drawer().drawTextBlock(`Server Running at ${port}`, {
            color: `green`,
          });
          new Drawer().drawBlankLine();
          new Drawer().drawLine();
          this.init_socket();
          this.watchConfig();
        })
        .on("error", ev => {
          new Drawer().drawError(
            `Port ${port} is already in use. Change it in win.config.json and try again.`
          );
          new Drawer().drawBlankLine();
          new Drawer().drawLine();
          return;
        });
    } catch (e) {
      new Drawer().drawError(e.message);
      new Drawer().drawBlankLine();
      new Drawer().drawLine();
      return;
    }
  }

  routes() {
    this.app.get("/", (request, response) => {
      response.json(`its works!`);
    });
  }

  init_socket() {
    this.io.on("connection", socket => {
      globalSocket = socket;

      socket.on("runBundler", async data => {
        memory.stopWatchers();
        memory.reset();
        await new WBR().config();
        global.args.production = data.production;
        global.args.standalone = !data.transpile;
        global.args.watch = data.watch;

        if (data.compile) {
          let totalFiles = await new Files().initialFileCount({
            compile: true,
            transpile: data.transpile,
          });
          sendToExtension({
            type: "totalFiles",
            payload: totalFiles,
          });
          new WBR().bundleRelease();
        } else {
          let totalFiles = await new Files().initialFileCount();
          sendToExtension({
            type: "totalFiles",
            payload: totalFiles,
          });
          new WBR().transpileAll();
        }
      });

      socket.on("isWatchingT", () => {
        if (watchers.isWatchingT) {
          sendToExtension({
            type: "watchingT",
            payload: "",
          });
        }
      });

      socket.on("closeWBR", () => {
        process.exit();
      });
    });
  }

  watchConfig() {
    watch.default(
      `./win.config.json`,
      { recursive: true },
      async (evt, name) => {
        memory.stopWatchers();
        memory.reset();
        await new WBR().config();
        await new WBR().testConfig();
        console.log("config changed");
      }
    );
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
          sendToExtension({
            type: "file",
            payload: path.basename(iconPath),
          });
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

          sendToExtension({
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
    /**
     * First call deprecated xml format
     * if no one file exists, runs json
     */
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
          sendToExtension({
            type: "file",
            payload: path.basename("_strings.js"),
          });
        }
      );
    });
  }
}

class Sass {
  async transpile() {
    return new Promise((resolve, reject) => {
      let promises = [];
      let arr = global.config.sass;
      arr?.forEach(item => {
        promises.push(
          this.readScssFolder(item.entryFolder, item.outFolder, item.firstFile)
        );
      });

      Promise.all(promises)
        .then(res => {
          resolve(true);
        })
        .catch(e => {
          new Drawer().drawError(e);
          resolve(true);
        });
    });
  }

  async readScssFolder(entry, out, first) {
    let promises = [];
    return new Promise((resolve, reject) => {
      if (first) {
        promises.push(this.transpileSass(path.join(entry, first)));
        new Drawer().drawAdd(first);
      }

      recursive(entry, async (err, files) => {
        if (err) {
          new Drawer().drawError(err.message);
          await this.execSassPromises(out);
          resolve(true);
        }

        for (let c = 0; c < files.length; c++) {
          if (files[c].includes(first)) {
            continue;
          }
          try {
            promises.push(this.transpileSass(files[c]));
            new Drawer().drawAdd(files[c]);
          } catch (e) {
            new Drawer().drawAddError(files[c]);
            new Drawer().drawText("Sass transpile error.");
            new Drawer().drawTextBlock(e.message);
            new Drawer().drawBlankLine();
          }
        }

        await this.execSassPromises(out, promises);
        resolve(true);
      });
    });
  }

  async transpileSass(file) {
    return new Promise((resolve, reject) => {
      sass
        .compileAsync(file, {
          sourceMap: !global.args.production,
          sourceMapIncludeSources: !global.args.production,
          ...(global.args.production && { style: "compressed" }),
          logger: {
            warn: global.args.production
              ? text => {}
              : new Drawer().drawWarning,
          },
        })
        .then(res => {
          let output = postcss().use(minmax()).process(res.css.toString()).css;
          sendToExtension({
            type: "file",
            payload: path.basename(file),
          });
          resolve({ css: output, map: res.sourceMap });
        })
        .catch(e => {
          new Drawer().drawWarning(e.message);
          reject(e);
        });
    });
  }

  async execSassPromises(out, promisesArray) {
    return new Promise((resolve, reject) => {
      Promise.all(promisesArray)
        .then(async data => {
          let cssContent = data.map(item => item.css);
          let mapContent = data.map(item => item.map);

          cssContent.push(
            `*{-webkit-overflow-scrolling:touch;}.winnetou_display_none{display:none !important;}`
          );

          if (!global.args.production) {
            cssContent.push(
              `/*# sourceMappingURL=winnetouBundle.min.css.map */`
            );
          }

          let result = cssContent.join("\n");

          let finalMap;
          !global.args.production &&
            (finalMap = await this.mergeSourceMaps(mapContent, cssContent));

          fs.outputFile(out + "/winnetouBundle.min.css", result, err => {
            if (err) {
              new Drawer().drawError("Code pt4y - " + err.message);
              new Err().e004();
            }

            !global.args.production
              ? fs.outputFile(
                  out + "/winnetouBundle.min.css.map",
                  finalMap,
                  err => {
                    if (err) {
                      new Drawer().drawError("Code 90ls - " + err.message);
                      new Err().e004();
                    }
                    resolve(true);
                  }
                )
              : resolve(true);
          });
        })
        .catch(e => {
          new Drawer().drawError("Code io9s - " + e.message);
          new Err().e004();
          resolve(true);
        });
    });
  }

  async mergeSourceMaps(maps, finalCSS) {
    let node = SourceNode.fromStringWithSourceMap(
      finalCSS[0],
      await new SourceMapConsumer(maps[0])
    );

    for (let i = 1; i < maps.length; i++) {
      node.add(
        SourceNode.fromStringWithSourceMap(
          finalCSS[i],
          await new SourceMapConsumer(maps[i])
        )
      );
    }

    let map = node.toStringWithSourceMap({
      file: "winnetouBundle.min.css",
    }).map;

    return map.toString();
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
   * @typedef {object} params
   * @property {'cyan'|'yellow'|'green'|'red'|'error'|'bright'|'dim'|'warning'|'production'} [color] string color
   * @property {number} [size] line size, default 80
   * @property {'add'|'addError'|'change'} [type] string style type
   *
   * Draw string line
   * @param  {string} [text] string to be printed
   * @param {params} [params]
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

        case "production":
          color = "\x1b[44m\x1b[30m";
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

  /**
   * Draws text in blocks
   * @param {string} text
   * @param {params} [params]
   */
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

    this.drawText(" Error ", { color: "error" });
    this.drawBlankLine();
    text = text.replace(`"`, ``);
    text.split(`:`).forEach(t => {
      this.drawTextBlock(t);
      this.drawBlankLine();
    });
    this.drawLine();
    this.drawBlankLine();
  };

  drawHelp = () => {
    this.drawLine();
    this.drawBlankLine();

    this.drawText("Help", { color: "cyan" });
    this.drawBlankLine();
    this.drawBlankLine();

    this.drawTextBlock(`Syntax`, { color: `bright` });
    this.drawTextBlock(`node wbr [options]`, { color: `dim` });
    this.drawBlankLine();

    this.drawTextBlock(`Option: none`, { color: `bright` });
    this.drawTextBlock(
      `Just transpiles scss and constructos to be used in code.`,
      { color: `dim` }
    );
    this.drawBlankLine();

    this.drawTextBlock(`Option: --bundleRelease (-b)`, { color: `bright` });
    this.drawTextBlock(
      `Transpiles code and compiles to bundle. Development mode with watch and sourcemaps.`,
      { color: `dim` }
    );
    this.drawBlankLine();

    this.drawTextBlock(`Options: -b --no-watch (-nw)`, { color: `bright` });
    this.drawTextBlock(`Disables watching after transpile/compile.`, {
      color: `dim`,
    });
    this.drawBlankLine();

    this.drawTextBlock(`Options: -b --production (-p)`, { color: `bright` });
    this.drawTextBlock(
      `Transpiles and compiles bundles to production. No watching. XWin enabled.`,
      {
        color: `dim`,
      }
    );
    this.drawBlankLine();

    this.drawTextBlock(`Options: -b --no-transpile (-nt) [-p][-nw]`, {
      color: `bright`,
    });
    this.drawTextBlock(
      `Compiles bundles to production without transpiling entire scss and constructos.`,
      {
        color: `dim`,
      }
    );
    this.drawBlankLine();

    this.drawTextBlock(`Options: --version (-v)`, {
      color: `bright`,
    });
    this.drawTextBlock(`Shows WinnetouJs framework version.`, {
      color: `dim`,
    });
    this.drawBlankLine();

    this.drawTextBlock("For further help, visit https://winnetoujs.org/docs", {
      color: "dim",
    });

    this.drawBlankLine();
    this.drawLine();
  };

  drawWarning = (text, options) => {
    global.warningCount++;
    this.drawLine();
    this.drawBlankLine();
    this.drawText("Warning", { color: "warning" });
    this.drawBlankLine();
    text = text.replace(`"`, ``);
    text.split(`\\n`).forEach(t => {
      this.drawTextBlock(t);
      this.drawBlankLine();
    });
    if (options && options.stack) {
      this.drawText(options.stack.trim(), { color: "red" });
      this.drawBlankLine();
    }
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
    this.drawText(`(c) 2020 - 2024 Cedros Development (https://cedros.dev)`, {
      color: "dim",
    });

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
    this.drawBlankLine();
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
    if (global.args.watch)
      new Drawer().drawText("Live reload enabled. Watching for changes...", {
        color: "dim",
      });
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
   * win.config.json
   */
  e003() {
    new Drawer().drawError(
      "Error Code: 003\n" +
        `"./win.config.json" not found or misconfigured. Default config will be used.`
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

  async initialFileCount(data) {
    let totalFiles = 0;
    let entries = 0;

    if (data) {
      if (data.compile) {
        entries = global.config.apps.length;
      }
      if (!data.transpile) {
        return entries;
      } else {
        totalFiles += entries;
      }
    }

    const sass = async () => {
      let arr = global.config.sass;
      arr?.forEach(async item => {
        let files = await recursive(item.entryFolder);
        totalFiles += files.length;
      });
      return true;
    };
    const icons = async () => {
      const iconsPath = global.config.icons;
      if (iconsPath) {
        try {
          let files = await recursive(iconsPath);
          totalFiles += files.length;
        } catch (e) {}
      }
      return true;
    };
    const translate = async () => {
      if (global.config.defaultLang) totalFiles++;
      return true;
    };
    const constructos = async () => {
      const constructosPath = global.config.constructosPath;
      let files = await recursive(constructosPath);
      totalFiles += files.length;
      return true;
    };
    await Promise.all([sass(), icons(), translate(), constructos()]);
    return totalFiles;
  }

  async history_() {
    let content = await fs.promises
      .readFile("./.winnetouJsData", { encoding: "utf8" })
      .catch(err => {
        console.error(err);
      });
    let json = {};
    if (content) {
      json = JSON.parse(content);
    }

    const FILES = async () => {
      let arr = global.config.apps;
      arr?.forEach(async item => {
        let output = item.out;
        let files = await fs.promises.readdir(output);
        files.forEach(async file => {
          let data = await fs.promises.stat(path.join(output, file));
          console.log(`history`, { data });
        });
      });
      return true;
    };

    FILES();
  }

  async history() {
    try {
      const filePath = path.resolve(__dirname, "./.winnetouJsData");
      let json = {};

      // Read existing data if the file exists, or start with an empty JSON object
      const content = await fs.promises
        .readFile(filePath, { encoding: "utf8" })
        .catch(err => {
          if (err.code === "ENOENT") {
            console.warn("File not found, starting with empty JSON.");
            return null;
          }
          throw err;
        });
      if (content) {
        json = JSON.parse(content);
      }

      const parseFiles = async () => {
        const apps = global.config.apps;
        for (const app of apps) {
          const output = app.out;
          if (!json[output]) json[output] = {};
          const filesInAppOutput = await fs.promises.readdir(output);
          for (const file of filesInAppOutput) {
            const fileName = file;
            const filePath = path.join(output, file);
            const stats = await fs.promises.stat(filePath);
            const size = (stats.size / 1024).toFixed(2);
            if (!json[output][fileName]) json[output][fileName] = [];
            if (
              json[output][fileName].length === 0 ||
              json[output][fileName][json[output][fileName].length - 1]
                .sizeKB !== size
            ) {
              json[output][fileName].push({
                date: new Date(),
                sizeKB: size,
              });
              if (json[output][fileName].length > 4) {
                json[output][fileName].shift();
              }
            }
          }
        }
      };

      const parseFilesBackup = async () => {
        const arr = global.config.apps;
        if (!arr) {
          throw new Error("global.config.apps is not defined or empty.");
        }
        for (const item of arr) {
          const output = item.out;
          try {
            const files = await fs.promises.readdir(output);
            for (const file of files) {
              const filePath = path.join(output, file);
              const stats = await fs.promises.stat(filePath);
              const key = item.out + "___" + file;
              if (!json[key]) json[key] = {};

              let size = (stats.size / 1024).toFixed(2);

              if (!json[key].releases) json[key].releases = [];
              if (
                json[key].releases.length === 0 ||
                json[key].releases[json[key].releases.length - 1].sizeKB != size
              ) {
                json[key].file = file;
                json[key].path = output;

                json[key].releases.push({
                  date: new Date(),
                  sizeKB: size,
                });
              }
            }
          } catch (err) {
            console.error(`Error processing directory: ${output}`, err);
          }
        }

        return true;
      };

      await parseFiles();

      // console.log(JSON.stringify(json, null, 1));

      await fs.promises.writeFile(filePath, JSON.stringify(json, null, 2), {
        encoding: "utf8",
      });
      console.log("File metadata successfully stored in .winnetouJsData");
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }
}

new WBR().initiator();
