import path from "path";
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
    console.log(`Loading partial from disk: ${fileName}`);
    partials.set(
      fileName,
      fs.readFileSync(path.join(__dirname, fileName), "utf8")
    );
  } else {
    console.log(`Using cached partial: ${fileName}`);
  }
  return partials.get(fileName);
}
export {
  escapeHTML,
  loadPartial,
  ssr
};
//# sourceMappingURL=ssr.js.map
