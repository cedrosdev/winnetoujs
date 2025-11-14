interface RouteOptions {
    onBack?: (route: string) => void;
    onGo?: (route: string) => void;
}
interface RouteInfo {
    root: string;
    size: number;
}
type RouteFunction = (...params: string[]) => void;
declare class WinnetouRouter_ {
    protected routes: Record<string, RouteFunction>;
    protected paramRoutes: RouteInfo[];
    protected routesOptions: RouteOptions;
    constructor();
    addListeners(): void;
    createRoutes(obj: Record<string, RouteFunction>, options?: RouteOptions): void;
    navigate(url: string, pushState?: boolean): void;
    pass(route: string): void;
    private pushStateInteraction;
    private callRoute;
    private notFound;
    private pushState;
}
export declare const Router: WinnetouRouter_;
export {};
//# sourceMappingURL=router.d.ts.map