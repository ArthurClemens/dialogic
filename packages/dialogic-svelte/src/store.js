import { writable, derived } from "svelte/store";
import { states, selectors, getTimerProperty } from "dialogic";

export const appState = {
  ...writable(states),
  ...selectors
};

states.map(state => appState.set({
  ...state,
  ...selectors
}));

export const getCount = ns => defaultSpawnOptions => instanceSpawnOptions => derived(
	appState,
	() => selectors.getCount(ns, defaultSpawnOptions, instanceSpawnOptions)
);

export const isPaused = ns => defaultSpawnOptions => instanceSpawnOptions => derived(
	appState,
	() => getTimerProperty("isPaused")(ns)(defaultSpawnOptions)(instanceSpawnOptions)
);
