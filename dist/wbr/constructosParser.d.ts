/**
 * Configuration interface for ConstructosParser
 */
interface ConstructosParserConfig {
    constructosSourceFolder: string;
    verbose?: boolean;
}
/**
 * Compile wcto.html files to wcto.js files.
 */
export declare class ConstructosParser {
    private constructosSourceFolder;
    private verbose;
    private promisesConstructos;
    private idList;
    /**
     * Creates an instance of ConstructosParser
     * @param args - Configuration arguments
     */
    constructor(args: ConstructosParserConfig);
    singleParse(fileName: string): Promise<void>;
    parse(): Promise<boolean>;
    transpileConstructo(filePath: string): Promise<boolean>;
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
    private generateClassString;
}
export {};
//# sourceMappingURL=constructosParser.d.ts.map