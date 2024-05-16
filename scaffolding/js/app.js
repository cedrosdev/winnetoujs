import { Winnetou } from "../node_modules/winnetoujs/src/winnetou.js";
import _strings from "./_strings.js";
import { welcome } from "./constructos/welcome.js";

Winnetou.updateTranslations(_strings).then(() => render());

async function render() {
  welcome({
    title: _strings.welcome,
    text: _strings.text,
  }).create("#app");
}
