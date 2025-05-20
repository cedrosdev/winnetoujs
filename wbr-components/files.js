const fs = require("fs-extra");
const recursive = require("recursive-readdir");
const path = require("path");
/**
 * @type {{fileCache:Object,fileLastMod:Object}}
 */
const memory = {
  fileCache: {},
  fileLastMod: {},
};

class Files {
  /**
   * Read file from cache with fallback to filesystem
   * @param  {string} filePath path of the file
   * @returns promise with data
   */
  getFileFromCacheAsync(filePath) {
    return new Promise((resolve, reject) => {
      let lastMod;
      try {
        lastMod = fs.statSync(filePath).mtime.toString();
      } catch (e) {
        return reject(e);
      }
      if (memory.fileCache[filePath]) {
        // exists
        // verify last mod
        if (lastMod == memory.fileLastMod[filePath]) {
          // same last modification
          // there is no alterations
          return resolve(memory.fileCache[filePath]);
        }
      }

      // don't exists
      fs.readFile(filePath, "utf-8", function (err, data) {
        memory.fileCache[filePath] = data;
        memory.fileLastMod[filePath] = lastMod;
        return resolve(data);
      });
    });
  }

  /**
   *
   * @param {object} data
   * @param {boolean} [data.compile]
   * @param {boolean} [data.transpile]
   * @param {number} data.appsLength
   * @param {any} data.icons
   * @param {any} data.sass
   * @param {any} data.defaultLang
   * @param {any} data.constructosPath
   * @param {any} data.dirName
   * @returns
   */
  async initialFileCount(data) {
    let totalFiles = 0;
    let entries = 0;

    if (data) {
      if (data.compile) {
        entries = data.appsLength;
      }
      if (!data.transpile) {
        return entries;
      } else {
        totalFiles += entries;
      }
    }

    const sass = async () => {
      let arr = data.sass;
      arr?.forEach(async item => {
        let files = await recursive(path.join(data.dirName, item.entryFolder));
        totalFiles += files.length;
      });
      return true;
    };
    const icons = async () => {
      const iconsPath = data.icons;
      if (iconsPath) {
        try {
          let files = await recursive(path.join(data.dirName, iconsPath));
          totalFiles += files.length;
        } catch (e) {}
      }
      return true;
    };
    const translate = async () => {
      if (data.defaultLang) totalFiles++;
      return true;
    };
    const constructos = async () => {
      const constructosPath = data.constructosPath;
      let files = await recursive(path.join(data.dirName, constructosPath));
      totalFiles += files.length;
      return true;
    };
    await Promise.all([sass(), icons(), translate(), constructos()]);
    return totalFiles;
  }

  /**
   *
   * @param {object} args
   * @param {any} args.dirName
   * @param {any} args.apps
   */
  async history(args) {
    try {
      const filePath = path.resolve(args.dirName, "./.winnetouJsData");
      let json = {};
      const content = await fs.promises
        .readFile(path.join(args.dirName, filePath), { encoding: "utf8" })
        .catch(err => {
          if (err.code === "ENOENT") {
            console.warn("File not found, starting with empty JSON.");
            return null;
          }
          throw err;
        });
      if (content) {
        json = JSON.parse(content);
      }
      const parseFiles = async () => {
        const apps = args.apps;
        for (const app of apps) {
          const output = app.out;
          if (!json[output]) json[output] = {};
          const filesInAppOutput = await fs.promises.readdir(output);
          for (const file of filesInAppOutput) {
            const fileName = file;
            const filePath = path.join(output, file);
            const stats = await fs.promises.stat(
              path.join(args.dirName, filePath)
            );
            const size = (stats.size / 1024).toFixed(2);
            if (!json[output][fileName]) json[output][fileName] = [];
            if (
              json[output][fileName].length === 0 ||
              json[output][fileName][json[output][fileName].length - 1]
                .sizeKB !== size
            ) {
              json[output][fileName].push({
                date: new Date(),
                sizeKB: size,
              });
              if (json[output][fileName].length > 4) {
                json[output][fileName].shift();
              }
            }
          }
        }
      };
      await parseFiles();
      await fs.promises.writeFile(filePath, JSON.stringify(json, null, 2), {
        encoding: "utf8",
      });
      console.log("File metadata successfully stored in .winnetouJsData");
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }
}

module.exports = Files;
