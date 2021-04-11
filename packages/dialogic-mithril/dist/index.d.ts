import { dialog, Dialogic, notification } from 'dialogic';
import m from 'mithril';

import { Dialogical } from './Dialogical';

declare const Dialog: m.Component<Dialogic.ComponentOptions, {}>;
declare const Notification: m.Component<Dialogic.ComponentOptions, {}>;
export { Dialog, dialog, Dialogic, Dialogical, Notification, notification };
export * from './useDialogic';
export * from './useRemaining';
