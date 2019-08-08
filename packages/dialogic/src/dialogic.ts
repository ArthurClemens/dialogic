import { transition, transitionOptionKeys, MODE } from "./transition";
import { actions, selectors, createId } from "./state";
import { Timer } from "./Timer";
import { Dialogic } from "../index";

export { states, actions, selectors } from "./state";

type PerformFn = (ns:string, item: Dialogic.Item, fnOptions?: any) => any;
type PerformOnItemNsFn = (ns: string) => (defaultSpawnOptions: Dialogic.DefaultSpawnOptions) => (instanceSpawnOptions: Dialogic.InstanceSpawnOptions, fnOptions?: any) => Promise<any>;
type PerformOnItemFn = (fn: PerformFn) => PerformOnItemNsFn;

let uid = 0;
const getUid = () =>
  uid === Number.MAX_SAFE_INTEGER
    ? 0
    : uid++;

const transitionStates = {
  none: "none",
  hiding: "hiding"
};

const filterBySpawnId = (nsItems: Dialogic.Item[], spawn: string) =>
  nsItems.filter(item => item.spawnOptions.spawn === spawn);

/**
 * Gets a list of all non-queued items.
 * From the queued items only the first item is listed.
 * */
const filterQueued = (nsItems: Dialogic.Item[], ns: string) => {
  let queuedCount = 0;
  return nsItems
    .map(item => ({
      item,
      queueCount: item.spawnOptions.queued
        ? queuedCount++
        : 0
    }))
    .filter(({ queueCount }) => queueCount === 0)
    .map(({ item }) => item);
};

export const filter = (ns: string, items: Dialogic.NamespaceStore, spawn: string) => {
  const nsItems = items[ns] || [];
  return filterBySpawnId(filterQueued(nsItems, ns), spawn);
};

type TGetOptionsByKind = (options: Dialogic.Options) => {
  transitionOptions: Dialogic.TransitionOptions;
  instanceOptions: Dialogic.InstanceOptions;
}

const getOptionsByKind: TGetOptionsByKind = options => {
  const initial = {
    transitionOptions: {} as Dialogic.TransitionOptions,
    instanceOptions: {} as Dialogic.InstanceOptions
  };
  return Object.keys(options).reduce((acc, key) => {
    const value: any = options[key];
    const isTransitionKey: boolean = transitionOptionKeys[key];
    if (isTransitionKey) {
      acc.transitionOptions[key] = value;
    } else {
      acc.instanceOptions[key] = value;
    }
    return acc;
  }, initial );
};

const createInstance = (ns: string) => (defaultSpawnOptions: Dialogic.DefaultSpawnOptions) => (defaultTransitionOptions: Dialogic.DefaultTransitionOptions) => (options: Dialogic.Options, instanceSpawnOptions?: Dialogic.InstanceSpawnOptions) => {
  return new Promise((resolve) => {

    const spawnOptions = {
      ...defaultSpawnOptions,
      ...instanceSpawnOptions,
    } as Dialogic.SpawnOptions;
    
    const id = createId(spawnOptions, ns);
    
    const { transitionOptions: instanceTransitionOptions, instanceOptions } = getOptionsByKind(options);
    
    const transitionOptions = {
      ...defaultTransitionOptions,
      ...instanceTransitionOptions,
    };

    transitionOptions.didShow = (id) => {
      if (options.didShow) {
        options.didShow(id);
      }
      return resolve(id);
    };

    transitionOptions.didHide = (id) => {
      if (options.didHide) {
        options.didHide(id);
      }
      return resolve(id);
    };

    const uid = getUid().toString();
    const item: Dialogic.Item = {
      spawnOptions,
      transitionOptions,
      instanceTransitionOptions,
      instanceOptions,
      id,
      timer: transitionOptions.timeout
        ? Timer()
        : undefined,
      key: uid, // Uniquely identify each item for keyed display
      transitionState: transitionStates.none as Dialogic.ItemTransitionState,
    };
    
    const maybeExistingItem: Dialogic.MaybeItem = selectors.find(ns, spawnOptions);
    if (maybeExistingItem.just && !spawnOptions.queued) {
      const existingItem = maybeExistingItem.just;
      // Preserve instanceTransitionOptions
      const instanceTransitionOptions = existingItem.instanceTransitionOptions;
      const replacingItem = {
        ...item,
        instanceTransitionOptions
      };
      actions.replace(ns, existingItem.id, replacingItem);
      // While this is a replace action, mimic a show
      transitionOptions.didShow(spawnOptions.id);
    } else {
      actions.add(ns, item);
      // This will instantiate and draw the instance
      // The instance will call `showDialog` in `onMount`
    }
  });
};

export const show = createInstance;

const getMaybeItem = (ns: string, defaultSpawnOptions: Dialogic.DefaultSpawnOptions, instanceSpawnOptions: Dialogic.InstanceSpawnOptions) => {
  const spawnOptions = {
    ...defaultSpawnOptions,
    ...instanceSpawnOptions,
  } as Dialogic.SpawnOptions;
  return selectors.find(ns, spawnOptions);
}

export const performOnItem: PerformOnItemFn = fn => ns => defaultSpawnOptions => (instanceSpawnOptions: Dialogic.InstanceSpawnOptions, fnOptions?: any) => {
  const maybeItem: Dialogic.MaybeItem = getMaybeItem(ns, defaultSpawnOptions, instanceSpawnOptions);
  if (maybeItem.just) {
    return fn(ns, maybeItem.just, fnOptions);
  } else {
    return Promise.resolve();
  }
};

export const hide: PerformOnItemNsFn =
  performOnItem((ns, item) => {
    if (item.transitionState !== transitionStates.hiding as Dialogic.ItemTransitionState) {
      item.transitionState = transitionStates.hiding as Dialogic.ItemTransitionState;
      return hideItem(ns, item);
    } else {
      return Promise.resolve();
    }
  });

export const pause: PerformOnItemNsFn =
  performOnItem((ns, item) => {
    if (item && item.timer) {
      item.timer.actions.pause();
    }
    return Promise.resolve();
  });

export const resume: PerformOnItemNsFn =
  performOnItem((ns, item, fnOptions: Dialogic.TimerResumeOptions = {}) => {
    if (item && item.timer) {
      item.timer.actions.resume(fnOptions.minimumDuration);
    }
    return Promise.resolve();
  });

export const getTimerProperty = (timerProp: "isPaused" | "getRemaining" | "getResultPromise") =>(ns: string) => (defaultSpawnOptions: Dialogic.DefaultSpawnOptions) => (instanceSpawnOptions: Dialogic.InstanceSpawnOptions) => {
  const maybeItem: Dialogic.MaybeItem = getMaybeItem(ns, defaultSpawnOptions, instanceSpawnOptions);
  if (maybeItem.just) {
    if (maybeItem.just && maybeItem.just.timer) {
      return maybeItem.just.timer.selectors[timerProp]();
    } else {
      return undefined
    }
  } else {
    return undefined;
  }
};

export const isPaused = getTimerProperty("isPaused");
export const getRemaining = getTimerProperty("getRemaining");

export const resetAll = (ns: string) => () => {
  selectors.getAll(ns).forEach((item: Dialogic.Item) =>
    item.timer && item.timer.actions.abort()
  );
  actions.removeAll(ns);
  return Promise.resolve();
};

const getOverridingTransitionOptions = (item: Dialogic.Item, options: Dialogic.Options) => {
  const { transitionOptions } = getOptionsByKind(options);
  return {
    ...item,
    transitionOptions: {
      ...item.transitionOptions,
      ...transitionOptions
    }
  };
};

/**
 * Triggers a `hideItem` for each item in the store.
 * Queued items: will trigger `hideItem` only for the first item, then reset the store.
 * `options` may contain specific transition options. This comes in handy when all items should hide in the same manner.
 * */
export const hideAll = (ns: string) => (defaultSpawnOptions: Dialogic.DefaultSpawnOptions) => (options: Dialogic.Options, instanceSpawnOptions: Dialogic.InstanceSpawnOptions) => {
  const spawnOptions = {
    ...defaultSpawnOptions,
    ...instanceSpawnOptions,
  };
  const allItems = selectors.getAll(ns);
  const regularItems = allItems.filter((item: Dialogic.Item) => !spawnOptions.queued && !item.spawnOptions.queued);
  const queuedItems = allItems.filter((item: Dialogic.Item) => spawnOptions.queued || item.spawnOptions.queued);

  regularItems.forEach((item: Dialogic.Item) =>
    hideItem(ns, getOverridingTransitionOptions(item, options))
  );

  if (queuedItems.length > 0) {
    const [current, ] = queuedItems;
    // Make sure that any remaining items don't suddenly appear
    actions.store(ns, [current]);
    // Transition the current item
    hideItem(ns, getOverridingTransitionOptions(current, options))
      .then(() => actions.removeAll(ns))
  };
};

/**
 * Stop any running timer and remmove the item
 */
export const resetItem = (item: Dialogic.Item, ns: string) => {
  item.timer && item.timer.actions.abort();
  actions.remove(ns, item.id);
};

export const getCount = (ns: string) => (instanceSpawnOptions?: Dialogic.InstanceSpawnOptions) =>
  selectors.getCount(ns, instanceSpawnOptions);

const transitionItem = (item: Dialogic.Item, mode: string) => {
  try {
    return transition(
      {
        ...item.instanceTransitionOptions,
        ...item.transitionOptions,
      },
      mode
    );
  } catch(e) {
    throw new Error(`Transition error: ${e}`);
  }
};

const deferredHideItem = async function(ns: string, item: Dialogic.Item, timer: Dialogic.Timer, timeout: number) {
  timer.actions.start(() => (
    hideItem(ns, item)
  ), timeout);
  return getTimerProperty("getResultPromise") // timer.selectors.getResultPromise();
};

export const showItem: Dialogic.InitiateItemTransitionFn = async function(ns, item) {
  await(transitionItem(item, MODE.SHOW));
  item.transitionOptions.didShow && await(item.transitionOptions.didShow(item.spawnOptions.id));
  if (item.transitionOptions.timeout && item.timer) {
    await(deferredHideItem(ns, item, item.timer, item.transitionOptions.timeout));
  }
  return item.spawnOptions.id;
};

export const hideItem: Dialogic.InitiateItemTransitionFn = async function(ns, item) {
  // Stop any running timer
  if (item.timer) {
    item.timer.actions.stop();
  }
  await(transitionItem(item, MODE.HIDE));
  item.transitionOptions.didHide && await(item.transitionOptions.didHide(item.spawnOptions.id));
  actions.remove(ns, item.id);
  return item.spawnOptions.id;
};

