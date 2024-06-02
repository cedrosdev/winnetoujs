<p align="center">
  <img src="https://raw.githubusercontent.com/cedrosdev/winnetoujs_assets/master/logo_v1_2020/winnetoujs-official-logo-2024-framework-javascript-web-development.png" alt="Winnetou Logo 2024" />

</p>

# WinnetouJs

<p>
   <img src="https://img.shields.io/npm/v/winnetoujs?color=6b2575&style=plastic" />
  <img src="https://img.shields.io/npm/l/winnetoujs?color=90449b&style=plastic" />
  <img src="https://img.shields.io/npm/dm/winnetoujs?color=cd94d5&style=plastic" />  
  <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=plastic" />
  </p>

WinnetouJs is a javascript framework that encompasses multi solutions for creating web apps frontend.

## Why?

WinnetouJs comes for developers who love pure, root, vanilla javascript, for those who like clean code, without mixing html and javascript that at a certain level are ineligible. It comes from developers to developers. It comes from those who loves javascript for those who also loves javascript. And, after all, it comes to those who don't feel obliged to use typescript and still looking for a robust solution.

## How it works?

The basis of a Winnetou application are the constructos, which are html files where we write our html components - called "constructos" - and then wbr will transform them into javascript code ready for reuse, optimized for a modern and lightweight web.

## How to use

```javascript
import { h1 } from "./constructos/componentsTest.js";
h1({ text: "Welcome to your first WinnetouJs App" }).create("#app");
```

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

You will need **nodejs** and **npm** on your machine to develop a Winnetou application.

### Installing

After you have the latest version of the node and npm properly installed, install winnetou from npm.

```
npm install --save-dev winnetoujs
```

If you are creating a new project and node_modules folder and wbr.js don't show up, run `npm init -y` and try again.

You can add WinnetouJs to an existing project.

To start a new project use winnetou's scaffolding with the command below:

```
node scaffolding
```

The node will create the basic skeleton of a WinnetouJs web application automatically. We warn you to start a winnetoujs project in an empty folder as this process can overwrite pre-existing files.

Now you will be ready to run the Winnetou engine, which will transpile your constructos, your sass and also create the bundles for production.

## Running the tests

To test your installation, run wbr.

```
node wbr
```

This will compile your constructos and your sass. Now open the index.html file and everything should be working.
WBR will also automatically initialize watchers in your code, so that any changes made to the html of the constructos are instantly available as a ready-to-use javascript class.

## Deployment

The deployment of a Winnetou application is done through the webpack, but don't worry, the WBR is already equipped with everything you need, just run:

```
node wbr --bundleRelease
```

and your winnetouBundle.min.js will now be available for use.

## I wanna dive in deep

[Start with the documentation here.](https://winnetoujs.org/docs)

## Contributing

Pull requests are welcome

## Authors

- **Pamela Sedrez** - _Initial work_ - [GitHub](https://github.com/kauesedrez)

See also the list of [contributors](https://github.com/cedrosdev/winnetoujs/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](https://github.com/cedrosdev/winnetoujs/blob/master/LICENSE) file for details
