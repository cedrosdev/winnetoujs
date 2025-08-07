// Type definitions for WinnetouJS - Select Module (DOM Manipulation)
/// <reference path="./common.d.ts" />

/**
 * Gets elements from the DOM based on a selector string.
 * It supports various selector formats including IDs, classes, and tag names.
 * @param selector The selector string to find elements in the DOM or a DOM element object.
 * @returns Array of DOM elements
 */
export declare function getElements(
  selector: WinnetouJS.SelectorType
): Element[];

/**
 * Remove elements from the DOM
 * @param selector The selector or element(s)
 */
export declare function removeElements(selector: WinnetouJS.SelectorType): void;

/**
 * Set inner html of elements
 * @param selector The selector or element(s)
 * @param htmlContentString The html string to be inserted
 */
export declare function setHtml(
  selector: WinnetouJS.SelectorType,
  htmlContentString: string
): void;

/**
 * Get the inner html of first element
 * @param selector The selector or element(s)
 * @returns The innerHTML of the first element
 */
export declare function getHtml(selector: WinnetouJS.SelectorType): string;

/**
 * Get inner text of first element
 * @param selector The selector or element(s)
 * @returns The textContent of the first element
 */
export declare function getText(selector: WinnetouJS.SelectorType): string;

/**
 * Append html to the end of elements' html
 * @param selector The selector or element(s)
 * @param htmlContentString The html string to be inserted
 */
export declare function appendHtml(
  selector: WinnetouJS.SelectorType,
  htmlContentString: string
): void;

/**
 * Prepend html to the start of elements' html
 * @param selector The selector or element(s)
 * @param htmlContentString The html string to be inserted
 */
export declare function prependHtml(
  selector: WinnetouJS.SelectorType,
  htmlContentString: string
): void;

/**
 * Changes the css of elements
 * @param selector The selector or element(s)
 * @param property The Style object represents an individual style statement.
 * @param value The value. If it is a number, winnetou will assume that it's a short hand to 'px'.
 */
export declare function setCss(
  selector: WinnetouJS.SelectorType,
  property: string | number,
  value: string | number
): void;

/**
 * Add the class if not added yet, remove the class if already added.
 * @param selector The selector or element(s)
 * @param className Name of class
 */
export declare function toggleClass(
  selector: WinnetouJS.SelectorType,
  className: string
): void;

/**
 * Add a class to elements
 * @param selector The selector or element(s)
 * @param className Name of class
 */
export declare function addClass(
  selector: WinnetouJS.SelectorType,
  className: string
): void;

/**
 * Remove a class from elements
 * @param selector The selector or element(s)
 * @param className Name of class
 */
export declare function removeClass(
  selector: WinnetouJS.SelectorType,
  className: string
): void;

/**
 * Hide elements
 * @param selector The selector or element(s)
 */
export declare function hideElements(selector: WinnetouJS.SelectorType): void;

/**
 * Show elements
 * @param selector The selector or element(s)
 */
export declare function showElements(selector: WinnetouJS.SelectorType): void;

/**
 * Get width of first element
 * @param selector The selector or element(s)
 * @returns The width of the first element
 */
export declare function getWidth(selector: WinnetouJS.SelectorType): number;

/**
 * Get height of first element
 * @param selector The selector or element(s)
 * @returns The height of the first element
 */
export declare function getHeight(selector: WinnetouJS.SelectorType): number;

/**
 * Get left position of first element
 * @param selector The selector or element(s)
 * @returns The left position of the first element
 */
export declare function getLeft(selector: WinnetouJS.SelectorType): number;

/**
 * Get top position of first element
 * @param selector The selector or element(s)
 * @returns The top position of the first element
 */
export declare function getTop(selector: WinnetouJS.SelectorType): number;

/**
 * Get global position of first element
 * @param selector The selector or element(s)
 * @returns The bounding rectangle of the first element
 */
export declare function getGlobalPosition(
  selector: WinnetouJS.SelectorType
): DOMRect;

/**
 * Get value of first element
 * @param selector The selector or element(s)
 * @returns The value of the first element
 */
export declare function getValue(selector: WinnetouJS.SelectorType): string;

/**
 * Set value to elements, also fire a change event
 * @param selector The selector or element(s)
 * @param value The value
 */
export declare function setValue(
  selector: WinnetouJS.SelectorType,
  value: string
): void;

/**
 * Set an attribute to elements
 * @param selector The selector or element(s)
 * @param attr Name of attribute
 * @param value The values
 */
export declare function setAttr(
  selector: WinnetouJS.SelectorType,
  attr: string,
  value: string
): void;

/**
 * Get an attribute from first element
 * @param selector The selector or element(s)
 * @param attr Attribute name
 * @returns The attribute value
 */
export declare function getAttr(
  selector: WinnetouJS.SelectorType,
  attr: string
): string;

/**
 * Check if first element is checked
 * @param selector The selector or element(s)
 * @returns Whether the first element is checked
 */
export declare function isChecked(selector: WinnetouJS.SelectorType): boolean;

/**
 * Get the file of first input type file element
 * @param selector The selector or element(s)
 * @returns The first file
 */
export declare function getFile(
  selector: WinnetouJS.SelectorType
): WinnetouJS.FileObject;

/**
 * Get file array of first input type file element
 * @param selector The selector or element(s)
 * @returns Array of files
 */
export declare function getFiles(
  selector: WinnetouJS.SelectorType
): WinnetouJS.FileObject[];

/**
 * Get scrollTop of first element
 * @param selector The selector or element(s)
 * @returns The scrollTop value
 */
export declare function getScrollTop(selector: WinnetouJS.SelectorType): number;

/**
 * Disable first element
 * @param selector The selector or element(s)
 */
export declare function disableElement(selector: WinnetouJS.SelectorType): void;

/**
 * Enable first element
 * @param selector The selector or element(s)
 */
export declare function enableElement(selector: WinnetouJS.SelectorType): void;

/**
 * Set text content of elements (safer than innerHTML)
 * @param selector The selector or element(s)
 * @param text The text content to set
 */
export declare function setText(
  selector: WinnetouJS.SelectorType,
  text: string
): void;

/**
 * Add event listener to elements
 * @param selector The selector or element(s)
 * @param event The event type (e.g., 'click', 'change')
 * @param handler The event handler function
 * @param options Event listener options
 */
export declare function addEventListener(
  selector: WinnetouJS.SelectorType,
  event: string,
  handler: EventListener,
  options?: WinnetouJS.EventListenerOptions
): void;

/**
 * Remove event listener from elements
 * @param selector The selector or element(s)
 * @param event The event type
 * @param handler The event handler function
 */
export declare function removeEventListener(
  selector: WinnetouJS.SelectorType,
  event: string,
  handler: EventListener
): void;

/**
 * Add click event listener to elements
 * @param selector The selector or element(s)
 * @param handler The click handler function
 */
export declare function onClick(
  selector: WinnetouJS.SelectorType,
  handler: EventListener
): void;

/**
 * Add submit event listener to elements
 * @param selector The selector or element(s)
 * @param handler The submit handler function
 */
export declare function onSubmit(
  selector: WinnetouJS.SelectorType,
  handler: EventListener
): void;

/**
 * Add change event listener to elements
 * @param selector The selector or element(s)
 * @param handler The change handler function
 */
export declare function onChange(
  selector: WinnetouJS.SelectorType,
  handler: EventListener
): void;

/**
 * Add input event listener to elements
 * @param selector The selector or element(s)
 * @param handler The input handler function
 */
export declare function onInput(
  selector: WinnetouJS.SelectorType,
  handler: EventListener
): void;

/**
 * Add focus event listener to elements
 * @param selector The selector or element(s)
 * @param handler The focus handler function
 */
export declare function onFocus(
  selector: WinnetouJS.SelectorType,
  handler: EventListener
): void;

/**
 * Add blur event listener to elements
 * @param selector The selector or element(s)
 * @param handler The blur handler function
 */
export declare function onBlur(
  selector: WinnetouJS.SelectorType,
  handler: EventListener
): void;

/**
 * Add keypress event listener to elements
 * @param selector The selector or element(s)
 * @param handler The keypress handler function
 */
export declare function onKeyPress(
  selector: WinnetouJS.SelectorType,
  handler: EventListener
): void;

/**
 * Add keydown event listener to elements
 * @param selector The selector or element(s)
 * @param handler The keydown handler function
 */
export declare function onKeyDown(
  selector: WinnetouJS.SelectorType,
  handler: EventListener
): void;

/**
 * Add keyup event listener to elements
 * @param selector The selector or element(s)
 * @param handler The keyup handler function
 */
export declare function onKeyUp(
  selector: WinnetouJS.SelectorType,
  handler: EventListener
): void;

/**
 * Add mouseover event listener to elements
 * @param selector The selector or element(s)
 * @param handler The mouseover handler function
 */
export declare function onMouseOver(
  selector: WinnetouJS.SelectorType,
  handler: EventListener
): void;

/**
 * Add mouseout event listener to elements
 * @param selector The selector or element(s)
 * @param handler The mouseout handler function
 */
export declare function onMouseOut(
  selector: WinnetouJS.SelectorType,
  handler: EventListener
): void;

/**
 * Add mouseenter event listener to elements
 * @param selector The selector or element(s)
 * @param handler The mouseenter handler function
 */
export declare function onMouseEnter(
  selector: WinnetouJS.SelectorType,
  handler: EventListener
): void;

/**
 * Add mouseleave event listener to elements
 * @param selector The selector or element(s)
 * @param handler The mouseleave handler function
 */
export declare function onMouseLeave(
  selector: WinnetouJS.SelectorType,
  handler: EventListener
): void;

/**
 * Focus first element
 * @param selector The selector or element(s)
 */
export declare function focusElement(selector: WinnetouJS.SelectorType): void;

/**
 * Blur first element
 * @param selector The selector or element(s)
 */
export declare function blurElement(selector: WinnetouJS.SelectorType): void;

/**
 * Select text content of first element
 * @param selector The selector or element(s)
 */
export declare function selectText(selector: WinnetouJS.SelectorType): void;

/**
 * Clone elements
 * @param selector The selector or element(s)
 * @param deep Whether to clone deeply
 * @returns Array of cloned elements
 */
export declare function cloneElements(
  selector: WinnetouJS.SelectorType,
  deep?: boolean
): Element[];

/**
 * Insert content before elements
 * @param selector The selector or element(s)
 * @param content Content to insert
 */
export declare function insertBefore(
  selector: WinnetouJS.SelectorType,
  content: string | Element
): void;

/**
 * Insert content after elements
 * @param selector The selector or element(s)
 * @param content Content to insert
 */
export declare function insertAfter(
  selector: WinnetouJS.SelectorType,
  content: string | Element
): void;

/**
 * Replace elements with new content
 * @param selector The selector or element(s)
 * @param newContent New content to replace with
 */
export declare function replaceElements(
  selector: WinnetouJS.SelectorType,
  newContent: string | Element
): void;

/**
 * Check if first element is visible
 * @param selector The selector or element(s)
 * @returns Whether the element is visible
 */
export declare function isVisible(selector: WinnetouJS.SelectorType): boolean;

/**
 * Check if first element is hidden
 * @param selector The selector or element(s)
 * @returns Whether the element is hidden
 */
export declare function isHidden(selector: WinnetouJS.SelectorType): boolean;

/**
 * Check if elements exist in DOM
 * @param selector The selector or element(s)
 * @returns Whether elements exist
 */
export declare function exists(selector: WinnetouJS.SelectorType): boolean;

/**
 * Check if first element has a class
 * @param selector The selector or element(s)
 * @param className Class name to check
 * @returns Whether the element has the class
 */
export declare function hasClass(
  selector: WinnetouJS.SelectorType,
  className: string
): boolean;

/**
 * Check if parent contains child element
 * @param parentSelector The parent selector or element(s)
 * @param childSelector The child selector or element(s)
 * @returns Whether parent contains child
 */
export declare function contains(
  parentSelector: WinnetouJS.SelectorType,
  childSelector: WinnetouJS.SelectorType
): boolean;

/**
 * Scroll to element smoothly
 * @param selector The selector or element(s)
 * @param options Scroll options
 */
export declare function scrollToElement(
  selector: WinnetouJS.SelectorType,
  options?: WinnetouJS.ScrollOptions
): void;

/**
 * Set scroll position of elements
 * @param selector The selector or element(s)
 * @param position Scroll top position
 */
export declare function setScrollTop(
  selector: WinnetouJS.SelectorType,
  position: number
): void;

/**
 * Set horizontal scroll position of elements
 * @param selector The selector or element(s)
 * @param position Scroll left position
 */
export declare function setScrollLeft(
  selector: WinnetouJS.SelectorType,
  position: number
): void;

/**
 * Get scroll height of first element
 * @param selector The selector or element(s)
 * @returns The scroll height
 */
export declare function getScrollHeight(
  selector: WinnetouJS.SelectorType
): number;

/**
 * Get scroll width of first element
 * @param selector The selector or element(s)
 * @returns The scroll width
 */
export declare function getScrollWidth(
  selector: WinnetouJS.SelectorType
): number;

/**
 * Set data attribute on elements
 * @param selector The selector or element(s)
 * @param key Data attribute key
 * @param value Data attribute value
 */
export declare function setData(
  selector: WinnetouJS.SelectorType,
  key: string,
  value: string
): void;

/**
 * Get data attribute from first element
 * @param selector The selector or element(s)
 * @param key Data attribute key
 * @returns The data attribute value
 */
export declare function getData(
  selector: WinnetouJS.SelectorType,
  key: string
): string | undefined;

/**
 * Remove data attribute from elements
 * @param selector The selector or element(s)
 * @param key Data attribute key to remove
 */
export declare function removeData(
  selector: WinnetouJS.SelectorType,
  key: string
): void;

/**
 * Get parent element of first element
 * @param selector The selector or element(s)
 * @returns The parent element
 */
export declare function getParent(
  selector: WinnetouJS.SelectorType
): Element | null;

/**
 * Get children elements of first element
 * @param selector The selector or element(s)
 * @returns Array of child elements
 */
export declare function getChildren(
  selector: WinnetouJS.SelectorType
): Element[];

/**
 * Get sibling elements of first element
 * @param selector The selector or element(s)
 * @returns Array of sibling elements
 */
export declare function getSiblings(
  selector: WinnetouJS.SelectorType
): Element[];

/**
 * Get next sibling element of first element
 * @param selector The selector or element(s)
 * @returns The next sibling element
 */
export declare function getNext(
  selector: WinnetouJS.SelectorType
): Element | null;

/**
 * Get previous sibling element of first element
 * @param selector The selector or element(s)
 * @returns The previous sibling element
 */
export declare function getPrevious(
  selector: WinnetouJS.SelectorType
): Element | null;

/**
 * Find elements within first element
 * @param selector The selector or element(s)
 * @param childSelector Selector for child elements
 * @returns Array of found elements
 */
export declare function findElements(
  selector: WinnetouJS.SelectorType,
  childSelector: string
): Element[];

/**
 * Clear form elements (reset values)
 * @param selector The selector or element(s)
 */
export declare function clearForm(selector: WinnetouJS.SelectorType): void;

/**
 * Serialize form data to object
 * @param selector The selector or element(s)
 * @returns Form data as object
 */
export declare function serializeForm(
  selector: WinnetouJS.SelectorType
): Record<string, any>;

/**
 * Reset form elements to default values
 * @param selector The selector or element(s)
 */
export declare function resetForm(selector: WinnetouJS.SelectorType): void;

/**
 * Fade in elements with opacity transition
 * @param selector The selector or element(s)
 * @param duration Animation duration in milliseconds
 */
export declare function fadeIn(
  selector: WinnetouJS.SelectorType,
  duration?: number
): void;

/**
 * Fade out elements with opacity transition
 * @param selector The selector or element(s)
 * @param duration Animation duration in milliseconds
 */
export declare function fadeOut(
  selector: WinnetouJS.SelectorType,
  duration?: number
): void;

/**
 * Slide up elements (hide with height transition)
 * @param selector The selector or element(s)
 * @param duration Animation duration in milliseconds
 */
export declare function slideUp(
  selector: WinnetouJS.SelectorType,
  duration?: number
): void;

/**
 * Slide down elements (show with height transition)
 * @param selector The selector or element(s)
 * @param duration Animation duration in milliseconds
 */
export declare function slideDown(
  selector: WinnetouJS.SelectorType,
  duration?: number
): void;

/**
 * Insert text at cursor position in input/textarea elements
 * @param selector The selector or element(s)
 * @param text Text to insert
 */
export declare function insertTextAtCursor(
  selector: WinnetouJS.SelectorType,
  text: string
): void;
