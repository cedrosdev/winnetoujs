const getElements = (selector) => {
  if (typeof selector == "object") {
    return [selector];
  } else {
    if (selector.includes(",")) {
      return Array.from(document.querySelectorAll(selector));
    } else if (selector.includes(" ")) {
      return Array.from(document.querySelectorAll(selector));
    } else if (selector.match(/^\#/)) {
      selector = selector.replace("#", "");
      const element = document.getElementById(selector);
      return element ? [element] : [];
    } else if (selector.match(/^\./)) {
      selector = selector.replace(".", "");
      return Array.from(document.getElementsByClassName(selector));
    } else {
      if (selector.includes("-win-")) {
        selector = selector.replace("#", "");
        const element = document.getElementById(selector);
        return element ? [element] : [];
      }
      let arr = Array.from(document.getElementsByTagName(selector));
      if (arr.length === 0) {
        const element = document.getElementById(selector);
        return element ? [element] : [];
      } else {
        return arr;
      }
    }
  }
};
const exists = (selector) => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  return elements.length > 0 && elements[0] !== null;
};
const findElements = (selector, childSelector) => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  if (!elements[0]) return [];
  return Array.from(elements[0].querySelectorAll(childSelector));
};
export {
  exists,
  findElements,
  getElements
};
//# sourceMappingURL=selectors.js.map
