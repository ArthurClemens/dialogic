import { writable, derived } from "svelte/store";
import { states, selectors, getTimerProperty, exists as _isDisplayed } from "dialogic";

export const appState = {
  ...writable(states),
  ...selectors
};

states.map(state => appState.set({
  ...state,
  ...selectors
}));

export const getCount = ns => identityOptions => derived(
	appState,
	() => selectors.getCount(ns, identityOptions)
);

export const isPaused = ns => defaultSpawnOptions => identityOptions => derived(
	appState,
	() => getTimerProperty("isPaused")(ns)(defaultSpawnOptions)(identityOptions)
);

export const exists = ns => defaultSpawnOptions => identityOptions => derived(
	appState,
	() => _isDisplayed(ns)(defaultSpawnOptions)(identityOptions)
);
