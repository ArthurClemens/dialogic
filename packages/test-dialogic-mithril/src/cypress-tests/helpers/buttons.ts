import { Dialogic } from "dialogic";
import m from "mithril";

export type TButtons = {
  showFn: () => Promise<Dialogic.Item>;
  hideFn: () => Promise<Dialogic.Item>;
  name?: string;
  id?: string;
  spawn?: string;
};

export const buttons = ({ showFn, hideFn, id, spawn, name }: TButtons) => {
  const genName =
    name ||
    `${id ? `id${id}` : ""}${spawn ? `spawn${spawn}` : ""}` ||
    "default";
  return m("div", { className: "buttons" }, [
    showFn &&
      m(
        "button",
        {
          className: "button primary",
          onclick: showFn,
          "data-test-id": `button-show-${genName}`,
        },
        `Show ${genName}`
      ),
    hideFn &&
      m(
        "button",
        {
          className: "button",
          onclick: hideFn,
          "data-test-id": `button-hide-${genName}`,
        },
        `Hide ${genName}`
      ),
  ]);
};
