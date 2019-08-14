import Stream from "mithril/stream";
import { Dialogic } from "../..";

type PatchFn = (state: Dialogic.State) => Dialogic.State;

const findItem = (id: string, items: any[]) => {
  return items.find(item => item.id === id);
};

const itemIndex = (id: string, items: any[]) => {
  const item = findItem(id, items);
  return items.indexOf(item);
};

const removeItem = (id: string, items: any[]) => {
  const index = itemIndex(id, items);
  if (index !== -1) {
    items.splice(index, 1);
  }
  return items;
};

export const createId = (spawnOptions: Dialogic.SpawnOptions, ns: string) =>
  [ns, spawnOptions.id, spawnOptions.spawn].filter(Boolean).join("-");

const store = {

  initialState: {
    store: {},
  },

  actions: (update: Stream<PatchFn>) => {

    return {

      /**
       * Add an item to the end of the list.
       */
      add: (ns: string, item: Dialogic.Item) => {
        update((state: Dialogic.State) => {
          const items = state.store[ns] || [];
          state.store[ns] = [...items, item];
          if (item.timer) {
            // When the timer state updates, refresh the store so that UI can pick up the change
            item.timer.states.map(() => store.actions(update).refresh())
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
      replace: (ns: string, id: string, newItem: Dialogic.Item) => {
        update((state: Dialogic.State) => {
          const items = state.store[ns] || [];
          if (items) {
            const index = itemIndex(id, items);
            if (index !== -1) {
              items[index] = newItem;
              state.store[ns] = [...items];
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
      store: (ns: string, newItems: Dialogic.Item[]) => {
        update((state: Dialogic.State) => {
          state.store[ns] = [...newItems];
          return state;
        });
      },

      refresh: () => {
        update((state: Dialogic.State) => {
          return {
            ...state,
          }
        })
      },

    };
  },

  selectors: (states: Stream<Dialogic.State>) => {
    const fns = {

      getStore: () => {
        const state = states();
        return state.store;
      },

      find: (ns: string, spawnOptions: Dialogic.SpawnOptions) => {
        const state = states();
        const items = state.store[ns] || [];
        const id = createId(spawnOptions, ns);
        const item = items.find((item: Dialogic.Item) => item.id === id);
        return item
          ? { just: item }
          : { nothing: undefined }
      },

      getAll: (ns: string, identityOptions?: Dialogic.IdentityOptions) => {
        const state = states();
        const items = state.store[ns] || [];
        const spawn = identityOptions !== undefined
          ? identityOptions.spawn
          : undefined;
        const id = identityOptions !== undefined
          ? identityOptions.id
          : undefined;
        const itemsBySpawn = spawn !== undefined
          ? items.filter(item => item.spawnOptions.spawn === spawn)
          : items;
        const itemsById = id !== undefined
          ? itemsBySpawn.filter(item => item.spawnOptions.id === id)
          : itemsBySpawn;
        return itemsById;
      },

      getCount: (ns: string, identityOptions?: Dialogic.IdentityOptions) =>
        fns.getAll(ns, identityOptions).length,

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
  update
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
