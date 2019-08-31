import m from "mithril";
import { DialogicTests } from "../";

type ButtonsProps = {
  showFn: DialogicTests.showFn;
  hideFn: DialogicTests.hideFn;
  id?: string;
  spawn?: string;
}

export const buttons = ({ showFn, hideFn, id, spawn }: ButtonsProps) => {
  const name = `${id ? `id${id}` : ''}${spawn ? `spawn${spawn}` : ''}` || "default";
  return m("div",
    { className: "buttons" },
    [
      showFn && m("button", 
        {
          className: "button",
          onclick: showFn,
          "data-test-id": `button-show-${name}`
        },
        `Show ${name}`
      ),
      hideFn && m("button", 
        {
          className: "button",
          onclick: hideFn,
          "data-test-id": `button-hide-${name}`
        },
        `Hide ${name}`
      ),
    ]
  );
};
