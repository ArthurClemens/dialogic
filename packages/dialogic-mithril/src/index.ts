import { dialog, notification, states } from 'dialogic';
import m from 'mithril';

import { Dialogical } from './Dialogical';

const Dialog = Dialogical(dialog);
const Notification = Dialogical(notification);

export * from './useDialogic';
export * from './useRemaining';
export { dialog, Dialogic, notification, remaining } from 'dialogic';
export { Dialog, Dialogical, Notification };

// eslint-disable-next-line array-callback-return
states.map(_state => {
  // console.log(JSON.stringify(_state, null, 2));
  m.redraw();
});
