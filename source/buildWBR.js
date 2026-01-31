// removed console.log from postinstall file
// "...Tell them what you need to tell them in your docs."
// https://github.com/npm/cli/issues/3647#issuecomment-900859012
const path = require("path");
const ncp = require("ncp").ncp;
const fs = require("fs");
// @ts-ignore
ncp.limit = 16;
ncp(
  path.join(__dirname, "./wbr/wbr.js"),
  path.join(__dirname, "../../../wbr.js"),
  function (err) {},
);

// Create .github/instructions directory if it doesn't exist
const instructionsDir = path.join(__dirname, "../../../.github/instructions");
if (!fs.existsSync(instructionsDir)) {
  fs.mkdirSync(instructionsDir, { recursive: true });
}

// create ./claude/skills directory if it doesn't exist
const claudeSkillsDir = path.join(__dirname, "../../../claude/skills");
if (!fs.existsSync(claudeSkillsDir)) {
  fs.mkdirSync(claudeSkillsDir, { recursive: true });
}

// Copy all files from ./instructions/ to ../../../.github/instructions/instructions
ncp(
  path.join(__dirname, "./instructions/"),
  path.join(__dirname, "../../../.github/instructions"),
  function (err) {
    err && console.log(err);
  },
);

// Copy all files from ./skills/ to ../../../claude/skills
ncp(
  path.join(__dirname, "./skills/"),
  path.join(__dirname, "../../../claude/skills"),
  function (err) {
    err && console.log(err);
  },
);
