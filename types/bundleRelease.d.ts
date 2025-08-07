// Type definitions for WinnetouJS - Bundle Release Module (Build System)
/// <reference path="./common.d.ts" />
/// <reference types="node" />

declare class BundleRelease {
  entryFile: string[];
  outputDir: string;
  watch: boolean;
  production: boolean;
  verbose: boolean;
  constructosSourceFolder: string;

  /**
   * Creates an instance of BundleRelease
   * @param args Configuration arguments
   */
  constructor(args: WinnetouJS.BundleReleaseArgs);

  /**
   * Builds the bundle using esbuild and starts watching for changes
   * @returns Returns a promise that resolves when the build is complete or watching is started
   */
  build(): Promise<"watching" | "done">;

  /**
   * Internal esbuild compilation method
   * @private
   */
  private esbuild(): Promise<"watching" | "done">;
}

export = BundleRelease;
