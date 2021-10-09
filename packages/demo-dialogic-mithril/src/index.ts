import { Dialog, Notification, notification } from "dialogic-mithril";
import m from "mithril";
import {
  NotificationComponent,
  TNotificationComponent,
} from "./NotificationComponent";
import { RemainingLabel } from "./RemainingLabel";
import "./styles.css";

const App = {
  view: () => [
    m(".page", [
      m("main", [
        m("h1", "Dialogic for Mithril demo"),
        m(
          ".message",
          "Add one or more notifications, then click on the Show Options button in the message."
        ),
        m(".ui.message", [
          m(
            ".ui.button.primary",
            {
              onclick: () => {
                notification.show<TNotificationComponent>({
                  dialogic: {
                    component: NotificationComponent,
                    className: "notification",
                    timeout: 4000,
                  },
                });
              },
            },
            "Add notification"
          ),
          m(
            ".ui.button",
            {
              onclick: () => {
                notification.pause();
              },
            },
            "Pause"
          ),
          m(
            ".ui.button",
            {
              onclick: () => {
                notification.resume();
              },
            },
            "Resume"
          ),
          m(
            ".ui.button",
            {
              onclick: () => {
                notification.hideAll();
              },
            },
            "Hide all"
          ),
          m(
            ".ui.button",
            {
              onclick: () => {
                notification.resetAll();
              },
            },
            "Reset all"
          ),
        ]),
        m(".ui.message", [
          m(".ui.label", [
            "Notifications",
            m(".detail", notification.getCount()),
          ]),
          m(".ui.label", [
            "Is paused",
            m(".detail", notification.isPaused().toString()),
          ]),
          notification.exists() &&
            m(".ui.label", ["Remaining", m(".detail", m(RemainingLabel))]),
        ]),
      ]),
      m("footer", [
        m(
          "div",
          m.trust(
            "Dialogic: manage dialogs and notifications. <a href='https://github.com/ArthurClemens/dialogic'>Main documentation on GitHub</a>"
          )
        ),
      ]),
    ]),
    m(Notification),
    m(Dialog),
  ],
};

const rootElement: HTMLElement | null = document.getElementById("app");
if (rootElement) {
  m.mount(rootElement, App);
}
