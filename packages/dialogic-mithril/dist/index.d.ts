/// <reference types="../../node_modules/@types/mithril" />
import m from 'mithril';
import { Dialogical } from './Dialogical';
declare const Dialog: m.Component<import("dialogic/src/types").ComponentOptions, {}>;
declare const Notification: m.Component<import("dialogic/src/types").ComponentOptions, {}>;
export * from './useDialogic';
export * from './useRemaining';
export { dialog, Dialogic, notification, remaining } from 'dialogic';
export { Dialog, Dialogical, Notification };
