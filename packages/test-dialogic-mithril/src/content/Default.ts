import m, { Component } from "mithril"
import { Dialogic } from "dialogic";

type Default = Component<Dialogic.ContentComponentOptions>;

export const Default: Default = {
  view: ({ attrs }) =>
    m("div",
      {
        className: attrs.className,
        "data-test-id": `content-default${attrs.contentId ? `-${attrs.contentId}` : ''}`
      },
      [
        m("h2", attrs.title),
        m("button",
          {
            className: "button",
            onclick: () => attrs.hide(),
            "data-test-id": "button-hide-content",
          },
          "Hide from component"
        )
      ]
    )
};
