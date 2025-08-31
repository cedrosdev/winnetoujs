---
applyTo: "**"
---

# Select Instructions

## DOM Element Selection

### getElements
```javascript
import { getElements } from "winnetoujs/modules/select";

let elements = getElements("#myButton");
let multipleElements = getElements(".item, .card");
```

### removeElements
```javascript
import { removeElements } from "winnetoujs/modules/select";

removeElements("#obsoleteDiv");
removeElements([element1, element2]);
```

## Content Manipulation

### setHtml
```javascript
import { setHtml } from "winnetoujs/modules/select";

setHtml("#container", "<p>New content</p>");
```

### getHtml
```javascript
import { getHtml } from "winnetoujs/modules/select";

let content = getHtml("#myDiv");
```

### getText
```javascript
import { getText } from "winnetoujs/modules/select";

let textContent = getText("#label");
```

### setText
```javascript
import { setText } from "winnetoujs/modules/select";

setText("#title", "New Title");
```

### appendHtml
```javascript
import { appendHtml } from "winnetoujs/modules/select";

appendHtml("#list", "<li>New item</li>");
```

### prependHtml
```javascript
import { prependHtml } from "winnetoujs/modules/select";

prependHtml("#container", "<header>Header</header>");
```

## CSS and Styling

### setCss
```javascript
import { setCss } from "winnetoujs/modules/select";

setCss("#button", "color", "yellow");
setCss(".item", "margin", 10);
```

### addClass
```javascript
import { addClass } from "winnetoujs/modules/select";

addClass("#element", "active");
```

### removeClass
```javascript
import { removeClass } from "winnetoujs/modules/select";

removeClass("#element", "hidden");
```

### toggleClass
```javascript
import { toggleClass } from "winnetoujs/modules/select";

toggleClass("#menu", "open");
```

### hasClass
```javascript
import { hasClass } from "winnetoujs/modules/select";

if (hasClass("#button", "disabled")) {
  // Handle disabled state
}
```

## Visibility Control

### hideElements
```javascript
import { hideElements } from "winnetoujs/modules/select";

hideElements("#modal");
```

### showElements
```javascript
import { showElements } from "winnetoujs/modules/select";

showElements("#dialog");
```

### isVisible
```javascript
import { isVisible } from "winnetoujs/modules/select";

if (isVisible("#popup")) {
  // Element is visible
}
```

### isHidden
```javascript
import { isHidden } from "winnetoujs/modules/select";

if (isHidden("#sidebar")) {
  // Element is hidden
}
```

## Dimensions and Position

### getWidth
```javascript
import { getWidth } from "winnetoujs/modules/select";

let width = getWidth("#container");
```

### getHeight
```javascript
import { getHeight } from "winnetoujs/modules/select";

let height = getHeight("#image");
```

### getLeft
```javascript
import { getLeft } from "winnetoujs/modules/select";

let leftPos = getLeft("#floatingDiv");
```

### getTop
```javascript
import { getTop } from "winnetoujs/modules/select";

let topPos = getTop("#header");
```

### getGlobalPosition
```javascript
import { getGlobalPosition } from "winnetoujs/modules/select";

let rect = getGlobalPosition("#element");
console.log(rect.x, rect.y, rect.width, rect.height);
```

## Form Elements

### getValue
```javascript
import { getValue } from "winnetoujs/modules/select";

let inputValue = getValue("#username");
```

### setValue
```javascript
import { setValue } from "winnetoujs/modules/select";

setValue("#email", "user@example.com");
```

### isChecked
```javascript
import { isChecked } from "winnetoujs/modules/select";

if (isChecked("#checkbox")) {
  // Checkbox is checked
}
```

### getFile
```javascript
import { getFile } from "winnetoujs/modules/select";

let file = getFile("#fileInput");
```

### getFiles
```javascript
import { getFiles } from "winnetoujs/modules/select";

let files = getFiles("#multipleFileInput");
```

### disableElement
```javascript
import { disableElement } from "winnetoujs/modules/select";

disableElement("#submitButton");
```

### enableElement
```javascript
import { enableElement } from "winnetoujs/modules/select";

enableElement("#submitButton");
```

### clearForm
```javascript
import { clearForm } from "winnetoujs/modules/select";

clearForm("#myForm");
```

### serializeForm
```javascript
import { serializeForm } from "winnetoujs/modules/select";

let formData = serializeForm("#userForm");
```

### resetForm
```javascript
import { resetForm } from "winnetoujs/modules/select";

resetForm("#contactForm");
```

## Attributes

### setAttr
```javascript
import { setAttr } from "winnetoujs/modules/select";

setAttr("#link", "href", "https://example.com");
```

### getAttr
```javascript
import { getAttr } from "winnetoujs/modules/select";

let href = getAttr("#link", "href");
```

### setData
```javascript
import { setData } from "winnetoujs/modules/select";

setData("#item", "userId", "123");
```

### getData
```javascript
import { getData } from "winnetoujs/modules/select";

let userId = getData("#item", "userId");
```

### removeData
```javascript
import { removeData } from "winnetoujs/modules/select";

removeData("#item", "tempId");
```

## Event Handling

### addEventListener
```javascript
import { addEventListener } from "winnetoujs/modules/select";

addEventListener("#button", "click", (e) => {
  console.log("Button clicked");
});
```

### removeEventListener
```javascript
import { removeEventListener } from "winnetoujs/modules/select";

removeEventListener("#button", "click", handler);
```

### onClick
```javascript
import { onClick } from "winnetoujs/modules/select";

onClick("#submitBtn", (e) => {
  e.preventDefault();
  // Handle click
});
```

### onChange
```javascript
import { onChange } from "winnetoujs/modules/select";

onChange("#select", (e) => {
  console.log("Selection changed:", e.target.value);
});
```

### onInput
```javascript
import { onInput } from "winnetoujs/modules/select";

onInput("#searchField", (e) => {
  // Handle input changes
});
```

### onSubmit
```javascript
import { onSubmit } from "winnetoujs/modules/select";

onSubmit("#form", (e) => {
  e.preventDefault();
  // Handle form submission
});
```

### onFocus
```javascript
import { onFocus } from "winnetoujs/modules/select";

onFocus("#input", () => {
  addClass("#input", "focused");
});
```

### onBlur
```javascript
import { onBlur } from "winnetoujs/modules/select";

onBlur("#input", () => {
  removeClass("#input", "focused");
});
```

### onKeyPress
```javascript
import { onKeyPress } from "winnetoujs/modules/select";

onKeyPress("#input", (e) => {
  if (e.key === "Enter") {
    // Handle enter key
  }
});
```

### onKeyDown
```javascript
import { onKeyDown } from "winnetoujs/modules/select";

onKeyDown("#gameArea", (e) => {
  // Handle key down for game controls
});
```

### onKeyUp
```javascript
import { onKeyUp } from "winnetoujs/modules/select";

onKeyUp("#textArea", (e) => {
  // Handle key release
});
```

### onMouseOver
```javascript
import { onMouseOver } from "winnetoujs/modules/select";

onMouseOver("#tooltip", () => {
  showElements("#tooltipText");
});
```

### onMouseOut
```javascript
import { onMouseOut } from "winnetoujs/modules/select";

onMouseOut("#tooltip", () => {
  hideElements("#tooltipText");
});
```

### onMouseEnter
```javascript
import { onMouseEnter } from "winnetoujs/modules/select";

onMouseEnter("#card", () => {
  addClass("#card", "hover");
});
```

### onMouseLeave
```javascript
import { onMouseLeave } from "winnetoujs/modules/select";

onMouseLeave("#card", () => {
  removeClass("#card", "hover");
});
```

## Focus Management

### focusElement
```javascript
import { focusElement } from "winnetoujs/modules/select";

focusElement("#firstInput");
```

### blurElement
```javascript
import { blurElement } from "winnetoujs/modules/select";

blurElement("#activeInput");
```

### selectText
```javascript
import { selectText } from "winnetoujs/modules/select";

selectText("#textInput");
```

## Element Manipulation

### cloneElements
```javascript
import { cloneElements } from "winnetoujs/modules/select";

let clones = cloneElements("#template", true);
```

### insertBefore
```javascript
import { insertBefore } from "winnetoujs/modules/select";

insertBefore("#target", "<div>Before content</div>");
```

### insertAfter
```javascript
import { insertAfter } from "winnetoujs/modules/select";

insertAfter("#target", "<div>After content</div>");
```

### replaceElements
```javascript
import { replaceElements } from "winnetoujs/modules/select";

replaceElements("#oldElement", "<div>New element</div>");
```

## Element Queries

### exists
```javascript
import { exists } from "winnetoujs/modules/select";

if (exists("#dynamicElement")) {
  // Element exists in DOM
}
```

### contains
```javascript
import { contains } from "winnetoujs/modules/select";

if (contains("#parent", "#child")) {
  // Parent contains child
}
```

### getParent
```javascript
import { getParent } from "winnetoujs/modules/select";

let parent = getParent("#childElement");
```

### getChildren
```javascript
import { getChildren } from "winnetoujs/modules/select";

let children = getChildren("#container");
```

### getSiblings
```javascript
import { getSiblings } from "winnetoujs/modules/select";

let siblings = getSiblings("#middleElement");
```

### getNext
```javascript
import { getNext } from "winnetoujs/modules/select";

let nextElement = getNext("#current");
```

### getPrevious
```javascript
import { getPrevious } from "winnetoujs/modules/select";

let prevElement = getPrevious("#current");
```

### findElements
```javascript
import { findElements } from "winnetoujs/modules/select";

let foundElements = findElements("#container", ".item");
```

## Scrolling

### getScrollTop
```javascript
import { getScrollTop } from "winnetoujs/modules/select";

let scrollPosition = getScrollTop("#scrollContainer");
```

### setScrollTop
```javascript
import { setScrollTop } from "winnetoujs/modules/select";

setScrollTop("#container", 100);
```

### setScrollLeft
```javascript
import { setScrollLeft } from "winnetoujs/modules/select";

setScrollLeft("#horizontalScroll", 50);
```

### getScrollHeight
```javascript
import { getScrollHeight } from "winnetoujs/modules/select";

let totalHeight = getScrollHeight("#content");
```

### getScrollWidth
```javascript
import { getScrollWidth } from "winnetoujs/modules/select";

let totalWidth = getScrollWidth("#content");
```

### scrollToElement
```javascript
import { scrollToElement } from "winnetoujs/modules/select";

scrollToElement("#targetSection", {
  behavior: "smooth",
  block: "center"
});
```

## Animations

### fadeIn
```javascript
import { fadeIn } from "winnetoujs/modules/select";

fadeIn("#modal", 500);
```

### fadeOut
```javascript
import { fadeOut } from "winnetoujs/modules/select";

fadeOut("#notification", 300);
```

### slideUp
```javascript
import { slideUp } from "winnetoujs/modules/select";

slideUp("#collapsibleContent", 400);
```

### slideDown
```javascript
import { slideDown } from "winnetoujs/modules/select";

slideDown("#expandableContent", 400);
```

## Text Input

### insertTextAtCursor
```javascript
import { insertTextAtCursor } from "winnetoujs/modules/select";

insertTextAtCursor("#textEditor", "Inserted text");
```




