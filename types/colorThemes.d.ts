// Type definitions for WinnetouJS - Color Themes Module
/// <reference path="./common.d.ts" />

declare class ColorThemes {
  /**
   * Apply the saved theme from localStorage
   * @description This method applies the theme stored in localStorage to the document.
   * If no theme is found, it does nothing.
   */
  applySavedTheme(): void;

  /**
   * Change application css
   * @param theme New theme object containing CSS custom properties
   */
  newTheme(theme: Record<string, string>): void;
}
