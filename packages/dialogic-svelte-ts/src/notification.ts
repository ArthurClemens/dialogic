import { Dialogic, notification as _notification } from "dialogic";
import { getCount, isPaused, exists } from "./store"; // Access Svelte's store

export const notification = {
  ..._notification,
  getCount: (identityOptions?: Dialogic.IdentityOptions) =>
    getCount(_notification.ns)(identityOptions) as unknown as number,
  isPaused: (identityOptions?: Dialogic.IdentityOptions) =>
    isPaused(_notification.ns)(_notification.defaultDialogicOptions)(
      identityOptions
    ) as unknown as boolean,
  exists: (identityOptions?: Dialogic.IdentityOptions) =>
    exists(_notification.ns)(_notification.defaultDialogicOptions)(
      identityOptions
    ) as unknown as boolean,
};
