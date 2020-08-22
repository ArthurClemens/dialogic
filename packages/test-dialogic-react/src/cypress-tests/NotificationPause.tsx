import React from 'react';
import NotificationPauseContent from './helpers/NotificationPauseContent';
import { notification, useDialogicState } from 'dialogic-react';
import { Remaining } from './helpers/Remaining';

export default () => {
  useDialogicState();
  return (
    <NotificationPauseContent>
      <Remaining getRemainingFn={notification.getRemaining} />
    </NotificationPauseContent>
  );
};
