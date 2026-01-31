---
applyTo: "**"
---

# Winnetou.js Server-Side Rendering (SSR) Instructions

Use these instructions when use WinnetouJs in a server-side rendering (SSR) context.

## 1. Overview

Winnetou.js is primarily designed for client-side rendering, but it can be adapted for server-side rendering scenarios. This document outlines the necessary steps and considerations for implementing Winnetou.js in an SSR environment. Server-side rendering with WinnetouJs works by compiling your constructos in a Node.js environment, where they can be used to generate HTML strings that are sent to the client.

### CommonJS Format

Use the `-n` or `--node` flag to compile for Node.js using CommonJS format:

```bash
wbr -b -n -p
```

This generates code using `module.exports` and `require()`.

### ES Module Format

Use the `-e` or `--node-esm` flag to compile for Node.js using ES Module format:

```bash
wbr -b -e -p
```

This generates code using `export` and `import` statements.

### Compiler Flags Explained

- `-b`: Bundle the application
- `-n`: Compile for Node.js environment (CommonJS)
- `-e`: Compile for Node.js environment (ESM)
- `-p`: Production mode (minified and optimized)

## Server Configuration

### TypeScript/JavaScript Configuration

Your server's `tsconfig.json` or `jsconfig.json` must include `allowJs: true` to import the compiled `.wcto.js` files:

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

The `allowJs` option is essential for importing WinnetouJs constructos in your Node.js server.

## Project Structure

Create a dedicated folder for your SSR components, typically named `winnetou-ssr`:

```
your-project/
├── winnetou-ssr/
│   ├── src/
│   │   ├── app.ts
│   │   ├── docs-template.wcto.html
│   │   └── components.wcto.html
│   ├── dist/
│   │   └── app.js
│   ├── win.config.json
│   └── package.json
├── server/
│   ├── index.js
│   └── views/
├── package.json
└── README.md
```

## Setting Up SSR

### Step 1: Create WinnetouJs SSR Project

Inside the `winnetou-ssr` folder, set up a standard WinnetouJs project with your constructos.

Create `win.config.json`:

```json
{
  "apps": ["./src/app.ts"],
  "outputDir": "./dist",
  "constructosSourceFolder": "./src"
}
```

### Step 2: Create Constructos

Create your constructos in `.wcto.html` files as usual:

**docs-template.wcto.html:**

```html
<winnetou description="Main HTML template">
  <html id="[[html]]" lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>{{metaTitle:string}}</title>
      <meta name="description" content="{{metaDescription:string}}" />
      <link rel="canonical" href="{{canonicalPath:string}}" />
    </head>
    <body>
      {{navbar:string}}
      <main>{{content:string}}</main>
      {{footer:string}}
    </body>
  </html>
</winnetou>

<winnetou description="Navigation bar">
  <nav id="[[navbar]]" class="navbar">{{menu:string}}</nav>
</winnetou>

<winnetou description="Menu item">
  <a id="[[menuItem]]" href="{{href:string}}" class="{{class?:string}}">
    {{text:string}}
  </a>
</winnetou>

<winnetou description="Footer component">
  <footer id="[[footer]]" class="footer">
    <p>© {{currentYear:number}} All rights reserved</p>
    <a href="{{editLink:string}}" target="_blank">
      {{iconExternalLink:string}} Edit this page
    </a>
  </footer>
</winnetou>
```

### Step 3: Export Constructos and SSR Utilities

Create `app.ts` to import and export your constructos along with SSR utilities:

```typescript
import {
  joinConstructos,
  escapeHTML,
  loadPartial,
} from "winnetoujs/modules/ssr";

import { $html, $navbar, $menuItem, $footer } from "./docs-template.wcto";

export {
  joinConstructos,
  escapeHTML,
  loadPartial,
  $html,
  $navbar,
  $menuItem,
  $footer,
};
```

### Step 4: Compile for Node.js

Compile your WinnetouJs project for Node.js:

```bash
cd winnetou-ssr
wbr -b -n -p
```

Or for ESM:

```bash
wbr -b -e -p
```

## Using SSR in Your Server

### Example with Express.js (CommonJS)

```javascript
const express = require("express");
const path = require("path");

// Import compiled WinnetouJs constructos
const {
  joinConstructos,
  loadPartial,
  escapeHTML,
  $html,
  $navbar,
  $menuItem,
  $footer,
} = require("./winnetou-ssr/dist/app.js");

const app = express();

// Serve static files
app.use(express.static("public"));

// Home route
app.get("/", (req, res) => {
  res.send(loadPartial("./views/home/home.html"));
});

// Documentation route
app.get("/docs/:route", async (req, res) => {
  const routeName = req.params.route;

  // Load content from file
  const content = loadPartial(
    path.join(__dirname, `./views/docs/${routeName}.html`),
  );

  // Check if file exists
  if (!content) {
    return res.status(404).send("Not found");
  }

  // Build menu
  const menuItems = [
    { href: "/docs/getting-started", text: "Getting Started" },
    { href: "/docs/constructos", text: "Constructos" },
    { href: "/docs/routing", text: "Routing" },
  ];

  const menuHTML = menuItems
    .map((item) =>
      new $menuItem({
        href: item.href,
        text: item.text,
        class: item.href.includes(routeName) ? "active" : "",
      }).constructoString(),
    )
    .join("");

  const navbar = new $navbar({
    menu: menuHTML,
  }).constructoString();

  const footer = new $footer({
    currentYear: new Date().getFullYear(),
    editLink: `https://github.com/yourrepo/edit/main/views/docs/${routeName}.html`,
    iconExternalLink: "<svg>...</svg>",
  }).constructoString();

  // Generate complete HTML
  const html = new $html({
    content,
    canonicalPath: `/docs/${routeName}`,
    metaDescription: content.substring(0, 155).replace(/\n/g, " "),
    metaTitle: `${routeName} - Documentation`,
    navbar,
    footer,
  }).constructoString();

  res.send(html);
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
```

### Example with Express.js (ESM)

```javascript
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import compiled WinnetouJs constructos
import {
  joinConstructos,
  loadPartial,
  escapeHTML,
  $html,
  $navbar,
  $footer,
} from "./winnetou-ssr/dist/app.js";

const app = express();

app.get("/docs/:route", async (req, res) => {
  const content = loadPartial(
    path.join(__dirname, `./views/docs/${req.params.route}.html`),
  );

  const html = new $html({
    content,
    metaTitle: `${req.params.route} - Docs`,
    metaDescription: "Documentation page",
    canonicalPath: `/docs/${req.params.route}`,
    navbar: new $navbar({ menu: "..." }).constructoString(),
    footer: new $footer({ currentYear: 2024 }).constructoString(),
  }).constructoString();

  res.send(html);
});

app.listen(3000);
```
