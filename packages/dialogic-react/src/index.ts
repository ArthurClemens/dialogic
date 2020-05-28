import { dialog, notification } from 'dialogic';
import { Dialogical } from './Dialogical';

const Dialog = Dialogical(dialog);
const Notification = Dialogical(notification);

export { Dialogical, dialog, Dialog, notification, Notification };

export * from './useDialogic';
export * from './useRemaining';
export * from './useDialogicState';
