import { transition, MODE } from "./transition";
import { actions, selectors, createId } from "./state/store";
import { Timer } from "./state/timer";
import { Dialogic } from "../index";
import { pipe } from "./utils";

export { states, actions, selectors } from "./state/store";

type PerformFn = (ns:string, item: Dialogic.Item, options: Dialogic.IdentityOptions | Dialogic.CommandOptions) => any;
type PerformOnItemNsFn = (ns: string) => (defaultDialogicOptions: Dialogic.DefaultDialogicOptions) => (options: Dialogic.IdentityOptions | Dialogic.CommandOptions) => Promise<Dialogic.Item>;
type PerformOnItemFn = (fn: PerformFn) => PerformOnItemNsFn;

let uid = 0;
const getUid = () =>
  uid === Number.MAX_SAFE_INTEGER
    ? 0
    : uid++;

const transitionStates = {
  default: 0,
  displayed: 1,
  hiding: 2,
};

export const performOnItem: PerformOnItemFn = fn => ns => defaultDialogicOptions => (options: Dialogic.IdentityOptions | Dialogic.CommandOptions) => {
  const maybeItem: Dialogic.MaybeItem = getMaybeItem(ns)(defaultDialogicOptions)(options);
  if (maybeItem.just) {
    return fn(ns, maybeItem.just, options);
  } else {
    return Promise.resolve();
  }
};

const getMaybeItem = (ns: string) => (defaultDialogicOptions: Dialogic.DefaultDialogicOptions) => (identityOptions?: Dialogic.IdentityOptions) => 
  selectors.find(ns, getMergedIdentityOptions(defaultDialogicOptions, identityOptions));

const filterBySpawnOption = (identityOptions: Dialogic.IdentityOptions) => (nsItems: Dialogic.Item[]) => (
  nsItems.filter(item => (
    item.identityOptions.spawn === identityOptions.spawn
  ))
);

/**
 * Gets a list of all non-queued items.
 * From the queued items only the first item is listed.
 * */
const filterFirstInQueue = (nsItems: Dialogic.Item[]) => {
  let queuedCount = 0;
  return nsItems
    .map(item => ({
      item,
      queueCount: item.dialogicOptions.queued
        ? queuedCount++
        : 0
    }))
    .filter(({ queueCount }) => queueCount === 0)
    .map(({ item }) => item);
};

export const filterCandidates = (ns: string, items: Dialogic.NamespaceStore, identityOptions: Dialogic.IdentityOptions) => {
  const nsItems = items[ns] || [];
  if (nsItems.length == 0) {
    return [];
  }
  return pipe(
    filterFirstInQueue,
    filterBySpawnOption(identityOptions)
  )(nsItems);
};

type TGetPassThroughOptions = (options: Dialogic.Options) => Dialogic.PassThroughOptions;

const getPassThroughOptions: TGetPassThroughOptions = options => {
  const copy = {
    ...options,
  };
  delete copy.dialogic;
  return copy;
};

const getMergedIdentityOptions = (defaultDialogicOptions: Dialogic.DefaultDialogicOptions, identityOptions: Dialogic.IdentityOptions = {}) => ({
  id: identityOptions.id || defaultDialogicOptions.id,
  spawn: identityOptions.spawn || defaultDialogicOptions.spawn,
}) as Dialogic.IdentityOptions;

const createInstance = (ns: string) => (defaultDialogicOptions: Dialogic.DefaultDialogicOptions) => (options: Dialogic.Options = {}) => {
  return new Promise(resolve => {

    const identityOptions = {
      id: options.dialogic ? options.dialogic.id : undefined,
      spawn: options.dialogic ? options.dialogic.spawn : undefined
    };
    const mergedIdentityOptions = getMergedIdentityOptions(defaultDialogicOptions, identityOptions);
    
    const dialogicOptions: Dialogic.DialogicOptions = {
      ...defaultDialogicOptions,
      ...options.dialogic
    };

    const passThroughOptions = getPassThroughOptions(options);
    
    const callbacks: Dialogic.Callbacks = {
      didShow: (item: Dialogic.Item) => {
        if (dialogicOptions.didShow) {
          dialogicOptions.didShow(item);
        }
        return resolve(item);
      },
      didHide: (item: Dialogic.Item) => {
        if (dialogicOptions.didHide) {
          dialogicOptions.didHide(item);
        }
        return resolve(item);
      }
    };
    
    const item: Dialogic.Item = {
      ns,
      identityOptions: mergedIdentityOptions,
      dialogicOptions,
      callbacks,
      passThroughOptions,
      id: createId(mergedIdentityOptions, ns),
      timer: dialogicOptions.timeout
        ? Timer()
        : undefined, // when timeout is undefined or 0
      key: getUid().toString(), // Uniquely identify each item for keyed display
      transitionState: transitionStates.default,
    };
    
    const maybeExistingItem: Dialogic.MaybeItem = selectors.find(ns, mergedIdentityOptions);

    if (maybeExistingItem.just && dialogicOptions.toggle) {
      const hideResult = hide(ns)(defaultDialogicOptions)(identityOptions);
      return resolve(hideResult);
    }

    if (maybeExistingItem.just && !dialogicOptions.queued) {
      const existingItem = maybeExistingItem.just;
      // Preserve dialogicOptions
      const dialogicOptions = existingItem.dialogicOptions;
      const replacingItem = {
        ...item,
        transitionState: existingItem.transitionState,
        dialogicOptions
      };
      actions.replace(ns, existingItem.id, replacingItem);
    } else {
      actions.add(ns, item);
      // This will instantiate and draw the instance
      // The instance will call `showDialog` in `onMount`
    }

    resolve(item);
  });
};

export const show = createInstance;

export const hide: PerformOnItemNsFn =
  performOnItem((ns, item) => {
    if (item.transitionState !== transitionStates.hiding) {
      item.transitionState = transitionStates.hiding;
      return hideItem(item);
    } else {
      return Promise.resolve(item);
    }
  });

export const pause: PerformOnItemNsFn =
  performOnItem((ns, item) => {
    if (item && item.timer) {
      item.timer.actions.pause();
    }
    return Promise.resolve(item);
  });

export const resume: PerformOnItemNsFn =
  performOnItem((ns, item, commandOptions: Dialogic.CommandOptions = {}) => {
    if (item && item.timer) {
      item.timer.actions.resume(commandOptions.minimumDuration);
    }
    return Promise.resolve(item);
  });

export const getTimerProperty = (timerProp: "isPaused" | "getRemaining" | "getResultPromise") => (ns: string) => (defaultDialogicOptions: Dialogic.DefaultDialogicOptions) => (identityOptions: Dialogic.IdentityOptions) => {
  const maybeItem: Dialogic.MaybeItem = getMaybeItem(ns)(defaultDialogicOptions)(identityOptions);
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

export const exists = (ns: string) => (defaultDialogicOptions: Dialogic.DefaultDialogicOptions) => (identityOptions: Dialogic.IdentityOptions) => {
  const maybeItem: Dialogic.MaybeItem = getMaybeItem(ns)(defaultDialogicOptions)(identityOptions);
  return !!maybeItem.just;
};

export const resetAll = (ns: string) => (defaultDialogicOptions: Dialogic.DefaultDialogicOptions) => (dialogicOptions?: Dialogic.DialogicOptions) => {
  const allItems = selectors.getAll(ns);
  const validItems = dialogicOptions
    ? filterBySpawnOption({
      ...defaultDialogicOptions,
      ...dialogicOptions,
    })(allItems)
    : allItems;

  const items: Dialogic.Item[] = [];
  
  validItems.forEach((item: Dialogic.Item) => {
    item.timer && item.timer.actions.abort();
    items.push(item);
  });

  if (dialogicOptions) {
    validItems.forEach((item: Dialogic.Item) => {
      actions.remove(ns, item.id)
    });
  } else {
    actions.removeAll(ns);
  }

  return Promise.resolve(items);
};

const getOverridingTransitionOptions = (item: Dialogic.Item, options: Dialogic.DialogicOptions) => {
  return {
    ...item,
    dialogicOptions: {
      ...item.dialogicOptions,
      ...options
    }
  };
};

/**
 * Triggers a `hideItem` for each item in the store.
 * Queued items: will trigger `hideItem` only for the first item, then reset the store.
 * `dialogicOptions` may contain specific transition options. This comes in handy when all items should hide in the same manner.
 * */
export const hideAll = (ns: string) => (defaultDialogicOptions: Dialogic.DefaultDialogicOptions) => (dialogicOptions?: Dialogic.DialogicOptions) => {
  const allItems = selectors.getAll(ns);
  const validItems = dialogicOptions
    ? filterBySpawnOption({
      ...defaultDialogicOptions,
      ...dialogicOptions,
    })(allItems)
    : allItems;

  const options = dialogicOptions || {};
  const regularItems = validItems.filter((item: Dialogic.Item) => !options.queued && !item.dialogicOptions.queued);
  const queuedItems = validItems.filter((item: Dialogic.Item) => options.queued || item.dialogicOptions.queued);

  const items = [];

  regularItems.forEach((item: Dialogic.Item) =>
    items.push(hideItem(getOverridingTransitionOptions(item, options)))
  );

  if (queuedItems.length > 0) {
    const [current, ] = queuedItems;
    // Make sure that any remaining items don't suddenly appear
    actions.store(ns, [current]);
    // Transition the current item
    items.push(
      hideItem(getOverridingTransitionOptions(current, options))
    );
  };

  return Promise.all(items);
};

export const getCount = (ns: string) => (identityOptions?: Dialogic.IdentityOptions) =>
  selectors.getCount(ns, identityOptions);

const transitionItem = (item: Dialogic.Item, mode: string) => {
  return transition(item.dialogicOptions, mode);
};

const deferredHideItem = async function(item: Dialogic.Item, timer: Dialogic.Timer, timeout: number) {
  timer.actions.start(() => (
    hideItem(item)
  ), timeout);
  return getTimerProperty("getResultPromise")
};

export const showItem: Dialogic.InitiateItemTransitionFn = async function(item) {
  if (item.transitionState != transitionStates.displayed) {
    await(transitionItem(item, MODE.SHOW));
    item.transitionState = transitionStates.displayed;
  }
  item.callbacks.didShow && await(item.callbacks.didShow(item));
  if (item.dialogicOptions.timeout && item.timer) {
    await(deferredHideItem(item, item.timer, item.dialogicOptions.timeout));
  }
  return Promise.resolve(item);
};

export const hideItem: Dialogic.InitiateItemTransitionFn = async function(item) {
  // Stop any running timer
  if (item.timer) {
    item.timer.actions.stop();
  }
  await(transitionItem(item, MODE.HIDE));
  item.callbacks.didHide && await(item.callbacks.didHide(item));
  const copy = JSON.parse(JSON.stringify(item));
  actions.remove(item.ns, item.id);
  return Promise.resolve(copy);
};

export const setDomElement = (domElement: HTMLElement, item: Dialogic.Item) => {
  item.dialogicOptions.domElement = domElement;
};
