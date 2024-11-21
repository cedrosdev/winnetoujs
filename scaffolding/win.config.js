/**
 * @type {import('./interfaces').IWinConfig}
 */
export default {
  defaultLang: "en-us",
  publicPath: "/",
  constructosPath: "./constructos",
  constructosOut: "./js/constructos",
  apps: [
    {
      entry: "./js/app.js",
      out: "./release",
    },
  ],
  sass: [
    {
      entryFolder: "./sass",
      outFolder: "./release",
    },
  ],
};
