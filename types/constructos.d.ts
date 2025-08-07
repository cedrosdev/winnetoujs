// Type definitions for WinnetouJS - Constructos Module
/// <reference path="./common.d.ts" />
/// <reference path="./winnetou.d.ts" />

export declare class Constructos {
  /**
   * Digest all constructo props to find
   * {mutable:"string"} pattern in order to
   * change it to W.getMutable("string") value
   * @param constructoProps
   * @protected
   */
  protected _mutableToString(
    constructoProps: Record<string, any>
  ): Record<string, any>;

  /**
   * Store constructos that using mutables
   * in Winnetou.usingMutable var in order to
   * update constructo when W.setMutable
   * if triggered.
   * @param pureId
   * @param elements
   * @param options
   * @param method
   * @protected
   */
  protected _saveUsingMutable(
    pureId: string,
    elements: Record<string, any>,
    options: WinnetouJS.ConstructoOptions,
    method: any
  ): void;

  /**
   * Generates a random identifier
   * @param identifier
   * @protected
   */
  protected _getIdentifier(identifier?: string): string | number;

  /**
   * Insert a constructo into DOM tree
   * @param component
   * @param output
   * @param options
   * @protected
   */
  protected attachToDOM(
    component: string,
    output: WinnetouJS.SelectorType,
    options?: WinnetouJS.ConstructoOptions
  ): void;
}
