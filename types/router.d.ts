// Type definitions for WinnetouJS - Router Module
/// <reference path="./common.d.ts" />

declare class WinnetouRouter_ {
  /**
   * Object that will store routes on createRoutes
   * @protected
   */
  protected routes: Record<string, Function>;

  /**
   * Object that will store the separated routes from createRoutes
   * @protected
   */
  protected paramRoutes: Array<{ root: string; size: number }>;

  /**
   * Object that provides options when createRoutes, like
   * a standard function to be called when onBack is pressed
   * @protected
   */
  protected routesOptions: WinnetouJS.RouteOptions;

  constructor();

  /**
   * Add event listeners for router functionality
   * @private
   */
  private addListeners(): void;

  /**
   * Method for store dynamic Winnetou Routes
   * @param obj Object with routes
   * @param options Router options
   */
  createRoutes(
    obj: Record<string, Function>,
    options?: WinnetouJS.RouteOptions
  ): void;

  /**
   * Navigate between Winnetou routes
   * @param url Path already defined in createRoutes method
   * @param pushState To use navigate without change URL
   */
  navigate(url: string, pushState?: boolean): void;

  /**
   * Allows WinnetouJs to pass between pages on the app.
   * Needs a valid const routes already set.
   * Do not changes URL.
   * @param route function already set in createRoutes
   */
  pass(route: string): void;

  /**
   * @private
   */
  private pushStateInteraction(func: string): void;

  /**
   * @private
   */
  private callRoute(url: string): void;

  /**
   * @private
   */
  private notFound(): void;

  /**
   * @private
   */
  private pushState(url: string): void;
}

declare const Router: WinnetouRouter_;

export { Router };
