/**
 * @typedef {object} app
 * @property {string} entry Entry file
 * @property {string} out Output file
 *
 * @typedef {object} sass
 * @property {string} entryFolder Entry folder
 * @property {string} outFolder Release folder
 * @property {string} [firstFile] The file that needs to be in top of css bundle.
 *
 * @typedef {object} IWinConfig
 * @property {string} constructosPath The path of constructos
 * @property {string} constructosOut The path of constructos release
 * @property {Array.<app>} apps (Available since in 1.19.0)
 * Array of apps to be compiled in Webpack
 * @property {string|object} [entry] since 1.19.0, use apps instead.
 * @property {string|object} [out] deprecated since 1.19.0, use apps instead.
 * @property {Array.<sass>} [sass]
 * The path of sass files to be compiled and watched
 * @property {string} [defaultLang] Initial language, "en-us"
 * @property {string} [publicPath]
 * Relative path address to translations folder
 * @property {string} [icons] The path of icons
 * @property {number} [serverPort] Port number for WinnetouJs Visual Studio Code Extension Server
 */

/**
 * @type IWinConfig
 * Property folderName is deprecated since version 1.17.5, set it doesn't affect the code.
 */
exports.IWinConfig = class WinConfig {};
