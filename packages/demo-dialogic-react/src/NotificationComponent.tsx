/**
 * This example uses Material IO
 */

import React from "react";
import { dialog, notification } from "dialogic-react";
import { DialogComponent } from "./DialogComponent";

export const NotificationComponent = () => (
  <div className="mdc-snackbar mdc-snackbar--open">
    <div className="mdc-snackbar__surface">
      <NotificationContent />
    </div>
  </div>
);

const NotificationContent = () => (
  <>
    <div className="mdc-snackbar__label">
      Can't send photo. Retry in 5 seconds.
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
