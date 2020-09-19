<p align="center">
  <img src="https://raw.githubusercontent.com/cedrosdev/winnetoujs_assets/master/logo_v1_2020/logo_logomarca_slogan_transparent.png" alt="Unform" />
  
</p>
<p align="center">
  <img src="https://github.com/cedrosdev/winnetoujs_assets/blob/master/logo_v1_2020/spacer.png" />
  <img src="https://img.shields.io/npm/v/winnetoujs?color=6b2575&style=plastic" />
  <img src="https://img.shields.io/npm/l/winnetoujs?color=90449b&style=plastic" />
  <img src="https://img.shields.io/npm/dm/winnetoujs?color=cd94d5&style=plastic" />  
  <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=plastic" />
  </p>
  
  
# WinnetouJs

WinnetouJs is a javascript framework that encompasses multi solutions for creating web apps and frontend of dynamic websites.

## Why?

WinnetouJs comes for developers who love pure, root, vanilla javascript, for those who like clean code, without mixing html and javascript in a alphabet soup that at a certain level are ineligible. It comes from developers to developers. It comes from those who loves javascript for those who also loves javascript. And, after all, it comes to those who don't feel obliged to use typescript and still looking for a robust solution, which is self-complete and helps.

## How it works?

The basis of a Winnetou application are the constructos, which are html files where we write our html components - called "constructos" - and the wbr will transform them into javascript classes ready for reuse, optimized for a modern and lightweight web, without loads unnecessary.

## How to use

```javascript

import { h1 } from "./constructos/componentsTest.js";
h1({ text: "Welcome to your first WinnetouJs App" }).create("#app");

```

[To learn WinnetouJs go to the project's Wiki. Click here.](https://github.com/cedrosdev/winnetoujs/wiki)


## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

You will need **nodejs** and **npm** on your machine to develop a Winnetou application.


### Installing

After you have the latest version of the node and npm properly installed, install winnetou from npm. 

```
npm i winnetoujs
```

If you are creating a new project and node_modules folder and wbr.js don't show up, run `npm init -y` and try again.

You can add WinnetouJs to an existing project. To start a new project use winnetou scaffolding with the command below:

```
node ./node_modules/winnetoujs/build
```

The node will create the basic skeleton of a WinnetouJs web application automatically. We warn you to start a winnetoujs project in an empty folder as this process can overwrite pre-existing files.

Now install the Winnetou dependencies.

```
npm i
```

Now you will be ready to run the Winnetou engine, which will transpile your constructos, your sass and also create the bundles for production.



## Running the tests

To test your installation, run wbr.

```
node wbr
```

This will compile your constructos and your sass. Now open the index.html file and everything should be working.
WBR will also automatically initialize watchers in your code, so that any changes made to the html of the constructos are instantly available as a ready-to-use javascript class.




## Deployment

The deployment of a winnetou application is done through the webpack, but don't worry, the WBR is already equipped with everything you need, just run:

```
node wbr --webpack
```

and your winnetouBundle.min.js will now be available for use.


## I wanna dive in deep

[Start with the wiki here.](https://github.com/cedrosdev/winnetoujs/wiki)


## Contributing

Pull requests are welcome

## Authors

* **Kaue Sedrez** - *Initial work* - [GitHub](https://github.com/kauesedrez)

See also the list of [contributors](https://github.com/cedrosdev/winnetoujs/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](https://github.com/cedrosdev/winnetoujs/blob/master/LICENSE) file for details


