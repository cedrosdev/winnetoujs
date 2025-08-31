import { getElements } from "./selectors.ts";
const fadeIn = (selector, duration = 300) => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  elements.forEach((item) => {
    const htmlItem = item;
    htmlItem.style.opacity = "0";
    htmlItem.style.display = "";
    htmlItem.style.transition = `opacity ${duration}ms ease`;
    htmlItem.offsetHeight;
    htmlItem.style.opacity = "1";
    setTimeout(() => {
      htmlItem.style.transition = "";
    }, duration);
  });
};
const fadeOut = (selector, duration = 300) => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  elements.forEach((item) => {
    const htmlItem = item;
    htmlItem.style.transition = `opacity ${duration}ms ease`;
    htmlItem.style.opacity = "0";
    setTimeout(() => {
      htmlItem.style.display = "none";
      htmlItem.style.transition = "";
    }, duration);
  });
};
const slideUp = (selector, duration = 300) => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  elements.forEach((item) => {
    const htmlItem = item;
    const height = htmlItem.offsetHeight;
    htmlItem.style.transition = `height ${duration}ms ease`;
    htmlItem.style.height = height + "px";
    htmlItem.style.overflow = "hidden";
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
const slideDown = (selector, duration = 300) => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  elements.forEach((item) => {
    const htmlItem = item;
    htmlItem.style.display = "";
    const height = htmlItem.offsetHeight;
    htmlItem.style.height = "0px";
    htmlItem.style.overflow = "hidden";
    htmlItem.style.transition = `height ${duration}ms ease`;
    htmlItem.offsetHeight;
    htmlItem.style.height = height + "px";
    setTimeout(() => {
      htmlItem.style.height = "";
      htmlItem.style.overflow = "";
      htmlItem.style.transition = "";
    }, duration);
  });
};
export {
  fadeIn,
  fadeOut,
  slideDown,
  slideUp
};
//# sourceMappingURL=animations.js.map
