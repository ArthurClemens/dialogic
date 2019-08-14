import Stream from "mithril/stream";

export const showItem: (item: Dialogic.Item) => Promise<Dialogic.Item>;
export const hideItem: (item: Dialogic.Item) => Promise<Dialogic.Item>;
export const setDomElement: (domElement: HTMLElement, item: Dialogic.Item) => void;
export const filterCandidates: (ns: string, items: Dialogic.NamespaceStore, spawnOptions: Dialogic.SpawnOptions) => Dialogic.Item[];
export const states: Dialogic.States;
export const selectors: Dialogic.StateSelectors;

export const dialog: Dialogic.DialogicInstance;
export const notification: Dialogic.DialogicInstance;

type ConfirmFn = {
  (item: Dialogic.Item):  void;
}

export namespace Dialogic {

  type DialogicInstance = {
    // Identification
    ns: string;
    defaultId: string;
    defaultSpawn: string;
    // Configuration
    defaultSpawnOptions: DefaultSpawnOptions;
    // Commands
    show: (options: Options, identityOptions?: IdentityOptions, fnOptions?: any) => Promise<Item>;
    hide: (identityOptions?: IdentityOptions, fnOptions?: any) => Promise<Item>;
    toggle: (options: Options, identityOptions?: IdentityOptions, fnOptions?: any) => Promise<Item>;
    hideAll: (options: Options, identityOptions?: IdentityOptions) => void;
    resetAll: () => Promise<void>;
    // Timer commands
    pause: (identityOptions?: IdentityOptions, fnOptions?: any) => Promise<Item>;
    resume: (identityOptions?: IdentityOptions, fnOptions?: TimerResumeOptions) => Promise<Item>;
    // State
    exists: (identityOptions?: IdentityOptions) => boolean;
    getCount: (identityOptions?: IdentityOptions) => number;
    // Timer state
    isPaused: (identityOptions?: IdentityOptions) => boolean | undefined;
    getRemaining: (identityOptions?: IdentityOptions) => number | undefined;
  };

  type DefaultSpawnOptions = {
    id: string;
    spawn: string;
    queued?: boolean;
    timeout?: number;
  }

  type IdentityOptions = {
    id?: string;
    spawn?: string;
    queued?: boolean;
    onMount?: (args?: any) => any;
  }

  type SpawnOptions = IdentityOptions & DefaultSpawnOptions;

  // Components

  type DialogicalWrapperOptions = {
    ns: string;
    spawnOptions: SpawnOptions;
  }

  type DialogicalInstanceDispatchFn = (event: InstanceEvent) => void;

  type DialogicalInstanceOptions = {
    spawnOptions: SpawnOptions;
    transitionOptions: TransitionOptions;
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
    [key:string]: CSSStyleDeclaration | undefined;
    default?: CSSStyleDeclaration;
    showStart?: CSSStyleDeclaration;
    showEnd?: CSSStyleDeclaration;
    hideStart?: CSSStyleDeclaration;
    hideEnd?: CSSStyleDeclaration;
  }

  type TransitionStylesFn = (domElement: HTMLElement) => TransitionStyles;

  type TransitionOptions = {
    [key:string]: string | number | TransitionFns | HTMLElement | TransitionStyles | TransitionStylesFn | ConfirmFn | undefined;
    didHide?: ConfirmFn;
    didShow?: ConfirmFn;
    domElement?: HTMLElement;
    timeout?: number;
    transitionClassName?: string;
    transitionStyles?: TransitionStyles | TransitionStylesFn; 
  };
  
  type DialogicOptions = {
    [key:string]: string | TransitionOptions | undefined;
    component?: any;
    transition?: TransitionOptions; 
  }

  type Options = PassThroughOptions | DialogicOptions;

  type MaybeItem = {
    just?: Item;
    nothing?: undefined;
  }

  type ItemTransitionState =
    "none" |
    "hiding";

  type Item = {
    ns: string;
    id: string;
    passThroughOptions: PassThroughOptions;
    key: string;
    spawnOptions: SpawnOptions;
    timer?: Timer;
    transitionOptions: TransitionOptions;
    instanceTransitionOptions: TransitionOptions;
    transitionState: ItemTransitionState;
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
    find: (ns: string, spawnOptions: SpawnOptions) => MaybeItem;
    getAll: (ns: string, identityOptions?: IdentityOptions) => Item[];
    getCount: (ns: string, identityOptions?: IdentityOptions) => number;
  }

  type InstanceEvent = {
    detail: {
      spawnOptions: SpawnOptions;
      // transitionOptions: TransitionOptions;
      domElement: HTMLElement
    }
  }

  type ContentComponentOptions = {
    [key:string]: any;
    show: () => Promise<string>;
    hide: () => Promise<string>;
  }

}
