import { dialog, notification } from "dialogic";
import { Dialogical } from "./Dialogical";
import { useDialogicState } from "./useDialogicState";

const Dialog = Dialogical(dialog);
const Notification = Dialogical(notification);

export { Dialogical, dialog, Dialog, notification, Notification, useDialogicState };
