import { dialog as _dialog } from "dialogic";
import { getCount, isPaused, getRemaining } from "./store"; // Access Svelte's store for the count

export const dialog = {
  ..._dialog,
  getCount: getCount(_dialog.ns),
  isPaused: instanceSpawnOptions =>
    isPaused(_dialog.ns)(_dialog.defaultSpawnOptions)(instanceSpawnOptions)
};
