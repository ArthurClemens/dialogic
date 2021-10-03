import type Stream from "mithril-stream-standalone";
import { dialogical } from "./dialogical";
import type { Timer } from "./state/timer";
import type { TransitionStyles, TransitionStylesFn } from "./transition";
export type { TransitionStyles, TransitionStylesFn };
export declare type DialogicInstance = ReturnType<typeof dialogical>;
declare type ConfirmFn<T = unknown> = {
    (item: Item<T>): void;
};
export declare type DefaultDialogicOptions = {
    id: string;
    spawn: string;
    queued?: boolean;
    timeout?: number;
};
export declare type IdentityOptions = {
    id?: string;
    spawn?: string;
};
export declare type ComponentOptions = {
    onMount?: (args?: unknown) => unknown;
} & IdentityOptions;
export declare type TimerResumeOptions = {
    minimumDuration?: number;
};
export declare type CommandOptions = IdentityOptions & TimerResumeOptions;
export declare type PassThroughOptions = unknown;
export declare type DialogicalWrapperOptions = {
    ns: string;
    identityOptions: IdentityOptions;
};
export declare type DialogicalInstanceDispatchFn = (event: InstanceEvent) => void;
export declare type DialogicalInstanceOptions<T = unknown> = {
    identityOptions: IdentityOptions;
    dialogicOptions: DialogicOptions<T>;
    passThroughOptions?: T;
    onMount: DialogicalInstanceDispatchFn;
    onShow: DialogicalInstanceDispatchFn;
    onHide: DialogicalInstanceDispatchFn;
};
export declare type DialogicOptions<T = unknown> = {
    className?: string;
    component?: unknown;
    willHide?: ConfirmFn<T>;
    didHide?: ConfirmFn<T>;
    willShow?: ConfirmFn<T>;
    didShow?: ConfirmFn<T>;
    domElement?: HTMLElement;
    queued?: boolean;
    styles?: TransitionStyles | TransitionStylesFn;
    timeout?: number;
    toggle?: boolean;
} & IdentityOptions & {
    __transitionTimeoutId__?: number;
};
export declare type Options<T = unknown> = {
    dialogic?: DialogicOptions<T>;
} & T;
export declare type MaybeItem<T = unknown> = {
    just?: Item<T>;
    nothing?: undefined;
};
export declare type Callbacks<T = unknown> = {
    willHide: ConfirmFn<T>;
    willShow: ConfirmFn<T>;
    didHide: ConfirmFn<T>;
    didShow: ConfirmFn<T>;
};
/**
 * An Item is a dialog or notification, or a custom object created with `dialogical`.
 */
export declare type Item<T = unknown> = {
    ns: string;
    id: string;
    passThroughOptions: T;
    key: string;
    identityOptions: IdentityOptions;
    timer?: Timer;
    dialogicOptions: DialogicOptions<T>;
    transitionState: number;
    callbacks: Callbacks<T>;
};
export declare type NamespaceStore = {
    [key: string]: Item<unknown>[];
};
export declare type State = {
    store: NamespaceStore;
};
export declare type States = Stream<State>;
export declare type InstanceEvent = {
    detail: {
        identityOptions: IdentityOptions;
        domElement: HTMLElement;
    };
};
export declare type InitiateItemTransitionFn = <T = unknown>(item: Item<T>) => Promise<Item<T>>;
