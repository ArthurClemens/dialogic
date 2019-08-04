import { notification as _notification } from "dialogic";
import { getCount } from "./stores";

export const notification = {
  ..._notification,
  count: getCount(_notification.ns),
};
