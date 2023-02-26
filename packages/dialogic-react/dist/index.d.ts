/// <reference types="../../node_modules/@types/react" />
import { Dialogic } from 'dialogic';
import { Dialogical } from './Dialogical';
declare function Dialog(props: Dialogic.ComponentOptions): JSX.Element;
declare function Notification(props: Dialogic.ComponentOptions): JSX.Element;
export * from './useDialogic';
export * from './useDialogicState';
export * from './useRemaining';
export { dialog, Dialogic, notification, remaining } from 'dialogic';
export { Dialog, Dialogical, Notification };
