import type { Dialogic } from "dialogic";
export declare const appState: {
    getStore: () => Dialogic.NamespaceStore;
    find: <T = unknown>(ns: string, identityOptions: Dialogic.IdentityOptions) => {
        just: Dialogic.Item<T>;
        nothing?: undefined;
    } | {
        nothing: any;
        just?: undefined;
    };
    getAll: <T_1 = unknown>(ns: string, identityOptions?: Dialogic.IdentityOptions) => Dialogic.Item<T_1>[];
    getCount: (ns: string, identityOptions?: Dialogic.IdentityOptions) => number;
    set(this: void, value: Dialogic.State): void;
    update(this: void, updater: import("svelte/store").Updater<Dialogic.State>): void;
    subscribe(this: void, run: import("svelte/store").Subscriber<Dialogic.State>, invalidate?: (value?: Dialogic.State) => void): import("svelte/store").Unsubscriber;
};
export declare const getCount: (ns: string) => (identityOptions?: Dialogic.IdentityOptions) => import("svelte/store").Readable<number>;
export declare const isPaused: (ns: string) => (defaultDialogicOptions: Dialogic.DefaultDialogicOptions) => (identityOptions?: Dialogic.IdentityOptions) => import("svelte/store").Readable<boolean>;
export declare const exists: (ns: string) => (defaultDialogicOptions: Dialogic.DefaultDialogicOptions) => (identityOptions?: Dialogic.IdentityOptions) => import("svelte/store").Readable<boolean>;
