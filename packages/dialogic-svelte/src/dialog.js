import { dialog as _dialog } from "dialogic";
import { getCount, isPaused, exists } from "./store"; // Access Svelte's store

export const dialog = {
  ..._dialog,
  getCount: instanceSpawnOptions =>
    getCount(_dialog.ns)(instanceSpawnOptions),
  isPaused: instanceSpawnOptions =>
    isPaused(_dialog.ns)(_dialog.defaultSpawnOptions)(instanceSpawnOptions),
  exists: instanceSpawnOptions =>
    exists(_dialog.ns)(_dialog.defaultSpawnOptions)(instanceSpawnOptions),
};
