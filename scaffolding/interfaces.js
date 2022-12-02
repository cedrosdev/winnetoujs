/**
 * @typedef {object} IWinConfig
 * @property {string} constructosPath The path of constructos
 * @property {string} constructosOut The path of constructos release
 * @property {string|object} entry
 * The path of working js files.
 * If you are working with more than
 * one entry point you can create an
 * object with all paths:
 *
 * ```
 * entry:"./js/app.js"
 * // or
 * entry:{
 *   pc:"./js/pc.js",
 *   mobile:"./js/mobile.js"
 * }
 * ```
 *
 * @property {string|object} out
 * The path of release bundles.
 * If you are working with more than
 * one entry point you can create an
 * object with all paths:
 *
 * ```
 * out:"./js/app.js"
 * // or
 * out:{
 *   pc:"./js/pc.js",
 *   mobile:"./js/mobile.js"
 * }
 * ```
 *
 * @property {string} sass The path of sass files to be compiled and watched
 * @property {string} cssOut The path of sass files release css bundle
 * @property {string} defaultLang Initial language, "en-us"
 * @property {string} publicPath Relative path address to translations folder
 * @property {string} [icons] The path of icons
 *
 */

/**
 * @type IWinConfig
 * Property folderName is deprecated since version 1.17.5, set it doesn't affect the code.
 */
exports.IWinConfig = class WinConfig {};
