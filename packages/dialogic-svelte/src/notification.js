import { notification as _notification } from "dialogic";
import { getCount, isPaused, exists } from "./store"; // Access Svelte's store

export const notification = {
  ..._notification,
  getCount: instanceSpawnOptions =>
    getCount(_notification.ns)(instanceSpawnOptions),
  isPaused: instanceSpawnOptions =>
    isPaused(_notification.ns)(_notification.defaultSpawnOptions)(instanceSpawnOptions),
  exists: instanceSpawnOptions =>
    exists(_notification.ns)(_notification.defaultSpawnOptions)(instanceSpawnOptions),
};
