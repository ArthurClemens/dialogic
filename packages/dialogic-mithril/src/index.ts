import { dialog, Dialogic, notification, states } from 'dialogic';
import m from 'mithril';

import { Dialogical } from './Dialogical';

const Dialog = Dialogical(dialog);
const Notification = Dialogical(notification);

export { Dialog, dialog, Dialogic, Dialogical, Notification, notification };
export * from './useDialogic';
export * from './useRemaining';

states.map(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  state => m.redraw(),
  // console.log(JSON.stringify(state, null, 2))
);
