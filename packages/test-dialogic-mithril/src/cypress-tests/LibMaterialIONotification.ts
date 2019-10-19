import m, { Component } from "mithril";
import { notification, Notification, dialog, Dialog } from "dialogic-mithril";

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
                onAccept: () => notification.hide(),
                onReject: () => notification.resume({ minimumDuration: 2000 }),
              })
            }
          },
          "Retry"
        )
      )
    ]
};

const NotificationComponent = ({
  view: () => 
    m(".mdc-snackbar.mdc-snackbar--open", 
      m(".mdc-snackbar__surface",
        m(NotificationContent)
      )
    )
});

type DialogContentProps = {
  title: string;
  body: string;
  onAccept: () => void;
  onReject: () => void;
}

const DialogContent: Component<DialogContentProps> = {
  view: ({ attrs }) => (
    m(".mdc-dialog__container",
      m(".mdc-dialog__surface",
        [
          m("h2.mdc-dialog__title",
            attrs.title
          ),
          m(".mdc-dialog__content",
            attrs.body
          ),
          m("footer.mdc-dialog__actions",
            [
              m("button.mdc-button.mdc-dialog__button", 
                m("span.mdc-button__label",
                  {
                    onclick: () => {
                      dialog.hide();
                      attrs.onReject();
                    }
                  }, 
                  "Never mind"
                )
              ),
              m("button.mdc-button.mdc-dialog__button", 
                m("span.mdc-button__label",
                  {
                    onclick: () => {
                      dialog.hide();
                      attrs.onAccept();
                    }
                  }, 
                  "Yes, retry"
                )
              )
            ]
          )
        ]
      )
    )
  )
};

const DialogComponent: Component<DialogContentProps> = {
  view: ({ attrs }) =>
    m(".mdc-dialog.mdc-dialog--open",
      [
        m(DialogContent, { ...attrs }),
        m(".mdc-dialog__scrim") // modal, onclick is not used
      ]
    )
};

type RemainingProps = {
  getRemaining: () => number | undefined;
}
type RemainingFn = ({ attrs } : { attrs: RemainingProps }) => Component<RemainingProps>;


const Remaining: RemainingFn = ({ attrs }) => {
  let displayValue: number | undefined = 0;
  let reqId: number;

  const update = () => {
    const remaining = attrs.getRemaining();
    if (remaining !== undefined) {
      if (displayValue !== remaining) {
        m.redraw();
        displayValue = Math.max(remaining, 0);
      }
    } else {
      displayValue = undefined;
      m.redraw();
    }
    reqId = window.requestAnimationFrame(update);
  };
  
  return {
    oncreate: () => reqId = window.requestAnimationFrame(update),
    onremove: () => window.cancelAnimationFrame(reqId),
    view: () => 
      m("span",
        {
          style: {
            minWidth: "3em",
            textAlign: "left"
          }
        },
        displayValue === undefined ? "undefined" : displayValue.toString()
      )
  }
};

export default {
  view: () => {
    return m(".test", [
      m(".message", "Add a notification, then click on the Retry button in the message."),
      m(".buttons", [
        m(".button.is-primary", {
          onclick: () => {
            notification.show({
              dialogic: {
                component: NotificationComponent,
                className: "demo-notification",
              }
            })
          }
        }, "Add notification"),
        m(".button", {
          onclick: () => {
            notification.pause()
          }
        }, "Pause"),
        m(".button", {
          onclick: () => {
            notification.resume()
          }
        }, "Resume"),
        m(".button", {
          onclick: () => {
            notification.hideAll()
          }
        }, "Hide all"),
        m(".button", {
          onclick: () => {
            notification.resetAll()
          }
        }, "Reset all"),
        m(".button.is-static", [
          m("span", "Notifications: "),
          m.trust("&nbsp;"),
          m("span",
            {
              style: {
                minWidth: "1.5em",
                textAlign: "left"
              }
            },
            notification.getCount()
          )
        ]),
        m(".button.is-static", [
          m("span", "Is paused: "),
          m.trust("&nbsp;"),
          m("span",
            {
              style: {
                minWidth: "2em",
                textAlign: "left"
              }
            },
            notification.isPaused().toString()
          )
        ]),
        m(".button.is-static", [
          m("span", "Remaining: "),
          m.trust("&nbsp;"),
          m("span",
            {
              style: {
                minWidth: "3em",
                textAlign: "left"
              }
            },
            m(Remaining, { getRemaining: notification.getRemaining })
          )
        ]),
      ]),
      m(Notification),
      m(Dialog),
    ])
  }
};
