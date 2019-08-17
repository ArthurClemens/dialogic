import m from "mithril";
import { createFns } from "../data/DefaultDialog";
import { Default } from "../content/Default";
import { Dialog } from "dialogic-mithril";

export default () => {
  const { showFn, hideFn } = createFns({ component: Default });

  return {
    view: () => {
      return m(".test", [
        m("button", 
          {
            className: "button",
            onclick: showFn,
            "data-test-id": "button-show"
          },
          "Show dialog"
        ),
        m("button", 
          {
            className: "button",
            onclick: hideFn,
            "data-test-id": "button-hide"
          },
          "Hide dialog"
        ),
        m(Dialog)
      ])
    }  
  };
};
