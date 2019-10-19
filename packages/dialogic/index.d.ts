import Stream from "mithril/stream";

export const showItem: (item: Dialogic.Item) => Promise<Dialogic.Item>;
export const hideItem: (item: Dialogic.Item) => Promise<Dialogic.Item>;
export const setDomElement: (domElement: HTMLElement, item: Dialogic.Item) => void;
export const filterCandidates: (ns: string, items: Dialogic.NamespaceStore, identityOptions: Dialogic.IdentityOptions) => Dialogic.Item[];
export const states: Dialogic.States;
export const selectors: Dialogic.StateSelectors;
export const actions: {
  add: (ns: string, item: Dialogic.Item) => void;
  remove: (ns: string, id: string) => void;
  replace: (ns: string, id: string, newItem: Dialogic.Item) => void;
  removeAll: (ns: string) => void;
  store: (ns: string, newItems: Dialogic.Item[]) => void;
  refresh: () => void;
}

export const dialog: Dialogic.DialogicInstance;
export const notification: Dialogic.DialogicInstance;

type ConfirmFn = {
  (item: Dialogic.Item): void;
}

export namespace Dialogic {

  type DialogicInstance = {
    // Identification
    ns: string;
    defaultId: string;
    defaultSpawn: string;
    // Configuration
    defaultDialogicOptions: DefaultDialogicOptions;
    // Commands
    show: (options: Options, fnOptions?: any) => Promise<Item>;
    hide: (options?: Options, fnOptions?: any) => Promise<Item>;
    hideAll: (dialogicOptions?: Options) => Promise<Item[]>;
    resetAll: (identityOptions?: Options) => Promise<Item[]>;
    // Timer commands
    pause: (identityOptions?: CommandOptions, fnOptions?: any) => Promise<Item>;
    resume: (commandOptions?: CommandOptions, fnOptions?: CommandOptions) => Promise<Item>;
    // State
    exists: (identityOptions?: IdentityOptions) => boolean;
    getCount: (identityOptions?: IdentityOptions) => number;
    // Timer state
    isPaused: (identityOptions?: IdentityOptions) => boolean | undefined;
    getRemaining: (identityOptions?: IdentityOptions) => number | undefined;
  };

  type DefaultDialogicOptions = {
    id: string;
    spawn: string;
    queued?: boolean;
    timeout?: number;
  }

  type IdentityOptions = {
    id?: string;
    spawn?: string;
  }

  type ComponentOptions = {
    onMount?: (args?: any) => any;
  } & IdentityOptions;

  type CommandOptions = IdentityOptions & TimerResumeOptions;

  // Components

  type DialogicalWrapperOptions = {
    ns: string;
    identityOptions: IdentityOptions;
  }

  type DialogicalInstanceDispatchFn = (event: InstanceEvent) => void;

  type DialogicalInstanceOptions = {
    identityOptions: IdentityOptions;
    dialogicOptions: DialogicOptions;
    passThroughOptions: PassThroughOptions;
    onMount: DialogicalInstanceDispatchFn;
    onShow: DialogicalInstanceDispatchFn;
    onHide: DialogicalInstanceDispatchFn;
  }
  
  interface PassThroughOptions {
    [key:string]: any;
  }
  
  // TransitionFns

  type TransitionFn = (domElement?: HTMLElement) => any;

  type TransitionFns = {
    show?: TransitionFn;
    hide?: TransitionFn;
  }

  type TransitionStyles = {
    default?: Partial<CSSStyleDeclaration>;
    showStart?: Partial<CSSStyleDeclaration>;
    showEnd?: Partial<CSSStyleDeclaration>;
    hideStart?: Partial<CSSStyleDeclaration>;
    hideEnd?: Partial<CSSStyleDeclaration>;
  }

  type TransitionStylesFn = (domElement: HTMLElement) => TransitionStyles;
  
  type DialogicOptions = {
    className?: string;
    component?: any;
    didHide?: ConfirmFn;
    didShow?: ConfirmFn;
    domElement?: HTMLElement;
    id?: string;
    queued?: boolean;
    spawn?: string;
    styles?: TransitionStyles | TransitionStylesFn;
    timeout?: number;
    toggle?: boolean;
  } & TimerResumeOptions;

  type Options = {
    dialogic?: DialogicOptions;
  } & PassThroughOptions;

  type MaybeItem = {
    just?: Item;
    nothing?: undefined;
  }

  type Callbacks = {
    didHide: ConfirmFn;
    didShow: ConfirmFn;
  }

  type Item = {
    ns: string;
    id: string;
    passThroughOptions: PassThroughOptions;
    key: string;
    identityOptions: IdentityOptions;
    timer?: Timer;
    dialogicOptions: DialogicOptions;
    transitionState: number;
    callbacks: Callbacks;
  }

  type NamespaceStore = {
    [key: string]: Item[];
  }

  type State = {
    store: NamespaceStore;
  }

  type InitiateItemTransitionFn = (item: Item) => Promise<Item>;

  type TimerCallback = () => any;
  type TOnFinishFn = () => void;

  type TimerStates = Stream<TimerState>;

  type TimerStateSelectors = {
    /**
     * Returns the paused state.
     */
    isPaused: () => boolean | undefined;

    /**
     * The promise that is handled when the timer is done or canceled.
     */
    getResultPromise: () => Promise<any> | undefined;

    /**
     * Returns the remaining duration in milliseconds.
     */
    getRemaining: () => number | undefined;
  }

  type TimerState = {
    timerId?: number;
    startTime?: number;
    remaining?: number;
    isPaused?: boolean;
    callback: TimerCallback;
    timeoutFn: () => void;
    promise?: Promise<any>;
    onDone: TOnFinishFn; 
    onAbort: TOnFinishFn;
  }

  type TimerResumeOptions = {
    minimumDuration?: number;
  }

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
  }

  type Timer = {
    states: TimerStates;
    actions: TimerActions;
    selectors: TimerStateSelectors;
  }

  type States = Stream<State>;

  type StateSelectors = {
    getStore: () => NamespaceStore;
    find: (ns: string, identityOptions: IdentityOptions) => MaybeItem;
    getAll: (ns: string, identityOptions?: IdentityOptions) => Item[];
    getCount: (ns: string, identityOptions?: IdentityOptions) => number;
  }

  type InstanceEvent = {
    detail: {
      identityOptions: IdentityOptions;
      domElement: HTMLElement
    }
  }

  type ContentComponentOptions = {
    show: () => Promise<string>;
    hide: () => Promise<string>;
  } & PassThroughOptions;

}
