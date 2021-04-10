/* eslint-disable no-plusplus */
import { Dialogic } from './index';
import { actions, createId, selectors } from './state/store';
import { Timer, TimerStore } from './state/timer';
import { MODE, transition } from './transition';
import { pipe } from './utils';

export { actions, selectors, states } from './state/store';

const localState = {
  uid: 0,
};

const getUid = () => {
  if (localState.uid === Number.MAX_VALUE) {
    localState.uid = 0;
  } else {
    localState.uid += 1;
  }
  return localState.uid;
};

enum TransitionStates {
  Default,
  Displaying,
  Hiding,
}

const getMaybeItem = <T>(ns: string) => (
  defaultDialogicOptions: Dialogic.DefaultDialogicOptions,
) => (identityOptions?: Dialogic.IdentityOptions) =>
  selectors.find<T>(
    ns,
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    getMergedIdentityOptions(defaultDialogicOptions, identityOptions),
  );

const filterBySpawn = <T>(identityOptions: Dialogic.IdentityOptions) => (
  items: Dialogic.Item<T>[],
) =>
  identityOptions.spawn !== undefined
    ? items.filter(item => item.identityOptions.spawn === identityOptions.spawn)
    : items;

const filterById = <T>(identityOptions: Dialogic.IdentityOptions) => (
  items: Dialogic.Item<T>[],
) =>
  identityOptions.id !== undefined
    ? items.filter(item => item.identityOptions.id === identityOptions.id)
    : items;

/**
 * Gets a list of all non-queued items.
 * From the queued items only the first item is listed.
 * */
const filterFirstInQueue = <T>(nsItems: Dialogic.Item<T>[]) => {
  let queuedCount = 0;
  return nsItems
    .map(item => ({
      item,
      queueCount: item.dialogicOptions.queued ? queuedCount++ : 0,
    }))
    .filter(({ queueCount }) => queueCount === 0)
    .map(({ item }) => item);
};

export const filterCandidates = (
  ns: string,
  items: Dialogic.NamespaceStore,
  identityOptions: Dialogic.IdentityOptions,
) => {
  const nsItems = items[ns] || [];
  if (nsItems.length === 0) {
    return [];
  }
  return pipe(filterBySpawn(identityOptions), filterFirstInQueue)(nsItems);
};

type TGetPassThroughOptions = <T>(options: Dialogic.Options<T>) => T;

const getPassThroughOptions: TGetPassThroughOptions = options => {
  const copy = {
    ...options,
  };
  delete copy.dialogic;
  return copy;
};

const getMergedIdentityOptions = (
  defaultDialogicOptions: Dialogic.DefaultDialogicOptions,
  identityOptions: Dialogic.IdentityOptions = {},
) =>
  ({
    id: identityOptions.id || defaultDialogicOptions.id,
    spawn: identityOptions.spawn || defaultDialogicOptions.spawn,
  } as Dialogic.IdentityOptions);

const handleOptions = <T>(
  defaultDialogicOptions: Dialogic.DefaultDialogicOptions,
  options: Dialogic.Options<T> = {} as T,
) => {
  const identityOptions = {
    id: options.dialogic ? options.dialogic.id : undefined,
    spawn: options.dialogic ? options.dialogic.spawn : undefined,
  };
  const mergedIdentityOptions = getMergedIdentityOptions(
    defaultDialogicOptions || ({} as Dialogic.DefaultDialogicOptions),
    identityOptions,
  );

  const dialogicOptions: Dialogic.DialogicOptions<T> = {
    ...defaultDialogicOptions,
    ...options.dialogic,
    __transitionTimeoutId__: 0,
  };

  const passThroughOptions = getPassThroughOptions(options);

  return {
    identityOptions: mergedIdentityOptions,
    dialogicOptions,
    passThroughOptions,
  };
};

const createInstance = (ns: string) => (
  defaultDialogicOptions: Dialogic.DefaultDialogicOptions,
) => <T = unknown>(options: Dialogic.Options<T> = {} as T) => {
  const {
    identityOptions,
    dialogicOptions,
    passThroughOptions,
  } = handleOptions(defaultDialogicOptions, options);

  // eslint-disable-next-line consistent-return
  return new Promise<Dialogic.Item<T>>(resolve => {
    const callbacks: Dialogic.Callbacks<T> = {
      willShow: (item: Dialogic.Item<T>) => {
        if (dialogicOptions.willShow) {
          dialogicOptions.willShow(item);
        }
        return resolve(item);
      },
      willHide: (item: Dialogic.Item<T>) => {
        if (dialogicOptions.willHide) {
          dialogicOptions.willHide(item);
        }
        return resolve(item);
      },
      didShow: (item: Dialogic.Item<T>) => {
        if (dialogicOptions.didShow) {
          dialogicOptions.didShow(item);
        }
        return resolve(item);
      },
      didHide: (item: Dialogic.Item<T>) => {
        if (dialogicOptions.didHide) {
          dialogicOptions.didHide(item);
        }
        return resolve(item);
      },
    };

    const item: Dialogic.Item<T> = {
      ns,
      identityOptions,
      dialogicOptions,
      callbacks,
      passThroughOptions,
      id: createId(identityOptions, ns),
      timer: dialogicOptions.timeout ? TimerStore() : undefined, // when timeout is undefined or 0
      key: getUid().toString(), // Uniquely identify each item for keyed display
      transitionState: TransitionStates.Default,
    };

    const maybeExistingItem: Dialogic.MaybeItem<T> = selectors.find<T>(
      ns,
      identityOptions,
    );

    const existingItem = maybeExistingItem.just;

    if (existingItem && dialogicOptions.toggle) {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      hide(ns)(defaultDialogicOptions)<T>(options);
      return resolve(existingItem);
    }

    if (existingItem && !dialogicOptions.queued) {
      const replacingItem = {
        ...item,
        key: existingItem.key,
        transitionState: existingItem.transitionState,
        dialogicOptions: existingItem.dialogicOptions, // Preserve dialogicOptions
      };
      actions.replace(ns, existingItem.id, replacingItem as Dialogic.Item<T>);
    } else {
      actions.add(ns, item as Dialogic.Item<T>);
      // This will instantiate and draw the instance
      // The instance will call `showDialog` in `onMount`
    }

    resolve(item);
  });
};

export const show = createInstance;

export const hide = (ns: string) => (
  defaultDialogicOptions: Dialogic.DefaultDialogicOptions,
) => <T = unknown>(options?: Dialogic.Options<T>) => {
  const {
    identityOptions,
    dialogicOptions,
    passThroughOptions,
  } = handleOptions(defaultDialogicOptions, options);
  const maybeExistingItem: Dialogic.MaybeItem<T> = selectors.find<T>(
    ns,
    identityOptions,
  );
  const existingItem = maybeExistingItem.just;
  if (existingItem) {
    const item: Dialogic.Item<T> = {
      ...existingItem,
      dialogicOptions: {
        ...existingItem.dialogicOptions,
        ...dialogicOptions,
      },
      passThroughOptions: {
        ...existingItem.passThroughOptions,
        passThroughOptions,
      },
    };
    actions.replace<T>(ns, existingItem.id, item);
    if (item.transitionState !== TransitionStates.Hiding) {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      return hideItem<T>(item);
    }
    return Promise.resolve(item);
  }
  return Promise.resolve({
    ns,
    id: identityOptions.id,
  } as Dialogic.Item<T>);
};

export const pause = (ns: string) => (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  defaultDialogicOptions: Dialogic.DefaultDialogicOptions,
) => <T = unknown>(identityOptions?: Dialogic.IdentityOptions) => {
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  const validItems = getValidItems<T>(ns, identityOptions).filter(
    item => !!item.timer,
  );
  validItems.forEach((item: Dialogic.Item<T>) => {
    if (item.timer) {
      item.timer.actions.pause();
    }
  });
  return Promise.all(validItems);
};

export const resume = (ns: string) => (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  defaultDialogicOptions: Dialogic.DefaultDialogicOptions,
) => <T = unknown>(commandOptions?: Dialogic.CommandOptions) => {
  const options = commandOptions || {};
  const identityOptions = {
    id: options.id,
    spawn: options.spawn,
  };
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  const validItems = getValidItems<T>(ns, identityOptions).filter(
    item => !!item.timer,
  );
  validItems.forEach((item: Dialogic.Item<T>) => {
    if (item.timer) {
      item.timer.actions.resume(options.minimumDuration);
    }
  });
  return Promise.all(validItems);
};

export const getTimerProperty = (
  timerProp: 'isPaused' | 'getRemaining' | 'getResultPromise',
  defaultValue: false | 0 | undefined,
) => (ns: string) => (
  defaultDialogicOptions: Dialogic.DefaultDialogicOptions,
) => (identityOptions?: Dialogic.IdentityOptions) => {
  const maybeItem: Dialogic.MaybeItem<unknown> = getMaybeItem<unknown>(ns)(
    defaultDialogicOptions,
  )(identityOptions);
  if (maybeItem.just) {
    if (maybeItem.just && maybeItem.just.timer) {
      return maybeItem.just.timer.selectors[timerProp]();
    }
    return defaultValue;
  }
  return defaultValue;
};

const getTimerSelectors = <T = unknown>(
  ns: string,
  defaultDialogicOptions: Dialogic.DefaultDialogicOptions,
  identityOptions?: Dialogic.IdentityOptions,
) => {
  const maybeItem: Dialogic.MaybeItem<T> = getMaybeItem<T>(ns)(
    defaultDialogicOptions,
  )(identityOptions);
  return maybeItem?.just?.timer?.selectors;
};

export const isPaused = (ns: string) => (
  defaultDialogicOptions: Dialogic.DefaultDialogicOptions,
) => (identityOptions: Dialogic.IdentityOptions) =>
  getTimerSelectors(ns, defaultDialogicOptions, identityOptions)?.isPaused() ||
  false;

export const getRemaining = (ns: string) => (
  defaultDialogicOptions: Dialogic.DefaultDialogicOptions,
) => (identityOptions: Dialogic.IdentityOptions) =>
  getTimerSelectors(
    ns,
    defaultDialogicOptions,
    identityOptions,
  )?.getRemaining() || undefined;

export const exists = (ns: string) => (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  defaultDialogicOptions: Dialogic.DefaultDialogicOptions,
) => (identityOptions?: Dialogic.IdentityOptions) =>
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  !!getValidItems(ns, identityOptions).length;

const getValidItems = <T = unknown>(
  ns: string,
  identityOptions?: Dialogic.IdentityOptions,
) => {
  const allItems = selectors.getAll<T>(ns);
  let validItems: Dialogic.Item<T>[];
  if (identityOptions) {
    validItems = pipe(
      filterBySpawn(identityOptions),
      filterById(identityOptions),
    )(allItems);
  } else {
    validItems = allItems;
  }
  return validItems;
};

export const resetAll = (ns: string) => (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  defaultDialogicOptions: Dialogic.DefaultDialogicOptions,
) => (identityOptions?: Dialogic.IdentityOptions) => {
  const validItems = getValidItems(ns, identityOptions);
  const items: Dialogic.Item[] = [];

  validItems.forEach((item: Dialogic.Item) => {
    if (item.timer) {
      item.timer.actions.abort();
    }
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

const getOverridingTransitionOptions = <T>(
  item: Dialogic.Item<T>,
  dialogicOptions: Dialogic.DialogicOptions<T>,
) => ({
  ...item,
  dialogicOptions: {
    ...item.dialogicOptions,
    ...dialogicOptions,
  },
});

/**
 * Triggers a `hideItem` for each item in the store.
 * Queued items: will trigger `hideItem` only for the first item, then reset the store.
 * Optional `dialogicOptions` may be passed with specific transition options. This comes in handy when all items should hide in the same way.
 */
export const hideAll = (ns: string) => (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  defaultDialogicOptions: Dialogic.DefaultDialogicOptions,
) => <T = unknown>(dialogicOptions?: Dialogic.DialogicOptions<T>) => {
  const options = dialogicOptions || {};
  const identityOptions: Dialogic.IdentityOptions = {
    id: options.id,
    spawn: options.spawn,
  };
  const validItems = getValidItems<T>(ns, identityOptions);
  const regularItems = validItems.filter(
    (item: Dialogic.Item<T>) => !options.queued && !item.dialogicOptions.queued,
  );
  const queuedItems = validItems.filter(
    (item: Dialogic.Item<T>) => options.queued || item.dialogicOptions.queued,
  );

  const items = [];

  regularItems.forEach((item: Dialogic.Item<T>) =>
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    items.push(hideItem(getOverridingTransitionOptions<T>(item, options))),
  );

  if (queuedItems.length > 0) {
    const [current] = queuedItems;
    // Make sure that any remaining items don't suddenly appear
    actions.store(ns, [current]);
    // Transition the current item
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    items.push(hideItem(getOverridingTransitionOptions<T>(current, options)));
  }

  return Promise.all(items);
};

export const getCount = (ns: string) => (
  identityOptions?: Dialogic.IdentityOptions,
) => selectors.getCount(ns, identityOptions);

const transitionItem = <T>(item: Dialogic.Item<T>, mode: string) =>
  transition(item.dialogicOptions, mode);

const deferredHideItem = async <T>(
  item: Dialogic.Item<T>,
  timer: Timer,
  timeout: number,
) => {
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  timer.actions.start(() => hideItem(item), timeout);
  return getTimerProperty('getResultPromise', undefined);
};

export const showItem: Dialogic.InitiateItemTransitionFn = async item => {
  if (item.callbacks.willShow) {
    item.callbacks.willShow(item);
  }
  if (item.transitionState !== TransitionStates.Displaying) {
    // eslint-disable-next-line no-param-reassign
    item.transitionState = TransitionStates.Displaying;
    await transitionItem(item, MODE.SHOW);
  }
  if (item.callbacks.didShow) {
    item.callbacks.didShow(item);
  }
  if (item.dialogicOptions.timeout && item.timer) {
    await deferredHideItem(item, item.timer, item.dialogicOptions.timeout);
  }
  return Promise.resolve(item);
};

/**
 * Hides an item. Any timer will be stopped. Any callbacks will be called.
 * @returns A Promise with (a copy of) the data of the removed item.
 */
export const hideItem = async <T = unknown>(
  item: Dialogic.Item<T>,
): Promise<Dialogic.Item<T>> => {
  // eslint-disable-next-line no-param-reassign
  item.transitionState = TransitionStates.Hiding;
  // Stop any running timer
  if (item.timer) {
    item.timer.actions.stop();
  }
  if (item.callbacks.willHide) {
    item.callbacks.willHide(item);
  }
  await transitionItem(item, MODE.HIDE);
  if (item.callbacks.didHide) {
    item.callbacks.didHide(item);
  }
  const copy = {
    ...item,
  };
  actions.remove(item.ns, item.id);
  return Promise.resolve(copy);
};

export const setDomElement = <T = unknown>(
  domElement: HTMLElement,
  item: Dialogic.Item<T>,
) => {
  // eslint-disable-next-line no-param-reassign
  item.dialogicOptions.domElement = domElement;
};
