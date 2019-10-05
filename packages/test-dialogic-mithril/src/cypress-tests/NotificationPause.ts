import m from "mithril";
import { createFns } from "./createFns";
import { Default } from "../content/Default";
import { buttons } from "./buttons";
import { notification, Notification } from "dialogic-mithril";
import { Remaining } from "./Remaining";

export default () => {
  const fns1 = createFns({ instance: notification, component: Default, className: "notification", title: "Default", timeout: 2000 });
  
  return {
    view: () => {
      return m(".test", [
        m(".control",
          { "data-test-id": "reset-all" }, 
          m(".buttons", [
            m("button", 
              {
                className: "button",
                onclick: () => notification.pause(),
                "data-test-id": "button-pause"
              },
              "Pause"
            ),
            m("button", 
              {
                className: "button",
                onclick: () => notification.resume(),
                "data-test-id": "button-resume"
              },
              "Resume"
            ),
            m("button", 
              {
                className: "button",
                onclick: () => notification.resetAll(),
                "data-test-id": "button-reset"
              },
              "Reset"
            ),
          ])
        ),
        m(".control", { "data-test-id": "is-paused" }, `Is paused: ${notification.isPaused()}`),
        m(".control", m(Remaining, { key: "NotificationPause", getRemaining: notification.getRemaining })),
        m(".content", [
          buttons({ ...fns1 }),
        ]),
        m(".spawn.default-spawn", 
          m(Notification)
        ),
      ])
    }
  }; 
};
