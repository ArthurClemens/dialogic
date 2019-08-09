import { notification as _notification } from "dialogic";
import { getCount, isPaused } from "./store"; // Access Svelte's store for the count

export const notification = {
  ..._notification,
  getCount: instanceSpawnOptions =>
    getCount(_notification.ns)(_notification.defaultSpawnOptions)(instanceSpawnOptions),
  isPaused: instanceSpawnOptions =>
    isPaused(_notification.ns)(_notification.defaultSpawnOptions)(instanceSpawnOptions)
};
