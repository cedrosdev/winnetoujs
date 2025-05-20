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
const winnetouPackage = require("winnetoujs/package.json");
const watch = require("node-watch");
const webpack = require("webpack");
const readline = require("node:readline");
const Piscina = require("piscina");
const express = require("express");
const { createServer } = require("http");
const { Server, Socket } = require("socket.io");
//====================================================//
const Drawer = require("winnetoujs/wbr-components/drawer.js");
const Err = require("winnetoujs/wbr-components/err.js");
const Files = require("winnetoujs/wbr-components/files.js");
const Sass = require("winnetoujs/wbr-components/sass.js");
const Extension = require("winnetoujs/wbr-components/extension.js");
const Icons = require("winnetoujs/wbr-components/icons.js");
const Translator = require("winnetoujs/wbr-components/translator.js");
const Constructos = require("winnetoujs/wbr-components/constructos.js");
//====================================================//

/**@type {Socket<import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, any>} */
let globalSocket;

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
    new Extension().sendToExtension({
      socket: globalSocket,
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
      new ExtensionServer();
      return;
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
            new Drawer().drawFinal(global.args.watch);
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

    new Extension().sendToExtension({
      socket: globalSocket,
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
            await new Translator({
              defaultLang: global.config.defaultLang,
              dirName: __dirname,
              globalSocket,
            }).translate();
            this.getTimeElapsed();
            new Drawer().drawFinal(global.args.watch);
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
            await new Constructos({
              constructosPath: global.config.constructosPath,
              dirName: __dirname,
              globalSocket,
              constructosOut: global.config.constructosOut,
              watch: global.args.watch,
            }).transpile(name);
            this.getTimeElapsed();
            global.args.watch;
            new Drawer().drawFinal(global.args.watch);
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
            await new Icons().transpile({
              globalSocket: globalSocket,
              dirName: __dirname,
              constructosPath: global.config.constructosPath,
              icons: global.config.icons,
            });
            await new Constructos({
              constructosPath: global.config.constructosPath,
              dirName: __dirname,
              globalSocket,
              constructosOut: global.config.constructosOut,
              watch: global.args.watch,
            }).transpile();
            this.getTimeElapsed();
            new Drawer().drawFinal(global.args.watch);
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
            await new Sass(globalSocket).transpile({
              dirName: __dirname,
              production: global.args.production,
              sass: global.config.sass,
            });
            this.getTimeElapsed();
            new Drawer().drawFinal(global.args.watch);
          }
        );
      } catch (e) {}
    }
  }

  // node wbr
  async transpileAll(__runWatchFiles = true) {
    await this.config();
    await this.testConfig();
    if (global.config?.sass)
      await new Sass(globalSocket).transpile({
        dirName: __dirname,
        production: global.args.production,
        sass: global.config.sass,
      });
    if (global.config?.icons)
      await new Icons().transpile({
        globalSocket,
        dirName: __dirname,
        constructosPath: global.config.constructosPath,
        icons: global.config.icons,
      });
    if (global.config?.defaultLang)
      await new Translator({
        defaultLang: global.config.defaultLang,
        dirName: __dirname,
        globalSocket,
      }).translate();
    await new Constructos({
      constructosPath: global.config.constructosPath,
      dirName: __dirname,
      globalSocket,
      constructosOut: global.config.constructosOut,
      watch: global.args.watch,
    }).transpile();
    if (__runWatchFiles) {
      let time = this.getTimeElapsed();
      new Extension().sendToExtension({
        socket: globalSocket,
        type: "timeElapsed",
        payload: time,
      });
    }
    if (__runWatchFiles) new Drawer().drawFinal(global.args.watch);
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
        new Extension().sendToExtension({
          socket: globalSocket,
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
          new Extension().sendToExtension({
            socket: globalSocket,
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
        new Files().history({
          apps: global.config.apps,
          dirName: __dirname,
        });
        res.forEach(item => {
          new Extension().sendToExtension({
            socket: globalSocket,
            type: "file",
            payload: ``,
          });
          item.errors.forEach(error =>
            new Drawer().drawError(JSON.stringify(error, null, 1))
          );
          item.warnings.forEach(warn => {
            new Drawer().drawWarning(JSON.stringify(warn, null, 1));
          });
          new Extension().sendToExtension({
            socket: globalSocket,
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
          new Extension().sendToExtension({
            socket: globalSocket,
            type: "fileName",
            payload: path.basename(app.entry),
          });
          global.webpackPromises.push(this.__bundle(app.entry, app.out));
        });
        let res = await Promise.all(global.webpackPromises);
        // it's send inside __bundle
        // res.forEach(item => {
        //  new Extension().sendToExtension({
        // socket:globalSocket,
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
    new Extension().sendToExtension({
      socket: globalSocket,
      type: "timeElapsed",
      payload: time,
    });
    new Drawer().drawFinal(global.args.watch);
  }

  async __bundle(entry, out) {
    return new Promise((resolve, reject) => {
      new Extension().sendToExtension({
        socket: globalSocket,
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
          new Extension().sendToExtension({
            socket: globalSocket,
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

class ExtensionServer {
  constructor() {
    this.createServer();
  }

  createServer() {
    new Extension().createServer(global.config.serverPort).then(res => {
      this.app = res.app;
      this.io = res.io;
      this.init_socket();
      this.watchConfig();
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
            appsLength: global.config.apps.length,
            icons: global.config.icons,
            defaultLang: global.config.defaultLang,
            constructosPath: global.config.constructosPath,
            sass: global.config.sass,
            dirName: __dirname,
          });
          new Extension().sendToExtension({
            socket: globalSocket,
            type: "totalFiles",
            payload: totalFiles,
          });
          new WBR().bundleRelease();
        } else {
          let totalFiles = await new Files().initialFileCount({
            appsLength: global.config.apps.length,
            icons: global.config.icons,
            defaultLang: global.config.defaultLang,
            constructosPath: global.config.constructosPath,
            dirName: __dirname,
            sass: global.config.sass,
          });
          new Extension().sendToExtension({
            socket: globalSocket,
            type: "totalFiles",
            payload: totalFiles,
          });
          new WBR().transpileAll();
        }
      });

      socket.on("isWatchingT", () => {
        if (watchers.isWatchingT) {
          new Extension().sendToExtension({
            socket: globalSocket,
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

new WBR().initiator();
