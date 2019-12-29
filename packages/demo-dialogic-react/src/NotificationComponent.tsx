/**
 * This example uses Material IO
 */

import React, { FunctionComponent } from "react";
import { dialog, notification } from "dialogic-react";
import { DialogComponent } from "./DialogComponent";
import { useRemaining } from "./useRemaining";

type NotificationComponentProps = {
  roundToSeconds: boolean;
}

export const NotificationComponent: FunctionComponent<NotificationComponentProps> = props => (
  <div className="mdc-snackbar mdc-snackbar--open">
    <div className="mdc-snackbar__surface">
      <NotificationContent {...props} />
    </div>
  </div>
);

const NotificationContent: FunctionComponent<NotificationComponentProps> = props => {
  const [remainingSeconds] = useRemaining({ instance: notification, roundToSeconds: props.roundToSeconds });

  return (
    <>
      <div className="mdc-snackbar__label">
        {remainingSeconds !== undefined
          ? `Can't send photo. Retry in ${remainingSeconds} seconds.`
          : "Can't send photo."
        }
      </div>
      <div className="mdc-snackbar__actions">
        <button
          className="button mdc-button mdc-snackbar__action"
          onClick={() => {
            notification.pause();
            dialog.show({
              dialogic: {
                component: DialogComponent,
                className: "dialog",
              },
              title: "Retry sending?",
              body: "We have noticed a slow internet connection. Sending may take a bit longer than usual.",
              onAccept: () => {
                notification.hide();
                notification.resume();
              },
              onReject: () => {
                notification.resume({ minimumDuration: 2000 });
              }
            });
          }}>
          Retry
        </button>
      </div>
    </>
  );
};
