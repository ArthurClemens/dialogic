import m from "mithril";
import { createFns } from "./helpers/createFns";
import { Default, TDefault } from "../content/Default";
import { buttons, TButtons } from "./helpers/buttons";
import { notification, Notification } from "dialogic-mithril";

export default () => {
  notification.resetAll();
  const fns1 = createFns<TDefault>({
    instance: notification,
    component: Default,
    className: "notification",
    title: "Default",
  }) as TButtons;
  const fns2 = createFns<TDefault>({
    instance: notification,
    component: Default,
    className: "notification",
    id: "1",
    title: "ID",
  }) as TButtons;
  const fns3 = createFns<TDefault>({
    instance: notification,
    component: Default,
    className: "notification",
    spawn: "1",
    title: "Spawn",
  }) as TButtons;
  const fns4 = createFns<TDefault>({
    instance: notification,
    component: Default,
    className: "notification",
    spawn: "1",
    id: "1",
    title: "Spawn and ID",
  }) as TButtons;

  return {
    view: () => {
      return m(".test", [
        m(
          ".control",
          { "data-test-id": "count-all" },
          `Count all: ${notification.getCount()}`
        ),
        m(
          ".control",
          { "data-test-id": "count-id" },
          `Count id: ${notification.getCount({ id: "1" })}`
        ),
        m(
          ".control",
          { "data-test-id": "count-spawn" },
          `Count spawn: ${notification.getCount({ spawn: "1" })}`
        ),
        m(
          ".control",
          { "data-test-id": "count-spawn-id" },
          `Count spawn, id: ${notification.getCount({ spawn: "1", id: "1" })}`
        ),
        m(
          ".control",
          m(
            "button",
            {
              className: "button",
              onclick: () => notification.resetAll(),
              "data-test-id": "button-reset",
            },
            "Reset"
          )
        ),
        m(".content", [
          buttons({ ...fns1 }),
          buttons({ ...fns2, id: "1" }),
          buttons({ ...fns3, spawn: "1" }),
          buttons({ ...fns4, spawn: "1", id: "1" }),
        ]),
        m(".spawn.default-spawn", m(Notification)),
        m(".spawn.custom-spawn", m(Notification, { spawn: "1" })),
      ]);
    },
  };
};
