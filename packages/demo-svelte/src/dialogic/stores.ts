import { writable, derived } from "svelte/store";
import { states, selectors } from "dialogic";

// Type imports
import { Writable } from "svelte/types/runtime/store";
import { Dialogic } from "dialogic";

type TAppState = {} & Writable<Dialogic.TStates|Dialogic.TSelectors>;

export const appState: TAppState = {
  ...writable(states),
  ...selectors
};

states.map(state => appState.set({
  ...state,
  ...selectors
}));

export const getCount = (ns: string) => derived(
	appState,
	() => selectors.getCount(ns)
);
