import Stream from 'mithril/stream';

import { dialogical } from './dialogical';

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

export type TimerCallback = () => unknown;
export type TOnFinishFn = () => void;

export type TimerStates = Stream<TimerState>;

export type TimerStateSelectors = {
  /**
   * Returns the paused state.
   */
  isPaused: () => boolean;

  /**
   * The promise that is handled when the timer is done or canceled.
   */
  getResultPromise: () => Promise<unknown> | undefined;

  /**
   * Returns the remaining duration in milliseconds.
   */
  getRemaining: () => number | undefined;
};

export type TimerState = {
  timerId?: number;
  startTime?: number;
  remaining: number | undefined;
  isPaused: boolean;
  callback: TimerCallback;
  timeoutFn: () => void;
  promise?: Promise<unknown>;
  onDone: TOnFinishFn;
  onAbort: TOnFinishFn;
};

export type TimerResumeOptions = {
  minimumDuration?: number;
};

export type TimerActions = {
  /**
   * Starts the timer
   * @param {callback} Function Callback function that is called after completion.
   * @param {duration} Number Timer duration in milliseconds.
   */
  start: (callback: TimerCallback, duration: number) => void;

  /**
   * Stops the timer.
   */
  stop: () => void;

  /**
   * Pauses a running timer.
   */
  pause: () => void;

  /**
   * Resumes a paused timer.
   * @param {minimumDuration} Number Sets the minimum duration.
   */
  resume: (minimumDuration?: number) => void;

  /**
   * Aborts and clears a timer.
   */
  abort: () => void;

  /**
   * Updates the current state. Used to get the state for selectors.getRemaining.
   */
  refresh: () => void;
};

export type Timer = {
  states: TimerStates;
  actions: TimerActions;
  selectors: TimerStateSelectors;
};

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
