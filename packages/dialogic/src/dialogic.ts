import uuidv4 from "uuid/v4";
import { transition, transitionOptionKeys, MODE } from "./transition";
import { actions, selectors, createId } from "./state";
import { Timer } from "./timer";

import { Dialogic } from "../index";

export { states, actions, selectors } from "./state";

const filterBySpawnId = (nsItems: Dialogic.TItem[], spawn: string) =>
  nsItems.filter(item => item.spawnOptions.spawn === spawn);

/**
 * Gets a list of all non-queued items.
 * From the queued items only the first item is listed.
 * */
const filterQueued = (nsItems: Dialogic.TItem[], ns: string) => {
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

export const filter = (items: Dialogic.TNamespaceStore, spawn: string, ns: string) => {
  const nsItems = items[ns] || [];
  return filterBySpawnId(filterQueued(nsItems, ns), spawn);
};

type TGetOptionsByKind = (options: Dialogic.TOptions) => {
  transitionOptions: Dialogic.TTransitionOptions;
  instanceOptions: Dialogic.TInstanceOptions;
}

const getOptionsByKind: TGetOptionsByKind = options => {
  const initial = {
    transitionOptions: {} as Dialogic.TTransitionOptions,
    instanceOptions: {} as Dialogic.TInstanceOptions
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

const createInstance = (ns: string, defaultTransitionOptions: Dialogic.TDefaultTransitionOptions, defaultSpawnOptions: Dialogic.TDefaultSpawnOptions) => (options: Dialogic.TOptions, instanceSpawnOptions: Dialogic.TInstanceSpawnOptions) => {
  return new Promise((resolve) => {

    const spawnOptions = {
      ...defaultSpawnOptions,
      ...instanceSpawnOptions,
    } as Dialogic.TSpawnOptions;
    
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

    const uid = uuidv4();
    const item: Dialogic.TItem = {
      spawnOptions,
      transitionOptions,
      instanceTransitionOptions,
      instanceOptions,
      id,
      timer: Timer(),
      key: spawnOptions.queued
        ? uid // Uniquely identify each item for keyed display
        : id,
    };
    
    const maybeExistingItem: Dialogic.TMaybeItem = selectors.find(spawnOptions, ns);
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

type TPerformFn = (item: Dialogic.TItem, ns:string) => any;
type TPerformOnItemNsFn = (ns: string, defaultSpawnOptions: Dialogic.TDefaultSpawnOptions) => (instanceSpawnOptions: Dialogic.TInstanceSpawnOptions) => Promise<any>;
type TPerformOnItemFn = (fn: TPerformFn) => TPerformOnItemNsFn;

export const performOnItem: TPerformOnItemFn = fn => (ns, defaultSpawnOptions) => (instanceSpawnOptions: Dialogic.TInstanceSpawnOptions) => {
  const spawnOptions = {
    ...defaultSpawnOptions,
    ...instanceSpawnOptions,
  } as Dialogic.TSpawnOptions;
  const maybeItem: Dialogic.TMaybeItem = selectors.find(spawnOptions, ns);
  if (maybeItem.just) {
    return fn(maybeItem.just, ns);
  } else {
    return Promise.resolve();
  }
};

export const hide: TPerformOnItemNsFn =
  performOnItem((item, ns) => hideItem(item, ns));

export const pause: TPerformOnItemNsFn =
  performOnItem((item, ns) => {
    if (item && item.timer) {
      item.timer.pause();
    }
    return Promise.resolve();
  });

export const resume: TPerformOnItemNsFn =
  performOnItem((item, ns) => {
    if (item && item.timer) {
      item.timer.resume();
    }
    return Promise.resolve();
  });

export const resetAll = (ns: string) => () => {
  selectors.getAll(ns).forEach((item: Dialogic.TItem) =>
    item.timer.abort()
  );
  actions.removeAll(ns);
  return Promise.resolve();
};

const getOverridingTransitionOptions = (item: Dialogic.TItem, options: Dialogic.TOptions) => {
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
export const hideAll = (ns: string, defaultSpawnOptions: Dialogic.TDefaultSpawnOptions) => (options: Dialogic.TOptions, instanceSpawnOptions: Dialogic.TInstanceSpawnOptions) => {
  const spawnOptions = {
    ...defaultSpawnOptions,
    ...instanceSpawnOptions,
  };
  const allItems = selectors.getAll(ns);
  const regularItems = allItems.filter((item: Dialogic.TItem) => !spawnOptions.queued && !item.spawnOptions.queued);
  const queuedItems = allItems.filter((item: Dialogic.TItem) => spawnOptions.queued || item.spawnOptions.queued);

  regularItems.forEach((item: Dialogic.TItem) =>
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
export const resetItem = (item: Dialogic.TItem, ns: string) => {
  item.timer.abort();
  actions.remove(item.id, ns);
};

export const count = (ns: string) => 
  getCount(ns);

const transitionItem = (item: Dialogic.TItem, mode: string) => {
  return transition(
    {
      ...item.transitionOptions,
      ...item.instanceTransitionOptions
    },
    mode
  );
};

const deferredHideItem = async function(item: Dialogic.TItem, timeout: number, ns: string) {
  return item.timer.start(() => (
    hideItem(item, ns)
  ), timeout);
};

export const showItem: Dialogic.TInitiateItemTransitionFn = async function(item, ns) {
  await(transitionItem(item, MODE.SHOW));
  await(item.transitionOptions.didShow(item.spawnOptions.id));
  if (item.transitionOptions.timeout) {
    await(deferredHideItem(item, item.transitionOptions.timeout, ns));
  }
  return item.spawnOptions.id;
};

export const hideItem: Dialogic.TInitiateItemTransitionFn = async function(item, ns) {
  // Stop any running timer
  if (item.transitionOptions.timeout) {
    item.timer.stop();
  }
  await(transitionItem(item, MODE.HIDE));
  await(item.transitionOptions.didHide(item.spawnOptions.id));
  actions.remove(item.id, ns);
  return item.spawnOptions.id;
};

