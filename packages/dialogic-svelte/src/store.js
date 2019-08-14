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

export const isPaused = ns => defaultOptions => identityOptions => derived(
	appState,
	() => getTimerProperty("isPaused")(ns)(defaultOptions)(identityOptions)
);

export const exists = ns => defaultOptions => identityOptions => derived(
	appState,
	() => _isDisplayed(ns)(defaultOptions)(identityOptions)
);
