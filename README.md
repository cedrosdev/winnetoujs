<p align="center">
  <img src="https://raw.githubusercontent.com/cedrosdev/winnetoujs_assets/master/assets_v2_2025/official-logo-v2.png" alt="Winnetou Logo 2024" />

</p>

# WinnetouJs 3 LTS

<p>
   <img src="https://img.shields.io/npm/v/winnetoujs?color=6b2575&style=plastic" />
  <img src="https://img.shields.io/npm/l/winnetoujs?color=90449b&style=plastic" />
  <img src="https://img.shields.io/npm/dm/winnetoujs?color=cd94d5&style=plastic" />  
  <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=plastic" />
  </p>

WinnetouJs is a javascript framework that encompasses multi solutions for creating frontend web apps.

## Example

```html
<!-- commons.wcto.html -->
<winnetou>
  <div id="[[simpleText]]">{{text}}</div>
</winnetou>
```

```javascript
// app.ts
import { $simpleText } from "./commons.wcto";
new $simpleText({ text: "Hello World!" }).create("#app");
```

This will render `Hello World!` inside the element with id `app`.

## Learn

[Start with the documentation here.](https://winnetoujs.org/docs)

## Contributing

Pull requests are welcome.

## Authors

- **Pamela Sedrez** - _Initial work_ - [GitHub](https://github.com/pamydev)

## License

This project is licensed under the MIT License - see the [LICENSE.md](https://github.com/cedrosdev/winnetoujs/blob/master/LICENSE) file for details
