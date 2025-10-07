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

import { Command } from "commander";
import * as path from "path";
import * as fs from "fs";
import { BundleRelease } from "./bundleRelease";

// Import win.config.json
let winConfig: WinConfig;
try {
  const configPath = path.join(__dirname, "win.config.json");
  const configContent = fs.readFileSync(configPath, "utf8");
  winConfig = JSON.parse(configContent);
} catch (error) {
  console.error("\x1b[31mError reading win.config.json\x1b[0m");
  process.exit(1);
}

/**
 * Configuration interface for win.config.json
 */
interface WinConfig {
  apps: string[];
  outputDir: string;
  constructosSourceFolder: string;
}

/**
 * Configuration interface for BundleRelease
 */
interface BundleReleaseConfig {
  entryFile: string[];
  outputDir: string;
  watch: boolean;
  production: boolean;
  verbose?: boolean;
  constructosSourceFolder: string;
  node?: boolean;
}

/**
 * Command line options interface
 */
interface CommandOptions {
  bundleRelease?: boolean;
  watch?: boolean;
  production?: boolean;
  verbose?: boolean;
  node?: boolean;
}

class WBR {
  private watch: boolean = false;
  private bundleRelease: boolean = false;
  private production: boolean = false;
  private node?: boolean;
  private entryFile: string[] = [];
  private outputDir: string = "";
  private constructosSourceFolder: string = "";

  constructor() {
    console.log(
      "\n\n\n\x1b[32mWinnetou Bundle Runtime (WBR) - Version 3\x1b[0m"
    );
    console.log("\x1b[33mhttps://winnetoujs.org\x1b[0m");
    console.log("\x1b[34mInitializing WBR...\x1b[0m");
    this.configureRuntime();
  }

  private configureRuntime(): void {
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
      winConfig.apps.forEach((app: string) => {
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

  public readArgs(): void {
    const program = new Command();
    program
      .name("wbr")
      .description("Winnetou Bundle Runtime (WBR) - Version 3")
      .version("3.0.0")
      .option("-b,--bundleRelease", "Compile project")
      .option("-w, --watch", "Watch mode")
      .option("-p, --production", "Production mode")
      .option("-v, --verbose", "Verbose output")
      .option("-n, --node", "Node platform for server-side rendering (SSR)")
      .parse();

    const opts = program.opts() as CommandOptions;

    if (Object.keys(opts).length === 0) {
      program.help();
      process.exit(1);
    }

    this.watch = !!opts.watch;
    this.bundleRelease = !!opts.bundleRelease;
    this.production = !!opts.production;
    this.node = opts.node;

    if (this.bundleRelease) {
      const config: BundleReleaseConfig = {
        entryFile: this.entryFile,
        outputDir: this.outputDir,
        watch: this.watch,
        production: this.production,
        verbose: opts.verbose,
        constructosSourceFolder: this.constructosSourceFolder,
        node: this.node,
      };

      new BundleRelease(config)
        .build()
        .then((res: string) => {
          if (res === "watching") {
            console.log("\x1b[34mWatching for changes...\x1b[0m");
          } else {
            console.log("Build completed.");
            process.exit(0);
          }
        })
        .catch((error: Error) => {
          console.error("Error during bundle release:", error);
          process.exit(1);
        });
    }
  }
}

const wbr = new WBR();
wbr.readArgs();
