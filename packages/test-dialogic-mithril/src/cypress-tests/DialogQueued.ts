import m from "mithril";
import { createFns } from "./helpers/createFns";
import { Default, TDefault } from "../content/Default";
import { buttons, TButtons } from "./helpers/buttons";
import { dialog, Dialog } from "dialogic-mithril";

export default () => {
  const fns1 = createFns<TDefault>({
    instance: dialog,
    component: Default,
    className: "dialog",
    title: "Default",
    queued: true,
  }) as TButtons;

  return {
    view: () => {
      return m(".test", [
        m(
          ".control",
          { "data-test-id": "count-all" },
          `Count all: ${dialog.getCount()}`
        ),
        m(".content", [buttons({ ...fns1 })]),
        m(".spawn.default-spawn", m(Dialog)),
      ]);
    },
  };
};
