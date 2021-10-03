/// <reference types="../../node_modules/@types/mithril" />
import m from "mithril";
import { Dialogical } from "./Dialogical";
declare const Dialog: m.Component<import("dialogic/dist/types").ComponentOptions, {}>;
declare const Notification: m.Component<import("dialogic/dist/types").ComponentOptions, {}>;
export { dialog, Dialogic, notification, remaining } from "dialogic";
export * from "./useDialogic";
export * from "./useRemaining";
export { Dialog, Notification, Dialogical };
