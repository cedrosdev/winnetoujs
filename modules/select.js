/**
 * Selects elements from the DOM based on a selector string.
 * It supports various selector formats including IDs, classes, and tag names.
 * 
 * @param {string} selector - The selector string to find elements in the DOM. 
 */
export const select = selector => {
  var el;
  const obj = {
    /**
     * @param {any} selector
     */
    getEl(selector) {
      if (el) return el;
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
    },
    /**
     * remove constructo from the DOM
     */
    remove() {
      el.forEach(item => {
        item.remove();
      });

      return this;
    },
    /**
     * set inner html of constructo
     * @param {string} htmlContentString the html string to be inserted
     */
    html(htmlContentString) {
      el.forEach(item => {
        item.innerHTML = htmlContentString;
      });
      return this;
    },
    /**
     * get the inner html of constructo
     */
    getHtml() {
      return el[0].innerHTML;
    },
    /**
     * get inner text of constructo
     */
    getText() {
      return el[0].textContent;
    },
    /**
     * append html to the end of constructo's html
     * @param {string} htmlContentString the html string to be inserted
     */
    append(htmlContentString) {
      el.forEach(item => {
        item.innerHTML += htmlContentString;
      });
      return this;
    },
    /**
     * prepend html to the start of constructo's html
     * @param {string} htmlContentString the html string to be inserted
     */
    prepend(htmlContentString) {
      // el.innerHTML = texto + el.innerHTML;
      el.forEach(item => {
        item.innerHTML = htmlContentString + item.innerHTML;
      });
      return this;
    },
    /**
     * Changes the css of constructo or DOM component
     * @tutorial https://www.w3schools.com/JSREF/dom_obj_style.asp
     * @param {string | number} property The Style object represents an individual style statement.
     * @param {string | number} value The value. If it is a number, winnetou will assume that it's a short hand to 'px'.
     */
    css(property, value) {
      let valueString = value;
      el.forEach(item => {
        if (typeof value == "number") valueString = value + "px";
        item.style[property] = valueString;
      });
      return this;
    },
    /**
     * Add the class if not added yet, remove the class if already added.
     * @param {string} className name of class
     */
    toggleClass(className) {
      el.forEach(item => {
        item.classList.toggle(className);
      });
      return this;
    },
    /**
     * Add a class
     * @param {string} className name of class
     */
    addClass(className) {
      el.forEach(item => {
        item.classList.add(className);
      });
      return this;
    },
    /**
     * Removes a class
     * @param {string} className name of class
     */
    removeClass(className) {
      el.forEach(item => {
        item.classList.remove(className);
      });
      return this;
    },
    /**
     * Hide a constructo
     */
    hide() {
      el.forEach(item => {
        item.classList.add("winnetou_display_none");
      });
      return this;
    },
    /**
     * Show a constructo
     */
    show() {
      el.forEach(item => {
        item.classList.remove("winnetou_display_none");

        if (getComputedStyle(item).display == "none") {
          item.style.display = "initial";
        }
      });
      return this;
    },
    /**
     * Get width of a constructo
     */
    getWidth() {
      return el[0].getBoundingClientRect().width;
    },
    /**
     * Get height of a constructo
     */
    getHeight() {
      return el[0].getBoundingClientRect().height;
    },
    /**
     * Get left of a constructo
     */
    getLeft() {
      return el[0].offsetLeft;
    },
    /**
     * Get top of a constructo
     */
    getTop() {
      return el[0].offsetTop;
    },
    /**
     * Get global position of a constructo
     */
    getGlobalPosition() {
      return el[0].getBoundingClientRect();
    },
    /**
     * Get value of a constructo
     */
    getVal() {
      return el[0].value;
    },
    /**
     * Sets a value to a constructo, also fire a change event
     * @param {string} value The value.
     */
    setVal(value) {
      el.forEach(item => {
        item.value = value;
        if ("createEvent" in document) {
          var evt = document.createEvent("HTMLEvents");
          evt.initEvent("change", false, true);
          item.dispatchEvent(evt);
        } else item.fireEvent("onchange");
      });
      return this;
    },
    /**
     * Sets an attr to a constructo
     * @param  {string} attr name of attribute
     * @param  {string} value the values
     */
    setAttr(attr, value) {
      el.forEach(item => {
        item.setAttribute(attr, value);
      });
      return this;
    },
    /**
     * Gets the attr
     * @param  {string} attr attribute name
     */
    getAttr(attr) {
      return el[0].getAttribute(attr);
    },
    /**
     * Returns checked property of a constructo
     */
    isChecked() {
      return el[0].checked;
    },
    /**
     * Gets the file of a input type file
     *
     * @typedef {Object} File_
     * @property {number} lastModified
     * @property {Date} lastModifiedDate
     * @property {string} name
     * @property {number} size
     * @property {string} type
     *
     * @returns {File_}
     */
    getFile() {
      return el[0].files[0];
    },
    /**
     * Gets file array of a input type file
     *
     * @returns {Array.<File_>}
     */
    getFiles() {
      return el[0].files;
    },
    /**
     * get scrollTop of a constructo
     */
    getScrollTop() {
      return el[0].scrollTop;
    },

    disable() {
      el[0].disabled = true;
      return this;
    },

    enable() {
      el[0].disabled = false;
      return this;
    },
  };
  el = obj.getEl(selector);
  return obj;
};
