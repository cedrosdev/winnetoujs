import { getElements } from "./selectors.ts";
const getValue = (selector) => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  return elements[0].value;
};
const setValue = (selector, value) => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  elements.forEach((item) => {
    item.value = value;
    if ("createEvent" in document) {
      var evt = document.createEvent("HTMLEvents");
      evt.initEvent("change", false, true);
      item.dispatchEvent(evt);
    } else item.fireEvent("onchange");
  });
};
const setAttr = (selector, attr, value) => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  elements.forEach((item) => {
    item.setAttribute(attr, value);
  });
};
const getAttr = (selector, attr) => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  return elements[0].getAttribute(attr);
};
const isChecked = (selector) => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  return elements[0].checked;
};
const getFile = (selector) => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  return elements[0].files?.[0];
};
const getFiles = (selector) => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  return elements[0].files;
};
const disableElement = (selector) => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  elements[0].disabled = true;
};
const enableElement = (selector) => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  elements[0].disabled = false;
};
const setData = (selector, key, value) => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  elements.forEach((item) => {
    item.dataset[key] = value;
  });
};
const getData = (selector, key) => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  return elements[0] ? elements[0].dataset[key] : void 0;
};
const removeData = (selector, key) => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  elements.forEach((item) => {
    delete item.dataset[key];
  });
};
const clearForm = (selector) => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  elements.forEach((form) => {
    if (form.tagName === "FORM") {
      Array.from(form.elements).forEach((element) => {
        const inputElement = element;
        if (inputElement.type === "checkbox" || inputElement.type === "radio") {
          inputElement.checked = false;
        } else if (element.tagName === "SELECT") {
          element.selectedIndex = -1;
        } else {
          element.value = "";
        }
      });
    }
  });
};
const serializeForm = (selector) => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  if (!elements[0] || elements[0].tagName !== "FORM") return {};
  const formData = new FormData(elements[0]);
  const data = {};
  for (let [key, value] of formData.entries()) {
    if (data[key]) {
      if (Array.isArray(data[key])) {
        data[key].push(value);
      } else {
        data[key] = [data[key], value];
      }
    } else {
      data[key] = value;
    }
  }
  return data;
};
const resetForm = (selector) => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  elements.forEach((form) => {
    if (form.tagName === "FORM") {
      form.reset();
    }
  });
};
const insertTextAtCursor = (selector, text) => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  elements.forEach((item) => {
    if (item.tagName === "INPUT" || item.tagName === "TEXTAREA") {
      const element = item;
      const start = element.selectionStart || 0;
      const end = element.selectionEnd || 0;
      const currentValue = element.value;
      element.value = currentValue.substring(0, start) + text + currentValue.substring(end);
      element.selectionStart = element.selectionEnd = start + text.length;
      element.focus();
    }
  });
};
export {
  clearForm,
  disableElement,
  enableElement,
  getAttr,
  getData,
  getFile,
  getFiles,
  getValue,
  insertTextAtCursor,
  isChecked,
  removeData,
  resetForm,
  serializeForm,
  setAttr,
  setData,
  setValue
};
//# sourceMappingURL=attributes.js.map
