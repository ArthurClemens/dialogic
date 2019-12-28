/**
 * This example uses Material IO
 */

import m, { Component } from "mithril";
import { dialog, notification } from "dialogic-mithril";
import { DialogComponent } from "./DialogComponent";

type NotificationComponentProps = {
  remainingSeconds: number | undefined;
}

type NotificationComponent = Component<NotificationComponentProps>;

export const NotificationComponent: NotificationComponent = ({
  view: ({ attrs }) =>
    m(".mdc-snackbar.mdc-snackbar--open",  
      m(".mdc-snackbar__surface",
        m(NotificationContent, attrs)
      )
    )
});

type NotificationContentProps = {} & NotificationComponentProps
type NotificationContent = Component<NotificationContentProps>;

const NotificationContent: NotificationContent = {
  view: ({ attrs }) => {
    return [
      attrs.remainingSeconds !== undefined
        ? m(".mdc-snackbar__label",
          [
            "Can't send photo. Retry in ",
            attrs.remainingSeconds,
            " seconds."
          ]
        )
        : m(".mdc-snackbar__label", "Can't send photo."),
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
                body: "We have noticed a slow internet connection. Sending may take a bit longer than usual.",
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
          "Retry"
        )
      )
    ];
  }
};
