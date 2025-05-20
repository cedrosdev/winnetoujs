const Drawer = require("./drawer.js");
const path = require("path");
const recursive = require("recursive-readdir");
const postcss = require("postcss");
const minmax = require("postcss-media-minmax");
const sass = require("sass");
const fs = require("fs-extra");
const Err = require("./err.js");
const { Socket } = require("socket.io");

const {
  SourceMapConsumer,
  SourceMapGenerator,
  SourceNode,
} = require("source-map");
const Extension = require("./extension.js");

class Sass {
  /**
   *
   * @param {Socket<import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, any>} globalSocket
   */
  constructor(globalSocket) {
    this.socket = globalSocket;
  }
  /**
   *
   * @param {object} args
   * @param {any} args.dirName
   * @param {any} args.sass
   * @param {boolean} args.production
   * @returns
   */
  async transpile(args) {
    return new Promise((resolve, reject) => {
      let promises = [];
      let arr = args.sass;
      arr?.forEach(item => {
        promises.push(
          this.readScssFolder(
            path.join(args.dirName, item.entryFolder),
            path.join(args.dirName, item.outFolder),
            item.firstFile,
            args.production
          )
        );
      });

      Promise.all(promises)
        .then(res => {
          resolve(true);
        })
        .catch(e => {
          new Drawer().drawError(e);
          resolve(true);
        });
    });
  }

  /**
   *
   * @param {string} entry
   * @param {string} out
   * @param {string} first
   * @param {boolean} production
   * @private
   */
  async readScssFolder(entry, out, first, production) {
    let promises = [];
    return new Promise((resolve, reject) => {
      if (first) {
        promises.push(this.transpileSass(path.join(entry, first), production));
        new Drawer().drawAdd(first);
      }

      recursive(entry, async (err, files) => {
        if (err) {
          new Drawer().drawError(err.message);
          await this.execSassPromises(out, [], production);
          resolve(true);
        }

        for (let c = 0; c < files.length; c++) {
          if (files[c].includes(first)) {
            continue;
          }
          try {
            promises.push(this.transpileSass(files[c], production));
            new Drawer().drawAdd(files[c]);
          } catch (e) {
            new Drawer().drawAddError(files[c]);
            new Drawer().drawText("Sass transpile error.");
            new Drawer().drawTextBlock(e.message);
            new Drawer().drawBlankLine();
          }
        }

        await this.execSassPromises(out, promises, production);
        resolve(true);
      });
    });
  }

  /**
   *
   * @param {string} file
   * @param {boolean} production
   * @private
   */
  async transpileSass(file, production) {
    return new Promise((resolve, reject) => {
      sass
        .compileAsync(file, {
          sourceMap: production,
          sourceMapIncludeSources: production,
          ...(production && { style: "compressed" }),
          logger: {
            warn: production ? text => {} : new Drawer().drawWarning,
          },
        })
        .then(res => {
          let output = postcss().use(minmax()).process(res.css.toString()).css;
          new Extension().sendToExtension({
            type: "file",
            socket: this.socket,
            payload: path.basename(file),
          });
          resolve({ css: output, map: res.sourceMap });
        })
        .catch(e => {
          new Drawer().drawWarning(e.message);
          reject(e);
        });
    });
  }

  /**
   *
   * @param {string} out
   * @param {any} promisesArray
   * @param {boolean} production
   * @returns
   */
  async execSassPromises(out, promisesArray, production) {
    return new Promise((resolve, reject) => {
      Promise.all(promisesArray)
        .then(async data => {
          let cssContent = data.map(item => item.css);
          let mapContent = data.map(item => item.map);

          cssContent.push(
            `*{-webkit-overflow-scrolling:touch;}.winnetou_display_none{display:none !important;}`
          );

          if (production) {
            cssContent.push(
              `/*# sourceMappingURL=winnetouBundle.min.css.map */`
            );
          }

          let result = cssContent.join("\n");

          let finalMap;
          production &&
            (finalMap = await this.mergeSourceMaps(mapContent, cssContent));

          fs.outputFile(out + "/winnetouBundle.min.css", result, err => {
            if (err) {
              new Drawer().drawError("Code pt4y - " + err.message);
              new Err().e004();
            }

            production
              ? fs.outputFile(
                  out + "/winnetouBundle.min.css.map",
                  finalMap,
                  err => {
                    if (err) {
                      new Drawer().drawError("Code 90ls - " + err.message);
                      new Err().e004();
                    }
                    resolve(true);
                  }
                )
              : resolve(true);
          });
        })
        .catch(e => {
          new Drawer().drawError("Code io9s - " + e.message);
          new Err().e004();
          resolve(true);
        });
    });
  }

  async mergeSourceMaps(maps, finalCSS) {
    let node = SourceNode.fromStringWithSourceMap(
      finalCSS[0],
      await new SourceMapConsumer(maps[0])
    );

    for (let i = 1; i < maps.length; i++) {
      node.add(
        SourceNode.fromStringWithSourceMap(
          finalCSS[i],
          await new SourceMapConsumer(maps[i])
        )
      );
    }

    let map = node.toStringWithSourceMap({
      file: "winnetouBundle.min.css",
    }).map;

    return map.toString();
  }
}

module.exports = Sass;
