const esbuild = require("esbuild");
const fs = require("fs");
const path = require("path");
const watch = require("node-watch");
const constructosParser = require("winnetoujs/wbr_modules/constructosParser");

/**
 * BundleRelease class for building and managing JavaScript bundles using esbuild
 */
module.exports = class BundleRelease {
  /**
   * Creates an instance of BundleRelease
   * @param {Object} args - Configuration arguments
   * @param {string[]} args.entryFile - The entry point file for the bundle
   * @param {string} args.outputDir - The output directory for the built bundle
   * @param {string} args.constructosSourceFolder - The source folder for Constructos files
   * @param {boolean} args.watch - Whether to enable watch mode
   * @param {boolean} args.production - Whether to build for production
   * @param {boolean} args.verbose - Whether to enable verbose output
   */
  constructor(args) {
    this.entryFile = args.entryFile;
    this.outputDir = args.outputDir;
    this.watch = args.watch;
    this.production = args.production;
    this.verbose = args.verbose;
    this.constructosSourceFolder = args.constructosSourceFolder;
    // Verbose output
    if (this.verbose) {
      console.log("production mode:", this.production);
      console.log("watch mode:", this.watch);
      console.log("output directory:", this.outputDir);
      console.log("entry file:", this.entryFile);
      console.log("constructos source folder:", args.constructosSourceFolder);

      if (this.production) {
        console.log("Building in production mode...");
      } else {
        console.log("Building in development mode...");
      }
    }
  }

  /**
   * Builds the bundle using esbuild and starts watching for changes
   * @async
   * @returns {Promise<"watching"|"done">} - Returns a promise that resolves when the build is complete or watching is started
   */
  async build() {
    // transpile constructos
    const constructosParserInstance = new constructosParser({
      constructosSourceFolder: this.constructosSourceFolder,
      verbose: this.verbose,
    });
    await constructosParserInstance.parse();
    // watch constructos
    if (this.watch)
      watch
        .default(this.constructosSourceFolder, {
          recursive: true,
          filter: f => f.endsWith(".wcto.htm") || f.endsWith("wcto.html"),
        })
        .on("change", (ev, file_name) => {
          this.verbose &&
            console.log(
              "\n\n\x1b[32mConstructo updated: " + file_name + "\x1b[0m"
            );
          constructosParserInstance.singleParse(file_name);
        });
    // compile bundle
    const result = await this.esbuild();
    return result;
  }

  async esbuild() {
    const outputDir = this.outputDir;
    let es = await esbuild.context({
      entryPoints: this.entryFile,
      bundle: true,
      outdir: this.outputDir,
      splitting: true,
      format: "esm",
      minify: this.production,
      sourcemap: !this.production,
      target: ["chrome90"],
      entryNames: "[name].winnetouBundle.min",
      chunkNames: this.production ? "[hash].lazyBundle" : "[name]-[hash].lazyBundle",
      loader: { ".ts": "ts" },
      plugins: [
        {
          name: "detailed-build-notifier",
          setup: build => {
            let startTime;

            build.onStart(() => {
              startTime = performance.now();
              console.log(`🔄 Starting build...`);
            });

            build.onEnd(result => {
              const timestamp = new Date().toLocaleTimeString();
              const duration = startTime
                ? `(${Math.round(performance.now() - startTime)}ms)`
                : "";

              if (result.errors.length > 0) {
                console.log(`❌ [${timestamp}] Build failed ${duration}`);
                result.errors.forEach(error =>
                  console.log(`  Error: ${error.text}`)
                );
              } else if (result.warnings.length > 0) {
                console.log(
                  `⚠️  [${timestamp}] Build completed with warnings ${duration}`
                );
                result.warnings.forEach(warning =>
                  console.log(`  Warning: ${warning.text}`)
                );
              } else {
                console.log(
                  `✅ [${timestamp}] Bundle rebuilt successfully! ${duration}`
                );
              }
            });
          },
        },
      ],
    });
    if (this.watch) {
      es.watch();
      return "watching";
    } else {
      await es.rebuild();
      return "done";
    }
  }
};
