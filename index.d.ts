// Type definitions for WinnetouJS v3.0.0
// Project: https://winnetoujs.org
// Definitions by: Cedros Development <https://github.com/cedrosdev>
// TypeScript Version: 4.5

/// <reference path="./types/common.d.ts" />
/// <reference path="./types/winnetou.d.ts" />
/// <reference path="./types/constructos.d.ts" />
/// <reference path="./types/router.d.ts" />
/// <reference path="./types/select.d.ts" />
/// <reference path="./types/colorThemes.d.ts" />
/// <reference path="./types/translations.d.ts" />
/// <reference path="./types/bundleRelease.d.ts" />
/// <reference path="./types/constructosParser.d.ts" />

// Main exports - Core Winnetou functionality
export { Winnetou, W, Win } from "./types/winnetou";
export { Constructos } from "./types/constructos";

// Router module
export { Router } from "./types/router";

// DOM manipulation utilities (Select module)
export * from "./types/select";

// Translations utilities
export * from "./types/translations";

// Build system modules (typically used in build processes)
export { default as BundleRelease } from "./types/bundleRelease";
export { default as ConstructosParser } from "./types/constructosParser";

// Color themes class (not typically exported as module)
// Users would typically import and instantiate ColorThemes directly
declare class ColorThemes {
  applySavedTheme(): void;
  newTheme(theme: Record<string, string>): void;
}

// Global declarations for browser usage
declare global {
  interface Window {
    Winnetou: typeof import("./types/winnetou").Winnetou;
    W: typeof import("./types/winnetou").W;
    Win: typeof import("./types/winnetou").Win;
    Router: typeof import("./types/router").Router;
  }
}

// Default export is the main Winnetou object
export { Winnetou as default } from "./types/winnetou";
