import { writable, derived } from "svelte/store";
import {
  states,
  selectors,
  isPaused as _isPaused,
  exists as _isDisplayed,
} from "dialogic";
import type { Dialogic } from "dialogic";

export const appState = {
  ...writable<Dialogic.State>(),
  ...selectors,
};

states.map((state) =>
  appState.set({
    ...state,
    ...selectors,
  })
);

export const getCount =
  (ns: string) => (identityOptions?: Dialogic.IdentityOptions) =>
    derived(appState, () => selectors.getCount(ns, identityOptions));

export const isPaused =
  (ns: string) =>
  (defaultDialogicOptions: Dialogic.DefaultDialogicOptions) =>
  (identityOptions?: Dialogic.IdentityOptions) =>
    derived(appState, () =>
      _isPaused(ns)(defaultDialogicOptions)(identityOptions)
    );

export const exists =
  (ns: string) =>
  (defaultDialogicOptions: Dialogic.DefaultDialogicOptions) =>
  (identityOptions?: Dialogic.IdentityOptions) =>
    derived(appState, () =>
      _isDisplayed(ns)(defaultDialogicOptions)(identityOptions)
    );
