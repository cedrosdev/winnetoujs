const winnetouPackage = require("winnetoujs/package.json");
const path = require("path");
const memory = {
  errorsCount: 0,
  warningCount: 0,
};

class Drawer {
  drawLine = (size = 80) => {};

  /**
   * @typedef {object} params
   * @property {'cyan'|'yellow'|'green'|'red'|'error'|'bright'|'dim'|'warning'|'production'} [color] string color
   * @property {number} [size] line size, default 80
   * @property {'add'|'addError'|'change'} [type] string style type
   *
   * Draw string line
   * @param  {string} [text] string to be printed
   * @param {params} [params]
   */
  drawText = (text = "", params) => {
    let color = "";

    if (params?.color) {
      switch (params.color) {
        case "cyan":
          color = "\x1b[36m";
          break;

        case "yellow":
          color = "\x1b[33m";
          break;

        case "green":
          color = "\x1b[32m";
          break;

        case "red":
          color = "\x1b[31m";
          break;

        case "error":
          color = "\x1b[1m\x1b[5m\x1b[41m\x1b[37m";
          break;

        case "production":
          color = "\x1b[44m\x1b[30m";
          break;

        case "warning":
          color = "\x1b[1m\x1b[33m";
          break;

        case "bright":
          color = "\x1b[1m";
          break;

        case "dim":
          color = "\x1b[2m";
          break;
      }
    }

    let line = color + text + "\x1b[0m";

    if (params?.type === "add") {
      line = "\x1b[42m\x1b[37m success \x1b[0m " + color + text + "\x1b[0m";
      text = " success  " + text;
    }

    if (params?.type === "change") {
      line = "\x1b[45m\x1b[37m changed \x1b[0m " + color + text + "\x1b[0m";
      text = " changed  " + text;
    }

    if (params?.type === "addError") {
      line = "\x1b[5m\x1b[43m\x1b[37m fail \x1b[0m " + color + text + "\x1b[0m";
      text = " fail  " + text;
    }

    console.log(line);
  };

  /**
   * Draws text in blocks
   * @param {string} text
   * @param {params} [params]
   */
  drawTextBlock = (text, params) => {
    let arr = text.match(/.{1,74}/g);
    arr.forEach(item => {
      this.drawText(item, params);
    });
  };

  drawBlankLine = () => {
    this.drawText();
  };

  drawSpace = () => {
    console.log();
  };

  /**
   * Draw error
   * @param {string} text error string
   */
  drawError = text => {
    memory.errorsCount++;
    this.drawLine();
    this.drawBlankLine();

    this.drawText(" Error ", { color: "error" });
    this.drawBlankLine();
    text = text.replace(`"`, ``);
    text.split(`:`).forEach(t => {
      this.drawTextBlock(t);
      this.drawBlankLine();
    });
    this.drawLine();
    this.drawBlankLine();
  };

  drawHelp = () => {
    this.drawLine();
    this.drawBlankLine();

    this.drawText("Help", { color: "cyan" });
    this.drawBlankLine();
    this.drawBlankLine();

    this.drawTextBlock(`Syntax`, { color: `bright` });
    this.drawTextBlock(`node wbr [options]`, { color: `dim` });
    this.drawBlankLine();

    this.drawTextBlock(`Option: none`, { color: `bright` });
    this.drawTextBlock(
      `Just transpiles scss and constructos to be used in code.`,
      { color: `dim` }
    );
    this.drawBlankLine();

    this.drawTextBlock(`Option: --bundleRelease (-b)`, { color: `bright` });
    this.drawTextBlock(
      `Transpiles code and compiles to bundle. Development mode with watch and sourcemaps.`,
      { color: `dim` }
    );
    this.drawBlankLine();

    this.drawTextBlock(`Options: -b --no-watch (-nw)`, { color: `bright` });
    this.drawTextBlock(`Disables watching after transpile/compile.`, {
      color: `dim`,
    });
    this.drawBlankLine();

    this.drawTextBlock(`Options: -b --production (-p)`, { color: `bright` });
    this.drawTextBlock(
      `Transpiles and compiles bundles to production. No watching. XWin enabled.`,
      {
        color: `dim`,
      }
    );
    this.drawBlankLine();

    this.drawTextBlock(`Options: -b --no-transpile (-nt) [-p][-nw]`, {
      color: `bright`,
    });
    this.drawTextBlock(
      `Compiles bundles to production without transpiling entire scss and constructos.`,
      {
        color: `dim`,
      }
    );
    this.drawBlankLine();

    this.drawTextBlock(`Options: --version (-v)`, {
      color: `bright`,
    });
    this.drawTextBlock(`Shows WinnetouJs framework version.`, {
      color: `dim`,
    });
    this.drawBlankLine();

    this.drawTextBlock("For further help, visit https://winnetoujs.org/docs", {
      color: "dim",
    });

    this.drawBlankLine();
    this.drawLine();
  };

  drawWarning = (text, options) => {
    memory.warningCount++;
    this.drawLine();
    this.drawBlankLine();
    this.drawText("Warning", { color: "warning" });
    this.drawBlankLine();
    text = text.replace(`"`, ``);
    text.split(`\\n`).forEach(t => {
      this.drawTextBlock(t);
      this.drawBlankLine();
    });
    if (options && options.stack) {
      this.drawText(options.stack.trim(), { color: "red" });
      this.drawBlankLine();
    }
    this.drawLine();
  };

  drawWelcome = () => {
    this.drawBlankLine();
    this.drawText("WinnetouJs Bundle Releaser (WBR)", {
      color: "yellow",
    });
    this.drawText("Version " + winnetouPackage.version, { color: "yellow" });
    this.drawBlankLine();
    this.drawText("Find online help and docs", { color: "dim" });
    this.drawText("https://winnetoujs.org");
    this.drawBlankLine();
    this.drawText("Fork on GitHub", { color: "dim" });
    this.drawText("https://github.com/cedrosdev/WinnetouJs.git");
    this.drawBlankLine();
    this.drawText(
      `(c) 2020 - ${new Date().getFullYear()} Cedros Development (https://cedros.dev)`,
      {
        color: "dim",
      }
    );

    this.drawBlankLine();
  };

  /**
   * Draw add
   * @param {string} text add string
   */
  drawAdd = text => {
    try {
      text = path.basename(text);
    } catch (e) {}
    this.drawText(text, { type: "add", color: "green" });
    this.drawBlankLine();
  };

  drawChange = text => {
    this.drawBlankLine();
    this.drawText(text, { type: "change", color: "green" });
    this.drawBlankLine();
  };

  drawAddError = text => {
    memory.errorsCount++;

    this.drawText(text, { type: "addError", color: "cyan" });
    this.drawBlankLine();
  };

  drawHtmlMin = text => {
    console.log("> [html minified] " + text);
  };

  drawEnd = text => {
    console.log("> [Bundle Release Finished] " + text);
  };

  /**
   *
   * @param {boolean} isWatching if memory.args.watch is enabled
   */
  drawFinal = isWatching => {
    this.drawLine();
    this.drawBlankLine();
    this.drawText("All tasks completed.");
    if (isWatching)
      new Drawer().drawText("Live reload enabled. Watching for changes...", {
        color: "dim",
      });
    this.drawBlankLine();

    if (memory.errorsCount > 0) {
      this.drawText("... with " + memory.errorsCount + " errors");
      this.drawBlankLine();
    }
    if (memory.warningCount > 0) {
      this.drawText("... with " + memory.warningCount + " warnings");
      this.drawBlankLine();
    }

    this.drawLine();
  };
}

module.exports = Drawer;
