// Type definitions for winnetoujs/modules/colorThemes.js
/// <reference path="../types/colorThemes.d.ts" />

declare class ColorThemes {
  applySavedTheme(): void;
  newTheme(theme: Record<string, string>): void;
}

export = ColorThemes;
