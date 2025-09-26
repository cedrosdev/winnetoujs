import fs from "fs";

const ESC = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};
/**
 * Escape HTML special characters in a string.
 * @param {string} v - The input string.
 * @returns {string} - The escaped string.
 */
export const escapeHTML = (v: string): string =>
  v.replace(/[&<>"']/g, ch => ESC[ch as keyof typeof ESC]);

/**
 * Simple SSR template literal tag function
 * @param {any[]} parts - Parts to join
 * @returns {string}
 */
export const ssr = (...parts: any[]) => parts.flat(Infinity).join("");

const partials = new Map();
/**
 * Load a partial file, caching its content for future use.
 * @param {string} fileName - Path to the partial file
 * @param {Object} [options]
 * @param {boolean} [options.verbose] - Whether to log loading info
 * @returns {string}
 */
export function loadPartial(
  fileName: string,
  options?: { verbose?: boolean }
): string {
  if (!partials.has(fileName)) {
    if (options?.verbose) {
      console.log(`Loading partial from disk: ${fileName}`);
    }
    partials.set(fileName, fs.readFileSync(fileName, "utf8"));
  } else {
    if (options?.verbose) {
      console.log(`Using cached partial: ${fileName}`);
    }
  }
  return partials.get(fileName);
}
