/**
 * @type {import('./interfaces').IWinConfig}
 */
export default {
  constructosPath: "./constructos",
  constructosOut: "./js/constructos",
  entry: "./js/app.js",
  out: "./release",
  defaultLang: "en-us",
  publicPath: "/",
  sass: [
    {
      entryFolder: "./sass",
      outFolder: "./release",
    },
  ],
};
