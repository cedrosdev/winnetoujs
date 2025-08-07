// Type definitions for WinnetouJS v3.0.0
// Project: https://winnetoujs.org
// Definitions by: Cedros Development <https://github.com/cedrosdev>

/// <reference types="node" />

declare namespace WinnetouJS {
  // Common types used across modules
  type SelectorType = string | Element | Element[];

  interface MutableObject {
    mutable: string;
  }

  interface ConstructoOptions {
    identifier?: string;
    clear?: boolean;
    reverse?: boolean;
    vdom?: DocumentFragment;
    replace?: boolean;
  }

  interface RouteOptions {
    onBack?: (route: string) => void;
    onGo?: (route: string) => void;
  }

  interface TranslationArgs {
    stringsClass: Record<string, string>;
    translationsPublicPath: string;
  }

  interface BundleReleaseArgs {
    entryFile: string[];
    outputDir: string;
    constructosSourceFolder: string;
    watch: boolean;
    production: boolean;
    verbose: boolean;
  }

  interface ConstructosParserArgs {
    constructosSourceFolder: string;
    verbose?: boolean;
  }

  interface FileObject {
    lastModified: number;
    lastModifiedDate: Date;
    name: string;
    size: number;
    type: string;
  }

  interface EventListenerOptions {
    capture?: boolean;
    once?: boolean;
    passive?: boolean;
    signal?: AbortSignal;
  }

  interface ScrollOptions {
    behavior?: "smooth" | "instant" | "auto";
    block?: "start" | "center" | "end" | "nearest";
    inline?: "start" | "center" | "end" | "nearest";
  }
}

export = WinnetouJS;
export as namespace WinnetouJS;
