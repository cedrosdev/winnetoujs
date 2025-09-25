const ESC = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
};
const escapeHTML = (v) => v.replace(/[&<>"']/g, (ch) => ESC[ch]);
const ssr = (...parts) => parts.flat(Infinity).join("");
export {
  escapeHTML,
  ssr
};
//# sourceMappingURL=ssr.js.map
