import { Winnetou } from "../node_modules/winnetoujs/src/winnetou.js";
import _strings from "./_strings.js";
import { welcome } from "./constructos/welcome.js";

Winnetou.lang(_strings, render);

async function render() {
  let json = await (
    await fetch("../node_modules/winnetoujs/package.json")
  ).json();

  welcome({
    title: _strings.welcome,
    version_string: _strings.version_string,
    version: json.version,
  }).create("#app");
}
