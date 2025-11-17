export declare class Constructos {
    protected _mutableToString(constructoProps: any): any;
    protected _saveUsingMutable(pureId: any, elements: any, options: any, method: any): void;
    protected _getIdentifier(identifier: string): string | number;
    /**
     * Attach a component to the DOM
     * @param component The component HTML string
     * @param output Id of element. It is query selector one.
     * @param options Options to control how the construct is inserted. Optional.
     * @protected
     */
    protected attachToDOM(component: string, output: string, options?: {
        clear?: boolean;
        reverse?: boolean;
    }): void;
}
//# sourceMappingURL=constructos.d.ts.map