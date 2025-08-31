import { getElements } from "./selectors";

type Selector = string | Element | Element[];
type EventHandler = (event: Event) => void;

export const __addEventListener = (
  selector: Selector,
  event: string,
  handler: EventHandler,
  options?: AddEventListenerOptions
): void => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  elements.forEach(item => {
    item.addEventListener(event, handler, options);
  });
};

export const __removeEventListener = (
  selector: Selector,
  event: string,
  handler: EventHandler
): void => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  elements.forEach(item => {
    item.removeEventListener(event, handler);
  });
};

export const onClick = (selector: Selector, handler: EventHandler): void => {
  __addEventListener(selector, "click", handler);
};

export const onSubmit = (selector: Selector, handler: EventHandler): void => {
  __addEventListener(selector, "submit", handler);
};

export const onChange = (selector: Selector, handler: EventHandler): void => {
  __addEventListener(selector, "change", handler);
};

export const onInput = (selector: Selector, handler: EventHandler): void => {
  __addEventListener(selector, "input", handler);
};

export const onFocus = (selector: Selector, handler: EventHandler): void => {
  __addEventListener(selector, "focus", handler);
};

export const onBlur = (selector: Selector, handler: EventHandler): void => {
  __addEventListener(selector, "blur", handler);
};

export const onKeyPress = (selector: Selector, handler: EventHandler): void => {
  __addEventListener(selector, "keypress", handler);
};

export const onKeyDown = (selector: Selector, handler: EventHandler): void => {
  __addEventListener(selector, "keydown", handler);
};

export const onKeyUp = (selector: Selector, handler: EventHandler): void => {
  __addEventListener(selector, "keyup", handler);
};

export const onMouseOver = (
  selector: Selector,
  handler: EventHandler
): void => {
  __addEventListener(selector, "mouseover", handler);
};

export const onMouseOut = (selector: Selector, handler: EventHandler): void => {
  __addEventListener(selector, "mouseout", handler);
};

export const onMouseEnter = (
  selector: Selector,
  handler: EventHandler
): void => {
  __addEventListener(selector, "mouseenter", handler);
};

export const onMouseLeave = (
  selector: Selector,
  handler: EventHandler
): void => {
  __addEventListener(selector, "mouseleave", handler);
};

export const focusElement = (selector: Selector): void => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  if (elements[0]) (elements[0] as HTMLElement).focus();
};

export const blurElement = (selector: Selector): void => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  if (elements[0]) (elements[0] as HTMLElement).blur();
};

export const selectText = (selector: Selector): void => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  if (elements[0] && (elements[0] as HTMLInputElement).select) {
    (elements[0] as HTMLInputElement).select();
  }
};
