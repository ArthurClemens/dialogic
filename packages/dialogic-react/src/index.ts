import { dialog, notification } from 'dialogic';
import { Dialogical } from './Dialogical';
import { useDialogicState } from './useDialogicState';
import { useRemaining } from './useRemaining';

const Dialog = Dialogical(dialog);
const Notification = Dialogical(notification);

export {
  Dialogical,
  dialog,
  Dialog,
  notification,
  Notification,
  useDialogicState,
  useRemaining,
};

export * from './MakeAppear';
