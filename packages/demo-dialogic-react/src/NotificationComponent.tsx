/**
 * This example uses Material IO
 */

import React, { FunctionComponent } from 'react';
import { dialog, notification, useRemaining } from 'dialogic-react';
import { DialogComponent } from './DialogComponent';

export type TNotificationComponentProps = {
  roundToSeconds: boolean;
};

export const NotificationComponent: FunctionComponent<TNotificationComponentProps> = props => (
  <div className="mdc-snackbar mdc-snackbar--open">
    <div className="mdc-snackbar__surface">
      <NotificationContent {...props} />
    </div>
  </div>
);

const NotificationContent: FunctionComponent<TNotificationComponentProps> = props => {
  const [remainingSeconds] = useRemaining({
    instance: notification,
    roundToSeconds: props.roundToSeconds,
  });

  return (
    <>
      <div className="mdc-snackbar__label">
        {remainingSeconds !== undefined
          ? `Can't send photo. Retrying in ${remainingSeconds} seconds.`
          : "Can't send photo."}
      </div>
      <div className="mdc-snackbar__actions">
        <button
          className="button mdc-button mdc-snackbar__action"
          onClick={() => {
            notification.pause();
            dialog.show({
              dialogic: {
                component: DialogComponent,
                className: 'dialog',
              },
              title: 'Retry sending?',
              body:
                'We have noticed a slow internet connection. Even when you retry now, sending may take longer than usual.',
              onAccept: () => {
                notification.hide();
                notification.resume();
              },
              onReject: () => {
                notification.resume({ minimumDuration: 2000 });
              },
            });
          }}
        >
          Retry now
        </button>
      </div>
    </>
  );
};
