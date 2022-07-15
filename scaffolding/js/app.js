import { Winnetou } from "../node_modules/winnetoujs/src/winnetou.js";
import _strings from "./_strings.js";
import { welcome } from "./constructos/welcome.js";

Winnetou.updateTranslations(_strings).then(() => render());

async function render() {
  let json;
  try {
    json = await (
      await fetch("../node_modules/winnetoujs/package.json")
    ).json();
  } catch (e) {
    json = {
      version: _strings.version_string_error,
    };
  }

  welcome({
    title: _strings.welcome,
    version_string: _strings.version_string,
    version: json.version,
  }).create("#app");
}
