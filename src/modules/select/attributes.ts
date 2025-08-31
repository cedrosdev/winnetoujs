import { getElements } from "./selectors.ts";

type Selector = string | Element | Element[];

export const getValue = (selector: Selector): string => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  return (elements[0] as HTMLInputElement).value;
};

export const setValue = (selector: Selector, value: string): void => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  elements.forEach(item => {
    (item as HTMLInputElement).value = value;
    if ("createEvent" in document) {
      var evt = document.createEvent("HTMLEvents");
      evt.initEvent("change", false, true);
      item.dispatchEvent(evt);
    } else (item as any).fireEvent("onchange");
  });
};

export const setAttr = (
  selector: Selector,
  attr: string,
  value: string
): void => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  elements.forEach(item => {
    item.setAttribute(attr, value);
  });
};

export const getAttr = (selector: Selector, attr: string): string | null => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  return elements[0].getAttribute(attr);
};

export const isChecked = (selector: Selector): boolean => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  return (elements[0] as HTMLInputElement).checked;
};

export const getFile = (selector: Selector): File | undefined => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  return (elements[0] as HTMLInputElement).files?.[0];
};

export const getFiles = (selector: Selector): FileList | null => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  return (elements[0] as HTMLInputElement).files;
};

export const disableElement = (selector: Selector): void => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  (elements[0] as HTMLInputElement).disabled = true;
};

export const enableElement = (selector: Selector): void => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  (elements[0] as HTMLInputElement).disabled = false;
};

export const setData = (
  selector: Selector,
  key: string,
  value: string
): void => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  elements.forEach(item => {
    (item as HTMLElement).dataset[key] = value;
  });
};

export const getData = (
  selector: Selector,
  key: string
): string | undefined => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  return elements[0] ? (elements[0] as HTMLElement).dataset[key] : undefined;
};

export const removeData = (selector: Selector, key: string): void => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  elements.forEach(item => {
    delete (item as HTMLElement).dataset[key];
  });
};

export const clearForm = (selector: Selector): void => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  elements.forEach(form => {
    if (form.tagName === "FORM") {
      Array.from((form as HTMLFormElement).elements).forEach(element => {
        const inputElement = element as HTMLInputElement;
        if (inputElement.type === "checkbox" || inputElement.type === "radio") {
          inputElement.checked = false;
        } else if (element.tagName === "SELECT") {
          (element as HTMLSelectElement).selectedIndex = -1;
        } else {
          (element as HTMLInputElement).value = "";
        }
      });
    }
  });
};

export const serializeForm = (
  selector: Selector
): Record<string, string | string[]> => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  if (!elements[0] || elements[0].tagName !== "FORM") return {};

  const formData = new FormData(elements[0] as HTMLFormElement);
  const data: Record<string, string | string[]> = {};

  for (let [key, value] of formData.entries()) {
    if (data[key]) {
      if (Array.isArray(data[key])) {
        (data[key] as string[]).push(value as string);
      } else {
        data[key] = [data[key] as string, value as string];
      }
    } else {
      data[key] = value as string;
    }
  }

  return data;
};

export const resetForm = (selector: Selector): void => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  elements.forEach(form => {
    if (form.tagName === "FORM") {
      (form as HTMLFormElement).reset();
    }
  });
};

export const insertTextAtCursor = (selector: Selector, text: string): void => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  elements.forEach(item => {
    if (item.tagName === "INPUT" || item.tagName === "TEXTAREA") {
      const element = item as HTMLInputElement | HTMLTextAreaElement;
      const start = element.selectionStart || 0;
      const end = element.selectionEnd || 0;
      const currentValue = element.value;

      element.value =
        currentValue.substring(0, start) + text + currentValue.substring(end);
      element.selectionStart = element.selectionEnd = start + text.length;
      element.focus();
    }
  });
};
