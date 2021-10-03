/**
 * This example uses Material IO
 */

import { dialog, notification, remaining } from "dialogic-mithril";
import m, { ClosureComponent, Component } from "mithril";
import { DialogComponent } from "./DialogComponent";

export type NotificationContentProps = {
  remainingSeconds: undefined | number;
};

const NotificationContent: Component<NotificationContentProps> = {
  view: ({ attrs }) => [
    m(
      ".mdc-snackbar__label",
      attrs.remainingSeconds !== undefined
        ? `Some async process message. Retrying in ${attrs.remainingSeconds} seconds.`
        : "Some async process message."
    ),
    m(
      ".mdc-snackbar__actions",
      m(
        "button.mdc-button.mdc-snackbar__action",
        {
          onclick: () => {
            notification.pause();
            dialog.show({
              dialogic: {
                component: DialogComponent,
                className: "dialog",
              },
              title: "About this dialog",
              body: "The notification is paused, so you can take your time to read this message.",
              onAccept: () => {
                notification.hide();
                notification.resume();
              },
              onReject: () => {
                notification.resume({ minimumDuration: 2000 });
              },
            });
          },
        },
        "Show options"
      )
    ),
  ],
};

export type TNotificationComponent = unknown;

export const NotificationComponent: ClosureComponent<TNotificationComponent> =
  () => {
    let remainingSeconds: number | undefined;
    remaining({
      instance: notification,
      roundToSeconds: true,
      callback: (value) => {
        if (value !== remainingSeconds) {
          remainingSeconds = value;
          m.redraw();
        }
      },
    });

    return {
      view: () =>
        m(
          ".mdc-snackbar.mdc-snackbar--open",
          m(
            ".mdc-snackbar__surface",
            m(NotificationContent, { remainingSeconds })
          )
        ),
    };
  };
