import { notification as _notification } from "dialogic";
import { getCount, isPaused, getRemaining } from "./store"; // Access Svelte's store for the count

export const notification = {
  ..._notification,
  getCount: getCount(_notification.ns),
  isPaused: instanceSpawnOptions =>
    isPaused(_notification.ns)(_notification.defaultSpawnOptions)(instanceSpawnOptions)
};
