/**
 * Winnetou Bundle Runtime (WBR) - Version 3
 * @license GNU General Public License v3.0
 * @description This file is part of the WBR project,
 * which is a runtime environment for executing Winnetou Bundle applications.
 * The WBR project is designed to provide a lightweight
 * and efficient platform for running applications built with
 * the Winnetou framework, focusing on performance and ease of use.
 * @author Pamela Sedrez (pamydev)
 * @version 3.0.0
 * @date 2025-07-01
 * https://github.com/pamydev
 * https://github.com/cedrosdev/winnetoujs
 * https://winnetoujs.org
 */

const { Command } = require("commander");
const BundleRelease = require("winnetoujs/wbr_modules/bundleRelease.js");
const path = require("path");
const winConfig = require("./win.config.json");

class WBR {
  constructor() {
    this.watch = false;
    this.bundleRelease = false;
    this.production = false;
    this.entryFile = [];
    this.outputDir = "";
    this.constructosSourceFolder = "";

    console.log(
      "\n\n\n\x1b[32mWinnetou Bundle Runtime (WBR) - Version 3\x1b[0m"
    );
    console.log("\x1b[33mhttps://winnetoujs.org\x1b[0m");
    console.log("\x1b[34mInitializing WBR...\x1b[0m");
    this.configureRuntime();
  }
  configureRuntime() {
    if (
      winConfig.apps &&
      winConfig.outputDir &&
      winConfig.constructosSourceFolder
    ) {
      this.outputDir = path.join(__dirname, winConfig.outputDir);
      this.constructosSourceFolder = path.join(
        __dirname,
        winConfig.constructosSourceFolder
      );
      winConfig.apps.forEach(app => {
        if (
          typeof app === "string" &&
          (app.endsWith(".ts") || app.endsWith(".js"))
        ) {
          this.entryFile.push(path.join(__dirname, app));
        }
      });
    } else {
      console.error("\x1b[31mInvalid configuration in win.config.json\x1b[0m");
      process.exit(1);
    }
  }
  readArgs() {
    const program = new Command();
    program
      .name("wbr")
      .description("Winnetou Bundle Runtime (WBR) - Version 3")
      .version("3.0.0")
      .option("-w, --watch", "Watch mode")
      .option("-b,--bundleRelease", "Compile project")
      .option("-p, --production", "Production mode")
      .option("-v, --verbose", "Verbose output")
      .parse();

    const opts = program.opts();
    const inputs = program.args;

    if (Object.keys(opts).length === 0) {
      program.help();
      process.exit(1);
    }
    this.watch = opts.watch;
    this.bundleRelease = opts.bundleRelease;
    this.production = opts.production;

    if (this.bundleRelease) {
      new BundleRelease({
        entryFile: this.entryFile,
        outputDir: this.outputDir,
        watch: this.watch,
        production: this.production,
        verbose: opts.verbose,
        constructosSourceFolder: this.constructosSourceFolder,
      })
        .build()
        .then(res => {
          if (res === "watching") {
            console.log("\x1b[34mWatching for changes...\x1b[0m");
          } else {
            console.log("Build completed.");
            process.exit(0);
          }
        })
        .catch(error => {
          console.error("Error during bundle release:", error);
          process.exit(1);
        });
    }
  }
}

const wbr = new WBR();
wbr.readArgs();
