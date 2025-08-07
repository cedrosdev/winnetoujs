// Type definitions for winnetoujs/wbr_modules/constructosParser.js
/// <reference path="../types/constructosParser.d.ts" />

declare class ConstructosParser {
  constructor(args: WinnetouJS.ConstructosParserArgs);
  singleParse(file_name: string): Promise<void>;
  parse(): Promise<boolean>;
}

export = ConstructosParser;
