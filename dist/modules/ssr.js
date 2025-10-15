import fs from "fs";
const ESC = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
};
const escapeHTML = (v) => v.replace(/[&<>"']/g, (ch) => ESC[ch]);
const joinConstructos = (...parts) => parts.flat(Infinity).join("");
const partials = /* @__PURE__ */ new Map();
function loadPartial(fileName, options) {
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
export {
  escapeHTML,
  joinConstructos,
  loadPartial
};
//# sourceMappingURL=ssr.js.map
