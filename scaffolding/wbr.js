/**
 * ==========================
 * W B R                    =
 * Winnetou Bundle Release  =
 * ==========================
 *
 * Todo:
 * Precisa ser com Promise.all para executar em paralelo
 *
 */

const fs = require("fs-extra");

// const { default: Config } = require("./win.config.js");

const path = require("path");
const recursive = require("recursive-readdir");
const htmlParser = require("node-html-parser");
const { default: Matcher } = require("node-html-parser/dist/matcher");
const beautify = require("js-beautify").js;
const escapeStringRegexp = require("escape-string-regexp");
const xml = require("xml-parse");
const sass = require("sass");
const UglifyCss = require("uglifycss");

var idList = [];

var Config;

// Inicia o programa

function fixedJson(badJSON) {
  let a = badJSON

    .replace("{", "")
    .replace("}", "")
    .replace("export default", "")
    .replace(";", "")

    .split(",")

    .filter(x => typeof x === "string" && x.trim().length > 0)

    .join(",")

    // Replace ":" with "@colon@" if it's between double-quotes
    .replace(/:\s*"([^"]*)"/g, function (match, p1) {
      return ': "' + p1.replace(/:/g, "@colon@") + '"';
    })

    // Replace ":" with "@colon@" if it's between single-quotes
    .replace(/:\s*'([^']*)'/g, function (match, p1) {
      return ': "' + p1.replace(/:/g, "@colon@") + '"';
    })

    // Add double-quotes around any tokens before the remaining ":"
    .replace(/(['"])?([a-z0-9A-Z_]+)(['"])?\s*:/g, '"$2": ')

    // Turn "@colon@" back into ":"
    .replace(/@colon@/g, ":");

  return JSON.parse(`{${a}}`);
}

fs.readFile("./win.config.js", "utf-8", (err, data) => {
  Config = fixedJson(data);
  main();

  // inicia o css
  if (Config?.css || Config?.sass) {
    mainCss();
  }
});

function l(a, b) {
  return;
  a || b ? console.log("\n============") : null;
  a ? console.dir(a) : null;
  b ? console.log(b) : null;
  a || b ? console.log("============") : null;
}

/**
 * Create Constructos class from source constructos folder.
 */
async function main() {
  const constructosPath = Config.constructosPath;

  let resultado = "";
  let constructos = [];

  recursive(constructosPath, async (err, files) => {
    recursive("./node_modules", async (err2, files2) => {
      files2 = files2
        .filter(x => x.includes("win-"))
        .filter(x => x.includes(".htm") || x.includes(".html"));

      if (files2.length > 0) {
        try {
          files = files.concat(files2);
        } catch (e) {
          console.log("e :>> ", e);
        }
      }

      for (let file in files) {
        try {
          let arquivo = files[file];

          if (typeof arquivo === "string") {
            let ext = path.parse(path.join(__dirname, arquivo)).ext;
            // apenas se for html ou htm
            if (ext == ".html" || ext == ".htm") {
              let constructoMethods = await transformarConstructo(
                arquivo
              );
              resultado += constructoMethods.method;
              constructos.push(constructoMethods.constructosList);
            }
          }
        } catch (e) {
          console.log("Winnetou error", e.message);
        }
      }

      // tradução
      let translate_;
      if (Config?.defaultLang) {
        translate_ = await translate();
      }

      let resultadoFinal = `
        import {WinnetouBase} from  "./node_modules/winnetoujs/src/_winnetouBase.js";

        /**
         * WinnetouJs Main Class
         * 
         */
        //@ts-ignore
        class _Winnetou extends WinnetouBase {
          constructor(){
            super();

            ${translate_.res}

            /**
             * Object containing all available constructos. 
             * @private */
            this.Constructos = {
              ${constructos.filter(x => x.length > 0).join(",")}
            }
          }

            ${resultado}
          
        }

        // @ts-ignore
        export const Winnetou = new _Winnetou();
        // @ts-ignore
        export const Constructos = Winnetou.Constructos;
        /**
         * Object containing all available constructos. 
        ${translate_.jsdoc}
        */
        // @ts-ignore
        export const Strings = Winnetou.strings;

    `;

      resultadoFinal = beautify(resultadoFinal, {
        indent_size: 2,
        space_in_empty_paren: true,
      });

      // agora tenho a class Constructos pronta na variável resultadoFinal
      // agora tenho que salvar o arquivo

      await fs.outputFile("./winnetou.js", resultadoFinal);

      console.log("\n\n\nConstructos Class gerado com sucesso.");
    });
  });
}

async function translate() {
  return new Promise((resolve, reject) => {
    if (!Config?.folderName) {
      console.error(
        "WinnetouJs Translation Miss Configuration Error:You have to specify the name of winnetou folder in order to use the translations;"
      );

      return reject({ err: "erro" });
    }

    if (Config.folderName === "/") Config.folderName = "";
    Config.folderName = path.join(
      __dirname,
      Config.folderName,
      "/translations"
    );

    let strings = "";
    let jsdoc = "";

    fs.readFile(
      `${Config.folderName}/${Config.defaultLang}.xml`,
      "utf-8",
      function (err, data) {
        let trad = xml.parse(data)[0].childNodes;

        trad.forEach(item => {
          if (item.tagName && item.childNodes[0]?.text) {
            strings += `/** @property ${item.childNodes[0].text.trim()} */           
            ${item.tagName}: "${item.childNodes[0].text.trim()}",
            `;

            jsdoc += `
          * @param {string} ${
            item.tagName
          } ${item.childNodes[0].text.trim()}`;
          }
        });

        let res = `
        
          /**
           * Object containing the strings taken from the translation file    
           * @private       
          */
          this.strings = {
            ${strings}
          }
        
        `;

        return resolve({ res, jsdoc });
      }
    );
  });
}

/**
 * Vai ler o arquivo html e transformar em um método js
 * que será colocado dentro da classe Constructos
 * @param  {string} arquivo caminho do arquivo
 * @returns **Promise** código js do método
 */
async function transformarConstructo(arquivo) {
  return new Promise((resolve, reject) => {
    try {
      fs.readFile(arquivo, "utf-8", function (err, data) {
        if (err) return reject(err);

        // transforma o html em método
        let dom = htmlParser.parse(data);
        let componentes = dom.querySelectorAll("winnetou");
        let retornoTotal = "";
        let constructos = [];

        Array.from(componentes).forEach(componente => {
          let descri = componente.getAttribute("description");
          let constructo = componente.innerHTML;
          let jsdoc =
            "\n\n// ========================================\n\n\n";
          jsdoc += "\n\n/**\n";
          jsdoc += `\t* ${descri || ""}\n`;
          let elementsObrigatorio = false;
          let jsdoc2 = "";

          l("descri", descri);

          // todo:
          // [ok] lógica dos ids
          // ao chamar o método da classe Constructos tem que criar o
          // id automaticamente, win-simpleDiv-1

          let id = constructo.match(/\[\[\s?(.*?)\s?\]\]/)[1];
          let pureId = id + "-win-${identifier}";

          //verifica se o id é repetido
          let verifica = idList.filter(data => data.id === id);

          if (verifica.length > 0) {
            console.log(
              `O constructo ${id} do arquivo ${arquivo} está duplicado`
            );

            console.log(
              `Arquivo original: ${verifica[0].arquivo}\n\n`
            );
            throw new Error("id-001");
          }

          idList.push({
            arquivo,
            id,
          });

          // ===========================================
          // ids replace ===============================
          // ===========================================

          // Isso aqui para retornar os ids

          var regId = /\[\[\s*?(.*?)\s*?\]\]/g;
          var matchIds = constructo.match(regId);
          var ids = "ids:{";
          matchIds = matchIds.map(item =>
            item.replace("[[", "").replace("]]", "")
          );
          matchIds = matchIds.map(
            item => item + "-win-${identifier}"
          );

          matchIds.forEach(item => {
            let nome = item.split("-win-")[0];
            ids += nome + ":`" + item + "`,";
          });

          ids += "},";

          constructo = constructo.replace(
            /\[\[\s*?(.*?)\s*?\]\]/g,
            "$1-win-${identifier}"
          );

          // ===========================================
          // elements replace ==========================
          // ===========================================

          // tenho que achar todos os elements dentro do constructo
          let regex = new RegExp("{{\\s*?(.*?)\\s*?}}", "g");

          let matches = constructo.match(regex);

          if (matches) {
            matches.forEach(match => {
              //match contem o element puro
              //match = "{{texto % Texto a ser apresentado na simpleDiv}}"

              //obtem o element => el = 'texto % pipipipopopo'
              let el = match.replace("{{", "");
              el = el.replace("}}", "");

              // verifica se tem comentario o jsdoc
              let elArr = el.split("%");

              // verifica se o element é obrigatório ou opcional
              let obrigatorio = false;
              if (elArr[0].indexOf("?") != -1) {
                // é opcional
                // quando tem o ? antes do element
                // quer dizer que o mesmo é opcional
                obrigatorio = false;
              } else {
                // é obrigatorio
                obrigatorio = true;
                elementsObrigatorio = true;
              }

              //remove o ? do element e aplica o trim
              // agora temos o element => el = 'texto'
              // e o comentario jsdoc em comentario
              el = elArr[0].replace("?", "").trim();
              let comentario = elArr[1] || "";

              // todo:
              // [ok] Comentário jsdoc

              l(el);
              l(obrigatorio ? "obrigatorio" : "opcional", comentario);

              jsdoc2 += `\t* @param {any${
                obrigatorio ? "" : "="
              }} elements.${el} ${comentario.trim()}\n`;

              // transforma o match em uma regexp aceitável
              let escapedString = escapeStringRegexp(match);

              // faz o replace no constructo
              constructo = constructo.replace(
                new RegExp(escapedString, "g"),
                "${elements." +
                  el +
                  (obrigatorio ? "" : ' || ""') +
                  "}"
              );
            });
          }

          if (elementsObrigatorio)
            jsdoc += "\t* @param {object} elements\n";
          else jsdoc += "\t* @param {object} [elements]\n";

          jsdoc += jsdoc2;

          jsdoc += "\t* @param {object} [options]\n";
          jsdoc += "\t* @param {any=} options.identifier\n";
          jsdoc += "\t* @private\n";
          jsdoc += "\t*/\n";

          // agora tenho que transformar o componente em método
          let retorno =
            jsdoc +
            id +
            " = (elements, options) => {" +
            "\n\nlet identifier = this._getIdentifier(options?options.identifier || 'notSet':'notSet');" +
            "\n\nelements = this._test(identifier,'" +
            id +
            "',`" +
            pureId +
            "`,elements);" +
            "\n\nreturn {code:`" +
            constructo +
            "`," +
            ids +
            "}}" +
            " ";

          retornoTotal += retorno;
          constructos.push(`${id}: this.${id}`);
        });

        return resolve({
          method: beautify(retornoTotal, {
            indent_size: 2,
            space_in_empty_paren: true,
          }),
          constructosList: constructos,
        });
      });
    } catch (e) {
      return reject(e.message);
    }
  });
}

let promisesCss = [];
async function mainCss() {
  if (Config.sass) {
    recursive(Config.sass, async (err, files) => {
      console.log("files :>> ", files);
      files.forEach(file => {
        promisesCss.push(transpileSass(file));
      });
      css();
    });
  }

  function css() {
    if (Config.css) {
      // vai ler o diretório do css
      recursive(Config.css, async (err, files) => {
        files.forEach(file => {
          promisesCss.push(getData(file));
        });
        exec_();
      });
    } else {
      exec_();
    }
  }
}

function exec_() {
  Promise.all(promisesCss).then(data => {
    // data contem um array com todo o meu css
    data.push(`    
    * {
    -webkit-overflow-scrolling: touch;
      }   
      .winnetou_display_none {
          display: none !important;
      }                
    `);

    let result = UglifyCss.processString(data.join("\n"));

    fs.outputFile(
      Config.out + "/bundleWinnetouStyles.min.css",
      result,
      function (err) {
        if (err) {
        }
        console.log("CSS and SASS ok");
      }
    );
  });
}

async function transpileSass(file) {
  return new Promise((resolve, reject) => {
    sass.render(
      {
        file,
      },
      function (err, result) {
        if (err) return reject(err);
        return resolve(result.css.toString());
      }
    );
  });
}

async function getData(file) {
  return new Promise((resolve, reject) => {
    fs.readFile(file, function (err, data) {
      if (err) return reject(err);
      return resolve(data.toString());
    });
  });
}
