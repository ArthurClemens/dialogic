/**
 * This example uses Material IO
 */

import m, { Component } from "mithril";
import { dialog, notification } from "dialogic-mithril";
import { DialogComponent } from "./DialogComponent";
import { remaining } from "dialogic";

type NotificationComponentProps = {}

type NotificationComponent = (props: NotificationComponentProps) => Component<NotificationComponentProps>;

export const NotificationComponent: NotificationComponent = props => {
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
      m(".mdc-snackbar.mdc-snackbar--open",  
        m(".mdc-snackbar__surface",
          m(NotificationContent, { remainingSeconds })
        )
      )
  };
};

type NotificationContentProps = {
  remainingSeconds: undefined | number;
}

const NotificationContent: Component<NotificationContentProps> = {
  view: ({ attrs }) => {
    return [
      m(".mdc-snackbar__label",
        attrs.remainingSeconds !== undefined
          ? `Can't send photo. Retrying in ${attrs.remainingSeconds} seconds.`
          : "Can't send photo."
      ),
      m(".mdc-snackbar__actions",
        m("button.mdc-button.mdc-snackbar__action",
          {
            onclick: () => {
              notification.pause();
              dialog.show({
                dialogic: {
                  component: DialogComponent,
                  className: "dialog",
                },
                title: "Retry sending?",
                body: "We have noticed a slow internet connection. Even when you retry now, sending may take longer than usual.",
                onAccept: () => {
                  notification.hide();
                  notification.resume();
                },
                onReject: () => {
                  notification.resume({ minimumDuration: 2000 });
                }
              })
            }
          },
          "Retry now"
        )
      )
    ];
  }
};
