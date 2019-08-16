import { dialog, notification } from "dialogic";
import { Dialogical } from "./Dialogical";
import { useDialogic } from "./useDialogic";

const Dialog = Dialogical(dialog);
const Notification = Dialogical(notification);

export { Dialogical, dialog, Dialog, notification, Notification, useDialogic };
