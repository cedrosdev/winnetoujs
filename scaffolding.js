const fs = require("fs");
const path = require("path");
const ncp = require("ncp").ncp;
const winnetouPackage = require("winnetoujs/package.json");

var errorsCount = 0,
  warningCount = 0,
  promises = [];

// DRAW METHODS ===============================================
// #region

const drawLine = (size = 80) => {
  let line = "";
  for (let i = 0; i < size; i++) {
    if (i == 1) line += " ";
    else if (i == size - 2) line += " ";
    else line += "=";
  }
  console.log(line);
};
/**
 * Draw string line
 * @param  {string} [text] string to be printed
 * @param  {object} [params]
 * @param {('cyan'|'yellow'|'green'|'red'|'error'|'bright'|'dim'|'warning')} [params.color] string color
 * @param {number} [params.size] line size, default 80
 * @param {('add'|'addError'|'change')} [params.type] string style type
 */
const drawText = (text = "", params) => {
  let color = "";

  if (params && params.color) {
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

  let line = "= " + color + text + "\x1b[0m";

  if (params && params.type === "add") {
    line = "= \x1b[42m\x1b[37m success \x1b[0m " + color + text + "\x1b[0m";
    text = " success  " + text;
  }

  if (params && params.type === "change") {
    line = "= \x1b[45m\x1b[37m changed \x1b[0m " + color + text + "\x1b[0m";
    text = " changed  " + text;
  }

  if (params && params.type === "addError") {
    line = "= \x1b[5m\x1b[43m\x1b[37m fail \x1b[0m " + color + text + "\x1b[0m";
    text = " fail  " + text;
  }

  let tamanho = text.length + 2;

  let size = params ? params.size || 80 : 80;

  for (let i = 0; i < size - tamanho; i++) {
    if (i == size - tamanho - 1) line += "=";
    else line += " ";
  }

  console.log(line);
};

const drawTextBlock = (text, params) => {
  let arr = text.match(/.{1,74}/g);
  arr.forEach(item => {
    drawText(item, params);
  });
};

const drawBlankLine = () => {
  drawText();
};

const drawSpace = () => {
  console.log("\n");
};

/**
 * Draw error
 * @param {string} text error string
 */
const drawError = text => {
  errorsCount++;
  drawLine();
  drawBlankLine();
  drawText(" Bundle Error ", { color: "error" });
  drawBlankLine();
  drawTextBlock(text);
  drawBlankLine();
  drawLine();
  drawBlankLine();
};

const drawWarning = text => {
  warningCount++;
  drawLine();
  drawBlankLine();
  drawText("Warning", { color: "warning" });
  drawBlankLine();
  drawTextBlock(text);
  drawBlankLine();
  drawLine();
};

const drawWelcome = () => {
  // console.clear();
  drawLine();
  drawBlankLine();
  drawBlankLine();
  drawText("W I N N E T O U J S ", { color: "bright" });
  drawBlankLine();
  drawText("T h e  i n d i e  j a v a s c r i p t  c o n s t r u c t o r", {
    color: "dim",
  });
  drawBlankLine();
  drawText("WinnetouJs.org", { color: "yellow" });

  drawBlankLine();
  drawBlankLine();
  drawLine();
  drawBlankLine();
  drawText("Find online help and docs", { color: "dim" });
  drawText("https://winnetoujs.org/docs");
  drawBlankLine();
  drawText("Fork on GitHub", { color: "dim" });
  drawText("https://github.com/cedrosdev/WinnetouJs.git");
  drawBlankLine();
  drawText("(c) 2020 Cedros Development (https://cedrosdev.com)", {
    color: "dim",
  });

  drawBlankLine();
  drawLine();
  drawBlankLine(); // console.clear();
  drawLine();
  drawBlankLine();
  drawBlankLine();
  // drawText("WINNETOUJS ", { color: "dim" });
  // drawBlankLine();
  drawText("WinnetouJs Bundle Releaser (WBR)", {
    color: "yellow",
  });
  // drawBlankLine();
  drawText("Version " + winnetouPackage.version, { color: "yellow" });

  drawBlankLine();
  drawBlankLine();
  drawLine();
  drawBlankLine();
  drawText("Find online help and docs", { color: "dim" });
  drawText("https://winnetoujs.org");
  drawBlankLine();
  drawText("Fork on GitHub", { color: "dim" });
  drawText("https://github.com/cedrosdev/WinnetouJs.git");
  drawBlankLine();
  // don't use new Date here, it needs to be manually updated
  // to the last year of the project in order to
  // ensure updates are being made
  drawText(`(c) 2020 - 2024 Cedros Development (https://cedrosdev.com)`, {
    color: "dim",
  });

  drawBlankLine();
  drawLine();
  drawBlankLine();
};

/**
 * Draw add
 * @param {string} text add string
 */
const drawAdd = text => {
  drawText(text, { type: "add", color: "green" });
  drawBlankLine();
};

const drawChange = text => {
  drawText(text, { type: "change", color: "green" });
  drawBlankLine();
};

const drawAddError = text => {
  errorsCount++;

  drawText(text, { type: "addError", color: "cyan" });
  drawBlankLine();
};

const drawHtmlMin = text => {
  console.log("> [html minifield] " + text);
};

const drawEnd = text => {
  console.log("> [Bundle Release Finished] " + text);
};

const drawFinal = () => {
  drawLine();
  drawBlankLine();
  drawText("All tasks completed");
  drawBlankLine();
  drawText("Run npm install to finish setup");
  drawBlankLine();
  if (errorsCount > 0) {
    drawText("... with " + errorsCount + " errors");
    drawBlankLine();
  }
  if (warningCount > 0) {
    drawText("... with " + warningCount + " warnings");
    drawBlankLine();
  }

  drawLine();
  drawSpace();
};

// #endregion

console.clear();
drawWelcome();
drawText("Init scaffolding ...");
drawBlankLine();

// COPY METHODS ===============================================

//@ts-ignore
ncp.limit = 16;

ncp(
  path.join(__dirname, "./node_modules/winnetoujs/scaffolding"),
  path.join(__dirname, "./"),
  function (err) {
    if (err) {
      return drawError(err.join("\n"));
    }
    drawAdd("Scaffolding complete");
    drawFinal();
  }
);
