import m from "mithril";
import { DialogicTests } from "../";

type ButtonsProps = {
  showFn: DialogicTests.showFn;
  hideFn: DialogicTests.hideFn;
}

export const buttons = ({ showFn, hideFn }: ButtonsProps) => 
  m("div",
    { className: "buttons" },
    [
      showFn && m("button", 
        {
          className: "button",
          onclick: showFn,
          "data-test-id": "button-show"
        },
        "Show"
      ),
      hideFn && m("button", 
        {
          className: "button",
          onclick: hideFn,
          "data-test-id": "button-hide"
        },
        "Hide"
      ),
    ]
  );
