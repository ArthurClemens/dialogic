import Stream from "mithril/stream";

type showFn = (ns: string, defaultTransitionOptions: Dialogic.TDefaultTransitionOptions, defaultSpawnOptions: Dialogic.TDefaultSpawnOptions) => (options: Dialogic.TOptions, instanceSpawnOptions: Dialogic.TInstanceSpawnOptions) => Promise<string>;
type hideFn = (ns: string, defaultSpawnOptions: Dialogic.TDefaultSpawnOptions) => (instanceSpawnOptions: Dialogic.TInstanceSpawnOptions) => Promise<string>;
type pauseFn = (ns: string, defaultSpawnOptions: Dialogic.TDefaultSpawnOptions) => (instanceSpawnOptions: Dialogic.TInstanceSpawnOptions) =>  Promise<string>;
type resumeFn = (ns: string, defaultSpawnOptions: Dialogic.TDefaultSpawnOptions) => (instanceSpawnOptions: Dialogic.TInstanceSpawnOptions) =>  Promise<string>;
type resetAllFn = (ns: string) => () => Promise<any>
type hideAllFn = (ns: string, defaultSpawnOptions: Dialogic.TDefaultSpawnOptions) => (options: Dialogic.TOptions, instanceSpawnOptions: Dialogic.TInstanceSpawnOptions) => void;
type showItemFn = (item: Dialogic.TItem, ns: string) => Promise<string>;
type hideItemFn = (item: Dialogic.TItem, ns: string) => Promise<string>;
type resetItemFn = (item: Dialogic.TItem, ns: string) => void;
type countFn = (ns: string) => number;

export const show: showFn;
export const hide: hideFn;
export const pause: pauseFn;
export const resume: resumeFn;
export const resetAll: resetAllFn;
export const hideAll: hideAllFn;
export const showItem: showItemFn;
export const hideItem: hideItemFn;
export const resetItem: resetItemFn;
export const count: countFn;
export const states: Dialogic.TStates;
export const selectors: Dialogic.TSelectors;

export namespace Dialogic {

  type TDefaultSpawnOptions = {
    id?: string;
    spawn?: string;
    queued?: boolean;
  }

  type TInstanceSpawnOptions = {
    
  }

  type TSpawnOptions = {
    id: string;
  } & TDefaultSpawnOptions & TInstanceSpawnOptions;

  type TDomElements = {
    domElement?: HTMLElement;
  };

  type TTransitions = {
    show?: (domElements?: TDomElements) => any;
    hide?: (domElements?: TDomElements) => any;
  }

  type TConfirmFn = {
    (spawnId: string):  void;
  }

  type TDefaultTransitionOptions = {
    timeout?: number;
  }

  type TTransitionOptions = {
    [key:string]: string | number | TTransitions | TDomElements | TConfirmFn | undefined;
    showDuration?: number;
    showDelay?: number;
    showTimingFunction?: string;
    hideDuration?: number;
    hideDelay?: number;
    hideTimingFunction?: string;
    transitions?: TTransitions;
    domElements?: TDomElements;
    didShow: TConfirmFn;
    didHide: TConfirmFn;
  } & TDefaultTransitionOptions;

  type TTransitionOptionsKey =
    "showDuration" |
    "showDelay" |
    "showTimingFunction" |
    "hideDuration" |
    "hideDelay" |
    "hideTimingFunction" |
    "transitions" |
    "domElements" |
    "didShow" |
    "didHide" | 
    "timeout"
  ;

  interface TInstanceOptions {
    [key:string]: string;
  }

  type TOptions = TInstanceOptions & TTransitionOptions;

  type TMaybeItem = {
    just?: TItem;
    nothing?: undefined;
  }

  type TItem = {
    id: string;
    instanceOptions: TInstanceOptions;
    instanceTransitionOptions: TTransitionOptions;
    key: string;
    spawnOptions: TSpawnOptions;
    timer: TTimer;
    transitionOptions: TTransitionOptions;
  }

  type TNamespaceStore = {
    [key: string]: TItem[];
  }

  type TState = {
    store: TNamespaceStore;
  }

  export type TInitiateItemTransitionFn = (item: TItem, ns: string) => Promise<string>;

  export type TInstanceEvent = {
    detail: {
      spawnOptions: TSpawnOptions;
      transitionOptions: TTransitionOptions;
    }
  }

  type TCallback = () => any;

  type TTimer = {
    /**
     * Starts the timer
     * @param {callback} Callback function that is called after completion.
     * @param {duration} Timer duration in milliseconds.
     */
    start: (callback: TCallback, duration: number) => Promise<any>;

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
     */
    resume: () => void;

    /**
     * Aborts and clears a timer.
     */
    abort: () => void;
  };

  export type TStates = Stream<TState>;

  export type TSelectors = {
    find: (spawnOptions: TSpawnOptions, ns: string) => TMaybeItem;
    getAll: (ns: string) => TItem[];
    getCount: (ns: string) => number;
  }

  type TPerformFn = (item: TItem, ns:string) => any;
  type TPerformOnItemNsFn = (ns: string, defaultSpawnOptions: TDefaultSpawnOptions) => (instanceSpawnOptions: TInstanceSpawnOptions) => Promise<any>;
  type TPerformOnItemFn = (fn: TPerformFn) => TPerformOnItemNsFn;

}

type DialogicInstance = {
  ns: string;
  defaultId: string;
  defaultSpawn: string;
  show: showFn;
  hide: hideFn;
  pause: pauseFn;
  resume: resumeFn;
  resetAll: resetAllFn;
  hideAll: hideAllFn;
  showItem: showItemFn;
  hideItem: hideItemFn;
  resetItem: resetItemFn;
  count: countFn;
};

export const dialog: DialogicInstance;
export const notification: DialogicInstance;
