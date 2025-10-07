import recursive from "recursive-readdir";
import * as fs from "fs";
import * as path from "path";
import { parse as htmlParser, HTMLElement } from "node-html-parser";
import escapeStringRegexp from "escape-string-regexp";
import { js as beautify } from "js-beautify";

/**
 * Configuration interface for ConstructosParser
 */
interface ConstructosParserConfig {
  constructosSourceFolder: string;
  verbose?: boolean;
}

/**
 * Interface for ID list items
 */
interface IdListItem {
  file: string;
  id: string;
}

/**
 * Compile wcto.html files to wcto.js files.
 */
export class ConstructosParser {
  private constructosSourceFolder: string;
  private verbose: boolean;
  private promisesConstructos: Promise<boolean>[];
  private idList: IdListItem[];

  /**
   * Creates an instance of ConstructosParser
   * @param args - Configuration arguments
   */
  constructor(args: ConstructosParserConfig) {
    this.constructosSourceFolder = args.constructosSourceFolder;
    this.verbose = args.verbose || false;
    this.promisesConstructos = [];
    this.idList = [];
  }

  async singleParse(fileName: string): Promise<void> {
    this.idList = [];
    await this.transpileConstructo(fileName);
  }

  async parse(): Promise<boolean> {
    // Parsing logic here
    // read src folder to find all wcto.html files
    // convert them to wcto.js files
    // and write then to same folder
    const files = await recursive(this.constructosSourceFolder);
    // console.log(files);
    files.forEach((file: string) => {
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

  async transpileConstructo(filePath: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        fs.readFile(
          filePath,
          "utf8",
          (err: NodeJS.ErrnoException | null, data: string) => {
            if (err) {
              reject(err);
              return;
            }

            const dom = htmlParser(data.toString());
            const components = dom.querySelectorAll("winnetou");
            let finalReturn = "";

            Array.from(components).forEach((component: HTMLElement) => {
              const descri = component.getAttribute("description");
              const constructo = component.innerHTML;
              let jsdoc = "\n\n// ========================================";
              jsdoc += "\n/**\n";
              jsdoc += `\t* ${descri || ""}\n`;

              let requiredElement = false;
              let hasPropElements = false;
              let jsdoc2 = "";
              let id: string;

              try {
                const match = constructo.match(/\[\[\s?(.*?)\s?\]\]/);
                if (match) {
                  id = match[1];
                } else {
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

              const pureId = id + "-win-${this.identifier}";
              const verify = this.idList.filter(
                (data: IdListItem) => data.id === id
              );
              if (verify.length > 0) {
                console.error(
                  `Error: Duplicate Constructo ID found in ${filePath}.`
                );
              }
              this.idList.push({ file: filePath, id });

              // Gather all [[id]] for ids object in output
              const regId = /\[\[\s*?(.*?)\s*?\]\]/g;
              let matchIds = constructo.match(regId) || [];
              let idsObj = "";
              if (matchIds.length) {
                idsObj = "ids: {";
                const processedMatchIds = matchIds.map((item: string) =>
                  item.replace("[[", "").replace("]]", "")
                );
                processedMatchIds.forEach((item: string) => {
                  idsObj += `${item}: \`${item}-win-\${this.identifier}\`,`;
                });
                idsObj += "},";
              } else {
                idsObj = "";
              }

              // Replace [[id]] with template strings
              let processedConstructo = constructo.replace(
                /\[\[\s*?(.*?)\s*?\]\]/g,
                "$1-win-${this.identifier}"
              );

              // Parse {{prop}}
              const regex = new RegExp("{{\\s*?(.*?)\\s*?}}", "g");
              const matches = processedConstructo.match(regex);
              const propNames: string[] = [];

              if (matches) {
                hasPropElements = true;
                matches.forEach((match: string) => {
                  const el = match.replace("{{", "").replace("}}", "");
                  const colonSeparatorArray = el.split(":");
                  const roundBracketsSeparatorArray =
                    colonSeparatorArray[0].split("(");

                  const type = colonSeparatorArray[1] || "";
                  const required = colonSeparatorArray[0].indexOf("?") === -1;
                  if (required) requiredElement = true;

                  const propName = roundBracketsSeparatorArray[0]
                    .replace("?", "")
                    .trim();
                  propNames.push(propName);

                  let commentary = roundBracketsSeparatorArray[1] || "";
                  commentary = commentary.replace(")", "");

                  jsdoc2 += `\t* @param {${type ? type : "any"}} ${
                    required ? `elements.${propName}` : `[elements.${propName}]`
                  }  ${commentary.trim()}\n`;

                  const escapedString = escapeStringRegexp(match);
                  processedConstructo = processedConstructo.replace(
                    new RegExp(escapedString, "g"),
                    `\${props?.${propName} || ""}`
                  );
                });
              }

              if (hasPropElements && requiredElement) {
                jsdoc += "\t* @param {object} elements\n";
              } else {
                jsdoc += "\t* @param {object} [elements]\n";
              }

              jsdoc += jsdoc2;
              jsdoc += "\t* @param {object} [options]\n";
              jsdoc += "\t* @param {string} [options.identifier]\n";
              jsdoc += "\t*/\n";

              // Build the class
              const className = `$${id}`;
              const classStr = this.generateClassString(
                jsdoc,
                className,
                id,
                processedConstructo,
                idsObj
              );

              finalReturn += classStr;
            });

            const finalResult = beautify(finalReturn, {
              indent_size: 1,
              space_in_empty_paren: true,
            });

            const out = beautify(
              `
            import {Constructos} from "winnetoujs/core/constructos";
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

            const fileName = path.parse(filePath).name;
            const dir = path.parse(filePath).dir;
            const pathOut = path.join(dir, `${fileName}.js`);

            fs.writeFile(
              pathOut,
              out,
              "utf8",
              (writeErr: NodeJS.ErrnoException | null) => {
                if (writeErr) {
                  console.error(`Error writing file ${pathOut}:`, writeErr);
                  reject(writeErr);
                  return;
                }
                if (this.verbose) {
                  console.log(
                    `Constructo file ${fileName}.js created successfully in ${dir}.`
                  );
                }
                resolve(true);
              }
            );
          }
        );
      } catch (e) {
        const error = e as Error;
        reject(error.message);
      }
    });
  }

  /**
   * Generate the class string template for a constructo component
   * @param jsdoc - The JSDoc comment string for the class
   * @param className - The name of the class to generate
   * @param id - The constructo ID
   * @param constructo - The HTML template content
   * @param idsObj - The IDs object string for the create method return
   * @returns The complete class string
   * @private
   */
  private generateClassString(
    jsdoc: string,
    className: string,
    id: string,
    constructo: string,
    idsObj: string
  ): string {
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
}
