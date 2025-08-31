import { getElements } from "./selectors.ts";
const __addEventListener = (selector, event, handler, options) => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  elements.forEach((item) => {
    item.addEventListener(event, handler, options);
  });
};
const __removeEventListener = (selector, event, handler) => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  elements.forEach((item) => {
    item.removeEventListener(event, handler);
  });
};
const onClick = (selector, handler) => {
  __addEventListener(selector, "click", handler);
};
const onSubmit = (selector, handler) => {
  __addEventListener(selector, "submit", handler);
};
const onChange = (selector, handler) => {
  __addEventListener(selector, "change", handler);
};
const onInput = (selector, handler) => {
  __addEventListener(selector, "input", handler);
};
const onFocus = (selector, handler) => {
  __addEventListener(selector, "focus", handler);
};
const onBlur = (selector, handler) => {
  __addEventListener(selector, "blur", handler);
};
const onKeyPress = (selector, handler) => {
  __addEventListener(selector, "keypress", handler);
};
const onKeyDown = (selector, handler) => {
  __addEventListener(selector, "keydown", handler);
};
const onKeyUp = (selector, handler) => {
  __addEventListener(selector, "keyup", handler);
};
const onMouseOver = (selector, handler) => {
  __addEventListener(selector, "mouseover", handler);
};
const onMouseOut = (selector, handler) => {
  __addEventListener(selector, "mouseout", handler);
};
const onMouseEnter = (selector, handler) => {
  __addEventListener(selector, "mouseenter", handler);
};
const onMouseLeave = (selector, handler) => {
  __addEventListener(selector, "mouseleave", handler);
};
const focusElement = (selector) => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  if (elements[0]) elements[0].focus();
};
const blurElement = (selector) => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  if (elements[0]) elements[0].blur();
};
const selectText = (selector) => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  if (elements[0] && elements[0].select) {
    elements[0].select();
  }
};
export {
  __addEventListener,
  __removeEventListener,
  blurElement,
  focusElement,
  onBlur,
  onChange,
  onClick,
  onFocus,
  onInput,
  onKeyDown,
  onKeyPress,
  onKeyUp,
  onMouseEnter,
  onMouseLeave,
  onMouseOut,
  onMouseOver,
  onSubmit,
  selectText
};
//# sourceMappingURL=events.js.map
