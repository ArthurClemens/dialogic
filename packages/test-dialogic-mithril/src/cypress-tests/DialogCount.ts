import m from "mithril";
import { createFns } from "../createFns";
import { Default } from "../content/Default";
import { buttons } from "../buttons";
import { dialog, Dialog } from "dialogic-mithril";

export default () => {
  const fns1 = createFns({ instance: dialog, component: Default, className: "dialog", title: "DialogCount default" });
  const fns2 = createFns({ instance: dialog, component: Default, className: "dialog", id: "1", title: "DialogCount id" });
  const fns3 = createFns({ instance: dialog, component: Default, className: "dialog", spawn: "1", title: "DialogCount spawn" });
  const fns4 = createFns({ instance: dialog, component: Default, className: "dialog", spawn: "1", id: "1", title: "DialogCount spawn" });

  return {
    view: () => {
      return m(".test", [
        m(".count", { "data-test-id": "count-all" }, `Count all: ${dialog.getCount()}`),
        m(".count", { "data-test-id": "count-id" }, `Count id: ${dialog.getCount({ id: "1" })}`),
        m(".count", { "data-test-id": "count-spawn" }, `Count spawn: ${dialog.getCount({ spawn: "1" })}`),
        m(".count", { "data-test-id": "count-spawn-id" }, `Count spawn, id: ${dialog.getCount({ spawn: "1", id: "1" })}`),
        buttons({ ...fns1 }),
        buttons({ ...fns2, id: "1" }),
        buttons({ ...fns3, spawn: "1" }),
        buttons({ ...fns4, spawn: "1", id: "1" }),
        m(Dialog),
        m(Dialog, { spawn: "1" }),
      ])
    }
  }; 
};
