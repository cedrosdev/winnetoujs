/**
 * @type {import('./interfaces').IWinConfig}
 */
const config = {
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

module.exports = config;
