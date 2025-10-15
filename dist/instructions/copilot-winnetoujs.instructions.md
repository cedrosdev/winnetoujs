---
applyTo: "**"
---

# WinnetouJs Instructions

Use this guide to create WinnetouJs web applications.

## How it works

When WinnetouJs is installed, it provides a WBR.js file which is responsible to transpile wcto.html files into wcto.js files. User will write html components (called `constructos`) inside wcto.html file and WBR will compile it into reusable js classes which can be imported inside js/ts apps.

## Starting up a WinnetouJs WEB Application

**Ask user if he wants you to help him to create a basic WinnetouJs scaffolding project.**

To help user to create basic WinnetouJs skeleton project, do the following:

- add win.config.js
- add rules in settings workspace
- create jsconfig.js
- create basic folder structure
- add package.json scripts

\*\*When finish the above tasks, ask user if he will use sass, if yes, add this config in `package.json` as well:

```json
    "sass:dev": "sass --embed-sources --watch --style expanded sass/main.scss:dist/css/main.css  --load-path='./src'",
    "sass:prod": "sass sass/main.scss:dist/css/main.min.css --style compressed --no-source-map --quiet  --load-path='./src'"
```

## Installation

`npm i winnetoujs`

## Setting Up

### Create a `win.config.json` file in root folder with these params:

```json
{
  "apps": ["./src/app.ts"],
  "outputDir": "./dist/js",
  "constructosSourceFolder": "./src"
}
```

- apps: Array of strings, will be transpiled by esbuild. Supports js and ts files;
- outputDir: String, the location of output bundles;
- constructosSourceFolder: String, locations where wbr will search for wcto.html files.

Attention: These params will be used only by WBR to compile constructos and bundle code. None of these instructions will be used inside js/ts app files.

### Workspace settings

Add these config to workspace settings in order to hide wcto.js generated files:

```json
"settings": {
    "search.exclude": {
        "**/node_modules": true,
        "**/*.wcto.js": true
    },
    "files.exclude": {
        "**/*.wcto.js": true
   }
}
```

### jsconfig.json

To obtain auto completions for constructos use this config in jsconfig.json (put it in root):

```json
{
  "compilerOptions": {
    "module": "nodenext",
    "target": "es2022",
    "checkJs": true,
    "allowJs": true,
    "paths": {
      "@libs/*": ["./libs/*"]
    }
  },
  "exclude": ["node_modules", "**/node_modules/*"]
}
```

- try to use paths whenever possible to keep code clean:

```javascript
import { someLib } from "@libs/myLib";
```

### NPM scripts

To maximize performance when compiling, add these settings to `package.json` file:

```json
"scripts": {
    "wbr:prod": "node wbr -b -p",
    "wbr:dev": "node wbr -b -v -w",
}
```

- b: to bundle release
- p: production mode
- w: watch mode

### `<script>` tag

- when add compiled winnetoujs bundle into html index file, use `type="module"`

```html
<script type="module" src="/dist/app.winnetouBundle.min.js"></script>
```

## Constructos

- Create file with wcto.html extension to add constructos.
- The wcto.js compiled files will be generated aside of wcto.html ones.
- Put all similar constructos in one single html file.
- Group then in folders, use this files structure:

```
application/
├── src/
│   ├── app.ts
│   ├── common-constructos/
│   │   ├── common.wcto.html
│   │   ├── _common.scss
│   │   └── common.ts
├── libs/
├── sass/
│   ├── main.scss
├── package.json
├── wbr.config.json
├── wbr.js
└── README.md
```

### Constructos html structure

- Every constructo must be created inside `<winnetou>` tags, like:

```html
<winnetou>
  <div id="[[myDiv]]">{{content}}</div>
</winnetou>
```

Attention: Do not duplicate <winnetou> tag, like `<winnetou></winnetou>... rest of code</winnetou>`, it is a bad pattern. Avoid it. Winnetou tag must be: `<winnetou> ...content </winnetou>`.

- Winnetou tags can have description attr to describe constructo:

```html
<winnetou description="A price card">...content</winnetou>
```

### Constructos ID

- Ids must be inside double square-brackets `[[id]]`.
- When a constructo html file is compiled, the id of constructo will be the name of class when it is imported into code, like:

```html
<winnetou>
  <div id="[[myFirstDiv]]"></div>
</winnetou>
```

Will be compiled to `$myFirstDiv`, like:

```javascript
import { $myFirstDiv } from "./commonConstructos.wcto";
new $myFirstDiv().create("#app");
```

- ids will be returned by `create` method, like:

```javascript
const myConstructo = new $myFirstDiv().create("#app");
console.log(myConstructo.ids.myFirstDiv); // myFirstDiv-win-1
```

When constructos are placed in html, WinnetouJs will create a string id to it, with this formula: `originalId-win-randomNumber`. User can override randomNumber with `identifier` option:

```javascript
let left = new $myDiv({}, { identifier: "leftDiv" }).create("#app");
console.log(left.ids.myDiv); // "myDiv-win-leftDiv"
```

This is useful for DOM manipulations.

- constructos can have many ids inside it, first id will be constructo class name, all ids will be returned in create method:

```html
<winnetou>
  <div id="[[mainId]]">
    <span id="[[text1]]">{{title}}</span>
    <span id="[[text2]]">{{text}}</span>
  </div>
</winnetou>
```

```javascript
const card = $mainId().create("#app").ids;
document.getElementById(card.text1).style.color = "blue";
```

### Constructos props

- To create props, use double-brackets `{{prop}}`.
- Props can be optional, use ? token to do it: `{{color?}}`
- Props can have typescript/jsdoc types, use : token to do it: `{{color:string}}`
- Props can have a description, use parenthesis to do it: `{{color(A RGB value)}}`
- All options can be mixed, like: `{{color(A rgb value)?:string}}`

Example of constructos with props:

```html
<winnetou description="Personalized title string">
  <h1 id="[[personalizedTitle]]" class="{{class:'normal'|'danger'}}">
    {{text(The text of title):string}}
  </h1>
</winnetou>
```

```javascript
import { $personalizedTitle } from "./titles.wcto";
new $personalizedTitle({
  class: "danger",
  text: "This is a title",
}).create("#app");
```

### Constructos Methods

- Constructos has two methods: `create()` and `constructoString()`.

#### create(id:string)

- Used to attach constructo to DOM. User must provide a string id as param: `"#app"`.
- options can be provided: `clear:true` to clear html node before insert new constructo in it and `reverse:true` to attach constructo in top of html node.

```javascript
new $title({ text: "Simple title" }).create("#titles", {
  clear: true,
  reverse: true,
});
```

#### constructoString()

- When you need to put a constructo inside another constructo, use constructoString:

```javascript
import { $div, $div2 } from "./components.wcto";
new $div({
  content: new $div2({ content: "inner" }).constructoString(),
}).create("#app");
```

## Mutables

Mutables are localstorage variables that can change constructos state.

- Use `W.setMutable("name","value")` to create a mutable
- Use `W.getMutable("name")` to retrieve a mutable value
- Use `W.setMutableNotPersistent("name","value")` to create mutables that will be not stored in client
- Use `const name = W.initMutable("value")` to start a mutable that will be not stored in client.

```javascript
import { W } from "winnetoujs";

W.setMutable("user", "john");
console.log(W.getMutable("user")); // john

const age = W.initMutable("18");
console.log(W.getMutable(age)); // 18

W.setMutable("user", "ana");
console.log(W.getMutable("user")); // ana

W.setMutableNotPersistent(age, "20");
console.log(W.getMutable(age)); // 20
```

### Updating constructos with mutables

- to use a mutable in a constructo prop do `{mutable:"mutable_name"}`:

```javascript
W.setMutable("title", "Hello World!");
new $title({
  text: { mutable: "title" },
}).create("#app");
```

- Use setMutable again to auto update constructo:

```javascript
W.setMutable("title", "It's another title!"); // constructo will auto update it state to display new title
```

Another example:

```javascript
const address = W.initMutable("loading...");
new $AddrCard({
  addr: { mutable: address },
}).create("#app");
// simulate a fetch req:
const updatedAddr = await get("/api/addr");
W.setMutableNotPersistent(address, updatedAddr);
```

## FX

- Use `W.fx()` to provide action to constructos, like `onclick` and `onchange`.

```html
<winnetou>
  <button id="[[myBtn]]" onclick="{{onclick}}">Click me</button>
</winnetou>
```

```javascript
new $myBtn({
  onclick: W.fx(() => {
    console.log("button pressed");
  }),
}).create("#app");
```

- fx do not receive default event. To refer to component itself, use "this" as param:

```javascript
new $myInput({
  onchange: W.fx(self => {
    self.style.color = "blue";
  }, "this"),
}).create("#app");
```

- fx can receive many args, like:

```javascript
new $myBtn({
  onclick: W.fx(
    (self, other) => {
      self.style.color = "red";
      document.getElementById(other).style.color = "blue";
    },
    "this",
    "app"
  ),
}).create("#app");
```

- Use `"this"` when refers to constructo itself;

## Translations

Winnetou provides a module for internationalization.

### Setting up translations

Create your original language file as a js/ts file (not JSON) to enable Go To Reference functionality:

```javascript
import { W } from "winnetoujs";
export default W.strings = {
  title: "Hello Strings!",
  buttonText: "Change Lang",
  buttonText2: "Original Lang",
};
```

This approach allows using F12 to navigate directly to strings and apply changes, with reverse F12 also working.

### Loading translations

Use the new `updateTranslations` method where `translationsPublicPath` is declared directly within the method:

```javascript
import { updateTranslations } from "winnetoujs/modules/translations";
import strings from "./en-us";

updateTranslations({
  stringsClass: strings,
  translationsPublicPath: "/app/translations",
}).then(() => {
  startApp();
});

async function startApp() {
  new $myDiv({
    text: strings.title,
  }).create("#app");
}
```

### Translation files structure

- Place JSON translation files in `translationsPublicPath` folder.
- Do not include the original language JSON file in `translationsPublicPath` to clear `localStorage` and load strings from winnetou.js itself for better efficiency

- A example of `pt-br.json` translation file:

```json
{
  "title": "Olá Strings!",
  "buttonText": "Alterar idioma",
  "buttonText2": "Idioma original"
}
```

### Changing app language

- Use `changeLang("pt-br", true);` to change language, provide the name of json file as param.

```javascript
import {
  changeLang,
  updateTranslations,
} from "winnetoujs/modules/translations";

changeLang("Japanese", true); // if you have Japanese.json file
```

To changeLang work, it must have a file called `spanish.json` inside `translationsPublicPath` with all string tokens.

- the second parameter is to reload page after language update.

## WinnetouJs Router

WinnetouJs provides it own router system. Use it.

- create a separated file called `router.ts` like example below:

```javascript
import { Router } from "winnetoujs/modules/router";
export class MyRouter {
  constructor() {
    this.createRoutes();
  }
  private routes = {};
  public methods = {
    home: {
      go: () => Router.navigate("/home"),
      set: () => {
        this.routes["/home"] = () => {
          console.log("home route called");
        };
      },
    },
    settings: {
      go: () => Router.navigate("/settings"),
      set: () => {
        this.routes["/settings"] = () => {
          console.log("settings route called");
        };
      },
    },
  };
  private createRoutes() {
    Object.keys(this.methods).forEach(key => {
      this.methods[key].set();
    });
    Router.createRoutes(this.routes, {
      onGo(route) {
        console.log("onGo", route);
      },
      onBack(route) {
        console.log("onBack", route);
      },
    });
  }
}
```

- `onGo` and `onBack` will be called after router function. `route` param will return the route called.
- Use router.ts like example below:

```typescript
import { W } from "winnetoujs";
import { $div2 } from "./components.wcto";
import { MyRouter } from "./router";
const myRouter: MyRouter = new MyRouter();
new $div2({
  content: "home",
  onclick: W.fx(() => {
    myRouter.methods.home.go();
  }),
}).create("#app");
new $div2({
  content: "settings",
  onclick: W.fx(() => {
    myRouter.methods.settings.go();
  }),
}).create("#app");
```

## Color Themes

WinnetouJs provides a module for color theming.

- To use it, css (or scss) files must be a `:root` property, like:

```css
:root {
  --primary: #f00;
  --secondary: #0f0;
}
body,
html {
  background: var(--primary);
  color: var(--secondary);
  font-size: 30px;
  padding: 100px;
}
```

- import ColorThemes into a js/ts file:

```javascript
import { ColorThemes } from "winnetoujs/modules/colorThemes";
```

- Use `applySavedTheme()` method at application startup to always apply theme:

```javascript
ColorThemes.applySavedTheme();
```

- Create new themes using `newTheme` method:

```javascript
function darkTheme() {
  ColorThemes.newTheme({
    "--primary": "#000",
    "--secondary": "#00f",
  });
}
```

# WinnetouJs Server Side Rendering (SSR)

WinnetouJs provides a module for server side rendering.

## WBR options for SSR

`-n, --node` to compile for node environment in commonjs format

`-e, --node-esm` to compile for node environment in esm format

## Server tsconfig/jsconfig

Do not forget to allowJs in tsconfig/jsconfig file, it's important to import wcto.js files in node server:

```json
{
  "compilerOptions": {
    "module": "nodenext",
    "target": "es2022",
    "checkJs": true,
    "allowJs": true,
    "paths": {
      "@libs/*": ["./libs/*"]
    }
  },
  "exclude": ["node_modules", "**/node_modules/*"]
}
```

## Concept

Create a winnetou-ssr folder and create a standard winnetoujs project in it. `app.ts` will receive the constructos and export it in order to be used by node server.

Node server will import the constructos compiled in app.js dist file and use it to render html in server side.

```javascript
import {
  joinConstructos,
  escapeHTML,
  loadPartial,
} from "winnetoujs/modules/ssr";

import {
  $html,
  $navbar,
  $menuItem,
  $menuTitle,
  $footer,
  $searchCard,
} from "./docs-template.wcto";

export {
  joinConstructos,
  escapeHTML,
  loadPartial,
  $searchCard,
  $html,
  $navbar,
  $menuItem,
  $menuTitle,
  $footer,
};
```

Then compile it using:
`wbr -b -n -p`

and use it in node server:

```javascript
const {
  joinConstructos,
  loadPartial,
  $html,
  $navbar,
} = require("./winnetou-ssr/dist/app.js");
// ...
app.get("/", (req, res) => {
  res.send(loadPartial("./Views/home/home.html"));
});
// ...
app.get("/docs/:route", async (req, res) => {
  let menu = await getMenu();
  let fileFound = false;

  // verify if route exists
  // if not, return 404
  for (const folder of menu) {
    for (const file of folder.files) {
      if (file.name === req.params.route) {
        fileFound = true;

        let renderedMenu = await renderMenu(folder.folder, file.name);

        let navbar = new $navbar({
          menu: renderedMenu.ssr,
        }).constructoString();

        const content = loadPartial(
          path.join(__dirname, "../Views/docs/" + req.params.route + ".ejs")
        );

        let html = new $html({
          content,
          canonicalPath: "/docs/" + req.params.route,
          metaDescription: removeHTMLTags(content.substring(0, 155)).replace(
            /\n/g,
            " "
          ),
          metaTitle: file.name + " - WinnetouJs",
          title: "Documentation - " + file.name,
          folder: folder.folder,
          menu: renderedMenu.ssr,
          navbar,
          path: file.displayName,
          footer: new $footer({
            currentYear: new Date().getFullYear(),
            editLink: file.url,
            iconArrowRight: ArrowRight,
            iconExternalLink: ExternalLink,
            nextLink: renderedMenu.next ?? "/docsf",
            nextText:
              renderedMenu.next?.replace("/docs/", "").replace(/-/g, " ") ??
              "Back to start",
          }).constructoString(),
        }).constructoString();

        return res.send(html);
      }
    }
  }

  if (!fileFound) {
    return res.status(404).send("Not found");
  }
});
```

## loadPartial

- Use `loadPartial("path/to/file.html")` to load a html file from server side. It can parse any type of file, like ejs, hbs, txt, etc.

You could use to load a html template file and put it inside a constructo:

```javascript
let content = loadPartial("./Views/home/home.html");
let html = new $html({
  content,
  // other props...
}).constructoString();
```

## escapeHTML

- Use `escapeHTML("<div>test</div>")` to escape html tags to display as text in browser. It will return `&lt;div&gt;test&lt;/div&gt;`.

## joinConstructos

The `joinConstructos(...parts)` function flattens and joins multiple parts into a single string, which is particularly useful for combining constructos or HTML fragments in server-side rendering scenarios.

- Use `joinConstructos(part1, part2, ...)` to join many parts into a single string.

```javascript
let combinedHTML = joinConstructos(
  new $header({ title: "Welcome" }).constructoString(),
  new $content({ text: "This is the main content." }).constructoString(),
  new $footer({ year: 2024 }).constructoString()
);
res.send(combinedHTML);
```
