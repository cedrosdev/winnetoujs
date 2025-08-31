type Selector = string | Element | Element[];
interface ScrollOptions {
    behavior?: ScrollBehavior;
    block?: ScrollLogicalPosition;
    inline?: ScrollLogicalPosition;
}
export declare const hideElements: (selector: Selector) => void;
export declare const showElements: (selector: Selector) => void;
export declare const getWidth: (selector: Selector) => number;
export declare const getHeight: (selector: Selector) => number;
export declare const getLeft: (selector: Selector) => number;
export declare const getTop: (selector: Selector) => number;
export declare const getGlobalPosition: (selector: Selector) => DOMRect;
export declare const getScrollTop: (selector: Selector) => number;
export declare const isVisible: (selector: Selector) => boolean;
export declare const isHidden: (selector: Selector) => boolean;
export declare const contains: (parentSelector: Selector, childSelector: Selector) => boolean;
export declare const scrollToElement: (selector: Selector, options?: ScrollOptions) => void;
export declare const setScrollTop: (selector: Selector, position: number) => void;
export declare const setScrollLeft: (selector: Selector, position: number) => void;
export declare const getScrollHeight: (selector: Selector) => number;
export declare const getScrollWidth: (selector: Selector) => number;
export {};
//# sourceMappingURL=positioning.d.ts.map