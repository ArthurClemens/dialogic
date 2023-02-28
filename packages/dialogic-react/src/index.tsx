import { dialog, Dialogic, notification } from 'dialogic';
import React from 'react';

import { Dialogical } from './Dialogical';

function Dialog(props: Dialogic.ComponentOptions) {
  return <Dialogical {...props} instance={dialog} />;
}
function Notification(props: Dialogic.ComponentOptions) {
  return <Dialogical {...props} instance={notification} />;
}

export * from './useDialogic';
export * from './useDialogicState';
export * from './useRemaining';
export { dialog, Dialogic, notification, remaining } from 'dialogic';
export { Dialog, Dialogical, Notification };
