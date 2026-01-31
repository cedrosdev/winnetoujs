---
name: native-translations
description: Guide for native WinnetouJs translations (i18n).
---

RULES:

- import: `updateTranslations`, `changeLang`
- base language is JS/TS file (not JSON)
- JSON files live in public/translations
- call `updateTranslations()` before render (await)
- use `changeLang(code, reload)` to switch

BASE STRINGS (JS/TS):

```ts
import { W } from "winnetoujs";

export default W.strings = {
  appTitle: "My App",
  home: "Home",
  buttonText: "Change Language",
};
```

INIT:

```ts
import { updateTranslations } from "winnetoujs/modules/translations";
import strings from "./translations/en-us";

await updateTranslations({
  stringsClass: strings,
  translationsPublicPath: "/translations",
});
startApp();
```

JSON (public/translations/pt-br.json):

```json
{
  "appTitle": "Meu App",
  "home": "Início",
  "buttonText": "Mudar Idioma"
}
```

USE IN CONSTRUCTO:

```ts
new $header({ title: strings.appTitle }).create("#app");
```

CHANGE LANGUAGE:

```ts
import { changeLang } from "winnetoujs/modules/translations";

changeLang("pt-br", true); // reload
```

NO RELOAD (manual re-render):

```ts
await changeLang("pt-br", false);
renderApp();
```

BEST PRACTICES:

- keep keys consistent across JSON files
- group strings by feature for large apps
- avoid hardcoded UI strings

TROUBLESHOOT:

- not loading: check translationsPublicPath and JSON location
- not updating: use reload or re-render
- base not working: export `W.strings` and await `updateTranslations()`
