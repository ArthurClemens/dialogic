import type { Dialogic } from 'dialogic';
import {
  exists as _isDisplayed,
  isPaused as _isPaused,
  selectors,
  states,
} from 'dialogic';
import { derived, writable } from 'svelte/store';

export const appState = {
  ...writable<Dialogic.State>(),
  ...selectors,
};

states.map(state =>
  appState.set({
    ...state,
    ...selectors,
  }),
);

export const getCount =
  (ns: string) => (identityOptions?: Dialogic.IdentityOptions) =>
    derived(appState, () => selectors.getCount(ns, identityOptions));

export const isPaused =
  (ns: string) =>
  (defaultDialogicOptions: Dialogic.DefaultDialogicOptions) =>
  (identityOptions?: Dialogic.IdentityOptions) =>
    derived(appState, () =>
      _isPaused(ns)(defaultDialogicOptions)(identityOptions),
    );

export const exists =
  (ns: string) =>
  (defaultDialogicOptions: Dialogic.DefaultDialogicOptions) =>
  (identityOptions?: Dialogic.IdentityOptions) =>
    derived(appState, () =>
      _isDisplayed(ns)(defaultDialogicOptions)(identityOptions),
    );
