import Stream from 'mithril/stream';

export const showItem: <T>(item: Dialogic.Item<T>) => Promise<Dialogic.Item<T>>;
export const hideItem: <T>(item: Dialogic.Item<T>) => Promise<Dialogic.Item<T>>;
export const setDomElement: <T>(
  domElement: HTMLElement,
  item: Dialogic.Item<T>,
) => void;
export const filterCandidates: <T>(
  ns: string,
  items: Dialogic.NamespaceStore,
  identityOptions: Dialogic.IdentityOptions,
) => Dialogic.Item<unknown>[];
export const states: Dialogic.States;
export const selectors: Dialogic.StateSelectors;
export const actions: {
  add: (ns: string, item: Dialogic.Item<unknown>) => void;
  remove: (ns: string, id: string) => void;
  replace: (ns: string, id: string, newItem: Dialogic.Item<unknown>) => void;
  removeAll: (ns: string) => void;
  store: (ns: string, newItems: Dialogic.Item<unknown>[]) => void;
  refresh: () => void;
};
export const remaining: (props: Dialogic.RemainingProps) => void;

export const dialog: Dialogic.DialogicInstance;
export const notification: Dialogic.DialogicInstance;

type ConfirmFn<T> = {
  (item: Dialogic.Item<T>): void;
};

export { Stream };

export namespace Dialogic {
  type DialogicInstance = {
    // Identification
    ns: string;
    defaultId: string;
    defaultSpawn: string;
    // Configuration
    defaultDialogicOptions: DefaultDialogicOptions;
    // Commands
    show: <T>(options: Options<T>, componentOptions?: T) => Promise<Item<T>>;
    hide: <T>(options?: Options<T>, componentOptions?: T) => Promise<Item<T>>;
    hideAll: (
      dialogicOptions?: DialogicOptions<unknown>,
    ) => Promise<Item<unknown>[]>;
    resetAll: (identityOptions?: IdentityOptions) => Promise<Item<unknown>[]>;
    // Timer commands
    pause: (identityOptions?: IdentityOptions) => Promise<Item<unknown>[]>;
    resume: (commandOptions?: CommandOptions) => Promise<Item<unknown>[]>;
    // State
    exists: (identityOptions?: IdentityOptions) => boolean;
    getCount: (identityOptions?: IdentityOptions) => number;
    // Timer state
    isPaused: (identityOptions?: IdentityOptions) => boolean;
    getRemaining: (identityOptions?: IdentityOptions) => number;
  };

  type DefaultDialogicOptions = {
    id: string;
    spawn: string;
    queued?: boolean;
    timeout?: number;
  };

  type IdentityOptions = {
    id?: string;
    spawn?: string;
  };

  type ComponentOptions = {
    onMount?: (args?: unknown) => unknown;
  } & IdentityOptions;

  type CommandOptions = IdentityOptions & TimerResumeOptions;

  // Components

  type DialogicalWrapperOptions = {
    ns: string;
    identityOptions: IdentityOptions;
  };

  type DialogicalInstanceDispatchFn = (event: InstanceEvent) => void;

  type PassThroughOptions = {
    [key: string]: unknown;
  };

  type DialogicalInstanceOptions<T extends PassThroughOptions> = {
    identityOptions: IdentityOptions;
    dialogicOptions: DialogicOptions<T>;
    passThroughOptions: T;
    onMount: DialogicalInstanceDispatchFn;
    onShow: DialogicalInstanceDispatchFn;
    onHide: DialogicalInstanceDispatchFn;
  };

  // TransitionFns

  type TransitionFn = (domElement?: HTMLElement) => unknown;

  type TransitionFns = {
    show?: TransitionFn;
    hide?: TransitionFn;
  };

  type TransitionStyles = {
    default?: Partial<CSSStyleDeclaration>;
    showStart?: Partial<CSSStyleDeclaration>;
    showEnd?: Partial<CSSStyleDeclaration>;
    hideStart?: Partial<CSSStyleDeclaration>;
    hideEnd?: Partial<CSSStyleDeclaration>;
  };

  type TransitionStylesFn = (domElement: HTMLElement) => TransitionStyles;

  type DialogicOptions<T> = {
    className?: string;
    component?: unknown;
    didHide?: ConfirmFn<T>;
    didShow?: ConfirmFn<T>;
    domElement?: HTMLElement;
    queued?: boolean;
    styles?: TransitionStyles | TransitionStylesFn;
    timeout?: number;
    toggle?: boolean;
  } & IdentityOptions & {
      __transitionTimeoutId__?: number;
    };

  type Options<T> = {
    dialogic?: DialogicOptions<T>;
  } & T;

  type MaybeItem<T> = {
    just?: Item<T>;
    nothing?: undefined;
  };

  type Callbacks<T> = {
    didHide: ConfirmFn<T>;
    didShow: ConfirmFn<T>;
  };

  type Item<T> = {
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

  type NamespaceStore = {
    [key: string]: Item<unknown>[];
  };

  type State = {
    store: NamespaceStore;
  };

  type InitiateItemTransitionFn = <T>(item: Item<T>) => Promise<Item<T>>;

  type TimerCallback = () => unknown;
  type TOnFinishFn = () => void;

  type TimerStates = Stream<TimerState>;

  type TimerStateSelectors = {
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

  type TimerState = {
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

  type TimerResumeOptions = {
    minimumDuration?: number;
  };

  type TimerActions = {
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

  type Timer = {
    states: TimerStates;
    actions: TimerActions;
    selectors: TimerStateSelectors;
  };

  type States = Stream<State>;

  type StateSelectors = {
    getStore: () => NamespaceStore;
    find: <T>(ns: string, identityOptions: IdentityOptions) => MaybeItem<T>;
    getAll: (ns: string, identityOptions?: IdentityOptions) => Item<unknown>[];
    getCount: (ns: string, identityOptions?: IdentityOptions) => number;
  };

  type InstanceEvent = {
    detail: {
      identityOptions: IdentityOptions;
      domElement: HTMLElement;
    };
  };

  type ContentComponentOptions<T> = {
    show: () => Promise<string>;
    hide: () => Promise<string>;
  } & T;

  type RemainingProps = {
    /**
     * Dialogic instance: notification, dialog, or custom.
     */
    instance: DialogicInstance;

    /**
     * Set to true to return seconds instead of milliseconds.
     */
    roundToSeconds?: boolean;

    /**
     * Returns the remaining time as milliseconds. Returns `undefined` when the timer is not running (before and after the timer runs).
     */
    callback: (displayValue: number | undefined) => unknown;
  };
}
