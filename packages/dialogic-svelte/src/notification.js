import { notification as _notification } from "dialogic";
import { getCount } from "./store"; // Access Svelte's store for the count

export const notification = {
  ..._notification,
  count: getCount(_notification.ns),
};
