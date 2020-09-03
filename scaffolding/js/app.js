import { W } from "../node_modules/winnetoujs/src/winnetou.js";
import { Strings } from "./_strings.js";
import { welcome } from "./constructos/welcome.js";

W.lang(Strings, render);

function render() {
  welcome({ title: Strings.welcome }).create("#app");
}
