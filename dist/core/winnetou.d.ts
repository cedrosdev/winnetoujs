interface MutableSubscriber {
    pureId: string;
    method: any;
    elements: any;
    options: any;
}
declare class Winnetou_ {
    constructoId: number;
    protected mutable: Record<string, any>;
    usingMutable: Record<string, MutableSubscriber[]>;
    private storedEvents;
    strings: Record<string, any>;
    private observer;
    constructor();
    setMutable(mutable: string, value: any, localStorage?: boolean | "notPersistent"): void;
    initMutable(value: any): string;
    setMutableNotPersistent(mutable: string, value: any): void;
    getMutable(mutable: string): string | null;
    mutations: {
        start: () => boolean;
        onRemove: (id: string, callback: () => void) => boolean;
        destroy: () => void;
    };
    replace(new_: DocumentFragment, old_: HTMLElement): void;
    fx(function_: Function, ...args: any[]): string;
}
export declare const Winnetou: Winnetou_;
export declare const W: Winnetou_;
export declare const Win: Winnetou_;
export {};
//# sourceMappingURL=winnetou.d.ts.map