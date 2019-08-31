import m from "mithril";
import { createFns } from "./createFns";
import { Default } from "../content/Default";
import { buttons } from "./buttons";
import { dialog, Dialog } from "dialogic-mithril";
import { Remaining } from "./Remaining";

export default () => {
  const fns1 = createFns({ instance: dialog, component: Default, className: "dialog", title: "Default", timeout: 2000 });

  return {
    view: () => {
      return m(".test", [
        m(".control",
          { "data-test-id": "reset-all" }, 
          m(".buttons", [
            m("button", 
              {
                className: "button",
                onclick: () => dialog.pause(),
                "data-test-id": "button-pause"
              },
              "Pause"
            ),
            m("button", 
              {
                className: "button",
                onclick: () => dialog.resume(),
                "data-test-id": "button-resume"
              },
              "Resume"
            ),
            m("button", 
              {
                className: "button",
                onclick: () => dialog.resetAll(),
                "data-test-id": "button-reset"
              },
              "Reset"
            ),
          ])
        ),
        m(".control", { "data-test-id": "is-paused" }, `Is paused: ${dialog.isPaused()}`),
        m(".control", m(Remaining, { getRemaining: dialog.getRemaining })),
        m(".content", [
          buttons({ ...fns1 }),
        ]),
        m(".spawn.default-spawn", 
          m(Dialog)
        ),
      ])
    }
  }; 
};
