import React from 'react';
import { notification, useRemaining, useDialogicState } from 'dialogic-react';
import NotificationPauseContent from './helpers/NotificationPauseContent';

export default () => {
  useDialogicState();
  const [displayValue] = useRemaining({
    instance: notification,
  });

  return (
    <NotificationPauseContent>
      <div data-test-id="remaining">
        <span>Remaining: </span>
        <span data-test-id="remaining-value">
          {displayValue === undefined ? 'undefined' : displayValue.toString()}
        </span>
      </div>
    </NotificationPauseContent>
  );
};
