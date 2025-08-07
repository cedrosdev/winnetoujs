// Type definitions for winnetoujs/wbr_modules/bundleRelease.js
/// <reference path="../types/bundleRelease.d.ts" />

declare class BundleRelease {
  constructor(args: WinnetouJS.BundleReleaseArgs);
  build(): Promise<"watching" | "done">;
}

export = BundleRelease;
