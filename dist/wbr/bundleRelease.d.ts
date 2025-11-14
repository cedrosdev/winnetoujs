/**
 * Configuration interface for BundleRelease
 */
interface BundleReleaseConfig {
    entryFile: string[];
    outputDir: string;
    constructosSourceFolder: string;
    watch: boolean;
    production: boolean;
    verbose?: boolean;
    node?: boolean;
    "node-esm"?: boolean;
}
/**
 * BundleRelease class for building and managing JavaScript bundles using esbuild
 */
export declare class BundleRelease {
    private entryFile;
    private outputDir;
    private watch;
    private production;
    private verbose;
    private constructosSourceFolder;
    private node;
    private nodeEsm;
    /**
     * Creates an instance of BundleRelease
     * @param args - Configuration arguments
     */
    constructor(args: BundleReleaseConfig);
    /**
     * Builds the bundle using esbuild and starts watching for changes
     * @async
     * @returns - Returns a promise that resolves when the build is complete or watching is started
     */
    build(): Promise<"watching" | "done">;
    private esbuild;
}
export {};
//# sourceMappingURL=bundleRelease.d.ts.map