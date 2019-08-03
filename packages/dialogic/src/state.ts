import Stream from "mithril/Stream";
import { Dialogic } from "..";

type TPatchFn = (state: Dialogic.TState) => Dialogic.TState;

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

export const createId = (spawnOptions: Dialogic.TSpawnOptions, ns: string) =>
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
      add: (item: Dialogic.TItem, ns: string) => {
        update((state: Dialogic.TState) => {
          const items = state.store[ns] || [];
          state.store[ns] = [...items, item];
          return state;
        });
      },

      /**
       * Removes the first item with a match on `id`.
       */
      remove: (id: string, ns: string) => {
        update((state: Dialogic.TState) => {
          const items = state.store[ns] || [];
          const remaining = removeItem(id, items);
          state.store[ns] = remaining;
          return state;
        });
      },

      /**
       * Replaces the first item with a match on `id` with a newItem.
       */
      replace: (id: string, newItem: Dialogic.TItem, ns: string) => {
        update((state: Dialogic.TState) => {
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
        update((state: Dialogic.TState) => {
          state.store[ns] = [];
          return state;
        });
      },

      /**
       * Replaces all items within a namespace.
       */
      store: (newItems: Dialogic.TItem[], ns: string) => {
        update((state: Dialogic.TState) => {
          state.store[ns] = [...newItems];
          return state;
        });
      },

    };
  },
  selectors: (states: Stream<Dialogic.TState>) => {
    return {

      find: (spawnOptions: Dialogic.TSpawnOptions, ns: string) => {
        const state = states();
        const items = state.store[ns] || [];
        const id = createId(spawnOptions, ns);
        const item = items.find((item: Dialogic.TItem) => item.id === id);
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

export const states: Dialogic.TStates = Stream.scan(
  (state: Dialogic.TState, patch: TPatchFn) => patch(state),
  {
    ...store.initialState,
  },
  update
);

export const actions = {
  ...store.actions(update),
};

export const selectors: Dialogic.TSelectors = {
  ...store.selectors(states),
};

// states.map(state => 
//   console.log(JSON.stringify(state, null, 2))
// );
