import { dialog, Dialogic, notification } from 'dialogic';

// eslint-disable-next-line import/no-unresolved
import { Dialogical } from './Dialogical';

const Dialog = (props: Dialogic.ComponentOptions) => (
  <Dialogical {...props} instance={dialog} />
);
const Notification = (props: Dialogic.ComponentOptions) => (
  <Dialogical {...props} instance={notification} />
);

export { Dialog, dialog, Dialogic, Dialogical, Notification, notification };

export * from './useDialogic';
export * from './useDialogicState';
export * from './useRemaining';
