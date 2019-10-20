import m from "mithril";
import { Dialog, notification, Notification } from "dialogic-mithril";
import { Remaining } from "./Remaining";
import { NotificationComponent } from "./NotificationComponent";
import "./styles.css";

const App = {
  view: () => {
    return m(".demo", [
      m(".message", "Add one or more notifications, then click on the Retry button in the message."),
      m(".ui.message", [
        m(".ui.button.primary", {
          onclick: () => {
            notification.show({
              dialogic: {
                component: NotificationComponent,
                className: "notification",
              }
            })
          }
        }, "Add notification"),
        m(".ui.button", {
          onclick: () => {
            notification.pause()
          }
        }, "Pause"),
        m(".ui.button", {
          onclick: () => {
            notification.resume()
          }
        }, "Resume"),
        m(".ui.button", {
          onclick: () => {
            notification.hideAll()
          }
        }, "Hide all"),
        m(".ui.button", {
          onclick: () => {
            notification.resetAll()
          }
        }, "Reset all"),
      ]),
      m(".ui.message", [  
        m(".ui.label", [
          "Notifications",
          m(".detail", 
            notification.getCount()
          )
        ]),
        m(".ui.label", [
          "Is paused",
          m(".detail",
            notification.isPaused().toString()
          )
        ]),
        m(".ui.label", [
          "Remaining",
          m(".detail", 
            m(Remaining, { getRemaining: notification.getRemaining })
          )
        ]),
      ]),
      m(Notification),
      m(Dialog),
    ])
  }
}

const rootElement: HTMLElement | null = document.getElementById("root");
if (rootElement) {
  m.mount(rootElement, App);
}
