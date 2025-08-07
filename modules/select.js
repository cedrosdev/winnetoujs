/**
 * Gets elements from the DOM based on a selector string.
 * It supports various selector formats including IDs, classes, and tag names.
 *
 * @param {string|object} selector - The selector string to find elements in the DOM or a DOM element object.
 * @returns {Array} Array of DOM elements
 */
export const getElements = selector => {
  if (typeof selector == "object") {
    return [selector];
  } else {
    //
    if (selector.includes(",")) {
      return document.querySelectorAll(selector);
    }
    //
    else if (selector.includes(" ")) {
      return document.querySelectorAll(selector);
    }
    //
    else if (selector.match(/^\#/)) {
      selector = selector.replace("#", "");
      return [document.getElementById(selector)];
    }
    //
    else if (selector.match(/^\./)) {
      selector = selector.replace(".", "");
      return Array.from(document.getElementsByClassName(selector));
    }
    //
    else {
      if (selector.includes("-win-")) {
        selector = selector.replace("#", "");
        return [document.getElementById(selector)];
      }

      let arr = Array.from(document.getElementsByTagName(selector));

      if (arr.length === 0) {
        return [document.getElementById(selector)];
      } else {
        return arr;
      }
    }
  }
};

/**
 * Remove elements from the DOM
 * @param {string|object|Array} selector - The selector or element(s)
 */
export const removeElements = selector => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  elements.forEach(item => {
    item.remove();
  });
};

/**
 * Set inner html of elements
 * @param {string|object|Array} selector - The selector or element(s)
 * @param {string} htmlContentString - The html string to be inserted
 */
export const setHtml = (selector, htmlContentString) => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  elements.forEach(item => {
    item.innerHTML = htmlContentString;
  });
};

/**
 * Get the inner html of first element
 * @param {string|object|Array} selector - The selector or element(s)
 * @returns {string} The innerHTML of the first element
 */
export const getHtml = selector => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  return elements[0].innerHTML;
};

/**
 * Get inner text of first element
 * @param {string|object|Array} selector - The selector or element(s)
 * @returns {string} The textContent of the first element
 */
export const getText = selector => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  return elements[0].textContent;
};

/**
 * Append html to the end of elements' html
 * @param {string|object|Array} selector - The selector or element(s)
 * @param {string} htmlContentString - The html string to be inserted
 */
export const appendHtml = (selector, htmlContentString) => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  elements.forEach(item => {
    item.innerHTML += htmlContentString;
  });
};

/**
 * Prepend html to the start of elements' html
 * @param {string|object|Array} selector - The selector or element(s)
 * @param {string} htmlContentString - The html string to be inserted
 */
export const prependHtml = (selector, htmlContentString) => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  elements.forEach(item => {
    item.innerHTML = htmlContentString + item.innerHTML;
  });
};

/**
 * Changes the css of elements
 * @tutorial https://www.w3schools.com/JSREF/dom_obj_style.asp
 * @param {string|object|Array} selector - The selector or element(s)
 * @param {string | number} property - The Style object represents an individual style statement.
 * @param {string | number} value - The value. If it is a number, winnetou will assume that it's a short hand to 'px'.
 */
export const setCss = (selector, property, value) => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  let valueString = value;
  elements.forEach(item => {
    if (typeof value == "number") valueString = value + "px";
    item.style[property] = valueString;
  });
};

/**
 * Add the class if not added yet, remove the class if already added.
 * @param {string|object|Array} selector - The selector or element(s)
 * @param {string} className - Name of class
 */
export const toggleClass = (selector, className) => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  elements.forEach(item => {
    item.classList.toggle(className);
  });
};

/**
 * Add a class to elements
 * @param {string|object|Array} selector - The selector or element(s)
 * @param {string} className - Name of class
 */
export const addClass = (selector, className) => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  elements.forEach(item => {
    item.classList.add(className);
  });
};

/**
 * Remove a class from elements
 * @param {string|object|Array} selector - The selector or element(s)
 * @param {string} className - Name of class
 */
export const removeClass = (selector, className) => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  elements.forEach(item => {
    item.classList.remove(className);
  });
};

/**
 * Hide elements
 * @param {string|object|Array} selector - The selector or element(s)
 */
export const hideElements = selector => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  elements.forEach(item => {
    item.classList.add("winnetou_display_none");
  });
};

/**
 * Show elements
 * @param {string|object|Array} selector - The selector or element(s)
 */
export const showElements = selector => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  elements.forEach(item => {
    item.classList.remove("winnetou_display_none");

    if (getComputedStyle(item).display == "none") {
      item.style.display = "initial";
    }
  });
};

/**
 * Get width of first element
 * @param {string|object|Array} selector - The selector or element(s)
 * @returns {number} The width of the first element
 */
export const getWidth = selector => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  return elements[0].getBoundingClientRect().width;
};

/**
 * Get height of first element
 * @param {string|object|Array} selector - The selector or element(s)
 * @returns {number} The height of the first element
 */
export const getHeight = selector => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  return elements[0].getBoundingClientRect().height;
};

/**
 * Get left position of first element
 * @param {string|object|Array} selector - The selector or element(s)
 * @returns {number} The left position of the first element
 */
export const getLeft = selector => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  return elements[0].offsetLeft;
};

/**
 * Get top position of first element
 * @param {string|object|Array} selector - The selector or element(s)
 * @returns {number} The top position of the first element
 */
export const getTop = selector => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  return elements[0].offsetTop;
};

/**
 * Get global position of first element
 * @param {string|object|Array} selector - The selector or element(s)
 * @returns {DOMRect} The bounding rectangle of the first element
 */
export const getGlobalPosition = selector => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  return elements[0].getBoundingClientRect();
};

/**
 * Get value of first element
 * @param {string|object|Array} selector - The selector or element(s)
 * @returns {string} The value of the first element
 */
export const getValue = selector => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  return elements[0].value;
};

/**
 * Set value to elements, also fire a change event
 * @param {string|object|Array} selector - The selector or element(s)
 * @param {string} value - The value
 */
export const setValue = (selector, value) => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  elements.forEach(item => {
    item.value = value;
    if ("createEvent" in document) {
      var evt = document.createEvent("HTMLEvents");
      evt.initEvent("change", false, true);
      item.dispatchEvent(evt);
    } else item.fireEvent("onchange");
  });
};

/**
 * Set an attribute to elements
 * @param {string|object|Array} selector - The selector or element(s)
 * @param {string} attr - Name of attribute
 * @param {string} value - The values
 */
export const setAttr = (selector, attr, value) => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  elements.forEach(item => {
    item.setAttribute(attr, value);
  });
};

/**
 * Get an attribute from first element
 * @param {string|object|Array} selector - The selector or element(s)
 * @param {string} attr - Attribute name
 * @returns {string} The attribute value
 */
export const getAttr = (selector, attr) => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  return elements[0].getAttribute(attr);
};

/**
 * Check if first element is checked
 * @param {string|object|Array} selector - The selector or element(s)
 * @returns {boolean} Whether the first element is checked
 */
export const isChecked = selector => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  return elements[0].checked;
};

/**
 * Get the file of first input type file element
 *
 * @typedef {Object} File_
 * @property {number} lastModified
 * @property {Date} lastModifiedDate
 * @property {string} name
 * @property {number} size
 * @property {string} type
 *
 * @param {string|object|Array} selector - The selector or element(s)
 * @returns {File_} The first file
 */
export const getFile = selector => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  return elements[0].files[0];
};

/**
 * Get file array of first input type file element
 *
 * @param {string|object|Array} selector - The selector or element(s)
 * @returns {Array.<File_>} Array of files
 */
export const getFiles = selector => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  return elements[0].files;
};

/**
 * Get scrollTop of first element
 * @param {string|object|Array} selector - The selector or element(s)
 * @returns {number} The scrollTop value
 */
export const getScrollTop = selector => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  return elements[0].scrollTop;
};

/**
 * Disable first element
 * @param {string|object|Array} selector - The selector or element(s)
 */
export const disableElement = selector => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  elements[0].disabled = true;
};

/**
 * Enable first element
 * @param {string|object|Array} selector - The selector or element(s)
 */
export const enableElement = selector => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  elements[0].disabled = false;
};

/**
 * Set text content of elements (safer than innerHTML)
 * @param {string|object|Array} selector - The selector or element(s)
 * @param {string} text - The text content to set
 */
export const setText = (selector, text) => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  elements.forEach(item => {
    item.textContent = text;
  });
};

/**
 * Add event listener to elements
 * @param {string|object|Array} selector - The selector or element(s)
 * @param {string} event - The event type (e.g., 'click', 'change')
 * @param {Function} handler - The event handler function
 * @param {object} [options] - Event listener options
 */
export const addEventListener = (selector, event, handler, options) => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  elements.forEach(item => {
    item.addEventListener(event, handler, options);
  });
};

/**
 * Remove event listener from elements
 * @param {string|object|Array} selector - The selector or element(s)
 * @param {string} event - The event type
 * @param {Function} handler - The event handler function
 */
export const removeEventListener = (selector, event, handler) => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  elements.forEach(item => {
    item.removeEventListener(event, handler);
  });
};

/**
 * Add click event listener to elements
 * @param {string|object|Array} selector - The selector or element(s)
 * @param {Function} handler - The click handler function
 */
export const onClick = (selector, handler) => {
  addEventListener(selector, "click", handler);
};

/**
 * Add submit event listener to elements
 * @param {string|object|Array} selector - The selector or element(s)
 * @param {Function} handler - The submit handler function
 */
export const onSubmit = (selector, handler) => {
  addEventListener(selector, "submit", handler);
};

/**
 * Add change event listener to elements
 * @param {string|object|Array} selector - The selector or element(s)
 * @param {Function} handler - The change handler function
 */
export const onChange = (selector, handler) => {
  addEventListener(selector, "change", handler);
};

/**
 * Add input event listener to elements
 * @param {string|object|Array} selector - The selector or element(s)
 * @param {Function} handler - The input handler function
 */
export const onInput = (selector, handler) => {
  addEventListener(selector, "input", handler);
};

/**
 * Add focus event listener to elements
 * @param {string|object|Array} selector - The selector or element(s)
 * @param {Function} handler - The focus handler function
 */
export const onFocus = (selector, handler) => {
  addEventListener(selector, "focus", handler);
};

/**
 * Add blur event listener to elements
 * @param {string|object|Array} selector - The selector or element(s)
 * @param {Function} handler - The blur handler function
 */
export const onBlur = (selector, handler) => {
  addEventListener(selector, "blur", handler);
};

/**
 * Add keypress event listener to elements
 * @param {string|object|Array} selector - The selector or element(s)
 * @param {Function} handler - The keypress handler function
 */
export const onKeyPress = (selector, handler) => {
  addEventListener(selector, "keypress", handler);
};

/**
 * Add keydown event listener to elements
 * @param {string|object|Array} selector - The selector or element(s)
 * @param {Function} handler - The keydown handler function
 */
export const onKeyDown = (selector, handler) => {
  addEventListener(selector, "keydown", handler);
};

/**
 * Add keyup event listener to elements
 * @param {string|object|Array} selector - The selector or element(s)
 * @param {Function} handler - The keyup handler function
 */
export const onKeyUp = (selector, handler) => {
  addEventListener(selector, "keyup", handler);
};

/**
 * Add mouseover event listener to elements
 * @param {string|object|Array} selector - The selector or element(s)
 * @param {Function} handler - The mouseover handler function
 */
export const onMouseOver = (selector, handler) => {
  addEventListener(selector, "mouseover", handler);
};

/**
 * Add mouseout event listener to elements
 * @param {string|object|Array} selector - The selector or element(s)
 * @param {Function} handler - The mouseout handler function
 */
export const onMouseOut = (selector, handler) => {
  addEventListener(selector, "mouseout", handler);
};

/**
 * Add mouseenter event listener to elements
 * @param {string|object|Array} selector - The selector or element(s)
 * @param {Function} handler - The mouseenter handler function
 */
export const onMouseEnter = (selector, handler) => {
  addEventListener(selector, "mouseenter", handler);
};

/**
 * Add mouseleave event listener to elements
 * @param {string|object|Array} selector - The selector or element(s)
 * @param {Function} handler - The mouseleave handler function
 */
export const onMouseLeave = (selector, handler) => {
  addEventListener(selector, "mouseleave", handler);
};

/**
 * Focus first element
 * @param {string|object|Array} selector - The selector or element(s)
 */
export const focusElement = selector => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  if (elements[0]) elements[0].focus();
};

/**
 * Blur first element
 * @param {string|object|Array} selector - The selector or element(s)
 */
export const blurElement = selector => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  if (elements[0]) elements[0].blur();
};

/**
 * Select text content of first element
 * @param {string|object|Array} selector - The selector or element(s)
 */
export const selectText = selector => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  if (elements[0] && elements[0].select) {
    elements[0].select();
  }
};

/**
 * Clone elements
 * @param {string|object|Array} selector - The selector or element(s)
 * @param {boolean} [deep=true] - Whether to clone deeply
 * @returns {Array} Array of cloned elements
 */
export const cloneElements = (selector, deep = true) => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  return elements.map(item => item.cloneNode(deep));
};

/**
 * Insert content before elements
 * @param {string|object|Array} selector - The selector or element(s)
 * @param {string|Element} content - Content to insert
 */
export const insertBefore = (selector, content) => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  elements.forEach(item => {
    if (typeof content === "string") {
      item.insertAdjacentHTML("beforebegin", content);
    } else {
      item.parentNode.insertBefore(content, item);
    }
  });
};

/**
 * Insert content after elements
 * @param {string|object|Array} selector - The selector or element(s)
 * @param {string|Element} content - Content to insert
 */
export const insertAfter = (selector, content) => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  elements.forEach(item => {
    if (typeof content === "string") {
      item.insertAdjacentHTML("afterend", content);
    } else {
      item.parentNode.insertBefore(content, item.nextSibling);
    }
  });
};

/**
 * Replace elements with new content
 * @param {string|object|Array} selector - The selector or element(s)
 * @param {string|Element} newContent - New content to replace with
 */
export const replaceElements = (selector, newContent) => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  elements.forEach(item => {
    if (typeof newContent === "string") {
      item.outerHTML = newContent;
    } else {
      item.parentNode.replaceChild(newContent, item);
    }
  });
};

/**
 * Check if first element is visible
 * @param {string|object|Array} selector - The selector or element(s)
 * @returns {boolean} Whether the element is visible
 */
export const isVisible = selector => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  if (!elements[0]) return false;
  const style = getComputedStyle(elements[0]);
  return (
    style.display !== "none" &&
    style.visibility !== "hidden" &&
    style.opacity !== "0"
  );
};

/**
 * Check if first element is hidden
 * @param {string|object|Array} selector - The selector or element(s)
 * @returns {boolean} Whether the element is hidden
 */
export const isHidden = selector => {
  return !isVisible(selector);
};

/**
 * Check if elements exist in DOM
 * @param {string|object|Array} selector - The selector or element(s)
 * @returns {boolean} Whether elements exist
 */
export const exists = selector => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  return elements.length > 0 && elements[0] !== null;
};

/**
 * Check if first element has a class
 * @param {string|object|Array} selector - The selector or element(s)
 * @param {string} className - Class name to check
 * @returns {boolean} Whether the element has the class
 */
export const hasClass = (selector, className) => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  return elements[0] ? elements[0].classList.contains(className) : false;
};

/**
 * Check if parent contains child element
 * @param {string|object|Array} parentSelector - The parent selector or element(s)
 * @param {string|object|Array} childSelector - The child selector or element(s)
 * @returns {boolean} Whether parent contains child
 */
export const contains = (parentSelector, childSelector) => {
  const parentElements = Array.isArray(parentSelector)
    ? parentSelector
    : getElements(parentSelector);
  const childElements = Array.isArray(childSelector)
    ? childSelector
    : getElements(childSelector);

  if (!parentElements[0] || !childElements[0]) return false;
  return parentElements[0].contains(childElements[0]);
};

/**
 * Scroll to element smoothly
 * @param {string|object|Array} selector - The selector or element(s)
 * @param {object} [options] - Scroll options
 * @param {string} [options.behavior='smooth'] - Scroll behavior
 * @param {string} [options.block='start'] - Vertical alignment
 * @param {string} [options.inline='nearest'] - Horizontal alignment
 */
export const scrollToElement = (selector, options = {}) => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  if (elements[0]) {
    elements[0].scrollIntoView({
      behavior: options.behavior || "smooth",
      block: options.block || "start",
      inline: options.inline || "nearest",
    });
  }
};

/**
 * Set scroll position of elements
 * @param {string|object|Array} selector - The selector or element(s)
 * @param {number} position - Scroll top position
 */
export const setScrollTop = (selector, position) => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  elements.forEach(item => {
    item.scrollTop = position;
  });
};

/**
 * Set horizontal scroll position of elements
 * @param {string|object|Array} selector - The selector or element(s)
 * @param {number} position - Scroll left position
 */
export const setScrollLeft = (selector, position) => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  elements.forEach(item => {
    item.scrollLeft = position;
  });
};

/**
 * Get scroll height of first element
 * @param {string|object|Array} selector - The selector or element(s)
 * @returns {number} The scroll height
 */
export const getScrollHeight = selector => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  return elements[0] ? elements[0].scrollHeight : 0;
};

/**
 * Get scroll width of first element
 * @param {string|object|Array} selector - The selector or element(s)
 * @returns {number} The scroll width
 */
export const getScrollWidth = selector => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  return elements[0] ? elements[0].scrollWidth : 0;
};

/**
 * Set data attribute on elements
 * @param {string|object|Array} selector - The selector or element(s)
 * @param {string} key - Data attribute key
 * @param {string} value - Data attribute value
 */
export const setData = (selector, key, value) => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  elements.forEach(item => {
    item.dataset[key] = value;
  });
};

/**
 * Get data attribute from first element
 * @param {string|object|Array} selector - The selector or element(s)
 * @param {string} key - Data attribute key
 * @returns {string} The data attribute value
 */
export const getData = (selector, key) => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  return elements[0] ? elements[0].dataset[key] : undefined;
};

/**
 * Remove data attribute from elements
 * @param {string|object|Array} selector - The selector or element(s)
 * @param {string} key - Data attribute key to remove
 */
export const removeData = (selector, key) => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  elements.forEach(item => {
    delete item.dataset[key];
  });
};

/**
 * Get parent element of first element
 * @param {string|object|Array} selector - The selector or element(s)
 * @returns {Element|null} The parent element
 */
export const getParent = selector => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  return elements[0] ? elements[0].parentElement : null;
};

/**
 * Get children elements of first element
 * @param {string|object|Array} selector - The selector or element(s)
 * @returns {Array} Array of child elements
 */
export const getChildren = selector => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  return elements[0] ? Array.from(elements[0].children) : [];
};

/**
 * Get sibling elements of first element
 * @param {string|object|Array} selector - The selector or element(s)
 * @returns {Array} Array of sibling elements
 */
export const getSiblings = selector => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  if (!elements[0] || !elements[0].parentElement) return [];

  return Array.from(elements[0].parentElement.children).filter(
    child => child !== elements[0]
  );
};

/**
 * Get next sibling element of first element
 * @param {string|object|Array} selector - The selector or element(s)
 * @returns {Element|null} The next sibling element
 */
export const getNext = selector => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  return elements[0] ? elements[0].nextElementSibling : null;
};

/**
 * Get previous sibling element of first element
 * @param {string|object|Array} selector - The selector or element(s)
 * @returns {Element|null} The previous sibling element
 */
export const getPrevious = selector => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  return elements[0] ? elements[0].previousElementSibling : null;
};

/**
 * Find elements within first element
 * @param {string|object|Array} selector - The selector or element(s)
 * @param {string} childSelector - Selector for child elements
 * @returns {Array} Array of found elements
 */
export const findElements = (selector, childSelector) => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  if (!elements[0]) return [];

  return Array.from(elements[0].querySelectorAll(childSelector));
};

/**
 * Clear form elements (reset values)
 * @param {string|object|Array} selector - The selector or element(s)
 */
export const clearForm = selector => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  elements.forEach(form => {
    if (form.tagName === "FORM") {
      Array.from(form.elements).forEach(element => {
        if (element.type === "checkbox" || element.type === "radio") {
          element.checked = false;
        } else if (element.tagName === "SELECT") {
          element.selectedIndex = -1;
        } else {
          element.value = "";
        }
      });
    }
  });
};

/**
 * Serialize form data to object
 * @param {string|object|Array} selector - The selector or element(s)
 * @returns {object} Form data as object
 */
export const serializeForm = selector => {
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

/**
 * Reset form elements to default values
 * @param {string|object|Array} selector - The selector or element(s)
 */
export const resetForm = selector => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  elements.forEach(form => {
    if (form.tagName === "FORM") {
      form.reset();
    }
  });
};

/**
 * Fade in elements with opacity transition
 * @param {string|object|Array} selector - The selector or element(s)
 * @param {number} [duration=300] - Animation duration in milliseconds
 */
export const fadeIn = (selector, duration = 300) => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  elements.forEach(item => {
    item.style.opacity = "0";
    item.style.display = "";
    item.style.transition = `opacity ${duration}ms ease`;

    // Trigger reflow
    item.offsetHeight;

    item.style.opacity = "1";

    setTimeout(() => {
      item.style.transition = "";
    }, duration);
  });
};

/**
 * Fade out elements with opacity transition
 * @param {string|object|Array} selector - The selector or element(s)
 * @param {number} [duration=300] - Animation duration in milliseconds
 */
export const fadeOut = (selector, duration = 300) => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  elements.forEach(item => {
    item.style.transition = `opacity ${duration}ms ease`;
    item.style.opacity = "0";

    setTimeout(() => {
      item.style.display = "none";
      item.style.transition = "";
    }, duration);
  });
};

/**
 * Slide up elements (hide with height transition)
 * @param {string|object|Array} selector - The selector or element(s)
 * @param {number} [duration=300] - Animation duration in milliseconds
 */
export const slideUp = (selector, duration = 300) => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  elements.forEach(item => {
    const height = item.offsetHeight;
    item.style.transition = `height ${duration}ms ease`;
    item.style.height = height + "px";
    item.style.overflow = "hidden";

    // Trigger reflow
    item.offsetHeight;

    item.style.height = "0px";

    setTimeout(() => {
      item.style.display = "none";
      item.style.height = "";
      item.style.overflow = "";
      item.style.transition = "";
    }, duration);
  });
};

/**
 * Slide down elements (show with height transition)
 * @param {string|object|Array} selector - The selector or element(s)
 * @param {number} [duration=300] - Animation duration in milliseconds
 */
export const slideDown = (selector, duration = 300) => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  elements.forEach(item => {
    item.style.display = "";
    const height = item.offsetHeight;
    item.style.height = "0px";
    item.style.overflow = "hidden";
    item.style.transition = `height ${duration}ms ease`;

    // Trigger reflow
    item.offsetHeight;

    item.style.height = height + "px";

    setTimeout(() => {
      item.style.height = "";
      item.style.overflow = "";
      item.style.transition = "";
    }, duration);
  });
};

/**
 * Insert text at cursor position in input/textarea elements
 * @param {string|object|Array} selector - The selector or element(s)
 * @param {string} text - Text to insert
 */
export const insertTextAtCursor = (selector, text) => {
  const elements = Array.isArray(selector) ? selector : getElements(selector);
  elements.forEach(item => {
    if (item.tagName === "INPUT" || item.tagName === "TEXTAREA") {
      const start = item.selectionStart;
      const end = item.selectionEnd;
      const currentValue = item.value;

      item.value =
        currentValue.substring(0, start) + text + currentValue.substring(end);
      item.selectionStart = item.selectionEnd = start + text.length;
      item.focus();
    }
  });
};
