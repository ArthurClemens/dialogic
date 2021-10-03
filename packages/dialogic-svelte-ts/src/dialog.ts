import { dialog as _dialog, Dialogic } from "dialogic";
import { getCount, isPaused, exists } from "./store"; // Access Svelte's store

export const dialog = {
  ..._dialog,
  getCount: (identityOptions?: Dialogic.IdentityOptions) =>
    getCount(_dialog.ns)(identityOptions) as unknown as number,
  isPaused: (identityOptions?: Dialogic.IdentityOptions) =>
    isPaused(_dialog.ns)(_dialog.defaultDialogicOptions)(
      identityOptions
    ) as unknown as boolean,
  exists: (identityOptions?: Dialogic.IdentityOptions) =>
    exists(_dialog.ns)(_dialog.defaultDialogicOptions)(
      identityOptions
    ) as unknown as boolean,
};
