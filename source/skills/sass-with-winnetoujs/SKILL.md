---
name: sass-with-winnetoujs
description: Guide for using Sass with WinnetouJs constructos. Use this skill to write modular, maintainable styles in your Winnetou.js projects.
---

RULES:

- sass partials use `_name.scss`
- co-locate `_component.scss` next to `.wcto.html`
- main entry: `sass/main.scss`
- compiler runs in background; do not ask user to run it
- output CSS in `dist/css`

SCRIPTS (reference only):

```json
{
  "scripts": {
    "sass:dev": "sass --embed-sources --watch --style expanded sass/main.scss:dist/css/main.css --load-path='./src'",
    "sass:prod": "sass sass/main.scss:dist/css/main.min.css --style compressed --no-source-map --quiet --load-path='./src'"
  }
}
```

STRUCTURE:

```
src/
  cards/
    cards.wcto.html
    _cards.scss
sass/
  main.scss
  _variables.scss
  _mixins.scss
```

MAIN ENTRY:

```scss
@import "variables";
@import "mixins";
@import "cards/cards";
```

CO-LOCATED PARTIAL:

```scss
/* src/cards/_cards.scss */
@import "variables";

.card {
  padding: $spacing-md;
  &__title {
    color: $primary-color;
  }
}
```

CONSTRUCTO CLASSES:

```html
<winnetou>
  <div id="[[card]]" class="card">
    <h3 class="card__title">{{title:string}}</h3>
  </div>
</winnetou>
```

SASS FEATURES (small):

```scss
$primary-color: #3498db;
@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}
.btn {
  @include flex-center;
}
```

BEST PRACTICES:

- use BEM (`block__element--modifier`)
- keep nesting shallow (max 3-4)
- use CSS vars for dynamic theming
- import partials only in `sass/main.scss`

TROUBLESHOOT:

- styles not applying: ensure CSS linked in HTML
- import errors: verify `--load-path='./src'` and `_` prefix
- class mismatch: keep class names identical
