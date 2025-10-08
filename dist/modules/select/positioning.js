import { getElements } from "./selectors";
const hideElements = (selector) => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  elements.forEach((item) => {
    item.classList.add("winnetou_display_none");
  });
};
const showElements = (selector) => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  elements.forEach((item) => {
    item.classList.remove("winnetou_display_none");
    if (getComputedStyle(item).display == "none") {
      item.style.display = "initial";
    }
  });
};
const getWidth = (selector) => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  return elements[0].getBoundingClientRect().width;
};
const getHeight = (selector) => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  return elements[0].getBoundingClientRect().height;
};
const getLeft = (selector) => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  return elements[0].offsetLeft;
};
const getTop = (selector) => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  return elements[0].offsetTop;
};
const getGlobalPosition = (selector) => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  return elements[0].getBoundingClientRect();
};
const getScrollTop = (selector) => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  return elements[0].scrollTop;
};
const isVisible = (selector) => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  if (!elements[0]) return false;
  const style = getComputedStyle(elements[0]);
  return style.display !== "none" && style.visibility !== "hidden" && style.opacity !== "0";
};
const isHidden = (selector) => {
  return !isVisible(selector);
};
const contains = (parentSelector, childSelector) => {
  const parentElements = Array.isArray(parentSelector) ? parentSelector : getElements(parentSelector);
  const childElements = Array.isArray(childSelector) ? childSelector : getElements(childSelector);
  if (!parentElements[0] || !childElements[0]) return false;
  return parentElements[0].contains(childElements[0]);
};
const scrollToElement = (selector, options = {}) => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  if (elements[0]) {
    elements[0].scrollIntoView({
      behavior: options.behavior || "smooth",
      block: options.block || "start",
      inline: options.inline || "nearest"
    });
  }
};
const setScrollTop = (selector, position) => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  elements.forEach((item) => {
    item.scrollTop = position;
  });
};
const setScrollLeft = (selector, position) => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  elements.forEach((item) => {
    item.scrollLeft = position;
  });
};
const getScrollHeight = (selector) => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  return elements[0] ? elements[0].scrollHeight : 0;
};
const getScrollWidth = (selector) => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  return elements[0] ? elements[0].scrollWidth : 0;
};
export {
  contains,
  getGlobalPosition,
  getHeight,
  getLeft,
  getScrollHeight,
  getScrollTop,
  getScrollWidth,
  getTop,
  getWidth,
  hideElements,
  isHidden,
  isVisible,
  scrollToElement,
  setScrollLeft,
  setScrollTop,
  showElements
};
//# sourceMappingURL=positioning.js.map
