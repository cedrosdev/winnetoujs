// Type definitions for WinnetouJS - Constructos Parser Module
/// <reference path="./common.d.ts" />
/// <reference types="node" />

declare class ConstructosParser {
  constructosSourceFolder: string;
  verbose: boolean;
  promisesConstructos: Promise<any>[];
  idList: any[];

  /**
   * Creates an instance of ConstructosParser
   * @param args Configuration arguments
   */
  constructor(args: WinnetouJS.ConstructosParserArgs);

  /**
   * Parse a single constructo file
   * @param file_name Path to the constructo file
   */
  singleParse(file_name: string): Promise<void>;

  /**
   * Parse all constructo files in the source folder
   * @returns Promise that resolves when parsing is complete
   */
  parse(): Promise<boolean>;

  /**
   * Transpile a single constructo file
   * @param filePath Path to the constructo file
   * @private
   */
  private transpileConstructo(filePath: string): Promise<any>;

  /**
   * Generate the class string template for a constructo component
   * @param jsdoc The JSDoc comment string for the class
   * @param className The name of the class to generate
   * @param id The constructo ID
   * @param constructo The HTML template content
   * @param idsObj The IDs object string for the create method return
   * @returns The complete class string
   * @private
   */
  private generateClassString(
    jsdoc: string,
    className: string,
    id: string,
    constructo: string,
    idsObj: string
  ): string;
}

export = ConstructosParser;
