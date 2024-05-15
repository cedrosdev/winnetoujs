// removed console.log from postinstall file
// "...Tell them what you need to tell them in your docs."
// https://github.com/npm/cli/issues/3647#issuecomment-900859012
const path = require("path");
const ncp = require("ncp").ncp;
// @ts-ignore
ncp.limit = 16;
ncp(
  path.join(__dirname, "./scaffolding/wbr.js"),
  path.join(__dirname, "../../", "wbr.js"),
  function (err) { }
);