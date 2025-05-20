const recursive = require("recursive-readdir");
const Drawer = require("./drawer.js");
const fs = require("fs-extra");
const path = require("path");
const prettify = require("html-prettify");
const Files = require("./files.js");
const Extension = require("./extension.js");
const { Socket } = require("socket.io");

class Icons {
  /**
   *
   * @param {object} args
   * @param {Socket<import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, any>} args.globalSocket
   * @param {string} args.dirName
   * @param {string} args.constructosPath
   * @param {string} args.icons
   */
  transpile(args) {
    const promisesIcons = new Array();
    return new Promise(async (resolve, reject) => {
      let constructoIcons = "";
      const iconsPath = args.icons;
      let files;
      if (iconsPath) {
        try {
          files = await recursive(path.join(args.dirName, iconsPath));
        } catch (e) {
          new Drawer().drawError(e.message);
          return resolve(true);
        }
        for (let c = 0; c < files.length; c++) {
          promisesIcons.push(
            this.transpileIcon(files[c], { globalSocket: args.globalSocket })
          );
        }
      }
      Promise.all(promisesIcons).then(async res => {
        let splitter = new Array();
        splitter["icons"] = [];
        res.forEach(item => {
          if (typeof item == "object") {
            let s = item.iconPath.split("/");
            if (s.length > 2) {
              if (!splitter[s[1]]) splitter[s[1]] = [];
              splitter[s[1]].push(item.symbol);
            } else {
              splitter["icons"].push(item.symbol);
            }
          }
        });
        let finalPromise = [];
        Object.keys(splitter).forEach(key => {
          finalPromise.push(
            fs.outputFile(
              path.join(
                args.dirName,
                args.constructosPath,
                `_icons${key != "icons" ? "_" + key : ""}.html`
              ),
              prettify(splitter[key].join("\n"))
            )
          );
        });
        Promise.all(finalPromise).then(res => {
          return resolve(true);
        });
      });
    });
  }

  /**
   *
   * @param {string} iconPath
   * @param {object} args
   * @param {Socket<import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, any>} args.globalSocket
   * @private
   */
  async transpileIcon(iconPath, args) {
    return new Promise(async (resolve, reject) => {
      try {
        const xmlString = await new Files().getFileFromCacheAsync(iconPath);
        const regPath = /[a-zA-Z0-9_]+/g;
        const match = iconPath.match(regPath);
        const filter = match.filter(x => x != "svg");
        const id = filter.join("_");
        const regVb = new RegExp('viewBox="(.*?)"', "gis");
        const reg = new RegExp("<svg(.*?)>(.*?)</svg>", "is");
        if (xmlString) {
          let viewBox = xmlString.match(regVb);
          let arr = xmlString.match(reg);
          let symbol = `
                <winnetou description="Create an icon **${id}**">
                <svg ${viewBox} 
                  id="[[${id}]]" 
                  class="winIcons {{?class%Class for the icon}}">
          `;
          let cleanFill = arr[2].replace("fill", "data-fill");
          symbol += cleanFill;
          symbol += `</svg></winnetou>`;
          new Drawer().drawAdd(iconPath);
          new Extension().sendToExtension({
            socket: args.globalSocket,
            type: "file",
            payload: path.basename(iconPath),
          });
          return resolve({ symbol, iconPath });
        } else {
          return reject();
        }
      } catch (e) {
        new Drawer().drawAddError(iconPath);
        return resolve("");
      }
    });
  }
}

module.exports = Icons;
