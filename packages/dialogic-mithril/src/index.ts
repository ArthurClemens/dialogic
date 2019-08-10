import m from "mithril";
import { states } from "dialogic";
import { dialog, notification } from "dialogic";
import { Dialogical } from "./Dialogical";

const Dialog = Dialogical(dialog);
const Notification = Dialogical(notification);

export { Dialogical, dialog, Dialog, notification, Notification };

states.map(state => (
  m.redraw()
));
