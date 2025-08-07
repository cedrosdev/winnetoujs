// Type definitions for WinnetouJS - Translations Module
/// <reference path="./common.d.ts" />

/**
 * Updates translations for the application
 * @param args Translation configuration
 * @returns Promise that resolves when translations are updated
 */
export declare function updateTranslations(
  args: WinnetouJS.TranslationArgs
): Promise<boolean>;

/**
 * Changes the language of the application
 * @param lang string language code
 * @param reload boolean reload page, default is true
 */
export declare function changeLang(lang: string, reload?: boolean): void;
