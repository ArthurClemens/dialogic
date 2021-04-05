/* eslint-disable no-param-reassign */
import Stream from 'mithril/stream';

import { Dialogic } from '../index';

type PatchFn = (state: Dialogic.State) => Dialogic.State;

const findItem = <T = unknown>(id: string, items: Dialogic.Item<T>[]) =>
  items.find(item => item.id === id);

const itemIndex = <T = unknown>(id: string, items: Dialogic.Item<T>[]) => {
  const item = findItem(id, items);
  return item ? items.indexOf(item) : -1;
};

const removeItem = <T = unknown>(id: string, items: Dialogic.Item<T>[]) => {
  const index = itemIndex<T>(id, items);
  if (index !== -1) {
    items.splice(index, 1);
  }
  return items;
};

export const createId = (
  identityOptions: Dialogic.IdentityOptions,
  ns: string,
) => [ns, identityOptions.id, identityOptions.spawn].filter(Boolean).join('-');

const store = {
  initialState: {
    store: {},
  },

  actions: (update: Stream<PatchFn>) => ({
    /**
     * Add an item to the end of the list.
     */
    add: <T>(ns: string, item: Dialogic.Item<T>) => {
      update((state: Dialogic.State) => {
        const items = (state.store[ns] || []) as Dialogic.Item<unknown>[];
        state.store[ns] = [...items, item as Dialogic.Item<unknown>];
        if (item.timer) {
          // When the timer state updates, refresh the store so that UI can pick up the change
          item.timer.states.map(() => store.actions(update).refresh());
        }
        return state;
      });
    },

    /**
     * Removes the first item with a match on `id`.
     */
    remove: (ns: string, id: string) => {
      update((state: Dialogic.State) => {
        const items = state.store[ns] || [];
        const remaining = removeItem(id, items);
        state.store[ns] = remaining;
        return state;
      });
    },

    /**
     * Replaces the first item with a match on `id` with a newItem.
     */
    replace: <T = unknown>(
      ns: string,
      id: string,
      newItem: Dialogic.Item<T>,
    ) => {
      update((state: Dialogic.State) => {
        const items = (state.store[ns] || []) as Dialogic.Item<T>[];
        if (items) {
          const index = itemIndex<T>(id, items);
          if (index !== -1) {
            items[index] = newItem;
            state.store[ns] = [...items] as Dialogic.Item<unknown>[];
          }
        }
        return state;
      });
    },

    /**
     * Removes all items within a namespace.
     */
    removeAll: (ns: string) => {
      update((state: Dialogic.State) => {
        state.store[ns] = [];
        return state;
      });
    },

    /**
     * Replaces all items within a namespace.
     */
    store: <T = unknown>(ns: string, newItems: Dialogic.Item<T>[]) => {
      update((state: Dialogic.State) => {
        state.store[ns] = [...(newItems as Dialogic.Item[])];
        return state;
      });
    },

    refresh: () => {
      update((state: Dialogic.State) => ({
        ...state,
      }));
    },
  }),

  selectors: (states: Stream<Dialogic.State>) => {
    const fns = {
      getStore: () => {
        const state = states();
        return state.store;
      },

      find: <T = unknown>(
        ns: string,
        identityOptions: Dialogic.IdentityOptions,
      ) => {
        const state = states();
        const items = state.store[ns] || [];
        const id = createId(identityOptions, ns);
        const item = items.find(fitem => fitem.id === id) as Dialogic.Item<T>;
        return item ? { just: item } : { nothing: undefined };
      },

      getAll: <T = unknown>(
        ns: string,
        identityOptions?: Dialogic.IdentityOptions,
      ) => {
        const state = states();
        const items = (state.store[ns] || []) as Dialogic.Item<T>[];
        const spawn =
          identityOptions !== undefined ? identityOptions.spawn : undefined;
        const id =
          identityOptions !== undefined ? identityOptions.id : undefined;
        const itemsBySpawn =
          spawn !== undefined
            ? items.filter(fitem => fitem.identityOptions.spawn === spawn)
            : items;
        const itemsById =
          id !== undefined
            ? itemsBySpawn.filter(item => item.identityOptions.id === id)
            : itemsBySpawn;
        return itemsById;
      },

      getCount: <T = unknown>(
        ns: string,
        identityOptions?: Dialogic.IdentityOptions,
      ) => fns.getAll<T>(ns, identityOptions).length,
    };

    return fns;
  },
};

const update: Stream<PatchFn> = Stream<PatchFn>();

export const states: Dialogic.States = Stream.scan(
  (state: Dialogic.State, patch: PatchFn) => patch(state),
  {
    ...store.initialState,
  },
  update,
);

export const actions = {
  ...store.actions(update),
};

export const selectors: Dialogic.StateSelectors = {
  ...store.selectors(states),
};

// states.map(state =>
//   console.log(JSON.stringify(state, null, 2))
// );
