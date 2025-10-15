"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/wbr/wbr.ts
var import_commander = require("commander");
var path2 = __toESM(require("path"));
var fs2 = __toESM(require("fs"));

// src/wbr/bundleRelease.ts
var esbuild = __toESM(require("esbuild"));
var import_node_watch = __toESM(require("node-watch"));

// src/wbr/constructosParser.ts
var import_recursive_readdir = __toESM(require("recursive-readdir"));
var fs = __toESM(require("fs"));
var path = __toESM(require("path"));
var import_node_html_parser = require("node-html-parser");
var import_escape_string_regexp = __toESM(require("escape-string-regexp"));
var import_js_beautify = require("js-beautify");
var ConstructosParser = class {
  /**
   * Creates an instance of ConstructosParser
   * @param args - Configuration arguments
   */
  constructor(args) {
    this.constructosSourceFolder = args.constructosSourceFolder;
    this.verbose = args.verbose || false;
    this.promisesConstructos = [];
    this.idList = [];
  }
  async singleParse(fileName) {
    this.idList = [];
    await this.transpileConstructo(fileName);
  }
  async parse() {
    const files = await (0, import_recursive_readdir.default)(this.constructosSourceFolder);
    files.forEach((file) => {
      if (file.endsWith(".wcto.html") || file.endsWith(".wcto.htm")) {
        if (this.verbose) {
          console.log("Parsing constructo file:", file);
        }
        this.promisesConstructos.push(this.transpileConstructo(file));
      }
    });
    await Promise.all(this.promisesConstructos);
    if (this.verbose) {
      console.log(
        `\x1B[34mParsed ${this.promisesConstructos.length} constructo files successfully.\x1B[0m`
      );
    }
    return true;
  }
  async transpileConstructo(filePath) {
    return new Promise((resolve, reject) => {
      try {
        fs.readFile(
          filePath,
          "utf8",
          (err, data) => {
            if (err) {
              reject(err);
              return;
            }
            const dom = (0, import_node_html_parser.parse)(data.toString());
            const components = dom.querySelectorAll("winnetou");
            let finalReturn = "";
            Array.from(components).forEach((component) => {
              const descri = component.getAttribute("description");
              const constructo = component.innerHTML;
              let jsdoc = "\n\n// ========================================";
              jsdoc += "\n/**\n";
              jsdoc += `	* ${descri || ""}
`;
              let requiredElement = false;
              let hasPropElements = false;
              let jsdoc2 = "";
              let id;
              try {
                const match = constructo.match(/\[\[\s?(.*?)\s?\]\]/);
                if (match) {
                  id = match[1];
                } else {
                  console.error(
                    `\x1B[31mError: Constructo ID not found in ${filePath}. Please ensure it is defined as [[id]].\x1B[0m`
                  );
                  return;
                }
              } catch (e) {
                console.error(`Error: Failed to parse ${filePath}.`);
                return;
              }
              const pureId = id + "-win-${this.identifier}";
              const verify = this.idList.filter(
                (data2) => data2.id === id
              );
              if (verify.length > 0) {
                console.error(
                  `Error: Duplicate Constructo ID found in ${filePath}.`
                );
              }
              this.idList.push({ file: filePath, id });
              const regId = /\[\[\s*?(.*?)\s*?\]\]/g;
              let matchIds = constructo.match(regId) || [];
              let idsObj = "";
              if (matchIds.length) {
                idsObj = "ids: {";
                const processedMatchIds = matchIds.map(
                  (item) => item.replace("[[", "").replace("]]", "")
                );
                processedMatchIds.forEach((item) => {
                  idsObj += `${item}: \`${item}-win-\${this.identifier}\`,`;
                });
                idsObj += "},";
              } else {
                idsObj = "";
              }
              let processedConstructo = constructo.replace(
                /\[\[\s*?(.*?)\s*?\]\]/g,
                "$1-win-${this.identifier}"
              );
              const regex = new RegExp("{{\\s*?(.*?)\\s*?}}", "g");
              const matches = processedConstructo.match(regex);
              const propNames = [];
              if (matches) {
                hasPropElements = true;
                matches.forEach((match) => {
                  const el = match.replace("{{", "").replace("}}", "");
                  const colonSeparatorArray = el.split(":");
                  const roundBracketsSeparatorArray = colonSeparatorArray[0].split("(");
                  const type = colonSeparatorArray[1] || "";
                  const required = colonSeparatorArray[0].indexOf("?") === -1;
                  if (required) requiredElement = true;
                  const propName = roundBracketsSeparatorArray[0].replace("?", "").trim();
                  propNames.push(propName);
                  let commentary = roundBracketsSeparatorArray[1] || "";
                  commentary = commentary.replace(")", "");
                  jsdoc2 += `	* @param {${type ? type : "any"}} ${required ? `elements.${propName}` : `[elements.${propName}]`}  ${commentary.trim()}
`;
                  const escapedString = (0, import_escape_string_regexp.default)(match);
                  processedConstructo = processedConstructo.replace(
                    new RegExp(escapedString, "g"),
                    `\${props?.${propName} || ""}`
                  );
                });
              }
              if (hasPropElements && requiredElement) {
                jsdoc += "	* @param {object} elements\n";
              } else {
                jsdoc += "	* @param {object} [elements]\n";
              }
              jsdoc += jsdoc2;
              jsdoc += "	* @param {object} [options]\n";
              jsdoc += "	* @param {string} [options.identifier]\n";
              jsdoc += "	*/\n";
              const className = `$${id}`;
              const classStr = this.generateClassString(
                jsdoc,
                className,
                id,
                processedConstructo,
                idsObj
              );
              finalReturn += classStr;
            });
            const finalResult = (0, import_js_beautify.js)(finalReturn, {
              indent_size: 1,
              space_in_empty_paren: true
            });
            const out = (0, import_js_beautify.js)(
              `
            import {Constructos} from "winnetoujs/core/constructos";
            


            ${finalReturn}
          `,
              {
                indent_size: 1,
                space_in_empty_paren: true,
                preserve_newlines: false,
                end_with_newline: true,
                max_preserve_newlines: 1,
                wrap_line_length: 50,
                eol: "\n",
                indent_with_tabs: false,
                space_after_anon_function: true,
                space_after_named_function: true,
                space_before_conditional: true,
                space_in_paren: false
              }
            );
            const fileName = path.parse(filePath).name;
            const dir = path.parse(filePath).dir;
            const pathOut = path.join(dir, `${fileName}.js`);
            fs.writeFile(
              pathOut,
              out,
              "utf8",
              (writeErr) => {
                if (writeErr) {
                  console.error(`Error writing file ${pathOut}:`, writeErr);
                  reject(writeErr);
                  return;
                }
                if (this.verbose) {
                  console.log(
                    `Constructo file ${fileName}.js created successfully in ${dir}.`
                  );
                }
                resolve(true);
              }
            );
          }
        );
      } catch (e) {
        const error = e;
        reject(error.message);
      }
    });
  }
  /**
   * Generate the class string template for a constructo component
   * @param jsdoc - The JSDoc comment string for the class
   * @param className - The name of the class to generate
   * @param id - The constructo ID
   * @param constructo - The HTML template content
   * @param idsObj - The IDs object string for the create method return
   * @returns The complete class string
   * @private
   */
  generateClassString(jsdoc, className, id, constructo, idsObj) {
    return `
    export class ${className} extends Constructos {
      ${jsdoc}
  constructor(elements, options) {
    super();
    /**@protected */
    this.identifier = this._getIdentifier(
      options ? options.identifier || "notSet" : "notSet"
    );
    const digestedPropsToString = this._mutableToString(elements);

    /**@protected */
    this.component = this.code(digestedPropsToString);

    this._saveUsingMutable(
      \`${id}-win-\${this.identifier}\`,
      elements,
      options,
      ${className}
    );
  }

  /**
   * Generate the HTML code for this constructo
   * @param {*} props - The properties object containing all prop values
   * @returns {string} The HTML template string with interpolated values
   * @protected
   */
  code(props) {
    return \`${constructo}\`;
  }

  /**
   * Create Winnetou Constructo
   * @param  {object|string} output The node or list of nodes where the component will be created
   * @param  {object} [options] Options to control how the construct is inserted. Optional.
   * @param  {boolean} [options.clear] Clean the node before inserting the construct
   * @param  {boolean} [options.reverse] Place the construct in front of other constructs
   */
  create(output, options) {
    this.attachToDOM(this.component, output, options);
    return {
      ${idsObj}
    };
  }

  /**
   * Get the constructo as a string
   * @returns {string} The component HTML string
   */
  constructoString() {
    return this.component;
  }
}
`;
  }
};

// src/wbr/bundleRelease.ts
var BundleRelease = class {
  /**
   * Creates an instance of BundleRelease
   * @param args - Configuration arguments
   */
  constructor(args) {
    this.entryFile = args.entryFile;
    this.outputDir = args.outputDir;
    this.watch = args.watch;
    this.production = args.production;
    this.verbose = args.verbose || false;
    this.constructosSourceFolder = args.constructosSourceFolder;
    this.node = args.node || false;
    this.nodeEsm = args["node-esm"] || false;
    if (this.verbose) {
      console.log(
        "production mode:",
        this.production ? "\x1B[32myes\x1B[0m" : "\x1B[31mno\x1B[0m"
      );
      console.log(
        "watch mode:",
        this.watch ? "\x1B[32myes\x1B[0m" : "\x1B[31mno\x1B[0m"
      );
      console.log(
        "node mode (SSR)(CJS):",
        this.node ? "\x1B[32myes\x1B[0m" : "\x1B[31mno\x1B[0m"
      );
      console.log(
        "node mode (SSR)(ESM):",
        this.nodeEsm ? "\x1B[32myes\x1B[0m" : "\x1B[31mno\x1B[0m"
      );
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
   * @returns - Returns a promise that resolves when the build is complete or watching is started
   */
  async build() {
    const constructosParserInstance = new ConstructosParser({
      constructosSourceFolder: this.constructosSourceFolder,
      verbose: this.verbose
    });
    await constructosParserInstance.parse();
    if (this.watch) {
      (0, import_node_watch.default)(this.constructosSourceFolder, {
        recursive: true,
        filter: (f) => f.endsWith(".wcto.htm") || f.endsWith("wcto.html")
      }).on("change", (ev, fileName) => {
        this.verbose && console.log(
          "\n\n\x1B[32mConstructo updated: " + fileName + "\x1B[0m"
        );
        constructosParserInstance.singleParse(fileName);
      });
    }
    const result = await this.esbuild();
    return result;
  }
  async esbuild() {
    const plugins = [];
    plugins.push({
      name: "detailed-build-notifier",
      setup: (build) => {
        let startTime;
        build.onStart(() => {
          startTime = performance.now();
          console.log(`\u{1F504} Starting build...`);
        });
        build.onEnd((result) => {
          const timestamp = (/* @__PURE__ */ new Date()).toLocaleTimeString();
          const duration = startTime ? `(${Math.round(performance.now() - startTime)}ms)` : "";
          if (result.errors.length > 0) {
            console.log(`\u274C [${timestamp}] Build failed ${duration}`);
            result.errors.forEach(
              (error) => console.log(`  Error: ${error.text}`)
            );
          } else if (result.warnings.length > 0) {
            console.log(
              `\u26A0\uFE0F  [${timestamp}] Build completed with warnings ${duration}`
            );
            result.warnings.forEach(
              (warning) => console.log(`  Warning: ${warning.text}`)
            );
          } else {
            console.log(
              `\u2705 [${timestamp}] Bundle rebuilt successfully! ${duration}`
            );
          }
        });
      }
    });
    const es = await esbuild.context({
      entryPoints: this.entryFile,
      platform: this.node || this.nodeEsm ? "node" : "browser",
      bundle: true,
      outdir: this.outputDir,
      splitting: this.node ? false : true,
      format: this.node ? "cjs" : "esm",
      minify: this.production,
      sourcemap: !this.production,
      target: ["chrome90"],
      entryNames: this.production ? "[name].winnetouBundle.min" : "[name]",
      chunkNames: this.production ? "[hash].lazyBundle" : "[name]-[hash].lazyBundle",
      loader: { ".ts": "ts" },
      plugins
    });
    if (this.watch) {
      await es.watch();
      return "watching";
    } else {
      await es.rebuild();
      return "done";
    }
  }
};

// src/wbr/wbr.ts
var winConfig;
try {
  const configPath = path2.join(__dirname, "win.config.json");
  const configContent = fs2.readFileSync(configPath, "utf8");
  winConfig = JSON.parse(configContent);
} catch (error) {
  console.error("\x1B[31mError reading win.config.json\x1B[0m");
  process.exit(1);
}
var WBR = class {
  constructor() {
    this.watch = false;
    this.bundleRelease = false;
    this.production = false;
    this.entryFile = [];
    this.outputDir = "";
    this.constructosSourceFolder = "";
    console.log(
      "\n\n\n\x1B[32mWinnetou Bundle Runtime (WBR) - Version 3\x1B[0m"
    );
    console.log("\x1B[33mhttps://winnetoujs.org\x1B[0m");
    console.log("\x1B[34mInitializing WBR...\x1B[0m");
    this.configureRuntime();
  }
  configureRuntime() {
    if (winConfig.apps && winConfig.outputDir && winConfig.constructosSourceFolder) {
      this.outputDir = path2.join(__dirname, winConfig.outputDir);
      this.constructosSourceFolder = path2.join(
        __dirname,
        winConfig.constructosSourceFolder
      );
      winConfig.apps.forEach((app) => {
        if (typeof app === "string" && (app.endsWith(".ts") || app.endsWith(".js"))) {
          this.entryFile.push(path2.join(__dirname, app));
        }
      });
    } else {
      console.error("\x1B[31mInvalid configuration in win.config.json\x1B[0m");
      process.exit(1);
    }
  }
  readArgs() {
    const program = new import_commander.Command();
    program.name("wbr").description("Winnetou Bundle Runtime (WBR) - Version 3").version("3.x").option("-b,--bundleRelease", "Compile project").option("-w, --watch", "Watch mode").option("-p, --production", "Production mode").option("-v, --verbose", "Verbose output").option("-n, --node", "Node platform for server-side rendering (SSR)").option("-e, --node-esm", "Node platform with ESM support").parse();
    const opts = program.opts();
    if (Object.keys(opts).length === 0) {
      program.help();
      process.exit(1);
    }
    this.watch = !!opts.watch;
    this.bundleRelease = !!opts.bundleRelease;
    this.production = !!opts.production;
    this.node = opts.node;
    this.nodeEsm = opts["node-esm"];
    if (this.bundleRelease) {
      const config = {
        entryFile: this.entryFile,
        outputDir: this.outputDir,
        watch: this.watch,
        production: this.production,
        verbose: opts.verbose,
        constructosSourceFolder: this.constructosSourceFolder,
        node: this.node,
        "node-esm": this.nodeEsm
      };
      new BundleRelease(config).build().then((res) => {
        if (res === "watching") {
          console.log("\x1B[34mWatching for changes...\x1B[0m");
        } else {
          console.log("Build completed.");
          process.exit(0);
        }
      }).catch((error) => {
        console.error("Error during bundle release:", error);
        process.exit(1);
      });
    }
  }
};
var wbr = new WBR();
wbr.readArgs();
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
