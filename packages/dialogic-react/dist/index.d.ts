/// <reference types="../../node_modules/@types/react" />
import { Dialogic } from "dialogic";
import { Dialogical } from "./Dialogical";
declare const Dialog: (props: Dialogic.ComponentOptions) => JSX.Element;
declare const Notification: (props: Dialogic.ComponentOptions) => JSX.Element;
export { dialog, Dialogic, notification, remaining } from "dialogic";
export * from "./useDialogic";
export * from "./useDialogicState";
export * from "./useRemaining";
export { Dialog, Notification, Dialogical };
