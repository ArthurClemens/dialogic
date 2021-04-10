import Stream from 'mithril/stream';

import { dialogical } from './dialogical';
import type { Timer } from './state/timer';

export declare type DialogicInstance = ReturnType<typeof dialogical>;
declare type ConfirmFn<T> = {
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
export declare type DialogicalWrapperOptions = {
  ns: string;
  identityOptions: IdentityOptions;
};
export declare type DialogicalInstanceDispatchFn = (
  event: InstanceEvent,
) => void;
export declare type PassThroughOptions = {
  [key: string]: unknown;
};
export declare type DialogicalInstanceOptions<T extends PassThroughOptions> = {
  identityOptions: IdentityOptions;
  dialogicOptions: DialogicOptions<T>;
  passThroughOptions: T;
  onMount: DialogicalInstanceDispatchFn;
  onShow: DialogicalInstanceDispatchFn;
  onHide: DialogicalInstanceDispatchFn;
};
export declare type TransitionFn = (domElement?: HTMLElement) => unknown;
export declare type TransitionFns = {
  show?: TransitionFn;
  hide?: TransitionFn;
};
export declare type TransitionStyles = {
  default?: Partial<CSSStyleDeclaration>;
  showStart?: Partial<CSSStyleDeclaration>;
  showEnd?: Partial<CSSStyleDeclaration>;
  hideStart?: Partial<CSSStyleDeclaration>;
  hideEnd?: Partial<CSSStyleDeclaration>;
};
export declare type TransitionStylesFn = (
  domElement: HTMLElement,
) => TransitionStyles;
export declare type DialogicOptions<T> = {
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
export declare type Options<T> = {
  dialogic?: DialogicOptions<T>;
} & T;
export declare type MaybeItem<T> = {
  just?: Item<T>;
  nothing?: undefined;
};
export declare type Callbacks<T> = {
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
  [key: string]: Item[];
};
export declare type State = {
  store: NamespaceStore;
};
export declare type InitiateItemTransitionFn = <T>(
  item: Item<T>,
) => Promise<Item<T>>;
export declare type States = Stream<State>;
export declare type StateSelectors = {
  getStore: () => NamespaceStore;
  find: <T>(ns: string, identityOptions: IdentityOptions) => MaybeItem<T>;
  getAll: <T>(ns: string, identityOptions?: IdentityOptions) => Item<T>[];
  getCount: (ns: string, identityOptions?: IdentityOptions) => number;
};
export declare type InstanceEvent = {
  detail: {
    identityOptions: IdentityOptions;
    domElement: HTMLElement;
  };
};
export declare type RemainingProps = {
  /**
   * Dialogic instance: notification, dialog, or custom.
   */
  instance: DialogicInstance;
  id?: string;
  spawn?: string;
  /**
   * Set to true to return seconds instead of milliseconds.
   */
  roundToSeconds?: boolean;
  /**
   * Returns the remaining time as milliseconds. Returns `undefined` when the timer is not running (before and after the timer runs).
   */
  callback: (displayValue: number | undefined) => unknown;
};
export {};
