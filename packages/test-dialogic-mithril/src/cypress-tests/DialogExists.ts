import m from "mithril";
import { createFns } from "./createFns";
import { Default } from "../content/Default";
import { buttons } from "./buttons";
import { dialog, Dialog } from "dialogic-mithril";

export default () => {
  const fns1 = createFns({ instance: dialog, component: Default, className: "dialog", title: "Default" });
  const fns2 = createFns({ instance: dialog, component: Default, className: "dialog", id: "1", title: "ID" });
  const fns3 = createFns({ instance: dialog, component: Default, className: "dialog", spawn: "1", title: "Spawn" });
  const fns4 = createFns({ instance: dialog, component: Default, className: "dialog", spawn: "1", id: "1", title: "Spawn and ID" });

  return {
    view: () => {
      return m(".test", [
        m(".control", { "data-test-id": "count-all" }, `Exists any: ${dialog.exists().toString()}`),
        m(".control", { "data-test-id": "count-id" }, `Exists id: ${dialog.exists({ id: "1" }).toString()}`),
        m(".control", { "data-test-id": "count-spawn" }, `Exists spawn: ${dialog.exists({ spawn: "1" }).toString()}`),
        m(".control", { "data-test-id": "count-spawn-id" }, `Exists spawn, id: ${dialog.exists({ spawn: "1", id: "1" }).toString()}`),
        m(".content", [
          buttons({ ...fns1 }),
          buttons({ ...fns2, id: "1" }),
          buttons({ ...fns3, spawn: "1" }),
          buttons({ ...fns4, spawn: "1", id: "1" }),
        ]),
        m(".spawn.default-spawn", 
          m(Dialog)
        ),
        m(".spawn.custom-spawn", 
          m(Dialog, { spawn: "1" })
        ),
      ])
    }
  }; 
};
