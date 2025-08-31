import { getElements } from "./selectors";
const getParent = (selector) => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  return elements[0] ? elements[0].parentElement : null;
};
const getChildren = (selector) => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  return elements[0] ? Array.from(elements[0].children) : [];
};
const getSiblings = (selector) => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  if (!elements[0] || !elements[0].parentElement) return [];
  return Array.from(elements[0].parentElement.children).filter(
    (child) => child !== elements[0]
  );
};
const getNext = (selector) => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  return elements[0] ? elements[0].nextElementSibling : null;
};
const getPrevious = (selector) => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  return elements[0] ? elements[0].previousElementSibling : null;
};
export {
  getChildren,
  getNext,
  getParent,
  getPrevious,
  getSiblings
};
//# sourceMappingURL=navigation.js.map
