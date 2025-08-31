import { getElements } from "./selectors";

type Selector = string | Element | Element[];

export const fadeIn = (selector: Selector, duration: number = 300): void => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  elements.forEach(item => {
    const htmlItem = item as HTMLElement;
    htmlItem.style.opacity = "0";
    htmlItem.style.display = "";
    htmlItem.style.transition = `opacity ${duration}ms ease`;

    // Trigger reflow
    htmlItem.offsetHeight;

    htmlItem.style.opacity = "1";

    setTimeout(() => {
      htmlItem.style.transition = "";
    }, duration);
  });
};

export const fadeOut = (selector: Selector, duration: number = 300): void => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  elements.forEach(item => {
    const htmlItem = item as HTMLElement;
    htmlItem.style.transition = `opacity ${duration}ms ease`;
    htmlItem.style.opacity = "0";

    setTimeout(() => {
      htmlItem.style.display = "none";
      htmlItem.style.transition = "";
    }, duration);
  });
};

export const slideUp = (selector: Selector, duration: number = 300): void => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  elements.forEach(item => {
    const htmlItem = item as HTMLElement;
    const height = htmlItem.offsetHeight;
    htmlItem.style.transition = `height ${duration}ms ease`;
    htmlItem.style.height = height + "px";
    htmlItem.style.overflow = "hidden";

    // Trigger reflow
    htmlItem.offsetHeight;

    htmlItem.style.height = "0px";

    setTimeout(() => {
      htmlItem.style.display = "none";
      htmlItem.style.height = "";
      htmlItem.style.overflow = "";
      htmlItem.style.transition = "";
    }, duration);
  });
};

export const slideDown = (selector: Selector, duration: number = 300): void => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  elements.forEach(item => {
    const htmlItem = item as HTMLElement;
    htmlItem.style.display = "";
    const height = htmlItem.offsetHeight;
    htmlItem.style.height = "0px";
    htmlItem.style.overflow = "hidden";
    htmlItem.style.transition = `height ${duration}ms ease`;

    // Trigger reflow
    htmlItem.offsetHeight;

    htmlItem.style.height = height + "px";

    setTimeout(() => {
      htmlItem.style.height = "";
      htmlItem.style.overflow = "";
      htmlItem.style.transition = "";
    }, duration);
  });
};
