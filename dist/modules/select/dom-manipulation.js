import { getElements } from "./selectors.ts";
const removeElements = (selector) => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  elements.forEach((item) => {
    item.remove();
  });
};
const setHtml = (selector, htmlContentString) => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  elements.forEach((item) => {
    item.innerHTML = htmlContentString;
  });
};
const getHtml = (selector) => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  return elements[0].innerHTML;
};
const getText = (selector) => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  return elements[0].textContent;
};
const appendHtml = (selector, htmlContentString) => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  elements.forEach((item) => {
    item.innerHTML += htmlContentString;
  });
};
const prependHtml = (selector, htmlContentString) => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  elements.forEach((item) => {
    item.innerHTML = htmlContentString + item.innerHTML;
  });
};
const setCss = (selector, property, value) => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  let valueString = value;
  elements.forEach((item) => {
    if (typeof value == "number") valueString = value + "px";
    item.style[property] = valueString;
  });
};
const toggleClass = (selector, className) => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  elements.forEach((item) => {
    item.classList.toggle(className);
  });
};
const addClass = (selector, className) => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  elements.forEach((item) => {
    item.classList.add(className);
  });
};
const removeClass = (selector, className) => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  elements.forEach((item) => {
    item.classList.remove(className);
  });
};
const hasClass = (selector, className) => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  return elements[0] ? elements[0].classList.contains(className) : false;
};
const setText = (selector, text) => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  elements.forEach((item) => {
    item.textContent = text;
  });
};
const cloneElements = (selector, deep = true) => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  return elements.map((item) => item.cloneNode(deep));
};
const insertBefore = (selector, content) => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  elements.forEach((item) => {
    if (typeof content === "string") {
      item.insertAdjacentHTML("beforebegin", content);
    } else {
      item.parentNode?.insertBefore(content, item);
    }
  });
};
const insertAfter = (selector, content) => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  elements.forEach((item) => {
    if (typeof content === "string") {
      item.insertAdjacentHTML("afterend", content);
    } else {
      item.parentNode?.insertBefore(content, item.nextSibling);
    }
  });
};
const replaceElements = (selector, newContent) => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  elements.forEach((item) => {
    if (typeof newContent === "string") {
      item.outerHTML = newContent;
    } else {
      item.parentNode?.replaceChild(newContent, item);
    }
  });
};
export {
  addClass,
  appendHtml,
  cloneElements,
  getHtml,
  getText,
  hasClass,
  insertAfter,
  insertBefore,
  prependHtml,
  removeClass,
  removeElements,
  replaceElements,
  setCss,
  setHtml,
  setText,
  toggleClass
};
//# sourceMappingURL=dom-manipulation.js.map
