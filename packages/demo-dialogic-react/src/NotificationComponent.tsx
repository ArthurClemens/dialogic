/**
 * This example uses Material IO
 */

import { dialog, notification, useRemaining } from 'dialogic-react';
import React from 'react';

import { DialogComponent } from './DialogComponent';

function NotificationContent(props: TNotificationComponentProps) {
  const [remainingSeconds] = useRemaining({
    instance: notification,
    roundToSeconds: props.roundToSeconds,
  });

  return (
    <>
      <div className='mdc-snackbar__label'>
        {remainingSeconds !== undefined
          ? `Some async process message. Retrying in ${remainingSeconds} seconds.`
          : 'Some async process message.'}
      </div>
      <div className='mdc-snackbar__actions'>
        <button
          type='button'
          className='button mdc-button mdc-snackbar__action'
          onClick={() => {
            notification.pause();
            dialog.show({
              dialogic: {
                component: DialogComponent,
                className: 'dialog',
              },
              title: 'About this dialog',
              body: 'The notification is paused, so you can take your time to read this message.',
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
          Show options
        </button>
      </div>
    </>
  );
}

export type TNotificationComponentProps = {
  roundToSeconds: boolean;
};

export function NotificationComponent(props: TNotificationComponentProps) {
  return (
    <div className='mdc-snackbar mdc-snackbar--open'>
      <div className='mdc-snackbar__surface'>
        <NotificationContent {...props} />
      </div>
    </div>
  );
}
