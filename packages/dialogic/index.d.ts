import Stream from "mithril/stream";

type showFn = (ns: string, defaultTransitionOptions: Dialogic.DefaultTransitionOptions, defaultSpawnOptions: Dialogic.DefaultSpawnOptions) => (options: Dialogic.Options, instanceSpawnOptions: Dialogic.InstanceSpawnOptions) => Promise<string>;
type hideFn = (ns: string, defaultSpawnOptions: Dialogic.DefaultSpawnOptions) => (instanceSpawnOptions: Dialogic.InstanceSpawnOptions) => Promise<string>;
type pauseFn = (ns: string, defaultSpawnOptions: Dialogic.DefaultSpawnOptions) => (instanceSpawnOptions: Dialogic.InstanceSpawnOptions) =>  Promise<string>;
type resumeFn = (ns: string, defaultSpawnOptions: Dialogic.DefaultSpawnOptions) => (instanceSpawnOptions: Dialogic.InstanceSpawnOptions) =>  Promise<string>;
type resetAllFn = (ns: string) => () => Promise<any>
type hideAllFn = (ns: string, defaultSpawnOptions: Dialogic.DefaultSpawnOptions) => (options: Dialogic.Options, instanceSpawnOptions: Dialogic.InstanceSpawnOptions) => void;
type showItemFn = (item: Dialogic.Item, ns: string) => Promise<string>;
type hideItemFn = (item: Dialogic.Item, ns: string) => Promise<string>;
type resetItemFn = (item: Dialogic.Item, ns: string) => void;
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
export const states: Dialogic.States;
export const selectors: Dialogic.StateSelectors;

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

type ConfirmFn = {
  (spawnId: string):  void;
}

export namespace Dialogic {

  type DefaultSpawnOptions = {
    id?: string;
    spawn?: string;
    queued?: boolean;
  }

  type InstanceSpawnOptions = {}

  type SpawnOptions = {
    id: string;
  } & DefaultSpawnOptions & InstanceSpawnOptions;

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
    didHide: ConfirmFn;
    didShow: ConfirmFn;
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
  } & DefaultTransitionOptions;

  interface InstanceOptions {
    [key:string]: string;
  }

  type Options = InstanceOptions & TransitionOptions;

  type MaybeItem = {
    just?: Item;
    nothing?: undefined;
  }

  type Item = {
    id: string;
    instanceOptions: InstanceOptions;
    instanceTransitionOptions: TransitionOptions;
    key: string;
    spawnOptions: SpawnOptions;
    timer: Timer;
    transitionOptions: TransitionOptions;
  }

  type NamespaceStore = {
    [key: string]: Item[];
  }

  type State = {
    store: NamespaceStore;
  }

  type InitiateItemTransitionFn = (item: Item, ns: string) => Promise<string>;

  type TimerCallback = () => any;

  type Timer = {
    /**
     * Starts the timer
     * @param {callback} Callback function that is called after completion.
     * @param {duration} Timer duration in milliseconds.
     */
    start: (callback: TimerCallback, duration: number) => Promise<any>;

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

  type States = Stream<State>;

  type StateSelectors = {
    find: (spawnOptions: SpawnOptions, ns: string) => MaybeItem;
    getAll: (ns: string) => Item[];
    getCount: (ns: string) => number;
  }

}
