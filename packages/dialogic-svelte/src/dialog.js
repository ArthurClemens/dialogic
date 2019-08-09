import { dialog as _dialog } from "dialogic";
import { getCount, isPaused, isDisplayed } from "./store"; // Access Svelte's store for the count

export const dialog = {
  ..._dialog,
  getCount: instanceSpawnOptions =>
    getCount(_dialog.ns)(instanceSpawnOptions),
  isPaused: instanceSpawnOptions =>
    isPaused(_dialog.ns)(_dialog.defaultSpawnOptions)(instanceSpawnOptions),
  isDisplayed: instanceSpawnOptions =>
    isDisplayed(_dialog.ns)(_dialog.defaultSpawnOptions)(instanceSpawnOptions),
};
