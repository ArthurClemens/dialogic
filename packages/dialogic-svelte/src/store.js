import { writable, derived } from "svelte/store";
import { states, selectors } from "dialogic";

export const appState = {
  ...writable(states),
  ...selectors
};

states.map(state => appState.set({
  ...state,
  ...selectors
}));

export const getCount = (ns) => derived(
	appState,
	() => selectors.getCount(ns)
);
