const recursive = require("recursive-readdir");
const fs = require("fs");
const path = require("path");
const htmlParser = require("node-html-parser");
const escapeStringRegexp = require("escape-string-regexp");
const beautify = require("js-beautify").js;

/**
 * Compile wcto.html files to wcto.js files.
 */
module.exports = class ConstructosParser {
  /**
   * Creates an instance of ConstructosParser
   * @param {Object} args - Configuration arguments
   * @param {string} args.constructosSourceFolder - The source folder for Constructos files
   * @param {boolean} args.verbose - Whether to enable verbose output
   */
  constructor(args) {
    this.constructosSourceFolder = args.constructosSourceFolder;
    this.verbose = args.verbose || false;
    this.promisesConstructos = new Array();
    this.idList = new Array();
  }

  async parse() {
    // Parsing logic here
    // read src folder to find all wcto.html files
    // convert them to wcto.js files
    // and write then to same folder
    const files = await recursive(this.constructosSourceFolder);
    // console.log(files);
    files.forEach(file => {
      if (file.endsWith(".wcto.html") || file.endsWith(".wcto.htm")) {
        if (this.verbose) {
          console.log("Parsing constructo file:", file);
        }
        this.promisesConstructos.push(this.transpileConstructo(file));
      }
    });
    await Promise.all(this.promisesConstructos);
    if (this.verbose) {
      console.log(
        "\x1b[34m" +
          `Parsed ${this.promisesConstructos.length} constructo files successfully.` +
          "\x1b[0m"
      );
    }
    return true;
  }

  async transpileConstructo(filePath) {
    return new Promise((resolve, reject) => {
      try {
        fs.readFile(filePath, "utf8", (err, data) => {
          let dom = htmlParser.parse(data);
          let components = dom.querySelectorAll("winnetou");
          let finalReturn = "";
          let constructos = [];

          Array.from(components).forEach(async component => {
            let descri = component.getAttribute("description");
            let constructo = component.innerHTML;
            let jsdoc = "\n\n// ========================================";
            jsdoc += "\n/**\n";
            jsdoc += `\t* ${descri || ""}\n`;

            let requiredElement = false;
            let hasPropElements = false;
            let jsdoc2 = "";
            let id;
            try {
              const match = constructo.match(/\[\[\s?(.*?)\s?\]\]/);
              if (match) id = match[1];
              else {
                console.error(
                  "\x1b[31m" +
                    `Error: Constructo ID not found in ${filePath}. Please ensure it is defined as [[id]].` +
                    "\x1b[0m"
                );
                return;
              }
            } catch (e) {
              console.error(`Error: Failed to parse ${filePath}.`);
              return;
            }
            let pureId = id + "-win-${this.identifier}";
            let verify = this.idList.filter(data => data.id === id);
            if (verify.length > 0) {
              console.error(
                `Error: Duplicate Constructo ID found in ${filePath}.`
              );
            }
            this.idList.push({ file: filePath, id });

            // Gather all [[id]] for ids object in output
            let regId = /\[\[\s*?(.*?)\s*?\]\]/g;
            let matchIds = constructo.match(regId) || [];
            let idsObj = "";
            if (matchIds.length) {
              idsObj = "ids: {";
              // @ts-ignore
              matchIds = matchIds.map(item =>
                item.replace("[[", "").replace("]]", "")
              );
              matchIds.forEach(item => {
                idsObj += `${item}: \`${item}-win-\${this.identifier}\`,`;
              });
              idsObj += "},";
            } else {
              idsObj = "";
            }

            // Replace [[id]] with template strings
            constructo = constructo.replace(
              /\[\[\s*?(.*?)\s*?\]\]/g,
              "$1-win-${this.identifier}"
            );

            // Parse {{prop}} and {{prop%comment}}
            let regex = new RegExp("{{\\s*?(.*?)\\s*?}}", "g");
            let matches = constructo.match(regex);
            let propNames = [];
            if (matches) {
              hasPropElements = true;
              matches.forEach(async match => {
                let el = match.replace("{{", "").replace("}}", "");
                let elArr = el.split("%");
                let required = elArr[0].indexOf("?") === -1;
                let propName = elArr[0].replace("?", "").trim();
                propNames.push(propName);
                let commentary = elArr[1] || "";
                jsdoc2 += `\t* @param {any} elements.${propName}  ${commentary.trim()}\n`;
                let escapedString = escapeStringRegexp(match);
                // Use prop access from "props" (which is digestedPropsToString in code)
                constructo = constructo.replace(
                  new RegExp(escapedString, "g"),
                  `\${props?.${propName}}`
                );
              });
            }
            if (hasPropElements) jsdoc += "\t* @param {object} elements\n";
            jsdoc += jsdoc2;
            jsdoc += "\t* @param {object} [options]\n";
            jsdoc += "\t* @param {string} [options.identifier]\n";
            jsdoc += "\t*/\n";

            // Build the class
            let className = `$${id}`;
            let classStr = this.generateClassString(
              jsdoc,
              className,
              id,
              constructo,
              idsObj
            );

            finalReturn += classStr;
          });

          //   new Extension().sendToExtension({
          //     socket: this.globalSocket,
          //     type: "file",
          //     payload: path.basename(filePath),
          //   });
          const finalResult = beautify(finalReturn, {
            indent_size: 1,
            space_in_empty_paren: true,
          });
          const out = beautify(
            `
            import {Constructos} from "winnetoujs/src/constructos.js";
            \n\n
            ${finalReturn}
          `,
            {
              indent_size: 1,
              space_in_empty_paren: true,
              preserve_newlines: false,
              end_with_newline: true,
              max_preserve_newlines: 1,
              wrap_line_length: 50,
              eol: "\n",
              indent_with_tabs: false,
              space_after_anon_function: true,
              space_after_named_function: true,
              space_before_conditional: true,
              space_in_paren: false,
            }
          );
          let fileName = path.parse(filePath).name;
          const dir = path.parse(filePath).dir;
          let pathOut = path.join(dir, `${fileName}.js`);
          fs.writeFile(pathOut, out, "utf8", err => {
            if (err) {
              console.error(`Error writing file ${pathOut}:`, err);
            }
            if (this.verbose) {
              console.log(
                `Constructo file ${fileName}.js created successfully in ${dir}.`
              );
            }
            resolve(true);
          });
        });
      } catch (e) {
        return reject(e.message);
      }
    });
  }

  /**
   * Generate the class string template for a constructo component
   * @param {string} jsdoc - The JSDoc comment string for the class
   * @param {string} className - The name of the class to generate
   * @param {string} id - The constructo ID
   * @param {string} constructo - The HTML template content
   * @param {string} idsObj - The IDs object string for the create method return
   * @returns {string} The complete class string
   * @private
   */
  generateClassString(jsdoc, className, id, constructo, idsObj) {
    return `
    export class ${className} extends Constructos {
      ${jsdoc}
  constructor(elements, options) {
    super();
    /**@protected */
    this.identifier = this._getIdentifier(
      options ? options.identifier || "notSet" : "notSet"
    );
    const digestedPropsToString = this._mutableToString(elements);

    /**@protected */
    this.component = this.code(digestedPropsToString);

    this._saveUsingMutable(
      \`${id}-win-\${this.identifier}\`,
      elements,
      options,
      ${className}
    );
  }

  /**
   * Generate the HTML code for this constructo
   * @param {*} props - The properties object containing all prop values
   * @returns {string} The HTML template string with interpolated values
   * @protected
   */
  code(props) {
    return \`${constructo}\`;
  }

  /**
   * Create Winnetou Constructo
   * @param  {object|string} output The node or list of nodes where the component will be created
   * @param  {object} [options] Options to control how the construct is inserted. Optional.
   * @param  {boolean} [options.clear] Clean the node before inserting the construct
   * @param  {boolean} [options.reverse] Place the construct in front of other constructs
   * @param {object} [options.vdom] Winnetou.vdom() fragment
   * @param {boolean} [options.replace] Replace a constructo
   */
  create(output, options) {
    this.attachToDOM(this.component, output, options);
    return {
      ${idsObj}
    };
  }

  /**
   * Get the constructo as a string
   * @returns {string} The component HTML string
   */
  constructoString() {
    return this.component;
  }
}
`;
  }
};
