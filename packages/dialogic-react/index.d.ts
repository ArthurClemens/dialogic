import { FunctionComponent } from "react";
import { dialog, notification, Dialogic } from "dialogic";

export { dialog, notification };

interface Dialog extends Dialogic.ComponentOptions{}
export const Dialog: FunctionComponent<Dialogic.ComponentOptions>;

interface Notification extends Dialogic.ComponentOptions{}
export const Notification: FunctionComponent<Dialogic.ComponentOptions>;

export const useDialogicState: () => [Dialogic.NamespaceStore];
