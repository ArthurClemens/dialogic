import m from "mithril";
import { states } from "dialogic";
import { dialog, notification } from "dialogic";
import { Dialogical } from "./Dialogical";

export { dialog, notification };
export const Dialog = Dialogical(dialog);
export const Notification = Dialogical(notification);

const DEBUG = false;

states.map(state => (
  DEBUG && console.log(JSON.stringify(state, null, 2)),
  m.redraw()
));
