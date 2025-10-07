import * as esbuild from "esbuild";
import watch from "node-watch";
import { ConstructosParser } from "./constructosParser";

/**
 * Configuration interface for BundleRelease
 */
interface BundleReleaseConfig {
  entryFile: string[];
  outputDir: string;
  constructosSourceFolder: string;
  watch: boolean;
  production: boolean;
  verbose?: boolean;
  node?: boolean;
}

/**
 * BundleRelease class for building and managing JavaScript bundles using esbuild
 */
export class BundleRelease {
  private entryFile: string[];
  private outputDir: string;
  private watch: boolean;
  private production: boolean;
  private verbose: boolean;
  private constructosSourceFolder: string;
  private node: boolean;

  /**
   * Creates an instance of BundleRelease
   * @param args - Configuration arguments
   */
  constructor(args: BundleReleaseConfig) {
    this.entryFile = args.entryFile;
    this.outputDir = args.outputDir;
    this.watch = args.watch;
    this.production = args.production;
    this.verbose = args.verbose || false;
    this.constructosSourceFolder = args.constructosSourceFolder;
    this.node = args.node || false;

    // Verbose output
    if (this.verbose) {
      console.log(
        "production mode:",
        this.production ? "\x1b[32myes\x1b[0m" : "\x1b[31mno\x1b[0m"
      );
      console.log(
        "watch mode:",
        this.watch ? "\x1b[32myes\x1b[0m" : "\x1b[31mno\x1b[0m"
      );
      console.log(
        "node mode (SSR):",
        this.node ? "\x1b[32myes\x1b[0m" : "\x1b[31mno\x1b[0m"
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
  async build(): Promise<"watching" | "done"> {
    // transpile constructos
    const constructosParserInstance = new ConstructosParser({
      constructosSourceFolder: this.constructosSourceFolder,
      verbose: this.verbose,
    });
    await constructosParserInstance.parse();

    // watch constructos
    if (this.watch) {
      watch(this.constructosSourceFolder, {
        recursive: true,
        filter: (f: string) =>
          f.endsWith(".wcto.htm") || f.endsWith("wcto.html"),
      }).on("change", (ev: string, fileName: string) => {
        this.verbose &&
          console.log(
            "\n\n\x1b[32mConstructo updated: " + fileName + "\x1b[0m"
          );
        constructosParserInstance.singleParse(fileName);
      });
    }

    // compile bundle
    const result = await this.esbuild();
    return result;
  }

  private async esbuild(): Promise<"watching" | "done"> {
    const es = await esbuild.context({
      entryPoints: this.entryFile,
      platform: this.node ? "node" : "browser",
      bundle: true,
      outdir: this.outputDir,
      splitting: true,
      format: "esm",
      minify: this.production,
      sourcemap: !this.production,
      target: ["chrome90"],
      entryNames: this.production ? "[name].winnetouBundle.min" : "[name]",
      chunkNames: this.production
        ? "[hash].lazyBundle"
        : "[name]-[hash].lazyBundle",
      loader: { ".ts": "ts" },
      plugins: [
        {
          name: "detailed-build-notifier",
          setup: (build: esbuild.PluginBuild) => {
            let startTime: number;

            build.onStart(() => {
              startTime = performance.now();
              console.log(`🔄 Starting build...`);
            });

            build.onEnd((result: esbuild.BuildResult) => {
              const timestamp = new Date().toLocaleTimeString();
              const duration = startTime
                ? `(${Math.round(performance.now() - startTime)}ms)`
                : "";

              if (result.errors.length > 0) {
                console.log(`❌ [${timestamp}] Build failed ${duration}`);
                result.errors.forEach((error: esbuild.Message) =>
                  console.log(`  Error: ${error.text}`)
                );
              } else if (result.warnings.length > 0) {
                console.log(
                  `⚠️  [${timestamp}] Build completed with warnings ${duration}`
                );
                result.warnings.forEach((warning: esbuild.Message) =>
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
      await es.watch();
      return "watching";
    } else {
      await es.rebuild();
      return "done";
    }
  }
}
