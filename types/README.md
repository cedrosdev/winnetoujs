# WinnetouJS TypeScript Declarations

This folder contains TypeScript declaration files (.d.ts) for WinnetouJS v3.0.0.

## Usage

### Install WinnetouJS

```bash
npm install winnetoujs
```

### TypeScript Support

WinnetouJS now includes full TypeScript declarations. You can use it in your TypeScript projects with full type safety and IntelliSense support.

#### ES Modules

```typescript
// Import core functionality
import { Winnetou, W, Win } from "winnetoujs";
import { Constructos } from "winnetoujs/src/constructos";

// Import router
import { Router } from "winnetoujs/modules/router";

// Import DOM utilities
import { getElements, setHtml, addClass } from "winnetoujs/modules/select";

// Import translation utilities
import {
  updateTranslations,
  changeLang,
} from "winnetoujs/modules/translations";
```

#### CommonJS

```typescript
// Import core functionality
import Winnetou = require("winnetoujs");
const { W, Win } = Winnetou;

// Import build tools
import BundleRelease = require("winnetoujs/wbr_modules/bundleRelease");
import ConstructosParser = require("winnetoujs/wbr_modules/constructosParser");
```

#### Direct module imports

```typescript
// Import specific modules directly
import { Winnetou } from "winnetoujs/src/winnetou";
import { Router } from "winnetoujs/modules/router";
import { getElements } from "winnetoujs/modules/select";
import ColorThemes = require("winnetoujs/modules/colorThemes");
```

### Available Types

#### Core Types

- `Winnetou_` - Main WinnetouJS class
- `Constructos` - Base class for constructo components
- `WinnetouRouter_` - Router functionality

#### Utility Types

- `SelectorType` - Type for DOM selectors (string | Element | Element[])
- `MutableObject` - Type for mutable objects with mutable property
- `ConstructoOptions` - Options for constructo creation
- `RouteOptions` - Options for router configuration
- `TranslationArgs` - Arguments for translation functions
- `FileObject` - File object structure for file inputs

#### Module Exports

Each module provides proper TypeScript declarations:

- **winnetoujs/src/winnetou** - Core Winnetou functionality (Winnetou, W, Win)
- **winnetoujs/src/constructos** - Constructos base class
- **winnetoujs/modules/router** - Router functionality
- **winnetoujs/modules/select** - DOM manipulation utilities
- **winnetoujs/modules/translations** - Translation utilities
- **winnetoujs/modules/colorThemes** - Color theming utilities
- **winnetoujs/wbr_modules/bundleRelease** - Build system functionality
- **winnetoujs/wbr_modules/constructosParser** - Constructo parser

### Examples

#### Using with TypeScript

```typescript
import { Winnetou, Router } from "winnetoujs";
import { getElements, addClass } from "winnetoujs/modules/select";

// Configure routes with type safety
Router.createRoutes(
  {
    "/": () => console.log("Home page"),
    "/about": () => console.log("About page"),
    "/user/:id": (id: string) => console.log(`User ${id}`),
  },
  {
    onBack: route => console.log(`Going back to ${route}`),
    onGo: route => console.log(`Navigating to ${route}`),
  }
);

// Use mutables with type checking
Winnetou.setMutable("username", "john_doe");
const username = Winnetou.getMutable("username"); // string | null

// DOM manipulation with proper typing
const elements = getElements(".my-class"); // Element[]
addClass(elements, "active");

// Function storage with proper typing
const clickHandler = Winnetou.fx((element: HTMLElement) => {
  element.style.color = "red";
}, "this");
```

#### Build Tools Usage

```typescript
import BundleRelease = require("winnetoujs/wbr_modules/bundleRelease");
import ConstructosParser = require("winnetoujs/wbr_modules/constructosParser");

// Build configuration with type safety
const bundler = new BundleRelease({
  entryFile: ["src/app.js"],
  outputDir: "dist",
  constructosSourceFolder: "src/constructos",
  watch: true,
  production: false,
  verbose: true,
});

// Parse constructos with proper typing
const parser = new ConstructosParser({
  constructosSourceFolder: "src/constructos",
  verbose: true,
});
```

### Global Declarations

WinnetouJS also provides global declarations for browser usage:

```typescript
// These are available globally in browser environments
declare global {
  interface Window {
    Winnetou: typeof Winnetou;
    W: typeof Winnetou;
    Win: typeof Winnetou;
    Router: typeof Router;
  }
}
```

## File Structure

```
types/
├── common.d.ts           # Common types and interfaces
├── winnetou.d.ts         # Core Winnetou functionality
├── constructos.d.ts      # Constructos base class
├── router.d.ts           # Router functionality
├── select.d.ts           # DOM manipulation utilities
├── colorThemes.d.ts      # Color theming
├── translations.d.ts     # Translation utilities
├── bundleRelease.d.ts    # Build system
└── constructosParser.d.ts # Constructo parser

# Module-specific declarations
src/
├── winnetou.d.ts         # Declaration for src/winnetou.js
└── constructos.d.ts      # Declaration for src/constructos.js

modules/
├── router.d.ts           # Declaration for modules/router.js
├── select.d.ts           # Declaration for modules/select.js
├── translations.d.ts     # Declaration for modules/translations.js
└── colorThemes.d.ts      # Declaration for modules/colorThemes.js

wbr_modules/
├── bundleRelease.d.ts    # Declaration for wbr_modules/bundleRelease.js
└── constructosParser.d.ts # Declaration for wbr_modules/constructosParser.js

index.d.ts                # Main declaration file
```

## Contributing

If you find any issues with the TypeScript declarations or want to improve them, please feel free to open an issue or submit a pull request to the [WinnetouJS repository](https://github.com/cedrosdev/winnetoujs).
