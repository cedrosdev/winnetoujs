/**
 * Escape HTML special characters in a string.
 * @param {string} v - The input string.
 * @returns {string} - The escaped string.
 */
export declare const escapeHTML: (v: string) => string;
/**
 * Flatten and join parts into a single string to return a final HTML string.
 * @param {any[]} parts - Parts to join
 * @returns {string}
 */
export declare const joinConstructos: (...parts: any[]) => string;
/**
 * Load a partial file, caching its content for future use.
 * @param {string} fileName - Path to the partial file
 * @param {Object} [options]
 * @param {boolean} [options.verbose] - Whether to log loading info
 * @returns {string}
 */
export declare function loadPartial(fileName: string, options?: {
    verbose?: boolean;
}): string;
//# sourceMappingURL=ssr.d.ts.map