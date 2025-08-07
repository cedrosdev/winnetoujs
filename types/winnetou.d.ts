// Type definitions for WinnetouJS - Core Winnetou Module
/// <reference path="./common.d.ts" />

declare class Winnetou_ {
  /**
   * Incrementally id when no specific identifier is given
   */
  constructoId: number;

  /**
   * Variable that stores mutables who should not have been
   * persistent when updating the application
   */
  protected mutable: Record<string, any>;

  /**
   * List of constructos that are subscribed to the mutable listener
   */
  usingMutable: Record<string, any[]>;

  /**
   * Stored events
   */
  private storedEvents: any[];

  /**
   * Internationalization strings
   */
  strings: Record<string, string>;

  /**
   * Mutation observer for watching DOM changes
   */
  private observer: MutationObserver | undefined;

  /**
   * Sets the value of passed winnetou mutable
   * @param mutable string that represents a winnetou mutable
   * @param value string value to be associated to mutable
   * @param localStorage bool to save the state on the machine at the user, true by default. Use 'notPersistent' to be clear (and verbose).
   */
  setMutable(
    mutable: string,
    value: string,
    localStorage?: boolean | "notPersistent"
  ): void;

  /**
   * initMutable initiates a mutable with
   * unique name saving it in
   * notPersistent mode and returning it name.
   * @param value The string value of mutable
   * @returns unique name of mutable
   */
  initMutable(value: string): string;

  /**
   * Decorator for setMutable with notPersistent behavior.
   * Sets the value of passed winnetou mutable
   * Usually used for temporary mutables with initMutable
   * @param mutable string that represents a winnetou mutable
   * @param value string value to be associated to mutable
   */
  setMutableNotPersistent(mutable: string, value: string): void;

  /**
   * Gets the value of passed winnetou mutable
   * @param mutable string that represents a winnetou mutable
   * @returns value or null if not exists
   */
  getMutable(mutable: string): string | null;

  /**
   * Mutation observer utilities
   */
  mutations: {
    /**
     * Starts the entire app constructos removal watch events. This method is only called once, even if you instantiate it several times. Only works if your main app element is 'app'.
     * @returns success status
     */
    start(): boolean;

    /**
     * Add a remove event binding to constructo
     * @param id constructo id that will be watched
     * @param callback the function that will be called when constructo is removed
     * @returns success status
     */
    onRemove(id: string, callback: (data: CustomEvent) => void): boolean;

    /**
     * Remove the main listener from app.
     * Using this method is discouraged as
     * it may break your app elsewhere in the code.
     * Use it at your own risk.
     */
    destroy(): void;
  };

  /**
   * Method to replace a constructo
   * @param new_ DOM Element
   * @param old_ DOM Element
   */
  private replace(
    new_: Element | DocumentFragment,
    old_: Element | DocumentFragment
  ): void;

  /**
   * Winnetou function storage method. If you provide this, use quotes.
   * @param function_ Function to be called when event fires
   * @param args A list of arguments comma separated
   */
  fx(function_: Function, ...args: string[]): string;
}

declare const Winnetou: Winnetou_;
declare const W: Winnetou_;
declare const Win: Winnetou_;

export { Winnetou, W, Win };
