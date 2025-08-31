import { getElements } from "./selectors.ts";

type Selector = string | Element | Element[];

interface ScrollOptions {
  behavior?: ScrollBehavior;
  block?: ScrollLogicalPosition;
  inline?: ScrollLogicalPosition;
}

export const hideElements = (selector: Selector): void => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  elements.forEach(item => {
    item.classList.add("winnetou_display_none");
  });
};

export const showElements = (selector: Selector): void => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  elements.forEach(item => {
    item.classList.remove("winnetou_display_none");

    if (getComputedStyle(item).display == "none") {
      (item as HTMLElement).style.display = "initial";
    }
  });
};

export const getWidth = (selector: Selector): number => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  return elements[0].getBoundingClientRect().width;
};

export const getHeight = (selector: Selector): number => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  return elements[0].getBoundingClientRect().height;
};

export const getLeft = (selector: Selector): number => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  return (elements[0] as HTMLElement).offsetLeft;
};

export const getTop = (selector: Selector): number => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  return (elements[0] as HTMLElement).offsetTop;
};

export const getGlobalPosition = (selector: Selector): DOMRect => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  return elements[0].getBoundingClientRect();
};

export const getScrollTop = (selector: Selector): number => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  return elements[0].scrollTop;
};

export const isVisible = (selector: Selector): boolean => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  if (!elements[0]) return false;
  const style = getComputedStyle(elements[0]);
  return (
    style.display !== "none" &&
    style.visibility !== "hidden" &&
    style.opacity !== "0"
  );
};

export const isHidden = (selector: Selector): boolean => {
  return !isVisible(selector);
};

export const contains = (
  parentSelector: Selector,
  childSelector: Selector
): boolean => {
  const parentElements = Array.isArray(parentSelector)
    ? parentSelector
    : getElements(parentSelector);
  const childElements = Array.isArray(childSelector)
    ? childSelector
    : getElements(childSelector);

  if (!parentElements[0] || !childElements[0]) return false;
  return parentElements[0].contains(childElements[0]);
};

export const scrollToElement = (
  selector: Selector,
  options: ScrollOptions = {}
): void => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  if (elements[0]) {
    elements[0].scrollIntoView({
      behavior: options.behavior || "smooth",
      block: options.block || "start",
      inline: options.inline || "nearest",
    });
  }
};

export const setScrollTop = (selector: Selector, position: number): void => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  elements.forEach(item => {
    item.scrollTop = position;
  });
};

export const setScrollLeft = (selector: Selector, position: number): void => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  elements.forEach(item => {
    item.scrollLeft = position;
  });
};

export const getScrollHeight = (selector: Selector): number => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  return elements[0] ? elements[0].scrollHeight : 0;
};

export const getScrollWidth = (selector: Selector): number => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  return elements[0] ? elements[0].scrollWidth : 0;
};
