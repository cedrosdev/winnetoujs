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
