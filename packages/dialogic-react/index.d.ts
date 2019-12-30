import { FunctionComponent } from "react";
import { dialog, notification, Dialogic } from "dialogic";
import { UseDialogicState } from "./src/useDialogicState";
import { UseRemaining } from "./src/useRemaining";

export { dialog, notification };

interface Dialog extends Dialogic.ComponentOptions{}
export const Dialog: FunctionComponent<Dialogic.ComponentOptions>;

interface Notification extends Dialogic.ComponentOptions{}
export const Notification: FunctionComponent<Dialogic.ComponentOptions>;

export const useDialogicState: UseDialogicState;
export const useRemaining: UseRemaining;
