import m from "mithril";
import { DialogicTests } from "../";

type ButtonsProps = {
  showFn: DialogicTests.showFn;
  hideFn: DialogicTests.hideFn;
  id?: string;
}

export const buttons = ({ showFn, hideFn, id }: ButtonsProps) => 
  m("div",
    { className: "buttons" },
    [
      showFn && m("button", 
        {
          className: "button",
          onclick: showFn,
          "data-test-id": `button-show${id ? `-${id}` : ''}`
        },
        "Show"
      ),
      hideFn && m("button", 
        {
          className: "button",
          onclick: hideFn,
          "data-test-id": `button-hide${id ? `-${id}` : ''}`
        },
        "Hide"
      ),
    ]
  );
