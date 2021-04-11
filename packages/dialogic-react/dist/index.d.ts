import { dialog, Dialogic, notification } from 'dialogic';

import { Dialogical } from './Dialogical';

declare const Dialog: (props: Dialogic.ComponentOptions) => JSX.Element;
declare const Notification: (props: Dialogic.ComponentOptions) => JSX.Element;
export { Dialog, dialog, Dialogic, Dialogical, Notification, notification };
export * from './useDialogic';
export * from './useDialogicState';
export * from './useRemaining';
