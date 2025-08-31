import { getElements } from "./selectors.ts";

type Selector = string | Element | Element[];

export const getParent = (selector: Selector): Element | null => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  return elements[0] ? elements[0].parentElement : null;
};

export const getChildren = (selector: Selector): Element[] => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  return elements[0] ? Array.from(elements[0].children) : [];
};

export const getSiblings = (selector: Selector): Element[] => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  if (!elements[0] || !elements[0].parentElement) return [];

  return Array.from(elements[0].parentElement.children).filter(
    child => child !== elements[0]
  ) as Element[];
};

export const getNext = (selector: Selector): Element | null => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  return elements[0] ? elements[0].nextElementSibling : null;
};

export const getPrevious = (selector: Selector): Element | null => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  return elements[0] ? elements[0].previousElementSibling : null;
};
