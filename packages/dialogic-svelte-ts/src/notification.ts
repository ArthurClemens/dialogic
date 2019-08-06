import { notification as dialogicNotification } from "dialogic";
import { getCount } from "./store";
export const notification = {
  ...dialogicNotification,
  count: getCount(dialogicNotification.ns)
};
