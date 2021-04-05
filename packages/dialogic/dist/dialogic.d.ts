import { Dialogic } from './index';

export { actions, selectors, states } from './state/store';
export declare const filterCandidates: (
  ns: string,
  items: Dialogic.NamespaceStore,
  identityOptions: Dialogic.IdentityOptions,
) => unknown;
export declare const show: (
  ns: string,
) => (
  defaultDialogicOptions: Dialogic.DefaultDialogicOptions,
) => <T = unknown>(options?: Dialogic.Options<T>) => Promise<Dialogic.Item<T>>;
export declare const hide: (
  ns: string,
) => (
  defaultDialogicOptions: Dialogic.DefaultDialogicOptions,
) => <T = unknown>(
  options?: Dialogic.Options<T> | undefined,
) => Promise<Dialogic.Item<T>>;
export declare const pause: (
  ns: string,
) => (
  defaultDialogicOptions: Dialogic.DefaultDialogicOptions,
) => <T = unknown>(
  identityOptions?: Dialogic.IdentityOptions | undefined,
) => Promise<Dialogic.Item<T>[]>;
export declare const resume: (
  ns: string,
) => (
  defaultDialogicOptions: Dialogic.DefaultDialogicOptions,
) => <T = unknown>(
  commandOptions?: Dialogic.CommandOptions | undefined,
) => Promise<Dialogic.Item<T>[]>;
export declare const getTimerProperty: (
  timerProp: 'isPaused' | 'getRemaining' | 'getResultPromise',
  defaultValue: false | 0 | undefined,
) => (
  ns: string,
) => (
  defaultDialogicOptions: Dialogic.DefaultDialogicOptions,
) => (
  identityOptions?: Dialogic.IdentityOptions | undefined,
) => number | boolean | Promise<unknown> | undefined;
export declare const isPaused: (
  ns: string,
) => (
  defaultDialogicOptions: Dialogic.DefaultDialogicOptions,
) => (identityOptions: Dialogic.IdentityOptions) => boolean;
export declare const getRemaining: (
  ns: string,
) => (
  defaultDialogicOptions: Dialogic.DefaultDialogicOptions,
) => (identityOptions: Dialogic.IdentityOptions) => number | undefined;
export declare const exists: (
  ns: string,
) => (
  defaultDialogicOptions: Dialogic.DefaultDialogicOptions,
) => (identityOptions?: Dialogic.IdentityOptions | undefined) => boolean;
export declare const resetAll: (
  ns: string,
) => (
  defaultDialogicOptions: Dialogic.DefaultDialogicOptions,
) => (
  identityOptions?: Dialogic.IdentityOptions | undefined,
) => Promise<Dialogic.Item<unknown>[]>;
/**
 * Triggers a `hideItem` for each item in the store.
 * Queued items: will trigger `hideItem` only for the first item, then reset the store.
 * Optional `dialogicOptions` may be passed with specific transition options. This comes in handy when all items should hide in the same way.
 */
export declare const hideAll: (
  ns: string,
) => (
  defaultDialogicOptions: Dialogic.DefaultDialogicOptions,
) => <T = unknown>(
  dialogicOptions?: Dialogic.DialogicOptions<T> | undefined,
) => Promise<Dialogic.Item<T>[]>;
export declare const getCount: (
  ns: string,
) => (identityOptions?: Dialogic.IdentityOptions | undefined) => number;
export declare const showItem: Dialogic.InitiateItemTransitionFn;
/**
 * Hides an item. Any timer will be stopped. Any callbacks will be called.
 * @returns A Promise with (a copy of) the data of the removed item.
 */
export declare const hideItem: <T = unknown>(
  item: Dialogic.Item<T>,
) => Promise<Dialogic.Item<T>>;
export declare const setDomElement: <T = unknown>(
  domElement: HTMLElement,
  item: Dialogic.Item<T>,
) => void;
