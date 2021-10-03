import m from "mithril";
import { createFns } from "./helpers/createFns";
import { Default, TDefault } from "../content/Default";
import { buttons, TButtons } from "./helpers/buttons";
import { dialog, Dialog } from "dialogic-mithril";

export default () => {
  const fns = createFns<TDefault>({
    instance: dialog,
    component: Default,
    className: "dialog-delay",
    title: "DialogClassDelay",
  }) as TButtons;

  return {
    view: () => {
      return m(".test", [buttons(fns), m(".spawn.default-spawn", m(Dialog))]);
    },
  };
};
