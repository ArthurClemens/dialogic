import m from "mithril";
import { dialog, notification } from "dialogic-mithril";
import { DialogComponent } from "./DialogComponent";

export const NotificationComponent = ({
  view: () => 
    m(".mdc-snackbar.mdc-snackbar--open", 
      m(".mdc-snackbar__surface",
        m(NotificationContent)
      )
    )
});

const NotificationContent = {
  view: () =>
    [
      m(".mdc-snackbar__label",
        "Can't send photo. Retry in 5 seconds."
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
    ]
};
