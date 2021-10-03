import { dialog, notification, states } from "dialogic";
import m from "mithril";
import { Dialogical } from "./Dialogical";

const Dialog = Dialogical(dialog);
const Notification = Dialogical(notification);

export { dialog, Dialogic, notification, remaining } from "dialogic";
export * from "./useDialogic";
export * from "./useRemaining";
export { Dialog, Notification, Dialogical };

states.map((_state) => {
  // console.log(JSON.stringify(_state, null, 2));
  m.redraw();
});
