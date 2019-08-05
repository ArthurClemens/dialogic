import { transition, transitionOptionKeys, MODE } from "./transition";
import { actions, selectors, createId } from "./state";
import { Timer } from "./timer";
import { Dialogic } from "../index";

export { states, actions, selectors } from "./state";

type PerformFn = (item: Dialogic.Item, ns:string) => any;
type PerformOnItemNsFn = (ns: string) => (defaultSpawnOptions: Dialogic.DefaultSpawnOptions) => (instanceSpawnOptions: Dialogic.InstanceSpawnOptions) => Promise<any>;
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

const getCount = (ns: string) => 
  selectors.getCount(ns);

export const filter = (items: Dialogic.NamespaceStore, spawn: string, ns: string) => {
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

const createInstance = (ns: string) => (defaultSpawnOptions: Dialogic.DefaultSpawnOptions) => (defaultTransitionOptions: Dialogic.DefaultTransitionOptions) => (options: Dialogic.Options, instanceSpawnOptions: Dialogic.InstanceSpawnOptions) => {
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
      timer: Timer(),
      key: uid, // Uniquely identify each item for keyed display
      transitionState: transitionStates.none as Dialogic.ItemTransitionState,
    };
    
    const maybeExistingItem: Dialogic.MaybeItem = selectors.find(spawnOptions, ns);
    if (maybeExistingItem.just && !spawnOptions.queued) {
      const existingItem = maybeExistingItem.just;
      // Preserve instanceTransitionOptions
      const instanceTransitionOptions = existingItem.instanceTransitionOptions;
      const replacingItem = {
        ...item,
        instanceTransitionOptions
      };
      actions.replace(existingItem.id, replacingItem, ns);
      // While this is a replace action, mimic a show
      transitionOptions.didShow(spawnOptions.id);
    } else {
      actions.add(item, ns);
      // This will instantiate and draw the instance
      // The instance will call `showDialog` in `onMount`
    }
  });
};

export const show = createInstance;

export const performOnItem: PerformOnItemFn = fn => (ns) => (defaultSpawnOptions) => (instanceSpawnOptions: Dialogic.InstanceSpawnOptions) => {
  const spawnOptions = {
    ...defaultSpawnOptions,
    ...instanceSpawnOptions,
  } as Dialogic.SpawnOptions;
  const maybeItem: Dialogic.MaybeItem = selectors.find(spawnOptions, ns);
  if (maybeItem.just) {
    return fn(maybeItem.just, ns);
  } else {
    return Promise.resolve();
  }
};

export const hide: PerformOnItemNsFn =
  performOnItem((item, ns) => {
    if (item.transitionState !== transitionStates.hiding as Dialogic.ItemTransitionState) {
      item.transitionState = transitionStates.hiding as Dialogic.ItemTransitionState;
      return hideItem(item, ns);
    } else {
      return Promise.resolve();
    }
  });

export const pause: PerformOnItemNsFn =
  performOnItem((item, ns) => {
    if (item && item.timer) {
      item.timer.pause();
    }
    return Promise.resolve();
  });

export const resume: PerformOnItemNsFn =
  performOnItem((item, ns) => {
    if (item && item.timer) {
      item.timer.resume();
    }
    return Promise.resolve();
  });

export const resetAll = (ns: string) => () => {
  selectors.getAll(ns).forEach((item: Dialogic.Item) =>
    item.timer.abort()
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
    hideItem(getOverridingTransitionOptions(item, options), ns)
  );

  if (queuedItems.length > 0) {
    const [current, ] = queuedItems;
    // Make sure that any remaining items don't suddenly appear
    actions.store([current], ns);
    // Transition the current item
    hideItem(getOverridingTransitionOptions(current, options), ns)
      .then(() => actions.removeAll(ns))
  };
};

/**
 * Stop any running timer and remmove the item
 */
export const resetItem = (item: Dialogic.Item, ns: string) => {
  item.timer.abort();
  actions.remove(item.id, ns);
};

export const count = (ns: string) => 
  getCount(ns);

const transitionItem = (item: Dialogic.Item, mode: string) => {
  return transition(
    {
      ...item.instanceTransitionOptions,
      ...item.transitionOptions,
    },
    mode
  );
};

const deferredHideItem = async function(item: Dialogic.Item, timeout: number, ns: string) {
  return item.timer.start(() => (
    hideItem(item, ns)
  ), timeout);
};

export const showItem: Dialogic.InitiateItemTransitionFn = async function(item, ns) {
  await(transitionItem(item, MODE.SHOW));
  await(item.transitionOptions.didShow(item.spawnOptions.id));
  if (item.transitionOptions.timeout) {
    await(deferredHideItem(item, item.transitionOptions.timeout, ns));
  }
  return item.spawnOptions.id;
};

export const hideItem: Dialogic.InitiateItemTransitionFn = async function(item, ns) {
  // Stop any running timer
  if (item.transitionOptions.timeout) {
    item.timer.stop();
  }
  await(transitionItem(item, MODE.HIDE));
  await(item.transitionOptions.didHide(item.spawnOptions.id));
  actions.remove(item.id, ns);
  return item.spawnOptions.id;
};

