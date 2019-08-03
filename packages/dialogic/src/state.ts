import Stream from "mithril/Stream";
import { Dialogic } from "..";

type TPatchFn = (state: Dialogic.State) => Dialogic.State;

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
  actions: (update: Stream<TPatchFn>) => {
    return {

      /**
       * Add an item to the end of the list.
       */
      add: (item: Dialogic.Item, ns: string) => {
        update((state: Dialogic.State) => {
          const items = state.store[ns] || [];
          state.store[ns] = [...items, item];
          return state;
        });
      },

      /**
       * Removes the first item with a match on `id`.
       */
      remove: (id: string, ns: string) => {
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
      replace: (id: string, newItem: Dialogic.Item, ns: string) => {
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
      store: (newItems: Dialogic.Item[], ns: string) => {
        update((state: Dialogic.State) => {
          state.store[ns] = [...newItems];
          return state;
        });
      },

    };
  },
  selectors: (states: Stream<Dialogic.State>) => {
    return {

      find: (spawnOptions: Dialogic.SpawnOptions, ns: string) => {
        const state = states();
        const items = state.store[ns] || [];
        const id = createId(spawnOptions, ns);
        const item = items.find((item: Dialogic.Item) => item.id === id);
        return item
          ? { just: item }
          : { nothing: undefined }
      },

      getAll: (ns: string) => {
        const state = states();
        return state.store[ns] || [];
      },

      getCount: (ns: string) => {
        const state = states();
        return (state.store[ns] || []).length;
      },

    };
  },
};

const update: Stream<TPatchFn> = Stream<TPatchFn>();

export const states: Dialogic.States = Stream.scan(
  (state: Dialogic.State, patch: TPatchFn) => patch(state),
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
