import fs from "fs";

const ESC = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};
export const escapeHTML = (v: string): string =>
  v.replace(/[&<>"']/g, ch => ESC[ch as keyof typeof ESC]);

// Join chunks and arrays into a single HTML string
export const ssr = (...parts: any[]) => parts.flat(Infinity).join("");

const partials = new Map();
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
