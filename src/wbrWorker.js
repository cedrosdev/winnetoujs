const webpack = require("webpack");
const path = require("path");
module.exports = ({
        entry,
        out,
        dirname,
        publicPath,
        production
    }) => {
    return new Promise((resolve, reject) => {
        const compiler = webpack(
            {
              watch: false,
              entry: path.resolve(dirname, entry),
              output: {
                chunkFilename: `[${
                  production ? "contenthash" : "name"
                }].bundle.js`,
                filename: "winnetouBundle.min.js",
                path: path.resolve(dirname, out),
                publicPath: path.join(publicPath, out),
                clean: {
                  keep(asset) {
                    return asset.includes("css");
                  },
                },
              },
              mode: production ? "production" : "development",
              devtool: production ? false : "source-map",
              stats: "errors-only",
              bail: true,
              cache: true,
              module: {
                rules: [
                  {
                    test: /\.js$/,
                    use: {
                      loader: "babel-loader",
                      options: {
                        compact: false,
                        presets: [
                          [
                            "@babel/preset-env",
                            {
                              targets:
                                "last 2 Chrome versions, last 2 Firefox versions",
                            },
                          ],
                        ],
                        plugins: [
                          "@babel/plugin-transform-optional-chaining",
                          "@babel/plugin-transform-nullish-coalescing-operator",
                          [
                            "@babel/plugin-transform-runtime",
                            {
                              regenerator: true,
                            },
                          ],
                        ],
                      },
                    },
                  },
                ],
              },
            },
            (err, stats) => {
                let errors = new Array(), warnings = new Array();
              if (err) {
                 errors.push(err.message)
              }
              const info = stats?.toJson();
              stats?.compilation.errors.forEach(err => {
                errors.push(err.message.toString());
              });
              if (stats?.hasErrors()) {
                errors.push(info?.errors?.toString());
              }
              if (stats?.hasWarnings()) {
                info?.warnings?.forEach(warning => {
                  warnings.push(warning.message);
                });
              }
              return resolve({
                  errors,
                  warnings
              });
            }
        );
        compiler.run((e, s) => {
            compiler.close(() => {});
        });
    })
}

