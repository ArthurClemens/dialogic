import Stream from "mithril/stream";

export const showItem: (ns: string, item: Dialogic.Item) => Promise<string>;
export const hideItem: (ns: string, item: Dialogic.Item) => Promise<string>;
export const filterCandidates: (ns: string, items: Dialogic.NamespaceStore, spawnOptions: Dialogic.SpawnOptions) => Dialogic.Item[];
export const states: Dialogic.States;
export const selectors: Dialogic.StateSelectors;

export const dialog: Dialogic.DialogicInstance;
export const notification: Dialogic.DialogicInstance;

type ConfirmFn = {
  (spawnId: string):  void;
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
    show: (options: Dialogic.Options, instanceSpawnOptions?: Dialogic.InstanceSpawnOptions, fnOptions?: any) => Promise<string>;
    hide: (instanceSpawnOptions?: Dialogic.InstanceSpawnOptions, fnOptions?: any) => Promise<string>;
    toggle: (options: Dialogic.Options, instanceSpawnOptions?: Dialogic.InstanceSpawnOptions, fnOptions?: any) => Promise<string>;
    pause: (instanceSpawnOptions?: Dialogic.InstanceSpawnOptions, fnOptions?: any) => Promise<string>;
    resume: (instanceSpawnOptions?: Dialogic.InstanceSpawnOptions, fnOptions?: Dialogic.TimerResumeOptions) => Promise<string>;
    resetAll: () => Promise<any>;
    hideAll: (options: Dialogic.Options, instanceSpawnOptions?: Dialogic.InstanceSpawnOptions) => void;
    // State
    isDisplayed: (instanceSpawnOptions?: Dialogic.InstanceSpawnOptions) => boolean;
    getCount: (instanceSpawnOptions?: Dialogic.InstanceSpawnOptions) => number;
    // Timer state
    isPaused: (instanceSpawnOptions?: Dialogic.InstanceSpawnOptions) => boolean | undefined;
    getRemaining: (instanceSpawnOptions?: Dialogic.InstanceSpawnOptions) => number | undefined;
  };

  type DefaultSpawnOptions = {
    id: string;
    spawn: string;
    queued?: boolean;
  }

  type InstanceSpawnOptions = {
    id?: string;
    spawn?: string;
    queued?: boolean;
    onMount?: (args?: any) => any;
  }

  type SpawnOptions = InstanceSpawnOptions & DefaultSpawnOptions;

  // Components

  type DialogicalWrapperOptions = {
    ns: string;
    spawnOptions: Dialogic.SpawnOptions;
  }

  type DialogicalInstanceDispatchFn = (event: Dialogic.InstanceEvent) => void;

  type DialogicalInstanceOptions = {
    spawnOptions: Dialogic.SpawnOptions;
    transitionOptions: Dialogic.TransitionOptions;
    instanceOptions: Dialogic.InstanceOptions;
    onMount: DialogicalInstanceDispatchFn;
    onShow: DialogicalInstanceDispatchFn;
    onHide: DialogicalInstanceDispatchFn;
  }
  
  interface InstanceOptions {
    [key:string]: any;
  }
  
  // Transitions

  type DomElements = {
    domElement?: HTMLElement;
  };

  type Transitions = {
    show?: (domElements?: DomElements) => any;
    hide?: (domElements?: DomElements) => any;
  }

  type DefaultTransitionOptions = {
    timeout?: number;
  }

  type TransitionOptions = {
    [key:string]: string | number | Transitions | DomElements | ConfirmFn | undefined;
    didHide?: ConfirmFn;
    didShow?: ConfirmFn;
    domElements?: DomElements;
    hideDelay?: number;
    hideDuration?: number;
    hideTimingFunction?: string;
    showDelay?: number;
    showDuration?: number;
    showTimingFunction?: string;
    timeout?: number;
    transitions?: Transitions;
    showClassName?: string;
    component?: any;
  } & DefaultTransitionOptions;

  type Options = InstanceOptions | TransitionOptions;

  type MaybeItem = {
    just?: Item;
    nothing?: undefined;
  }

  type ItemTransitionState =
    "none" |
    "hiding";

  type Item = {
    id: string;
    instanceOptions: InstanceOptions;
    instanceTransitionOptions: TransitionOptions;
    key: string;
    spawnOptions: SpawnOptions;
    timer?: Timer;
    transitionOptions: TransitionOptions;
    transitionState: ItemTransitionState;
  }

  type NamespaceStore = {
    [key: string]: Item[];
  }

  type State = {
    store: NamespaceStore;
  }

  type InitiateItemTransitionFn = (ns: string, item: Item) => Promise<string>;

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
    callback: Dialogic.TimerCallback;
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
    start: (callback: Dialogic.TimerCallback, duration: number) => void;

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
    getAll: (ns: string, instanceSpawnOptions?: Dialogic.InstanceSpawnOptions) => Item[];
    getCount: (ns: string, instanceSpawnOptions?: Dialogic.InstanceSpawnOptions) => number;
  }

  type InstanceEvent = {
    detail: {
      spawnOptions: Dialogic.SpawnOptions;
      transitionOptions: Dialogic.TransitionOptions;
    }
  }

  type ContentComponentOptions = {
    [key:string]: any;
    show: () => Promise<string>;
    hide: () => Promise<string>;
  }

}
