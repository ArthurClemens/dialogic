import {
  exists as _isDisplayed,
  isPaused as _isPaused,
  selectors,
  states,
} from 'dialogic';
import { derived, writable } from 'svelte/store';

export const appState = {
  ...writable(states),
  ...selectors,
};

states.map(state =>
  appState.set({
    ...state,
    ...selectors,
  }),
);

export const getCount = ns => identityOptions =>
  derived(appState, () => selectors.getCount(ns, identityOptions));

export const isPaused = ns => defaultDialogicOptions => identityOptions =>
  derived(appState, () =>
    _isPaused(ns)(defaultDialogicOptions)(identityOptions),
  );

export const exists = ns => defaultDialogicOptions => identityOptions =>
  derived(appState, () =>
    _isDisplayed(ns)(defaultDialogicOptions)(identityOptions),
  );
