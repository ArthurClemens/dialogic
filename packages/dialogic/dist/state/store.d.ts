import { Dialogic } from '../index';
export declare const createId: (identityOptions: Dialogic.IdentityOptions, ns: string) => string;
export declare const states: Dialogic.States;
export declare const actions: {
    /**
     * Add an item to the end of the list.
     */
    add: <T extends unknown = unknown>(ns: string, item: Dialogic.Item<T>) => void;
    /**
     * Removes the first item with a match on `id`.
     */
    remove: (ns: string, id: string) => void;
    /**
     * Replaces the first item with a match on `id` with a newItem.
     */
    replace: <T_1 = unknown>(ns: string, id: string, newItem: Dialogic.Item<T_1>) => void;
    /**
     * Removes all items within a namespace.
     */
    removeAll: (ns: string) => void;
    /**
     * Replaces all items within a namespace.
     */
    store: <T_2 = unknown>(ns: string, newItems: Dialogic.Item<T_2>[]) => void;
    refresh: () => void;
};
export declare const selectors: {
    getStore: () => Dialogic.NamespaceStore;
    find: <T = unknown>(ns: string, identityOptions: Dialogic.IdentityOptions) => {
        just: Dialogic.Item<T>;
        nothing?: undefined;
    } | {
        nothing: undefined;
        just?: undefined;
    };
    getAll: <T_1 = unknown>(ns: string, identityOptions?: Dialogic.IdentityOptions) => Dialogic.Item<T_1>[];
    getCount: (ns: string, identityOptions?: Dialogic.IdentityOptions) => number;
};
