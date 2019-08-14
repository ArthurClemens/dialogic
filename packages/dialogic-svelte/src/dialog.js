import { dialog as _dialog } from "dialogic";
import { getCount, isPaused, exists } from "./store"; // Access Svelte's store

export const dialog = {
  ..._dialog,
  getCount: identityOptions =>
    getCount(_dialog.ns)(identityOptions),
  isPaused: identityOptions =>
    isPaused(_dialog.ns)(_dialog.defaultSpawnOptions)(identityOptions),
  exists: identityOptions =>
    exists(_dialog.ns)(_dialog.defaultSpawnOptions)(identityOptions),
};
