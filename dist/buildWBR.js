// removed console.log from postinstall file
// "...Tell them what you need to tell them in your docs."
// https://github.com/npm/cli/issues/3647#issuecomment-900859012
const path = require("path");
const ncp = require("ncp").ncp;
const fs = require("fs");
// @ts-ignore
ncp.limit = 16;
ncp(
  path.join(__dirname, "./dist/wbr/wbr.js"),
  path.join(__dirname, "../../../wbr.js"),
  function (err) {}
);

// Create .github/instructions directory if it doesn't exist
const instructionsDir = path.join(__dirname, "../../../.github/instructions");
if (!fs.existsSync(instructionsDir)) {
  fs.mkdirSync(instructionsDir, { recursive: true });
}

ncp(
  path.join(
    __dirname,
    "./dist/instructions/copilot-winnetoujs.instructions.md"
  ),
  path.join(
    __dirname,
    "../../../.github/instructions",
    "copilot-winnetoujs.instructions.md"
  ),
  function (err) {
    err && console.log(err);
  }
);

ncp(
  path.join(__dirname, "./dist/instructions/winnetoujs-select.instructions.md"),
  path.join(
    __dirname,
    "../../../.github/instructions",
    "winnetoujs-select.instructions.md"
  ),
  function (err) {
    err && console.log(err);
  }
);
