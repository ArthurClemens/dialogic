import { notification as dialogicNotification } from "dialogic";
import { getCount } from "./stores";
export const notification = {
  ...dialogicNotification,
  count: getCount(dialogicNotification.ns)
};
