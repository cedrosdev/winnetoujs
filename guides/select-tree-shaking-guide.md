# Select Module - Tree-Shakable Functions

The `select.js` module provides tree-shakable DOM manipulation functions. Each function can be imported individually, allowing bundlers to only include the functions you actually use, significantly reducing bundle size.

## Available Functions

### Core Functions

- `getElements(selector)` - Get DOM elements by selector

### DOM Manipulation

- `removeElements(selector)` - Remove elements from DOM
- `setHtml(selector, html)` - Set innerHTML
- `getHtml(selector)` - Get innerHTML of first element
- `getText(selector)` - Get textContent of first element
- `setText(selector, text)` - Set textContent (safer than innerHTML)
- `appendHtml(selector, html)` - Append HTML to elements
- `prependHtml(selector, html)` - Prepend HTML to elements
- `cloneElements(selector, deep)` - Clone elements
- `insertBefore(selector, content)` - Insert content before elements
- `insertAfter(selector, content)` - Insert content after elements
- `replaceElements(selector, newContent)` - Replace elements with new content

### Event Handling

- `addEventListener(selector, event, handler, options)` - Add event listener
- `removeEventListener(selector, event, handler)` - Remove event listener
- `onClick(selector, handler)` - Add click event listener
- `onSubmit(selector, handler)` - Add submit event listener
- `onChange(selector, handler)` - Add change event listener
- `onInput(selector, handler)` - Add input event listener
- `onFocus(selector, handler)` - Add focus event listener
- `onBlur(selector, handler)` - Add blur event listener
- `onKeyPress(selector, handler)` - Add keypress event listener
- `onKeyDown(selector, handler)` - Add keydown event listener
- `onKeyUp(selector, handler)` - Add keyup event listener
- `onMouseOver(selector, handler)` - Add mouseover event listener
- `onMouseOut(selector, handler)` - Add mouseout event listener
- `onMouseEnter(selector, handler)` - Add mouseenter event listener
- `onMouseLeave(selector, handler)` - Add mouseleave event listener

### Focus Management

- `focusElement(selector)` - Focus first element
- `blurElement(selector)` - Blur first element
- `selectText(selector)` - Select text content of first element
- `insertTextAtCursor(selector, text)` - Insert text at cursor position

### Styling and Classes

- `setCss(selector, property, value)` - Set CSS property
- `addClass(selector, className)` - Add class
- `removeClass(selector, className)` - Remove class
- `toggleClass(selector, className)` - Toggle class
- `hideElements(selector)` - Hide elements
- `showElements(selector)` - Show elements

### Element State Checks

- `isVisible(selector)` - Check if first element is visible
- `isHidden(selector)` - Check if first element is hidden
- `exists(selector)` - Check if elements exist in DOM
- `hasClass(selector, className)` - Check if first element has class
- `contains(parentSelector, childSelector)` - Check if parent contains child

### Animations

- `fadeIn(selector, duration)` - Fade in elements with opacity transition
- `fadeOut(selector, duration)` - Fade out elements with opacity transition
- `slideUp(selector, duration)` - Slide up elements (hide with height transition)
- `slideDown(selector, duration)` - Slide down elements (show with height transition)

### Dimensions and Positioning

- `getWidth(selector)` - Get width of first element
- `getHeight(selector)` - Get height of first element
- `getLeft(selector)` - Get left position of first element
- `getTop(selector)` - Get top position of first element
- `getGlobalPosition(selector)` - Get bounding rectangle of first element

### Form Elements

- `getValue(selector)` - Get value of first element
- `setValue(selector, value)` - Set value and trigger change event
- `isChecked(selector)` - Check if first element is checked
- `disableElement(selector)` - Disable first element
- `enableElement(selector)` - Enable first element
- `clearForm(selector)` - Clear all form values
- `serializeForm(selector)` - Serialize form data to object
- `resetForm(selector)` - Reset form to default values

### Attributes

- `setAttr(selector, attr, value)` - Set attribute
- `getAttr(selector, attr)` - Get attribute from first element

### Data Attributes

- `setData(selector, key, value)` - Set data attribute
- `getData(selector, key)` - Get data attribute from first element
- `removeData(selector, key)` - Remove data attribute

### Element Relationships

- `getParent(selector)` - Get parent element of first element
- `getChildren(selector)` - Get children elements of first element
- `getSiblings(selector)` - Get sibling elements of first element
- `getNext(selector)` - Get next sibling element
- `getPrevious(selector)` - Get previous sibling element
- `findElements(selector, childSelector)` - Find elements within first element

### File Input

- `getFile(selector)` - Get first file from input[type="file"]
- `getFiles(selector)` - Get all files from input[type="file"]

### Scrolling

- `getScrollTop(selector)` - Get scrollTop value of first element
- `setScrollTop(selector, position)` - Set scroll top position
- `setScrollLeft(selector, position)` - Set scroll left position
- `getScrollHeight(selector)` - Get scroll height of first element
- `getScrollWidth(selector)` - Get scroll width of first element
- `scrollToElement(selector, options)` - Scroll to element smoothly

## Usage Examples

### Basic Functions

```javascript
// Import only what you need
import { addClass, setValue, hideElements, setText } from "./modules/select.js";

// Use standalone functions
addClass("#myElement", "active");
setValue("#myElement", "Hello");
setText("#title", "Safe text content"); // XSS-safe alternative to setHtml
hideElements("#myElement");
```

### Event Handling

```javascript
import { onClick, onChange, onKeyDown } from "./modules/select.js";

// Add event listeners easily
onClick("#submit-btn", event => {
  console.log("Button clicked!");
});

onChange("#username", event => {
  console.log("Username changed:", event.target.value);
});

onKeyDown("#search-input", event => {
  if (event.key === "Enter") {
    performSearch();
  }
});
```

### Form Management

```javascript
import { serializeForm, clearForm, resetForm } from "./modules/select.js";

// Get form data as object
const formData = serializeForm("#contact-form");
console.log(formData); // { name: "John", email: "john@example.com" }

// Clear all form fields
clearForm("#contact-form");

// Reset form to default values
resetForm("#contact-form");
```

### Animations and Effects

```javascript
import {
  fadeIn,
  fadeOut,
  slideDown,
  scrollToElement,
} from "./modules/select.js";

// Smooth animations
fadeIn(".popup", 500); // Fade in over 500ms
fadeOut(".notification", 300); // Fade out over 300ms
slideDown(".dropdown-menu", 400); // Slide down animation

// Smooth scrolling
scrollToElement("#section2", { behavior: "smooth", block: "center" });
```

### Element State and Relationships

```javascript
import {
  exists,
  isVisible,
  hasClass,
  getParent,
  getChildren,
  findElements,
} from "./modules/select.js";

// Check element state
if (exists("#my-element") && isVisible("#my-element")) {
  console.log("Element exists and is visible");
}

if (hasClass("#button", "disabled")) {
  console.log("Button is disabled");
}

// Navigate DOM relationships
const parent = getParent("#child-element");
const children = getChildren("#parent-element");
const buttons = findElements("#container", "button");
```

### Working with Multiple Elements

```javascript
import { getElements, addClass, setText, onClick } from "./modules/select.js";

// Get elements once and reuse
const elements = getElements(".my-class");
addClass(elements, "active");
setText(elements, "Updated text");

// Or pass selector directly to each function
addClass(".my-class", "active");
setText(".my-class", "Updated text");

// Add event listeners to multiple elements
onClick(".button", event => {
  console.log("Button clicked:", event.target.textContent);
});
```

### Advanced DOM Manipulation

```javascript
import {
  cloneElements,
  insertAfter,
  replaceElements,
  contains,
} from "./modules/select.js";

// Clone elements
const clonedElements = cloneElements("#template", true);

// Insert content
insertAfter("#target", "<div>New content after target</div>");

// Replace elements
replaceElements("#old-element", "<div>New replacement element</div>");

// Check relationships
if (contains("#parent", "#child")) {
  console.log("Parent contains child");
}
```

### Focus and Text Management

```javascript
import {
  focusElement,
  selectText,
  insertTextAtCursor,
} from "./modules/select.js";

// Focus management
focusElement("#username-input");
selectText("#text-area"); // Select all text

// Insert text at cursor position
insertTextAtCursor("#editor", "Hello World!");
```

### Data Attributes and Storage

```javascript
import { setData, getData, removeData } from "./modules/select.js";

// Work with data attributes
setData("#element", "userId", "12345");
const userId = getData("#element", "userId");
removeData("#element", "userId");
```

### Chaining Operations Functionally

```javascript
import { addClass, setCss, fadeIn, focusElement } from "./modules/select.js";

// Create reusable functions that combine multiple operations
const showModal = selector => {
  addClass(selector, "active");
  setCss(selector, "display", "block");
  fadeIn(selector, 300);
  focusElement(selector + " input:first-child");
};

const hideModal = selector => {
  removeClass(selector, "active");
  fadeOut(selector, 300);
};

// Use the composed functions
showModal("#login-modal");
hideModal("#login-modal");
```

## Benefits

1. **Optimal bundle size**: Only include functions you actually use - import exactly what you need
2. **Better tree-shaking**: Bundlers can eliminate unused code completely, reducing final bundle size
3. **Comprehensive functionality**: Complete DOM manipulation library covering all common use cases
4. **Event handling made easy**: Simple, consistent API for all event types
5. **Built-in animations**: Smooth transitions without external animation libraries
6. **XSS protection**: Safe text manipulation with `setText` vs `setHtml`
7. **Form utilities**: Complete form handling with serialization and validation helpers
8. **Modern API**: Clean, functional programming approach with predictable naming
9. **Zero dependencies**: Pure JavaScript with no external dependencies
10. **Better performance**: No object wrapper overhead, direct DOM manipulation

## Key Features

- **🎯 Event Management**: Complete event handling system with shortcuts for common events
- **✨ Animations**: Built-in fade/slide effects using CSS transitions
- **📋 Form Handling**: Serialize, clear, reset forms with ease
- **🔍 Element Queries**: Check visibility, existence, relationships
- **🎨 Styling**: CSS manipulation, class management, show/hide
- **📐 Measurements**: Get dimensions, positions, scroll properties
- **🌳 DOM Navigation**: Parent, children, siblings, find elements
- **💾 Data Storage**: Data attribute management
- **🎯 Focus Control**: Focus management and text selection
- **🔄 DOM Manipulation**: Clone, insert, replace, remove elements

## Function Parameters

All standalone functions accept:

- `selector`: Can be a CSS selector string, DOM element object, or array of DOM elements
- Additional parameters specific to each function

The functions automatically resolve selectors to DOM elements internally, so you can pass any valid selector format that the original `getElements` function supports.

### Parameter Examples

```javascript
// CSS selectors
onClick("#button", handler); // ID selector
onClick(".buttons", handler); // Class selector
onClick("button", handler); // Tag selector
onClick("input[type='text']", handler); // Attribute selector

// DOM elements
const element = document.getElementById("myButton");
onClick(element, handler);

// Arrays of elements
const elements = document.querySelectorAll(".buttons");
onClick(elements, handler);

// Multiple elements from getElements
const myElements = getElements(".my-class");
addClass(myElements, "active");
```

### Common Function Signatures

```javascript
// Event functions
onClick(selector, handlerFunction);
addEventListener(selector, eventType, handlerFunction, options);

// Content functions
setText(selector, textString);
setHtml(selector, htmlString);
appendHtml(selector, htmlString);

// Style functions
setCss(selector, property, value);
addClass(selector, className);
fadeIn(selector, durationInMs);

// Form functions
setValue(selector, value);
serializeForm(selector); // Returns object

// Query functions
exists(selector); // Returns boolean
hasClass(selector, className); // Returns boolean
getWidth(selector); // Returns number
```

## Migration from Other Libraries

### From jQuery

```javascript
// jQuery → WinnetouJS
$('#button').click(handler)          → onClick('#button', handler)
$('#element').text('Hello')          → setText('#element', 'Hello')
$('#element').html('<b>Hello</b>')   → setHtml('#element', '<b>Hello</b>')
$('#element').addClass('active')     → addClass('#element', 'active')
$('#element').fadeIn()               → fadeIn('#element')
$('#form').serialize()               → serializeForm('#form')
$('#element').focus()                → focusElement('#element')
```

### Performance Comparison

WinnetouJS select functions are typically faster than jQuery equivalents because:

- No object wrapper creation overhead
- Direct DOM API calls
- Tree-shakable (smaller bundle size)
- No compatibility layers for old browsers
