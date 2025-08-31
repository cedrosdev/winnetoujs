import { getElements } from "./selectors.ts";

type Selector = string | Element | Element[];

export const removeElements = (selector: Selector): void => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  elements.forEach(item => {
    item.remove();
  });
};

export const setHtml = (
  selector: Selector,
  htmlContentString: string
): void => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  elements.forEach(item => {
    item.innerHTML = htmlContentString;
  });
};

export const getHtml = (selector: Selector): string => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  return elements[0].innerHTML;
};

export const getText = (selector: Selector): string | null => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  return elements[0].textContent;
};

export const appendHtml = (
  selector: Selector,
  htmlContentString: string
): void => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  elements.forEach(item => {
    item.innerHTML += htmlContentString;
  });
};

export const prependHtml = (
  selector: Selector,
  htmlContentString: string
): void => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  elements.forEach(item => {
    item.innerHTML = htmlContentString + item.innerHTML;
  });
};

export const setCss = (
  selector: Selector,
  property: string,
  value: string | number
): void => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  let valueString = value;
  elements.forEach(item => {
    if (typeof value == "number") valueString = value + "px";
    ((item as HTMLElement).style as any)[property] = valueString;
  });
};

export const toggleClass = (selector: Selector, className: string): void => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  elements.forEach(item => {
    item.classList.toggle(className);
  });
};

export const addClass = (selector: Selector, className: string): void => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  elements.forEach(item => {
    item.classList.add(className);
  });
};

export const removeClass = (selector: Selector, className: string): void => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  elements.forEach(item => {
    item.classList.remove(className);
  });
};

export const hasClass = (selector: Selector, className: string): boolean => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  return elements[0] ? elements[0].classList.contains(className) : false;
};

export const setText = (selector: Selector, text: string): void => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  elements.forEach(item => {
    item.textContent = text;
  });
};

export const cloneElements = (
  selector: Selector,
  deep: boolean = true
): Element[] => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  return elements.map(item => item.cloneNode(deep) as Element);
};

export const insertBefore = (
  selector: Selector,
  content: string | Element
): void => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  elements.forEach(item => {
    if (typeof content === "string") {
      item.insertAdjacentHTML("beforebegin", content);
    } else {
      item.parentNode?.insertBefore(content, item);
    }
  });
};

export const insertAfter = (
  selector: Selector,
  content: string | Element
): void => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  elements.forEach(item => {
    if (typeof content === "string") {
      item.insertAdjacentHTML("afterend", content);
    } else {
      item.parentNode?.insertBefore(content, item.nextSibling);
    }
  });
};

export const replaceElements = (
  selector: Selector,
  newContent: string | Element
): void => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  elements.forEach(item => {
    if (typeof newContent === "string") {
      item.outerHTML = newContent;
    } else {
      item.parentNode?.replaceChild(newContent, item);
    }
  });
};
