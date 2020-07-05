import { notification as _notification } from 'dialogic';
import { getCount, isPaused, exists } from './store'; // Access Svelte's store

export const notification = {
  ..._notification,
  getCount: identityOptions => getCount(_notification.ns)(identityOptions),
  isPaused: identityOptions =>
    isPaused(_notification.ns)(_notification.defaultDialogicOptions)(
      identityOptions,
    ),
  exists: identityOptions =>
    exists(_notification.ns)(_notification.defaultDialogicOptions)(
      identityOptions,
    ),
};
