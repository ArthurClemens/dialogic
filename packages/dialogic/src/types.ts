import Stream from 'mithril/stream';

import { dialogical } from './dialogical';
import type { Timer } from './state/timer';

export type DialogicInstance = ReturnType<typeof dialogical>;

type ConfirmFn<T> = {
  (item: Item<T>): void;
};

export type DefaultDialogicOptions = {
  id: string;
  spawn: string;
  queued?: boolean;
  timeout?: number;
};

export type IdentityOptions = {
  id?: string;
  spawn?: string;
};

export type ComponentOptions = {
  onMount?: (args?: unknown) => unknown;
} & IdentityOptions;

export type TimerResumeOptions = {
  minimumDuration?: number;
};

export type CommandOptions = IdentityOptions & TimerResumeOptions;

// Components

export type DialogicalWrapperOptions = {
  ns: string;
  identityOptions: IdentityOptions;
};

export type DialogicalInstanceDispatchFn = (event: InstanceEvent) => void;

export type PassThroughOptions = {
  [key: string]: unknown;
};

export type DialogicalInstanceOptions<T extends PassThroughOptions> = {
  identityOptions: IdentityOptions;
  dialogicOptions: DialogicOptions<T>;
  passThroughOptions: T;
  onMount: DialogicalInstanceDispatchFn;
  onShow: DialogicalInstanceDispatchFn;
  onHide: DialogicalInstanceDispatchFn;
};

// TransitionFns

export type TransitionFn = (domElement?: HTMLElement) => unknown;

export type TransitionFns = {
  show?: TransitionFn;
  hide?: TransitionFn;
};

export type TransitionStyles = {
  default?: Partial<CSSStyleDeclaration>;
  showStart?: Partial<CSSStyleDeclaration>;
  showEnd?: Partial<CSSStyleDeclaration>;
  hideStart?: Partial<CSSStyleDeclaration>;
  hideEnd?: Partial<CSSStyleDeclaration>;
};

export type TransitionStylesFn = (domElement: HTMLElement) => TransitionStyles;

export type DialogicOptions<T> = {
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

export type Options<T> = {
  dialogic?: DialogicOptions<T>;
} & T;

export type MaybeItem<T> = {
  just?: Item<T>;
  nothing?: undefined;
};

export type Callbacks<T> = {
  willHide: ConfirmFn<T>;
  willShow: ConfirmFn<T>;
  didHide: ConfirmFn<T>;
  didShow: ConfirmFn<T>;
};

/**
 * An Item is a dialog or notification, or a custom object created with `dialogical`.
 */
export type Item<T = unknown> = {
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

export type NamespaceStore = {
  [key: string]: Item[];
};

export type State = {
  store: NamespaceStore;
};

export type InitiateItemTransitionFn = <T>(item: Item<T>) => Promise<Item<T>>;

export type States = Stream<State>;

export type StateSelectors = {
  getStore: () => NamespaceStore;
  find: <T>(ns: string, identityOptions: IdentityOptions) => MaybeItem<T>;
  getAll: <T>(ns: string, identityOptions?: IdentityOptions) => Item<T>[];
  getCount: (ns: string, identityOptions?: IdentityOptions) => number;
};

export type InstanceEvent = {
  detail: {
    identityOptions: IdentityOptions;
    domElement: HTMLElement;
  };
};

export type RemainingProps = {
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
