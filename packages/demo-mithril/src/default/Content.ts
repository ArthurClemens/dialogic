import m from "mithril"
import { Dialogic } from "dialogic";

export const Content = {
  view: ({ attrs } : { attrs: Dialogic.ContentComponentOptions }) => {
    return m("div", [
      "Content",
      m("h2", attrs.title),
      m("button",
        {
          className: "button",
          onclick: () => attrs.hide()
        },
        "Hide from component"
      )
    ]);
  }
};
