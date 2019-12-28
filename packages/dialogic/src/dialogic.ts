import { transition, MODE } from "./transition";
import { actions, selectors, createId } from "./state/store";
import { Timer } from "./state/timer";
import { Dialogic } from "../index";
import { pipe } from "./utils";

export { states, actions, selectors } from "./state/store";

let uid = 0;
const getUid = () =>
  uid === Number.MAX_SAFE_INTEGER
    ? 0
    : uid++;

const transitionStates = {
  default: 0,
  displaying: 1,
  hiding: 2,
};

const getMaybeItem = (ns: string) => (defaultDialogicOptions: Dialogic.DefaultDialogicOptions) => (identityOptions?: Dialogic.IdentityOptions) => 
  selectors.find(ns, getMergedIdentityOptions(defaultDialogicOptions, identityOptions));

const filterBySpawn = (identityOptions: Dialogic.IdentityOptions) => (items: Dialogic.Item[]) =>
  identityOptions.spawn !== undefined
    ? items.filter(item => (
        item.identityOptions.spawn === identityOptions.spawn
      ))
    : items;

const filterById = (identityOptions: Dialogic.IdentityOptions) => (items: Dialogic.Item[]) => 
  identityOptions.id !== undefined
    ? items.filter(item => (
        item.identityOptions.id === identityOptions.id
      ))
    : items;

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
    filterBySpawn(identityOptions),
    filterFirstInQueue
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

const handleOptions = (defaultDialogicOptions?: Dialogic.DefaultDialogicOptions, options: Dialogic.Options = {}) => {
  const identityOptions = {
    id: options.dialogic ? options.dialogic.id : undefined,
    spawn: options.dialogic ? options.dialogic.spawn : undefined
  };
  const mergedIdentityOptions = getMergedIdentityOptions(defaultDialogicOptions || {} as Dialogic.DefaultDialogicOptions, identityOptions);
  
  const dialogicOptions: Dialogic.DialogicOptions = {
    ...defaultDialogicOptions,
    ...options.dialogic
  };

  const passThroughOptions = getPassThroughOptions(options);

  return {
    identityOptions: mergedIdentityOptions,
    dialogicOptions,
    passThroughOptions,
  }
};

const createInstance = (ns: string) => (defaultDialogicOptions: Dialogic.DefaultDialogicOptions) => (options: Dialogic.Options = {}) => {
  const { identityOptions, dialogicOptions, passThroughOptions } = handleOptions(defaultDialogicOptions, options);

  return new Promise(resolve => {

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
      identityOptions,
      dialogicOptions,
      callbacks,
      passThroughOptions,
      id: createId(identityOptions, ns),
      timer: dialogicOptions.timeout
        ? Timer()
        : undefined, // when timeout is undefined or 0
      key: getUid().toString(), // Uniquely identify each item for keyed display
      transitionState: transitionStates.default,
    };
    
    const maybeExistingItem: Dialogic.MaybeItem = selectors.find(ns, identityOptions);

    if (maybeExistingItem.just && dialogicOptions.toggle) {
      const hideResult = hide(ns)(defaultDialogicOptions)(options);
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

export const hide = (ns: string) => (defaultDialogicOptions?: Dialogic.DefaultDialogicOptions) => (options?: Dialogic.Options) => {
  const { identityOptions, dialogicOptions, passThroughOptions } = handleOptions(defaultDialogicOptions, options);
  const maybeExistingItem: Dialogic.MaybeItem = selectors.find(ns, identityOptions);
  if (maybeExistingItem.just) {
    const existingItem = maybeExistingItem.just;
    const item = {
      ...existingItem,
      dialogicOptions: {
        ...existingItem.dialogicOptions,
        ...dialogicOptions,
      },
      passThroughOptions: {
        ...existingItem.passThroughOptions,
        passThroughOptions
      }
    }
    actions.replace(ns, existingItem.id, item);
    if (item.transitionState !== transitionStates.hiding) {
      return hideItem(item);
    } else {
      return Promise.resolve(item);
    }
  }
  return Promise.resolve();
};

export const pause = (ns: string) => (defaultDialogicOptions?: Dialogic.DefaultDialogicOptions) => (identityOptions?: Dialogic.IdentityOptions) => {
  const items = getValidItems(ns, identityOptions)
    .filter(item => !!item.timer);
  items.forEach((item: Dialogic.Item) =>
    item.timer && item.timer.actions.pause()
  );
  return Promise.all(items);
};

export const resume = (ns: string) => (defaultDialogicOptions?: Dialogic.DefaultDialogicOptions) => (commandOptions?: Dialogic.CommandOptions) => {
  const options = commandOptions || {};
  const identityOptions = {
    id: options.id,
    spawn: options.spawn
  };
  const items = getValidItems(ns, identityOptions)
    .filter(item => !!item.timer);
  items.forEach((item: Dialogic.Item) =>
    item.timer && item.timer.actions.resume(options.minimumDuration)
  );
  return Promise.all(items);
};

export const getTimerProperty = (timerProp: "isPaused" | "getRemaining" | "getResultPromise", defaultValue: false | 0 | undefined) => (ns: string) => (defaultDialogicOptions: Dialogic.DefaultDialogicOptions) => (identityOptions?: Dialogic.IdentityOptions) => {
  const maybeItem: Dialogic.MaybeItem = getMaybeItem(ns)(defaultDialogicOptions)(identityOptions);
  if (maybeItem.just) {
    if (maybeItem.just && maybeItem.just.timer) {
      return maybeItem.just.timer.selectors[timerProp]();
    } else {
      return defaultValue
    }
  } else {
    return defaultValue;
  }
};

export const isPaused = getTimerProperty("isPaused", false);
export const getRemaining = getTimerProperty("getRemaining", undefined);

export const exists = (ns: string) => (defaultDialogicOptions: Dialogic.DefaultDialogicOptions) => (identityOptions: Dialogic.IdentityOptions) =>
  !!getValidItems(ns, identityOptions).length;

type getValidItemsFn = (ns: string, identityOptions?: Dialogic.IdentityOptions) => Dialogic.Item[];

const getValidItems: getValidItemsFn = (ns, identityOptions) => {
  const allItems = selectors.getAll(ns);
  let validItems;
  if (identityOptions) {
    validItems = pipe(
      filterBySpawn(identityOptions),
      filterById(identityOptions)
    )(allItems);
  } else {
    validItems = allItems;
  }
  return validItems;
};

export const resetAll = (ns: string) => (defaultDialogicOptions: Dialogic.DefaultDialogicOptions) => (identityOptions?: Dialogic.IdentityOptions) => {
  const validItems = getValidItems(ns, identityOptions);
  const items: Dialogic.Item[] = [];
  
  validItems.forEach((item: Dialogic.Item) => {
    item.timer && item.timer.actions.abort();
    items.push(item);
  });

  if (identityOptions) {
    items.forEach((item: Dialogic.Item) => {
      actions.remove(ns, item.id);
    });
  } else {
    actions.removeAll(ns);
  }

  return Promise.resolve(items);
};

const getOverridingTransitionOptions = (item: Dialogic.Item, dialogicOptions: Dialogic.DialogicOptions) => {
  return {
    ...item,
    dialogicOptions: {
      ...item.dialogicOptions,
      ...dialogicOptions
    }
  };
};

/**
 * Triggers a `hideItem` for each item in the store.
 * Queued items: will trigger `hideItem` only for the first item, then reset the store.
 * Optional `dialogicOptions` may be passed with specific transition options. This comes in handy when all items should hide in the same way.
 */
export const hideAll = (ns: string) => (defaultDialogicOptions: Dialogic.DefaultDialogicOptions) => (dialogicOptions?: Dialogic.DialogicOptions) => {
  const options = dialogicOptions || {};
  const identityOptions: Dialogic.IdentityOptions = {
    id: options.id,
    spawn: options.spawn
  };
  const validItems = getValidItems(ns, identityOptions);
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

const transitionItem = (item: Dialogic.Item, mode: string) =>
  transition(item.dialogicOptions, mode);

const deferredHideItem = async function(item: Dialogic.Item, timer: Dialogic.Timer, timeout: number) {
  timer.actions.start(() => (
    hideItem(item)
  ), timeout);
  return getTimerProperty("getResultPromise", undefined)
};

export const showItem: Dialogic.InitiateItemTransitionFn = async function(item) {
  if (item.transitionState !== transitionStates.displaying) {
    item.transitionState = transitionStates.displaying;
    await(transitionItem(item, MODE.SHOW));
  }
  item.callbacks.didShow && await(item.callbacks.didShow(item));
  if (item.dialogicOptions.timeout && item.timer) {
    await(deferredHideItem(item, item.timer, item.dialogicOptions.timeout));
  }
  return Promise.resolve(item);
};

export const hideItem: Dialogic.InitiateItemTransitionFn = async function(item) {
  item.transitionState = transitionStates.hiding;
  // Stop any running timer
  if (item.timer) {
    item.timer.actions.stop();
  }
  await(transitionItem(item, MODE.HIDE));
  item.callbacks.didHide && await(item.callbacks.didHide(item));
  const copy = {
    ...item
  };
  actions.remove(item.ns, item.id);
  return Promise.resolve(copy);
};

export const setDomElement = (domElement: HTMLElement, item: Dialogic.Item) => {
  item.dialogicOptions.domElement = domElement;
};
