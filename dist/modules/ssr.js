import fs from "fs";
const ESC = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
};
const escapeHTML = (v) => v.replace(/[&<>"']/g, (ch) => ESC[ch]);
const ssr = (...parts) => parts.flat(Infinity).join("");
const partials = /* @__PURE__ */ new Map();
function loadPartial(fileName) {
  if (!partials.has(fileName)) {
    partials.set(fileName, fs.readFileSync(fileName, "utf8"));
  }
  return partials.get(fileName);
}
export {
  escapeHTML,
  loadPartial,
  ssr
};
//# sourceMappingURL=ssr.js.map
